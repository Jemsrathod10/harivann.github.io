import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-section">
        <h1 className="about-title">About PlantShop</h1>
        
        <div className="about-content">
          <div className="about-card">
            <h2>Our Story</h2>
            <p>
              Founded in 2020, PlantShop began as a small passion project in Surat, Gujarat. 
              Our love for plants and dedication to bringing nature into people's homes has 
              grown into a thriving business that serves plant enthusiasts across India.
            </p>
          </div>

          <div className="about-card">
            <h2>Our Mission</h2>
            <p>
              We believe that every space deserves the beauty and benefits of plants. Our mission 
              is to make plant ownership accessible, enjoyable, and successful for everyone, 
              whether you're a beginner or an experienced plant parent.
            </p>
          </div>

          <div className="about-card">
            <h2>What We Offer</h2>
            <ul>
              <li>Wide variety of indoor and outdoor plants</li>
              <li>High-quality plants from trusted growers</li>
              <li>Expert care guides and support</li>
              <li>Fast and secure delivery</li>
              <li>Plant accessories and care products</li>
              <li>Personalized plant recommendations</li>
            </ul>
          </div>

          <div className="about-card">
            <h2>Our Values</h2>
            <div className="about-values">
              <div>
                <strong>🌱 Sustainability:</strong> We promote eco-friendly practices and sustainable plant growing methods.
              </div>
              <div>
                <strong>💚 Quality:</strong> Every plant is carefully selected and inspected before reaching you.
              </div>
              <div>
                <strong>🤝 Customer Care:</strong> Your success with plants is our success. We're here to help every step of the way.
              </div>
              <div>
                <strong>📚 Education:</strong> We believe in empowering our customers with knowledge and confidence.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Only */}
      <style>{`
        .about-container {
          padding: 3rem 1rem;
          background: #f9fafb;
        }

        .about-section {
          max-width: 900px;
          margin: 0 auto;
        }

        .about-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          color: #2d5a27;
          font-weight: 700;
        }

        .about-content {
          line-height: 1.8;
          font-size: 1.1rem;
          color: #333;
        }

        .about-card {
          background: #fff;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .about-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .about-card h2 {
          color: #2d5a27;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .about-card ul {
          padding-left: 1.5rem;
          list-style: disc;
        }

        .about-card li {
          margin-bottom: 0.5rem;
        }

        .about-values {
          display: grid;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default About;
