"use client";

import Loading from "@/app/loading";
import EstimateSidebar from "@/components/EstimateSidebar/EstimateSidebar";
import RelatedItemShowConcern from "@/components/RelatedItemShow/RelatedItemShowConcern";
import RelatedItemShowInspection from "@/components/RelatedItemShow/RelatedItemShowInspection";
import RelatedItemShowService from "@/components/RelatedItemShow/RelatedItemShowService";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  useAddInspectionHoursEstimateMutation,
  useAddInspectionPercentageDataMutation,
  useAddLaboursDataMutation,
  useAddMechanicPercentageDataMutation,
  useAddPartsDataMutation,
  useAssignConcernToEstimateMutation,
  useAssignInspectionToEstimateMutation,
  useAssignServiceToEstimateMutation,
  useCreateAuthorizationMutation,
  useDeleteAuthorizationMutation,
  useDeleteCustomerFromEstimateMutation,
  useDeleteInspectionHoursMutation,
  useDeleteInspectionPercentageMutation,
  useDeleteLabourDataMutation,
  useDeleteMechanicPercentageDataMutation,
  useDeletePartDataMutation,
  useGetAllAuthorizationQuery,
  useGetEstimateConcernsQuery,
  useGetEstimateInspectionsQuery,
  useGetEstimateServicesQuery,
  useGetOwnerVehicleQuery,
  useGetSingleEstimateQuery,
  useGetUnassignServiceInspectionConcernAllDataQuery,
  useUpdateAllAuthorizationMutation,
  useUpdateAuthorizationMutation,
  useUpdateEstimateConcernMutation,
  useUpdateEstimateInspectionMutation,
  useUpdateEstimateInspectionTypeMutation,
  useUpdateEstimateMutation,
  useUpdateEstimateServiceMutation,
  useUpdateEstimateServiceTypeMutation,
  useUpdateInspectionHoursDataMutation,
  useUpdateInspectionPercentageDataMutation,
  useUpdateLabourDataMutation,
  useUpdateMechanicPercentageDataMutation,
  useUpdatePartDataMutation,
} from "@/redux/api/estimateApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import {
  removeSelectedCar,
  setSelectedCar,
  setUserId,
  setVehicleId,
} from "@/redux/slice/CarSlice";
import {
  addSearchRelatedInspection,
  addSearchRelatedService,
  assignInspectionHandleControllerForMultiple,
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  assignServiceHandleControllerForMultiple,
  setAllAuthorizedStatus,
  setAuthorizationAddStatus,
  setAuthorizationDeleteStatus,
  setAuthorizationEditStatus,
  setAuthorizationId,
  setAuthorizationIds,
  setEstimateConcernUpdateStatus,
  setEstimateInspectionUpdateStatus,
  setEstimateServiceUpdateStatus,
  setEstimateStatusTypeUpdate,
  setEstimateTypeStatusUpdate,
  setSingleAuthorization,
  setTitleEstimate,
  setUpdateAuthorization,
  updateEstimateConcernSingleItem,
  updateEstimateInspectionSingleItem,
  updateEstimateServiceSingleItem,
  assignConcernHandleControllerForMultiple,
  removeAllEstimateState,
} from "@/redux/slice/estimateItemShowSlice";
import {
  clearAllRelatedItemDB,
  setDeleteItemDB,
} from "@/redux/slice/relatedItemHandleSlice";
import {
  assignConcernHandleController,
  assignInspectionHandleController,
  assignServiceHandleController,
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  addInspectionHours,
  addInspectionPercentages,
  addLabours,
  addMechanicPercentages,
  addParts,
  removeInspectionHourById,
  removeInspectionHourSingleData,
  setUpdateStatusInspectionHour,
  setDeleteStatusInspectionHour,
  setNewInsertInspectionHour,
  InspectionHour,
  updateInspectionHour,
  InspectionPercentage,
  addInspectionPercentage,
  removeInspectionPercentageById,
  setDeleteStatusInspectionPercentage,
  setNewInsertInspectionPercentage,
  removeInspectionPercentageSingleData,
  setUpdateStatusInspectionPercentage,
  updateInspectionPercentage,
  removeAllTempInspectionItems,
  removeAllState,
  updatePart,
  removePartSingleData,
  setUpdateStatusPart,
  setDeleteStatusPart,
  removePartById,
  Part,
  setNewInsertPart,
  updateLabour,
  removeLabourSingleData,
  setUpdateStatusLabour,
  removeLabourById,
  setDeleteStatusLabour,
  Labour,
  addLabour,
  setNewInsertLabour,
  updateMechanicPercentage,
  removeMechanicPercentageSingleData,
  setUpdateStatusMechanicPercentage,
  MechanicPercentage,
  addMechanicPercentage,
  setNewInsertMechanicPercentage,
  setDeleteStatusMechanicPercentage,
  removeMechanicPercentageById,
  removeAllTotal,
  removeAllInspectionHours,
  removeAllMechanicPercentages,
  removeAllInspectionPercentages,
  removeAllLabours,
  removeAllParts,
  addDeferredInspectionHours,
  addDeferredLabours,
  addDeferredParts,
  addDeferredMechanicPercentages,
  addDeferredInspectionPercentages,
  removeAllInspectionItem,
  setEstimateTechnicianUpdateStatus,
} from "@/redux/slice/serviceInspectionItemSlice";
import { getUserInfo } from "@/services/auth.service";
import { IConcern, IInspection, IService } from "@/types";
import {
  calculateAddAmount,
  calculateEstimateAddAmountForPart,
  calculateEstimateUpdateAmountForPart,
  calculateUpdateAmount,
} from "@/utils/amount";
import {
  calculateItemTotalHoursUpdated,
  calculateItemTotalHoursWithoutState,
  calculateTotalHoursUpdated,
  calculateTotalHoursWithoutState,
} from "@/utils/total-hour-calculate";
import { Button, message, Select, Modal, Drawer } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuOutlined } from "@ant-design/icons";
import { FaArrowUp } from "react-icons/fa";
import { convertToDecimalHour } from "@/utils/convertToDecimalHour ";
interface EstimateUpdateProps {
  assignService?: string;
}

