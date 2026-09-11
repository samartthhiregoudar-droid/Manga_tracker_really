"""
Copyright and Legal Compliance Service.
Enforces a strict domain whitelist of verified legal publishers, licensed digital distributors,
and official retail stores. Blocks all unauthorized or piracy scanlation domains.
"""

from urllib.parse import urlparse
from typing import Dict, Optional, List

WHITELISTED_DOMAINS: Dict[str, Dict[str, str]] = {
    # Official Digital Platforms & Publishers
    "mangaplus.shueisha.co.jp": {
        "name": "MANGA Plus by SHUEISHA",
        "category": "Official Publisher",
        "badge": "Verified Official Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#e50914"
    },
    "viz.com": {
        "name": "VIZ Media / Shonen Jump",
        "category": "Official Publisher",
        "badge": "Verified Official Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#c40000"
    },
    "webtoons.com": {
        "name": "WEBTOON (NAVER)",
        "category": "Official Platform",
        "badge": "Verified Official Platform",
        "type": "digital",
        "trust_score": "100%",
        "color": "#00d564"
    },
    "tappytoon.com": {
        "name": "Tappytoon",
        "category": "Official Licensed Distributor",
        "badge": "Licensed Distributor",
        "type": "digital",
        "trust_score": "100%",
        "color": "#ff5000"
    },
    "lezhin.com": {
        "name": "Lezhin Comics",
        "category": "Official Platform",
        "badge": "Verified Official Platform",
        "type": "digital",
        "trust_score": "100%",
        "color": "#ec1c24"
    },
    "crunchyroll.com": {
        "name": "Crunchyroll (Free & Premium)",
        "category": "Official Anime Streaming",
        "badge": "Official Free & Premium Streaming",
        "type": "streaming_digital",
        "trust_score": "100%",
        "color": "#f47521"
    },
    "hidive.com": {
        "name": "HIDIVE (Sentai Filmworks)",
        "category": "Official Anime Streaming",
        "badge": "Official Premium Streaming",
        "type": "streaming",
        "trust_score": "100%",
        "color": "#00b2e3"
    },
    "retrocrush.tv": {
        "name": "RetroCrush (Free Legal Anime)",
        "category": "Official Free Streaming",
        "badge": "100% Free Legal Streaming",
        "type": "streaming_free",
        "trust_score": "100%",
        "color": "#e63946"
    },
    "tubitv.com": {
        "name": "Tubi TV Anime (Free Legal)",
        "category": "Official Free Streaming",
        "badge": "100% Free Ad-Supported",
        "type": "streaming_free",
        "trust_score": "100%",
        "color": "#2a9d8f"
    },
    "youtube.com": {
        "name": "YouTube (Muse Asia & Ani-One Official Free)",
        "category": "Official Free Streaming Channels",
        "badge": "Official Free Simulcast",
        "type": "streaming_free",
        "trust_score": "100%",
        "color": "#ff0000"
    },
    "netflix.com": {
        "name": "Netflix Anime",
        "category": "Official Premium Streaming",
        "badge": "Official Premium Streaming",
        "type": "streaming_paid",
        "trust_score": "100%",
        "color": "#e50914"
    },
    "hulu.com": {
        "name": "Hulu / Disney+ Anime",
        "category": "Official Premium Streaming",
        "badge": "Official Premium Streaming",
        "type": "streaming_paid",
        "trust_score": "100%",
        "color": "#1ce783"
    },
    "kodansha.us": {
        "name": "Kodansha USA",
        "category": "Official Publisher",
        "badge": "Verified Official Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#0d3b66"
    },
    "yenpress.com": {
        "name": "Yen Press",
        "category": "Official Publisher",
        "badge": "Verified Official Publisher",
        "type": "digital_physical",
        "trust_score": "100%",
        "color": "#1f7a8c"
    },
    "sevenseasentertainment.com": {
        "name": "Seven Seas Entertainment / Airship",
        "category": "Official Publisher",
        "badge": "Verified Official Publisher",
        "type": "digital_physical",
        "trust_score": "100%",
        "color": "#2a9d8f"
    },
    "j-novel.club": {
        "name": "J-Novel Club",
        "category": "Official Light Novel Publisher",
        "badge": "Verified LN Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#00a896"
    },
    "global.bookwalker.jp": {
        "name": "BOOK☆WALKER Global",
        "category": "Official Digital Store",
        "badge": "Authorized Digital Store",
        "type": "digital",
        "trust_score": "100%",
        "color": "#0088cc"
    },
    "marvel.com": {
        "name": "Marvel Unlimited",
        "category": "Official Comics Platform",
        "badge": "Official Comics Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#ed1d24"
    },
    "dc.com": {
        "name": "DC Universe Infinite",
        "category": "Official Comics Platform",
        "badge": "Official Comics Publisher",
        "type": "digital",
        "trust_score": "100%",
        "color": "#0076ce"
    },
    "imagecomics.com": {
        "name": "Image Comics",
        "category": "Official Comics Publisher",
        "badge": "Official Comics Publisher",
        "type": "digital_physical",
        "trust_score": "100%",
        "color": "#222222"
    },
    "mangadex.org": {
        "name": "MangaDex (Official Tracker/Pub Links)",
        "category": "Open Aggregator & Indexer",
        "badge": "Certified Public Metadata",
        "type": "metadata",
        "trust_score": "95%",
        "color": "#ff6740"
    },
    "anilist.co": {
        "name": "AniList Legal Directory",
        "category": "Public Anime/Manga Database",
        "badge": "Certified Public Metadata",
        "type": "metadata",
        "trust_score": "100%",
        "color": "#3db4f2"
    },

    # Official Physical / Hardware Retailers
    "amazon.com": {
        "name": "Amazon Books",
        "category": "Certified Physical Retailer",
        "badge": "Authorized Hardware/Physical Store",
        "type": "physical",
        "trust_score": "100%",
        "color": "#ff9900"
    },
    "barnesandnoble.com": {
        "name": "Barnes & Noble",
        "category": "Certified Physical Retailer",
        "badge": "Authorized Hardware/Physical Store",
        "type": "physical",
        "trust_score": "100%",
        "color": "#005537"
    },
    "kinokuniya.com": {
        "name": "Kinokuniya Books",
        "category": "Certified Physical Retailer",
        "badge": "Authorized Manga Bookstore",
        "type": "physical",
        "trust_score": "100%",
        "color": "#002868"
    },
    "store.crunchyroll.com": {
        "name": "Crunchyroll Store (formerly RightStuf)",
        "category": "Official Physical Retailer",
        "badge": "Authorized Manga Bookstore",
        "type": "physical",
        "trust_score": "100%",
        "color": "#f47521"
    },
    "books.google.com": {
        "name": "Google Books",
        "category": "Official Book Index",
        "badge": "Certified Public Metadata",
        "type": "metadata_store",
        "trust_score": "100%",
        "color": "#4285f4"
    },
    "openlibrary.org": {
        "name": "Open Library (Internet Archive)",
        "category": "Public Library Database",
        "badge": "Certified Open Library",
        "type": "metadata",
        "trust_score": "100%",
        "color": "#e1ad01"
    }
}

