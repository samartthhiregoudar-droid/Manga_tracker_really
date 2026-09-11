import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, X, Lock } from 'lucide-react';

export default function ComplianceModal({ onClose, sources = [] }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '680px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '28px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--verified-color)'
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Anti-Trespass & Copyright Guarantee</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Certified Legal Whitelist & Anti-Piracy Architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Policy Box */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            lineHeight: '1.6',
            color: '#e2e8f0'
          }}
        >
          <strong style={{ color: 'var(--verified-color)' }}>Zero Copyright Infringement Policy:</strong> Our crawler strictly queries certified public metadata APIs (AniList GraphQL, Google Books, Open Library) and indexes authorized digital publishers and certified physical bookstores. We strictly enforce robots.txt, block unauthorized scanlation domains, and protect creators and rightsholders.
        </div>

        {/* Blocked vs Whitelisted Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--verified-color)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px' }}>
              <CheckCircle2 size={16} /> Certified Partners
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: '1.5' }}>
              <li>MANGA Plus by SHUEISHA</li>
              <li>VIZ Media / Shonen Jump</li>
              <li>WEBTOON (Naver) & Tappytoon</li>
              <li>Amazon Books & Barnes & Noble</li>
              <li>Kinokuniya & BOOK☆WALKER</li>
            </ul>
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--rose-accent)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '8px' }}>
              <Lock size={16} /> Strictly Blocked
            </div>
            <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '18px', lineHeight: '1.5' }}>
              <li>Pirate scanlation platforms</li>
              <li>Unauthorized scraper domains</li>
              <li>Ad-bloated scraping mirrors</li>
              <li>Unlicensed raw re-hosters</li>
              <li>Non-consensual translations</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-primary"
          style={{ width: '100%', fontSize: '0.9rem', padding: '12px' }}
        >
          Got it, Close
        </button>
      </div>
    </div>
  );
}
