import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditSupplierForm.css'; // Import the CSS file

const EditSupplierForm = () => {
  const { supplierNo } = useParams(); // Extract supplier_no from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplier_name: '',
    address: '',
    tax_no: '',
    country: '',
    mobile_no: '',
    email: '',
    status: 'Active',
  });

  const [error, setError] = useState(null);

  // Fetch supplier data for editing
  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/suppliers/${supplierNo}/`);
        setFormData(response.data);
      } catch (err) {
        console.error('Error fetching supplier:', err);
        setError('Failed to fetch supplier data. Please try again later.');
      }
    };

    fetchSupplier();
  }, [supplierNo]);

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
      await axios.put(`http://localhost:8000/api/suppliers/${supplierNo}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Supplier updated successfully!');
      navigate('/suppliers'); // Redirect to supplier list page
    } catch (err) {
      console.error('Error updating supplier:', err);
      alert('Failed to update supplier. Please try again.');
    }
  };

  return (
    <div className="edit-supplier-form-container">
      <h2>Edit Supplier</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
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
          <div className="form-group">
            <button type="submit">Update Supplier</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditSupplierForm;
