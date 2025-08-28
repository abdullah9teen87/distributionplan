export default function GroupReportTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Group Name</th>
            <th className="p-2 border">Members Count</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((g, i) => (
            <tr key={i}>
              <td className="p-2 border">{g.groupName}</td>
              <td className="p-2 border">{g.membersCount}</td>
              <td className="p-2 border">{g.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
