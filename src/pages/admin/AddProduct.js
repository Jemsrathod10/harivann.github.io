import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AddProduct = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [image, setImage] = useState('');
  const [tags, setTags] = useState('');

  // new states for plantCare
  const [lightRequirement, setLightRequirement] = useState('');
  const [wateringFrequency, setWateringFrequency] = useState('');

  useEffect(() => {
    if (!user || !user.isAdmin) window.location.href = '/';

    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const payload = {
        name,
        description,
        price: Number(price),
        category,
        stock: { quantity: Number(stock) },
        images: [{ url: image || 'https://via.placeholder.com/400', alt: name, isPrimary: true }],
        featured,
        tags: tags.split(',').map(t => t.trim().toLowerCase()),
        plantCare: {
          lightRequirement,
          wateringFrequency
        }
      };

      await axios.post('http://localhost:5000/api/products', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Product added successfully');
      // reset fields
      setName(''); 
      setDescription(''); 
      setPrice(''); 
      setStock(0); 
      setCategory(''); 
      setFeatured(false); 
      setImage(''); 
      setTags('');
      setLightRequirement('');
      setWateringFrequency('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || '❌ Failed to add product');
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows="4" required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" required />
        </div>
        <div className="form-group">
          <label>Stock Quantity</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} min="0" required />
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input type="url" value={image} onChange={e => setImage(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tags (comma separated)</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)} />
        </div>

        {/* PlantCare fields */}
        <div className="form-group">
          <label>Light Requirement</label>
          <select value={lightRequirement} onChange={e => setLightRequirement(e.target.value)} required>
            <option value="">Select Light Requirement</option>
            <option value="Low Light">Low Light</option>
            <option value="Medium Light">Medium Light</option>
            <option value="Bright Indirect">Bright Indirect</option>
            <option value="Direct Sun">Direct Sun</option>
          </select>
        </div>

        <div className="form-group">
          <label>Watering Frequency</label>
          <select value={wateringFrequency} onChange={e => setWateringFrequency(e.target.value)} required>
            <option value="">Select Watering Frequency</option>
            <option value="Daily">Daily</option>
            <option value="Every 2-3 days">Every 2-3 days</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-weekly">Bi-weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Featured Product
          </label>
        </div>
        <button type="submit" className="btn-submit">Add Product</button>
      </form>

      {/* Updated Professional CSS */}
      <style>{`
  .add-product-container {
    max-width: 650px;
    margin: 3rem auto;
    padding: 2.5rem;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.1);
    border: 1px solid #e6e6e6;
  }
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    font-size: 2rem;
    color: #2e7d32;
    font-weight: 700;
  }
  .add-product-form .form-group {
    margin-bottom: 1.5rem;
  }
  .add-product-form label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }
  .add-product-form input,
  .add-product-form textarea,
  .add-product-form select {
    width: 100%;
    padding: 0.7rem 0.9rem;
    border: 1px solid #ccc;
    border-radius: 10px;
    font-size: 1rem;
    background: #fdfdfd;
    transition: border 0.3s, box-shadow 0.3s;
  }
  .add-product-form input:focus,
  .add-product-form textarea:focus,
  .add-product-form select:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 6px rgba(76,175,80,0.4);
  }
  .add-product-form textarea {
    resize: vertical;
  }
  .checkbox-group {
    display: flex;
    align-items: center;
  }
  .btn-submit {
    width: 100%;
    padding: 0.9rem;
    background: linear-gradient(135deg, #4caf50, #388e3c);
    color: #fff;
    font-size: 1.05rem;
    font-weight: 600;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
  }
  .btn-submit:hover {
    background: linear-gradient(135deg, #45a049, #2e7d32);
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }
`}</style>
    </div>
  );
};

export default AddProduct;
