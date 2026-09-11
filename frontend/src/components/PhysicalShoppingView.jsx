import React, { useState } from 'react';
import { ShoppingCart, ExternalLink, Copy, Check, BookOpen, Layers, Sparkles, Filter } from 'lucide-react';

export default function PhysicalShoppingView({ volumes, currency = 'USD' }) {
  const [copiedIsbn, setCopiedIsbn] = useState(null);
  const [formatFilter, setFormatFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!volumes || volumes.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No physical volume editions found for this title.
      </div>
    );
  }

  const handleCopyIsbn = (isbn) => {
    navigator.clipboard.writeText(isbn);
    setCopiedIsbn(isbn);
    setTimeout(() => setCopiedIsbn(null), 2000);
  };

  const filteredVolumes = volumes.filter((vol) => {
    const matchesFormat =
      formatFilter === 'ALL' ||
      (formatFilter === 'BOX_SET' && vol.format.toLowerCase().includes('box set')) ||
      (formatFilter === 'HARDCOVER' && vol.format.toLowerCase().includes('hardcover')) ||
      (formatFilter === 'PAPERBACK' && vol.format.toLowerCase().includes('paperback'));

    const matchesSearch =
      vol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(vol.volume_number).toLowerCase().includes(searchQuery.toLowerCase()) ||
      vol.isbn13.includes(searchQuery);

    return matchesFormat && matchesSearch;
  });

  return (
    <div>
      {/* Controls Bar: Search volume & Filter format */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: `All Volumes (${volumes.length})` },
            { id: 'PAPERBACK', label: 'Paperbacks' },
            { id: 'HARDCOVER', label: 'Hardcover Editions' },
            { id: 'BOX_SET', label: 'Deluxe Box Sets' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                border: formatFilter === f.id ? '1px solid var(--primary-500)' : '1px solid var(--glass-border)',
                background: formatFilter === f.id ? 'var(--primary-glow)' : 'var(--bg-surface-elevated)',
                color: formatFilter === f.id ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter volumes or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            padding: '8px 14px',
            fontSize: '0.85rem',
            minWidth: '220px',
            outline: 'none'
          }}
        />
      </div>

      {/* Volumes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredVolumes.map((vol, idx) => {
          const priceObj = vol.prices?.[currency] || vol.prices?.['USD'] || { formatted: '$11.99' };
          const isBoxSet = vol.format.toLowerCase().includes('box set');

          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: isBoxSet
                  ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(245, 158, 11, 0.08) 100%)'
                  : 'rgba(30, 41, 59, 0.6)',
                border: isBoxSet ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {/* Header: Cover + Info */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div
                  style={{
                    width: '90px',
                    height: '130px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    boxShadow: 'var(--shadow-md)',
                    background: '#1e293b'
                  }}
                >
                  <img
                    src={vol.cover_image}
                    alt={vol.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span className={`badge ${isBoxSet ? 'badge-hardware' : 'badge-digital'}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {vol.badge || vol.format}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px', lineHeight: '1.3' }}>
                    {vol.title}
                  </h4>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Publisher: <strong style={{ color: 'var(--text-primary)' }}>{vol.publisher}</strong>
                  </div>

                  {/* Price Tag */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--gold-accent)', fontFamily: 'var(--font-heading)' }}>
                      {priceObj.formatted}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Retail</span>
                  </div>
                </div>
              </div>

              {/* Hardware Specs & ISBN */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '14px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>ISBN-13:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '600', color: '#cbd5e1' }}>{vol.isbn13}</span>
                    <button
                      onClick={() => handleCopyIsbn(vol.isbn13)}
                      title="Copy ISBN"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedIsbn === vol.isbn13 ? 'var(--verified-color)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '2px'
                      }}
                    >
                      {copiedIsbn === vol.isbn13 ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Specs:</span>
                  <span style={{ color: '#cbd5e1' }}>{vol.page_count} pages • {vol.dimensions}</span>
                </div>
              </div>

              {/* Storefront Buying Options */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingCart size={12} /> Authorized Retailers
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {vol.store_links?.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{
                        fontSize: '0.75rem',
                        padding: '6px 10px',
                        justifyContent: 'space-between',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {link.store.split(' ')[0]}
                      </span>
                      <ExternalLink size={12} style={{ flexShrink: 0, opacity: 0.7 }} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
