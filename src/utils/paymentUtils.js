export function calculateTotalPayment(payments) {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}

export function validatePaymentInfo(paymentInfo) {
  const { amount, userId } = paymentInfo;
  if (!amount || amount <= 0) {
    return { valid: false, message: "Amount must be greater than zero." };
  }
  if (!userId) {
    return { valid: false, message: "User ID is required." };
  }
  return { valid: true, message: "Payment information is valid." };
}

export function formatPaymentDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}