import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemList.css'; // Import your styling

const ItemList = () => {
  const [items, setItems] = useState([]); // To store the list of items
  const [loading, setLoading] = useState(true); // To show loading state

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/items/');
      setItems(response.data); // Set items data in state
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken'); // Replace with your token logic
      await axios.delete(`http://localhost:8000/api/items/${itemId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setItems((prevItems) => prevItems.filter((item) => item.item_no !== itemId));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error.response || error.message);
      alert('Failed to delete item. Please try again.');
    }
  };
  
  

  return (
    <div className="supplier-list-container">
      <h2>Item List</h2>

      {/* Add New Item link */}
      <div className="add-item-link">
        <a href="/item/add">Add New Item</a>
      </div>

      {loading ? (
        <p>Loading items...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Inventory Location</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Supplier </th>
                <th>Stock Unit</th>
                <th>Unit Price</th>
                <th>Item Image</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.inventory_location}</td>
                  <td>{item.brand}</td>
                  <td>{item.category}</td>
                  <td>{item.supplier_name}</td> 
                  <td>{item.stock_unit}</td>
                  <td>{item.unit_price}</td>
                  <td>
  {item.item_images ? (
    <img
      src={item.item_images}
      alt={item.item_name}
      className="item-image"
      style={{ width: '20px', height: '20px', objectFit: 'cover' }} // Optional styling
    />
  ) : (
    'No Image'
  )}
</td>

                  <td>{item.status}</td>
                  <td>
                    {/* Edit Button */}
                    <a href={`/item/edit/${item.item_no}`} className="edit-link">
                      Edit
                    </a>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(item.item_no)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemList;