const EstimateUpdate: React.FC<EstimateUpdateProps> = ({ assignService }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const showDrawer = () => setOpenDrawer(true);
  const closeDrawer = () => setOpenDrawer(false);
  const scrollContainerUpdateRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const query: Record<string, any> = {};
  const [code, setCode] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [page, setPage] = useState<number>();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const [services, setServices] = useState<IService[]>([]);
  const [inspections, setInspections] = useState<IInspection[]>([]);
  const [concerns, setConcerns] = useState<IConcern[]>([]);
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    dispatch(removeAllEstimateState())
    dispatch(removeAllEstimateConcernItems());
    dispatch(removeAllEstimateInspectionItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(assignConcernHandleControllerForMultiple(false));
    dispatch(assignServiceHandleControllerForMultiple(false));
    dispatch(assignInspectionHandleControllerForMultiple(false));


    dispatch(setUserId(""));
    dispatch(setVehicleId(""));
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
    setInitialized(true)
  }, []);

  const { role, userId: providerId } = getUserInfo() as any;

  const { handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );
  const {
    estimateServiceState,
    estimateInspectionState,
    estimateConcernState,
    authorization,
    authorizationEdit,
    authorizationAdd,
    authorizationDelete,
    authorizationId,
    authorizationIds,
    allAuthorizedStatus,
    updateEstimateServiceState,
    updateEstimateConcernState,
    updateEstimateInspectionState,
    concernUpdate,
    inspectionUpdate,
    serviceUpdate,
    estimateType,
    estimateStatus,
    titleEstimate,
    estimateStatusTypeUpdate,
    estimateServiceAdd,
    estimateInspectionAdd,
    estimateConcernAdd,
  } = useAppSelector((state) => state.estimateItemShow);


  const { serviceHandle, inspectionHandle, concernHandle } = useAppSelector(
    (state) => state.searchItemShow
  );
  const {
    inspectionHour,
    part,
    labour,
    inspectionTotalAmount,
    inspectionTotalHours,
    partsTotalAmount,
    labourTotalAmount,
    labourTotalHours,
    totalAmount,
    totalHours,
    tempInspectionHour,
    tempInspectionPercentage,
    updateStatusInspectionHour,
    deleteStatusInspectionHour,
    newInsertInspectionHour,
    updateStatusInspectionPercentage,
    deleteStatusInspectionPercentage,
    newInsertInspectionPercentage,
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
    changeInspectionHour,
    changeInspectionPercentage,
    updateEstimateTechnicianStatus,
  } = useAppSelector((state) => state.serviceInspectionItem);
  const { handleDeleteItemDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );
  query["searchTerm"] = searchTerm;

  useEffect(() => {
    if (!initialized) return;
    if (updateStatusInspectionHour) {
      handleUpdateInspectionHour(changeInspectionHour);
    }
    if (newInsertInspectionHour) {
      handleNewInsertInspectionHour(changeInspectionHour);
    }
    if (deleteStatusInspectionHour) {
      handleDeleteInspectionHour(changeInspectionHour);
    }
    if (updateStatusInspectionPercentage) {
      handleUpdateInspectionPercentage(changeInspectionPercentage);
    }
    if (newInsertInspectionPercentage) {
      handleNewInsertInspectionPercentage(changeInspectionPercentage);
    }
    if (deleteStatusInspectionPercentage) {
      handleDeleteInspectionPercentage(changeInspectionPercentage);
    }
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
      handleUpdateMechanicPercentage(changeMechanicPercentage);
    }
    if (newInsertMechanicPercentage) {
      handleNewInsertMechanicPercentage(changeMechanicPercentage);
    }
    if (deleteStatusMechanicPercentage) {
      handleDeleteMechanicPercentage(changeMechanicPercentage);
    }
    if (authorizationEdit) {
      handleEditAuthorization(authorization);
    }
    if (authorizationAdd) {
      handleAddAuthorization(authorization);
    }
    if (authorizationDelete) {
      handleDeleteAuthorization(authorizationId);
    }
    if (allAuthorizedStatus) {
      handleUpdateAllAuthorizationStatus(authorizationIds);
    }
    if (handleDeleteItemDB.code) {
      handleDeleteCustomerInfo(handleDeleteItemDB.code);
    }
    if (estimateServiceAdd) {
      assignServiceHandle();
    }
    if (estimateInspectionAdd) {
      assignInspectionHandle();
    }
    if (estimateConcernAdd) {
      assignConcernHandle();
    }
    if (serviceUpdate) {
      handleUpdateService(updateEstimateServiceState);
    }
    if (inspectionUpdate) {
      handleUpdateInspection(updateEstimateInspectionState);
    }
    if (concernUpdate) {
      handleUpdateConcern(updateEstimateConcernState);
    }
    if (estimateStatusTypeUpdate) {
      handleUpdateEstimate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateStatusInspectionHour,
    newInsertInspectionHour,
    deleteStatusInspectionHour,
    updateStatusInspectionPercentage,
    newInsertInspectionPercentage,
    deleteStatusInspectionPercentage,
    updateStatusLabour,
    newInsertLabour,
    deleteStatusLabour,
    updateStatusPart,
    newInsertPart,
    deleteStatusPart,
    updateStatusMechanicPercentage,
    newInsertMechanicPercentage,
    deleteStatusMechanicPercentage,
    authorizationEdit,
    authorizationAdd,
    authorizationDelete,
    allAuthorizedStatus,
    handleDeleteItemDB,
    estimateServiceState,
    serviceUpdate,
    inspectionUpdate,
    concernUpdate,
    estimateStatusTypeUpdate,
    estimateConcernState,
    estimateInspectionState,
    estimateInspectionAdd,
    estimateServiceAdd,
    estimateConcernAdd,
  ]);

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

  //Rest api

  const [updateEstimateInspectionType] =
    useUpdateEstimateInspectionTypeMutation();

  const [updateEstimateServiceType] = useUpdateEstimateServiceTypeMutation();

  const {
    data,
    refetch,
    isLoading: unassignItemLoading,
  } = useGetUnassignServiceInspectionConcernAllDataQuery(
    {
      args: query,
      code,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const allData = data?.data;
  useEffect(() => {
    if (!allData) return;

    // Handle concerns
    allData.forEach((concern: any) => {
      if (concern.type === "Concern") {
        const parentCode = concern.code;
        const stage = "Accept";

        concern.services?.forEach((service: any) => {
          dispatch(
            addSearchRelatedService({
              parentCode,
              childCode: service.service.code,
              childType: service.type,
              parentType: "Concern",
              childTitle: service.service.title,
              childDescription: service.service.description,
              stage,
            })
          );
        });

        concern.inspections?.forEach((inspection: any) => {
          dispatch(
            addSearchRelatedInspection({
              parentCode,
              childCode: inspection.inspection.code,
              childType: inspection.type,
              parentType: "Concern",
              childTitle: inspection.inspection.title,
              childDescription: inspection.inspection.description,
              stage,
            })
          );
        });
      }
    });

    // Handle services
    allData.forEach((service: any) => {
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

        service.serviceInspections?.forEach((related: any) => {
          dispatch(
            addSearchRelatedInspection({
              parentCode,
              childCode: related.inspectionCode,
              parentType: "Service",
              childType: related.recommended ? "Recommended" : "Required",
              childTitle: related.inspection.title,
              childDescription: related.inspection.description,
              stage,
            })
          );
        });
      }
    });

    // Handle inspections
    allData.forEach((inspection: any) => {
      if (inspection.type === "Inspection") {
        const parentCode = inspection.code;
        const stage = "Accept";

        inspection.relatedServices?.forEach((related: any) => {
          dispatch(
            addSearchRelatedService({
              parentCode,
              childCode: related.service.code,
              parentType: "Inspection",
              childType: related.type,
              childTitle: related.service.title,
              childDescription: related.service.description,
              stage,
            })
          );
        });
      }
    });
  }, [allData, dispatch]);

  const {
    data: estimateServices,
    refetch: estimateServiceFetch,
    isLoading: serviceLoading,
  } = useGetEstimateServicesQuery(
    { code },
    { refetchOnMountOrArgChange: true }
  );
  const {
    data: estimateInspections,
    refetch: estimateInspectionFetch,
    isLoading: inspectionLoading,
  } = useGetEstimateInspectionsQuery(
    { code },

    { refetchOnMountOrArgChange: true }
  );
  const {
    data: estimateConcerns,
    refetch: estimateConcernFetch,
    isLoading: concernLoading,
  } = useGetEstimateConcernsQuery(
    { code },

    { refetchOnMountOrArgChange: true }
  );
  // get all created authorization
  const { data: authorizationFetch, refetch: authorizationRefetch } =
    useGetAllAuthorizationQuery(
      { code },

      { refetchOnMountOrArgChange: true }
    );

  const [assignServiceToEstimate] = useAssignServiceToEstimateMutation();
  const [assignInspectionToEstimate] = useAssignInspectionToEstimateMutation();
  const [assignConcernToEstimate] = useAssignConcernToEstimateMutation();
  const [updateEstimate] = useUpdateEstimateMutation();
  const [updateInspectionHoursData] = useUpdateInspectionHoursDataMutation();
  const [deleteInspectionHour] = useDeleteInspectionHoursMutation();
  const [addInspectionHoursEstimate] = useAddInspectionHoursEstimateMutation();
  const [updateInspectionPercentageData] =
    useUpdateInspectionPercentageDataMutation();
  const [addInspectionPercentageData] =
    useAddInspectionPercentageDataMutation();
  const [deleteInspectionPercentage] = useDeleteInspectionPercentageMutation();
  const [updatePartData] = useUpdatePartDataMutation();
  const [deletePartData] = useDeletePartDataMutation();
  const [addPartData] = useAddPartsDataMutation();
  const [updateLabourData] = useUpdateLabourDataMutation();
  const [deleteLabourData] = useDeleteLabourDataMutation();
  const [addLabourData] = useAddLaboursDataMutation();
  const [updateMechanicPercentageData] =
    useUpdateMechanicPercentageDataMutation();
  const [deleteMechanicPercentageData] =
    useDeleteMechanicPercentageDataMutation();
  const [addMechanicPercentageData] = useAddMechanicPercentageDataMutation();
  const [updateAuthorization] = useUpdateAuthorizationMutation();
  const [createAuthorization] = useCreateAuthorizationMutation();
  const [deleteAuthorization] = useDeleteAuthorizationMutation();
  const [updateAllAuthorization] = useUpdateAllAuthorizationMutation();
  const [deleteCustomerFromEstimate] = useDeleteCustomerFromEstimateMutation();
  const [updateEstimateService] = useUpdateEstimateServiceMutation();
  const [updateEstimateInspection] = useUpdateEstimateInspectionMutation();
  const [updateEstimateConcern] = useUpdateEstimateConcernMutation();

  useEffect(() => {
    if (estimateServices) {
      const formattedServices: IService[] = estimateServices.map(
        (item: any) => ({
          code: item.serviceCode,
          title: item.serviceTitle,
          description: item.serviceDescription,
          stage: item.stage,
          type: "Service",
        })
      );

      setServices(formattedServices);
    }
    if (estimateInspections) {
      const formattedInspections: IInspection[] = estimateInspections.map(
        (item: any) => ({
          code: item.inspectionCode,
          title: item.inspectionTitle,
          description: item.inspectionDescription,
          stage: item.stage,
          type: "Inspection",
        })
      );

      setInspections(formattedInspections);
    }
    if (estimateConcerns) {
      const formattedConcerns: IConcern[] = estimateConcerns.map(
        (item: any) => ({
          code: item.concernCode,
          title: item.concernTitle,
          description: item.concernDescription,
          stage: item.stage,
          type: "Concern",
        })
      );

      setConcerns(formattedConcerns);
    }
  }, [estimateServices, estimateInspections, estimateConcerns]);

  const handleChangeAuthorization = (name: string, value: string) => {
    setAuthorizationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setCode(extractCode);
    }
  }, [pathname, searchParams]);

  const {
    data: estimateData,
    isLoading: estimateLoading,
    refetch: estimateFetch,
  } = useGetSingleEstimateQuery(
    { code },

    { refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    const refetch = async () => {
      if (updateEstimateTechnicianStatus && estimateData) {
        await estimateFetch();
        dispatch(setEstimateTechnicianUpdateStatus(false));
        dispatch(removeAllMechanicPercentages());
        dispatch(removeAllInspectionPercentages());

        // Helper function to categorize data into Accept & Deferred arrays
        const categorizeItems = (array: any[], stageKey: string) => {
          const acceptItems =
            array?.filter((item) => item[stageKey] === "Accept") || [];
          const deferredItems =
            array?.filter((item) => item[stageKey] === "Deferred") || [];
          return { acceptItems, deferredItems };
        };

        const {
          acceptItems: acceptMechanicPercentages,
          deferredItems: deferredMechanicPercentages,
        } = categorizeItems(
          estimateData?.estimateTechnician?.map((item: any) => ({
            serviceCode: item.serviceCode,
            mechanicPercentageId: item.id,
            id: item.technicianId,
            name: item.technician.name,
            percentage: item.percentage,
            serviceStage: item.stage,
          })),
          "serviceStage"
        );


        const {
          acceptItems: acceptInspectionPercentages,
          deferredItems: deferredInspectionPercentages,
        } = categorizeItems(
          estimateData?.estimateInspectionInspector?.map((item: any) => ({
            inspectionCode: item.inspectionCode,
            inspectionPercentageId: item.id,
            id: item?.inspectorId,
            name: item.inspector.name,
            percentage: item.percentage,
            inspectionStage: item.stage,
          })),
          "inspectionStage"
        );

        dispatch(addMechanicPercentages(acceptMechanicPercentages));
        dispatch(addDeferredMechanicPercentages(deferredMechanicPercentages));
        dispatch(addInspectionPercentages(acceptInspectionPercentages));
        dispatch(
          addDeferredInspectionPercentages(deferredInspectionPercentages)
        );
      }
    };
    refetch();
  }, [updateEstimateTechnicianStatus, estimateFetch, dispatch, estimateData]);

  useEffect(() => {
    if (estimateData) {
      dispatch(removeAllTotal());
      dispatch(removeAllInspectionHours());
      dispatch(removeAllMechanicPercentages());
      dispatch(removeAllInspectionPercentages());
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

      // Inspection Hours
      const {
        acceptItems: acceptInspectionHours,
        deferredItems: deferredInspectionHours,
      } = categorizeItems(
        estimateData?.estimateInspectionHoursForInspection?.map(
          (item: any) => ({
            inspectionCode: item.inspectionCode,
            inspectionHourId: item.inspectionHoursId,
            inspectionHours: item.inspectionHours.inspectionHours,
            inspectionHourlyRate: item.inspectionHours.inspectionHourlyRate,
            inspectionStage: item.stage,
          })
        ),
        "inspectionStage"
      );

      const { acceptItems: acceptLabours, deferredItems: deferredLabours } =
        categorizeItems(
          estimateData?.estimateServiceLabour?.map((item: any) => ({
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
          estimateData?.estimateServiceParts?.map((item: any) => ({
            serviceCode: item?.serviceCode,
            partId: item?.partId,
            name: item?.part?.name,
            unitPrice: item?.part?.unitPrice,
            provider: item?.part?.provider,
            installationHours: item?.part?.installationHours,
            quantity: item?.totalUnit,
            margin: item?.part?.margin,
            total: item?.part?.total,
            serviceStage: item.stage,
          })),
          "serviceStage"
        );

      const {
        acceptItems: acceptMechanicPercentages,
        deferredItems: deferredMechanicPercentages,
      } = categorizeItems(
        estimateData?.estimateTechnician?.map((item: any) => ({
          serviceCode: item.serviceCode,
          mechanicPercentageId: item.id,
          id: item.technicianId,
          name: item.technician.name,
          percentage: item.percentage,
          serviceStage: item.stage,
        })),
        "serviceStage"
      );

      const {
        acceptItems: acceptInspectionPercentages,
        deferredItems: deferredInspectionPercentages,
      } = categorizeItems(
        estimateData?.estimateInspectionInspector?.map((item: any) => ({
          inspectionCode: item.inspectionCode,
          inspectionPercentageId: item.id,
          id: item?.inspectorId,
          name: item.inspector.name,
          percentage: item.percentage,
          inspectionStage: item.stage,
        })),
        "inspectionStage"
      );

      dispatch(addInspectionHours(acceptInspectionHours));
      dispatch(addDeferredInspectionHours(deferredInspectionHours));
      dispatch(addLabours(acceptLabours));
      dispatch(addDeferredLabours(deferredLabours));
      dispatch(addParts(acceptParts));
      dispatch(addDeferredParts(deferredParts));
      dispatch(addMechanicPercentages(acceptMechanicPercentages));
      dispatch(addDeferredMechanicPercentages(deferredMechanicPercentages));
      dispatch(addInspectionPercentages(acceptInspectionPercentages));
      dispatch(addDeferredInspectionPercentages(deferredInspectionPercentages));
      dispatch(setEstimateTechnicianUpdateStatus(false));
    }
  }, [dispatch, estimateData]);

  // const [formData, setFormData] = useState({
  //   title: "",
  // });

  // useEffect(() => {
  //   if (estimateData) {
  //     setFormData({
  //       title: estimateData?.title,
  //     });
  //   }
  // }, [estimateData, setFormData]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { id, value } = e.target;

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [id]: value,
  //   }));
  // };
  const [authorizationData, setAuthorizationData] = useState({
    authorizationStatus: "",
    authorizationMedium: "",
  });

  //Update estimate title, type, status
  const handleUpdateEstimate = async () => {
    try {
      const data = JSON.stringify({
        title: titleEstimate,
        status: estimateStatus,
        type: estimateType,
      });
      await updateEstimate({ code: code, data })
        .unwrap()
        .then((res) => {
          dispatch(setEstimateStatusTypeUpdate(false));
          message.success("updated successfully");
          if (assignService !== 'assignService') {

          }
        })
        .catch((err) => {
          message.error("Failed to update Estimate");
          dispatch(setEstimateStatusTypeUpdate(false));
        });
      estimateFetch();
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleUpdateType = async (
    itemCode: string,
    subType: string,
    stage: string
  ) => {
    try {
      if (subType === "Service") {
        await updateEstimateServiceType({
          estimateCode: code,
          serviceCode: itemCode,
          providerId,
          data: { stage },
        }).unwrap();
        message.success("Service type updated successfully!");
        estimateServiceFetch();
        // fetch History
        authorizationRefetch();
        dispatch(clearAllRelatedItemDB());
        estimateFetch();
      }
      if (subType === "Inspection") {
        await updateEstimateInspectionType({
          estimateCode: code,
          inspectionCode: itemCode,
          providerId,
          data: { stage },
        }).unwrap();
        message.success("Inspection type updated successfully!");
        estimateInspectionFetch();
        dispatch(clearAllRelatedItemDB());
        // fetch History
        authorizationRefetch();
        estimateFetch();
      }
    } catch (error) {
      message.error("Failed to delete the service. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };

  const assignServiceHandle = async () => {
    dispatch(assignServiceHandleController(false));
    dispatch(assignServiceHandleControllerForMultiple(false));

    try {
      await assignServiceToEstimate({
        code,
        data: estimateServiceState,
      })
        .unwrap()
        .then(() => {
          message.success("Service added successfully");
          estimateFetch();
          estimateServiceFetch();
          dispatch(removeAllEstimateServiceItems());
        });
    } catch (err) {
      if (estimateServiceState?.length <= 1) {
        message.error("Failed to assign services. Please try again.");
        dispatch(removeAllEstimateServiceItems());
      }
    }
  };

  const assignInspectionHandle = async () => {
    dispatch(assignInspectionHandleController(false));
    dispatch(assignInspectionHandleControllerForMultiple(false));

    try {
      await assignInspectionToEstimate({
        code,
        data: estimateInspectionState,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection added successfully");
          estimateFetch();
          estimateInspectionFetch();
          dispatch(removeAllEstimateInspectionItems());
          setAuthorizationData({
            authorizationStatus: "",
            authorizationMedium: "",
          });
          dispatch(addInspectionHours(tempInspectionHour));
          dispatch(addInspectionPercentages(tempInspectionPercentage));
          dispatch(removeAllTempInspectionItems());
        });
    } catch (err) {
      if (estimateInspectionState?.length <= 1) {
        message.error("Failed to assign inspection. Please try again.");
      }
    }
  };

  const assignConcernHandle = async () => {
    dispatch(assignConcernHandleController(false));
    dispatch(assignConcernHandleControllerForMultiple(false));

    try {
      await assignConcernToEstimate({
        code,
        data: estimateConcernState,
      }).unwrap();

      message.success("Concern added successfully");
      estimateConcernFetch();
      estimateFetch();
      dispatch(removeAllEstimateConcernItems());
    } catch (err) {
      message.error("Failed to assign concerns. Please try again.");
    }
  };

  const handleUpdatePart = async (changePart: any) => {
    const existingItem: any = part.find(
      (entry: any) => entry.partId === changePart.partId
    );
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateEstimateUpdateAmountForPart(
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
      const resp = await updatePartData({
        estimateCode: code,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
        providerId,
        data: formattedData,
      })
        .unwrap()
        .then(async () => {
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

          // fetch History
          authorizationRefetch();
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
      await deletePartData({
        estimateCode: code,
        serviceCode: changePart.serviceCode,
        partId: changePart.partId,
        providerId,
      })
        .unwrap()
        .then(() => {
          // fetch History
          authorizationRefetch();
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
      calculateEstimateAddAmountForPart(
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
      const response = await addPartData({
        estimateCode: code,
        serviceCode: part.serviceCode,
        providerId,
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
        // refetch Authorization
        await authorizationRefetch();
      }
      dispatch(removePartSingleData());
      dispatch(setNewInsertPart(false));
    } catch (err: any) {
      message.error(
        `Failed to add part: ${err?.data?.message}. Please try again.`
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
      await updateLabourData({
        estimateCode: code,
        serviceCode: changeLabour.serviceCode,
        labourId: changeLabour.labourId,
        providerId,
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
          // fetch History
          authorizationRefetch();

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
      await deleteLabourData({
        estimateCode: code,
        serviceCode: changeLabour.serviceCode,
        labourId: changeLabour.labourId,
        providerId,
      })
        .unwrap()
        .then(() => {
          message.success("Labour deleted successfully");
          // fetch History
          authorizationRefetch();
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
      const response = await addLabourData({
        estimateCode: code,
        serviceCode: labour.serviceCode,
        providerId,
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
        // fetch History
        authorizationRefetch();
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

  const handleUpdateMechanicPercentage = async (
    changeMechanicPercentage: any
  ) => {
    const formattedData = {
      mechanicPercentage: {
        id: changeMechanicPercentage.id,
        percentage: changeMechanicPercentage.percentage,
      },
    };

    try {
      await updateMechanicPercentageData({
        estimateCode: code,
        serviceCode: changeMechanicPercentage.serviceCode,
        estimateMechanicPercentageId:
          changeMechanicPercentage.mechanicPercentageId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          estimateFetch();
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
          message.success("Mechanic percentage updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update mechanic percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setUpdateStatusMechanicPercentage(false));
    }
  };

  const handleNewInsertMechanicPercentage = async (
    changeMechanicPercentage: any
  ) => {
    const data = JSON.stringify(changeMechanicPercentage);
    try {
      const response = await addMechanicPercentageData({
        estimateCode: code,
        serviceCode: changeMechanicPercentage.serviceCode,
        data,
      }).unwrap();

      if (response) {

        const mechanicPercentageData: MechanicPercentage = {
          serviceCode: response.serviceCode,
          serviceStage: response.stage,
          mechanicPercentageId: response.id,
          id: response.technicianId,
          percentage: response.percentage,
          name: response.technician.name,
        };

        dispatch(addMechanicPercentage(mechanicPercentageData));
        message.success("Mechanic percentage added successfully");
        estimateFetch();
      }
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setNewInsertMechanicPercentage(false));
    } catch (err: any) {
      message.error(
        `Failed to add mechanic percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setNewInsertMechanicPercentage(false));
    }
  };

  const handleDeleteMechanicPercentage = async (
    changeMechanicPercentage: any
  ) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this mechanic percentage?",
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
      await deleteMechanicPercentageData({
        estimateMechanicPercentageId:
          changeMechanicPercentage.mechanicPercentageId,
      })
        .unwrap()
        .then(() => {
          message.success("Mechanic percentage deleted successfully");
          estimateFetch();
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
        `Failed to delete mechanic percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeMechanicPercentageSingleData());
      dispatch(setDeleteStatusMechanicPercentage(false));
    }
  };

  const handleUpdateInspectionHour = async (changeInspectionHour: any) => {
    const existingItem: any = inspectionHour.find(
      (entry: any) =>
        entry.inspectionHourId === changeInspectionHour.inspectionHourId
    );
    const { itemTotalAmountUpdated, totalAmountUpdated } =
      calculateUpdateAmount(
        existingItem?.inspectionHours,
        changeInspectionHour.inspectionHours,
        existingItem?.inspectionHourlyRate,
        changeInspectionHour.inspectionHourlyRate,
        inspectionTotalAmount,
        totalAmount
      );

    const inspectionTotalHoursUpdated = calculateItemTotalHoursUpdated(
      inspectionTotalHours,
      changeInspectionHour.inspectionHours,
      existingItem?.inspectionHours
    );
    const totalHoursUpdated = calculateTotalHoursUpdated(
      totalHours,
      changeInspectionHour.inspectionHours,
      existingItem?.inspectionHours
    );

    const inspectionHourTotal = {
      ...changeInspectionHour,
      inspectionTotalAmount: itemTotalAmountUpdated,
      inspectionTotalHours: inspectionTotalHoursUpdated,
      totalAmount: totalAmountUpdated,
      totalHours: totalHoursUpdated,
    };

    const formattedData = {
      inspectionHour: {
        ...changeInspectionHour,
        inspectionTotalAmount: itemTotalAmountUpdated,
        inspectionTotalHours: inspectionTotalHoursUpdated,
        totalAmount: totalAmountUpdated,
        totalHours: totalHoursUpdated,
      },
    };

    try {
      await updateInspectionHoursData({
        estimateCode: code,
        inspectionCode: changeInspectionHour.inspectionCode,
        inspectionHoursId: changeInspectionHour.inspectionHourId,
        providerId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection hour updated successfully");
          dispatch(
            updateInspectionHour({
              inspectionCode: changeInspectionHour.inspectionCode,
              inspectionStage: changeInspectionHour.inspectionStage,
              inspectionHourId: changeInspectionHour.inspectionHourId,
              inspectionHours: changeInspectionHour.inspectionHours,
              inspectionHourlyRate: changeInspectionHour.inspectionHourlyRate,
            })
          );
          // fetch History
          authorizationRefetch();

          dispatch(removeInspectionHourSingleData());
          dispatch(setUpdateStatusInspectionHour(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update inspection hour: ${err.data.message}. Please try again.`
      );
      dispatch(removeInspectionHourSingleData());
      dispatch(setUpdateStatusInspectionHour(false));
    }
  };

  const handleDeleteInspectionHour = async (changeInspectionHour: any) => {
    // Add confirmation dialog
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this inspection hour?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(removeInspectionHourSingleData());
      dispatch(setDeleteStatusInspectionHour(false));
      return;
    }

    try {
      await deleteInspectionHour({
        estimateCode: code,
        inspectionCode: changeInspectionHour.inspectionCode,
        inspectionHoursId: changeInspectionHour.inspectionHourId,
        providerId,
      })
        .unwrap()
        .then(() => {
          // fetch History
          authorizationRefetch();
          message.success("Inspection hour deleted successfully");
          dispatch(removeInspectionHourSingleData());
          dispatch(
            removeInspectionHourById(changeInspectionHour.inspectionHourId)
          );
          dispatch(setDeleteStatusInspectionHour(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete inspection hour: ${err.data.message}. Please try again.`
      );
      dispatch(removeInspectionHourSingleData());
      dispatch(setDeleteStatusInspectionHour(false));
    }
  };

  const handleNewInsertInspectionHour = async (
    inspectionHour: InspectionHour
  ) => {
    const { itemTotalAmountUpdated, totalAmountUpdated } = calculateAddAmount(
      inspectionHour.inspectionHours,
      inspectionHour.inspectionHourlyRate,
      inspectionTotalAmount,
      totalAmount
    );

    const inspectionTotalHoursUpdated = calculateItemTotalHoursWithoutState(
      inspectionTotalHours,
      inspectionHour.inspectionHours
    );
    const totalHoursUpdated = calculateTotalHoursWithoutState(
      totalHours,
      inspectionHour.inspectionHours
    );

    const inspectionHourTotal = {
      ...inspectionHour,
      inspectionTotalAmount: itemTotalAmountUpdated,
      inspectionTotalHours: inspectionTotalHoursUpdated,
      totalAmount: totalAmountUpdated,
      totalHours: totalHoursUpdated,
    };

    const data = JSON.stringify(inspectionHourTotal);

    try {
      const response = await addInspectionHoursEstimate({
        estimateCode: code,
        inspectionCode: inspectionHour.inspectionCode,
        providerId,
        data,
      }).unwrap();

      if (response) {
        const inspectionHourData: InspectionHour = {
          inspectionCode: response.inspectionCode,
          inspectionStage: response.stage,
          inspectionHourId: response.inspectionHoursId,
          inspectionHours: parseInt(response.inspectionHours.inspectionHours),
          inspectionHourlyRate: parseFloat(
            response.inspectionHours.inspectionHourlyRate
          ),
        };
        dispatch(addInspectionHours([inspectionHourData]));
        // fetch History
        authorizationRefetch();
        message.success("Inspection hour added successfully");
      }

      dispatch(removeInspectionHourSingleData());
      dispatch(setNewInsertInspectionHour(false));
    } catch (err: any) {
      message.error(
        `Failed to add inspection hour: ${err.data.message}. Please try again.`
      );
      dispatch(removeInspectionHourSingleData());
      dispatch(setNewInsertInspectionHour(false));
    }
  };

  const handleUpdateInspectionPercentage = async (
    changeInspectionPercentage: any
  ) => {
    const formattedData = {
      inspectionPercentage: {
        id: changeInspectionPercentage.id,
        percentage: changeInspectionPercentage.percentage,
      },
    };

    try {
      await updateInspectionPercentageData({
        estimateCode: code,
        inspectionCode: changeInspectionPercentage.inspectionCode,
        inspectionPercentageId:
          changeInspectionPercentage.inspectionPercentageId,
        data: formattedData,
      })
        .unwrap()
        .then(() => {
          dispatch(
            updateInspectionPercentage({
              inspectionCode: changeInspectionPercentage.inspectionCode,
              inspectionStage: changeInspectionPercentage.inspectionStage,
              inspectionPercentageId:
                changeInspectionPercentage.inspectionPercentageId,
              percentage: changeInspectionPercentage.percentage,
              id: changeInspectionPercentage.id,
              name: changeInspectionPercentage.name,
              inspectorId: "",
            })
          );
          estimateFetch();
          dispatch(removeInspectionPercentageSingleData());
          dispatch(setUpdateStatusInspectionPercentage(false));
          message.success("Inspection percentage updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update inspection percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeInspectionPercentageSingleData());
      dispatch(setUpdateStatusInspectionPercentage(false));
    }
  };

  const handleNewInsertInspectionPercentage = async (
    changeInspectionPercentage: any
  ) => {
    const data = JSON.stringify(changeInspectionPercentage);
    try {
      const response = await addInspectionPercentageData({
        estimateCode: code,
        inspectionCode: changeInspectionPercentage.inspectionCode,
        data,
      }).unwrap();

      if (response) {
        estimateFetch();
        const inspectionPercentageData: InspectionPercentage = {
          inspectionCode: response.inspectionCode,
          inspectionStage: response.stage,
          inspectionPercentageId: response.id,
          id: response.inspectorId,
          percentage: response.percentage,
          name: response.inspector.name,
          inspectorId: "",
        };
        dispatch(addInspectionPercentage(inspectionPercentageData));

        message.success("Inspection percentage added successfully");
      }

      dispatch(removeInspectionPercentageSingleData());
      dispatch(setNewInsertInspectionPercentage(false));
    } catch (err: any) {
      message.error(
        `Failed to add inspection percentage: ${err?.data?.message}. Please try again.`
      );
      dispatch(removeInspectionPercentageSingleData());
      dispatch(setNewInsertInspectionPercentage(false));
    }
  };

  const handleDeleteInspectionPercentage = async (
    changeInspectionPercentage: any
  ) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this inspection percentage?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(removeInspectionPercentageSingleData());
      dispatch(setDeleteStatusInspectionPercentage(false));
      return;
    }

    try {
      await deleteInspectionPercentage({
        estimateInspectionPercentageId:
          changeInspectionPercentage.inspectionPercentageId,
      })
        .unwrap()
        .then(() => {
          estimateFetch();
          message.success("Inspection percentage deleted successfully");
          dispatch(
            removeInspectionPercentageById(
              changeInspectionPercentage.inspectionPercentageId
            )
          );
          dispatch(removeInspectionPercentageSingleData());
          dispatch(setDeleteStatusInspectionPercentage(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete inspection percentage: ${err.data.message}. Please try again.`
      );
      dispatch(removeInspectionPercentageSingleData());
      dispatch(setDeleteStatusInspectionPercentage(false));
    }
  };

  const handleEditAuthorization = async (formattedData: any) => {
    const { id, ...dataWithoutId } = formattedData;

    try {
      await updateAuthorization({
        id,
        data: dataWithoutId,
      })
        .unwrap()
        .then(() => {

          estimateFetch();
          authorizationFetch()
          dispatch(setAuthorizationEditStatus(false));
          dispatch(setSingleAuthorization(""));
        });
    } catch (err: any) {
      message.error(
        `Failed to update authorization: ${err.data.message}. Please try again.`
      );
      dispatch(setSingleAuthorization(""));
      dispatch(setAuthorizationEditStatus(false));
    }
  };

  const handleAddAuthorization = async (formattedData: any) => {
    const payload = {
      ...formattedData,
      estimateCode: estimateData?.code,
    };
    try {
      await createAuthorization({
        data: payload,
      })
        .unwrap()
        .then(() => {
          // fetch History
          authorizationRefetch();
          dispatch(setAuthorizationEditStatus(false));
          dispatch(setUpdateAuthorization(""));
          dispatch(setAuthorizationAddStatus(false));
          message.success("Authorization added successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to add authorization: ${err.data.message}. Please try again.`
      );
      dispatch(setAuthorizationEditStatus(false));
      dispatch(setUpdateAuthorization(""));
    }
  };

  const handleDeleteAuthorization = async (authorizationId: any) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this authorization?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(setAuthorizationId(""));
      dispatch(setAuthorizationDeleteStatus(false));
      return;
    }

    try {
      await deleteAuthorization({
        authorizationId,
      })
        .unwrap()
        .then(() => {
          message.success("Authorization deleted successfully");
          // fetch History
          authorizationRefetch();
          dispatch(setAuthorizationId(""));
          dispatch(setAuthorizationDeleteStatus(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to delete authorization: ${err.data.message}. Please try again.`
      );
      dispatch(setAuthorizationId(""));
      dispatch(setAuthorizationDeleteStatus(false));
    }
  };

  const handleUpdateAllAuthorizationStatus = async (formattedData: any) => {
    const payload = {
      ids: formattedData,
    };
    try {
      await updateAllAuthorization({
        data: payload,
      })
        .unwrap()
        .then(() => {
          authorizationRefetch();
          estimateFetch()
          dispatch(setAllAuthorizedStatus(false));
          dispatch(setAuthorizationIds([]));
          message.success("Authorization status updated successfully");
        });
    } catch (err: any) {
      message.error(
        `Failed to update authorization status: ${err?.data?.message}. Please try again.`
      );
      dispatch(setAllAuthorizedStatus(false));
      dispatch(setAuthorizationIds([]));
    }
  };

  const handleUpdateService = async (formattedData: any) => {
    const { serviceCode, ...payload } = formattedData;
    try {
      await updateEstimateService({
        estimateCode: estimateData.code,
        serviceCode: formattedData.serviceCode,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Service updated successfully");
          estimateServiceFetch();
          dispatch(updateEstimateServiceSingleItem(""));
          dispatch(setEstimateServiceUpdateStatus(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update service: ${err.data.message}. Please try again.`
      );
      estimateServiceFetch();
      dispatch(updateEstimateServiceSingleItem(""));
      dispatch(setEstimateServiceUpdateStatus(false));
    }
  };

  const handleUpdateInspection = async (formattedData: any) => {
    const { inspectionCode, ...payload } = formattedData;
    try {
      await updateEstimateInspection({
        estimateCode: estimateData.code,
        inspectionCode: formattedData.inspectionCode,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection updated successfully");
          estimateInspectionFetch();
          dispatch(updateEstimateInspectionSingleItem(""));
          dispatch(setEstimateInspectionUpdateStatus(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update Inspection: ${err.data.message}. Please try again.`
      );
      estimateInspectionFetch();
      dispatch(updateEstimateInspectionSingleItem(""));
      dispatch(setEstimateInspectionUpdateStatus(false));
    }
  };

  const handleUpdateConcern = async (formattedData: any) => {
    const { ConcernCode, ...payload } = formattedData;
    try {
      await updateEstimateConcern({
        estimateCode: estimateData.code,
        concernCode: formattedData.concernCode,
        payload,
      })
        .unwrap()
        .then(() => {
          message.success("Concern updated successfully");
          estimateConcernFetch();
          dispatch(updateEstimateConcernSingleItem(""));
          dispatch(setEstimateConcernUpdateStatus(false));
        });
    } catch (err: any) {
      message.error(
        `Failed to update Concern: ${err.data.message}. Please try again.`
      );
      estimateConcernFetch();
      dispatch(updateEstimateConcernSingleItem(""));
      dispatch(setEstimateConcernUpdateStatus(false));
    }
  };

  const { data: estimateOwnerVehicle, refetch: assingedOwnerVehicleRefetch } =
    useGetOwnerVehicleQuery(
      { code: estimateData?.code },
      { refetchOnMountOrArgChange: true }
    );

  const handleDeleteCustomerInfo = async (formattedData: any) => {

    if (authorizationFetch?.length > 0) {
      message.error("Remove authorization first");
      dispatch(
        setDeleteItemDB({
          code: "",
          type: "",
          subType: "",
        })
      );
      return;
    }

    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this authorization?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(
        setDeleteItemDB({
          code: "",
          type: "",
          subType: "",
        })
      );
      return;
    }

    try {
      await deleteCustomerFromEstimate({
        estimateCode: estimateData.code,
        customerId: formattedData.ownerId,
        vehicleId: formattedData.vehicleId,
      }).unwrap()
      message.success("Customer Info deleted successfully");

      dispatch(
        setDeleteItemDB({
          code: "",
          type: "",
          subType: "",
        })
      );
      assingedOwnerVehicleRefetch();
    } catch (err: any) {
      message.error(
        `Failed to delete customer info: ${err.data.message}. Please try again.`
      );
      dispatch(
        setDeleteItemDB({
          code: "",
          type: "",
          subType: "",
        })
      );
    }
  };

  useEffect(() => {
    if (serviceHandle && estimateServiceState.length > 0) {
      assignServiceHandle();
    }
    if (inspectionHandle && estimateInspectionState.length > 0) {
      assignInspectionHandle();
    }
    if (concernHandle && estimateConcernState.length > 0) {
      assignConcernHandle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceHandle, inspectionHandle, concernHandle]);

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  useEffect(() => {
    dispatch(setSelectedCar(null));
    dispatch(removeAllInspectionItem());
  }, [dispatch]);

  if (
    estimateLoading ||
    serviceLoading ||
    unassignItemLoading ||
    inspectionLoading ||
    concernLoading
  ) {
    return <Loading></Loading>;
  }
  const concern = {
    code: "CN-jjkagxj",
    title: "Concern-1",
    description: "kashkxhaksk",
    type: "Concern",
  };
  const inspection = {
    code: "IS-IS-444",
    title: "INSPECTION-4",
    description: "INSPECTION-4",
    type: "Inspection",
  };
  const service = {
    code: "SR-3mj4hbrjkwebg",
    title: "Ser-32",
    description: "dsfgvdf",
    type: "Service",
  };

  const estimate = {
    code: estimateData?.code,
    createdAt: estimateData?.createdAt,
    providerId: estimateData?.providerId,
    status: estimateData?.status,
    title: estimateData?.title,
    type: estimateData?.type,
    technicianAssignEstimate: estimateData?.technicianAssignEstimate,
    updatedAt: estimateData?.updatedAt,
    vehicle: estimateData?.vehicle,
  };

  const handleScrollToTop = () => {
    if (scrollContainerUpdateRef.current) {
      scrollContainerUpdateRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };



  return (
    <div className="mx-auto px-3 relative ">
      {/* Scroll to Top Button with Arrow Icon */}
      <button
        onClick={handleScrollToTop}
        className="bg-neutral-800 z-50 text-white font-bold px-3 py-3 rounded absolute bottom-2 right-2 hover:bg-neutral-700 cursor-pointer border-none outline-none flex items-center justify-center "
      >
        <FaArrowUp className="text-lg" />
      </button>

      {/* Mobile/Tab Drawer Toggle Button */}
      <div className="lg:hidden absolute top-2 right-2 z-50">
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={showDrawer}
          className="bg-[#2E2E2E] hover:bg-neutral-700"
        />
      </div>
      <div className="flex justify-between items-start gap-4">
        <div
          className="w-full lg:w-[70%] scrollbar-hide overflow-y-auto h-[calc(100vh)]"
          ref={scrollContainerUpdateRef}
        >


          {/* <div className="mt-2 mb-1">
            Featured Service / Inspection / Concern
          </div>
          <div className="bg-background-item p-4 rounded-md h-60 overflow-auto">
            <SearchCard
              key={concern.code}
              item={concern}
              page={"estimate"}
              type={false}
            />
            <SearchCard
              key={inspection.code}
              item={inspection}
              page={"estimate"}
              type={false}
            />
            <SearchCard
              key={service.code}
              item={service}
              page={"estimate"}
              type={false}
            />
          </div> */}

          <div className="mt-1">
            <div>
              <label htmlFor="">Search for Service / Inspect / Concern</label>
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
            data={allData}
            type={false}
            page="estimate"
            operation="update"
          />
          <RelatedItemShowConcern
            data={concerns}
            type={"Estimate"}
            subType="Concern"
          />
          <RelatedItemShowService
            data={services}
            type={"Estimate"}
            subType="Service"
          />
          <RelatedItemShowInspection
            data={inspections}
            type={"Estimate"}
            subType="Inspection"
          />

          <div className="mb-16 md:mb-3 px-3">
            <div className=" bg-white rounded border border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-1">
                Summary of Charges
              </h4>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Inspection Hours:</span>
                  <span className="text-blue-600 font-medium">
                    {convertToDecimalHour(inspectionTotalHours)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Labour Hours:</span>
                  <span className="text-blue-600 font-medium">
                    {convertToDecimalHour(labourTotalHours)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Inspection Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${inspectionTotalAmount}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Labour Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${labourTotalAmount}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Parts Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${partsTotalAmount}
                  </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-green-600">${totalAmount}</span>
                </div>

                <div className="flex  text-sm justify-between font-semibold text-gray-800">
                  <span>Total Hours:</span>
                  <span className="text-green-600">{convertToDecimalHour(totalHours)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-[30%] mt-3 overflow-y-auto h-[calc(100vh-60px)] scrollbar-hide">
          <EstimateSidebar
            estimate={estimate}
            assingedOwnerVehicleRefetch={assingedOwnerVehicleRefetch}
            estimateOwnerVehicle={estimateOwnerVehicle}
            authorizationFetch={authorizationFetch}
            page={true}
          />
        </div>
        {/* Drawer for Mobile/Tab */}
        <Drawer
          title="Estimate Sidebar"
          placement="right"
          closable={true}
          onClose={closeDrawer}
          open={openDrawer}
          width={320}
        >
          <EstimateSidebar
            estimate={estimate}
            assingedOwnerVehicleRefetch={assingedOwnerVehicleRefetch}
            estimateOwnerVehicle={estimateOwnerVehicle}
            authorizationFetch={authorizationFetch}
            page={true}
          />
        </Drawer>
      </div>
    </div>
  );
};

export default EstimateUpdate;
