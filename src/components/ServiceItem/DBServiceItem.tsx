"use client";

import React, { useEffect, useState } from "react";
import { Button, TimePicker, message, Select, Modal } from "antd";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import {
  Labour,
  addChangeLabour,
  setNewInsertLabour,
  setDeleteStatusLabour,
  setUpdateStatusLabour,
  addChangePart,
  setNewInsertPart,
  setDeleteStatusPart,
  setUpdateStatusPart,
  Part,
  MechanicPercentage,
  setUpdateStatusMechanicPercentage,
  addChangeMechanicPercentage,
  setNewInsertMechanicPercentage,
  setDeleteStatusMechanicPercentage,
  addChangeDeferredLabour,
  addChangeDeferredPart,
  addChangeDeferredMechanicPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import { ArrowUpOutlined, ArrowDownOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useGetAllUsersQuery } from "@/redux/api/estimateApi";
import { SelectOption } from "@/app/(adminLayout)/admin/appointment/create/page";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { MdDownloadDone } from "react-icons/md";
import { calculateHours } from "@/utils/total-hour-calculate";
import ProgressBar from "../ViewItems/ProgressBar";
import { PiCurrencyDollarThin } from "react-icons/pi";
import { checkInvoiceAccess } from "@/utils/InvoiceAccessCheck";

const DBServiceItem = ({
  serviceCode,
  item,
  stage,
}: {
  serviceCode: string;
  item: string;
  stage?: string;
}) => {
  const query: Record<string, any> = {};
  const {role}=useAppSelector((state)=>state.imageUrl)
  const dispatch = useAppDispatch();
  const [filteredLabour, setFilteredLabour] = useState<Labour[]>([]);
  const [filteredPart, setFilteredPart] = useState<Part[]>([]);
  const [filteredMechanicPercentage, setFilteredMechanicPercentage] = useState<
    MechanicPercentage[]
  >([]);
    const totalPartAmountForService = filteredPart?.reduce((sum, item) => sum + Number(item.total), 0);
  const { totalLabourAmount, totalLabourHours } = filteredLabour.reduce(
  (acc, item) => {
    acc.totalLabourAmount += item.ratePerHour * (item.requiredHours / 60);
    acc.totalLabourHours += item.requiredHours;
    return acc;
  },
  { totalLabourAmount: 0, totalLabourHours: 0 }
);
  const [updateField, setUpdateField] = useState<number | null>(null);

  const {
    part,
    labour,
    mechanicPercentage,
    deferredPart,
    deferredLabour,
    deferredMechanicPercentage,
  } = useAppSelector((state) => state.serviceInspectionItem);


  const { serviceGeneralTire } = useAppSelector(
    (state) => state.serviceItemAssign
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  useEffect(() => {
    if (labour && stage === "Accept") {
      const filtered = labour.filter(
        (hour) => hour.serviceCode === serviceCode
      );
      setFilteredLabour(filtered);
    }
    if (labour && stage === "") {
      const filtered = labour.filter(
        (hour) => hour.serviceCode === serviceCode
      );
      setFilteredLabour(filtered);
    }
    if (deferredLabour && stage === "Deferred") {
      const filtered = labour.filter(
        (hour) => hour.serviceCode === serviceCode
      );
      setFilteredLabour(filtered);
    }
    if (part && stage === "Accept") {
      const filtered = part.filter(
        (percentage) => percentage.serviceCode === serviceCode
      );
      setFilteredPart(filtered);
    }
    if (part && stage === "") {
      const filtered = part.filter(
        (percentage) => percentage.serviceCode === serviceCode
      );
      setFilteredPart(filtered);
    }
    if (deferredPart && stage === "Deferred") {
      const filtered = deferredPart.filter(
        (percentage) => percentage.serviceCode === serviceCode
      );
      setFilteredPart(filtered);
    }
    if (mechanicPercentage && stage === "Accept") {
      const filtered = mechanicPercentage.filter(
        (item) => item.serviceCode === serviceCode
      );
      setFilteredMechanicPercentage(filtered);
    }
    if (mechanicPercentage && stage === "") {
      const filtered = mechanicPercentage.filter(
        (item) => item.serviceCode === serviceCode
      );
      setFilteredMechanicPercentage(filtered);
    }
    if (deferredMechanicPercentage && stage === "Deferred") {
      const filtered = deferredMechanicPercentage.filter(
        (item) => item.serviceCode === serviceCode
      );
      setFilteredMechanicPercentage(filtered);
    }
  }, [
    labour,
    part,
    mechanicPercentage,
    serviceCode,
    stage,
    deferredLabour,
    deferredPart,
    deferredMechanicPercentage,
  ]);

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
const excludedIds = filteredMechanicPercentage.map(m => m.id);
  const userOptions: SelectOption[] =
    userData?.filter(item => !excludedIds.includes(item.id))
    .map((user) => ({
      label: user.name,
      value: user.id,
    })) ?? [];

  const [partData, setPartData] = useState({
    serviceCode,
    name: "",
    unitPrice: "",
    provider: "",
    installationHours: null as string | null,
    quantity: "",
    margin:"50",
    total:"",
  });
  const [partUpdateData, setPartUpdateData] = useState({
    serviceCode,
    name: "",
    unitPrice: "",
    provider: "",
    installationHours: null as string | null,
    quantity: "",
    margin:"",
    total:"",
  });

  const [labourData, setLabourData] = useState({
    serviceCode,
    name: "Labor",
    ratePerHour: "100",
    requiredHours: "",
  });
  const [labourDataUpdate, setLabourDataUpdate] = useState({
    serviceCode,
    name: "",
    ratePerHour: "",
    requiredHours: "",
  });

  const [mechanicPercentageData, setMechanicPercentageData] = useState({
    serviceCode,
    name: "",
    id: "",
  });
  const [mechanicPercentageDataUpdate, setMechanicPercentageDataUpdate] =
    useState<any>({
      serviceCode,
      name: "",
      id: "",
      percentage: "",
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

const onPartUpdateChange = (key: string, value: string) => {
  setFilteredPart((prevParts) =>
    prevParts.map((part, index) => {
      if (updateField !== index) return part;
      let newPart: any = { ...part, [key]: value };
      

      const price = parseFloat(newPart.unitPrice) || 0;
      const qty = parseFloat(newPart.quantity) || 0;
      const base = price * qty;

      // keep previous margin if exists
      const previousMargin = Number(part?.margin) || 0;


      // -----------------------------
      // When Unit Price or Quantity changes
      // -----------------------------
      if (key === "unitPrice" || key === "quantity") {
        const margin =
          newPart.margin !== undefined && newPart.margin !== ""
            ? parseFloat(newPart.margin)
            : previousMargin;

        newPart.margin = margin;
        newPart.total = base * (1 + margin / 100);
      }

      // -----------------------------
      // When TOTAL changes → update margin
      // -----------------------------
      if (key === "total") {
        const total = parseFloat(value) || 0;
        
        if (base > 0) {
          newPart.margin = ((total - base) / base) * 100;
        } else {
          newPart.margin = previousMargin;
        }
      }

      // -----------------------------
      // When MARGIN changes → update total
      // -----------------------------
      if (key === "margin") {
        const margin = parseFloat(value) || 0;
        newPart.margin = margin;
        newPart.total = base * (1 + margin / 100);
      }
      return newPart;
    })
  );

};


  const onLabourChange = (field: string, value: string | null | string[]) => {
    setLabourData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };
  const onLabourUpdateChange = (
    field: string,
    value: string | null | string[]
  ) => {
    setLabourDataUpdate((prev) => ({
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
    }
  };

  const onMechanicPercentageUpdate = (
    field: string,
    value: string | null | string[] | unknown
  ) => {
    if (field === "name") {
      const selectedUser = userOptions.find((option) => option.value === value);
      if (selectedUser) {
        setMechanicPercentageDataUpdate((prev: any) => ({
          ...prev,
          id: selectedUser.value,
          name: selectedUser.label,
        }));
      }
    } else {
      setMechanicPercentageDataUpdate((prev: any) => ({
        ...prev,
        [field]: typeof value === "string" ? value : "",
      }));
    }
  };

  const handleLabourUpdate = (id: any) => {
    setUpdateField(null);
    let existingItem: any = {};
    if (stage === "Deferred") {
      existingItem = deferredLabour.find((entry: any) => entry.labourId === id);
    } else {
      existingItem = labour.find((entry: any) => entry.labourId === id);
    }
    const finalLabourName = labourDataUpdate.name || existingItem?.name;

    const finalLabourRatePerHour =
      labourDataUpdate.ratePerHour || existingItem?.ratePerHour;
    const finalLabourRequiredHours =
      parseFloat(labourDataUpdate?.requiredHours)*60 || existingItem?.requiredHours

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredLabour({
          serviceCode,
          serviceStage: stage,
          name: finalLabourName || existingItem?.name,
          labourId: id,
          requiredHours: finalLabourRequiredHours,
          ratePerHour: parseFloat(finalLabourRatePerHour),
        })
      );
      dispatch(setUpdateStatusLabour(true));
    } else {
      dispatch(
        addChangeLabour({
          serviceCode,
          serviceStage: stage,
          name: finalLabourName || existingItem?.name,
          labourId: id,
          requiredHours: finalLabourRequiredHours,
          ratePerHour: parseFloat(finalLabourRatePerHour),
        })
      );
      dispatch(setUpdateStatusLabour(true));
    }
  };

  const handlePartUpdate = (id: any) => {
    setUpdateField(null);
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredPart.find((entry: any) => entry.partId === id);
    } else {
      existingItem = part.find((entry: any) => entry.partId === id);
    }
    const updatedItem = filteredPart?.find(
    (item: any) => item.partId === id
  );
    const finalPartName = updatedItem?.name || existingItem?.name;

    const finalPartQuantity = updatedItem?.quantity || existingItem?.quantity;
    const finalPartTotal = updatedItem?.total || existingItem?.total;
    const finalPartMargin = updatedItem?.margin||0 ;
    const finalPartProvider =
      updatedItem?.provider || existingItem?.provider;

    const finalInstallationHours:any =
      updatedItem?.installationHours ||
      calculateHours(existingItem?.installationHours);
    const finalUnitPrice = updatedItem?.unitPrice || existingItem?.unitPrice;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredPart({
          partId: id,
          serviceStage: stage,
          serviceCode,
          name: finalPartName,
          installationHours: finalInstallationHours
            ? parseInt(finalInstallationHours?.split(":")[0], 10) * 60 +
              parseInt(finalInstallationHours?.split(":")[1], 10)
            : 0,
          provider: finalPartProvider,
          unitPrice: parseFloat(finalUnitPrice),
          quantity: parseInt(finalPartQuantity, 10),
          margin:Number(finalPartMargin),
          total:parseFloat(finalPartTotal),
        })
      );
      dispatch(setUpdateStatusPart(true));
    } else {
      dispatch(
        addChangePart({
          partId: id,
          serviceStage: stage,
          serviceCode,
          name: finalPartName,
          installationHours: finalInstallationHours
            ? parseInt(finalInstallationHours?.split(":")[0], 10) * 60 +
              parseInt(finalInstallationHours?.split(":")[1], 10)
            : 0,
          provider: finalPartProvider,
          unitPrice: parseFloat(finalUnitPrice),
          quantity: parseInt(finalPartQuantity, 10),
          margin:Number(finalPartMargin),
          total:parseFloat(finalPartTotal),
        })
      );
      dispatch(setUpdateStatusPart(true));
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
        addChangeDeferredPart({
          ...partData,
          serviceCode: serviceCode,
          serviceStage: stage,
          installationHours: partData.installationHours
            ? parseInt(partData.installationHours.split(":")[0], 10) * 60 +
              parseInt(partData.installationHours.split(":")[1], 10)
            : 0,
          unitPrice: parseFloat(partData.unitPrice),
          quantity: parseInt(partData.quantity, 10),
          margin:parseFloat(partData.margin),
          total:parseFloat(partData.total),
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
        total:"",
      });
      dispatch(setNewInsertPart(true));
    } else {
      dispatch(
        addChangePart({
          ...partData,
          serviceCode: serviceCode,
          serviceStage: stage,
          installationHours: partData.installationHours
            ? parseInt(partData.installationHours.split(":")[0], 10) * 60 +
              parseInt(partData.installationHours.split(":")[1], 10)
            : 0,
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
        total:"",
      });
      dispatch(setNewInsertPart(true));
    }
  };

  const handleLabourSubmit = async () => {
    const { name, ratePerHour, requiredHours } = labourData;
    
        if (!name || !ratePerHour || !requiredHours) {
          message.error("All fields are required!");
          return;
        }

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredLabour({
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
      dispatch(setNewInsertLabour(true));
    } else {
      dispatch(
        addChangeLabour({
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
      dispatch(setNewInsertLabour(true));
    }
    setIsModalVisible(false);
  };

  //delete single labour
  const handleLabourDelete = (labourId: any) => {
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredLabour.find(
        (entry: any) => entry.labourId === labourId
      );
    } else {
      existingItem = labour.find((entry: any) => entry.labourId === labourId);
    }

    const finalRequiredHours = calculateHours(existingItem?.requiredHours);

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredLabour({
          serviceCode,
          serviceStage: stage,
          name: existingItem.name,
          labourId: existingItem.labourId,
          requiredHours: finalRequiredHours
            ? parseInt(finalRequiredHours?.split(":")[0], 10) * 60 +
              parseInt(finalRequiredHours?.split(":")[1], 10)
            : 0,
          ratePerHour: parseFloat(existingItem.ratePerHour),
        })
      );
      dispatch(setDeleteStatusLabour(true));
    } else {
      dispatch(
        addChangeLabour({
          serviceCode,
          serviceStage: stage,
          name: existingItem.name,
          labourId: existingItem.labourId,
          requiredHours: finalRequiredHours
            ? parseInt(finalRequiredHours?.split(":")[0], 10) * 60 +
              parseInt(finalRequiredHours?.split(":")[1], 10)
            : 0,
          ratePerHour: parseFloat(existingItem.ratePerHour),
        })
      );
      dispatch(setDeleteStatusLabour(true));
    }
  };
  const handlePartDelete = (partId: any) => {
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredPart.find((entry: any) => entry.partId === partId);
    } else {
      existingItem = part.find((entry: any) => entry.partId === partId);
    }
    const finalInstallationHours = calculateHours(
      existingItem?.installationHours
    );

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredPart({
          partId: existingItem?.partId,
          serviceStage: stage,
          serviceCode: serviceCode,
          name: existingItem?.name,
          unitPrice: parseFloat(existingItem?.unitPrice),
          quantity: parseInt(existingItem?.quantity, 10),
          provider: existingItem?.provider,
          installationHours: finalInstallationHours
            ? parseInt(finalInstallationHours?.split(":")[0], 10) * 60 +
              parseInt(finalInstallationHours?.split(":")[1], 10)
            : 0,
          margin:parseFloat(existingItem.margin),
          total:parseFloat(existingItem.total),
        })
      );
      dispatch(setDeleteStatusPart(true));
    } else {
      dispatch(
        addChangePart({
          partId: existingItem?.partId,
          serviceStage: stage,
          serviceCode: serviceCode,
          name: existingItem?.name,
          unitPrice: parseFloat(existingItem?.unitPrice),
          quantity: parseInt(existingItem?.quantity, 10),
          provider: existingItem?.provider,
          installationHours: finalInstallationHours
            ? parseInt(finalInstallationHours?.split(":")[0], 10) * 60 +
              parseInt(finalInstallationHours?.split(":")[1], 10)
            : 0,
          margin:parseFloat(existingItem.margin),
          total:parseFloat(existingItem.total),
        })
      );
      dispatch(setDeleteStatusPart(true));
    }
  };

  const handleMechanicPercentageUpdate = (id: string) => {
    setUpdateField(null);

    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredMechanicPercentage.find(
        (entry: any) => entry.mechanicPercentageId === id
      );
    } else {
      existingItem = mechanicPercentage.find(
        (entry: any) => entry.mechanicPercentageId === id
      );
    }

    const finalMechanicPercentage =
      mechanicPercentageDataUpdate.percentage || existingItem?.percentage;

    const finalMechanicId = mechanicPercentageDataUpdate.id || existingItem?.id;
    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredMechanicPercentage({
          serviceCode: existingItem?.serviceCode,
          mechanicPercentageId: existingItem?.mechanicPercentageId,
          serviceStage: stage,
          percentage: finalMechanicPercentage?.endsWith("%")
          ? finalMechanicPercentage
          : `${finalMechanicPercentage}%`,
          id: finalMechanicId,
          name: mechanicPercentageData.name,
        })
      );
      dispatch(setUpdateStatusMechanicPercentage(true));

      setMechanicPercentageDataUpdate({
        serviceCode: "",
        id: "",
        name: "",
        percentage: "",
      });
      setSearchTerm("");
    } else {
      dispatch(
        addChangeMechanicPercentage({
          serviceCode: existingItem?.serviceCode,
          mechanicPercentageId: existingItem?.mechanicPercentageId,
          serviceStage: stage,
          percentage: finalMechanicPercentage.endsWith("%")
          ? finalMechanicPercentage
          : `${finalMechanicPercentage}%`,

          id: finalMechanicId,
          name: mechanicPercentageData.name,
        })
      );
      dispatch(setUpdateStatusMechanicPercentage(true));

      setMechanicPercentageDataUpdate({
        serviceCode: "",
        id: "",
        name: "",
        percentage: "",
      });
      setSearchTerm("");
    }
  };

  const handleMechanicPercentageSubmit = () => {
    const { name } = mechanicPercentageData;

    if (!name) {
      message.error("All fields are required!");
      return;
    }

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredMechanicPercentage({
          serviceCode,
          serviceStage: stage,
          id: mechanicPercentageData.id,
          name: mechanicPercentageData.name,
        })
      );
      dispatch(setNewInsertMechanicPercentage(true));
      setMechanicPercentageData({
        serviceCode: "",
        id: "",
        name: "",
      });
      setSearchTerm("");
    } else {
      dispatch(
        addChangeMechanicPercentage({
          serviceCode,
          serviceStage: stage,
          id: mechanicPercentageData.id,
          name: mechanicPercentageData.name,
        })
      );
      dispatch(setNewInsertMechanicPercentage(true));
      setMechanicPercentageData({
        serviceCode: "",
        id: "",
        name: "",
      });
      setSearchTerm("");
    }
  };
  const handleDeleteMechanicPercentage = (id: string) => {
    let existingItem: any = {};

    if (stage === "Deferred") {
      existingItem = deferredMechanicPercentage.find(
        (entry: any) => entry.mechanicPercentageId === id
      );
    } else {
      existingItem = mechanicPercentage.find(
        (entry: any) => entry.mechanicPercentageId === id
      );
    }

    const finalMechanicId = existingItem?.id;

    if (stage === "Deferred") {
      dispatch(
        addChangeDeferredMechanicPercentage({
          serviceCode: existingItem?.serviceCode,
          serviceStage: stage,
          mechanicPercentageId: existingItem?.mechanicPercentageId,
          id: finalMechanicId,
          name: existingItem?.name,
        })
      );
      dispatch(setDeleteStatusMechanicPercentage(true));
    } else {
      dispatch(
        addChangeMechanicPercentage({
          serviceCode: existingItem?.serviceCode,
          serviceStage: stage,
          mechanicPercentageId: existingItem?.mechanicPercentageId,
          id: finalMechanicId,
          name: existingItem?.name,
        })
      );
      dispatch(setDeleteStatusMechanicPercentage(true));
    }
  };
 const [isModalVisible, setIsModalVisible] = useState(false);
 const [isLabourModalVisible, setLabourIsModalVisible] = useState(false);
 const {
    estimateType,
  } = useAppSelector((state) => state.estimateItemShow);
  const showModal = () => {
    if (!checkInvoiceAccess(role, estimateType)) return;
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    handlePartSubmit();
    
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const showLabourModal = () => {
    if (!checkInvoiceAccess(role, estimateType)) return;
    setLabourIsModalVisible(true);
  };
  const handleLabourModalOk = () => {
    handleLabourSubmit();
    setLabourIsModalVisible(false);
  };

  const handleLabourModalCancel = () => {
    setLabourIsModalVisible(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  
    const handleToggle = () => {
       if (!checkInvoiceAccess(role, estimateType)) return;
      setIsOpen((prev) => !prev);
      
    };
  return (
    <div className=" rounded my-2 p-2 border border-solid border-gray-200">
      {item === "part" && (
        <div>
          <div>
            <div className="flex justify-between items-center pb-1 border-b border-0 border-solid border-gray-200 pr-1 ">
              <h3 className="text-sm text-black">
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
          </div>

          <div>
            <div className="mt-1">
  {filteredPart?.length > 0 &&
    filteredPart.map((item, index) => (
      <div
        key={item.partId}
        className="flex items-center justify-center gap-2 space-y-1"
      >
        {/* 1. Part Name */}
        <div className="flex flex-col w-full">
          {updateField === index ? (
            <input
              value={item.name || ""}
              onChange={(e) => onPartUpdateChange("name", e.target.value)}
              className="p-1 border border-gray-400 rounded w-full outline-none"
            />
          ) : (
            <span className="w-full">{item.name || "N/A"}</span>
          )}
        </div>

        {/* 2. Margin */}
        <div className="flex flex-col w-full">
          {updateField === index ? (
            <input
              value={item.margin}
              onChange={(e) => onPartUpdateChange("margin", e.target.value)}
              className="p-1 border border-gray-400 rounded w-full outline-none"
            />
          ) : (
            <span className="w-full">{item.margin?.toFixed(2) +'%'|| "0.00"}</span>
          )}
        </div>

        {/* 3. Unit Price */}
        <div className="flex flex-col w-full">
          {updateField === index ? (
            <input
              value={item.unitPrice}
              onChange={(e) =>
                onPartUpdateChange("unitPrice", e.target.value)
              }
              className="p-1 border border-gray-400 rounded w-full outline-none"
            />
          ) : (
            <span className="w-full flex items-center "> <PiCurrencyDollarThin />{item.unitPrice || "0.00"}/Unit</span>
          )}
        </div>

        {/* 4. Quantity */}
        <div className="flex flex-col w-full">
          {updateField === index ? (
            <input
              value={item.quantity}
              onChange={(e) =>
                onPartUpdateChange("quantity", e.target.value)
              }
              className="p-1 border border-gray-400 rounded w-full outline-none"
            />
          ) : (
            <span className="w-full">{item.quantity || "N/A"} Unit</span>
          )}
        </div>

        {/* 5. Total */}
        <div className="flex flex-col w-full">
          {updateField === index ? (
            <input
              value={item.total}
              onChange={(e) => onPartUpdateChange("total", e.target.value)}
              className="p-1 border border-gray-400 rounded w-full outline-none"
            />
          ) : (
            <span className="w-full flex items-center"> <PiCurrencyDollarThin />{Number(item?.total).toFixed(2) || "0.00"}</span>
          )}
        </div>

        {/* 6. Action Buttons */}
        {updateField === index ? (
          <Button
            onClick={() => handlePartUpdate(item.partId)}
            size="small"
          >
            <MdDownloadDone className="text-md" />
          </Button>
        ) : (
          <Button onClick={() => {
             if (!checkInvoiceAccess(role, estimateType)) return;
              setUpdateField(index)
          }} size="small">
            <FiEdit className="text-md" />
          </Button>
        )}

        <Button onClick={() => {
          if (!checkInvoiceAccess(role, estimateType)) return;
          handlePartDelete(item.partId)
        }} size="small">
          <AiOutlineDelete className="text-md" />
        </Button>
      </div>
    ))}
</div>

            <div className=" p-1 text-end">
                <p>
                  Total Parts:{" "}
                  <span className="font-bold">{totalPartAmountForService?.toFixed(2)}</span>
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
                            <label className="mb-1 text-sm font-medium">
                               Supplier 
                             </label>
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
            <div className="flex justify-between items-center pb-1 border-b border-0 border-solid border-gray-200 pr-1 ">
             
              <h3 className="text-sm font-bold text-black ">
                Labors 
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

          <div>
            <div className="mt-1">
              {filteredLabour?.length > 0 &&
        filteredLabour?.map((item, index) => (
          <div
            key={item.labourId}
            className="flex items-center gap-2"
          >
            {/* Labour Name */}
            <div className="flex flex-col w-full">
              {updateField === index ? (
                <input
                  name={`LabourName${index}`}
                  defaultValue={item?.name || ""}
                  onChange={(e) => onLabourUpdateChange("name", e.target.value)}
                  className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
                />
              ) : (
                <span className="w-full p-1">{item?.name || "-"}</span>
              )}
            </div>
      
            {/* Rate Per Hour */}
            <div className="flex flex-col w-full">
              {updateField === index ? (
                <input
                  name={`ratePerHour${index}`}
                  defaultValue={item?.ratePerHour || 0}
                  onChange={(e) => onLabourUpdateChange("ratePerHour", e.target.value)}
                  className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
                />
              ) : (
                <span className="w-full p-1 flex items-center"> <PiCurrencyDollarThin />{item?.ratePerHour || 0}/Hour</span>
              )}
            </div>
      
            {/* Required Hours */}
            <div className="flex flex-col w-full">
              {updateField === index ? (
                <input
                name={`requiredHours${index}`}
                type="text"
                placeholder="Hours"
                defaultValue={item.requiredHours/60 ||0}
                onChange={(e) => onLabourUpdateChange("requiredHours", e.target.value)}
                  className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
              />
                // <TimePicker
                //   name={`requiredHours${index}`}
                //   format="HH:mm"
                //   defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                //   className="border px-2 py-[1px] border-gray-400 outline-none rounded w-full"
                //   defaultValue={
                //     item?.requiredHours
                //       ? dayjs(calculateHours(item?.requiredHours), "HH:mm")
                //       : null
                //   }
                //   onChange={(time, timeString) =>
                //     onLabourUpdateChange("requiredHours", timeString)
                //   }
                // />
              ) : (
                <span className="w-full p-1">
                {`${(item.requiredHours / 60).toFixed(2)} Hour`}
                </span>
              )}
            </div>
      
      {/* Action Buttons */}
      {updateField === index ? (
        <Button
          onClick={() => handleLabourUpdate(item?.labourId)}
          size="small"
        >
          <MdDownloadDone className="text-md " />
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (!checkInvoiceAccess(role, estimateType)) return;
            setUpdateField(index)
          }}
          size="small"
        >
          <FiEdit className="text-md" />
        </Button>
      )}

      <Button
        size="small"
        onClick={() => {
           if (!checkInvoiceAccess(role, estimateType)) return;
          handleLabourDelete(item?.labourId)
        }}
      >
        <AiOutlineDelete className="text-md " />
      </Button>
    </div>
  ))}

            </div>
            <div className="p-1 flex justify-end gap-3">
                <p>
                  Total Labors:{" "}
                  <span className="font-bold">{totalLabourAmount.toFixed(2)}</span>
                </p>
                <p>
                   Total Hour:{" "}
                  <span className="font-bold">  {(totalLabourHours / 60).toFixed(2)}</span>
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
                            placeholder="Labour Description"
                            value={labourData.name}
                            onChange={(e) => onLabourChange("name", e.target.value)}
                              className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                          />
                        </div>
              
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col w-full">
                            <label className="mb-1 text-sm font-medium">
                              Labour Rate <span className="text-red-500">*</span>
                            </label>
                            <input
                              name="ratePerHour"
                              type="text"
                              placeholder="Labour Rate"
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
            {/* <div className="flex items-center gap-3 justify-center mt-5">
              <div className="flex flex-col w-full">
                <label>Labour Details</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Labour Details"
                  value={labourData.name}
                  onChange={(e) => onLabourChange("name", e.target.value)}
                  className="p-2 border border-gray-400 outline-none rounded w-full"
                />
              </div>

              <div className="flex flex-col w-full">
                <label>Labour Rate</label>
                <input
                  name="ratePerHour"
                  type="text"
                  placeholder="Labour Rate"
                  value={labourData.ratePerHour}
                  onChange={(e) =>
                    onLabourChange("ratePerHour", e.target.value)
                  }
                  className="p-2 border border-gray-400 outline-none rounded w-full"
                />
              </div>

              <div className="flex flex-col w-full">
                <label>Hours</label>
                <TimePicker
                  name="requiredHours"
                  onChange={(time, timeString) =>
                    onLabourChange("requiredHours", timeString)
                  }
                  defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  className="border border-gray-400 outline-none rounded w-full"
                  format="HH:mm"
                  value={
                    labourData.requiredHours
                      ? dayjs(labourData.requiredHours, "HH:mm")
                      : null
                  }
                />
              </div>
            </div>
            <div className="flex justify-between items-center mt-5">
              <div>
                <Button
                  type="primary"
                  className="mt-4  bg-neutral-800 hover:bg-neutral-700 cursor-pointer font-bold"
                  onClick={handleLabourSubmit}
                >
                  Add Labour
                </Button>
              </div>
              
            </div> */}
          </div>
        </div>
      )}
      {item === "mechanicPercentage" && (
        <div>
           <div className="flex justify-between items-center pr-1">
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

         {isOpen&& <div>
            <div className="mt-1">
               {filteredMechanicPercentage?.length > 0 &&
             filteredMechanicPercentage?.map((item: MechanicPercentage, index) => (
               <div key={index} className="flex items-center gap-4">
                 {/* Mechanic Select */}
                 <div className="flex flex-col w-full">
                   {updateField === index ? (
                     <Select
                       showSearch
                       placeholder="Select Mechanic"
                       value={mechanicPercentageDataUpdate?.name}
                       onChange={(value) =>
                         onMechanicPercentageUpdate("name", value)
                       }
                       style={{ height: "28px" }}
                       options={userOptions}
                       allowClear
                       className="p-[2px] outline-none rounded w-full"
                       filterOption={false}
                       onSearch={setSearchTerm}
                       notFoundContent={null}
                     />
                   ) : (
                     <span className="p-1">{item?.name || "-"}</span>
                   )}
                 </div>
           
                 {/* Percentage Input */}
                 <div className="flex flex-col w-full">
                   {updateField === index ? (
                     <input
                       name="percentage"
                       type="text"
                       placeholder="Percentage"
                       value={mechanicPercentageDataUpdate?.percentage}
                       onChange={(e) =>
                         onMechanicPercentageUpdate("percentage", e.target.value)
                       }
                       className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
                     />
                   ) : (
                     <span className="w-full p-1"><ProgressBar percentage={item?.percentage}></ProgressBar></span>
                   )}
                 </div>
           
                 {/* Edit / Save Button */}
                 {updateField === index ? (
                   <Button
                     onClick={() =>
                       handleMechanicPercentageUpdate(item?.mechanicPercentageId || "")
                     }
                     size="small"
                   >
                     <MdDownloadDone className="text-md" />
                   </Button>
                 ) : (
                   <Button
                     size="small"
                     onClick={() => {
                       setMechanicPercentageDataUpdate({
                         serviceCode: item.serviceCode,
                         name: item.name,
                         id: item.id,
                         percentage: item.percentage,
                       });
                       setUpdateField(index);
                     }}
                   >
                     <FiEdit className="text-md" />
                   </Button>
                 )}
           
                 {/* Delete Button */}
                 <Button
                   size="small"
                   onClick={() =>
                     handleDeleteMechanicPercentage(item?.mechanicPercentageId || "")
                   }
                 >
                   <AiOutlineDelete className="text-md" />
                 </Button>
               </div>
             ))}

            </div>
            <div className="flex items-center gap-3 justify-center mt-1">
              <div className="flex items-center gap-2 justify-between w-full">
        
                <Select
                  showSearch
                  placeholder="Select Mechanic"
                  value={mechanicPercentageData?.name || undefined}
                  onChange={(value) =>
                    onMechanicPercentageChange("name", value)
                  }
                  options={userOptions}
                  className="w-full"
                  style={{ height: "28px" }}
                  allowClear
                  filterOption={false}
                  onSearch={setSearchTerm}
                  notFoundContent={null}
                />
                <Button
                  size="small"
                  type="primary"
                  className="bg-neutral-800 hover:bg-neutral-700 font-bold rounded"
                  onClick={handleMechanicPercentageSubmit}
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

export default DBServiceItem;
