"use client";

import React, { useEffect, useState } from "react";
import { Button, TimePicker, message, Select } from "antd";
import dayjs from "dayjs";
import ViewTable from "../ViewItems/ViewTable";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import {
  addDeferredTempInspectionHour,
  addDeferredTempInspectionPercentage,
  addDeferredTempMechanicPercentage,
  addTempInspectionHour,
  addTempInspectionPercentage,
  addTempMechanicPercentage,
  InspectionHour,
  InspectionPercentage,
  updateDeferredTempInspectionPercentage,
  updateDeferredTempMechanicPercentage,
  updateTempInspectionPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { useGetAllUsersQuery } from "@/redux/api/estimateApi";
import { SelectOption } from "@/app/(adminLayout)/admin/appointment/create/page";
import { formatTime } from "@/utils/formatTime";

const InspectionItem = ({
  inspectionCode,
  item,
  stage,
}: {
  inspectionCode: string;
  item: string;
  stage?: string;
}) => {
  const query: Record<string, any> = {};
  const [inspectionHourCollapse, setInspectionHourCollapse] = useState(true);
  const [inspectionPercentageCollapse, setInspectionPercentageCollapse] =
    useState(true);
  const [inspectionHourData, setInspectionHourData] = useState({
    inspectionCode,
    inspectionHours: "",
    inspectionHourlyRate: "",
  });
  const [inspectionPercentageData, setInspectionPercentageData] = useState({
    inspectionCode,
    id: "",
    name: "",
  });

  const dispatch = useAppDispatch();
  const {
    tempInspectionHour,
    tempInspectionPercentage,
    tempDeferredInspectionHour,
    tempDeferredInspectionPercentage,
    tempInspectionTotalAmount,
    tempInspectionTotalHours,
  } = useAppSelector((state) => state.serviceInspectionItem);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 300,
  });
  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { data: userInfo } = useGetAllUsersQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const userData = userInfo?.data;


  const [filteredInspectionHour, setFilteredInspectionHour] = useState<
    InspectionHour[]
  >([]);
  const [filteredInspectionPercentage, setFilteredInspectionPercentage] =
     useState<InspectionPercentage[]>([]);

  const { totalInspectionAmount, totalInspectionHours } = filteredInspectionHour.reduce(
  (acc, item) => {
    acc.totalInspectionAmount += item.inspectionHourlyRate * (item.inspectionHours / 60);
    acc.totalInspectionHours += item.inspectionHours;
    return acc;
  },
  { totalInspectionAmount: 0, totalInspectionHours: 0 }
);
  const excludedIds = filteredInspectionPercentage.map(m => m.id);
      const userOptions: SelectOption[] =
    userData?.filter(item => !excludedIds.includes(item.id))
    .map((user) => ({
      label: user.name,
      value: user.id,
    })) ?? [];


  useEffect(() => {
    if (tempInspectionHour && stage === "Accept") {
      setFilteredInspectionHour(
        tempInspectionHour.filter((i) => i.inspectionCode === inspectionCode)
      );
    }
    if (tempInspectionHour && stage === "") {
      setFilteredInspectionHour(
        tempInspectionHour.filter((i) => i.inspectionCode === inspectionCode)
      );
    }
    if (tempDeferredInspectionHour && stage === "Deferred") {
      setFilteredInspectionHour(
        tempDeferredInspectionHour.filter(
          (i) => i.inspectionCode === inspectionCode
        )
      );
    }
    if (tempInspectionPercentage && stage === "Accept") {
      setFilteredInspectionPercentage(
        tempInspectionPercentage.filter(
          (i) => i.inspectionCode === inspectionCode
        )
      );
    }
    if (tempInspectionPercentage && stage === "") {
      setFilteredInspectionPercentage(
        tempInspectionPercentage.filter(
          (i) => i.inspectionCode === inspectionCode
        )
      );
    }
    if (tempDeferredInspectionPercentage && stage === "Deferred") {
      setFilteredInspectionPercentage(
        tempDeferredInspectionPercentage.filter(
          (i) => i.inspectionCode === inspectionCode
        )
      );
    }
  }, [
    tempInspectionHour,
    tempInspectionPercentage,
    tempDeferredInspectionHour,
    tempDeferredInspectionPercentage,
    stage,
    inspectionCode,
  ]);

  const onInspectionHourChange = (
    field: string,
    value: string | null | string[]
  ) => {
    setInspectionHourData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };

  const onInspectionPercentageChange = (
    field: string,
    value: string | null | string[]
  ) => {
    if (field === "name") {
      const selectedUser = userOptions.find((option) => option.value === value);
      if (selectedUser) {
        setInspectionPercentageData((prev) => ({
          ...prev,
          id: selectedUser.value,
          name: selectedUser.label,
        }));
      }
    } else {
      setInspectionPercentageData((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value : "",
      }));
    }
  };

  const handleInspectionHourSubmit = () => {
    const { inspectionHours, inspectionHourlyRate } = inspectionHourData;

    if (!inspectionHours || !inspectionHourlyRate) {
      message.error("All fields are required!");
      return;
    }

    if (stage === "Deferred") {
      dispatch(
        addDeferredTempInspectionHour({
          ...inspectionHourData,
          inspectionCode,
          inspectionStage: stage,
          inspectionHours: inspectionHourData.inspectionHours
            ? parseFloat(inspectionHourData.inspectionHours)*60 
            : 0,
          inspectionHourlyRate: parseFloat(
            inspectionHourData.inspectionHourlyRate
          ),
        })
      );

      setInspectionHourData({
        inspectionCode: "",
        inspectionHours: "",
        inspectionHourlyRate: "",
      });

      message.success("Inspection Hour added successfully!");
    } else {
      dispatch(
        addTempInspectionHour({
          ...inspectionHourData,
          inspectionCode,
          inspectionStage: stage,
          inspectionHours: inspectionHourData.inspectionHours
            ? parseFloat(inspectionHourData.inspectionHours)*60 
            : 0,
          inspectionHourlyRate: parseFloat(
            inspectionHourData.inspectionHourlyRate
          ),
        })
      );

      setInspectionHourData({
        inspectionCode: "",
        inspectionHours: "",
        inspectionHourlyRate: "",
      });

      message.success("Inspection Hour added successfully!");
    }
  };

  const handleInspectionPercentageSubmit = () => {
    const { name, id } = inspectionPercentageData;

    if (!name || !inspectionCode) {
      message.error("All fields are required!");
      return;
    }

    // Get current mechanic list based on stage
    const existingMechanics =
      stage === "Deferred"
        ? tempDeferredInspectionPercentage.filter(
            (m) => m.inspectionCode === inspectionCode
          )
        : tempInspectionPercentage.filter(
            (m) => m.inspectionCode === inspectionCode
          );

    // ✅ Check if the mechanic already exists (by id and serviceCode)
    const isDuplicate = existingMechanics.some((m) => m.id === id);
    if (isDuplicate) {
      message.error("This mechanic is already added for the selected service.");
      return;
    }

    const totalCount = existingMechanics.length + 1;
    const calculatedPercentage = `${(100 / totalCount).toFixed(2)}%`;

    // Reassign equal percentages to all existing
    const updatedMechanics = existingMechanics.map((m) => ({
      ...m,
      percentage: calculatedPercentage,
    }));

    const newMechanic = {
      name,
      percentage: calculatedPercentage,
      inspectionCode,
      inspectionStage: stage,
      id,
    };

    // Dispatch both existing (with new %), and new one
    if (stage === "Deferred") {
      dispatch(addDeferredTempInspectionPercentage(newMechanic));
      updatedMechanics.forEach((m) =>
        dispatch(updateDeferredTempInspectionPercentage(m))
      );
    } else {
      dispatch(addTempInspectionPercentage(newMechanic));
      updatedMechanics.forEach((m) =>
        dispatch(updateTempInspectionPercentage(m))
      );
    }

    setInspectionPercentageData({
      inspectionCode: "",
      id: "",
      name: "",
    });

    message.success("Inspection Percentage added successfully!");
  };

   const [isOpen, setIsOpen] = useState(false);
   const [isInspectionHourOpen, setIsInspectionHourOpen] = useState(false);
  
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
      
    };
    const handleInspectionHourToggle = () => {
      setIsInspectionHourOpen((prev) => !prev);
      
    };

  return (
    <div className="my-1 rounded">
      {item === "inspectionHour" && (
        <div>
          <div>
            <div className="flex justify-between items-center pb-1 pr-1">
              <h3 className="text-sm font-bold text-black ">
                Inspection Hour
              </h3>
                <Button
             size="small"
             shape="circle"
             onClick={handleInspectionHourToggle}
             icon={isInspectionHourOpen ? <MinusOutlined /> : <PlusOutlined />}
             className="p-1"
              />
          </div>
          </div>
          <div>
            <ViewTable
              ItemArray={filteredInspectionHour}
              page={"inspection-item-inspectionHour"}
            />
            <div className=" p-1 flex justify-end gap-3 ">
                <p>
                 Total Amount:{" "}
                  <span className="font-bold">
                    ${totalInspectionAmount.toFixed(2)}
                  </span>
                </p>
                <p>
                   Total Hours:{" "}
                  <span className="font-bold">{(totalInspectionHours/60)?.toFixed(2)}</span>
                </p>
              </div>
           {
            isInspectionHourOpen&& <div className="flex items-center gap-3 justify-center mt-1 ">
              <div className="flex flex-col w-full">
                
                {/* <TimePicker
                  name="inspectionHours"
                  onChange={(time, timeString) =>
                    onInspectionHourChange("inspectionHours", timeString)
                  }
                  defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  className="border py-[1px] border-solid border-gray-400 outline-none rounded w-full"
                  format="HH:mm"
                  value={
                    inspectionHourData.inspectionHours
                      ? dayjs(inspectionHourData.inspectionHours, "HH:mm")
                      : null
                  }
                /> */}
                     <input
                         name={`inspectionHours`}
                         type="text"
                         placeholder="Inspection Hours"
                         value={inspectionHourData?.inspectionHours}
                         onChange={(e) => onInspectionHourChange("inspectionHours", e.target.value)}
                           className="p-1 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                       />
              </div>

              <div className="flex flex-col w-full">
               
                <input
                  name="inspectionHourlyRate"
                  type="text"
                  placeholder="Inspection Hourly Rate"
                  value={inspectionHourData.inspectionHourlyRate}
                  onChange={(e) =>
                    onInspectionHourChange(
                      "inspectionHourlyRate",
                      e.target.value
                    )
                  }
                  className="p-1 px-3 border border-gray-400 border-solid outline-none rounded w-full"
                />
              </div>
              <Button
                  type="primary"
                  size="small"
                  className="bg-neutral-800 rounded  hover:bg-neutral-700 font-bold "
                  onClick={handleInspectionHourSubmit}
                >
                  Add 
                </Button>
            </div>
           }
          </div>
        </div>
      )}
      {item === "inspectionPercentage" && (
        <div>
          <div>
            
              <div className="flex justify-between items-center pb-1 pr-1">
              <h3 className="text-sm font-bold text-black ">
                Assigned Technician(s)
              </h3>
            <Button
             size="small"
             shape="circle"
             onClick={handleToggle}
             icon={isOpen ? <MinusOutlined /> : <PlusOutlined />}
             className="p-1"
              />
          </div>
          </div>
          {isOpen&&<div>
            <ViewTable
              ItemArray={filteredInspectionPercentage}
              page={"inspection-item-inspectionPercentage"}
            />
            <div className="flex items-center gap-3 justify-center mt-1 ">
              <div className="flex gap-2 justify-center items-center  w-full">
               
                <Select
                  showSearch
                  placeholder="Select Technician"
                  value={inspectionPercentageData.id || undefined}
                  onChange={(value) =>
                    onInspectionPercentageChange("name", value)
                  }
                  options={userOptions}
                  className="p-[1px] outline-none rounded w-full"
                  style={{ height: "28px" }}
                  filterOption={false}
                  onSearch={setSearchTerm}
                  notFoundContent={null}
                />
                 <Button
                  type="primary"
                  size="small"
                 className="bg-neutral-800 hover:bg-neutral-700  font-bold rounded"
                  onClick={handleInspectionPercentageSubmit}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>}
        </div>
      )}
    </div>
  );
};

export default InspectionItem;
