// src/components/Footer.jsx
function Footer() {
  return (
    <footer>
      <div className="logo_footer">
        <img src="public/images/LOGO (1).png" alt="PassanGo" />
        <h1>PassanGo</h1>
      </div>
      <div className="footer-links">
        <div>
          <h4>Connect</h4>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">FAQs</a>
        </div>
        <div>
          <h4>About</h4>
          <a href="#">Our Story</a>
          <a href="#">Careers</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;