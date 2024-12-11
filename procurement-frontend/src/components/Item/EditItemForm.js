import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditItemForm.css';

const EditItemForm = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    item_name: '',
    inventory_location: '',
    brand: '',
    category: '',
    supplier_id: '',
    stock_unit: '',
    unit_price: '',
    status: 'Active',
    item_images: null, // Save image as file
  });

  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemResponse = await axios.get(`http://localhost:8000/api/items/${itemId}/`);
        setFormData(itemResponse.data);

        const suppliersResponse = await axios.get('http://localhost:8000/api/suppliers/');
        setSuppliers(suppliersResponse.data);

        if (itemResponse.data.supplier) {
          setFormData((prevData) => ({
            ...prevData,
            supplier_id: itemResponse.data.supplier.id,
          }));
        }
      } catch (err) {
        console.error('Error fetching item or suppliers:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    fetchData();
  }, [itemId]);

  useEffect(() => {
    if (formData.item_images) {
      // Only generate a preview URL if the item_images is a valid file
      if (formData.item_images instanceof File) {
        const objectUrl = URL.createObjectURL(formData.item_images);
        setImagePreviewUrl(objectUrl);

        // Cleanup function to revoke the URL when component unmounts or when item_images changes
        return () => {
          if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
          }
        };
      }
    }
  }, [formData.item_images]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) { // Ensure it's an image file
      setFormData((prevData) => ({
        ...prevData,
        item_images: file,
      }));
    } else {
      alert('Please select a valid image file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedItemData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        updatedItemData.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.put(`http://localhost:8000/api/items/${itemId}/`, updatedItemData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Item updated successfully!");
      navigate('/items');
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert("Failed to update item. Please try again.");
    }
  };

  return (
    <div className="edit-item-form-container">
      <h2>Edit Item</h2>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <form onSubmit={handleSubmit} className="form-container">
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
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
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
            <label>Item Image:</label>
            <input
              type="file"
              name="item_images"
              onChange={handleFileChange}
            />
            {imagePreviewUrl && (
              <img
                src={imagePreviewUrl}
                alt="Preview"
                style={{ width: '100px' }}
              />
            )}
          </div>
          <div className="form-group">
            <button type="submit">Update Item</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditItemForm;
