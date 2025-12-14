import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="container" style={{padding: '3rem 1rem', fontFamily: 'Arial, sans-serif', color: '#333'}}>
      <div className="section">
        <h1 className="section-title" style={{textAlign: 'center', color: '#2d5a27', marginBottom: '3rem'}}>Contact Us</h1>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem'
        }}>

          {/* Contact Form */}
          <div className="form-container" style={{
            background: '#fff',
            padding: '2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{marginBottom: '1.5rem', color: '#2d5a27'}}>Send us a Message</h2>
            
            {success && (
              <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#d4edda',
                borderRadius: '5px',
                color: '#155724',
                border: '1px solid #c3e6cb',
                fontWeight: '500'
              }}>
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gap: '1rem'}}>
                <div className="form-group" style={{display:'flex', flexDirection:'column'}}>
                  <label style={{marginBottom:'0.3rem', fontWeight:'500'}}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                      transition: '0.3s'
                    }}
                  />
                </div>

                <div className="form-group" style={{display:'flex', flexDirection:'column'}}>
                  <label style={{marginBottom:'0.3rem', fontWeight:'500'}}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Your email address"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                      transition: '0.3s'
                    }}
                  />
                </div>

                <div className="form-group" style={{display:'flex', flexDirection:'column'}}>
                  <label style={{marginBottom:'0.3rem', fontWeight:'500'}}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Message subject"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                      transition: '0.3s'
                    }}
                  />
                </div>

                <div className="form-group" style={{display:'flex', flexDirection:'column'}}>
                  <label style={{marginBottom:'0.3rem', fontWeight:'500'}}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message..."
                    rows="6"
                    style={{
                      padding: '0.8rem 1rem',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                      fontSize: '1rem',
                      resize: 'vertical',
                      transition: '0.3s'
                    }}
                  />
                </div>

                <button type="submit" style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: '0.3s'
                }}
                onMouseOver={e => e.target.style.backgroundColor='#218838'}
                onMouseOut={e => e.target.style.backgroundColor='#28a745'}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div style={{display:'grid', gap:'2rem'}}>
            <div style={{
              background:'#fff',
              padding:'2rem',
              borderRadius:'10px',
              boxShadow:'0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{color:'#2d5a27', marginBottom:'1rem'}}>Get in Touch</h3>
              <div style={{display:'grid', gap:'0.8rem', fontSize:'0.95rem'}}>
                <div>
                  <strong>📍 Address:</strong><br/>
                  123 Green Street<br/>
                  Surat, Gujarat - 395007<br/>
                  India
                </div>
                <div>
                  <strong>📞 Phone:</strong><br/>
                  +91 9876543210
                </div>
                <div>
                  <strong>📧 Email:</strong><br/>
                  info@plantshop.com
                </div>
                <div>
                  <strong>🕒 Hours:</strong><br/>
                  Monday - Saturday: 9:00 AM - 7:00 PM<br/>
                  Sunday: 10:00 AM - 6:00 PM
                </div>
              </div>
            </div>

            <div style={{
              background:'#fff',
              padding:'2rem',
              borderRadius:'10px',
              boxShadow:'0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{color:'#2d5a27', marginBottom:'1rem'}}>Need Help?</h3>
              <ul style={{marginLeft:'1rem', listStyleType:'disc', color:'#555'}}>
                <li>Plant care advice</li>
                <li>Product recommendations</li>
                <li>Order assistance</li>
                <li>Shipping inquiries</li>
                <li>Plant troubleshooting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
