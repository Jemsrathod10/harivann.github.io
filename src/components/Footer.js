import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>PlantShop</h3>
            <p>Your trusted partner for beautiful, healthy plants. We bring nature to your doorstep.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <p><a href="/">Home</a></p>
            <p><a href="/products">Products</a></p>
            <p><a href="/about">About Us</a></p>
            <p><a href="/contact">Contact</a></p>
          </div>
          
          <div className="footer-section">
            <h3>Categories</h3>
            <p>Indoor Plants</p>
            <p>Outdoor Plants</p>
            <p>Flowering Plants</p>
            <p>Succulents</p>
          </div>
          
          <div className="footer-section">
            <h3>Contact Info</h3>
            <p>📧 info@plantshop.com</p>
            <p>📞 +91 9876543210</p>
            <p>📍 Surat, Gujarat, India</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 PlantShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* ---------------- CSS ---------------- */
const styles = `
.footer {
  background: linear-gradient(135deg, #00b894, #2d3436);
  color: #f9f9f9;
  padding: 50px 20px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 50px;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: 0 -5px 20px rgba(0,0,0,0.15);
}

.footer .container {
  max-width: 1200px;
  margin: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer-section h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  border-bottom: 2px solid rgba(255,255,255,0.3);
  display: inline-block;
  padding-bottom: 5px;
  color: #fff;
}

.footer-section p {
  margin: 8px 0;
  font-size: 0.95rem;
  color: #e6f5f1;
}

.footer-section a {
  color: #e6f5f1;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: #00ffcc;
}

.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 15px;
  font-size: 0.9rem;
  color: #dfe6e9;
}
`;

// Inject internal CSS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
