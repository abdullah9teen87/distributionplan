export default function UserReportTable({ data }) {
  const currentDateTime = new Date().toLocaleString(); // date + time

  return (
    <div className="overflow-x-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-bold">User Report</h2>
        <p className="text-sm text-gray-600">Generated on: {currentDateTime}</p>
      </div>

       {/* Table */}
      <table className="w-full bg-white  border border-gray-200 text-xs">
        <thead className="bg-gray-200 ">
          <tr>
            <th className="p-2 border w-1/12 truncate">Reg. No</th>
            {/* <th className="p-2 border w-1/12 truncate">Reg. Date</th> */}
            <th className="p-2 border w-1/12 truncate">Gender</th>
            <th className="p-2 border w-1/12 truncate">Name</th>
            <th className="p-2 border w-1/12 truncate">Age</th>
            <th className="p-2 border w-1/12 text-wrap truncate">Father/Husband Name</th>
            <th className="p-2 border w-1/12 truncate">Contact</th>
            <th className="p-2 border w-1/12 truncate">Address</th>
            <th className="p-2 border w-1/12 text-wrap truncate">Family Members</th>
            <th className="p-2 border w-1/12 truncate">CNIC</th>
            {/* <th className="p-2 border w-1/12 truncate">Detail</th> */}
            <th className="p-2 border w-1/12 truncate">Status</th>
            <th className="p-2 border w-1/12 truncate">Job Status</th>
            <th className="p-2 border w-1/12 truncate">Job Type</th>
            <th className="p-2 border w-1/12 text-wrap truncate">Monthly Income</th>
            <th className="p-2 border w-1/12 text-wrap truncate">Referral Person</th>
          </tr>
        </thead>
        <tbody>
          {data.map((u, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="p-2 border w-1/12 truncate">{u.registrationNumber}</td>
              {/* <td className="p-2 border w-1/12 truncate">{new Date(u.registrationDate).toLocaleDateString()}</td> */}
              <td className="p-2 border w-1/12 truncate">{u.gender}</td>
              <td className="p-2 border w-1/12 truncate">{u.name}</td>
              <td className="p-2 border w-1/12 truncate">{u.age}</td>
              <td className="p-2 border w-1/12 truncate">{u.fatherHusbandName}</td>
              <td className="p-2 border w-1/12 truncate">{u.contactNumber}</td>
              <td className="p-2 border w-1/12 truncate">{u.address}</td>
              <td className="p-2 border w-1/12 truncate">{u.familyMembers}</td>
              <td className="p-2 border w-1/12 truncate">{u.cnicNumber}</td>
              {/* <td className="p-2 border w-1/12 truncate">{u.detail}</td> */}
              <td className="p-2 border w-1/12 truncate">{u.status}</td>
              <td className="p-2 border w-1/12 truncate">{u.jobStatus}</td>
              <td className="p-2 border w-1/12 truncate">{u.jobType}</td>
              <td className="p-2 border w-1/12 truncate">{u.monthlyIncome}</td>
              <td className="p-2 border w-1/12 truncate">{u.referalPerson}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
