import React, { useEffect, useState } from "react";
import { Button, TimePicker, message, Select } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { FiEdit } from "react-icons/fi";
import { MdDownloadDone } from "react-icons/md";
import { calculateHours } from "@/utils/total-hour-calculate";
import {
  addChangeDeferredInspectionHour,
  addChangeDeferredInspectionPercentage,
  addChangeInspectionHour,
  addChangeInspectionPercentage,
  InspectionHour,
  InspectionPercentage,
  setDeleteStatusInspectionHour,
  setDeleteStatusInspectionPercentage,
  setNewInsertInspectionHour,
  setNewInsertInspectionPercentage,
  setUpdateStatusInspectionHour,
  setUpdateStatusInspectionPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { useGetAllUsersQuery } from "@/redux/api/estimateApi";
import { SelectOption } from "@/app/(adminLayout)/admin/appointment/create/page";
import { AiOutlineDelete } from "react-icons/ai";
import ProgressBar from "../ViewItems/ProgressBar";
import { formatTime } from "@/utils/formatTime";
import { PiCurrencyDollarThin } from "react-icons/pi";
import { checkInvoiceAccess } from "@/utils/InvoiceAccessCheck";
import { getUserInfo } from "@/services/auth.service";

const DBInspectionItem = ({
  inspectionCode,
  item,
  stage,
}: {
  inspectionCode?: string;
  item: string;
  stage?: string;
}) => {
  const query: Record<string, any> = {};
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inspectionHourData, setInspectionHourData] = useState({
    inspectionHours: "",
    inspectionHourlyRate: "",
  });
  const [inspectionPercentageData, setInspectionPercentageData] = useState({
    id: "",
    name: "",
    percentage: "",
  });
  const [inspectionHourDataInsert, setInspectionHourDataInsert] = useState({
    inspectionHours: "",
    inspectionHourlyRate: "",
  });
  const [inspectionPercentageDataInsert, setInspectionPercentageDataInsert] =
    useState({
      id: "",
      name: "",
    });
  const {
    inspectionTotalAmount,
    inspectionTotalHours,
    inspectionHour,
    deferredInspectionHour,
    inspectionPercentage,
    deferredInspectionPercentage,
  } = useAppSelector((state) => state.serviceInspectionItem);

  const dispatch = useAppDispatch();

  const [filteredInspectionHours, setFilteredInspectionHours] = useState<
    InspectionHour[]
  >([]);
   const {
      estimateType,
    } = useAppSelector((state) => state.estimateItemShow);
    const { role } = getUserInfo() as any;
  const [filteredInspectionPercentages, setFilteredInspectionPercentages] =
    useState<InspectionPercentage[]>([]);
const { totalInspectionAmount, totalInspectionHours } = filteredInspectionHours.reduce(
  (acc, item) => {
    acc.totalInspectionAmount += item.inspectionHourlyRate * (item.inspectionHours / 60);
    acc.totalInspectionHours += item.inspectionHours;
    return acc;
  },
  { totalInspectionAmount: 0, totalInspectionHours: 0 }
);
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
  const excludedIds = filteredInspectionPercentages.map(m => m.id);
  const userOptions: SelectOption[] =
    userData?.filter(item => !excludedIds.includes(item.id)).map((user) => ({
      label: user.name,
      value: user.id,
    })) ?? [];

  useEffect(() => {
    if (inspectionHour && stage === "Accept") {
      const filtered = inspectionHour.filter(
        (hour) => hour.inspectionCode === inspectionCode
      );
      setFilteredInspectionHours(filtered);
    }
    if (inspectionHour && stage === "") {
      const filtered = inspectionHour.filter(
        (hour) => hour.inspectionCode === inspectionCode
      );
      setFilteredInspectionHours(filtered);
    }
    if (deferredInspectionHour && stage === "Deferred") {
      const filtered = deferredInspectionHour.filter(
        (hour) => hour.inspectionCode === inspectionCode
      );
      setFilteredInspectionHours(filtered);
    }
    if (inspectionPercentage && stage === "Accept") {
      const filtered = inspectionPercentage.filter(
        (percentage) => percentage.inspectionCode === inspectionCode
      );
      setFilteredInspectionPercentages(filtered);
    }
    if (inspectionPercentage && stage === "") {
      const filtered = inspectionPercentage.filter(
        (percentage) => percentage.inspectionCode === inspectionCode
      );
      setFilteredInspectionPercentages(filtered);
    }
    if (deferredInspectionPercentage && stage === "Deferred") {
      const filtered = deferredInspectionPercentage.filter(
        (percentage) => percentage.inspectionCode === inspectionCode
      );
      setFilteredInspectionPercentages(filtered);
    }
  }, [
    inspectionHour,
    inspectionPercentage,
    inspectionCode,
    stage,
    deferredInspectionHour,
    deferredInspectionPercentage,
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
  const onInspectionHourInsert = (
    field: string,
    value: string | null | string[]
  ) => {
    setInspectionHourDataInsert((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };
  const onInspectionPercentageInsert = (
    field: string,
    value: string | null | string[]
  ) => {
    if (field === "name") {
      const selectedUser = userOptions.find((option) => option.value === value);
      if (selectedUser) {
        setInspectionPercentageDataInsert((prev) => ({
          ...prev,
          id: selectedUser.value,
          name: selectedUser.label,
        }));
      }
    } else {
      setInspectionPercentageDataInsert((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value : "",
      }));
    }
  };
  const handleInspectionEdit =(item:any)=>{
     if (!checkInvoiceAccess(role, estimateType)) return;
     setInspectionPercentageData({
       name: item.name,
       id: item.id,
       percentage: item.percentage,
     });
     setEditingId(item.inspectionPercentageId!);
  }

  const handleEditInspectionHour = (id: string) => {
     if (!checkInvoiceAccess(role, estimateType)) return;
    setEditingId(id);
  };
  const handleEditInspectionPercentage = (id: string) => {
    setEditingId(id);
  };

  const handleSaveInspectionHour = (id: string) => {
    setEditingId(null);
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredInspectionHour.find(
        (entry: any) => entry.inspectionHourId === id
      );
    } else {
      existingItem = inspectionHour.find(
        (entry: any) => entry.inspectionHourId === id
      );
    }

    const finalInspectionHours =
      parseFloat(inspectionHourData.inspectionHours)*60 ||
      existingItem?.inspectionHours

    const finalInspectionHourlyRate =
      inspectionHourData.inspectionHourlyRate ||
      existingItem?.inspectionHourlyRate;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionHour({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionHourId: existingItem?.inspectionHourId,
          inspectionHours: finalInspectionHours,
          inspectionHourlyRate: parseFloat(finalInspectionHourlyRate),
        })
      );
      dispatch(setUpdateStatusInspectionHour(true));

      setInspectionHourData({
        inspectionHours: "",
        inspectionHourlyRate: "",
      });
    } else {
      dispatch(
        addChangeInspectionHour({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionHourId: existingItem?.inspectionHourId,
          inspectionHours: finalInspectionHours,
          inspectionHourlyRate: parseFloat(finalInspectionHourlyRate),
        })
      );
      dispatch(setUpdateStatusInspectionHour(true));

      setInspectionHourData({
        inspectionHours: "",
        inspectionHourlyRate: "",
      });
    }
  };

  const handleSaveInspectionPercentage = (id: string) => {
    setEditingId(null);
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredInspectionPercentage.find(
        (entry: any) => entry.inspectionPercentageId === id
      );
    } else {
      existingItem = inspectionPercentage.find(
        (entry: any) => entry.inspectionPercentageId === id
      );
    }

    const finalInspectionPercentage =
      inspectionPercentageData.percentage || existingItem?.percentage;

    const finalInspectionId = inspectionPercentageData.id || existingItem?.id;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionPercentage({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionPercentageId: existingItem?.inspectionPercentageId,
          percentage: finalInspectionPercentage?.endsWith("%")
          ? finalInspectionPercentage
          : `${finalInspectionPercentage}%`,
          id: finalInspectionId,
          name: inspectionPercentageData.name,
        })
      );
      dispatch(setUpdateStatusInspectionPercentage(true));

      setInspectionPercentageData({
        id: "",
        name: "",
        percentage: "",
      });
    } else {
      dispatch(
        addChangeInspectionPercentage({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionPercentageId: existingItem?.inspectionPercentageId,
          percentage: finalInspectionPercentage?.endsWith("%")
          ? finalInspectionPercentage
          : `${finalInspectionPercentage}%`,
          id: finalInspectionId,
          name: inspectionPercentageData.name,
        })
      );
      dispatch(setUpdateStatusInspectionPercentage(true));

      setInspectionPercentageData({
        id: "",
        name: "",
        percentage: "",
      });
    }
  };
  const handleInspectionHourSubmit = () => {
    const { inspectionHours, inspectionHourlyRate } = inspectionHourDataInsert;

    if (!inspectionHours || !inspectionHourlyRate) {
      message.error("All fields are required!");
      return;
    }

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionHour({
          ...inspectionHourDataInsert,
          inspectionCode,
          inspectionStage: stage,
          inspectionHours: inspectionHourDataInsert.inspectionHours
            ? parseFloat(
                inspectionHourDataInsert.inspectionHours)*60
            : 0,
          inspectionHourlyRate: parseFloat(
            inspectionHourDataInsert.inspectionHourlyRate
          ),
        })
      );
      dispatch(setNewInsertInspectionHour(true));
      setInspectionHourDataInsert({
        inspectionHours: "",
        inspectionHourlyRate: "",
      });
    } else {
      dispatch(
        addChangeInspectionHour({
          ...inspectionHourDataInsert,
          inspectionCode,
          inspectionStage: stage,
          inspectionHours: inspectionHourDataInsert.inspectionHours
            ? parseFloat(
                inspectionHourDataInsert.inspectionHours)*60
            : 0,
          inspectionHourlyRate: parseFloat(
            inspectionHourDataInsert.inspectionHourlyRate
          ),
        })
      );
      dispatch(setNewInsertInspectionHour(true));
      setInspectionHourDataInsert({
        inspectionHours: "",
        inspectionHourlyRate: "",
      });
    }
  };
  const handleInspectionPercentageSubmit = () => {
    const { name } = inspectionPercentageDataInsert;

    if (!name) {
      message.error("All fields are required!");
      return;
    }

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionPercentage({
          inspectionCode,
          inspectionStage: stage,
          id: inspectionPercentageDataInsert.id,
          name: inspectionPercentageDataInsert.name,
        })
      );
      dispatch(setNewInsertInspectionPercentage(true));
      setInspectionPercentageDataInsert({
        id: "",
        name: "",
      });
    } else {
      dispatch(
        addChangeInspectionPercentage({
          inspectionCode,
          inspectionStage: stage,
          id: inspectionPercentageDataInsert.id,
          name: inspectionPercentageDataInsert.name,
        })
      );
      dispatch(setNewInsertInspectionPercentage(true));
      setInspectionPercentageDataInsert({
        id: "",
        name: "",
      });
    }
  };

  const handleDeleteInspectionHour = (id: string) => {
     if (!checkInvoiceAccess(role, estimateType)) return;
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredInspectionHour.find(
        (entry: any) => entry.inspectionHourId === id
      );
    } else {
      existingItem = inspectionHour.find(
        (entry: any) => entry.inspectionHourId === id
      );
    }

    const finalInspectionHours = calculateHours(existingItem?.inspectionHours);

    const finalInspectionHourlyRate = existingItem?.inspectionHourlyRate;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionHour({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionHourId: existingItem?.inspectionHourId,
          inspectionHours: finalInspectionHours
            ? parseInt(finalInspectionHours.split(":")[0], 10) * 60 +
              parseInt(finalInspectionHours.split(":")[1], 10)
            : 0,
          inspectionHourlyRate: parseFloat(finalInspectionHourlyRate),
        })
      );
      dispatch(setDeleteStatusInspectionHour(true));
    } else {
      dispatch(
        addChangeInspectionHour({
          inspectionCode: existingItem?.inspectionCode,
          inspectionStage: stage,
          inspectionHourId: existingItem?.inspectionHourId,
          inspectionHours: finalInspectionHours
            ? parseInt(finalInspectionHours.split(":")[0], 10) * 60 +
              parseInt(finalInspectionHours.split(":")[1], 10)
            : 0,
          inspectionHourlyRate: parseFloat(finalInspectionHourlyRate),
        })
      );
      dispatch(setDeleteStatusInspectionHour(true));
    }
  };
  const handleDeleteInspectionPercentage = (id: string) => {
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredInspectionPercentage.find(
        (entry: any) => entry.inspectionPercentageId === id
      );
    } else {
      existingItem = inspectionPercentage.find(
        (entry: any) => entry.inspectionPercentageId === id
      );
    }

    const finalInspectionId = existingItem?.id;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredInspectionPercentage({
          inspectionCode: existingItem?.inspectionCode,
          inspectionPercentageId: existingItem?.inspectionPercentageId,
          id: finalInspectionId,
          name: existingItem?.name,
        })
      );
      dispatch(setDeleteStatusInspectionPercentage(true));
    } else {
      dispatch(
        addChangeInspectionPercentage({
          inspectionCode: existingItem?.inspectionCode,
          inspectionPercentageId: existingItem?.inspectionPercentageId,
          id: finalInspectionId,
          name: existingItem?.name,
        })
      );
      dispatch(setDeleteStatusInspectionPercentage(true));
    }
  };

   const [isOpen, setIsOpen] = useState(false);
     const [isInspectionHourOpen, setIsInspectionHourOpen] = useState(false);
    
      const handleToggle = () => {
         if (!checkInvoiceAccess(role, estimateType)) return;
        setIsOpen((prev) => !prev);
        
      };
      const handleInspectionHourToggle = () => {
         if (!checkInvoiceAccess(role, estimateType)) return;
        setIsInspectionHourOpen((prev) => !prev);
        
      };
  
  return (
    <div className="rounded my-2 p-2 border border-solid border-gray-200">
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
             className="p-1 mr-5"
              />
          </div>
          </div>
          <div>
            <div>
              {filteredInspectionHours?.length > 0 &&
           filteredInspectionHours.map((item: InspectionHour, index) => (
             <div
               key={item.inspectionHourId}
               className="flex items-center gap-3"
             >
               {/* Inspection Hour */}
               <div className="flex flex-col w-full">
                 {editingId === item.inspectionHourId ? (
                  //  <TimePicker
                  //    name={`inspectionHours${index}`}
                  //    format="HH:mm"
                  //    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  //    className="border px-2 py-[1px] border-gray-400 outline-none rounded w-full"
                  //    defaultValue={
                  //      item?.inspectionHours
                  //        ? dayjs(calculateHours(item?.inspectionHours), "HH:mm")
                  //        : null
                  //    }
                  //    onChange={(time, timeString) =>
                  //      onInspectionHourChange("inspectionHours", timeString)
                  //    }
                  //  />
                       <input
                         name={`inspectionHours${index}`}
                         type="text"
                         placeholder="Hours"
                         defaultValue={item?.inspectionHours/60}
                         onChange={(e) => onInspectionHourChange("inspectionHours", e.target.value)}
                           className="p-1 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                       />
                 ) : (
                   <span className="w-full p-1">
                     {`${(item.inspectionHours / 60).toFixed(2)} Hour`}
                   </span>
                 )}
               </div>
         
               {/* Hourly Rate */}
               <div className="flex flex-col w-full">
                 {editingId === item.inspectionHourId ? (
                   <input
                     name={`inspectionHourlyRate${index}`}
                     type="text"
                     defaultValue={item?.inspectionHourlyRate}
                     onChange={(e) =>
                       onInspectionHourChange("inspectionHourlyRate", e.target.value)
                     }
                     className="p-1 px-2 border border-gray-400 outline-none rounded w-full"
                   />
                 ) : (
                   <span className="w-full p-1 flex items-center"> <PiCurrencyDollarThin />{item?.inspectionHourlyRate || "-"}/Hour</span>
                 )}
               </div>
         
               {/* Action Buttons */}
               {editingId === item.inspectionHourId ? (
                 <Button
                   onClick={() => handleSaveInspectionHour(item.inspectionHourId!)}
                   size="small"
                 >
                   <MdDownloadDone className="text-md " />
                 </Button>
               ) : (
                 <Button
                   onClick={() => handleEditInspectionHour(item.inspectionHourId!)}
                   size="small"
                 >
                     <FiEdit className="text-md" />
                 </Button>
               )}
         
               <Button
                 onClick={() => handleDeleteInspectionHour(item.inspectionHourId!)}
                 size="small"
               >
                   <AiOutlineDelete className="text-md " />
               </Button>
             </div>
           ))}
           <div className=" p-1 flex justify-end gap-3 ">
                <p>
                  Total Amount:{" "}
                  <span className="font-bold"> ${totalInspectionAmount.toFixed(2)}</span>
                </p>
                <p>
                  Total Hours:{" "}
                  <span className="font-bold">{(totalInspectionHours / 60).toFixed(2)}</span>
                </p>
              </div>
            </div>
            {isInspectionHourOpen&&<div><div className="flex items-center gap-3 justify-center mt-1">
              <div className="flex flex-col w-full">
                
                {/* <TimePicker
                  name="inspectionHours"
                  onChange={(time, timeString) =>
                    onInspectionHourInsert("inspectionHours", timeString)
                  }
                  defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  className="border py-[1px] border-gray-400 outline-none rounded w-full"
                  format="HH:mm"
                  value={
                    inspectionHourDataInsert.inspectionHours
                      ? dayjs(inspectionHourDataInsert.inspectionHours, "HH:mm")
                      : null
                  }
                /> */}
                     <input
                         name={`inspectionHours`}
                         type="text"
                         placeholder="Inspection Hours"
                         value={inspectionHourDataInsert?.inspectionHours}
                         onChange={(e) => onInspectionHourInsert("inspectionHours", e.target.value)}
                           className="p-1 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                       />

              </div>

              <div className="flex flex-col w-full">
                
                <input
                  name="inspectionHourlyRate"
                  type="text"
                  placeholder="Inspection Hourly Rate"
                  value={inspectionHourDataInsert.inspectionHourlyRate}
                  onChange={(e) =>
                    onInspectionHourInsert(
                      "inspectionHourlyRate",
                      e.target.value
                    )
                  }
                  className="p-1 px-4 border border-solid border-gray-400 outline-none rounded w-full"
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 ">
              <div>
                <Button
                  type="primary"
                  size="small"
                  className="bg-neutral-800 text-sm hover:bg-neutral-700 font-bold "
                  onClick={handleInspectionHourSubmit}
                >
                  Add
                </Button>
              </div>
              
            </div></div>}
          
          </div>
        </div>
      )}
      {item === "inspectionPercentage" && (
        <div>
      <div>
        <div className="flex justify-between items-center  pr-1">
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
            <div>
              {filteredInspectionPercentages?.length > 0 &&
               filteredInspectionPercentages.map((item: InspectionPercentage, index) => (
                 <div
                   key={item.inspectionPercentageId}
                   className="flex items-center gap-4 my-1"
                 >
                   {/* Inspector Name */}
                   <div className="flex flex-col w-full">
                     {editingId === item.inspectionPercentageId ? (
                       <Select
                         showSearch
                         placeholder="Select Technician"
                         value={inspectionPercentageData?.name}
                         onChange={(value) =>
                           onInspectionPercentageChange("name", value)
                         }
                         options={userOptions}
                          style={{ height: "28px" }}
                          className="p-[1px] outline-none rounded w-full"
                         filterOption={false}
                         onSearch={setSearchTerm}
                         notFoundContent={null}
                       />
                     ) : (
                       <span className="w-full p-1">{item?.name || "-"}</span>
                     )}
                   </div>
             
                   {/* Percentage */}
                   <div className="flex flex-col w-full">
                     {editingId === item.inspectionPercentageId ? (
                       <input
                         name={`percentage${index}`}
                         type="text"
                         value={inspectionPercentageData?.percentage}
                         onChange={(e) =>
                           onInspectionPercentageChange("percentage", e.target.value)
                         }
                         className="p-1 border border-gray-400 outline-none rounded w-full"
                       />
                     ) : (
                       <span className="w-full p-1"><ProgressBar percentage={item?.percentage}></ProgressBar></span>
                     )}
                   </div>
             
                   {/* Action Buttons */}
                   {editingId === item.inspectionPercentageId ? (
                     <Button
                       size="small"
                       onClick={() =>
                         handleSaveInspectionPercentage(item.inspectionPercentageId!)
                       }
                     >
                       <MdDownloadDone className="text-sm" />
                     </Button>
                   ) : (
                     <Button
                       size="small"
                       onClick={()=>handleInspectionEdit(item)}
                     >
                       <FiEdit className="text-sm" />
                     </Button>
                   )}
             
                   <Button
                     size="small"
                     onClick={() =>
                       handleDeleteInspectionPercentage(item.inspectionPercentageId!)
                     }
                   >
                     <AiOutlineDelete className="text-md " />
                   </Button>
                 </div>
               ))}
            </div>
           <div className="flex items-center gap-3 justify-center mt-1">
              <div className="flex gap-2 justify-center items-center  w-full">
                <Select
                  showSearch
                  placeholder="Select Mechanic"
                  value={inspectionPercentageDataInsert.id || undefined}
                  onChange={(value) =>
                    onInspectionPercentageInsert("name", value)
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
                  className="bg-neutral-800 text-sm py-[1px] hover:bg-neutral-700 font-bold "
                  onClick={handleInspectionPercentageSubmit}
                >
                  Add 
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div>
                
              </div>
            </div>
          </div>}
        </div>
      )}
    </div>
  );
};

export default DBInspectionItem;
