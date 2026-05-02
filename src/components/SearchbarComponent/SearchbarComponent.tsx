"use client";

import { Input, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";

interface ISearchInput {
  placeholder?: string;
  size?: "large" | "small"|"middle";
  resetFilters: () => void;
}

const SearchInput = ({
  placeholder = "Search...",
  resetFilters,
}: ISearchInput) => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const [localTerm, setLocalTerm] = useState<string>(searchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setLocalTerm(term);
    dispatch(setSearchTerm(term));
  };

  const handleReset = () => {
    setLocalTerm("");
    dispatch(setSearchTerm(""));
    resetFilters();
  };


  return (
    <div className="w-full flex">
      <Input
        type="text"
        placeholder={placeholder}
        className="w-full lg:w-full rounded"
        value={searchTerm || ""}
        onChange={handleInputChange}
      />
      {!!localTerm && (
        <Button
          onClick={handleReset}
          type="primary"
          size="small"
          className="ml-2 rounded py-[15px]"
        >
          <ReloadOutlined />
        </Button>
      )}
    </div>
  );
};

export default SearchInput;
