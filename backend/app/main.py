"""
FastAPI Server for Legal Manga/Manhwa/Manhua/Comics Aggregator & Physical Shopping.
"""

from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

from .services.aggregator import search_titles, get_title_details
from .services.compliance import get_all_whitelisted_sources, is_domain_whitelisted
from .services.release_tracker import check_title_updates, get_latest_global_releases

app = FastAPI(
    title="Legal Manga Aggregator & Hardware Shopping API",
    description="Compliant legal aggregator indexing official digital platforms and physical volume shopping options.",
    version="1.0.0"
)

# Enable CORS for the Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TrackedItem(BaseModel):
    id: str
    title: str
    current_read_chapter: float = 0.0
    cover_image: Optional[str] = None

class TrackerCheckRequest(BaseModel):
    tracked_titles: List[TrackedItem]

@app.get("/")
def root():
    return {
        "message": "Welcome to OmniManga Legal Aggregator & Cross-Media API",
        "docs_url": "/docs",
        "health_check": "/api/health",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "Manga Legal Aggregator & Hardware Shopping API",
        "compliance": "Strict Anti-Trespass & Copyright Whitelist Active"
    }

@app.get("/api/search")
async def search_endpoint(
    q: Optional[str] = Query(None, description="Search query string"),
    type: Optional[str] = Query("ALL", description="Medium filter: ALL, MANGA, MANHWA, MANHUA, COMIC")
):
    """
    Search endpoint returning legal options for manga, manhwa, manhua, or comics.
    Includes in-memory LRU caching and AniList live query.
    """
    results = await search_titles(query=q or "", medium_filter=type)
    return {
        "query": q,
        "type": type,
        "count": len(results),
        "results": results
    }

@app.get("/api/details/{title_id}")
async def details_endpoint(title_id: str):
    """
    Retrieve full details for a title, including legal digital options,
    volume-by-volume physical shopping options with ISBNs, and crawler progress trace.
    """
    details = await get_title_details(title_id)
    if not details:
        raise HTTPException(status_code=404, detail="Title not found.")
    return details

@app.get("/api/crawler/sources")
def whitelisted_sources_endpoint():
    """
    List all authorized whitelisted legal publishers, platforms, and physical bookstores.
    """
    sources = get_all_whitelisted_sources()
    return {
        "total_sources": len(sources),
        "policy": "Strict Copyright Compliance & Anti-Trespass Verified",
        "sources": sources
    }

@app.post("/api/tracker/check-updates")
def tracker_check_endpoint(request: TrackerCheckRequest):
    """
    Check for latest chapter updates on user-tracked titles.
    Computes unread chapter counts and returns notification alert payloads.
    """
    items_dict = [item.dict() for item in request.tracked_titles]
    updates = check_title_updates(items_dict)
    
    unread_total = sum(u["unread_count"] for u in updates)
    new_release_titles = [u["title"] for u in updates if u["has_new_chapter"]]
    
    return {
        "total_tracked": len(items_dict),
        "total_unread_chapters": unread_total,
        "updated_titles_count": len(new_release_titles),
        "items": updates
    }

@app.get("/api/releases/latest")
def latest_releases_endpoint():
    """
    Return recent official legal chapter releases across all platforms.
    """
    releases = get_latest_global_releases()
    return {
        "count": len(releases),
        "releases": releases
    }
