import React, { useState } from 'react';
import axios from 'axios';
import './SupplierForm.css'; // Import CSS file

const SupplierForm = () => {
  const [formData, setFormData] = useState({
    supplier_name: '',
    address: '',
    tax_no: '',
    country: '',
    mobile_no: '',
    email: '',
    status: 'Active',
  });

  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the Django backend API
      const response = await axios.post('http://localhost:8000/api/suppliers/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Supplier added:', response.data);

      // Reset form after submission
      setFormData({
        supplier_name: '',
        address: '',
        tax_no: '',
        country: '',
        mobile_no: '',
        email: '',
        status: 'Active',
      });

      // Display success message
      setSuccessMessage('Supplier added successfully!');
      console.log('Success message set.');

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
        console.log('Success message cleared.');
      }, 3000);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Supplier</h2>

      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="form-box">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Supplier Name:</label>
            <input
              type="text"
              name="supplier_name"
              value={formData.supplier_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tax No:</label>
            <input
              type="text"
              name="tax_no"
              value={formData.tax_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile No:</label>
            <input
              type="text"
              name="mobile_no"
              value={formData.mobile_no}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <button type="submit" className="submit-button">Add Supplier</button>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
