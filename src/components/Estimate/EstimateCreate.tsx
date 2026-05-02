"use client";

import SearchAssignConcernShow from "@/components/SearchAssignItemShow/SearchAssignConcernShow";
import SearchAssignInspectionShow from "@/components/SearchAssignItemShow/SearchAssignInspectionShow";
import SearchAssignServiceShow from "@/components/SearchAssignItemShow/SearchAssignServiceShow";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  useCreateEstimateMutation,
  useGetServiceInspectionConcernAllDataQuery,
} from "@/redux/api/estimateApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import {
  addSearchRelatedInspection,
  addSearchRelatedService,
  assignConcernHandleControllerForMultiple,
  assignInspectionHandleControllerForMultiple,
  assignServiceHandleControllerForMultiple,
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  removeAllEstimateState,
  removeSearchRelatedServiceInspection,
  setEstimateType,
  setTitleEstimate,
} from "@/redux/slice/estimateItemShowSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { Button, Drawer, Input, message, Modal, Select } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { getUserInfo, removeUserInfo } from "@/services/auth.service";
import { estimateCreate } from "@/constant/storageKey";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import {
  removeSelectedCar,
  setUserId,
  setVehicleId,
} from "@/redux/slice/CarSlice";
import {
  addDeferredTempInspectionPercentage,
  addDeferredTempMechanicPercentage,
  addTempInspectionPercentage,
  addTempMechanicPercentage,
  InspectionHour,
  InspectionPercentage,
  Labour,
  MechanicPercentage,
  Part,
  removeAllState,
  updateDeferredTempInspectionPercentage,
  updateDeferredTempMechanicPercentage,
  updateTempInspectionPercentage,
  updateTempMechanicPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import EstimateSidebar from "@/components/EstimateSidebar/EstimateSidebar";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { FaArrowUp } from "react-icons/fa";
import { convertToDecimalHour } from "@/utils/convertToDecimalHour ";
const generateDefaultTitle = () => {
  const randomId = Math.floor(10000 + Math.random() * 90000);
  return `E-${randomId}`;
};

type EstimateCreateProps = {
  createType?: string;
};

const EstimateCreate = ({ createType }: EstimateCreateProps) => {
  const query: Record<string, any> = {};
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isReset, setReset] = useState(false);
  const [page, setPage] = useState<number>();
  const [searchTermCar, setSearchTermCar] = useState<string>("");
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { userId, vehicleId } = useAppSelector((state) => state.carGroupInfo);
  const [parts, setParts] = useState<Part[]>([]);
  const [labours, setLabours] = useState<Labour[]>([]);
  const [mechanicPercentages, setMechanicPercentages] = useState<
    MechanicPercentage[]
  >([]);
  const [inspectionHours, setInspectionHours] = useState<InspectionHour[]>([]);
  const [technicianAssignEstimates, setTechnicianAssignEstimates] = useState<
    string[]
  >([]);
  const [inspectionPercentages, setInspectionPercentages] = useState<
    InspectionPercentage[]
  >([]);
  const {
    estimateConcernState,
    estimateInspectionState,
    estimateServiceState,
    authorization,
    estimateType,
  } = useAppSelector((state) => state.estimateItemShow);
  const {
    tempLabourTotalHours,
    tempLabourTotalAmount,
    tempInspectionTotalHours,
    tempInspectionTotalAmount,
    tempPartsTotalAmount,
    tempTotalAmount,
    tempTotalHours,
    tempPart,
    tempDeferredPart,
    tempLabour,
    tempDeferredLabour,
    tempInspectionHour,
    tempDeferredInspectionHour,
    tempInspectionPercentage,
    tempDeferredInspectionPercentage,
    tempMechanicPercentage,
    tempDeferredMechanicPercentage,
    estimateTechnician,
  } = useAppSelector((state) => state.serviceInspectionItem);
  const {titleEstimate} =useAppSelector((state) => state.estimateItemShow);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    if (
      estimateTechnician.length > 0 ||
      (estimateServiceState.length > 0 || estimateInspectionState.length > 0)
    ) {
      const ids = estimateTechnician.map((tech) => tech.id);
      setTechnicianAssignEstimates(ids);

      handleBulkTechnicianAssignment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateTechnician, estimateServiceState, estimateInspectionState]);

  //Assign technician to all assigned services and inspections
