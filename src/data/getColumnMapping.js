export const getColumnMapping = (type) => {
  switch (type) {
    case "user":
      return {
        "Reg. No": "registrationNumber",
        Gender: "gender",
        Name: "name",
        Age: "age",
        "Father/Husband Name": "fatherHusbandName",
        Contact: "contactNumber",
        Address: "address",
        "Family Members": "familyMembers",
        CNIC: "cnicNumber",
        Status: "status",
        "Job Status": "jobStatus",
        "Job Type": "jobType",
        "Monthly Income": "monthlyIncome",
        "Referral Person": "referalPerson",
        Verified: "isVerified",
      };

    case "distributor":
      return {
        "Reg. No": "registrationNumber",
        // "Registration Date": "registrationDate",
        Name: "name",
        "Father/Husband Name": "fatherHusbandName",
        Gender: "gender",
        Age: "age",
        Contact: "contactNumber",
        Address: "address",
        CNIC: "cnicNumber",
        Status: "status",
        "Job Status": "jobStatus",
        "Referral Person": "referalPerson",
        Verified: "isVerified",
      };

    case "signer":
      return {
        Name: "name",
        Email: "email",
        Role: "role",
        Verified: "isVerified",
        "Admin Approved": "adminApproved",
      };

    case "distributorGroup":
      return {
        Distributor: "distributor",
        Areas: "areas",
        User: "user",
        Amount: "amount",
        "Total Amount": "totalAmount",
        Active: "active",
      };

    case "distributorPayment":
      return {
        "Distributor Group": "distributorGroup",
        Month: "month",
        User: "user",
        Amount: "amount",
        Status: "status",
        "Carry Forward": "carryForward",
        "Total Amount": "totalAmount",
        "Paid Amount": "paidAmount",
        "Pending Amount": "pendingAmount",
        Remarks: "remarks",
      };

    case "payment":
      return {
        Amount: "amount",
        Date: "date",
        User: "user",
        Status: "status",
        Remarks: "remarks",
      };

    default:
      return {};
  }
};
