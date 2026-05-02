"use client";

import { ReactElement, ReactNode, useEffect, useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  formKey: string;
  label?: string;
  onInputChange?: (query: string) => void;
  debounceTime?: number;
  children?: ReactElement | ReactNode;
};

const SearchBar = ({
  placeholder = "Search...",
  formKey,
  label,
  onInputChange,
  debounceTime = 300,
}: SearchBarProps) => {
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    localStorage.setItem(`searchValue_${formKey}`, value);
  };

  // Emit the input value after debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onInputChange) onInputChange(query);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [query, debounceTime, onInputChange]);

  // Restore the last search value on mount (if it exists)
  useEffect(() => {
    const storedSearchValue = localStorage.getItem(`searchValue_${formKey}`);
    if (storedSearchValue) {
      setQuery(storedSearchValue);
    }
  }, [formKey]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {label && (
        <div style={{ marginBottom: "8px", fontSize: "16px" }}>{label}</div>
      )}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        style={{
          padding: "8px",
          fontSize: "14px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          width: "100%",
          color: "black",
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default SearchBar;
