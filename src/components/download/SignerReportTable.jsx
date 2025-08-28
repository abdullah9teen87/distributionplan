export default function SignerReportTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Admin Approved</th>
            <th className="p-2 border">Created At</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={i}>
              <td className="p-2 border">{s.name}</td>
              <td className="p-2 border">{s.email}</td>
              <td className="p-2 border">{s.role}</td>
              <td className="p-2 border">{s.isAdminApprove ? "Yes" : "No"}</td>
              <td className="p-2 border">{s.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
