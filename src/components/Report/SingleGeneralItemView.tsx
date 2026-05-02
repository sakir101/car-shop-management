"use client";

import Loading from "@/app/loading";
import RelatedItemShowService from "@/components/RelatedItemShow/RelatedItemShowService";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import { Button } from "antd";
import {
  useAddLabourGeneralItemMutation,
  useAddPartGeneralItemMutation,
  useAddTechnicianGeneralItemMutation,
  useAssignServiceToGeneralItemMutation,
  useDeleteLabourGeneralItemMutation,
  useDeletePartGeneralItemMutation,
  useDeleteTechnicianPercentageGeneralItemMutation,
  useGetSingleGeneralItemQuery,
  useGetUnassignedServiceGeneralItemQuery,
  useUpdateGeneralServiceMutation,
  useUpdateLabourGeneralItemMutation,
  useUpdatePartGeneralItemMutation,
  useUpdateServiceTypeGeneralItemMutation,
  useUpdateTechnicianPercentageGeneralItemMutation,
} from "@/redux/api/serviceAdvisorApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import {
  addSearchRelatedService,
  assignServiceHandleControllerForMultiple,
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  setEstimateServiceUpdateStatus,
  updateEstimateServiceSingleItem,
} from "@/redux/slice/estimateItemShowSlice";
import { clearAllRelatedItemDB } from "@/redux/slice/relatedItemHandleSlice";
import {
  assignServiceHandleController,
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  addDeferredLabours,
  addDeferredMechanicPercentages,
  addDeferredParts,
  addLabour,
  addLabours,
  addMechanicPercentage,
  addMechanicPercentages,
  addParts,
  Labour,
  MechanicPercentage,
  Part,
  removeAllLabours,
  removeAllMechanicPercentages,
  removeAllParts,
  removeAllState,
  removeAllTempServiceItems,
  removeAllTotal,
  removeLabourById,
  removeLabourSingleData,
  removeMechanicPercentageById,
  removeMechanicPercentageSingleData,
  removePartById,
  removePartSingleData,
  setDeleteStatusLabour,
  setDeleteStatusMechanicPercentage,
  setDeleteStatusPart,
  setNewInsertLabour,
  setNewInsertMechanicPercentage,
  setNewInsertPart,
  setUpdateStatusLabour,
  setUpdateStatusMechanicPercentage,
  setUpdateStatusPart,
  updateLabour,
  updateMechanicPercentage,
  updatePart,
} from "@/redux/slice/serviceInspectionItemSlice";
import {
  calculateAddAmount,
  calculateEstimateUpdateAmountForPart,
  calculateGeneralItemAddAmountForPart,
  calculateItemUpdateAmountForPart,
  calculateUpdateAmount,
} from "@/utils/amount";
import {
  calculateItemTotalHoursUpdated,
  calculateItemTotalHoursWithoutState,
  calculateTotalHoursUpdated,
  calculateTotalHoursWithoutState,
} from "@/utils/total-hour-calculate";
import { message, Modal } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "@/services/auth.service";

interface IService {
  code: string;
  title: string;
  description: string;
  type: string;
  stage: string;
}

