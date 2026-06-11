import type { CSSProperties, ReactNode } from 'react';

const COLORS = {
  cardBg: '#FFFFFF',
  tintBlue: '#EFF6FF',
  tintTeal: '#F0FDFA',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  text: '#111827',
  textSoft: '#475569',
  textMuted: '#64748B',
  navy: '#0F172A',
  blue: '#1D4ED8',
  teal: '#0F766E'
} as const;

const shellStyle: CSSProperties = {
  background: COLORS.cardBg,
  border: '1px solid ' + COLORS.border,
  borderRadius: '20px',
  padding: '24px',
  marginBottom: '24px',
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)'
};

export function PageHeaderCard({
  title,
  description,
  actions,
  children
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        ...shellStyle,
        marginTop: '24px',
        background: 'linear-gradient(135deg, ' + COLORS.tintBlue + ' 0%, ' + COLORS.tintTeal + ' 100%)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 800,
              marginBottom: '8px',
              color: COLORS.navy,
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </div>
          {description ? (
            <div style={{ color: COLORS.textSoft, lineHeight: 1.7, maxWidth: '780px' }}>
              {description}
            </div>
          ) : null}
        </div>

        {actions ? <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>{actions}</div> : null}
      </div>

      {children ? <div style={{ marginTop: '16px' }}>{children}</div> : null}
    </div>
  );
}

export function PageSectionCard({
  title,
  description,
  children,
  noPadding = false
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  noPadding?: boolean;
}) {
  return (
    <div
      style={{
        background: COLORS.cardBg,
        border: '1px solid ' + COLORS.border,
        borderRadius: '20px',
        marginBottom: '24px',
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
      }}
    >
      {title || description ? (
        <div style={{ padding: '24px 24px 0 24px' }}>
          {title ? (
            <div
              style={{
                fontSize: '22px',
                fontWeight: 800,
                marginBottom: description ? '8px' : '16px',
                color: COLORS.navy,
                letterSpacing: '-0.01em'
              }}
            >
              {title}
            </div>
          ) : null}

          {description ? (
            <div style={{ color: COLORS.textSoft, lineHeight: 1.7, marginBottom: '16px' }}>
              {description}
            </div>
          ) : null}
        </div>
      ) : null}

      <div style={noPadding ? undefined : { padding: '20px 24px 24px 24px' }}>
        {children}
      </div>
    </div>
  );
}

export function PageStatsGrid({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
      }}
    >
      {children}
    </div>
  );
}

export function PageStatCard({
  label,
  value
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div
      style={{
        background: COLORS.cardBg,
        border: '1px solid ' + COLORS.border,
        borderTop: '4px solid ' + COLORS.tintTeal,
        borderRadius: '18px',
        padding: '20px',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)'
      }}
    >
      <div style={{ color: COLORS.textMuted, marginBottom: '8px', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: COLORS.text }}>{value}</div>
    </div>
  );
}
