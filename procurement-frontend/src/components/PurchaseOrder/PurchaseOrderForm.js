import React, { useState, useEffect } from "react";
import axios from "axios";
import './PurchaseOrderForm.css';

const PurchaseOrderForm = () => {
  const [orderData, setOrderData] = useState({
    supplier: "",
    order_date: new Date().toISOString().slice(0, 10), // Current date
    items: [],
    discount: 0,
    item_total: 0,
    net_amount: 0,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSuppliers();
    fetchItems();
  }, []);

  // Fetch active suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/suppliers/");
      setSuppliers(response.data.filter((supplier) => supplier.status === "Active"));
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  // Fetch all available items
  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/items/");
      setAvailableItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Update supplier selection
  const handleSupplierChange = (e) => {
    setOrderData((prev) => ({ ...prev, supplier: e.target.value }));
  };
  

  // Add a new item row
  const handleAddItem = () => {
    setOrderData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: "",
          stock_unit: "",
          unit_price: 0,
          packing_unit: "",
          order_qty: 1,
          item_amount: 0,
          discount: 0,
          net_amount: 0,
        },
      ],
    }));
  };

  // Handle item field changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderData.items];
    const selectedItem = availableItems.find((item) => item.item_no === parseInt(value));

    if (field === "item" && selectedItem) {
      updatedItems[index] = {
        ...updatedItems[index],
        item: value,
        stock_unit: selectedItem.stock_unit,
        unit_price: parseFloat(selectedItem.unit_price),
        packing_unit: selectedItem.packing_unit, // If you have packing_unit in your Item model
      };
    } else {
      updatedItems[index][field] = value;
    }

    // Calculate dependent fields (item_amount and net_amount)
    updatedItems[index].item_amount =
      Math.max(0, updatedItems[index].order_qty) * updatedItems[index].unit_price;
    updatedItems[index].net_amount =
      updatedItems[index].item_amount - Math.max(0, updatedItems[index].discount);

    setOrderData((prev) => {
      const itemTotal = updatedItems.reduce((sum, item) => sum + item.item_amount, 0);
      const totalDiscount = updatedItems.reduce((sum, item) => sum + parseFloat(item.discount || 0), 0);
      return {
        ...prev,
        items: updatedItems,
        item_total: itemTotal,
        discount: totalDiscount,
        net_amount: itemTotal - totalDiscount,
      };
    });
  };



  // Submit purchase order
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if supplier is selected
    if (!orderData.supplier) {
      setError("Please select a supplier.");
      return;
    }
  
    // Check if at least one item is added
    if (orderData.items.length === 0) {
      setError("Please add at least one item.");
      return;
    }
  
    // Check if all items have valid values
    for (let i = 0; i < orderData.items.length; i++) {
      if (!orderData.items[i].item || orderData.items[i].order_qty <= 0) {
        setError("All items must have a valid selection and quantity.");
        return;
      }
    }
  
    setError(""); // Clear any previous errors
  
    // Create the payload object with order data
    // Create the payload object with order data
const orderPayload = {
  supplier: parseInt(orderData.supplier), // Ensure supplier is an integer
  order_date: orderData.order_date, // Valid date string
  discount: orderData.discount || 0, // Default to 0 if not provided
  net_amount: orderData.net_amount, // Number
  order_items: orderData.items.map(item => ({
    item: parseInt(item.item), // Ensure item is an integer (the item_id or foreign key ID)
    packing_unit: item.packing_unit || "Each", // Default to empty string if not provided
    order_qty: item.order_qty || 1, // Default to 1 if not provided
    item_amount: item.item_amount || 0, // Default to 0 if not provided
    discount: item.discount || 0, // Default to 0 if not provided
    net_amount: item.net_amount || 0, // Default to 0 if not provided
  })),
};


    // Log the payload inside handleSubmit after it's created
    console.log("Final Payload:", orderPayload);
  
    try {
      const response = await axios.post("http://localhost:8000/api/purchase-orders/", orderPayload);
      console.log("Purchase Order Created:", response.data);
      alert("Purchase Order created successfully!");
      // Reset form after successful submission
      setOrderData({
        supplier: "",
        order_date: new Date().toISOString().slice(0, 10),
        items: [],
        discount: 0,
        item_total: 0,
        net_amount: 0,
      });
    } catch (error) {
      console.error("Error creating purchase order:", error);
      alert("Failed to create purchase order.");
    }
  };
  
  

  return (
    <div>
      <h2>Create Purchase Order</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Supplier:</label>
          <select value={orderData.supplier} onChange={handleSupplierChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((supplier) => (
              <option key={supplier.supplier_no} value={supplier.supplier_no}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Order Date:</label>
          <input type="date" value={orderData.order_date} readOnly />
        </div>

        <div>
          <h3>Items</h3>
          {orderData.items.map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <select
                value={item.item}
                onChange={(e) => handleItemChange(index, "item", e.target.value)}
                required
              >
                <option value="">Select Item</option>
                {availableItems.map((availableItem) => (
                  <option key={availableItem.item_no} value={availableItem.item_no}>
                    {availableItem.item_name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Order Quantity"
                value={item.order_qty}
                onChange={(e) =>
                  handleItemChange(index, "order_qty", Math.max(1, parseFloat(e.target.value) || 0))
                }
                required
                min="1"
              />

              <input
                type="number"
                placeholder="Discount"
                value={item.discount}
                onChange={(e) =>
                  handleItemChange(index, "discount", Math.max(0, parseFloat(e.target.value) || 0))
                }
                min="0"
              />

              <span>Item Amount: {item.item_amount.toFixed(2)}</span>
              <span>Net Amount: {item.net_amount.toFixed(2)}</span>
            </div>
          ))}

          <button type="button" onClick={handleAddItem}>
            Add Item
          </button>
        </div>

        <div>
          <label>Item Total:</label>
          <span>{orderData.item_total.toFixed(2)}</span>
        </div>

        <div>
          <label>Discount:</label>
          <span>{orderData.discount.toFixed(2)}</span>
        </div>

        <div>
          <label>Net Amount:</label>
          <span>{orderData.net_amount.toFixed(2)}</span>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PurchaseOrderForm;
