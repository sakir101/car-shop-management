
'use client'
import Loading from "@/app/loading";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import GeneralItem from "@/components/ServiceAdvisorItems/GeneralItem";
import TireItem from "@/components/ServiceAdvisorItems/TireItem";
import { useGetAllEstimatesForServiceAdvisorQuery } from "@/redux/api/serviceAdvisorApi";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { getUserInfo } from "@/services/auth.service";
import { Pagination } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const AssignServiceToReport = () => {
  const dispatch = useDispatch();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(5);
  const { role} = getUserInfo() as any;
  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 300,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const {
    data: allEstimates,
    isLoading,
  } = useGetAllEstimatesForServiceAdvisorQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const allEstimatesData: any = allEstimates?.data;
  const allEstimatesMeta: any = allEstimates?.meta;

  const handlePageChange = (currentPage: number) => {
    setPage(currentPage);
  };

  useEffect(() => {
    dispatch(setSearchTerm(""));
  }, [dispatch]);
  const router =useRouter()

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="view-page-container text-sm">
      {/* Search */}
      <div className="flex justify-center items-center mb-3">
        <SearchInput
          placeholder="Search..."

          resetFilters={resetFilters}
        />
      </div>

      <div className="border border-gray-200 rounded">
        {isLoading ? (
          <Loading />
        ) : allEstimatesData?.length > 0 ? (
          allEstimatesData.map((estimate: any, index: number) => (
            <div
              key={index}
              className="mb-2 border  border-solid border-gray-300 rounded relative p-2"
            >
              {/* Action buttons */}
              <div className="flex justify-end gap-2 mb-2 absolute top-2 right-2">
               <button
                 onClick={()=>router.push(`/${role}/assignService/single-work-order/${estimate?.code}`)}
                 className="bg-[#1F2937] border-none outline-none text-xs px-2 py-1 text-white rounded font-semibold cursor-pointer transition"
               >
                 View
               </button>
         
               <button
                 onClick={()=>router.push(`/${role}/assignService/serviceReport/${estimate?.code}`)}
                 className="bg-[#1F2937] font-semibold text-xs px-2 py-1 border-none outline-none rounded cursor-pointer text-white transition"
               >
                 {estimate.status === "Report_Generated"
                   ? "View Report"
                   : "Generate Report"}
               </button>
             </div>

              {/* Estimate Info */}
              <h3 className="font-medium mb-2 text-gray-800 text-base">
              {estimate.title}
              </h3>

             <div className="flex flex-col sm:flex-row items-start gap-3 justify-between">
               {/* Customer Info */}
               <div className="w-full border border-gray-200 rounded p-2 border-solid">
                 <p className="flex justify-between">
                   <span className="font-medium">Customer:</span>
                   <span>{estimate?.customers[0]?.user?.name || "N/A"}</span>
                 </p>
                 <p className="flex justify-between">
                   <span className="font-medium">Phone:</span>
                   <span>{estimate?.customers[0]?.user?.contactNum || "N/A"}</span>
                 </p>
                 <p className="flex justify-between">
                   <span className="font-medium">Email:</span>
                   <span>{estimate?.customers[0]?.user?.email || "N/A"}</span>
                 </p>
                 <p className="flex justify-between">
                   <span className="font-medium">Address:</span>
                   <span>{estimate?.customers[0]?.user?.address || "N/A"}</span>
                 </p>
               </div>

            {/* Vehicle Info */}
            <div className="w-full">
              {estimate?.vehicle?.map((v: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded p-2 border-solid"
                >
                  <p className="flex justify-between">
                    <span className="font-medium">Plate:</span>
                    <span>{v?.vehicle?.numberPlate || "N/A"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Model:</span>
                    <span>{v?.vehicle?.model || "N/A"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Color:</span>
                    <span>{v?.vehicle?.color || "N/A"}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="font-medium">Condition:</span>
                    <span>{v?.vehicle?.condition || "N/A"}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

              {/* Tire Inspection */}
              {estimate?.technicianInspectionItemTire?.length > 0 && (
                <details className="my-1">
                  <summary className="cursor-pointer font-medium text-gray-700 text-sm">
                    Tire Inspection
                  </summary>
                  <div className="mt-1 space-y-2">
                    {estimate.technicianInspectionItemTire?.map((item: any) => (
                      <TireItem key={item.id} ItemTire={item} />
                    ))}
                  </div>
                </details>
              )}

              {/* General Inspection */}
              {estimate?.technicianInspectionItemGeneral?.length > 0 && (
                <details>
                  <summary className="cursor-pointer font-medium text-gray-700 text-sm">
                    General Inspection
                  </summary>
                  <div className="mt-1 space-y-2">
                    {estimate.technicianInspectionItemGeneral?.map(
                      (item: any) => (
                        <GeneralItem key={item.id} ItemGen={item} />
                      )
                    )}
                  </div>
                </details>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No item to show
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        current={page}
        defaultCurrent={1}
        total={allEstimatesMeta?.total}
        pageSize={5}
        onChange={handlePageChange}
        style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
      />
    </div>
  );
};

export default AssignServiceToReport;
