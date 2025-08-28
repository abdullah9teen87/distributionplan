export default function DistributorReportTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Region</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.email}</td>
              <td className="p-2 border">{d.region}</td>
              <td className="p-2 border">{d.status}</td>
              <td className="p-2 border">{d.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
