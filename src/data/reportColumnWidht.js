export const getColumnWidths = (type) => {
  switch (type) {
    case "user":
      return {
        "Reg. No": 10,
        // "Registration Date": 15,
        "Gender": 15,
        "Name": 25,
        "Age": 10,
        "Father/Husband Name": 25,
        "Contact": 25,
        "Address": 35,
        "Family Members": 15,
        "CNIC": 25,
        "Status": 20,
        "Job Status": 20,
        "Job Type": 20,
        "Monthly Income": 15,
        "Referral Person": 20,
        // "Verified": 20,
      };

    case "distributor":
      return {
        "Reg. No": 10,
        // "Registration Date": 30,
        "Name": 35,
        "Father/Husband Name": 35,
        "Gender": 15,
        "Age": 15,
        "Contact": 20,
        "Address": 40,
        "CNIC": 30,
        "Status": 20,
        "Job Status": 20,
        "Referral Person": 35,
        // "Verified": 20,
      };

    case "signer":
      return {
        "Name": 40,
        "Email": 60,
        "Role": 25,
        "Verified": 20,
        "Admin Approved": 20,
      };

    case "distributorGroup":
      return {
        "Distributor": 40,
        "Areas": 60,
        "User": 40,
        "Amount": 25,
        "Total Amount": 30,
        "Active": 20,
      };

    case "distributorPayment":
      return {
        "Distributor Group": 40,
        "Month": 25,
        "User": 40,
        "Amount": 25,
        "Status": 20,
        "Carry Forward": 25,
        "Total Amount": 30,
        "Paid Amount": 30,
        "Pending Amount": 30,
        "Remarks": 50,
      };

    case "payment":
      return {
        "Amount": 30,
        "Date": 25,
        "User": 35,
        "Status": 25,
        "Remarks": 40,
      };

    default:
      return {}; // fallback: auto width
  }
};
