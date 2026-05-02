"use client";

import React from "react";
import { CloseCircleFilled, EditFilled } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeInspectionGeneralItem,
  removeInspectionItem,
  removeInspectionTireItem,
  removeServiceItem,
  updateInspectionType,
  updateServiceType,
} from "@/redux/slice/searchItemShowSlice";
import {
  removeEstimateConcernItem,
  removeEstimateInspectionItem,
  removeEstimateServiceItem,
  updateEstimateConcernItem,
  updateEstimateInspectionItem,
  updateEstimateInspectionStage,
  updateEstimateServiceItem,
  updateEstimateServiceStage,
} from "@/redux/slice/estimateItemShowSlice";
import {
  setCheckboxState,
  setRadioState,
  setSelectedStage,
  setSelectedType,
} from "@/redux/slice/selectionSlice";
import {
  removeContactAppointment,
  removeEstimateAppointment,
  removeServiceAppointment,
} from "@/redux/slice/appointmentSlice";
import ServiceItem from "../ServiceItem/ServiceItem";
import InspectionItem from "../inspectionItem/inspectionItem";
import RelatedServices from "../RelatedServices/RelatedServices";
import {
  switchInspectionAcceptToDeferred,
  switchServiceAcceptToDeferred,
  switchServiceDeferredToAccept,
  switchInspectionDeferredToAccept,
} from "@/redux/slice/serviceInspectionItemSlice";
import RelatedServicesInspections from "../RelatedServicesInspections/RelatedServicesInspections";
import { Button } from "antd";
import SearchRelatedServicesInspections from "../RelatedServicesInspections/SearchRelatedServicesInspections";

