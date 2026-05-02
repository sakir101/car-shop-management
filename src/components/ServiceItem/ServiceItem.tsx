"use client";

import React, { useEffect, useState } from "react";
import { Button, TimePicker, message, Select, Modal } from "antd";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import {
  addDeferredTempLabour,
  addDeferredTempMechanicPercentage,
  addDeferredTempPart,
  addTempLabour,
  addTempMechanicPercentage,
  addTempPart,
  Labour,
  MechanicPercentage,
  Part,
  updateDeferredTempMechanicPercentage,
  updateTempMechanicPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import ViewTable from "../ViewItems/ViewTable";
import { useGetAllUsersQuery } from "@/redux/api/estimateApi";
import { SelectOption } from "@/app/(adminLayout)/admin/appointment/create/page";
import { MinusOutlined, PlusOutlined, ToolOutlined } from "@ant-design/icons";
import { formatTime } from "@/utils/formatTime";
const ServiceItem = ({
  serviceCode,
  item,
  stage,
}: {
  serviceCode: string;
  item: string;
  stage?: string;
}) => {
  const query: Record<string, any> = {};
  const dispatch = useAppDispatch();
  const {
    tempPart,
    tempLabour,
    tempMechanicPercentage,
    tempDeferredPart,
    tempDeferredLabour,
    tempDeferredMechanicPercentage,
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

 
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [filteredLabours, setFilteredLabours] = useState<Labour[]>([]);
  const [filteredMechanicPercentage, setFilteredMechanicPercentage] = useState<
    MechanicPercentage[]
  >([]);
  const totalPartAmountForService = filteredParts?.reduce((sum, item) => sum + item.total, 0);
  const { totalLabourAmount, totalLabourHours } = filteredLabours.reduce(
  (acc, item) => {
    acc.totalLabourAmount += item.ratePerHour * (item.requiredHours / 60);
    acc.totalLabourHours += item.requiredHours;
    return acc;
  },
  { totalLabourAmount: 0, totalLabourHours: 0 }
);

  const excludedIds = filteredMechanicPercentage.map(m => m.id);

   const userOptions: SelectOption[] =
    userData
    ?.filter(item => !excludedIds.includes(item.id))
    .map(user => ({
      label: user.name,
      value: user.id,
    })) ?? [];


  useEffect(() => {
    if (tempPart && stage === "Accept") {
      setFilteredParts(tempPart.filter((p) => p.serviceCode === serviceCode));
    }
    if (tempLabour && stage === "Accept") {
      setFilteredLabours(
        tempLabour.filter((l) => l.serviceCode === serviceCode)
      );
    }
    if (tempPart && stage === "") {
      setFilteredParts(tempPart.filter((p) => p.serviceCode === serviceCode));
    }
    if (tempLabour && stage === "") {
      setFilteredLabours(
        tempLabour.filter((l) => l.serviceCode === serviceCode)
      );
    }
    if (tempMechanicPercentage && stage === "Accept") {
      setFilteredMechanicPercentage(
        tempMechanicPercentage.filter((m) => m.serviceCode === serviceCode)
      );
    }
    if (tempDeferredPart && stage === "Deferred") {
      setFilteredParts(
        tempDeferredPart.filter((p) => p.serviceCode === serviceCode)
      );
    }
    if (tempDeferredLabour && stage === "Deferred") {
      setFilteredLabours(
        tempDeferredLabour.filter((l) => l.serviceCode === serviceCode)
      );
    }
    if (tempDeferredMechanicPercentage && stage === "Deferred") {
      setFilteredMechanicPercentage(
        tempDeferredMechanicPercentage.filter(
          (m) => m.serviceCode === serviceCode
        )
      );
    }
  }, [
    tempPart,
    tempLabour,
    tempMechanicPercentage,
    tempDeferredPart,
    tempDeferredLabour,
    tempDeferredMechanicPercentage,
    stage,
    serviceCode,
    setFilteredLabours,
    setFilteredParts,
    setFilteredMechanicPercentage,
  ]);

  const [partData, setPartData] = useState({
    serviceCode,
    name: "",
    unitPrice: "",
    provider: "",
    installationHours: null as string | null,
    quantity: "",
    margin:"50",
    total:""
  });

  const [labourData, setLabourData] = useState({
    serviceCode,
    name: "Labor",
    ratePerHour: "100",
    requiredHours: "",
  });

  const [mechanicPercentageData, setMechanicPercentageData] = useState({
    serviceCode,
    id: "",
    name: "",
  });


  const onPartChange = (key: any, value: any) => {
  let newData = { ...partData, [key]: value };

  const price = parseFloat(newData.unitPrice) || 0;
  const qty = parseFloat(newData.quantity) || 0;
  const base = price * qty;

  // -----------------------------
  // When Unit Price or Quantity changes
  // -----------------------------
  if (key === "unitPrice" || key === "quantity") {
    const margin = parseFloat(newData.margin) || 0;

    // 1. Recalculate total based on new base and current margin
    const updatedTotal = base * (1 + margin / 100);
    newData.total = updatedTotal.toString();

    // 2. Recalculate margin again using NEW base & NEW total
    if (base > 0) {
      const autoMargin = ((updatedTotal - base) / base) * 100;
      newData.margin = autoMargin.toString();
    } else {
      newData.margin = "50";
    }
  }

  // -----------------------------
  // When TOTAL changes → update margin
  // -----------------------------
  if (key === "total") {
    const total = parseFloat(value) || 0;
    if (base > 0) {
      newData.margin = (((total - base) / base) * 100).toString();
    } else {
      newData.margin = "50";
    }
  }

  // -----------------------------
  // When MARGIN changes → update total
  // -----------------------------
  if (key === "margin") {
    const margin = parseFloat(value) || 0;
    newData.total = (base * (1 + margin / 100)).toString();
  }

  setPartData(newData);
};

  const onLabourChange = (field: string, value: string | null | string[]) => {
    setLabourData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };
  const onMechanicPercentageChange = (
    field: string,
    value: string | null | string[]
  ) => {
    if (field === "name") {
      const selectedUser = userOptions.find((option) => option.value === value);
      if (selectedUser) {
        setMechanicPercentageData((prev) => ({
          ...prev,
          id: selectedUser.value,
          name: selectedUser.label,
        }));
      }
    } else {
      setMechanicPercentageData((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value : "",
      }));
    }
  };

  const handlePartSubmit = () => {
    const { name, unitPrice, quantity,total,margin } = partData;

    if (!name) {
      message.error("Name is required!");
      return;
    }
    
    if (!unitPrice) {
      message.error("Unit Price is required!");
      return;
    }
    
    if (!quantity) {
      message.error("Quantity is required!");
      return;
    }
    if (!total) {
      message.error("Total is required!");
      return;
    }
    if (!margin) {
      message.error("Margin is required!");
      return;
    }

    if (stage === "Deferred") {
      dispatch(
        addDeferredTempPart({
          ...partData,
          serviceCode,
          serviceStage: stage,
          installationHours:0,
          unitPrice: parseFloat(partData.unitPrice),
          quantity: parseInt(partData.quantity, 10),
          total:parseFloat(partData.total),
          margin:parseFloat(partData.margin)
        })
      );

      setPartData({
        serviceCode: "",
        name: "",
        unitPrice: "",
        provider: "",
        installationHours: null,
        quantity: "",
        margin:"50",
        total:""
      });

      message.success("Part added successfully!");
      setIsModalVisible(false);
    } else {
      dispatch(
        addTempPart({
          ...partData,
          serviceCode,
          serviceStage: stage,
          installationHours: 0,
          unitPrice: parseFloat(partData.unitPrice),
          quantity: parseInt(partData.quantity, 10),
          total:parseFloat(partData.total),
          margin:parseFloat(partData.margin)
        })
      );

      setPartData({
        serviceCode: "",
        name: "",
        unitPrice: "",
        provider: "",
        installationHours: null,
        quantity: "",
        margin:"50",
        total:""
      });

      message.success("Part added successfully!");
      setIsModalVisible(false);
    }
  };
  const handleLabourSubmit = () => {
    const { name, ratePerHour, requiredHours } = labourData;

    if (!name || !ratePerHour || !requiredHours) {
      message.error("All fields are required!");
      return;
    }
    

    if (stage === "Deferred") {
      dispatch(
        addDeferredTempLabour({
          ...labourData,
          serviceCode,
          serviceStage: stage,
          requiredHours: labourData.requiredHours
            ? parseFloat(labourData.requiredHours)*60
            : 0,
          ratePerHour: parseFloat(labourData.ratePerHour),
        })
      );

      setLabourData({
        serviceCode: "",
        name: "Labor",
        ratePerHour: "100",
        requiredHours: "",
      });

      message.success("Labour added successfully!");
    } else {
      dispatch(
        addTempLabour({
          ...labourData,
          serviceCode,
          serviceStage: stage,
          requiredHours: labourData?.requiredHours
            ? parseFloat(labourData?.requiredHours)*60
            : 0,
          ratePerHour: parseFloat(labourData.ratePerHour),
        })
      );

      setLabourData({
        serviceCode: "",
        name: "Labor",
        ratePerHour: "100",
        requiredHours: "",
      });

      message.success("Labour added successfully!");
    }
    setLabourIsModalVisible(false);
  };
  const handleMechanicPercentageSubmit = () => {
    const { name, id } = mechanicPercentageData;

    if (!name || !serviceCode) {
      message.error("All fields are required!");
      return;
    }

    // Get current mechanic list based on stage
    const existingMechanics =
      stage === "Deferred"
        ? tempDeferredMechanicPercentage.filter(
            (m) => m.serviceCode === serviceCode
          )
        : tempMechanicPercentage.filter((m) => m.serviceCode === serviceCode);

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
      serviceCode,
      serviceStage: stage,
      id,
    };

    // Dispatch both existing (with new %), and new one
    if (stage === "Deferred") {
      dispatch(addDeferredTempMechanicPercentage(newMechanic));
      updatedMechanics.forEach((m) =>
        dispatch(updateDeferredTempMechanicPercentage(m))
      );
    } else {
      dispatch(addTempMechanicPercentage(newMechanic));
      updatedMechanics.forEach((m) =>
        dispatch(updateTempMechanicPercentage(m))
      );
    }

    setMechanicPercentageData({
      serviceCode: "",
      id: "",
      name: "",
    });

    message.success("Mechanic Percentage added successfully!");
  };

 const [isModalVisible, setIsModalVisible] = useState(false);
 const [isLabourModalVisible, setLabourIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    handlePartSubmit();
    
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const showLabourModal = () => {
    setLabourIsModalVisible(true);
  };
  const handleLabourModalOk = () => {
    handleLabourSubmit();
  };

  const handleLabourModalCancel = () => {
    setLabourIsModalVisible(false);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    
  };
  return (
    <div className="my-1 rounded ">
      {item === "part" && (
        <div>
          <div>
           <div className="flex justify-between items-center pb-1 pr-1">
            <h3 className="text-sm  text-black  ">
             Parts
           </h3>
           <Button
             size="small"
             shape="circle"
             onClick={showModal}
             icon={<PlusOutlined />}
             className="p-1"
              />
           </div>
            <ViewTable ItemArray={filteredParts} page={"service-item-part"} />
            <div className=" text-end py-1 pr-1">
               <p>
                 Total Parts:{" "}
                 <span className="font-bold" >${totalPartAmountForService?.toFixed(2)}</span>
               </p>
            </div>
            <Modal
           title={
          <div className="flex items-center ">
            <span>Add New Part</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText="Add Part"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-neutral-800 hover:bg-neutral-700 border-neutral-800",
          icon: <PlusOutlined />
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
             
              <input
                name="name"
                type="text"
                placeholder="Product Name"
                value={partData.name}
                onChange={(e) => onPartChange("name", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium">Supplier</label>
              <input
                name="provider"
                type="text"
                placeholder="Supplier"
                value={partData.provider}
                onChange={(e) => onPartChange("provider", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>

            
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium">
                 Unit Price <span className="text-red-500">*</span>
              </label>
              <input
                name="unitPrice"
                type="text"
                placeholder="Unit Price"
                value={partData.unitPrice}
                onChange={(e) => onPartChange("unitPrice", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>
             <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium">
                   Quantity <span className="text-red-500">*</span>
              </label>
              <input
                name="quantity"
                type="text"
                placeholder="Quantity"
                value={partData.quantity}
                onChange={(e) => onPartChange("quantity", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>

          </div>

          <div className="flex items-center gap-3">

  <div className="flex flex-col w-full">
    <label className="mb-1 text-sm font-medium">
        Total <span className="text-red-500">*</span>
    </label>
    <input
      required
      name="total"
      type="text"
      placeholder="Total"
      value={partData.total}
      onChange={(e) => onPartChange("total", e.target.value)}
      className="p-2 border border-gray-400 outline-none rounded w-full"
    />
  </div>

  <div className="flex flex-col w-full">
    <label className="mb-1 text-sm font-medium">
        Margin (%) <span className="text-red-500">*</span>
    </label>
    <input
      required
      name="margin"
      type="text"
      placeholder="Margin %"
      value={partData.margin}
      onChange={(e) => onPartChange("margin", e.target.value)}
      className="p-2 border border-gray-400 outline-none rounded w-full"
    />
  </div>

</div>

        </div>
      </Modal>
          </div>
          
        </div>
      )}
      {item === "labour" && (
        <div>
          <div>
            <div className="flex justify-between items-center pb-1 pr-1">
  
              <h3 className="text-sm font-bold text-black">
                Labor Details
              </h3>
              <Button
             size="small"
             shape="circle"
             onClick={showLabourModal}
             icon={<PlusOutlined />}
             className="p-1"
              />
            </div>
          </div>
          {/* {labourCollapse ? (
            <div></div>
          ) : ( */}
          <div>
            <ViewTable
              ItemArray={filteredLabours}
              page={"service-item-labour"}
            />
            <div className="py-1 justify-end pr-1 flex gap-4">
                <p>
                  Total Labors:{" "}
                  <span className="font-bold">${totalLabourAmount.toFixed(2)}</span>
                </p>
                <p>
                  Total Hour:{" "}
                  <span className="font-bold">{formatTime(totalLabourHours)}</span>
                </p>
              </div>
            <Modal
        title={
          <div className="flex items-center">
            <span>Add New Labor</span>
          </div>
        }
        open={isLabourModalVisible}
        onOk={handleLabourModalOk}
        onCancel={handleLabourModalCancel}
        width={500}
        okText="Add Labour"
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-neutral-800 hover:bg-neutral-700 border-neutral-800",
          icon: <PlusOutlined />
        }}
      >
        <div className="flex flex-col gap-y-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">
                 Description <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Description"
              value={labourData.name}
              onChange={(e) => onLabourChange("name", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col w-full">
               <label className="mb-1 text-sm font-medium">
                 Rate <span className="text-red-500">*</span>
              </label>
              <input
                name="ratePerHour"
                type="text"
                placeholder="Rate"
                value={labourData.ratePerHour}
                onChange={(e) => onLabourChange("ratePerHour", e.target.value)}
                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium">
                Hours <span className="text-red-500">*</span>
              </label>
              {/* <TimePicker
                name="requiredHours"
                onChange={(time, timeString) =>
                  onLabourChange("requiredHours", timeString)
                }
                defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  className="p-[5px] border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                format="HH:mm"
                size="small"
                value={
                  labourData.requiredHours
                    ? dayjs(labourData.requiredHours, "HH:mm")
                    : null
                }
              /> */}
              <input
                name="requiredHours"
                type="text"
                placeholder="Hours"
                value={labourData.requiredHours}
                onChange={(e) => onLabourChange("requiredHours", e.target.value)}
                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </Modal>
            
          </div>
          {/* )} */}
        </div>
      )}
      {item === "mechanicPercentage" && (
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

          {isOpen&&<div>
            <ViewTable
              ItemArray={filteredMechanicPercentage}
              page={"service-item-mechanicPercentage"}
            />
           
             <div className="mt-2">
              <div className="flex items-center justify-center gap-2 w-full">
                <Select
                  showSearch
                  placeholder="Select Technician"
                  value={mechanicPercentageData.id || undefined}
                  onChange={(value) =>
                    onMechanicPercentageChange("name", value)
                  }
                  options={userOptions}
                  className="p-[1px] outline-none rounded w-full"
                  style={{ height: "28px" }}
                  filterOption={false}
                  onSearch={setSearchTerm}
                  notFoundContent={null}
                />
                <Button

                  onClick={handleMechanicPercentageSubmit}
                 type="primary"
                 size="small"
                 className="bg-neutral-800 hover:bg-neutral-700 font-bold rounded"
                >
                  Add 
                </Button>
              </div>
            </div>
         
            
          </div>  }
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
