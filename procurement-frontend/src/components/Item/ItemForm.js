import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemForm.css'; // Ensure this file exists and is properly styled

const ItemForm = () => {
  const [formData, setFormData] = useState({
    item_name: '',
    inventory_location: '',
    brand: '',
    category: '',
    supplier: '', // Selected supplier ID
    stock_unit: '',
    unit_price: '',
    status: 'Enabled',
    item_images: null, // For image file
  });

  const [suppliers, setSuppliers] = useState([]); // To store supplier list

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/suppliers/');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      item_images: e.target.files[0], // Save the uploaded file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form Submitted');

    // Prepare the data for FormData
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/api/items/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Item added:', response.data);

      // Reset form after successful submission
      setFormData({
        item_name: '',
        inventory_location: '',
        brand: '',
        category: '',
        supplier: '',
        stock_unit: '',
        unit_price: '',
        status: 'Enabled',
        item_images: null,
      });

      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item Name:</label>
          <input
            type="text"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Inventory Location:</label>
          <input
            type="text"
            name="inventory_location"
            value={formData.inventory_location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Brand:</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Supplier:</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplier_no} value={supplier.supplier_no}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Stock Unit:</label>
          <input
            type="text"
            name="stock_unit"
            value={formData.stock_unit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Unit Price:</label>
          <input
            type="number"
            name="unit_price"
            value={formData.unit_price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Enabled">Enabled</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>

        <div className="form-group">
          <label>Item Images:</label>
          <input
            type="file"
            name="item_images"
            onChange={handleFileChange}
          />
        </div>

        <button className="submit-button" type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default ItemForm;
