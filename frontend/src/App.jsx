import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  BookmarkCheck,
  Bell,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Layers,
  ArrowLeft,
  CheckCircle2,
  Filter,
  Flame,
  Globe
} from 'lucide-react';

import CrawlerStatusStepper from './components/CrawlerStatusStepper';
import DigitalOptionsView from './components/DigitalOptionsView';
import PhysicalShoppingView from './components/PhysicalShoppingView';
import TrackerDashboard from './components/TrackerDashboard';
import NotificationCenter from './components/NotificationCenter';
import ComplianceModal from './components/ComplianceModal';
import CurrencySelector from './components/CurrencySelector';
import CrossMediaSection from './components/CrossMediaSection';
import { DEFAULT_CATALOG } from './defaultCatalog';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://omnimanga-backend.onrender.com';
const API_BASE = (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://'))
  ? rawApiUrl.replace(/\/$/, '')
  : `https://${rawApiUrl.replace(/\/$/, '')}`;

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('DISCOVER'); // 'DISCOVER' | 'TRACKER'
  const [mediumFilter, setMediumFilter] = useState('ALL'); // 'ALL' | 'MANGA' | 'MANHWA' | 'MANHUA' | 'COMIC'
  
  // Search & Catalog State (Defaults to instant showcase)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(DEFAULT_CATALOG);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [detailTab, setDetailTab] = useState('PHYSICAL'); // 'PHYSICAL' | 'DIGITAL'
  
  // Currency State (Auto-detects from locale)
  const [currency, setCurrency] = useState('USD');
  
  // Watchlist / Tracker State (Persisted in localStorage)
  const [trackedTitles, setTrackedTitles] = useState(() => {
    try {
      const saved = localStorage.getItem('omnimanga_tracked');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'one-piece',
        title: 'One Piece',
        format: 'Manga',
        current_read_chapter: 1118,
        latest_chapter: 1122,
        cover_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
        platform: 'MANGA Plus by SHUEISHA',
        official_url: 'https://mangaplus.shueisha.co.jp/titles/100020'
      },
      {
        id: 'solo-leveling',
        title: 'Solo Leveling',
        format: 'Manhwa',
        current_read_chapter: 198,
        latest_chapter: 200,
        cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
        platform: 'Tappytoon / KakaoPage',
        official_url: 'https://www.tappytoon.com'
      }
    ];
  });

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      title: '🎉 New Chapter: One Piece',
      body: 'Chapter 1122 "When the Time Comes" released legally on MANGA Plus!',
      relative_time: '2 hours ago',
      url: 'https://mangaplus.shueisha.co.jp/titles/100020'
    }
  ]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [whitelistedSources, setWhitelistedSources] = useState([]);

  // Save tracked titles to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omnimanga_tracked', JSON.stringify(trackedTitles));
    } catch (e) {}
  }, [trackedTitles]);

  // Auto-detect currency based on user locale
  useEffect(() => {
    try {
      const userLocale = navigator.language || 'en-US';
      if (userLocale.includes('GB')) setCurrency('GBP');
      else if (userLocale.includes('JP')) setCurrency('JPY');
      else if (userLocale.includes('DE') || userLocale.includes('FR') || userLocale.includes('ES') || userLocale.includes('IT')) setCurrency('EUR');
    } catch (e) {}
  }, []);

  // Fetch initial catalog / showcase
  useEffect(() => {
    fetchTitles('', mediumFilter);
    fetchSources();
  }, [mediumFilter]);

  const fetchSources = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/crawler/sources`);
      if (res.ok) {
        const data = await res.json();
        setWhitelistedSources(data.sources || []);
      }
    } catch (e) {
      console.warn('Backend sources endpoint unreachable', e);
    }
  };

  const fetchTitles = async (q, type) => {
    setIsSearching(true);
    try {
      const typeParam = type || 'ALL';
      const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}&type=${typeParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setSearchResults(data.results);
          setIsSearching(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend search unreachable, using fallback catalog', e);
    }
    
    // Resilient fallback filtering on default catalog
    const filtered = DEFAULT_CATALOG.filter(item => {
      const matchesType = !type || type === 'ALL' || item.type === type;
      if (!q) return matchesType;
      const qLower = q.toLowerCase();
      const eng = (item.title?.english || '').toLowerCase();
      const rom = (item.title?.romaji || '').toLowerCase();
      return matchesType && (eng.includes(qLower) || rom.includes(qLower));
    });
    setSearchResults(filtered);
    setIsSearching(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTitles(searchQuery, mediumFilter);
  };

  const handleSelectTitle = async (titleId) => {
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE}/api/details/${titleId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTitle(data);
        setActiveTab('DISCOVER');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setIsSearching(false);
        return;
      }
    } catch (e) {
      console.warn('Backend details error, using fallback catalog item', e);
    }
    
    // Fallback: lookup in DEFAULT_CATALOG
    const fallbackItem = DEFAULT_CATALOG.find(t => t.id === titleId) || DEFAULT_CATALOG[0];
    if (fallbackItem) {
      setSelectedTitle({
        ...fallbackItem,
        volumes_breakdown: [
          { volume_number: 1, isbn: "978-1421536255", publisher: "Official Publisher", release_date: "2023-01-15", price_cents: 999, currency: "USD", in_stock: true, shopping_links: [{ store_name: "Amazon US", url: "https://amazon.com", badge: "Official Store", price_display: "$9.99" }, { store_name: "RightStuf / Crunchyroll Store", url: "https://store.crunchyroll.com", badge: "Specialty Retailer", price_display: "$8.99" }] },
          { volume_number: 2, isbn: "978-1421536262", publisher: "Official Publisher", release_date: "2023-04-10", price_cents: 999, currency: "USD", in_stock: true, shopping_links: [{ store_name: "Amazon US", url: "https://amazon.com", badge: "Official Store", price_display: "$9.99" }] }
        ],
        related_media: [
          { id: `${fallbackItem.id}-anime`, title: fallbackItem.title, type: "ANIME", format: "TV", relation_type: "ADAPTATION", status: "RELEASING", cover_image: fallbackItem.cover_image, external_links: [{ site: "Crunchyroll", url: "https://crunchyroll.com" }] }
        ]
      });
      setActiveTab('DISCOVER');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsSearching(false);
  };

  const handleToggleTrackTitle = (titleObj) => {
    const exists = trackedTitles.some((t) => t.id === titleObj.id);
    if (exists) {
      setTrackedTitles(trackedTitles.filter((t) => t.id !== titleObj.id));
    } else {
      const titleName = titleObj.title?.english || titleObj.title?.romaji || 'Manga Title';
      const newTracked = {
        id: titleObj.id,
        title: titleName,
        format: titleObj.format || 'Manga',
        current_read_chapter: Math.max(1, (titleObj.latest_chapter || 50) - 4),
        latest_chapter: titleObj.latest_chapter || 50,
        cover_image: titleObj.cover_image,
        platform: titleObj.official_digital?.[0]?.platform || 'Official Legal Publisher',
        official_url: titleObj.official_digital?.[0]?.url || 'https://mangaplus.shueisha.co.jp'
      };
      setTrackedTitles([newTracked, ...trackedTitles]);

      // Add a notification alert
      const newNotif = {
        title: `📌 Tracked: ${titleName}`,
        body: `Now monitoring official chapter drops and volume publications for ${titleName}.`,
        relative_time: 'Just now',
        url: newTracked.official_url
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const handleUpdateProgress = (id, newCh) => {
    setTrackedTitles(
      trackedTitles.map((t) => (t.id === id ? { ...t, current_read_chapter: newCh } : t))
    );
  };

  const handleRemoveTracked = (id) => {
    setTrackedTitles(trackedTitles.filter((t) => t.id !== id));
  };

  const handleCheckUpdates = async () => {
    try {
      const payload = {
        tracked_titles: trackedTitles.map((t) => ({
          id: t.id,
          title: t.title,
          current_read_chapter: t.current_read_chapter,
          cover_image: t.cover_image
        }))
      };

      const res = await fetch(`${API_BASE}/api/tracker/check-updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const newNotifs = [];
        data.items?.forEach((item) => {
          if (item.has_new_chapter && item.notification) {
            newNotifs.push({
              title: item.notification.title,
              body: item.notification.body,
              relative_time: item.relative_time,
              url: item.official_url
            });

            // Native Browser Notification
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(item.notification.title, {
                body: item.notification.body,
                icon: item.notification.icon
              });
            }
          }
        });

        if (newNotifs.length > 0) {
          setNotifications((prev) => [...newNotifs, ...prev]);
        }
      }
    } catch (e) {
      console.warn('Update check failed', e);
    }
  };

  const handleSimulateDrop = () => {
    const demoDrops = [
      {
        title: '🎉 New Chapter: Chainsaw Man',
        body: 'Chapter 178 "Two Chainsaws" is now live legally on VIZ Shonen Jump!',
        relative_time: 'Just now',
        url: 'https://www.viz.com/shonenjump/chapters/chainsaw-man'
      },
      {
        title: '🎉 New Episode: Tower of God',
        body: 'Season 3, Ep. 208 has dropped on WEBTOON!',
        relative_time: 'Just now',
        url: 'https://www.webtoons.com/en/fantasy/tower-of-god/list?title_no=95'
      }
    ];

    const chosen = demoDrops[Math.floor(Math.random() * demoDrops.length)];
    setNotifications((prev) => [chosen, ...prev]);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(chosen.title, {
        body: chosen.body
      });
    }
  };

  const isTitleTracked = selectedTitle && trackedTitles.some((t) => t.id === selectedTitle.id);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header
        className="glass-panel"
        style={{
          position: 'sticky',
          top: '0',
          zIndex: 90,
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: 'none',
          padding: '14px 24px',
          background: 'rgba(9, 13, 22, 0.85)'
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Logo & Brand */}
          <div
            onClick={() => {
              setSelectedTitle(null);
              setActiveTab('DISCOVER');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-glow)'
              }}
            >
              <BookOpen size={22} style={{ color: '#ffffff' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  OmniManga
                </span>
                <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                  100% Legal
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Digital Reader & Hardware Shopping Hub
              </div>
            </div>
          </div>

          {/* Center Tabs: Discover vs Tracker */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
            <button
              id="tab-discover"
              onClick={() => {
                setActiveTab('DISCOVER');
              }}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'DISCOVER' ? 'var(--primary-600)' : 'transparent',
                color: activeTab === 'DISCOVER' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Sparkles size={15} />
              <span>Catalog & Search</span>
            </button>

            <button
              id="tab-tracker"
              onClick={() => setActiveTab('TRACKER')}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'TRACKER' ? 'var(--primary-600)' : 'transparent',
                color: activeTab === 'TRACKER' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all var(--transition-fast)'
              }}
            >
              <BookmarkCheck size={15} />
              <span>Manga Tracker</span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem'
                }}
              >
                {trackedTitles.length}
              </span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
            {/* Currency Auto-detect / Selector */}
            <CurrencySelector currentCurrency={currency} onCurrencyChange={setCurrency} />

            {/* Compliance Guarantee Shield Button */}
            <button
              onClick={() => setIsComplianceOpen(true)}
              className="btn-secondary"
              title="Anti-Trespass & Copyright Guarantee"
              style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'var(--verified-color)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              <ShieldCheck size={15} />
              <span>Compliance</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                id="btn-notifications"
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="btn-secondary"
                style={{ padding: '8px', position: 'relative' }}
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--rose-accent)',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 10px rgba(244, 63, 94, 0.6)'
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <NotificationCenter
                  notifications={notifications}
                  onClose={() => setIsNotifOpen(false)}
                  onClearNotifications={() => setNotifications([])}
                  onSimulateNotification={handleSimulateDrop}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '24px 20px', flex: 1 }}>
        {/* Compliance Guarantee Modal */}
        {isComplianceOpen && (
          <ComplianceModal onClose={() => setIsComplianceOpen(false)} sources={whitelistedSources} />
        )}

        {/* CRAWLER STEPPER */}
        <CrawlerStatusStepper
          crawlerTrace={selectedTitle?.crawler_trace}
          isSearching={isSearching}
        />

        {/* VIEW 1: MANGA TRACKER */}
        {activeTab === 'TRACKER' && (
          <TrackerDashboard
            trackedTitles={trackedTitles}
            onUpdateProgress={handleUpdateProgress}
            onRemoveTracked={handleRemoveTracked}
            onSelectTitle={handleSelectTitle}
            onCheckUpdates={handleCheckUpdates}
          />
        )}

        {/* VIEW 2: DISCOVER & SEARCH */}
        {activeTab === 'DISCOVER' && (
          <div>
            {/* If a title is selected, show Title Details & Dual View (Digital vs Physical Hardware) */}
            {selectedTitle ? (
              <div>
                {/* Back Button */}
                <button
                  onClick={() => setSelectedTitle(null)}
                  className="btn-secondary"
                  style={{ marginBottom: '20px', fontSize: '0.85rem' }}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Catalog Search</span>
                </button>

                {/* Title Hero Header Banner */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    marginBottom: '28px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '28px', flexWrap: 'wrap' }}>
                    {/* Cover Image */}
                    <div
                      style={{
                        width: '160px',
                        height: '240px',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-lg)',
                        background: '#1e293b'
                      }}
                    >
                      <img
                        src={selectedTitle.cover_image}
                        alt={selectedTitle.title.english || selectedTitle.title.romaji}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    {/* Meta Info */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span className="badge badge-digital">{selectedTitle.format || selectedTitle.type}</span>
                        <span className="badge badge-verified">
                          <ShieldCheck size={13} /> Whitelist Verified Legal
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--gold-accent)', fontWeight: '700' }}>
                          ★ {selectedTitle.rating}% Score
                        </span>
                      </div>

                      <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>
                        {selectedTitle.title.english || selectedTitle.title.romaji}
                      </h1>

                      {selectedTitle.title.native && (
                        <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                          {selectedTitle.title.native} • {selectedTitle.title.romaji}
                        </div>
                      )}

                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                        Author / Creators: <strong style={{ color: '#ffffff' }}>{selectedTitle.author || 'Official Artist'}</strong>
                      </div>

                      <p
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          color: '#cbd5e1',
                          marginBottom: '20px',
                          maxHeight: '80px',
                          overflowY: 'auto'
                        }}
                      >
                        {selectedTitle.synopsis}
                      </p>

                      {/* Track Button */}
                      <button
                        id="btn-track-title"
                        onClick={() => handleToggleTrackTitle(selectedTitle)}
                        className="btn-primary"
                        style={{
                          background: isTitleTracked ? 'rgba(16, 185, 129, 0.2)' : 'var(--gradient-primary)',
                          border: isTitleTracked ? '1px solid var(--verified-color)' : 'none',
                          color: isTitleTracked ? 'var(--verified-color)' : '#ffffff'
                        }}
                      >
                        <BookmarkCheck size={18} />
                        <span>{isTitleTracked ? '✓ In Your Manga Tracker' : 'Track This Title for Updates'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cross-Media Relations Section (Manga ↔ Anime ↔ Light Novel) */}
                <CrossMediaSection
                  relatedMedia={selectedTitle.related_media}
                  onSelectTitle={handleSelectTitle}
                />

                {/* Sub-Tabs: Physical Shopping vs Digital Options */}
                <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '24px' }}>
                  <button
                    id="tab-physical-volumes"
                    onClick={() => setDetailTab('PHYSICAL')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: detailTab === 'PHYSICAL' ? 'var(--gold-accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderBottom: detailTab === 'PHYSICAL' ? '2px solid var(--gold-accent)' : 'none'
                    }}
                  >
                    <ShoppingBag size={20} />
                    <span>
                      {selectedTitle.type === 'ANIME' ? 'Hardware Form: Blu-ray & DVD Box Sets' : 'Hardware Form: Physical Volumes'} ({selectedTitle.physical_volumes?.length || 0})
                    </span>
                  </button>

                  <button
                    id="tab-digital-options"
                    onClick={() => setDetailTab('DIGITAL')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      color: detailTab === 'DIGITAL' ? 'var(--blue-accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderBottom: detailTab === 'DIGITAL' ? '2px solid var(--blue-accent)' : 'none'
                    }}
                  >
                    <BookOpen size={20} />
                    <span>
                      {selectedTitle.type === 'ANIME' ? 'Streaming Platforms (Free & Premium)' : 'Official Digital Readers'} ({selectedTitle.official_digital?.length || 0})
                    </span>
                  </button>
                </div>

                {/* Tab Views */}
                {detailTab === 'PHYSICAL' ? (
                  <PhysicalShoppingView
                    volumes={selectedTitle.physical_volumes}
                    currency={currency}
                  />
                ) : (
                  <DigitalOptionsView
                    digitalOptions={selectedTitle.official_digital}
                    title={selectedTitle.title.english || selectedTitle.title.romaji}
                    isAnime={selectedTitle.type === 'ANIME'}
                  />
                )}
              </div>
            ) : (
              /* Search Hero & Catalog Browser */
              <div>
                {/* Hero Search Box */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '36px 24px',
                    textAlign: 'center',
                    marginBottom: '32px',
                    background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)'
                  }}
                >
                  <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>
                    Find Legal Options for Any Title
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto', fontSize: '0.95rem' }}>
                    Search Manga, Manhwa, Manhua, and Western Comics. Compare verified legal digital simulpubs with physical book & volume hardware pricing.
                  </p>

                  {/* Search Bar Form */}
                  <form onSubmit={handleSearchSubmit} style={{ maxWidth: '650px', margin: '0 auto 20px auto', display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        id="main-search-input"
                        type="text"
                        placeholder="Search One Piece, Solo Leveling, Tower of God, Saga..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px 16px 14px 48px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: 'var(--radius-md)',
                          color: '#ffffff',
                          fontSize: '1rem',
                          outline: 'none',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      />
                    </div>
                    <button id="search-submit-btn" type="submit" className="btn-primary" style={{ padding: '0 24px' }}>
                      <span>Search</span>
                    </button>
                  </form>

                  {/* Category Filter Pills */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'ALL', label: 'All Formats' },
                      { id: 'ANIME', label: '🎬 Anime (Free & Paid)' },
                      { id: 'MANGA', label: '🇯🇵 Japanese Manga' },
                      { id: 'MANHWA', label: '🇰🇷 Korean Manhwa' },
                      { id: 'MANHUA', label: '🇨🇳 Chinese Manhua' },
                      { id: 'COMIC', label: '🇺🇸 Western Comics' },
                      { id: 'LIGHT_NOVEL', label: '📖 Light Novels' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setMediumFilter(f.id);
                        }}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          border: mediumFilter === f.id ? '1px solid var(--primary-500)' : '1px solid var(--glass-border)',
                          background: mediumFilter === f.id ? 'var(--primary-glow)' : 'rgba(255, 255, 255, 0.04)',
                          color: mediumFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Catalog Grid */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                  <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={20} style={{ color: 'var(--rose-accent)' }} />
                    <span>Popular & Verified Titles ({searchResults.length})</span>
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Click any title to compare digital readers & physical volume editions
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                  {searchResults.map((titleItem) => {
                    const titleName = titleItem.title.english || titleItem.title.romaji;
                    const isTracked = trackedTitles.some((t) => t.id === titleItem.id);

                    return (
                      <div
                        key={titleItem.id}
                        className="glass-panel"
                        style={{
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                        }}
                        onClick={() => handleSelectTitle(titleItem.id)}
                      >
                        <div>
                          <div
                            style={{
                              width: '100%',
                              height: '280px',
                              borderRadius: 'var(--radius-md)',
                              overflow: 'hidden',
                              marginBottom: '12px',
                              boxShadow: 'var(--shadow-md)',
                              background: '#1e293b'
                            }}
                          >
                            <img
                              src={titleItem.cover_image}
                              alt={titleName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80';
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span className="badge badge-digital" style={{ fontSize: '0.65rem' }}>
                              {titleItem.format || titleItem.type}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gold-accent)', fontWeight: '700' }}>
                              ★ {titleItem.rating}%
                            </span>
                          </div>

                          <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '4px', lineHeight: '1.3' }}>
                            {titleName}
                          </h4>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            {titleItem.author || 'Official Author'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button
                            className="btn-primary"
                            style={{ flex: 1, fontSize: '0.78rem', padding: '8px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTitle(titleItem.id);
                            }}
                          >
                            <ShoppingBag size={14} />
                            <span>View Options</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTrackTitle(titleItem);
                            }}
                            className="btn-secondary"
                            style={{
                              padding: '8px 10px',
                              color: isTracked ? 'var(--verified-color)' : 'var(--text-secondary)',
                              borderColor: isTracked ? 'var(--verified-color)' : 'var(--glass-border)'
                            }}
                            title="Add to Manga Tracker"
                          >
                            <BookmarkCheck size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        className="glass-panel"
        style={{
          borderRadius: 0,
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          padding: '24px 20px',
          marginTop: '40px',
          background: 'rgba(9, 13, 22, 0.9)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} style={{ color: 'var(--verified-color)' }} />
            <span>Anti-Trespass Verified: Strictly certified legal APIs, official publishers & authorized bookstores.</span>
          </div>
          <div>
            <span>Supporting Official Creators & Legal Platforms • Manga, Manhwa, Manhua, Comics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
