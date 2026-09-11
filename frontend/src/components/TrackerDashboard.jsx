import React from 'react';
import { BookmarkCheck, Plus, CheckCircle, ExternalLink, Trash2, ArrowRight, Bell, Sparkles } from 'lucide-react';

export default function TrackerDashboard({
  trackedTitles,
  onUpdateProgress,
  onRemoveTracked,
  onSelectTitle,
  onCheckUpdates
}) {
  if (!trackedTitles || trackedTitles.length === 0) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            color: 'var(--primary-500)'
          }}
        >
          <BookmarkCheck size={32} />
        </div>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Your Manga Tracker is Empty</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Search for your favorite Manga, Manhwa, Manhua, or Comics and click "Track Title" to monitor chapter updates and receive live release notifications.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookmarkCheck style={{ color: 'var(--primary-500)' }} />
            <span>Tracked Titles ({trackedTitles.length})</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Live monitoring for official chapter drops and legal release updates
          </p>
        </div>

        <button
          onClick={onCheckUpdates}
          className="btn-secondary"
          style={{ fontSize: '0.85rem' }}
        >
          <Bell size={15} style={{ color: 'var(--alert-accent)' }} />
          <span>Check for Updates</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {trackedTitles.map((item) => {
          const currentCh = Number(item.current_read_chapter || 0);
          const latestCh = Number(item.latest_chapter || currentCh + 2);
          const unreadCount = Math.max(0, latestCh - currentCh);
          const isUpToDate = unreadCount === 0;

          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(30, 41, 59, 0.7)',
                position: 'relative'
              }}
            >
              {unreadCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'var(--rose-accent)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)'
                  }}
                >
                  {unreadCount} New Chapter{unreadCount > 1 ? 's' : ''}!
                </div>
              )}

              <div>
                <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '70px',
                      height: '100px',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      flexShrink: 0,
                      cursor: 'pointer'
                    }}
                    onClick={() => onSelectTitle(item.id)}
                  >
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0, paddingRight: unreadCount > 0 ? '70px' : '0' }}>
                    <span className="badge badge-digital" style={{ fontSize: '0.65rem', marginBottom: '4px' }}>
                      {item.format || 'Manga'}
                    </span>
                    <h4
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: '1.3',
                        cursor: 'pointer',
                        color: '#f8fafc'
                      }}
                      onClick={() => onSelectTitle(item.id)}
                    >
                      {item.title}
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Platform: <strong style={{ color: 'var(--text-secondary)' }}>{item.platform || 'Legal Publisher'}</strong>
                    </div>
                  </div>
                </div>

                {/* Progress bar & counters */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '14px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Read: <strong style={{ color: '#ffffff' }}>Ch. {currentCh}</strong>
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Latest: <strong style={{ color: 'var(--text-highlight)' }}>Ch. {latestCh}</strong>
                    </span>
                  </div>

                  {/* Visual progress bar */}
                  <div
                    style={{
                      height: '6px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      overflow: 'hidden',
                      marginBottom: '10px'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.round((currentCh / (latestCh || 1)) * 100))}%`,
                        background: isUpToDate ? 'var(--verified-color)' : 'var(--gradient-primary)',
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Progress action controls */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => onUpdateProgress(item.id, currentCh + 1)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        fontSize: '0.78rem',
                        padding: '6px 10px'
                      }}
                    >
                      <Plus size={13} />
                      <span>+1 Chapter</span>
                    </button>

                    <button
                      onClick={() => onUpdateProgress(item.id, latestCh)}
                      disabled={isUpToDate}
                      style={{
                        flex: 1,
                        fontSize: '0.78rem',
                        padding: '6px 10px',
                        background: isUpToDate ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--glass-border)',
                        color: isUpToDate ? 'var(--verified-color)' : 'var(--text-primary)',
                        borderRadius: 'var(--radius-md)',
                        cursor: isUpToDate ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={13} />
                      <span>{isUpToDate ? 'Up to Date' : 'Mark Current'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => onRemoveTracked(item.id)}
                  title="Remove from tracker"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Untrack</span>
                </button>

                {item.official_url && (
                  <a
                    href={item.official_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      fontSize: '0.78rem',
                      padding: '6px 12px'
                    }}
                  >
                    <span>Read Latest</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
