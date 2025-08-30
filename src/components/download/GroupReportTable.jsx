export default function GroupReportTable({ data }) {
  const currentDateTime = new Date().toLocaleString(); // date + time


  return (
    <div className="overflow-x-auto">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-bold">Group Report</h2>
        <p className="text-sm text-gray-600">Generated on: {currentDateTime}</p>
      </div>
      <table className="w-full bg-white  border border-gray-200 text-xs">
        <thead className="bg-gray-200 ">
          <tr>
            <th className="p-2 border">Group Name</th>
            <th className="p-2 border">Members Count</th>
            <th className="p-2 border">Members Count</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Active/Deactive</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((g, i) => (
            <tr key={i}>
              <td className="p-2 border">{g.distributor.name}</td>
              <td className="p-2 border">{g.users.length}</td>
              <td className="p-2 border">{g.users.amount}</td>
              <td className="p-2 border">{g.totalAmount}</td>
              <td className="p-2 border">{g.active}</td>
              <td className="p-2 border">{g.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
