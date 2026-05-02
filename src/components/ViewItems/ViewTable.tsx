import Trow from "../ViewItems/Trow";

interface ViewTableProps {
  ItemArray: Array<Record<string, any>>;
  page: string;
  pageTitle?: string;
  isLoading?: boolean;
  handleViewService?: (service: any) => void;
}

const SkeletonHeaderCell = () => (
  <th className="py-4 px-3 w-[30%]">
    <div className="h-6 bg-gray-200 rounded animate-pulse  mx-auto"></div>
  </th>
);



const ViewTable: React.FC<ViewTableProps> = ({
  ItemArray,
  page,
  pageTitle,
  isLoading,
  handleViewService,
}) => {
  // Determine how many skeleton rows to show
  const skeletonCount = 30;
  return (
    <div className={`rounded border border-solid border-gray-300`}>
      {pageTitle && (
        <h1 className="text-xl ml-2 font-semibold ">
          {isLoading ? (
            <div className="h-8 bg-gray-300 rounded animate-pulse w-1/4"></div>
          ) : (
            pageTitle
          )}
        </h1>
      )}

      <div
        className={`overflow-x-auto border ${
          page === "inspection-item" || page === "estimate"|| page === "work-order"
            ? "max-h-full overflow-y-auto"
            : ""
        } ${
          [
            "related-services",
            "related-inspections",
            "inspection-item-general-tire",
          ].includes(page)
            ? "max-h-[300px] overflow-y-auto"
            : ""
        }`}
      >
        <table
          className={`  w-full mx-auto  border-collapse border border-gray-300`}
        >
          <thead>
            <tr className="text-left ">
              {isLoading ? (
                <>
                  <SkeletonHeaderCell  />
                  <SkeletonHeaderCell />
                  <SkeletonHeaderCell />
                  {!["inspection-item-general-tire"].includes(page) && (
                    <SkeletonHeaderCell />
                  )}
                </>
              ) : (
                <>
                  <th
                    className={`py-2 px-3 w-[25%]  ${
                      [
                        "inspection-item",
                        "inspection-item-group",
                        "estimate",
                        "work-order",
                        "contact",
                        "service",
                        "related-services",
                        "related-inspections",
                        "related-services-search",
                        "related-inspections-search",
                        "inspection-item-general-tire",
                        "concern",
                        "inspection",
                      ].includes(page)
                        ? ""
                        : "hidden"
                    }`}
                  >
                    Name
                  </th>
                  <th
                    className={`px-3 ${
                      [
                        "service",
                        "inspection-item-group",
                        "inspection-item",
                        "related-services",
                        "related-inspections",
                        "related-services-search",
                        "related-inspections-search",
                        "inspection-item-general-tire",
                        "concern",
                        "inspection",
                      ].includes(page)
                        ? ""
                        : "hidden"
                    }`}
                  >
                    Code
                  </th>
                  <th
                    className={` px-3 ${
                      [
                        "service",
                        "concern",
                        "inspection-item-group",
                        "inspection",
                        "contact",
                        "estimate",
                        "work-order"
                      ].includes(page)
                        ? ""
                        : "hidden"
                    }`}
                  >
                    Created_At
                  </th>
                  <th
                    className={`${
                     ( page === "estimate" || page==='work-order') ? "" : "hidden"
                    }`}
                  >
                    Number Plate
                  </th>
                  <th
                    className={` px-3 ${
                      [
                        "inspection-item",
                        "related-services",
                        "related-inspections",
                        "related-services-search",
                        "related-inspections-search",
                      ].includes(page)
                        ? ""
                        : "hidden"
                    }`}
                  >
                    Type
                  </th>
                  <th
                    className={` px-3 ${
                      page === "contact" ? "" : "hidden"
                    }`}
                  >
                    Role
                  </th>
                  <th
                    className={`py-4 px-3 rounded-l-lg ${
                      page === "inspection-group" ? "" : "hidden"
                    }`}
                  >
                    Labor Name
                  </th>
                  <th
                    className={`py-4 px-3 ${
                      page === "inspection-group" ? "" : "hidden"
                    }`}
                  >
                    Labor
                  </th>
                  <th
                    className={`py-4 px-3 ${
                      page === "inspection-group" ? "" : "hidden"
                    }`}
                  >
                    Hourly Rate
                  </th>
                  <th
                    className={`py-4 px-3 ${
                      page === "inspection-group" ? "" : "hidden"
                    }`}
                  >
                    Total
                  </th>
                  <th
                    className={` px-3  ${
                      page === "inspection-item-general-tire" ? "" : "hidden"
                    }`}
                  >
                    Item Type
                  </th>
                  {page === "inspection-item-general-tire"||page === 'inspection-item-inspectionPercentage'||page ==='inspection-item-inspectionHour' || page ==="service-item-part" ||page ==='service-item-labour' ||page ==="service-item-mechanicPercentage"? (
                    ""
                  ) : (
                    <th className=" text-center w-[10%]">
                      Actions
                    </th>
                  )}
                </>
              )}
            </tr>
          </thead>

         <tbody>
             {isLoading ? (
               Array.from({ length: skeletonCount }).map((_, index) => (
                 <Trow
                   key={`skeleton-${index}`}
                   isLoading={true}
                   dataObj={{ item: {}, index }}
                   page={page}
                   handleViewService={handleViewService}
                   ItemArray={[]}
                 />
               ))
             ) : ItemArray && ItemArray.length > 0 ? (
               ItemArray.map((item: any, index: number) => (
                 <Trow
                   key={item.id || index}
                   isLoading={false}
                   dataObj={{ item, index }}
                   page={page}
                   handleViewService={handleViewService}
                   ItemArray={ItemArray}
                 />
               ))
             ) : (
               page !== "service-item-part" && page !== "service-item-mechanicPercentage" && page !== "inspection-item-inspectionHour" &&
               page !== "service-item-labour" && page!="part"&& page!="inspection-item-inspectionPercentage"&& (
                 <tr>
                   <td
                     colSpan={100}
                     className="text-center py-10 h-[calc(100vh-150px)] text-gray-500"
                   >
                     <div className="flex flex-col items-center gap-2">
                       <span className="text-lg font-semibold">No data found</span>
                       <span className="text-sm text-gray-400">
                         There are no records to display at the moment.
                       </span>
                     </div>
                   </td>
                 </tr>
               )
             )}
           </tbody>


        </table>
      </div>
    </div>
  );
};

export default ViewTable;
