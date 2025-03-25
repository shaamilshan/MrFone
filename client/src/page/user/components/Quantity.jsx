import React from "react";

const Quantity = ({ count, setCount }) => {
  const handleChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) value = 1; // Prevent invalid input
    setCount(value);
  };

  return (
    <div className="flex items-center rounded-lg p-2 font-bold border">
      <input
        type="number"
        value={count}
        onChange={handleChange}
        min="1"
        className="w-16 text-center text-xl  border-gray-300 rounded-md outline-none"
      />
    </div>
  );
};

export default Quantity;
