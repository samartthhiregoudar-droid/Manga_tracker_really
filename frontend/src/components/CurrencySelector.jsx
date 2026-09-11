import React from 'react';
import { DollarSign } from 'lucide-react';

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' }
];

export default function CurrencySelector({ currentCurrency, onCurrencyChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <DollarSign size={16} style={{ color: 'var(--gold-accent)' }} />
      <select
        id="currency-selector"
        value={currentCurrency}
        onChange={(e) => onCurrencyChange(e.target.value)}
        style={{
          background: 'var(--bg-surface-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 10px',
          fontSize: '0.85rem',
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none'
        }}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} style={{ background: '#0f172a', color: '#f8fafc' }}>
            {c.label}
          </option>
        ))}
      </select>
    </div>
  );
}
