import React, { useState } from 'react';

const SearchDropdown = ({ options, onSelect, filterFunction, renderOption, placeholder = 'Search...' }) => {
  const [query, setQuery] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Filter options based on the provided filter function
  const filteredOptions = filterFunction ? filterFunction(options, query) : options;

  const handleSelect = (option) => {
    // setQuery(rowKey ? option[rowKey] : JSON.stringify(option));
    setQuery('');
    setDropdownVisible(false);
    onSelect(option);
  };

  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 150);
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setDropdownVisible(true)}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="input  w-full py-2 px-3 rounded-lg  border-[1px] border-solid border-zinc-100 bg-black"
      />

      {/* Dropdown Options */}
      {dropdownVisible && filteredOptions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-black  p-2 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 border-[1px] border-solid border-zinc-100 no-scrollbar ">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(option)}
              className="cursor-pointer"
            >
              {renderOption ? renderOption(option) : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
