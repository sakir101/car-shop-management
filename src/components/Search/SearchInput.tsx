import React, { useState, useEffect } from "react";
import { Input, InputProps, List, Spin } from "antd";

interface SearchInputProps extends InputProps {
  data: any[];
  label: string;
  required?: boolean;
  placeholder?: string;
  isDataLoading?: boolean;
  renderData?: (item: any) => string;
  onSelect?: (item: any) => void;
  onSearchChange?: (value: string) => void;
  onCreate?: (item: any) => void;
  isCreateDisabled?: boolean;
  showSelectedItemOnInput?: boolean;
}

/**
 * SearchInput component allows users to search through a list of data, select an item, or create a new item if no results are found.
 *
 * @component
 * @param {SearchInputProps} props - The props for the SearchInput component.
 * @param {any[]} props.data - The data to search through.
 * @param {string} props.label - The label for the search input.
 * @param {boolean} [props.required=true] - Whether the input is required.
 * @param {string} [props.placeholder] - The placeholder text for the input.
 * @param {function} props.onSelect - Callback function when an item is selected.
 * @param {function} props.renderData - Function to render the data items.
 * @param {function} props.onSearchChange - Callback function when the search value changes.
 * @param {function} props.onCreate - Callback function when a new item is created.
 * @param {boolean} [props.showSelectedItemOnInput] - Whether to show the selected item in the input field.
 * @param {boolean} [props.isCreateDisabled=false] - Whether the create option is disabled.
 * @param {object} props.inputProps - Additional props for the input element.
 *
 * @returns {JSX.Element} The rendered SearchInput component.
 */
const SearchInput: React.FC<SearchInputProps> = ({
  data,
  label,
  required = true,
  placeholder,
  onSelect,
  renderData,
  onSearchChange,
  onCreate,
  showSelectedItemOnInput,
  isCreateDisabled = false,
  isDataLoading,
  ...inputProps
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    setFilteredData(
      searchValue
        ? data?.filter((item) => {
            const itemValue = renderData ? renderData(item) : item;
            return itemValue
              ?.toLowerCase()
              ?.includes(searchValue.trim().toLowerCase());
          })
        : []
    );
  }, [data, renderData, searchValue]);
  const handleSearch = (value: string) => {
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleItemClick = (item: any) => {
    const itemValue = renderData ? renderData(item) : item;
    setSelectedItem(itemValue);
    setSearchValue("");
    setFilteredData([]);
    onSelect?.(item);
  };

  return (
    <div className="relative">
      <div className="mb-2">
        {label}
        {required && <span style={{ color: "red" }}>*</span>}
      </div>
      <Input
        className={`w-full h-10 ${
          showSelectedItemOnInput && selectedItem && "bg-gray-300"
        }`}
        required={required}
        placeholder={placeholder || "Type your search query..."}
        value={
          showSelectedItemOnInput && selectedItem ? selectedItem : searchValue
        }
        onChange={(e) => handleSearch(e.target.value)}
        onClick={() => {
          setSearchValue(renderData ? renderData(selectedItem) : "");
          setSelectedItem(null);
        }}
        {...inputProps}
      />
      {isDataLoading ? (
        <List
          className="bg-white z-50 shadow-lg mt-2 max-h-52 absolute overflow-y-auto w-full"
          bordered
        >
          <List.Item className="flex justify-center">
            <Spin />
          </List.Item>
        </List>
      ) : filteredData?.length > 0 ? (
        <List
          className="bg-white z-50 shadow-lg mt-2 max-h-52 absolute overflow-y-auto w-full"
          bordered
          dataSource={filteredData}
          renderItem={(item) => (
            <List.Item
              onClick={() => handleItemClick(item)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {renderData ? renderData(item) : item.name}
            </List.Item>
          )}
        />
      ) : (
        searchValue &&
        !selectedItem && (
          <List
            className="bg-white z-50 shadow-lg mt-2 max-h-52 absolute overflow-y-auto w-full"
            bordered
          >
            <List.Item
              className={`${
                !isCreateDisabled && "cursor-pointer hover:bg-gray-100"
              }`}
              onClick={() => {
                if (!isCreateDisabled) {
                  onCreate?.(searchValue);
                  setSearchValue("");
                }
              }}
            >
              {isCreateDisabled
                ? "No results found"
                : `Create "${searchValue}"`}
            </List.Item>
          </List>
        )
      )}
    </div>
  );
};

export default SearchInput;
