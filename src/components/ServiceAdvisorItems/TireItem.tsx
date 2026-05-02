import dayjs from "dayjs";
import tireImage from "@/assets/tireImage.svg";
import {
  useAddLabourTireItemMutation,
  useAddPartTireItemMutation,
  useAddTechnicianTireItemMutation,
  useDeleteLabourTireItemMutation,
  useDeletePartTireItemMutation,
  useDeleteTechnicianPercentageTireItemMutation,
  useGetSingleTireItemQuery,
  useUpdateLabourTireItemMutation,
  useUpdatePartTireItemMutation,
  useUpdateServiceTypeTireItemMutation,
  useUpdateTechnicianPercentageTireItemMutation,
  useUpdateTireServiceMutation,
} from "@/redux/api/serviceAdvisorApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
} from "@/redux/slice/estimateItemShowSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CloseOutlined,
  EditFilled,
  MenuOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  Labour,
  MechanicPercentage,
  Part,
  removeAllState,
} from "@/redux/slice/serviceInspectionItemSlice";
import {
  calculateAddAmount,
  calculateGeneralItemAddAmountForPart,
  calculateItemUpdateAmountForPart,
  calculateUpdateAmount,
} from "@/utils/amount";
import {
  calculateHours,
  calculateItemTotalHoursUpdated,
  calculateItemTotalHoursWithoutState,
  calculateTotalHoursUpdated,
  calculateTotalHoursWithoutState,
} from "@/utils/total-hour-calculate";
import { Button, message, Modal, Select, TimePicker } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdDownloadDone } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { useGetAllUsersQuery } from "@/redux/api/estimateApi";
import { SelectOption } from "@/app/(adminLayout)/admin/appointment/create/page";
import Image from "next/image";
import ProgressBar from "../ViewItems/ProgressBar";
import { PiCurrencyDollarThin } from "react-icons/pi";
import { getUserInfo } from "@/services/auth.service";
import AddPart from "../Part/addPart";
import AddLabor from "../Labor/addLabor";
import { convertToDecimalHour } from "@/utils/convertToDecimalHour ";

interface IService {
  code: string;
  title?: string;
  description?: string;
  type?: string;
  stage: string;
}

