import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SupplierList.css';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch suppliers data from the API
  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/suppliers/');
      setSuppliers(response.data); // Set the data into state
      setError(null); // Clear any previous error
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError('Failed to fetch suppliers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete supplier
  const handleDelete = async (supplierNo) => {
    // Check if supplierNo is valid
    if (!supplierNo) {
      console.error('Supplier ID is undefined or invalid');
      alert('Failed to delete supplier: Invalid ID');
      return;
    }
  
    // Ask for confirmation before deletion
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }
  
    try {
      // Send DELETE request to the backend
      const response = await axios.delete(`http://localhost:8000/api/suppliers/${supplierNo}/`);
      
      // Handle successful delete
      if (response.status === 204) {
        console.log('Supplier deleted successfully:', response);
        
        // Update the state to remove the deleted supplier from the list
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((supplier) => supplier.supplier_no !== supplierNo)
        );
        
        alert('Supplier deleted successfully!');
      } else {
        console.error('Failed to delete supplier:', response);
        alert('Failed to delete supplier: Unexpected response from the server');
      }
    } catch (err) {
      // Handle errors during the DELETE request
      console.error('Error deleting supplier:', err.response?.data || err.message);
      alert(`Failed to delete the supplier: ${err.response?.data?.detail || 'Please try again later.'}`);
    }
  };
  
  

  useEffect(() => {
    fetchSuppliers(); // Fetch supplier data when the component mounts
  }, []);

  return (
    <div className="supplier-list-container">
      <h2>Supplier List</h2>
      <div className="add-supplier-link">
        <Link to="/supplier/add">Add New Supplier</Link>
      </div>
      {isLoading ? (
        <p>Loading suppliers...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Supplier Name</th>
                <th>Address</th>
                <th>Tax No</th>
                <th>Country</th>
                <th>Mobile No</th>
                <th>Email</th>
                
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>{supplier.supplier_name}</td>
                    <td>{supplier.address}</td>
                    <td>{supplier.tax_no}</td>
                    <td>{supplier.country}</td>
                    <td>{supplier.mobile_no}</td>
                    <td>{supplier.email}</td>
                   
                    <td>{supplier.status}</td>
                    <td>
                      <Link to={`/supplier/edit/${supplier.supplier_no}`} className="edit-link">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(supplier.supplier_no)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-data">
                    No suppliers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SupplierList;