# Blacklisted/Disallowed pirate platforms and scraper patterns
DISALLOWED_PATTERNS = [
    "pirate", "scanlation", "mangafreak", "mangarock", "kissmanga", 
    "readmanga", "mangakakalot", "manganelo", "1stkiss", "asurascans", 
    "reaperscans", "flamecomics", "voidscans"
]

def clean_domain(url: str) -> str:
    """Extract and normalize hostname from URL."""
    try:
        parsed = urlparse(url)
        domain = parsed.netloc.lower()
        if domain.startswith("www."):
            domain = domain[4:]
        return domain
    except Exception:
        return ""

def is_domain_whitelisted(url: str) -> bool:
    """Check if URL belongs to an approved whitelisted domain."""
    domain = clean_domain(url)
    if not domain:
        return False
        
    for disallowed in DISALLOWED_PATTERNS:
        if disallowed in domain:
            return False

    for approved in WHITELISTED_DOMAINS.keys():
        if domain == approved or domain.endswith("." + approved):
            return True
            
    return False

def get_compliance_badge(url: str) -> Dict[str, str]:
    """Retrieve compliance and verified badge information for a given URL."""
    domain = clean_domain(url)
    
    for approved, info in WHITELISTED_DOMAINS.items():
        if domain == approved or domain.endswith("." + approved):
            return {
                "domain": domain,
                "is_whitelisted": True,
                "name": info["name"],
                "category": info["category"],
                "badge": info["badge"],
                "trust_score": info["trust_score"],
                "badge_color": info["color"],
                "type": info["type"],
                "notice": "Strictly whitelisted & copyright-compliant official partner."
            }

    return {
        "domain": domain,
        "is_whitelisted": False,
        "name": domain,
        "category": "Unverified Third-Party",
        "badge": "Blocked / Non-Whitelisted",
        "trust_score": "0%",
        "badge_color": "#dc2626",
        "type": "unknown",
        "notice": "Access blocked under anti-trespass and copyright compliance policy."
    }

def get_all_whitelisted_sources() -> List[Dict[str, str]]:
    """Return all verified legal sources with descriptions."""
    results = []
    for domain, info in WHITELISTED_DOMAINS.items():
        results.append({
            "domain": domain,
            "name": info["name"],
            "category": info["category"],
            "badge": info["badge"],
            "trust_score": info["trust_score"],
            "color": info["color"],
            "type": info["type"]
        })
    return results
