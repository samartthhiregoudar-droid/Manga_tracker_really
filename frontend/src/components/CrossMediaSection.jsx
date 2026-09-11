import React from 'react';
import { ExternalLink, Play, BookOpen, Bookmark, Film, Tv, Star, ArrowRight } from 'lucide-react';

/**
 * CrossMediaSection — Displays cross-media relations (manga↔anime↔light novel)
 * for a given title. Shows clickable cards with cover art, format badges, and 
 * relation type labels. Clicking navigates to the related title's detail page.
 */

const FORMAT_STYLES = {
  ANIME: {
    color: '#a78bfa',
    bgColor: 'rgba(167, 139, 250, 0.12)',
    borderColor: 'rgba(167, 139, 250, 0.3)',
    icon: Tv,
    label: '🎬 Anime'
  },
  MANGA: {
    color: '#fb7185',
    bgColor: 'rgba(251, 113, 133, 0.12)',
    borderColor: 'rgba(251, 113, 133, 0.3)',
    icon: BookOpen,
    label: '📕 Manga'
  },
  LIGHT_NOVEL: {
    color: '#fbbf24',
    bgColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
    icon: Bookmark,
    label: '📖 Light Novel'
  },
  MANHWA: {
    color: '#2dd4bf',
    bgColor: 'rgba(45, 212, 191, 0.12)',
    borderColor: 'rgba(45, 212, 191, 0.3)',
    icon: BookOpen,
    label: '🇰🇷 Manhwa'
  },
  MANHUA: {
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    icon: BookOpen,
    label: '🇨🇳 Manhua'
  },
  COMIC: {
    color: '#4ade80',
    bgColor: 'rgba(74, 222, 128, 0.12)',
    borderColor: 'rgba(74, 222, 128, 0.3)',
    icon: BookOpen,
    label: '🇺🇸 Comic'
  }
};

const RELATION_LABELS = {
  ADAPTATION: { label: 'Adaptation', color: '#818cf8' },
  SOURCE: { label: 'Source Material', color: '#fbbf24' },
  PREQUEL: { label: 'Prequel', color: '#34d399' },
  SEQUEL: { label: 'Sequel', color: '#34d399' },
  SIDE_STORY: { label: 'Side Story', color: '#f472b6' },
  ALTERNATIVE: { label: 'Alternative', color: '#94a3b8' },
  SPIN_OFF: { label: 'Spin-Off', color: '#fb923c' },
  PARENT: { label: 'Parent Story', color: '#a78bfa' },
  COMPILATION: { label: 'Compilation', color: '#94a3b8' },
  OTHER: { label: 'Related', color: '#94a3b8' }
};

export default function CrossMediaSection({ relatedMedia, onSelectTitle }) {
  if (!relatedMedia || relatedMedia.length === 0) return null;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%)'
      }}
    >
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(129, 140, 248, 0.3)'
            }}
          >
            <Film size={18} style={{ color: '#fff' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', margin: 0 }}>
              Related Adaptations
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              This title also exists as {relatedMedia.length} other media format{relatedMedia.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <span
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'rgba(255,255,255,0.05)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--glass-border)'
          }}
        >
          Cross-Media • Real Data
        </span>
      </div>

      {/* Scrollable Card Strip */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollSnapType: 'x mandatory'
        }}
      >
        {relatedMedia.map((item, idx) => {
          const formatStyle = FORMAT_STYLES[item.type] || FORMAT_STYLES.MANGA;
          const relationInfo = RELATION_LABELS[item.relation_type] || RELATION_LABELS.OTHER;
          const FormatIcon = formatStyle.icon;
          const titleName = item.title?.english || item.title?.romaji || 'Unknown Title';
          const hasStreaming = item.streaming && item.streaming.length > 0;
          const freeStream = item.streaming?.find(s => s.tier === 'FREE');

          return (
            <div
              key={item.id || idx}
              onClick={() => onSelectTitle && onSelectTitle(item.id)}
              style={{
                minWidth: '240px',
                maxWidth: '260px',
                flexShrink: 0,
                scrollSnapAlign: 'start',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${formatStyle.borderColor}`,
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${formatStyle.bgColor}`;
                e.currentTarget.style.borderColor = formatStyle.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = formatStyle.borderColor;
              }}
            >
              {/* Cover Image */}
              <div style={{ width: '100%', height: '160px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={item.cover_image}
                  alt={titleName}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80';
                  }}
                />
                {/* Gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '60px',
                    background: 'linear-gradient(transparent, rgba(15, 23, 42, 0.95))'
                  }}
                />
                {/* Relation Type Badge - top left */}
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: `${relationInfo.color}22`,
                    color: relationInfo.color,
                    border: `1px solid ${relationInfo.color}44`,
                    backdropFilter: 'blur(6px)',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase'
                  }}
                >
                  {relationInfo.label}
                </span>
                {/* Rating badge - top right */}
                {item.rating > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '3px 7px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'var(--gold-accent)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Star size={10} fill="currentColor" /> {item.rating}%
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div style={{ padding: '12px 14px' }}>
                {/* Format Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: formatStyle.bgColor,
                      color: formatStyle.color,
                      border: `1px solid ${formatStyle.borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FormatIcon size={11} />
                    {formatStyle.label}
                  </span>
                  {item.format && item.format !== item.type && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {item.format}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    marginBottom: '4px',
                    color: '#f1f5f9',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {titleName}
                </h4>

                {/* Episode/Chapter count */}
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {item.episodes && `${item.episodes} Episodes`}
                  {item.chapters && `${item.chapters} Chapters`}
                  {!item.episodes && !item.chapters && (
                    <span style={{ textTransform: 'capitalize' }}>{(item.status || 'Unknown').toLowerCase().replace('_', ' ')}</span>
                  )}
                </div>

                {/* Streaming/Reading Quick Link */}
                {hasStreaming && (
                  <a
                    href={freeStream?.url || item.streaming[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '0.72rem',
                      fontWeight: '600',
                      color: freeStream ? '#34d399' : '#818cf8',
                      textDecoration: 'none',
                      padding: '5px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: freeStream ? 'rgba(52, 211, 153, 0.1)' : 'rgba(129, 140, 248, 0.1)',
                      border: `1px solid ${freeStream ? 'rgba(52, 211, 153, 0.2)' : 'rgba(129, 140, 248, 0.2)'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {item.type === 'ANIME' ? <Play size={12} /> : <BookOpen size={12} />}
                    <span>{freeStream ? `Free on ${freeStream.platform}` : `${item.streaming[0]?.platform}`}</span>
                    <ExternalLink size={10} style={{ marginLeft: 'auto', opacity: 0.6 }} />
                  </a>
                )}

                {/* View Details Arrow */}
                {!hasStreaming && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      color: formatStyle.color,
                      fontWeight: '600'
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
