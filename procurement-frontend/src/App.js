import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SupplierForm from './components/Supplier/SupplierForm';
import SupplierList from './components/Supplier/SupplierList'; // Import SupplierList
import ItemForm from './components/Item/ItemForm'; // Import ItemForm
import ItemList from './components/Item/ItemList'; // Import ItemList
import PurchaseOrderForm from './components/PurchaseOrder/PurchaseOrderForm';
import EditSupplierForm from './components/Supplier/EditSupplierForm';
import EditItemForm from './components/Item/EditItemForm';
import PurchaseOrderFormList from './components/PurchaseOrder/PurchaseOrderFormList'; // Import PurchaseOrderFormList
import homepageImage from './assets/logo7.png';  
const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div className="navbar-title">
            PROCUREMENT APP
          </div>
          <ul className="navbar-links">
            {/* Home link */}
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/supplier">Supplier</Link>
            </li>
            <li>
              <Link to="/item">Items</Link> {/* Link to Item List */}
            </li>
            <li>
              <Link to="/purchase">Purchase Order</Link>
            </li>
            <li>
              <Link to="/purchase-list">Ordered Details</Link> {/* Link to Purchase Order List */}
            </li>
          </ul>
        </nav>

        <Routes>
          {/* Home route with centered image */}
          <Route path="/" element={
  <div className="home-container">
    <img src={homepageImage} alt="Procurement App" className="homepage-image" />
  </div>
} />

         
          

          {/* Routing for Supplier */}
          <Route path="/supplier" element={<SupplierList />} /> 
          <Route path="/supplier/add" element={<SupplierForm />} /> 
          <Route path="/supplier/edit/:supplierNo" element={<EditSupplierForm />} />

          {/* Routing for Item List and Item Form */}
          <Route path="/item" element={<ItemList />} /> {/* Display Item List */}
          <Route path="/item/add" element={<ItemForm />} /> {/* Add Item */}
          <Route path="/item/edit/:itemId" element={<EditItemForm />} />

          {/* Routing for Purchase Orders */}
          <Route path="/purchase" element={<PurchaseOrderForm />} /> {/* Add Purchase Order */}
          <Route path="/purchase-list" element={<PurchaseOrderFormList />} /> {/* Display Purchase Orders List */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
