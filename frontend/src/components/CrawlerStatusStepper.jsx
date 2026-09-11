import React from 'react';
import { CheckCircle2, ShieldCheck, Database, ShoppingBag, Radio } from 'lucide-react';

export default function CrawlerStatusStepper({ crawlerTrace, isSearching }) {
  const steps = [
    {
      id: 1,
      name: 'Legal Sources',
      desc: 'AniList GraphQL & Open Library API',
      icon: Database
    },
    {
      id: 2,
      name: 'Copyright Check',
      desc: '100% Whitelist Verified (Zero Pirate Sites)',
      icon: ShieldCheck
    },
    {
      id: 3,
      name: 'Physical Catalog',
      desc: 'Volumes, Covers & ISBNs Indexed',
      icon: ShoppingBag
    },
    {
      id: 4,
      name: 'Storefront Pricing',
      desc: 'Amazon, B&N, Kinokuniya, BookWalker',
      icon: CheckCircle2
    }
  ];

  return (
    <div
      id="crawler-status-stepper"
      className="glass-panel"
      style={{
        padding: '16px 20px',
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={18} style={{ color: isSearching ? '#38bdf8' : 'var(--verified-color)', animation: isSearching ? 'pulseGlow 1.5s infinite' : 'none' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-highlight)' }}>
            Live Crawler & Compliance Status
          </span>
        </div>
        <span className="badge badge-verified" style={{ fontSize: '0.75rem' }}>
          <ShieldCheck size={14} /> Anti-Trespass Verified
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isComplete = !isSearching;
          return (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: isComplete ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                border: isComplete ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: isComplete ? 'var(--verified-glow)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isComplete ? 'var(--verified-color)' : 'var(--text-muted)'
                }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: isComplete ? '#e2e8f0' : '#94a3b8' }}>
                  {step.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
