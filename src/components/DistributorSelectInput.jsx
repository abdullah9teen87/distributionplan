import { useState, useRef, useEffect } from "react";

function DistributorSelectInput({ form, setForm, distributors, disabled, label }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (distributor) => {
    setForm((prev) => ({ ...prev, distributor: distributor._id }));
    setOpen(false);
  };

  const selectedDistributor = distributors.find(
    (d) => d._id === form.distributor
  );

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="font-medium mb-1">{label}</label>

      {/* Dropdown Button */}
      <div
        className={`input-field flex items-center justify-between cursor-pointer ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="truncate">
          {selectedDistributor
            ? `${selectedDistributor.name} - ${selectedDistributor.cnicNumber}`
            : "Select Distributor"}
        </span>
        <span className="text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown List */}
      {open && !disabled && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {distributors.map((d) => (
            <div
              key={d._id}
              className="px-3 capitalize flex justify-between items-center py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(d)}
            >
                <span>{d.name}</span>
                <span>{d.cnicNumber}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DistributorSelectInput;
