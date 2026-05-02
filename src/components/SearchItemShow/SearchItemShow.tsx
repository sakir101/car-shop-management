import React, { useEffect } from "react";
import SearchCard from "../SearchCard/SearchCard";
import { useDispatch } from "react-redux";
import {
  initializeRadioStates,
  initializeSelectedStage,
  initializeSelectedTypes,
} from "@/redux/slice/selectionSlice";
import Loading from "@/app/loading";

const SearchItemShow = ({
  data,
  type,
  page,
  operation,
  isLoading,
  resetKey
}: {
  data: any;
  type: boolean;
  page?: string;
  operation?: string;
  isLoading?:boolean;
  resetKey?:number
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const codes = [...data.map((item: { code: any; }) => item.code)];
    if (page === "estimate"||page=='service-advisor') {
      dispatch(initializeRadioStates({ codes, radioState: "Accept" }));
      dispatch(initializeSelectedStage({ items: data, radioState: "Accept" }));
    } else {
      dispatch(initializeRadioStates({ codes, radioState: "Recommended" }));
      dispatch(initializeSelectedTypes({ items: data, radioState: "Recommended" }));
    }
  },[data, page, resetKey, dispatch]);



  return (
         <div className="bg-[#F9F9F9] p-2 rounded h-60 scroll-smooth overflow-auto scrollbar-hide flex flex-col">
               {isLoading ? (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm italic">
            <Loading></Loading>
          </div>
        ) : data && data.length > 0 ? (
          data.map((item: any) => (
            <SearchCard
              key={`${item.code}-${resetKey}`}
              item={item}
              page={page}
              type={type}
              operation={operation}
            />
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500 text-sm italic">
            No records found
          </div>
        )}

 </div>

  );
};

export default SearchItemShow;
