export default function PaymentReportTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Transaction ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i}>
              <td className="p-2 border">{p.transactionId}</td>
              <td className="p-2 border">{p.user}</td>
              <td className="p-2 border">{p.amount}</td>
              <td className="p-2 border">{p.status}</td>
              <td className="p-2 border">{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