const TireItem = ({ ItemTire, option }: { ItemTire: any; option?: string }) => {
  const query: Record<string, any> = {};
  const { role} = getUserInfo() as any;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>();
  const [services, setServices] = useState<IService[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [mechanicPercentages, setMechanicPercentages] = useState<
    MechanicPercentage[]
  >([]);
  const [deferredLabours, setDeferredLabours] = useState<Labour[]>([]);
  const [deferredParts, setDeferredParts] = useState<Part[]>([]);
  const [deferredMechanicPercentages, setDeferredMechanicPercentages] =
    useState<MechanicPercentage[]>([]);
  const [collapse, setCollapse] = React.useState(true);
  const [partCollapse, setPartCollapse] = React.useState(false);
  const [labourCollapse, setLabourCollapse] = React.useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedTire, setSelectedTire] = useState<any>(null);
  const [isActive, setIsActive] = React.useState({
    code: "",
    active: false,
  });
  const [changeItem, setChangeItem] = React.useState({
    code: "",
    type: "",
    title: "",
    description: "",
  });

  const handleImageClick = (tire: any) => {
    setSelectedTire(tire);
    setShowModal(true);
  };
  const [updateField, setUpdateField] = useState<string | null | undefined>(null);
  const [partUpdateData, setPartUpdateData] = useState<Part[]>([]);
  const [labourData, setLabourData] = useState({
    name: "",
    ratePerHour: "",
    requiredHours: "",
  });
  const [labourDataUpdate, setLabourDataUpdate] = useState({
    name: "",
    ratePerHour: "",
    requiredHours: "",
  });
  const [mechanicPercentageData, setMechanicPercentageData] = useState({
    name: "",
    id: "",
  });
  const [mechanicPercentageDataUpdate, setMechanicPercentageDataUpdate] =
    useState({
      name: "",
      id: "",
      percentage: "",
    });
  const dispatch = useAppDispatch();

  const { handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );

  query["searchTerm"] = searchTerm;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  useEffect(() => {
    dispatch(removeAllEstimateConcernItems());
    dispatch(removeAllEstimateInspectionItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(setUserId(""));
    dispatch(setVehicleId(""));

    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
  }, [dispatch, ItemTire]);

  const [updatePartTireItem] = useUpdatePartTireItemMutation();
  const [deletePartTireItem] = useDeletePartTireItemMutation();
  const [addPartTireItem] = useAddPartTireItemMutation();
  const [updateLabourTireItem] = useUpdateLabourTireItemMutation();
  const [deleteLabourTireItem] = useDeleteLabourTireItemMutation();
  const [addLabourTireItem] = useAddLabourTireItemMutation();
  const [updateTechnicianPercentageTireItem] =
    useUpdateTechnicianPercentageTireItemMutation();
  const [deleteTechnicianPercentageTireItem] =
    useDeleteTechnicianPercentageTireItemMutation();
  const [addTechnicianTireItem] = useAddTechnicianTireItemMutation();
  const [updateServiceTypeTireItem] = useUpdateServiceTypeTireItemMutation();
  const [updateTireService] = useUpdateTireServiceMutation();

  const { data: userInfo } = useGetAllUsersQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const userData = userInfo?.data;

  const userOptions: SelectOption[] =
    userData?.map((user) => ({
      label: user.name,
      value: user.id,
    })) ?? [];


  const onPartUpdateChange = (key: string, value: string) => {
  setPartUpdateData((prevParts) =>
    prevParts.map((part) => {
      if (updateField !== part?.partId) return part;
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
    value: string | null | string[]
  ) => {
    if (field === "name") {
      const selectedUser = userOptions.find((option) => option.value === value);
      if (selectedUser) {
        setMechanicPercentageDataUpdate((prev) => ({
          ...prev,
          id: selectedUser.value,
          name: selectedUser.label,
        }));
      }
    } else {
      setMechanicPercentageDataUpdate((prev) => ({
        ...prev,
        [field]: typeof value === "string" ? value : "",
      }));
    }
  };

  const { data: TireData, refetch: TireItemFetch } = useGetSingleTireItemQuery(
    { id: ItemTire?.id },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  useEffect(() => {
    if (TireData?.itemTireService?.length > 0) {
      const mappedServices = TireData.itemTireService.map((item: any) => ({
        code: item.serviceCode || "",
        title: item.serviceTireTitle || "",
        description: item.serviceTireDescription || "",
        type: item.service?.type || "",
        stage: item.stage || "",
      }));

      setServices(mappedServices);
    } else {
      setServices([]);
    }
  }, [TireData]);

  useEffect(() => {
    if (TireData) {
      setLabours([]);
      setParts([]);
      setPartUpdateData([])
      setMechanicPercentages([]);
      setDeferredLabours([]);
      setDeferredParts([]);
      setDeferredMechanicPercentages([]);

      // Helper function to categorize data into Accept & Deferred arrays
      const categorizeItems = (array: any[], stageKey: string) => {
        const acceptItems =
          array?.filter((item) => item[stageKey] === "Accept") || [];
        const deferredItems =
          array?.filter((item) => item[stageKey] === "Deferred") || [];
        return { acceptItems, deferredItems };
      };

      const { acceptItems: acceptLabours, deferredItems: deferredLabours } =
        categorizeItems(
          TireData?.ItemTireServiceLabour?.map((item: any) => ({
            serviceCode: item.serviceCode,
            labourId: item.labourId,
            name: item.labour.name,
            ratePerHour: item.labour.ratePerHour,
            requiredHours: item.requiredHours,
            serviceStage: item.stage,
          })),
          "serviceStage"
        );

      const { acceptItems: acceptParts, deferredItems: deferredParts } =
        categorizeItems(
          TireData?.ItemTireServiceParts?.map((item: any) => ({
            serviceCode: item?.serviceCode,
            partId: item?.partId,
            name: item?.part?.name,
            unitPrice: item?.part?.unitPrice,
            provider: item?.part?.provider,
            margin:item?.part?.margin,
            total:item?.part?.total,
            installationHours: item?.part?.installationHours,
            quantity: item?.totalUnit,
            serviceStage: item.stage,
          })),
          "serviceStage"
        );

      const {
        acceptItems: acceptMechanicPercentages,
        deferredItems: deferredMechanicPercentages,
      } = categorizeItems(
        TireData?.ItemTireTechnician?.map((item: any) => ({
          serviceCode: item.serviceCode,
          mechanicPercentageId: item.id,
          id: item.technicianId,
          name: item.technician.name,
          percentage: item.percentage,
          serviceStage: item.stage,
        })),
        "serviceStage"
      );

      setLabours(acceptLabours);
      setParts(acceptParts);
      setPartUpdateData(acceptParts)
      setMechanicPercentages(acceptMechanicPercentages);
      setDeferredLabours(deferredLabours);
      setDeferredParts(deferredParts);
      setDeferredMechanicPercentages(deferredMechanicPercentages);
    }
  }, [dispatch, TireData]);

  const handleSave = async () => {
    const { code, title, description } = changeItem;
    const payload = {
      title,
      description,
    };
    try {
      await updateTireService({
        tireId: ItemTire?.id,
        serviceCode: code,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Service updated successfully");
          TireItemFetch();
        });
    } catch (err: any) {
      message.error(
        `Failed to update service: ${err.data.message}. Please try again.`
      );
    }

    // Reset active state
    setIsActive({ code: "", active: false });
  };

  const handleUpdatePartTire = async (
    partId: string | any,
    serviceCode: string | any,
    stage: string | any
  ) => {
    setUpdateField(null);
    const existingItem: any = parts.find(
      (entry: any) => entry.partId === partId
    );
    const updatedItem = partUpdateData?.find(
    (item: any) => item.partId === partId );
    const finalPartName = updatedItem?.name || existingItem?.name;

    const finalPartQuantity = updatedItem?.quantity || existingItem?.quantity;
    const finalPartProvider =
      updatedItem?.provider || existingItem?.provider;
    const finalUnitPrice = updatedItem?.unitPrice || existingItem?.unitPrice;
    const finalMargin = updatedItem?.margin || existingItem?.margin;
    const finalTotal = updatedItem?.total || existingItem?.total;
    const changePart = {
      partId,
      serviceStage: stage,
      serviceCode,
      name: finalPartName,
      installationHours: 0,
      provider: finalPartProvider,
      unitPrice: parseFloat(finalUnitPrice),
      quantity: parseInt(finalPartQuantity, 10),
      margin:parseFloat(finalMargin),
      total:parseFloat(finalTotal)
    };
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateItemUpdateAmountForPart(
        existingItem?.total,
        changePart.total,
        TireData?.partsTotalAmount,
        TireData?.totalAmount
      );

    const totalHoursUpdated = calculateTotalHoursUpdated(
      TireData?.totalHours,
      changePart.installationHours,
      existingItem?.installationHours
    );


    const formattedData = {
      part: {
        ...changePart,
        partsTotalAmount: itemTotalAmountUpdated,
        totalAmount: totalAmountUpdated,
        totalHours: totalHoursUpdated,
      },
    };

    try {
      await updatePartTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          message.success("Part updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update part: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleDeletePartTire = async (
    partId: string | any,
    serviceCode: string | any
  ) => {
    // Add confirmation dialog
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this part?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      return;
    }

    try {
      await deletePartTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: serviceCode,
        partId: partId,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          message.success("Part deleted successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to delete part: ${err?.data?.message}. Please try again.`
      );
    }
  };
const handleNewInsertPartTire = async (part: any) => {
  const { itemTotalAmountUpdated, totalAmountUpdated } =
    calculateGeneralItemAddAmountForPart(
      part.total,
      TireData.partsTotalAmount,
      TireData.totalAmount
    );

  const totalHoursUpdated = calculateTotalHoursWithoutState(
    TireData.totalHours,
    part.installationHours
  );

  const finalPayload = {
    ...part,
    serviceCode: selectedItem?.code,
    serviceStage: selectedItem?.stage,
    partsTotalAmount: itemTotalAmountUpdated,
    totalAmount: totalAmountUpdated,
    totalHours: totalHoursUpdated,
  }

  await addPartTireItem({
    technicianInspectionItemTireId: ItemTire.id,
    serviceCode: finalPayload.serviceCode,
    data: JSON.stringify(finalPayload),
  }).unwrap();

  TireItemFetch();
};
  const handleUpdateLabourTire = async (
    labourId: string | any,
    serviceCode: string | any,
    stage: string | any
  ) => {
    setUpdateField(null);
    const existingItem: any = labours.find(
      (entry: any) => entry.labourId === labourId
    );
    const finalLabourName = labourDataUpdate.name || existingItem?.name;

    const finalLabourRatePerHour =
      labourDataUpdate.ratePerHour || existingItem?.ratePerHour;
    const finalLabourRequiredHours =
      parseFloat(labourDataUpdate?.requiredHours)*60 || existingItem?.requiredHours
    const changeLabour = {
      serviceCode,
      serviceStage: stage,
      name: finalLabourName || existingItem?.name,
      labourId,
      requiredHours: finalLabourRequiredHours,
      ratePerHour: parseFloat(finalLabourRatePerHour),
    }; 
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateUpdateAmount(
        existingItem?.requiredHours,
        changeLabour.requiredHours,
        existingItem?.ratePerHour,
        changeLabour.ratePerHour,
        TireData?.labourTotalAmount,
        TireData?.totalAmount
      );

    const labourTotalHoursUpdated = calculateItemTotalHoursUpdated(
      TireData?.labourTotalHours,
      changeLabour.requiredHours,
      existingItem?.requiredHours
    );
    const totalHoursUpdated = calculateTotalHoursUpdated(
      TireData?.totalHours,
      changeLabour.requiredHours,
      existingItem?.requiredHours
    );


    const formattedData = {
      labour: {
        ...changeLabour,
        labourTotalAmount: itemTotalAmountUpdated,
        labourTotalHours: labourTotalHoursUpdated,
        totalAmount: totalAmountUpdated,
        totalHours: totalHoursUpdated,
      },
    };

    try {
      await updateLabourTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: changeLabour.serviceCode,
        labourId: changeLabour.labourId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          setLabourDataUpdate({
            name: "",
            ratePerHour: "",
            requiredHours: "",
          });
          message.success("Labour updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update labour: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleDeleteLabourTire = async (
    labourId: string | any,
    serviceCode: string | any
  ) => {
    // Add confirmation dialog
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this labour?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteLabourTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: serviceCode,
        labourId: labourId,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          message.success("Labour deleted successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to delete labour: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleNewInsertLabourTire = async (labour: any) => {
   
    const { itemTotalAmountUpdated, totalAmountUpdated } = calculateAddAmount(
      labour.requiredHours,
      labour.ratePerHour,
      TireData?.labourTotalAmount,
      TireData?.totalAmount
    );

    const labourTotalHoursUpdated = calculateItemTotalHoursWithoutState(
      TireData?.labourTotalHours,
      labour.requiredHours
    );
    const totalHoursUpdated = calculateTotalHoursWithoutState(
      TireData?.totalHours,
      labour.requiredHours
    );

    const finalPayload = {
      ...labour,
      serviceCode: selectedItem?.code,
      serviceStage: selectedItem?.stage,
      labourTotalAmount: itemTotalAmountUpdated,
      labourTotalHours: labourTotalHoursUpdated,
      totalAmount: totalAmountUpdated,
      totalHours: totalHoursUpdated,
    };

    const data = JSON.stringify(finalPayload);

    try {
      const response = await addLabourTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: finalPayload.serviceCode,
        data,
      }).unwrap();

      if (response) {
        TireItemFetch();
        message.success("Labour added successfully");
      }
    } catch (err: any) {
      message.error(
        `Failed to add labour: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleUpdateTechnicianPercentageTire = async (
    mechanicPercentageId: string | any,
    serviceCode: string | any,
    stage: string | any
  ) => {
    setUpdateField(null);
    const existingItem: any = mechanicPercentages.find(
      (entry: any) => entry.mechanicPercentageId === mechanicPercentageId
    );

    const finalMechanicPercentage =
      mechanicPercentageDataUpdate.percentage || existingItem?.percentage;

    const finalMechanicId = mechanicPercentageDataUpdate.id || existingItem?.id;

    const changeMechanicPercentage = {
      serviceCode: serviceCode,
      mechanicPercentageId: mechanicPercentageId,
      serviceStage: stage,
      percentage: finalMechanicPercentage?.endsWith("%")
          ? finalMechanicPercentage
          : `${finalMechanicPercentage}%`,
      id: finalMechanicId,
      name: mechanicPercentageData.name,
    };
    const formattedData = {
      technicianPercentage: {
        id: changeMechanicPercentage.id,
        percentage: changeMechanicPercentage.percentage,
      },
    };

    try {
      await updateTechnicianPercentageTireItem({
        technicianInspectionItemTireId: ItemTire?.id,
        serviceCode: changeMechanicPercentage.serviceCode,
        technicianPercentageId: changeMechanicPercentage.mechanicPercentageId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          setMechanicPercentageDataUpdate({
            name: "",
            id: "",
            percentage: "",
          });
          message.success("Technician percentage updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update technician percentage: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleNewInsertTechnicianPercentageTire = async (
    serviceCode: string | any,
    stage: string | any
  ) => {
    const { name } = mechanicPercentageData;

    if (!name) {
      message.error("All fields are required!");
      return;
    }

    const mechanicPercentage = {
      ...mechanicPercentageData,
      serviceCode,
      serviceStage: stage,
      id: mechanicPercentageData.id,
      name: mechanicPercentageData.name,
    };
    const data = JSON.stringify(mechanicPercentage);
    try {
      const response = await addTechnicianTireItem({
        technicianInspectionItemTireId: TireData?.id,
        serviceCode: serviceCode,
        data,
      }).unwrap();

      if (response) {

        TireItemFetch();
        setMechanicPercentageData({
          name: "",
          id: "",
        });
        message.success("Technician percentage added successfully");
      }
    } catch (err: any) {
      message.error(
        `Failed to add technician percentage: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleDeleteTechnicianPercentageTire = async (
    mechanicPercentageId: string | any
  ) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this technician percentage?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      return;
    }

    try {
      await deleteTechnicianPercentageTireItem({
        technicianPercentageItemTireId: mechanicPercentageId,
      })
        .unwrap()
        .then(() => {
          TireItemFetch();
          message.success("Technician percentage deleted successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to delete technician percentage: ${err?.data?.message}. Please try again.`
      );
    }
  };

  const handleUpdateTypeTire = async (
    itemCode: string,
    subType: string,
    stage: string
  ) => {
    try {
      if (subType === "Service") {
        await updateServiceTypeTireItem({
          technicianInspectionItemTireId: ItemTire?.id,
          serviceCode: itemCode,
          data: { stage },
        }).unwrap();
        TireItemFetch();
        message.success("Service type updated successfully!");
      }
    } catch (error) {
      message.error("Failed to change the service type. Please try again.");
    }
  };

  useEffect(() => {
    if (handleUpdateTypeDB.code) {
      handleUpdateTypeTire(
        handleUpdateTypeDB.code,
        handleUpdateTypeDB.subType,
        handleUpdateTypeDB.category
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateTypeDB]);

   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isLabourModalVisible, setLabourIsModalVisible] = useState(false);

const [selectedItem, setSelectedItem] = useState<IService | null>(null);
    const showPartModal = (item:IService) => {
      setIsModalVisible(true);
      setSelectedItem(item)
    };
  
    
  
    const handleModalCancel = () => {
      setIsModalVisible(false);
    };
  
    const showLabourModal = (item:IService) => {
      setLabourIsModalVisible(true);
       setSelectedItem(item)
    };
  
  
    const handleLabourModalCancel = () => {
      setLabourIsModalVisible(false);
    };

      const [isOpen, setIsOpen] = useState(false);
            
        const handleToggle = () => {
          setIsOpen((prev) => !prev);
          
        };
  return (
    <div
      className={`my-1 w-full ${
        option === "reprot"
          ? ""
          : "border border-gray-200 dark:border-gray-700 text-left p-2 rounded-xl shadow-md "
      }  transition-all duration-300 `}
    >
      <div>
        {option !== "reprot" && (
          <Link
            key={ItemTire.id}
            href={`/${role}/assignService/singleTireItemView/${ItemTire?.id}`}
          >
           <div className="flex items-start ">
             <div className="text-black  w-1/2">
              <p>
                <strong>Part Amount:</strong>{" "}
                {ItemTire?.partsTotalAmount?.toFixed(2)}
              </p>
              <p>
                <strong>Labour Amount:</strong>{" "}
                {ItemTire?.labourTotalAmount?.toFixed(2)}
              </p>
              <p>
                <strong>Total Amount:</strong> {ItemTire?.totalAmount?.toFixed(2)}
              </p>
              <p>
                <strong>Labour Total Hours</strong> {convertToDecimalHour(ItemTire?.labourTotalHours)}
              </p>
              <p>
                <strong>Total Hours</strong> {convertToDecimalHour(ItemTire?.totalHours)}
              </p>
            </div>
             <div className="text-black w-1/2">
              <p>
                <strong>Type:</strong> {ItemTire.type}
              </p>
              <p>
                <strong>Name:</strong> {ItemTire.name}
              </p>
            </div>
           
           </div>
          </Link>
        )}
        <div className="grid grid-cols-2 gap-2">
          {ItemTire?.Tire?.length > 0 &&
            ItemTire?.Tire?.map((tire: any, index: number) => {
              let bgColor = "bg-orange-500";
              let textColor = "text-black";

              if (tire?.color === "GREEN") {
                bgColor = "bg-green-500";
                textColor = "text-white";
              } else if (tire?.color === "RED") {
                bgColor = "bg-red-600";
                textColor = "text-white";
              }

              return (
                <div
                onClick={() => handleImageClick(tire)}
                key={index}
                className={`p-2 rounded  justify-center flex items-center ${bgColor} cursor-pointer text-black-700  space-y-2`}
              >
                <Image
                    src={tireImage}
                    alt={tire?.tirePosition}
                    width={30}   
                    height={30}
                    className=""
                  />
                <h4 className="font-bold text-md  gap-2">
                  {tire?.tireName}
                  {/* Tire Image as icon */}
                </h4>
              </div>
              
              );
            })}
        </div>
  {showModal && selectedTire && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-3">
    <div className="rounded-xl  w-full max-w-md max-h-[85vh] overflow-y-auto relative bg-white">
      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute bg-transparent border-none outline-none top-2 text-lg right-3 cursor-pointer text-black"
      >
        <CloseOutlined />
      </button>

      {/* Header */}
      <div
        className={`text-center text-lg font-semibold py-2 rounded-t-xl ${
          selectedTire.color === "GREEN"
            ? "bg-green-500 text-white"
            : selectedTire.color === "RED"
            ? "bg-red-600 text-white"
            : "bg-orange-500 text-black"
        }`}
      >
        {selectedTire?.tireName}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 text-sm text-gray-700">
        {/* Tire Info */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <p><span className="font-medium">Position:</span> {selectedTire?.tirePosition}</p>
          <p><span className="font-medium">Axle:</span> {selectedTire?.axleNumber}</p>
          <p><span className="font-medium">Number:</span> {selectedTire?.tireNumber}</p>
          <p><span className="font-medium">Inner:</span> {selectedTire?.isInner ? "Yes" : "No"}</p>
          <p><span className="font-medium">DOT:</span> {selectedTire?.dot}</p>
          <p><span className="font-medium">PSI Before:</span> {selectedTire?.psiBefore}</p>
        </div>

        {/* Custom Note */}
        {selectedTire?.customNote && (
          <div>
            <p className="font-medium">Note:</p>
            <div className="bg-gray-100 rounded p-2 text-gray-800 text-sm">
              {selectedTire.customNote}
            </div>
          </div>
        )}

        {/* Tread Depths */}
        {selectedTire?.treadDepths?.length > 0 && (
          <div>
            <p className="font-medium">Tread Depths:</p>
            <ul className="list-disc list-inside ml-2">
              {selectedTire.treadDepths.map((depth: any, i: number) => (
                <li key={i}>{depth.name} - {depth.color}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tire Status */}
        {selectedTire?.tireStatus?.length > 0 && (
          <div>
            <p className="font-medium">Status:</p>
            <ul className="list-disc list-inside ml-2">
              {selectedTire.tireStatus.map((status: any, i: number) => (
                <li key={i}>{status.name} - {status.color}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Solutions */}
        {selectedTire?.solution?.length > 0 && (
          <div>
            <p className="font-medium">Solutions:</p>
            <ul className="list-disc list-inside ml-2">
              {selectedTire.solution.map((s: any, i: number) => (
                <li key={i}>{s.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
)}

      </div>
      {option !== "reprot" && (
        <div className=" related-header-background ">
          <div className="related-header-top">
            <div className="flex items-center gap-2 ml-1 cursor-pointer ">
                <button
                  type="button"
                  className=" hover:text-black text-md border-none"
                  onClick={() => setCollapse(!collapse)}
                >
                  {collapse ? <MenuOutlined className="cursor-pointer" />
                 : 
                  <CloseOutlined className="cursor-pointer" />}
                </button>
              <h3 className="inspection-hour-title">
                Assigned Service
              </h3>
            </div>
          </div>

          {collapse === false && (
            <div className="py-1 px-2 h-80 overflow-y-auto ">
              {services?.map((item: any) => (
                <div
                  key={item?.code}
                  className="related-card-container"
                >
                  <div>
                    <div className="flex justify-center gap-5">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item?.stage === "Accept"}
                          onClick={() =>
                            handleUpdateTypeTire(
                              item?.code,
                              "Service",
                              "Accept"
                            )
                          }
                          className="cursor-pointer"
                        />
                        <label className="font-medium">Accept</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item?.stage === "Deferred"}
                          onClick={() =>
                            handleUpdateTypeTire(
                              item?.code,
                              "Service",
                              "Deferred"
                            )
                          }
                          className="cursor-pointer"
                        />
                        <label className="font-medium">Deferred</label>
                      </div>
                    </div>

                    <div className="estimate-service-title-des">
                      
                      <div className="w-full">
                        <div className={`${isActive.code !== item.code?'flex justify-start  gap-2 items-start':''}`}>
                        <p>Title:</p>
                        <input
                          type="text"
                          id="title"
                          value={
                            isActive.code === item.code
                              ? changeItem.title
                              : item?.title || ""
                          }
                          disabled={isActive.code !== item.code}
                          onChange={(e) =>
                            setChangeItem({
                              ...changeItem,
                              title: e.target.value,
                            })
                          }
                          placeholder="Enter your title"
                          className={`${isActive.code !== item.code?' border-none outline-none bg-transparent':'w-full px-3 py-2 border border-solid border-gray-200 rounded focus:outline-none  text-gray-700'}`}
                        />
                      </div>
                      
                      <div className={`${
                        isActive.code !== item.code
                          ? "flex justify-start gap-2 items-start w-full"
                          : ""
                      }`}
                      >
                        <p>Description: </p>
                        <textarea
                          rows={1}
                          id="description"
                          value={
                            isActive.code === item.code
                              ? changeItem.description
                              : item?.description || ""
                          }
                          disabled={isActive.code !== item.code}
                          onChange={(e) =>
                            setChangeItem({
                              ...changeItem,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter your description"
                          className={`${
                           isActive.code !== item.code
                             ? "border-none w-full outline-none bg-transparent resize-none overflow-y-scroll scrollbar-hide"
                             : "w-full px-3 py-2 border border-solid border-gray-200 rounded focus:outline-none text-gray-700 resize-none overflow-y-scroll scrollbar-hide"
                         }`}
                        />
                      </div>
                      </div>
                      <div className={`flex justify-between items-center ${isActive.code !== item.code ? '':'mt-3'} `}>
                        <div></div>
                        <div>
                          {isActive.active && isActive.code === item.code ? (
                            <Button onClick={handleSave}>Save</Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setIsActive({
                                  code: item.code,
                                  active: true,
                                });
                                setChangeItem({
                                  code: item.code,
                                  type: item.type,
                                  title: item.title,
                                  description: item.description,
                                });
                              }}
                            >
                              <EditFilled className="text-sm" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Part */}
                  <div className="border border-solid border-gray-200 p-2 mt-1">

                          <div className="flex justify-between items-center pb-1 border-b border-0 border-solid border-gray-200 pr-1 ">
                            <h3 className="text-sm text-black">
                              Parts
                            </h3>
                             <Button
                               size="small"
                               shape="circle"
                               onClick={()=>showPartModal(item)}
                               icon={<PlusOutlined />}
                               className="p-1"
                                />
                              <AddPart
                            isModalVisible={isModalVisible}
                            onSubmit={handleNewInsertPartTire}
                            handleModalCancel={handleModalCancel}
                          />
                          </div>
                      {partCollapse ? (
                        <div></div>
                      ) : (
                        <div>
                          <div>
                            {partUpdateData
                              ?.filter((part) => part.serviceCode === item.code)
                              .map((item, index) => (
                               <div
                                 key={item.partId}
                                 className="flex items-center justify-center gap-2 space-y-1"
                               >
                                 {/* 1. Part Name */}
                                 <div className="flex flex-col w-full">
                                   {updateField === item?.partId ? (
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
                                   {updateField === item?.partId ? (
                                     <input
                                       value={item.margin}
                                       onChange={(e) => onPartUpdateChange("margin", e.target.value)}
                                       className="p-1 border border-gray-400 rounded w-full outline-none"
                                     />
                                   ) : (
                                     <span className="w-full">{item.margin.toFixed(2) +'%'|| "0.00"}</span>
                                   )}
                                 </div>
                         
                                 {/* 3. Unit Price */}
                                 <div className="flex flex-col w-full">
                                   {updateField === item?.partId ? (
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
                                   {updateField === item?.partId ? (
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
                               {updateField === item?.partId ? (
                                 <input
                                   value={item.total}
                                   onChange={(e) => onPartUpdateChange("total", e.target.value)}
                                   className="p-1 border border-gray-400 rounded w-full outline-none"
                                 />
                               ) : (
                                 <span className="w-full flex items-center"> <PiCurrencyDollarThin />{Number(item?.total).toFixed(2) || "0.00"}</span>
                               )}
                             </div>
                                  {updateField === item?.partId ? (
                                    <Button
                                    size="small"
                                      onClick={() =>
                                        handleUpdatePartTire(
                                          item?.partId,
                                          item?.serviceCode,
                                          item?.serviceStage
                                        )
                                      }
                                     
                                    >
                                      <MdDownloadDone className="text-md " />
                                    </Button>
                                  ) : (
                                    <Button
                                      onClick={() => setUpdateField(item?.partId)}
                                      size="small"
                                     
                                    >
                                      <FiEdit className="text-md " />
                                    </Button>
                                  )}
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      handleDeletePartTire(
                                        item?.partId,
                                        item?.serviceCode
                                      )
                                    }
                                  >
                                    <AiOutlineDelete className="text-md " />
                                  </Button>
                                </div>
                              ))}
                          </div>
                          <div className=" text-end py-1 pr-1">
                              <p>
                                Total Parts:{" "}
                                <span className="font-bold">
                                  {TireData?.partsTotalAmount} 
                                </span>
                              </p>
                          </div>
                   
                        </div>
                      )}
                  
                  </div>

                  {/* Labour */}
                  <div
                    className="border border-solid border-gray-200 p-2 mt-1"
                  >
                    
                    <div className="flex justify-between items-center pb-1 border-b border-0 border-solid border-gray-200 pr-1 ">
          
                      <h3 className="text-sm font-bold text-black">
                        Labour Details
                      </h3>
                      <Button
                     size="small"
                     shape="circle"
                     onClick={()=>showLabourModal(item)}
                     icon={<PlusOutlined />}
                     className="p-1"
                      />
                    </div>
                              
                    {labourCollapse ? (
                      <div></div>
                    ) : (
                      <div>
                        <div>
                          {labours
                            ?.filter(
                              (labour) => labour.serviceCode === item.code
                            )
                            .map((item, index) => (
                              <div
                                          key={item.labourId}
                                          className="flex items-center gap-2 pt-1"
                                        >
                                          {/* Labour Name */}
                                          <div className="flex flex-col w-full">
                                            {updateField === item?.labourId ? (
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
                                            {updateField === item?.labourId ? (
                                              <input
                                                name={`ratePerHour${index}`}
                                                defaultValue={item?.ratePerHour || 0}
                                                onChange={(e) => onLabourUpdateChange("ratePerHour", e.target.value)}
                                                className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
                                              />
                                            ) : (
                                              <span className="w-full p-1">{item?.ratePerHour || 0}</span>
                                            )}
                                          </div>
                                    
                                          {/* Required Hours */}
                                          <div className="flex flex-col w-full">
                                            {updateField === item?.labourId ? (
                                              <input
                                                   name={`requiredHours${index}`}
                                                   type="text"
                                                   placeholder="Hours"
                                                   defaultValue={item.requiredHours/60 ||0}
                                                   onChange={(e) => onLabourUpdateChange("requiredHours", e.target.value)}
                                                     className="p-1 border border-gray-400 border-solid outline-none rounded w-full"
                                              />
                                            ) : (
                                              <span className="w-full p-1">
                                                {`${(item.requiredHours / 60).toFixed(2)} Hour`}
                                              </span>
                                            )}
                                          </div>
                                {updateField === item?.labourId ? (
                                  <Button
                                    onClick={() =>
                                      handleUpdateLabourTire(
                                        item?.labourId,
                                        item?.serviceCode,
                                        item?.serviceStage
                                      )
                                    }
                                   size="small"
                                  >
                                    <MdDownloadDone className="text-md " />
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={() => setUpdateField(item?.labourId)}
                                    size="small"
                                  >
                                    <FiEdit className="text-md " />
                                  </Button>
                                )}
                                <Button
                                 size="small"
                                  onClick={() =>
                                    handleDeleteLabourTire(
                                      item?.labourId,
                                      item?.serviceCode
                                    )
                                  }
                                >
                                  <AiOutlineDelete className="text-md " />
                                </Button>
                              </div>
                            ))}
                        </div>
                        <div className="py-1 justify-end pr-1 flex gap-4">
                             <p>
                               Total Labors:{" "}
                               <span className="font-bold">  {TireData?.labourTotalAmount}</span>
                             </p>
                             <p>
                               Total Hour:{" "}
                               <span className="font-bold">  {convertToDecimalHour(TireData?.labourTotalHours)}</span>
                             </p>
                        </div>
                        <AddLabor
                            isModalVisible={isLabourModalVisible}
                            onSubmit={handleNewInsertLabourTire}
                            handleModalCancel={handleLabourModalCancel}
                          />
                      </div>
                    )}
                  </div>

                  {/* Technician Percentage */}
                  <div className="border border-solid border-gray-200 p-2 mt-1">
                   <div className="flex justify-between items-center pr-1 ">
                      <h3 className="text-sm font-bold text-black ">
                        Assigned Technician(s)
                      </h3>
                        <Button
                     size="small"
                     shape="circle"
                     onClick={handleToggle}
                     icon={isOpen ? <MinusOutlined/> : <PlusOutlined />}
                     className="p-1"
                      />
                  </div>
                  
                    {isOpen&&(
                      <div>
                        <div>
                          {mechanicPercentages
                            ?.filter(
                              (mechanicPercentage) =>
                                mechanicPercentage.serviceCode === item.code
                            )
                            .map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4"
                              >
                          <div className="flex flex-col w-1/3">
                                             {updateField === item?.mechanicPercentageId ? (
                                               <Select
                                                 showSearch
                                                 placeholder="Select Technician"
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
                                           <div className="flex flex-col flex-1">
                                             {updateField === item?.mechanicPercentageId ? (
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
                                {updateField === item?.mechanicPercentageId ? (
                                  <Button
                                    onClick={() =>
                                      handleUpdateTechnicianPercentageTire(
                                        item?.mechanicPercentageId,
                                        item?.serviceCode,
                                        item?.serviceStage
                                      )
                                    }
                                    size="small"
                                  >
                                    <MdDownloadDone className="text-md " />
                                  </Button>
                                ) : (
                                  <Button
                                  
                                    onClick={() => {
                                      setUpdateField(item?.mechanicPercentageId)
                                      setMechanicPercentageDataUpdate({
                                         name: item.name,
                                         id: item.id,
                                         percentage: item.percentage,
                                       });
                                    }}
                                    size="small"
                                  >
                                    <FiEdit className="text-md " />
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  onClick={() =>
                                    handleDeleteTechnicianPercentageTire(
                                      item?.mechanicPercentageId
                                    )
                                  }
                                >
                                  <AiOutlineDelete className="text-md " />
                                </Button>
                              </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3 justify-center mt-1">
                          <div className="flex items-center gap-2 justify-between w-full">
                           
                            <Select
                              showSearch
                              placeholder="Select Technician"
                              value={mechanicPercentageData.id || undefined}
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
                              type="primary"
                              size="small"
                              className="bg-neutral-800 hover:bg-neutral-700 font-bold rounded"
                              onClick={() =>
                                handleNewInsertTechnicianPercentageTire(
                                  item?.code,
                                  item?.stage
                                )
                              }
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TireItem;
