import React from 'react';

const Footer: React.FC = () => (
  <footer style={{
    width: '100%',
    padding: '1rem 0',
    background: 'rgba(0,0,0,0.8)',
    color: '#fff',
    textAlign: 'center',
    position: 'fixed',
    left: 0,
    bottom: 0,
    zIndex: 1000
  }}>
    © {new Date().getFullYear()} MeetMate. All rights reserved.
  </footer>
);

export default Footer;
