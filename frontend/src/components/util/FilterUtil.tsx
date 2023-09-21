import React, { useEffect, useState } from "react";

interface FilterProps {
  data: any[];
  onFilter: (filteredData: any[]) => void;
}

const FilterComponent: React.FC<FilterProps> = ({ data, onFilter }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const statuses = ["All", "Canceled", "Fulfilled", "Pending"];

  useEffect(() => {
    let filteredData = [...data];

    if (selectedStatus && selectedStatus !== "All") {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
    }

    onFilter(filteredData);
  }, [selectedStatus, data, onFilter]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  return (
    <div className="card flex justify-content-center">
      <select
        value={selectedStatus}
        onChange={handleChange}
        className="w-full p-1 rounded-sm bg-ca2 md:w-14rem cursor-pointer select-dropdown"
      >
        {statuses.map((status, index) => (
          <option
            className="cursor-pointer select-option"
            key={status + ` ${index}`}
            value={status}
          >
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterComponent;
