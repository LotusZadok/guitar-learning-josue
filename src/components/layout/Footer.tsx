const footerStyle: React.CSSProperties = {
  padding: '32px 60px',
  borderTop: '1px solid var(--rule)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const textStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'var(--muted)',
  letterSpacing: '2px',
  textTransform: 'uppercase',
};

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <div style={textStyle}>Apuntes Guitarra · Referencia Personal</div>
      <div style={textStyle}>EADGBE · 12 Notas · Sistema CAGED</div>
    </footer>
  );
}
