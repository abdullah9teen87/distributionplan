"use client";
import React from 'react';

const PaymentStatus = ({ paymentData }) => {
  return (
    <div className="payment-status">
      <h2>Payment Status</h2>
      {paymentData ? (
        <div>
          <p>User: {paymentData.userName}</p>
          <p>Amount: ${paymentData.amount}</p>
          <p>Status: {paymentData.status}</p>
          <p>Date: {new Date(paymentData.date).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No payment data available.</p>
      )}
    </div>
  );
};

export default PaymentStatus;