import React from 'react';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <ul>
        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
        <li><Link to="/terms-of-service">Terms of Service</Link></li>
        <li className="footer_text">
          © 2016-{ new Date().getFullYear() } Shelter Tech, a 501(c)(3) nonprofit
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
