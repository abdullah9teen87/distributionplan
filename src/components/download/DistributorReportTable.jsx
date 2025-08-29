export default function DistributorReportTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Reg No.</th>
            <th className="p-2 border">Nae</th>
            <th className="p-2 border">Father/Husband Name</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Age</th>
            <th className="p-2 border">CNIC No.</th>
            <th className="p-2 border">Contact No.</th>
            <th className="p-2 border">Address</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Refferal Person</th>
            {/* <th className="p-2 border">Created At</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td className="p-2 border">{d.registrationNumber}</td>
              <td className="p-2 border">{d.name}</td>
              <td className="p-2 border">{d.fatherHusbandName}</td>
              <td className="p-2 border">{d.gender}</td>
              <td className="p-2 border">{d.age}</td>
              <td className="p-2 border">{d.cnicNumber}</td>
              <td className="p-2 border">{d.contactNumber}</td>
              <td className="p-2 border">{d.address}</td>
              <td className="p-2 border">{d.status}</td>
              <td className="p-2 border">{d.referalPerson}</td>
              {/* <td className="p-2 border">{d.createdAt}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
