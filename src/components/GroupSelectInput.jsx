import { useState, useRef, useEffect } from "react";

function GroupSelectInput({ form, setForm, groups, disabled, label }) {
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

  const handleSelect = (group) => {
    setForm((prev) => ({ ...prev, distributorGroup: group._id }));
    setOpen(false);
  };

  const selectedGroup = groups.find(
    (g) => g._id === form.distributorGroup
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
          {selectedGroup
            ? `${selectedGroup.distributor.name} | ${selectedGroup.areas.join(", ")}`
            : `Select ${label}`}
        </span>
        <span className="text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown List */}
      {open && !disabled && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {groups.map((g) => (
            <div
              key={g._id}
              className="px-3 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(g)}
            >
              <span className="truncate capitalize">{g.distributor.name}</span>
              <span className="text-gray-500 text-sm truncate">{g.areas.join(", ")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupSelectInput;
