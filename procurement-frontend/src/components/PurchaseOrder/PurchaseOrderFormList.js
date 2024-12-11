import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import './PurchaseOrderForm.css';

const PurchaseOrderFormList = () => {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrderItems, setSelectedOrderItems] = useState(null);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const safeToFixed = (value, decimals = 2) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return (0).toFixed(decimals);
    }
    return numValue.toFixed(decimals);
  };

  const fetchPurchaseOrders = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/purchase-orders/");
      setPurchaseOrders(response.data);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      setError("Failed to load purchase orders.");
    }
  };

  // Export purchase orders with order items to Excel
  const exportToExcel = () => {
    const exportData = purchaseOrders.flatMap(order => 
      order.order_items?.map(item => ({
        Supplier: order.supplier || "N/A",
        "Order Date": order.order_date,
        "Item ID": item.item || "N/A",
        "Order Quantity": item.order_qty || 1,
        "Item Amount": safeToFixed(item.item_amount),
        Discount: safeToFixed(item.discount),
        "Net Amount": safeToFixed(item.net_amount),
      })) || []
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Purchase Orders");

    // Export the data to Excel
    XLSX.writeFile(workbook, "purchase_orders.xlsx");
  };

  const showOrderItems = (orderItems) => {
    if (!orderItems || orderItems.length === 0) {
      setSelectedOrderItems([]);
      return;
    }
    
    const formattedItems = orderItems.map(item => ({
      item: parseInt(item.item),
      packing_unit: item.packing_unit || "",
      order_qty: item.order_qty || 1,
      item_amount: item.item_amount || 0,
      discount: item.discount || 0,
      net_amount: item.net_amount || 0,
    }));
    setSelectedOrderItems(formattedItems);
  };

  const deletePurchaseOrder = async (orderNo) => {
    try {
      // Use order_no instead of orderId
      await axios.delete(`http://localhost:8000/api/purchase-orders/${orderNo}/`);
      
      // Remove the deleted order from the state
      setPurchaseOrders((prevOrders) => 
        prevOrders.filter(order => order.order_no !== orderNo)
      );
      
      alert("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting purchase order:", error.response || error);
      setError("Failed to delete purchase order.");
    }
  };
  

  return (
    <div>
      <h2>Purchase Orders List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Export Button */}
      <button onClick={exportToExcel}>Export to Excel</button>

      <table>
        <thead>
          <tr>
            <th>Supplier I-D</th>
            <th>Order Date</th>
            <th>Item Amount</th>
            <th>Discount</th>
            <th>Net Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchaseOrders.map((order) => (
            <tr key={order.id}>
              <td>{order.supplier || "N/A"}</td>
              <td>{order.order_date}</td>
              <td>{order.order_items?.[0]?.item_amount ? safeToFixed(order.order_items[0].item_amount) : 'N/A'}</td>
              <td>{order.order_items?.[0]?.discount ? safeToFixed(order.order_items[0].discount) : 'N/A'}</td>
              <td>{safeToFixed(order.net_amount)}</td>
              <td>
                <button onClick={() => showOrderItems(order.order_items)}>
                  View Order Items Details
                </button>
                {/* Delete Button */}
                {/* <button onClick={() => deletePurchaseOrder(order.order_no)} style={{ marginLeft: "10px", color: "red" }}>
                  Delete
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrderItems && (
        <div className="order-items-details">
          <h3>Order Items Details</h3>
          <table>
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Packing Unit</th>
                <th>Order Quantity</th>
                <th>Item Amount</th>
                <th>Discount</th>
                <th>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.item}</td>
                  <td>{item.packing_unit}</td>
                  <td>{item.order_qty}</td>
                  <td>{safeToFixed(item.item_amount)}</td>
                  <td>{safeToFixed(item.discount)}</td>
                  <td>{safeToFixed(item.net_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderFormList;
