"use client";
import { useState } from "react";

const PaymentForm = ({ onSubmit }) => {
  const [userName, setUserName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  const handleSubmit = (e) => {
    e.preventDefault();
    const paymentDetails = {
      userName,
      amount,
      paymentMethod,
    };
    onSubmit(paymentDetails);
    setUserName('');
    setAmount('');
    setPaymentMethod('creditCard');
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div>
        <label htmlFor="userName">User Name:</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="paymentMethod">Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="creditCard">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bankTransfer">Bank Transfer</option>
        </select>
      </div>
      <button type="submit">Submit Payment</button>
    </form>
  );
};

export default PaymentForm;