import React from 'react';


const Footer: React.FC = () => (
  <footer
    style={{
      width: '100%',
      padding: '1.5rem 0 1rem 0',
      background: 'rgba(0,0,0,0.85)',
      color: '#fff',
      textAlign: 'center',
      position: 'static',
      left: undefined,
      bottom: undefined,
      zIndex: undefined
    }}
  >
    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: 4 }}>
      MeetMate – Your AI-powered event networking companion
    </div>
    <div style={{ fontSize: '0.95rem', marginBottom: 4 }}>
      Contact: <a href="mailto:support@meetmate.ai" style={{ color: '#7dd3fc', textDecoration: 'underline' }}>support@meetmate.ai</a>
    </div>
    <div style={{ fontSize: '0.95rem', marginBottom: 4 }}>
      <a href="/privacy" style={{ color: '#a5b4fc', marginRight: 12, textDecoration: 'underline' }}>Privacy Policy</a>
      <a href="/terms" style={{ color: '#a5b4fc', textDecoration: 'underline' }}>Terms of Service</a>
    </div>
    <div style={{ fontSize: '0.9rem', marginTop: 8 }}>
      © {new Date().getFullYear()} MeetMate. All rights reserved.
    </div>
  </footer>
);

export default Footer;