const [resetKey, setResetKey] = useState(0);
  const handleBulkTechnicianAssignment = () => {
    const dispatchToStore = (
      items: any[],
      isDeferred: boolean,
      isService: boolean
    ) => {
      items.forEach((item) => {
        const code = isService ? item.serviceCode : item.inspectionCode;

        const existingAssignments = isDeferred
          ? isService
            ? tempDeferredMechanicPercentage.filter(
                (m) => m.serviceCode === code
              )
            : tempDeferredInspectionPercentage.filter(
                (m) => m.inspectionCode === code
              )
          : isService
          ? tempMechanicPercentage.filter((m) => m.serviceCode === code)
          : tempInspectionPercentage.filter((m) => m.inspectionCode === code);

        const uniqueNewTechs = estimateTechnician.filter(
          (tech) => !existingAssignments.some((a) => a.id === tech.id)
        );

        const total = existingAssignments.length + uniqueNewTechs.length;
        const calculatedPercentage = `${(100 / total).toFixed(2)}%`;

        // Update old ones
        existingAssignments.forEach((m) => {
          const updated = { ...m, percentage: calculatedPercentage };
          if (isDeferred) {
            isService
              ? dispatch(updateDeferredTempMechanicPercentage(updated))
              : dispatch(updateDeferredTempInspectionPercentage(updated));
          } else {
            isService
              ? dispatch(updateTempMechanicPercentage(updated))
              : dispatch(updateTempInspectionPercentage(updated));
          }
        });

        // Add new ones
        uniqueNewTechs.forEach((tech) => {
          const newEntry = {
            id: tech.id,
            name: tech.name,
            percentage: calculatedPercentage,
            ...(isService
              ? {
                  serviceCode: code,
                  serviceStage: isDeferred ? "Deferred" : "Accept",
                }
              : {
                  inspectionCode: code,
                  inspectionStage: isDeferred ? "Deferred" : "Accept",
                }),
          };

          if (isDeferred) {
            isService
              ? dispatch(addDeferredTempMechanicPercentage(newEntry))
              : dispatch(addDeferredTempInspectionPercentage(newEntry));
          } else {
            isService
              ? dispatch(addTempMechanicPercentage(newEntry))
              : dispatch(addTempInspectionPercentage(newEntry));
          }
        });
      });
    };

    // 🚀 Assign to all services
    dispatchToStore(
      estimateServiceState.filter((s) => s.stage === "Accept"),
      false,
      true
    );
    dispatchToStore(
      estimateServiceState.filter((s) => s.stage === "Deferred"),
      true,
      true
    );

    // 🚀 Assign to all inspections
    dispatchToStore(
      estimateInspectionState.filter((i) => i.stage === "Accept"),
      false,
      false
    );
    dispatchToStore(
      estimateInspectionState.filter((i) => i.stage === "Deferred"),
      true,
      false
    );

    message.success(
      "Technicians assigned successfully to all services and inspections."
    );
  };


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
    dispatch(removeAllEstimateState());
    dispatch(setEstimateType(createType ?? "Estimate"))
  }, [dispatch]);

  useEffect(() => {
    setParts([...tempPart, ...tempDeferredPart]);
    setLabours([...tempLabour, ...tempDeferredLabour]);
    setMechanicPercentages([
      ...tempMechanicPercentage,
      ...tempDeferredMechanicPercentage,
    ]);
    setInspectionHours([...tempInspectionHour, ...tempDeferredInspectionHour]);
    setInspectionPercentages([
      ...tempInspectionPercentage,
      ...tempDeferredInspectionPercentage,
    ]);
  }, [
    tempPart,
    tempDeferredPart,
    tempLabour,
    tempDeferredLabour,
    tempInspectionHour,
    tempDeferredInspectionHour,
    tempInspectionPercentage,
    tempDeferredInspectionPercentage,
    tempMechanicPercentage,
    tempDeferredMechanicPercentage,
  ]);

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

  //Get Services, inspections and concerns for search bar
  const { data ,isLoading} = useGetServiceInspectionConcernAllDataQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const allData = data?.data;
  
   useEffect(() => {
     setResetKey(prev => prev + 1);
   }, [allData]);

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

  const [createEstimate] = useCreateEstimateMutation();


  // Set default title on first load
  useEffect(() => {
    const defaultTitle = generateDefaultTitle();
    dispatch(setTitleEstimate(defaultTitle))
    // setTitleValue(defaultTitle);
  }, [dispatch]);

  //Save estimate data to database
  const onSubmit = async () => {
    const {
      authorizationMedium,
      customerId,
      providerId,
      amount,
      authorizationStatus,
      note,
    } = authorization;

    const requiresAuthorization =
      authorizationMedium === "" ||
      customerId === "" ||
      providerId === "" ||
      amount === 0;

    let updatedEstimateServices = [...estimateServiceState];
    let updatedEstimateInspections = [...estimateInspectionState];
    let updatedParts = [...parts];
    let updatedLabours = [...labours];
    let updatedMechanicPercentages = [...mechanicPercentages];
    let updatedInspectionHours = [...inspectionHours];
    let updatedInspectionPercentages = [...inspectionPercentages];
    let updatedTempLabourTotalHours = tempLabourTotalHours;
    let updatedTempLabourTotalAmount = tempLabourTotalAmount;
    let updatedTempInspectionTotalHours = tempInspectionTotalHours;
    let updatedTempInspectionTotalAmount = tempInspectionTotalAmount;
    let updatedTempPartsTotalAmount = tempPartsTotalAmount;
    let updatedTempTotalAmount = tempTotalAmount;
    let updatedTempTotalHours = tempTotalHours;

    // if (requiresAuthorization) {
    //   const confirmed = await new Promise((resolve) => {
    //     Modal.confirm({
    //       title: "Warning",
    //       content:
    //         "If there is no authorization, then estimate will not convert to work order and accepted service and inspection will be deferred",
    //       okText: "Continue",
    //       cancelText: "Cancel",
    //       onOk: () => {
    //         type = "Estimate";

    //         updatedEstimateServices = estimateServiceState.map(
    //           (service, index) =>
    //             service.stage === "Accept"
    //               ? { ...service, stage: "Deferred" }
    //               : service
    //         );

    //         updatedEstimateInspections = estimateInspectionState.map(
    //           (inspection, index) =>
    //             inspection.stage === "Accept"
    //               ? { ...inspection, stage: "Deferred" }
    //               : inspection
    //         );

    //         updatedParts = parts.map((part, index) =>
    //           part.serviceStage === "Accept"
    //             ? { ...part, serviceStage: "Deferred" }
    //             : part
    //         );

    //         updatedLabours = labours.map((labour, index) =>
    //           labour.serviceStage === "Accept"
    //             ? { ...labour, serviceStage: "Deferred" }
    //             : labour
    //         );

    //         updatedMechanicPercentages = mechanicPercentages.map(
    //           (mechanicPercentage, index) =>
    //             mechanicPercentage.serviceStage === "Accept"
    //               ? { ...mechanicPercentage, serviceStage: "Deferred" }
    //               : mechanicPercentage
    //         );

    //         updatedInspectionHours = inspectionHours.map(
    //           (inspectionHour, index) =>
    //             inspectionHour.inspectionStage === "Accept"
    //               ? { ...inspectionHour, inspectionStage: "Deferred" }
    //               : inspectionHour
    //         );

    //         updatedInspectionPercentages = inspectionPercentages.map(
    //           (inspectionPercentage, index) =>
    //             inspectionPercentage.inspectionStage === "Accept"
    //               ? { ...inspectionPercentage, inspectionStage: "Deferred" }
    //               : inspectionPercentage
    //         );

    //         updatedTempLabourTotalHours = "0h:0min";
    //         updatedTempLabourTotalAmount = 0;
    //         updatedTempPartsTotalAmount = 0;
    //         updatedTempInspectionTotalHours = "0h:0min";
    //         updatedTempInspectionTotalAmount = 0;
    //         updatedTempTotalHours = "0h:0min";
    //         updatedTempTotalAmount = 0;

    //         updatedEstimateServices.forEach((service, index) => {
    //           if (service.stage === "Deferred") {
    //             dispatch(
    //               updateEstimateServiceStage({ index, stage: "Deferred" })
    //             );
    //             dispatch(switchServiceAcceptToDeferred(service.serviceCode));
    //           }
    //         });

    //         updatedEstimateInspections.forEach((inspection, index) => {
    //           if (inspection.stage === "Deferred") {
    //             dispatch(
    //               updateEstimateInspectionStage({ index, stage: "Deferred" })
    //             );
    //             dispatch(
    //               switchInspectionAcceptToDeferred(inspection.inspectionCode)
    //             );
    //           }
    //         });

    //         resolve(true);
    //       },
    //       onCancel: () => resolve(false),
    //     });
    //   });

    //   if (!confirmed) {
    //     return;
    //   }
    // } else {
    //   type = "WorkOrder";
    // }

    const authorizations = requiresAuthorization
      ? []
      : [
          {
            customerId,
            providerId,
            authorizationMedium,
            authorizationStatus,
            amount,
            note,
          },
        ];

    const customer = userId === "";

    const customers = customer
      ? []
      : [
          {
            userId,
          },
        ];

    const vehicle = vehicleId === "";

    const vehicles = vehicle
      ? []
      : [
          {
            vehicleId,
          },
        ];
    const { role, userId: estimateProviderId } = getUserInfo() as any;

    // 🔹 Include updated service & inspection states in data
    const data = {
      title:titleEstimate,
      type: estimateType,
      providerId: estimateProviderId,
      labourTotalHours: updatedTempLabourTotalHours,
      labourTotalAmount: updatedTempLabourTotalAmount,
      inspectionTotalHours: updatedTempInspectionTotalHours,
      inspectionTotalAmount: updatedTempInspectionTotalAmount,
      partsTotalAmount: updatedTempPartsTotalAmount,
      totalAmount: updatedTempTotalAmount,
      totalHours: updatedTempTotalHours,
      parts: updatedParts,
      labours: updatedLabours,
      inspectionHours: updatedInspectionHours,
      inspectionPercentages: updatedInspectionPercentages,
      mechanicPercentages: updatedMechanicPercentages,
      concerns: estimateConcernState,
      inspections: updatedEstimateInspections,
      services: updatedEstimateServices,
      customers: customers,
      vehicles: vehicles,
      authorizations,
      technicianAssignEstimates,
    };
    const key = "loadingKey";
    message.loading({ content: "Loading...", key });

    try {
      const response: any = await createEstimate({ data }).unwrap();
      message.success(`${estimateType} added successfully`);
      dispatch(setResetStatus(true));

      removeUserInfo(estimateCreate);
      dispatch(removeAllEstimateConcernItems());
      dispatch(removeAllEstimateInspectionItems());
      dispatch(removeAllEstimateServiceItems());
      dispatch(clearAllSelection());
      dispatch(setUserId(""));
      dispatch(setVehicleId(""));
      dispatch(removeSelectedCar());
      dispatch(removeAllState());
      setSearchTermCar("");
      const defaultTitle = generateDefaultTitle();
      dispatch(setTitleEstimate(defaultTitle))
      setReset(true);
      dispatch(assignConcernHandleControllerForMultiple(false));
      dispatch(assignServiceHandleControllerForMultiple(false));
      dispatch(assignInspectionHandleControllerForMultiple(false));
      dispatch(removeSearchRelatedServiceInspection())
      setResetKey(prev => prev + 1);
      message.destroy(key);
    } catch (error: any) {
      message.error(`Failed to add estimate. ${error?.data?.message}`);
      message.destroy(key);
      setResetKey(prev => prev + 1);
      dispatch(clearResetStatus());
    }
  };

  // Fetch cars based on the search term



  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

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


