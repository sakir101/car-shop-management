"use client";

import React, { useState, useEffect } from "react";
import SearchInput from "@/components/Search/SearchInput";
import { useSearchInspectionMutation } from "@/redux/api/inspection";
import { useGetAllInspectionMutation } from "@/redux/api/serviceApi";

interface InspectionSearchProps {
  onChange?: (item: string) => void;
  onSelect?: (item: any) => void;
  onCreateNewItem?: (item: any) => void;
}

/**
 * InspectionSearch component allows users to search for inspections by name.
 * It uses a search input field to query inspections and displays the results.
 *
 * @component
 * @param {InspectionSearchProps} props - The props for the InspectionSearch component.
 * @param {function} props.onChange - Callback function to handle input change.
 * @param {function} props.onSelect - Callback function to handle item selection.
 * @param {function} props.onCreateNewItem - Callback function to handle creation of a new item.
 *
 * @returns {JSX.Element} The rendered InspectionSearch component.
 *
 * @example
 * <InspectionSearch
 *   onChange={(query) => console.log(query)}
 *   onSelect={(item) => console.log(item)}
 *   onCreateNewItem={() => console.log('Create new item')}
 * />
 */
const InspectionSearch: React.FC<InspectionSearchProps> = ({
  onChange,
  onSelect,
  onCreateNewItem,
}) => {
  const [getInspection, { isLoading }] = useGetAllInspectionMutation();
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      if (query) {
        try {
          const response = await getInspection(query).unwrap();
          setData(response || response);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [query, getInspection]);

  const handleInputChange = (item: string) => {
    setQuery(item);
    onChange?.(item);
  };

  const handleSelect = (item: any) => {
    onSelect?.(item);
  };

  return (
    <div>
      <SearchInput
        label="Enter Inspection Name"
        required={false}
        placeholder="Search for inspections"
        onSearchChange={handleInputChange}
        isDataLoading={isLoading}
        data={data[0]}
        renderData={(item) => item?.name || item?.title}
        onSelect={handleSelect}
        // onCreate={onCreateNewItem}
        isCreateDisabled={true}
      />
    </div>
  );
};

export default InspectionSearch;
