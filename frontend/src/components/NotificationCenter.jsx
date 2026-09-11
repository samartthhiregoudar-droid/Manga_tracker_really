import React, { useState, useEffect } from 'react';
import { Bell, BellRing, ExternalLink, Check, Sparkles, X, ShieldAlert } from 'lucide-react';

export default function NotificationCenter({
  notifications = [],
  onClose,
  onClearNotifications,
  onSimulateNotification
}) {
  const [permission, setPermission] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  const requestDesktopPermission = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        new Notification('🎉 Manga Notifications Active!', {
          body: 'You will receive instant alerts when your tracked titles release new chapters.',
          icon: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&auto=format&fit=crop&q=80'
        });
      }
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '65px',
        right: '20px',
        width: '380px',
        maxWidth: '90vw',
        zIndex: 100,
        boxShadow: 'var(--shadow-lg)',
        padding: '18px',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BellRing size={18} style={{ color: 'var(--rose-accent)' }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Release Notifications</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Desktop Notification Permission Banner */}
      <div
        style={{
          background: permission === 'granted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          border: permission === 'granted' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(99, 102, 241, 0.25)',
          padding: '10px 12px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '0.78rem', color: permission === 'granted' ? 'var(--verified-color)' : 'var(--text-secondary)' }}>
          {permission === 'granted' ? '✓ Desktop Notifications Enabled' : 'Enable Native Desktop Alerts'}
        </span>
        {permission !== 'granted' && (
          <button
            onClick={requestDesktopPermission}
            className="btn-primary"
            style={{ fontSize: '0.72rem', padding: '4px 10px' }}
          >
            Enable
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: '320px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No unread chapter releases. You are up to date!
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div
              key={idx}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--rose-accent)',
                  marginTop: '6px',
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginBottom: '2px' }}>
                  {notif.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {notif.body}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {notif.relative_time || 'Just now'}
                  </span>
                  {notif.url && (
                    <a
                      href={notif.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--blue-accent)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Read Legal Chapter</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
        <button
          onClick={onSimulateNotification}
          style={{
            background: 'transparent',
            border: '1px dashed rgba(99, 102, 241, 0.4)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-highlight)',
            fontSize: '0.72rem',
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={12} />
          <span>Simulate New Drop</span>
        </button>

        {notifications.length > 0 && (
          <button
            onClick={onClearNotifications}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
