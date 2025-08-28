export const getColumnWidths = (type) => {
  switch (type) {
    case "user":
      return {
        "Reg. No": 25,
        "Registration Date": 30,
        "Gender": 20,
        "Name": 40,
        "Age": 20,
        "Father/Husband Name": 40,
        "Contact": 35,
        "Address": 50,
        "Family Members": 25,
        "CNIC": 30,
        "Status": 25,
        "Job Status": 25,
        "Job Type": 30,
        "Monthly Income": 25,
        "Referral Person": 35,
        "Verified": 20,
      };

    case "distributor":
      return {
        "Reg. No": 25,
        "Registration Date": 30,
        "Name": 40,
        "Father/Husband Name": 40,
        "Gender": 20,
        "Age": 20,
        "Contact": 35,
        "Address": 50,
        "CNIC": 30,
        "Status": 25,
        "Job Status": 25,
        "Referral Person": 35,
        "Verified": 20,
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