const SingleGeneralItemView = () => {
  const query: Record<string, any> = {};
  const [id, setId] = useState<string>("");
  const [page, setPage] = useState<number>();
  const [services, setServices] = useState<IService[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const dispatch = useAppDispatch();
  const router =useRouter()
  const {role} =getUserInfo() as any;

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

  const {
    estimateServiceState,
    estimateServiceAdd,
    serviceUpdate,
    updateEstimateServiceState,
  } = useAppSelector((state) => state.estimateItemShow);


  const { handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );

  const {
    part,
    labour,
    partsTotalAmount,
    labourTotalAmount,
    labourTotalHours,
    totalAmount,
    totalHours,
    updateStatusLabour,
    deleteStatusLabour,
    newInsertLabour,
    updateStatusPart,
    deleteStatusPart,
    newInsertPart,
    updateStatusMechanicPercentage,
    deleteStatusMechanicPercentage,
    newInsertMechanicPercentage,
    changeLabour,
    changeMechanicPercentage,
    changePart,
  } = useAppSelector((state) => state.serviceInspectionItem);
  useEffect(() => {
    dispatch(removeAllEstimateConcernItems());
    dispatch(removeAllEstimateInspectionItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(setUserId(""));
    dispatch(setVehicleId(""));

    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
  }, [dispatch]);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractId = match ? match[1] : null;
    if (extractId !== null) {
      setId(extractId);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (updateStatusLabour) {
      handleUpdateLabour(changeLabour);
    }
    if (newInsertLabour) {
      handleNewInsertLabour(changeLabour);
    }
    if (deleteStatusLabour) {
      handleDeleteLabour(changeLabour);
    }
    if (updateStatusPart) {
      handleUpdatePart(changePart);
    }
    if (newInsertPart) {
      handleNewInsertPart(changePart);
    }
    if (deleteStatusPart) {
      handleDeletePart(changePart);
    }
    if (updateStatusMechanicPercentage) {
      handleUpdateTechnicianPercentage(changeMechanicPercentage);
    }
    if (newInsertMechanicPercentage) {
      handleNewInsertTechnicianPercentage(changeMechanicPercentage);
    }
    if (deleteStatusMechanicPercentage) {
      handleDeleteTechnicianPercentage(changeMechanicPercentage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateStatusLabour,
    newInsertLabour,
    deleteStatusLabour,
    updateStatusPart,
    newInsertPart,
    deleteStatusPart,
    updateStatusMechanicPercentage,
    newInsertMechanicPercentage,
    deleteStatusMechanicPercentage,
  ]);

  useEffect(() => {
    if (estimateServiceAdd) {
      assignServiceHandle();
    }
    if (serviceUpdate) {
      handleUpdateService(updateEstimateServiceState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateServiceAdd, serviceUpdate]);

  const [updatePartGeneralItem] = useUpdatePartGeneralItemMutation();
  const [deletePartGeneralItem] = useDeletePartGeneralItemMutation();
  const [addPartGeneralItem] = useAddPartGeneralItemMutation();
  const [updateLabourGeneralItem] = useUpdateLabourGeneralItemMutation();
  const [deleteLabourGeneralItem] = useDeleteLabourGeneralItemMutation();
  const [addLabourGeneralItem] = useAddLabourGeneralItemMutation();
  const [updateTechnicianPercentageGeneralItem] =
    useUpdateTechnicianPercentageGeneralItemMutation();
  const [deleteTechnicianPercentageGeneralItem] =
    useDeleteTechnicianPercentageGeneralItemMutation();
  const [addTechnicianGeneralItem] = useAddTechnicianGeneralItemMutation();
  const [updateServiceTypeGeneralItem] =
    useUpdateServiceTypeGeneralItemMutation();
  const [updateGeneralService] = useUpdateGeneralServiceMutation();

  const {
    data: generalItemData,
    isLoading: generalItemLoading,
    refetch: generalItemFetch,
  } = useGetSingleGeneralItemQuery(
    { id },
    {
      skip: !id,
      refetchOnMountOrArgChange: true
     }
  );

  const { data: serviceData,isLoading, refetch } =
    useGetUnassignedServiceGeneralItemQuery(
      {
        args: query,
        technicianInspectionItemGeneralId: id,
      },
      {
        skip: !id,
        refetchOnMountOrArgChange: true,
      }
    );

  const allServices = serviceData?.data;

  useEffect(() => {
    if (!allServices) return;

    // Handle services
    allServices.forEach((service: any) => {
      if (service.type === "Service") {
        const parentCode = service.code;
        const stage = "Accept";

        service.relatedServices?.forEach((related: any) => {
          dispatch(
            addSearchRelatedService({
              parentCode,
              childCode: related.relatedServiceId,
              parentType: "Service",
              childType: related.recommended ? "Recommended" : "Required",
              childTitle: related.relatedService.title,
              childDescription: related.relatedService.description,
              stage,
            })
          );
        });
      }
    });
  }, [allServices, dispatch]);

  const [assignServiceToGeneralItem] = useAssignServiceToGeneralItemMutation();

  useEffect(() => {
    if (generalItemData?.itemGeneralServices?.length > 0) {
      const mappedServices = generalItemData.itemGeneralServices.map(
        (item: any) => ({
          code: item.service?.code || "",
          title: item.serviceGeneralTitle || "",
          description: item.serviceGeneralDescription || "",
          type: item.service?.type || "",
          stage: item.stage || "",
        })
      );

      setServices(mappedServices);
    } else {
      setServices([]);
    }
  }, [generalItemData]);

  useEffect(() => {
    if (generalItemData) {
      dispatch(removeAllTotal());
      dispatch(removeAllMechanicPercentages());
      dispatch(removeAllLabours());
      dispatch(removeAllParts());

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
          generalItemData?.itemGeneralServiceLabour?.map((item: any) => ({
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
          generalItemData?.itemGeneralServiceParts?.map((item: any) => ({
            serviceCode: item?.serviceCode,
            partId: item?.partId,
            name: item?.part?.name,
            unitPrice: item?.part?.unitPrice,
            provider: item?.part?.provider,
            installationHours: item?.part?.installationHours,
            quantity: item?.totalUnit,
            serviceStage: item.stage,
            total:item.part.total,
            margin:item.part.margin
          })),
          "serviceStage"
        );

      const {
        acceptItems: acceptMechanicPercentages,
        deferredItems: deferredMechanicPercentages,
      } = categorizeItems(
        generalItemData?.itemGeneralTechnician?.map((item: any) => ({
          serviceCode: item.serviceCode,
          mechanicPercentageId: item.id,
          id: item.technicianId,
          name: item.technician.name,
          percentage: item.percentage,
          serviceStage: item.stage,
        })),
        "serviceStage"
      );

      dispatch(addLabours(acceptLabours));
      dispatch(addDeferredLabours(deferredLabours));
      dispatch(addParts(acceptParts));
      dispatch(addDeferredParts(deferredParts));
      dispatch(addMechanicPercentages(acceptMechanicPercentages));
      dispatch(addDeferredMechanicPercentages(deferredMechanicPercentages));
    }
  }, [dispatch, generalItemData]);

  const handleUpdateService = async (formattedData: any) => {
    const { serviceCode, ...payload } = formattedData;
    try {
      await updateGeneralService({
        generalId: id,
        serviceCode: formattedData?.serviceCode,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Service updated successfully");
          generalItemFetch();
          dispatch(updateEstimateServiceSingleItem(""));
          dispatch(setEstimateServiceUpdateStatus(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update service: ${err.data.message}. Please try again.`
      );
      dispatch(updateEstimateServiceSingleItem(""));
      dispatch(setEstimateServiceUpdateStatus(false));
    }
  };

  const handleUpdateType = async (
    itemCode: string,
    subType: string,
    stage: string
  ) => {
    try {
      if (subType === "Service") {
        await updateServiceTypeGeneralItem({
          technicianInspectionItemGeneralId: id,
          serviceCode: itemCode,
          data: { stage },
        }).unwrap();
        message.success("Service type updated successfully!");
        dispatch(clearAllRelatedItemDB());
        generalItemFetch();
      }
    } catch (error) {
      message.error("Failed to change the service type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };
  const assignServiceHandle = async () => {
      dispatch(assignServiceHandleControllerForMultiple(false));
    try {
      await assignServiceToGeneralItem({
        technicianInspectionItemGeneralId: id,
        data: estimateServiceState,
      })
        .unwrap()
        .then(() => {
          message.success("Service added successfully");
          generalItemFetch();
          refetch();
          dispatch(removeAllTempServiceItems());
        });
    } catch (err) {
      message.error("Failed to assign services. Please try again.");
    }
  };

  const handleUpdatePart = async (changePart: any) => {
    const existingItem: any = part.find(
      (entry: any) => entry.partId === changePart.partId
    );
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateItemUpdateAmountForPart(
        existingItem?.total,
        changePart.total,
        partsTotalAmount,
        totalAmount
      );

    const totalHoursUpdated = calculateTotalHoursUpdated(
      totalHours,
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
      await updatePartGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          message.success("Part updated successfully");
          dispatch(
            updatePart({
              serviceCode: changePart.serviceCode,
              serviceStage: changePart.serviceStage,
              partId: changePart.partId,
              name: changePart.name,
              unitPrice: changePart.unitPrice,
              provider: changePart.provider,
              installationHours: 0,
              quantity: changePart.quantity,
              margin:changePart.margin,
              total:changePart.total,
            })
          );

          dispatch(removePartSingleData());
          dispatch(setUpdateStatusPart(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update part: ${err.data.message}. Please try again.`
      );
      dispatch(removePartSingleData());
      dispatch(setUpdateStatusPart(false));
    }
  };

  const handleDeletePart = async (changePart: any) => {
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
      dispatch(removePartSingleData());
      dispatch(setDeleteStatusPart(false));
      return;
    }

    try {
      await deletePartGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
      })
        .unwrap()
        .then(() => {
          message.success("Part deleted successfully");
          generalItemFetch()
          dispatch(removePartSingleData());
          dispatch(removePartById(changePart.partId));
          dispatch(setDeleteStatusPart(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete part: ${err.data.message}. Please try again.`
      );
      dispatch(removePartSingleData());
      dispatch(setDeleteStatusPart(false));
    }
  };

  const handleNewInsertPart = async (part: Part) => {
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateGeneralItemAddAmountForPart(
        part.total,
        partsTotalAmount,
        totalAmount
      );
    const totalHoursUpdated = calculateTotalHoursWithoutState(
      totalHours,
      part.installationHours
    );
    const partTotal = {
      ...part,
      partsTotalAmount: itemTotalAmountUpdated,
      totalAmount: totalAmountUpdated,
      totalHours: totalHoursUpdated,
    };

    const data = JSON.stringify(partTotal);

    try {
      const response = await addPartGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: part.serviceCode,
        data,
      }).unwrap();

      if (response) {
        const partData: Part = {
          serviceCode: response.serviceCode,
          serviceStage: response.stage,
          partId: response.partId,
          name: response.part.name,
          unitPrice: parseFloat(response.part.unitPrice),
          provider: response.part.provider,
          installationHours: parseInt(response.part.installationHours),
          quantity: parseInt(response.totalUnit, 10),
          total: parseFloat(response.part.total),
          margin: parseFloat(response.part.margin)
        };
        dispatch(addParts([partData]));

        message.success("Part added successfully");
      }

      dispatch(removePartSingleData());
      dispatch(setNewInsertPart(false));
    } catch (err: any) {
      message.error(
        `Failed to add part: ${err.data.message}. Please try again.`
      );
      dispatch(removePartSingleData());
      dispatch(setNewInsertPart(false));
    }
  };

  const handleUpdateLabour = async (changeLabour: any) => {
    const existingItem: any = labour.find(
      (entry: any) => entry.labourId === changeLabour.labourId
    );
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateUpdateAmount(
        existingItem?.requiredHours,
        changeLabour.requiredHours,
        existingItem?.ratePerHour,
        changeLabour.ratePerHour,
        labourTotalAmount,
        totalAmount
      );

    const labourTotalHoursUpdated = calculateItemTotalHoursUpdated(
      labourTotalHours,
      changeLabour.requiredHours,
      existingItem?.requiredHours
    );
    const totalHoursUpdated = calculateTotalHoursUpdated(
      totalHours,
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
      await updateLabourGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changeLabour.serviceCode,
        labourId: changeLabour.labourId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          message.success("Labour updated successfully");
          dispatch(
            updateLabour({
              serviceCode: changeLabour.serviceCode,
              serviceStage: changeLabour.serviceStage,
              labourId: changeLabour.labourId,
              name: changeLabour.name,
              ratePerHour: changeLabour.ratePerHour,
              requiredHours: changeLabour.requiredHours,
            })
          );

          dispatch(removeLabourSingleData());
          dispatch(setUpdateStatusLabour(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update labour: ${err.data.message}. Please try again.`
      );
      dispatch(removeLabourSingleData());
      dispatch(setUpdateStatusLabour(false));
    }
  };

  const handleDeleteLabour = async (changeLabour: any) => {
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
      dispatch(removeLabourSingleData());
      dispatch(setDeleteStatusLabour(false));
      return;
    }

    try {
      await deleteLabourGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changeLabour.serviceCode,
        labourId: changeLabour.labourId,
      })
        .unwrap()
        .then(() => {
          message.success("Labour deleted successfully");
          dispatch(removeLabourSingleData());
          dispatch(removeLabourById(changeLabour.labourId));
          dispatch(setDeleteStatusLabour(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete labour: ${err.data.message}. Please try again.`
      );
      dispatch(removeLabourSingleData());
      dispatch(setDeleteStatusLabour(false));
    }
  };

  const handleNewInsertLabour = async (labour: Labour) => {
    const { itemTotalAmountUpdated, totalAmountUpdated } = calculateAddAmount(
      labour.requiredHours,
      labour.ratePerHour,
      labourTotalAmount,
      totalAmount
    );

    const labourTotalHoursUpdated = calculateItemTotalHoursWithoutState(
      labourTotalHours,
      labour.requiredHours
    );
    const totalHoursUpdated = calculateTotalHoursWithoutState(
      totalHours,
      labour.requiredHours
    );

    const labourTotal = {
      ...labour,
      labourTotalAmount: itemTotalAmountUpdated,
      labourTotalHours: labourTotalHoursUpdated,
      totalAmount: totalAmountUpdated,
      totalHours: totalHoursUpdated,
    };

    const data = JSON.stringify(labourTotal);

    try {
      const response = await addLabourGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: labour.serviceCode,
        data,
      }).unwrap();

      if (response) {
        const labourData: Labour = {
          serviceCode: response.serviceCode,
          serviceStage: response.stage,
          labourId: response.labourId,
          name: response.labour.name,
          ratePerHour: parseFloat(response.labour.ratePerHour),
          requiredHours: parseInt(response.requiredHours),
        };
        dispatch(addLabour(labourData));

        message.success("Labour added successfully");
      }

      dispatch(removeLabourSingleData());
      dispatch(setNewInsertLabour(false));
    } catch (err: any) {
      message.error(
        `Failed to add labour: ${err.data.message}. Please try again.`
      );
      dispatch(removeLabourSingleData());
      dispatch(setNewInsertLabour(false));
    }
  };

  const handleUpdateTechnicianPercentage = async (
    changeMechanicPercentage: any
  ) => {
    const formattedData = {
      technicianPercentage: {
        id: changeMechanicPercentage.id,
        percentage: changeMechanicPercentage.percentage,
      },
    };

    try {
      await updateTechnicianPercentageGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changeMechanicPercentage.serviceCode,
        technicianPercentageId: changeMechanicPercentage.mechanicPercentageId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          generalItemFetch();
          dispatch(
            updateMechanicPercentage({
              serviceCode: changeMechanicPercentage.serviceCode,
              serviceStage: changeMechanicPercentage.serviceStage,
              mechanicPercentageId:
                changeMechanicPercentage.mechanicPercentageId,
              percentage: changeMechanicPercentage.percentage,
              id: changeMechanicPercentage.id,
              name: changeMechanicPercentage.name,
            })
          );
          dispatch(removeMechanicPercentageSingleData());
          dispatch(setUpdateStatusMechanicPercentage(false));
          message.success("Technician percentage updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update technician percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setUpdateStatusMechanicPercentage(false));
    }
  };

  const handleNewInsertTechnicianPercentage = async (
    changeMechanicPercentage: any
  ) => {
    const data = JSON.stringify(changeMechanicPercentage);

    try {
      const response = await addTechnicianGeneralItem({
        technicianInspectionItemGeneralId: id,
        serviceCode: changeMechanicPercentage.serviceCode,
        data,
      }).unwrap();

      if (response) {
        generalItemFetch();
        const mechanicPercentageData: MechanicPercentage = {
          serviceCode: response.serviceCode,
          serviceStage: response.stage,
          mechanicPercentageId: response.id,
          id: response.technicianId,
          percentage: response.percentage,
          name: response.technician.name,
        };
        dispatch(addMechanicPercentage(mechanicPercentageData));

        message.success("Technician percentage added successfully");
      }

      dispatch(removeMechanicPercentageSingleData());
      dispatch(setNewInsertMechanicPercentage(false));
    } catch (err: any) {
      message.error(
        `Failed to add technician percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setNewInsertMechanicPercentage(false));
    }
  };

  const handleDeleteTechnicianPercentage = async (
    changeMechanicPercentage: any
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
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setDeleteStatusMechanicPercentage(false));
      return;
    }

    try {
      await deleteTechnicianPercentageGeneralItem({
        technicianPercentageItemGeneralId:
          changeMechanicPercentage.mechanicPercentageId,
      })
        .unwrap()
        .then(() => {
          message.success("Technician percentage deleted successfully");
          generalItemFetch();
          dispatch(
            removeMechanicPercentageById(
              changeMechanicPercentage.mechanicPercentageId
            )
          );
          dispatch(removeMechanicPercentageSingleData());
          dispatch(setDeleteStatusMechanicPercentage(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete technician percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setDeleteStatusMechanicPercentage(false));
    }
  };

  useEffect(() => {
    if (handleUpdateTypeDB.code) {
      handleUpdateType(
        handleUpdateTypeDB.code,
        handleUpdateTypeDB.subType,
        handleUpdateTypeDB.category
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateTypeDB]);

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  if(generalItemLoading||isLoading){
    return <Loading></Loading>
  }

  return (
    <div className="px-5 mx-auto ">


<div className="flex justify-between items-center py-2">
  <h1 className="text-start text-xl text-black font-semibold mb-1">
    {generalItemData && generalItemData?.name}
  </h1>

  <Button
    type="default"
    size="small"
    onClick={() => router.push(`/${role}/assignService`)}
  >
    Reports
  </Button>
</div>

      
      <div >
        <div>
          <label htmlFor="">Search for Service</label>
        </div>
        <div className="flex items-center">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>
      </div>
      <SearchItemShow 
         data={allServices} 
         type={false} 
         page="service-advisor" 
         />
      <div className="flex items-center gap-4 ">
        
      </div>
      <RelatedItemShowService
        data={services}
        type={"service-advisor"}
        subType="Service"
        
      />

      <div  className="p-2 mb-2 flex items-start gap-4 border border-solid border-gray-200 rounded">
        <div className="w-1/2">
          <div className=" border border-gray-300 ">
          <p>
            <strong>Type  :</strong> {generalItemData?.type}
          </p>
        </div>
        <div className=" border border-gray-300 ">
          <p>
            <strong>Note   :</strong> {generalItemData?.customNote}
          </p>
        </div>
        <div className="border border-gray-300 ">
          <p>
            <strong>Map    :</strong>{" "}
            {generalItemData?.map?.length
              ? generalItemData?.map?.map((m: any) => m.name).join(", ")
              : "None"}
          </p>
        </div>
        <div className="border border-gray-300">
          <p>
            <strong>Problem      :</strong>{" "}
            {generalItemData?.problem?.length
              ? generalItemData?.problem
                  ?.map((p: any) => `${p.name} (${p.color})`)
                  .join(", ")
              : "None"}
          </p>
        </div>
        <div className="border border-gray-300">
          <p>
            <strong>Solution     :</strong>{" "}
            {generalItemData?.solution?.length
              ? generalItemData?.solution?.map((s: any) => s.name).join(", ")
              : "None"}
          </p>
        </div>
        </div>
        <div className="w-1/2">
          <div
         
          className="  rounded w-full"
        >
          <div className="flex items-center gap-3 justify-between">
            <p className="text-sm">Total Labour Hours:</p>
            <p className=" font-semibold text-sm">
              {labourTotalHours}
            </p>
          </div>
          <div className="flex items-center gap-3 justify-between ">
            <p className="text-sm">Total Labour Amount:</p>
            <p className=" font-semibold text-sm">
              ${labourTotalAmount}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">Total Parts Amount:</p>
            <p className=" font-semibold text-sm">
              ${partsTotalAmount}
            </p>
          </div>
          <hr />
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">Total Amount:</p>
            <p className=" font-semibold text-sm">
              ${totalAmount}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm">Total Hours:</p>
            <p className=" font-semibold text-sm">
              {totalHours}
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SingleGeneralItemView;