const SearchAssignItemCard = ({
  item,
  index,
  page,
}: {
  item: any;
  index: number;
  page?: string;
}) => {
  const dispatch = useAppDispatch();
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

  const {
    serviceState,
    inspectionState,
    inspectionGeneralItemState,
    inspectiontireItemState,
  } = useAppSelector((state) => state.searchItemShow);
  const {
    estimateConcernState,
    estimateServiceState,
    estimateInspectionState,
  } = useAppSelector((state) => state.estimateItemShow);

  const { serviceState: appointmentServiceState, contactState } =
    useAppSelector((state) => state.appointmentItemShow);

  const handleDeleteSpecificService = (serviceCode: string) => {
    dispatch(removeServiceItem(serviceCode));
    dispatch(setCheckboxState({ code: serviceCode, checked: false }));
    dispatch(setRadioState({ code: serviceCode, value: "" }));
    dispatch(setSelectedType({ code: serviceCode, type: "" }));
  };

  const handleDeleteSpecificInspection = (inspectionCode: string) => {
    dispatch(removeInspectionItem(inspectionCode));
    dispatch(setCheckboxState({ code: inspectionCode, checked: false }));
    dispatch(setRadioState({ code: inspectionCode, value: "" }));
  };

  const handleDeleteSpecificGeneral = (generalCode: string) => {
    dispatch(removeInspectionGeneralItem(generalCode));
    dispatch(setCheckboxState({ code: generalCode, checked: false }));
    dispatch(setRadioState({ code: generalCode, value: "" }));
  };

  const handleDeleteSpecificTire = (tireCode: string) => {
    dispatch(removeInspectionTireItem(tireCode));
    dispatch(setCheckboxState({ code: tireCode, checked: false }));
    dispatch(setRadioState({ code: tireCode, value: "" }));
  };

  const handleDeleteSpecificEstimateConcern = (concernCode: string) => {
    dispatch(removeEstimateConcernItem(concernCode));
    dispatch(setCheckboxState({ code: concernCode, checked: false }));
  };

  const handleDeleteSpecificEstimateInspection = (inspectionCode: string) => {
    dispatch(removeEstimateInspectionItem(inspectionCode));
    dispatch(switchInspectionAcceptToDeferred(inspectionCode));
    dispatch(setCheckboxState({ code: inspectionCode, checked: false }));
    dispatch(setRadioState({ code: inspectionCode, value: "Accept" }));
    dispatch(setSelectedStage({ code: inspectionCode, stage: "Accept" }));
  };

  const handleDeleteSpecificEstimateService = (serviceCode: string) => {
    dispatch(removeEstimateServiceItem(serviceCode));
    dispatch(switchServiceAcceptToDeferred(serviceCode));
    dispatch(setCheckboxState({ code: serviceCode, checked: false }));
    dispatch(setRadioState({ code: serviceCode, value: "Accept" }));
    dispatch(setSelectedStage({ code: serviceCode, stage: "Accept" }));
  };

  const handleDeleteSpecificAppointmentService = (serviceCode: string) => {
    dispatch(removeServiceAppointment(serviceCode));
    dispatch(setCheckboxState({ code: serviceCode, checked: false }));
  };

  const handleDeleteSpecificAppointmentContact = (
    userId: string,
    code: string
  ) => {
    dispatch(removeContactAppointment(userId));
    dispatch(removeEstimateAppointment(userId));
    dispatch(setCheckboxState({ code: code, checked: false }));
  };

  const handleSave = () => {
    const { code, title, description, type } = changeItem;

    // Determine the type by matching the code prefix or some property
    if (type === "Service") {
      dispatch(
        updateEstimateServiceItem({ serviceCode: code, title, description })
      );
    } else if (type === "Inspection") {
      dispatch(
        updateEstimateInspectionItem({
          inspectionCode: code,
          title,
          description,
        })
      );
    } else if (type === "Concern") {
      dispatch(
        updateEstimateConcernItem({ concernCode: code, title, description })
      );
    }

    // Reset active state
    setIsActive({ code: "", active: false });
  };

  return (
    <div
      key={item?.code}
      className="relative related-card-container"
    >
      {/* Close Button */}
      {(serviceState?.length > 0 || inspectionState?.length > 0) && (
        <div className="flex justify-between items-center p-2 absolute top-0 right-0 ">
          <div></div>
          <CloseCircleFilled
            className="text-lg text-red-600 rounded cursor-pointer hover:text-red-800"
            onClick={() =>
              item?.serviceCode
                ? handleDeleteSpecificService(item.serviceCode)
                : handleDeleteSpecificInspection(item.inspectionCode)
            }
          />
        </div>
      )}
      {(inspectionGeneralItemState?.length > 0 ||
        inspectiontireItemState?.length > 0) && (
        <div className="flex justify-between items-center mb-3 absolute top-0 right-0 p-2">
          <div></div>
          <CloseCircleFilled
            className="text-lg text-red-600 rounded cursor-pointer hover:text-red-800"
            onClick={() =>
              item?.tireCode
                ? handleDeleteSpecificTire(item.tireCode)
                : handleDeleteSpecificGeneral(item.generalCode)
            }
          />
        </div>
      )}

      {(estimateServiceState?.length > 0 ||
        estimateInspectionState?.length > 0 ||
        estimateConcernState?.length > 0) && (
        <div className="flex justify-between items-center mb-3">
          <div></div>
          <CloseCircleFilled
            className="text-lg absolute top-0 p-2 right-0 text-red-600 rounded cursor-pointer hover:text-red-800"
            onClick={() =>
              item?.serviceCode
                ? handleDeleteSpecificEstimateService(item.serviceCode)
                : item?.inspectionCode
                ? handleDeleteSpecificEstimateInspection(item.inspectionCode)
                : handleDeleteSpecificEstimateConcern(item.concernCode)
            }
          />
        </div>
      )}

      {(appointmentServiceState?.length > 0 || contactState?.length > 0) && (
        <div className="flex justify-between items-center p-2 absolute top-0 right-0">
          <div></div>
          <CloseCircleFilled
            className="text-lg text-red-600 rounded cursor-pointer hover:text-red-800"
            onClick={() =>
              item?.serviceCode
                ? handleDeleteSpecificAppointmentService(item.serviceCode)
                : item?.userId &&
                  handleDeleteSpecificAppointmentContact(item.userId, item.code)
            }
          />
        </div>
      )}

      {/* Input and Checkbox Options */}
      {page !== "inspection-group" && (
        <>
          {(serviceState?.length > 0 || inspectionState?.length > 0) && (
            <div>
              <div className="flex mr-6 sm:mr-0 gap-1 items-center">
                <div>
                  <input
                    type="text"
                    id="code"
                    value={item?.title}
                    disabled
                    placeholder="Enter your code"
                    className="w-full bg-transparent border-none outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item?.type === "Required"}
                    className="cursor-pointer"
                    onChange={() => {
                      if (item?.serviceCode) {
                        dispatch(
                          updateServiceType({
                            code: item.serviceCode,
                            type: "Required",
                          })
                        );

                        dispatch(
                          setRadioState({
                            code: item.serviceCode,
                            value: "Required",
                          })
                        );
                      } else {
                        dispatch(
                          updateInspectionType({
                            code: item.inspectionCode,
                            type: "Required",
                          })
                        );
                        dispatch(
                          setRadioState({
                            code: item.inspectionCode,
                            value: "Required",
                          })
                        );
                      }
                    }}
                  />
                  <label className="font-medium">Required</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item?.type === "Recommended"}
                    className="cursor-pointer"
                    onChange={() => {
                      if (item?.serviceCode) {
                        dispatch(
                          updateServiceType({
                            code: item.serviceCode,
                            type: "Recommended",
                          })
                        );

                        dispatch(
                          setRadioState({
                            code: item.serviceCode,
                            value: "Recommended",
                          })
                        );
                      } else {
                        dispatch(
                          updateInspectionType({
                            code: item.inspectionCode,
                            type: "Recommended",
                          })
                        );
                        dispatch(
                          setRadioState({
                            code: item.inspectionCode,
                            value: "Recommended",
                          })
                        );
                      }
                    }}
                  />
                  <label className="font-medium">Recommended</label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {page === "inspection-group" && (
        <>
          {(serviceState?.length > 0 || inspectionState?.length > 0) && (
            <div>
              <div className="flex justify-start items-center">
                <div>
                  <input
                    type="text"
                    id="code"
                    value={item?.title}
                    disabled
                    placeholder="Enter your code"
                    className="w-full bg-transparent border-none outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {(estimateServiceState?.length > 0 ||
        estimateInspectionState?.length > 0 ||
        estimateConcernState.length > 0) && (
        <div>
          <div >
            <div className=" my-2 flex justify-center">
              {item?.stage && (
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item?.stage === "Accept"}
                      className="cursor-pointer"
                      onChange={() => {
                        if(item?.serviceCode) {
                              dispatch(
                                updateEstimateServiceStage({
                                  index,
                                  stage: "Accept",
                                })
                              );
                               dispatch(
                              setRadioState({ code: item.serviceCode, value: "Accept" })
                              );
                              dispatch(
                                switchServiceDeferredToAccept(item?.serviceCode)
                              );
                            }
                           else {
                              dispatch(
                                updateEstimateInspectionStage({
                                  index,
                                  stage: "Accept",
                                })
                              );
                              dispatch(setRadioState({ code: item?.inspectionCode, value: "Accept" }))
                              dispatch(
                                switchInspectionDeferredToAccept(
                                  item?.inspectionCode
                                )
                              );
                           
                            }
                      }}
                    />
                    <label className="font-medium">Accept</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item?.stage === "Deferred"}
                      className="cursor-pointer"
                      onChange={() => {
                        if(item?.serviceCode){
                              dispatch(
                                updateEstimateServiceStage({
                                  index,
                                  stage: "Deferred",
                                })
                              );
                              dispatch(setRadioState({ code: item.serviceCode, value: "Deferred" }))
                              dispatch(
                                switchServiceAcceptToDeferred(item?.serviceCode)
                              );
                            }
                            else {
                              dispatch(setRadioState({ code: item.inspectionCode, value: "Deferred" }))
                              dispatch(
                                updateEstimateInspectionStage({
                                  index,
                                  stage: "Deferred",
                                })
                              );
                              dispatch(
                                switchInspectionAcceptToDeferred(
                                  item?.inspectionCode
                                )
                              );
                            };
                      }}
                    />
                    <label className="font-medium">Deferred</label>
                  </div>
                </div>
              )}
            </div>
            <div className="border-solid border  flex items-center justify-between gap-2  border-gray-200   p-3 rounded-md bg-white">
              <div  className="w-full" >
              <div className={`${(isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode)?'':'flex justify-start  gap-2 items-start'}`}>
                <p>Title:</p>
                <input
                  type="text"
                  id="code"
                  value={
                    isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode
                      ? changeItem.title
                      : item?.title || ""
                  }
                   disabled={
                    isActive.code !== item.serviceCode &&
                    isActive.code !== item.inspectionCode &&
                    isActive.code !== item.concernCode
                  }
                  onChange={(e) =>
                    setChangeItem({
                      ...changeItem,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter your title"
                  className={`${(isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode)?'w-full px-3 py-2 border border-solid border-gray-200 rounded focus:outline-none  text-gray-700 ':'border-none outline-none bg-transparent'}`}
                />
              </div>
              <div
              className={`${
                (isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode)
                  ? ""
                  : "flex justify-start gap-2 items-start w-full"
              }`}
            >
              <p>Description:</p>
              <textarea
              id="code"
              value={
                    isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode
                      ? changeItem.description
                      : item?.description || ""
                  }
                  disabled={
                    isActive.code !== item.serviceCode &&
                    isActive.code !== item.inspectionCode &&
                    isActive.code !== item.concernCode
                  }
                  onChange={(e) =>
                    setChangeItem({
                      ...changeItem,
                      description: e.target.value,
                    })
                  }
              placeholder="Enter your description"
              className={`${
               (isActive.code === item.serviceCode ||
                    isActive.code === item.inspectionCode ||
                    isActive.code === item.concernCode)
                  ? "w-full px-3 py-2 border border-solid border-gray-200 rounded focus:outline-none text-gray-700 resize-none overflow-y-scroll scrollbar-hide"
                  : "border-none w-full outline-none bg-transparent resize-none overflow-y-scroll scrollbar-hide"
              }`}
              rows={1}
            />
            
            </div>

              </div>
              <div>

               <div className={`flex justify-between items-start `}>
                              <div></div>
                              <div>
                                {isActive.active ? (
                                  <Button onClick={handleSave}>Save</Button>
                                ) : (
                                  <Button
                      onClick={() => {
                        setIsActive({
                          code:
                            item.serviceCode ||
                            item.inspectionCode ||
                            item.concernCode,
                          active: true,
                        });
                        setChangeItem({
                          code:
                            item.serviceCode ||
                            item.inspectionCode ||
                            item.concernCode,
                          type:
                            (item.serviceCode && "Service") ||
                            (item.inspectionCode && "Inspection") ||
                            (item.concernCode && "Concern"),
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
          </div>
          {item?.serviceCode && (
            <ServiceItem
              serviceCode={item?.serviceCode}
              item="part"
              stage={item?.stage}
            />
          )}
          {item?.serviceCode && (
            <ServiceItem
              serviceCode={item?.serviceCode}
              item="labour"
              stage={item?.stage}
            />
          )}
          {item?.serviceCode && (
            <ServiceItem
              serviceCode={item?.serviceCode}
              item="mechanicPercentage"
              stage={item?.stage}
            />
          )}
          {item?.inspectionCode && (
            <InspectionItem
              inspectionCode={item?.inspectionCode}
              item="inspectionHour"
              stage={item?.stage}
            />
          )}
          {item?.inspectionCode && (
            <InspectionItem
              inspectionCode={item?.inspectionCode}
              item="inspectionPercentage"
              stage={item?.stage}
            />
          )}
          {/* {item?.concernCode && <RelatedServices items={item?.services} />} */}
          {page === "service-advisor" && item?.concernCode && (
            <RelatedServicesInspections
              code={{ concernCode: item.concernCode }}
            />
          )}
          {page === "estimate" && item?.concernCode && (
            <RelatedServicesInspections
              code={{ concernCode: item.concernCode }}
            />
          )}
          {page === "service-advisor" && item?.serviceCode && (
            <RelatedServicesInspections
              code={{ serviceCode: item.serviceCode }}
              page={"service-advisor"}
            />
          )}
          {page === "estimate" && item?.serviceCode && (
            <RelatedServicesInspections
              code={{ serviceCode: item.serviceCode }}
            />
          )}
        </div>
      )}
      {(appointmentServiceState?.length > 0 || contactState?.length > 0) && (
        <div className="flex justify-start items-center">
          <div>
            <input
              type="text"
              id="code"
              value={item?.title ? item.title : item.name}
              disabled
              placeholder="Enter your code"
              className="w-full border-none outline-none bg-transparent px-3 py-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 bg-gray-100 text-gray-700"
            />
          </div>
        </div>
      )}
      {(inspectionGeneralItemState?.length > 0 ||
        inspectiontireItemState?.length > 0) && (
        <div className="flex justify-start items-center">
          <div>
            <input
              type="text"
              id="code"
              value={item?.title ? item.title : item.name}
              disabled
              placeholder="Enter your code"
              className="w-full border-none outline-none 
              "
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAssignItemCard;
