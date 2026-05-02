"use client";
import Loading from "@/app/loading";
import RelatedItemShowService from "@/components/RelatedItemShow/RelatedItemShowService";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  useAddLabourTireItemMutation,
  useAddPartTireItemMutation,
  useAddTechnicianTireItemMutation,
  useAssignServiceToTireItemMutation,
  useDeleteLabourTireItemMutation,
  useDeletePartTireItemMutation,
  useDeleteTechnicianPercentageTireItemMutation,
  useGetSingleTireItemQuery,
  useGetUnassignedServiceTireItemQuery,
  useUpdateLabourTireItemMutation,
  useUpdatePartTireItemMutation,
  useUpdateServiceTypeTireItemMutation,
  useUpdateTechnicianPercentageTireItemMutation,
  useUpdateTireServiceMutation,
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
import { getUserInfo } from "@/services/auth.service";
import {
  calculateAddAmount,
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
import { Button, message, Modal } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IService {
  code: string;
  title: string;
  description: string;
  type: string;
  stage: string;
}

const SingleTireItemView = () => {
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

  const {
    data: tireItemData,
    refetch: tireItemFetch,
    isLoading
  } = useGetSingleTireItemQuery(
    { id },

    { refetchOnMountOrArgChange: true }
  );

  const { data: serviceData, refetch } = useGetUnassignedServiceTireItemQuery(
    {
      args: query,
      technicianInspectionItemTireId: id,
    },
    {
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

  const [assignServiceToTireItem] = useAssignServiceToTireItemMutation();

  useEffect(() => {
    if (tireItemData?.itemTireService?.length > 0) {
      const mappedServices = tireItemData.itemTireService.map((item: any) => ({
        code: item.service?.code || "",
        title: item.serviceTireTitle || "",
        description: item.serviceTireDescription || "",
        type: item.service?.type || "",
        stage: item.stage || "",
      }));

      setServices(mappedServices);
    } else {
      setServices([]);
    }
  }, [tireItemData]);

  useEffect(() => {
    if (tireItemData) {
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
          tireItemData?.ItemTireServiceLabour?.map((item: any) => ({
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
          tireItemData?.ItemTireServiceParts?.map((item: any) => ({
            serviceCode: item?.serviceCode,
            partId: item?.partId,
            name: item?.part?.name,
            unitPrice: item?.part?.unitPrice,
            provider: item?.part?.provider,
            installationHours: item?.part?.installationHours,
            quantity: item?.totalUnit,
            serviceStage: item.stage,
            total:item.part.total,
            margin:item.part.margin,
          })),
          "serviceStage"
        );

      const {
        acceptItems: acceptMechanicPercentages,
        deferredItems: deferredMechanicPercentages,
      } = categorizeItems(
        tireItemData?.ItemTireTechnician?.map((item: any) => ({
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
  }, [dispatch, tireItemData]);

  const handleUpdateService = async (formattedData: any) => {
    const { serviceCode, ...payload } = formattedData;

    try {
      await updateTireService({
        tireId: id,
        serviceCode: formattedData.serviceCode,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Service updated successfully");
          tireItemFetch();
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
        await updateServiceTypeTireItem({
          technicianInspectionItemTireId: id,
          serviceCode: itemCode,
          data: { stage },
        }).unwrap();
        message.success("Service type updated successfully!");
        dispatch(clearAllRelatedItemDB());
        tireItemFetch();
      }
    } catch (error) {
      message.error("Failed to change the service type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };

  const assignServiceHandle = async () => {
    dispatch(assignServiceHandleControllerForMultiple(false));

    try {
      await assignServiceToTireItem({
        technicianInspectionItemTireId: id,
        data: estimateServiceState,
      })
        .unwrap()
        .then(() => {
          message.success("Service added successfully");
          tireItemFetch();
          refetch();
          dispatch(removeAllEstimateServiceItems());
        });
    } catch (err) {
      message.error("Failed to assign services. Please try again.");
    }
  };

  const handleUpdatePart = async (changePart: any) => {
    const existingItem: any = part?.find(
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
    await updatePartTireItem({
        technicianInspectionItemTireId: id,
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
              installationHours: changePart.installationHours,
              quantity: changePart.quantity,
              total: changePart.total,
              margin: changePart.margin
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
      await deletePartTireItem({
        technicianInspectionItemTireId: id,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
      })
        .unwrap()
        .then(() => {
          message.success("Part deleted successfully");
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
      const response = await addPartTireItem({
        technicianInspectionItemTireId: id,
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
      await updateLabourTireItem({
        technicianInspectionItemTireId: id,
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
      await deleteLabourTireItem({
        technicianInspectionItemTireId: id,
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
      const response = await addLabourTireItem({
        technicianInspectionItemTireId: id,
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
      await updateTechnicianPercentageTireItem({
        technicianInspectionItemTireId: id,
        serviceCode: changeMechanicPercentage.serviceCode,
        technicianPercentageId: changeMechanicPercentage.mechanicPercentageId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          tireItemFetch();
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
      const response = await addTechnicianTireItem({
        technicianInspectionItemTireId: id,
        serviceCode: changeMechanicPercentage.serviceCode,
        data,
      }).unwrap();

      if (response) {
        tireItemFetch();
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
      await deleteTechnicianPercentageTireItem({
        technicianPercentageItemTireId:
          changeMechanicPercentage.mechanicPercentageId,
      })
        .unwrap()
        .then(() => {
          message.success("Technician percentage deleted successfully");
          tireItemFetch();
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
  }, [handleUpdateTypeDB,handleUpdateType]);

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div className="px-5 mx-auto ">
     <div className="flex justify-between items-center py-2">
  <h1 className="text-start text-xl text-black font-semibold mb-1">
   {tireItemData && tireItemData?.name}
  </h1>

  <Button
    type="default"
    size="small"
    onClick={() => router.push(`/${role}/assignService`)}
  >
    Reports
  </Button>
</div>
      <div className="p-2 border border-solid border-gray-200 rounded-md">
        <div >
          <p>
            <strong>Type:</strong> {tireItemData?.type}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {tireItemData?.Tire?.length > 0 &&
            tireItemData?.Tire?.map((tire: any, index: number) => {
              let bgColor = "bg-orange-500";
              let textColor = "text-black";

              if (tire?.color === "GREEN") {
                bgColor = "bg-green-500";
                textColor = "text-white";
              } else if (tire?.color === "RED") {
                bgColor = "bg-red-500";
                textColor = "text-white";
              }

              return (
                <div
                  key={index}
                  className={`p-2 rounded  ${bgColor} ${textColor} my-2 `}
                >
                  <h4 className="font-bold text-lg">{tire?.tireName}</h4>

                  {/* Tire Position, Axle Number, Tire Number in one row */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <p>
                      <strong>Tire Position:</strong> {tire?.tirePosition}
                    </p>
                    <p>
                      <strong>Axle Number:</strong> {tire?.axleNumber}
                    </p>
                    <p>
                      <strong>Tire Number:</strong> {tire?.tireNumber}
                    </p>
                    <p>
                      <strong>Is Inner:</strong> {tire?.isInner ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 text-sm">
                    <p>
                      <strong>DOT:</strong> {tire?.dot}
                    </p>
                    <p>
                      <strong>PSI Before:</strong> {tire?.psiBefore}
                    </p>
                    <p className="col-span-2">
                      <strong>Custom Note: </strong>
                      <div className="bg-white text-black rounded px-3 mt-1 inline-block">
                        {tire?.customNote}
                      </div>
                    </p>
                  </div>

                  {/* Tread Depths */}
                  {tire?.treadDepths?.length > 0 && (
                    <div>
                      <p className="font-semibold ">Tread Depths:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.treadDepths.map((depth: any, i: number) => (
                          <li key={i}>
                            {depth.name} - {depth.color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tire Status */}
                  {tire?.tireStatus?.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Tire Status:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.tireStatus.map((status: any, i: number) => (
                          <li key={i}>
                            {status.name} - {status.color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Solutions */}
                  {tire?.solution?.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Solutions:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.solution.map((s: any, i: number) => (
                          <li key={i}>{s.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-5">
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
      <SearchItemShow data={allServices} type={false} page="service-advisor" />
  
      
      <RelatedItemShowService
        data={services}
        type={"service-advisor"}
        subType="Service"
      />

      <div className="flex items-center gap-4 my-2">
        <div
          className="p-3 border border-solid space-y-1 border-gray-200 rounded-md w-full"
        >
          <div className="flex items-center justify-between gap-3 ">
            <p className="">Total Labour Hours:</p>
            <p className="font-semibold ">
              {labourTotalHours}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="">Total Labour Amount:</p>
            <p className=" font-semibold ">
              ${labourTotalAmount}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3 ">
            <p className="">Total Parts Amount:</p>
            <p className=" font-semibold ">
              ${partsTotalAmount}
            </p>
          </div>
          <hr />
          <div className="flex items-center justify-between gap-3">
            <p className="">Total Amount:</p>
            <p className=" font-semibold ">
              ${totalAmount}
            </p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="">Total Hours:</p>
            <p className=" font-semibold ">
              {totalHours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleTireItemView;
