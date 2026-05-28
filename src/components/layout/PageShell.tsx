import type { CSSProperties, ReactNode } from 'react';

const shellStyle: CSSProperties = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '24px',
  marginBottom: '24px'
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
    <div style={{ ...shellStyle, marginTop: '24px' }}>
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
          <div style={{ fontSize: '30px', fontWeight: 700, marginBottom: '8px' }}>
            {title}
          </div>
          {description ? (
            <div style={{ color: '#475569', lineHeight: 1.6 }}>{description}</div>
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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '24px',
        overflow: 'hidden'
      }}
    >
      {title || description ? (
        <div style={{ padding: '24px 24px 0 24px' }}>
          {title ? (
            <div style={{ fontSize: '22px', fontWeight: 700, marginBottom: description ? '8px' : '16px' }}>
              {title}
            </div>
          ) : null}

          {description ? (
            <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '20px'
      }}
    >
      <div style={{ color: '#64748b', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700 }}>{value}</div>
    </div>
  );
}