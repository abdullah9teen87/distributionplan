export default function DistributorReportTable({ data }) {
  const currentDateTime = new Date().toLocaleString(); // date + time

  return (
    <div className="overflow-x-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-bold">Distributor Report</h2>
        <p className="text-sm text-gray-600">Generated on: {currentDateTime}</p>
      </div>
      <table className="w-full bg-white  border border-gray-200 text-xs">
        <thead className="bg-gray-200 ">
          <tr>
            <th className="p-2 border w-1/12 truncate">Reg No.</th>
            <th className="p-2 border w-2/12 truncate">Nae</th>
            <th className="p-2 border w-2/12 truncate">Father/Husband Name</th>
            <th className="p-2 border w-1/12 truncate">Gender</th>
            <th className="p-2 border w-1/12 truncate">Age</th>
            <th className="p-2 border w-1/12 truncate">CNIC No.</th>
            <th className="p-2 border w-1/12 truncate">Contact No.</th>
            <th className="p-2 border w-2/12 truncate">Address</th>
            <th className="p-2 border w-1/12 truncate">Status</th>
            <th className="p-2 border w-1/12 truncate">Refferal Person</th>
            {/* <th className="p-2 border">Created At</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td className="p-2 border w-1/12 truncate">{d.registrationNumber}</td>
              <td className="p-2 border w-2/12 truncate">{d.name}</td>
              <td className="p-2 border w-2/12 truncate">{d.fatherHusbandName}</td>
              <td className="p-2 border w-1/12 truncate">{d.gender}</td>
              <td className="p-2 border w-1/12 truncate">{d.age}</td>
              <td className="p-2 border w-1/12 truncate">{d.cnicNumber}</td>
              <td className="p-2 border w-1/12 truncate">{d.contactNumber}</td>
              <td className="p-2 border w-2/12 truncate">{d.address}</td>
              <td className="p-2 border w-1/12 truncate">{d.status}</td>
              <td className="p-2 border w-1/12 truncate">{d.referalPerson}</td>
              {/* <td className="p-2 border">{d.createdAt}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
