import React from 'react';

function Footer() {
  let footerText = '© 2016- ';
  footerText = footerText.concat(new Date().getFullYear());
  footerText = footerText.concat(' Shelter Tech, a 501(c)(3) nonprofit');
  if (window.location.hostname.split('.')[0] === 'help') {
    footerText = 'Whatever we want.';
  }
  return (
    <footer className="site-footer" role="contentinfo">
      <ul>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Service</a></li>
        <li className="footer_text">
          { footerText }
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
