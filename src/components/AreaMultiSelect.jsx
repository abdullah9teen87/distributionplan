import { AREAS } from "@/data/cities";
import { useState, useRef, useEffect } from "react";

function AreaMultiSelect({ form, setForm, disabled }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleArea = (area) => {
    setForm((prev) => {
      let newAreas = [...(prev.areas || [])];
      if (newAreas.includes(area)) {
        newAreas = newAreas.filter((a) => a !== area);
      } else {
        newAreas.push(area);
      }
      return { ...prev, areas: newAreas };
    });
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="font-medium mb-1">Areas</label>

      {/* Dropdown Button */}
      <div
        className="input-field flex items-center justify-between cursor-pointer"
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className="truncate">
          {form.areas && form.areas.length > 0
            ? form.areas.join(", ")
            : "Select Areas"}
        </span>
        <span className="text-gray-500 text-sm">{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown List */}
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {AREAS.map((area) => (
            <label
              key={area}
              className="flex justify-between items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={(e) => e.stopPropagation()} // ✅ prevent parent toggle
            >
              <span>{area}</span>
              <input
                type="checkbox"
                checked={form.areas?.includes(area) || false}
                onChange={() => toggleArea(area)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default AreaMultiSelect;
