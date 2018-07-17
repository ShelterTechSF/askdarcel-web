import React from 'react';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-content">
        <div className="footer-text">
            ©{ new Date().getFullYear() } Shelter Tech
        </div>
        <ul className="footer-links">
          <li><a href="mailto:info@sheltertech.org">Contact Us</a></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service">Terms of Service</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
