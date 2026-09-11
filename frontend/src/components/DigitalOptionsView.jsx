import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Globe, Tag, Sparkles, Tv, CheckCircle2, DollarSign } from 'lucide-react';

export default function DigitalOptionsView({ digitalOptions, title, isAnime = false }) {
  const [tierFilter, setTierFilter] = useState('ALL'); // 'ALL' | 'FREE' | 'PAID'

  if (!digitalOptions || digitalOptions.length === 0) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No digital licenses or streaming platforms indexed yet for this title.
      </div>
    );
  }

  const filteredOptions = digitalOptions.filter((opt) => {
    const isFree =
      opt.tier === 'FREE' ||
      (opt.pricing && (opt.pricing.toLowerCase().includes('free') || opt.pricing.toLowerCase().includes('simulpub')));
    const isPaid =
      opt.tier === 'PAID' ||
      (opt.pricing && (opt.pricing.includes('$') || opt.pricing.toLowerCase().includes('/mo') || opt.pricing.toLowerCase().includes('subscription')));

    if (tierFilter === 'FREE') return isFree;
    if (tierFilter === 'PAID') return isPaid;
    return true;
  });

  return (
    <div>
      {/* Free vs Paid Toggle Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'ALL', label: `All Options (${digitalOptions.length})` },
            { id: 'FREE', label: '🟢 Free Legal Sites' },
            { id: 'PAID', label: '⭐ Premium / Paid Sites' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTierFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: '600',
                border: tierFilter === tab.id ? '1px solid var(--primary-500)' : '1px solid var(--glass-border)',
                background: tierFilter === tab.id ? 'var(--primary-glow)' : 'var(--bg-surface-elevated)',
                color: tierFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Strictly whitelisted legal distributors only (Zero piracy)
        </span>
      </div>

      {/* Grid of Streaming / Reading Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {filteredOptions.map((opt, idx) => {
          const isFree =
            opt.tier === 'FREE' ||
            (opt.pricing && (opt.pricing.toLowerCase().includes('free') || opt.pricing.toLowerCase().includes('simulpub')));

          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                background: isFree
                  ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(16, 185, 129, 0.08) 100%)'
                  : 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(99, 102, 241, 0.08) 100%)',
                border: isFree ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Strip */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: isFree
                    ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                    : 'linear-gradient(90deg, #6366f1 0%, #f59e0b 100%)'
                }}
              />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span
                    className={`badge ${isFree ? 'badge-verified' : 'badge-digital'}`}
                    style={{ fontSize: '0.72rem' }}
                  >
                    {isFree ? '🟢 FREE LEGAL OPTION' : '⭐ PREMIUM SUBSCRIPTION'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--verified-color)', fontWeight: '600' }}>
                    Trust Score: {opt.trust_score || '100%'}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.18rem', marginBottom: '6px', color: '#ffffff' }}>
                  {opt.platform}
                </h4>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: isFree ? 'var(--verified-color)' : 'var(--gold-accent)',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}
                >
                  <Tag size={15} />
                  <span>{opt.pricing || 'Official Service'}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Globe size={14} />
                  <span>Languages / Audio: {opt.languages ? opt.languages.join(', ') : 'Japanese, English'}</span>
                </div>
              </div>

              <a
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  width: '100%',
                  textDecoration: 'none',
                  fontSize: '0.88rem',
                  padding: '10px 16px',
                  background: isFree
                    ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                    : 'var(--gradient-primary)'
                }}
              >
                <span>{isFree ? 'Watch / Read Free on' : 'Stream / Read on'} {opt.platform.split(' ')[0]}</span>
                <ExternalLink size={15} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
