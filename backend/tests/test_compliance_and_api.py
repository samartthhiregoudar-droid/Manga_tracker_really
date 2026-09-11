"""
Automated tests for Backend API, Copyright Compliance, and Physical Store logic.
"""

import pytest
from app.services.compliance import is_domain_whitelisted, get_compliance_badge
from app.services.physical_store import build_volume_breakdown, format_prices
from app.services.release_tracker import check_title_updates

def test_whitelist_approved_domains():
    assert is_domain_whitelisted("https://mangaplus.shueisha.co.jp/titles/100020") is True
    assert is_domain_whitelisted("https://www.viz.com/shonenjump") is True
    assert is_domain_whitelisted("https://www.webtoons.com/en/fantasy/tower-of-god") is True
    assert is_domain_whitelisted("https://www.amazon.com/dp/1421536250") is True
    assert is_domain_whitelisted("https://www.barnesandnoble.com") is True

def test_whitelist_blocks_pirate_and_unauthorized_domains():
    assert is_domain_whitelisted("https://asurascans.com/manga/test") is False
    assert is_domain_whitelisted("https://kissmanga.org/manga/123") is False
    assert is_domain_whitelisted("https://mangakakalot.com/read/abc") is False
    assert is_domain_whitelisted("https://piratemanga.net") is False

def test_compliance_badge():
    badge = get_compliance_badge("https://mangaplus.shueisha.co.jp")
    assert badge["is_whitelisted"] is True
    assert "Official Publisher" in badge["category"]

    bad_badge = get_compliance_badge("https://unauthorized-scanlation.com")
    assert bad_badge["is_whitelisted"] is False
    assert "Blocked" in bad_badge["badge"]

def test_physical_volume_breakdown():
    volumes = build_volume_breakdown("One Piece", 10, "MANGA")
    assert len(volumes) >= 10
    
    vol1 = volumes[0]
    assert vol1["volume_number"] == 1
    assert "978-" in vol1["isbn13"]
    assert "prices" in vol1
    assert "USD" in vol1["prices"]
    assert "EUR" in vol1["prices"]
    assert "JPY" in vol1["prices"]
    assert len(vol1["store_links"]) >= 3

def test_release_tracker():
    tracked = [
        {
            "id": "one-piece",
            "title": "One Piece",
            "current_read_chapter": 1100,
            "cover_image": ""
        }
    ]
    updates = check_title_updates(tracked)
    assert len(updates) == 1
    item = updates[0]
    assert item["has_new_chapter"] is True
    assert item["latest_chapter"] > 1100
    assert item["unread_count"] > 0
    assert item["notification"] is not None
    assert "One Piece" in item["notification"]["title"]
