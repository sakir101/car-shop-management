"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  List,
  Tag,
  Progress,
  Pagination,
  Select,
  message,
  Button,
  Alert,
} from "antd";

import { getUserInfo } from "@/services/auth.service";
import {
  useGetInspectionDataQuery,
  useUpdateInspectionDataStatusMutation,
} from "@/redux/api/technicianInspectionApi";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { useDispatch } from "react-redux";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { FaEdit } from "react-icons/fa";
import { EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { technicianInspectionStatusOptions } from "@/constant/global";
import Loading from "@/app/loading";

interface Inspection {
  code: string;
  title: string;
  description: string;
  type: string;
  status: string;
  inspectionCode: string;
  percentage: string;
}

interface Estimate {
  title: string;
  type: string;
  concerns: any;
  vehicle: any;
}

interface InspectionData {
  id: string;
  estimateCode: string;
  inspections: Inspection[];
  estimate: Estimate;
}

interface Meta {
  page: number;
  total: number;
}

const TaskView = () => {
  const query: Record<string, any> = {};
  const dispatch = useDispatch();
  const router = useRouter();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [inspectionStatusOption, setInspectionStatusOption] =
    useState<string>("");
  const searchTerm = useAppSelector((state) => state.search.searchTerm);

  const userInfo = getUserInfo();
  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  if (inspectionStatusOption?.length > 0) {
    query["status"] = inspectionStatusOption;
  }

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const userId =
    typeof userInfo === "object" && userInfo !== null && "userId" in userInfo
      ? (userInfo as { userId: string }).userId
      : "";

  const [updateInspectionDataStatus] = useUpdateInspectionDataStatusMutation();
  const { data: allItems, isLoading } = useGetInspectionDataQuery(
    { userId, args: query },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const handlePageChange = (currentPage: number) => {
    setPage(currentPage);
  };

  const allItemsMeta: Meta | undefined = allItems?.meta;

  useEffect(() => {
    if (allItems?.data) {
      // Transform IInspectionService[] to InspectionData[] if needed
      const transformedData: InspectionData[] = allItems.data.map(
        (item: any) => ({
          id: item.id,
          estimateCode: item.estimateCode,
          inspections: item.inspections,
          estimate: item.estimate,
        })
      );
      setInspections(transformedData);
    }
    setSize(5);
    if (allItemsMeta?.page) {
      setPage(allItemsMeta.page);
    }
  }, [userId, allItems, dispatch, allItemsMeta]);

  const handleStatusChange = (
    value: string,
    inspectionCode: string,
    estimateCode: string
  ) => {
    const data = {
      estimateCode,
      inspectionCode,
      status: value,
    };

    updateInspectionDataStatus(data)
      .unwrap()
      .then((response) => {
        message.success("Status updated successfully");
      })
      .catch(() => {
        setError("Failed to update status");
      });
  };

  if (isLoading) {
    return <Loading></Loading>
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={`Error loading inspections: ${error}`}
        type="error"
        showIcon
      />
    );
  }

  const handleInspectionStatusChange = (value: string) => {
    setPage(1);
    setInspectionStatusOption(value);
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="w-[95%] md:w-[90%] mx-auto py-5">
      <div className="flex flex-col lg:flex-row gap-4 w-full">

        {/* Search */}
        <div className="sm:w-[80%]">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>

        {/* Filter */}
        <div className="flex-1 mb-3">
          <Select
            loading={isLoading}
            placeholder="Select Status"
            className="w-full rounded-none"
            optionFilterProp="children"
            onChange={handleInspectionStatusChange}
            options={technicianInspectionStatusOptions}
            allowClear

          />
        </div>

      </div>

      {inspections.length === 0 ? (
        <div className="my-6">
          <Alert message="No inspections found" type="info" showIcon />
        </div>
      ) : (
        inspections.map((item) => (
          <div
            key={item.id}
            className=" border border-gray-200 mb-1 rounded-md  bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">

              {/* Left */}
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-gray-800 truncate">
                  {item.estimate.title}
                </h2>
                <div className="flex flex-col gap-1 text-xs text-gray-500">

                  {/* Vehicle */}
                  {item.estimate.vehicle?.[0]?.vehicle && (
                    <p className="truncate">
                      {item.estimate.vehicle[0].vehicle.year}{"  "}
                      {item.estimate.vehicle[0].vehicle.make}{"  "}
                      {item.estimate.vehicle[0].vehicle.model}{" , "}
                      <span className="font-medium text-gray-700"> License Plate :</span> {item.estimate.vehicle[0].vehicle.numberPlate} {", "}
                      <span className="font-medium text-gray-700">Odometer :</span> {item.estimate.vehicle[0].vehicle.mileage}
                    </p>
                  )}

                  {/* Concern List */}
                  {item.estimate.concerns?.length > 0 && (
                    <div className="flex flex-col gap-[2px] pl-3">

                      {item.estimate.concerns.slice(0, 3).map((c: any, i: any) => (
                        <div key={i} className="flex items-start leading-tight">

                          {/* Bullet */}
                          <span className="mr-1 text-gray-400">•</span>

                          {/* Title + Description */}
                          <span className="truncate">
                            <span className="font-medium text-gray-700">
                              {c.concernTitle}
                            </span>
                            <span className="text-gray-400">
                              {" "}– {c.concernDescription}
                            </span>
                          </span>

                        </div>
                      ))}

                      {item.estimate.concerns.length > 3 && (
                        <span className="text-gray-400 ml-3">
                          +{item.estimate.concerns.length - 3} more
                        </span>
                      )}

                    </div>
                  )}

                </div>
              </div>

            </div>




            <List
              dataSource={item.inspections}
              grid={{
                gutter: 4,
                lg: 1,
                column: 1,
                sm: 1,
                xl: 1,
                xs: 1,
                xxl: 1,
              }}
              renderItem={(inspection) => {
                const percentage = parseInt(inspection.percentage);
                const isCompleted = inspection.status === "Completed";

                return (
                  <List.Item className="mb-1">
                    <div className="w-full bg-white border border-solid p-2 border-gray-200 rounded-lg px-3 flex flex-col sm:flex-row sm:items-center items-start gap-2 justify-between  hover:shadow-sm transition">

                      {/* Left Section */}
                      <div
                        onClick={() =>
                          router.push(
                            `/technician/inspection/${inspection.inspectionCode}/${item.estimateCode}`
                          )
                        }
                        className="flex  items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        {/* Progress */}
                        <Progress
                          type="circle"
                          percent={percentage}
                          size={40}
                          status={inspection.status === "Completed" ? "success" : "active"}
                        />

                        {/* Title + % */}
                        <div className="flex flex-col min-w-0">
                          <h3 className="text-sm font-medium text-gray-800 truncate">
                            {inspection.title}
                          </h3>
                          <span className="text-xs text-gray-400">
                            {percentage}%
                          </span>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex items-center gap-2 flex-shrink-0">

                        <Select
                          defaultValue={inspection.status}
                          onChange={(value) =>
                            handleStatusChange(
                              value,
                              inspection.inspectionCode,
                              item.estimateCode
                            )
                          }
                          size="small"
                          className="w-[120px]"
                        >
                          <Select.Option value="Pending">Pending</Select.Option>
                          <Select.Option value="Completed">Completed</Select.Option>
                          <Select.Option value="In_Progress">
                            In Progress
                          </Select.Option>
                        </Select>

                        {/* {isCompleted && ( */}
                        <Link
                          href={`/technician/itemEdit/${inspection.code}/${item.estimateCode}`}
                        >
                          <Button title="Update Item" size="small" icon={<FaEdit />} ></Button>

                        </Link>
                        {/* )} */}

                        <Tag
                          onClick={() =>
                            router.push(
                              `/technician/inspection/${inspection.inspectionCode}/${item.estimateCode}`
                            )
                          }
                          color="green"
                          className="cursor-pointer text-sm px-2 py-0.5 ]"
                          title="View Item"
                        >
                          <EyeOutlined />

                        </Tag>
                      </div>

                    </div>
                  </List.Item>
                );
              }}
            />
          </div>
        ))
      )}

      {/* pagination */}
      {allItemsMeta && allItemsMeta.total > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            defaultCurrent={1}
            total={allItemsMeta.total}
            pageSize={size}
            onChange={handlePageChange}
            style={{ display: "flex", justifyContent: "center", marginTop: 40 }}
          />
        </div>
      )}
    </div>
  );
};

export default TaskView;