const handleScrollToTop = () => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const [openDrawer, setOpenDrawer] = useState(false);
const showDrawer = () => setOpenDrawer(true)
const closeDrawer = () =>setOpenDrawer(false)
  return (
    <div className="w-full mx-auto relative">
      <div className="flex justify-between gap-5 px-2 relative">
        <div 
       className="w-full lg:w-[70%] scrollbar-hide overflow-y-auto h-[calc(100vh)]" ref={scrollContainerRef} 
   >
          <div className="estimate-sticky-header">
            <div className="flex items-center gap-2 ">
          {/* ADD Button with Plus Icon */}
          <Button
            type="primary"
             size="small" 
            onClick={onSubmit}
            icon={<PlusOutlined className="font-bold text-md" />}
            className="flex rounded items-center px-8 gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
          >
            ADD
          </Button>
        
          {/* Scroll to Top Button with Arrow Icon */}
          <button
                 onClick={handleScrollToTop}
                 className="bg-neutral-800 text-white font-bold px-2 py-[5px] rounded  hover:bg-neutral-700 cursor-pointer border-none outline-none flex items-center justify-center "
               >
                 <FaArrowUp className="text-md" />
               </button>
                 </div>
          </div>

          {/* <div className="mt-3 mb-1">
            Featured Service / Inspection / Concern
          </div> */}
          {/* Features */}
           {/* <div className="bg-[#F9F9F9]  p-2 rounded h-60 scroll-smooth overflow-auto scrollbar-hide">
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
          </div>  */}
          {/* Search Input */}
          <div >
            <label>Search for Service / Inspection / Concern</label>
            <div className="flex items-center">
              <SearchInput
                placeholder="Search..."
                size="large"
                resetFilters={resetFilters}
              />
            </div>
          </div>
          {/* Search Item show */}
          <SearchItemShow  data={allData}  type={false} isLoading={isLoading} page="estimate"resetKey={resetKey} />
          {/* Search assign items show */}
          <SearchAssignConcernShow title={`Concerns`} style={false} />
          <SearchAssignServiceShow title={`Services`} style={false} />
          <SearchAssignInspectionShow title={`Inspections`} style={false} />

          <div className="mb-3 px-2">
            <div className=" bg-white rounded  border border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-1">
                Summary of Charges
              </h4>

              <div className="space-y-1">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Inspection Hours:</span>
                  <span className="text-blue-600 font-medium">
                    {convertToDecimalHour(tempInspectionTotalHours)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Labour Hours:</span>
                  <span className="text-blue-600 font-medium">
                    {convertToDecimalHour(tempLabourTotalHours)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Inspection Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${tempInspectionTotalAmount}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Labour Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${tempLabourTotalAmount}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Parts Amount:</span>
                  <span className="text-blue-600 font-medium">
                    ${tempPartsTotalAmount}
                  </span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-sm font-semibold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-green-600">${tempTotalAmount}</span>
                </div>

                <div className="flex  text-sm justify-between font-semibold text-gray-800">
                  <span>Total Hours:</span>
                  <span className="text-green-600">{convertToDecimalHour(tempTotalHours)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* estimate sidebar */}
         <div className="hidden lg:block w-[30%] mt-3 overflow-y-auto h-[calc(100vh-60px)] scrollbar-hide">
      <EstimateSidebar  createType={createType}pageType={'createEstimate'} />
    </div>
      </div>
       <div className="lg:hidden absolute top-2 right-2 z-50">
    <Button
      type="primary"
      icon={<MenuOutlined />}
      onClick={showDrawer}
      className="bg-[#2E2E2E] hover:bg-neutral-700"
    />
  </div>

  {/* Drawer for Tab/Mobile */}
  <Drawer
    title="Estimate Sidebar"
    placement="right"
    closable={true}
    onClose={closeDrawer}
    open={openDrawer}
    width={300}
  >
    <EstimateSidebar createType={createType} pageType={'createEstimate'} />
  </Drawer>
    </div>
  );
};

export default EstimateCreate;
