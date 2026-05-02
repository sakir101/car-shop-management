"use client";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addContactAppointment,
  addEstimateAppointment,
  addEstimateCode,
  addServiceAppointment,
  removeAllEstimateAppointment,
} from "@/redux/slice/appointmentSlice";
import {
  addEstimateConcernItem,
  addEstimateInspectionItem,
  addEstimateServiceItem,
  assignConcernHandleControllerForMultiple,
  assignInspectionHandleControllerForMultiple,
  assignServiceHandleControllerForMultiple,
  removeEstimateConcernItem,
  removeEstimateInspectionItem,
  removeEstimateServiceItem,
} from "@/redux/slice/estimateItemShowSlice";
import {
  addInspectionGeneralItem,
  addInspectionItem,
  addInspectionTireItem,
  addServiceItem,
  assignInspectionGeneralHandleController,
  assignInspectionHandleController,
  assignServiceHandleController,
  removeInspectionGeneralItem,
  removeInspectionItem,
  removeInspectionTireItem,
  removeServiceItem,
  updateInspectionType,
  updateServiceType,
} from "@/redux/slice/searchItemShowSlice";
import {
  clearCheckboxState,
  setCheckboxState,
  setRadioState,
  setSelectedStage,
  setSelectedType,
} from "@/redux/slice/selectionSlice";

import { message } from "antd";
import React, { useEffect } from "react";
import SearchRelatedServicesInspections from "../RelatedServicesInspections/SearchRelatedServicesInspections";
import {
  switchInspectionAcceptToDeferred,
  switchServiceAcceptToDeferred,
} from "@/redux/slice/serviceInspectionItemSlice";
import { checkInvoiceAccess } from "@/utils/InvoiceAccessCheck";
import { getUserInfo } from "@/services/auth.service";

// Define types for props

const SearchCard = ({
  item,
  type,
  page,
  operation,
}: {
  item: any;
  type: boolean;
  page?: string;
  operation?: string;
}) => {
  const dispatch = useAppDispatch();
  const { role } = getUserInfo() as any;
   const {
    estimateType,
  } = useAppSelector((state) => state.estimateItemShow);
  const { checkboxStates, radioStates, selectedStages, selectedTypes } =
    useAppSelector((state) => state.selection);
  const {
    searchRelatedService,
    searchRelatedInspection,
  } = useAppSelector((state) => state.estimateItemShow);

  const handleSelection = (
    code: string,
    title: string,
    selectedType: string,
    category: "Service" | "Inspection"
  ) => {
    dispatch(setSelectedType({ code, type: selectedType }));
  };

  const handleDeleteSpecificServiceInspection = (
    code: string,
    type: string
  ) => {
    if (type === "Service") {
      dispatch(removeServiceItem(code));
    } else {
      dispatch(removeInspectionItem(code));
    }
    dispatch(setCheckboxState({ code: code, checked: false }));
    dispatch(setRadioState({ code: code, value: "" }));
    dispatch(setSelectedType({ code: code, type: "" }));
  };

  // delete estimate service inspection concern
  const handleDeleteEstimateSpecificServiceInspectionConcern = (
    code: string,
    type: string
  ) => {
    if (type === "Service") {
      dispatch(removeEstimateServiceItem(code));
      dispatch(switchServiceAcceptToDeferred(code));
    } else if (type === "Inspection") {
      dispatch(removeEstimateInspectionItem(code));
      dispatch(switchInspectionAcceptToDeferred(code));
    } else {
      dispatch(removeEstimateConcernItem(code));
    }
    dispatch(setCheckboxState({ code: code, checked: false }));
    dispatch(setRadioState({ code: code, value: "Accept" }));
    dispatch(setSelectedStage({ code: code, stage: "Accept" }));
  };

  const handleDeleteSpecificGeneralTire = (code: string) => {
    if (code?.startsWith("Gen")) {
      dispatch(removeInspectionGeneralItem(code));
    } else {
      dispatch(removeInspectionTireItem(code));
    }
    dispatch(setCheckboxState({ code: code, checked: false }));
    dispatch(setRadioState({ code: code, value: "" }));
  };

  const handleCheckboxChange = (
    code: string,
    title: string,
    category: "Service" | "Inspection"
  ) => {
    const selectedType = selectedTypes[code];

    if (page !== "inspection-group" && page !== "inspection-item") {
      if (!selectedType) {
        message.error(
          "Please select either 'Required' or 'Recommended' before adding."
        );
        return;
      }
    }
    if (category === "Service") {
      dispatch(
        addServiceItem({
          serviceCode: code,
          title,
          type: selectedType,
        })
      );
      dispatch(assignServiceHandleController(true));
    } else if (category === "Inspection") {
      dispatch(
        addInspectionItem({
          inspectionCode: code,
          title,
          type: selectedType,
        })
      );
      dispatch(assignInspectionHandleController(true));
    }
    dispatch(setCheckboxState({ code, checked: true }));
  };
  const handleInspectionItemCheckboxChange = (
    code: string,
    name: string,
    category: "general" | "tire"
  ) => {
    if (category === "general") {
      dispatch(
        addInspectionGeneralItem({
          generalCode: code,
          name,
          type: category,
        })
      );
      dispatch(assignInspectionGeneralHandleController(true));
    } else if (category === "tire") {
      dispatch(
        addInspectionTireItem({
          tireCode: code,
          name,
          type: category,
        })
      );
      dispatch(assignInspectionGeneralHandleController(true));
    }
    dispatch(setCheckboxState({ code, checked: true }));
  };

  const handleEstimateCheckboxChange = (
    code: string,
    title: string,
    description: string,
    category: "Service" | "Inspection"
  ) => {
    const selectedStage = selectedStages[code];

    if (!selectedStage) {
      message.error(
        "Please select either 'Accept' or 'Deferred' before adding."
      );
      return;
    }

    if (category === "Service") {
      dispatch(
        addEstimateServiceItem({
          serviceCode: code,
          title,
          description,
          stage: selectedStage,
        })
      );
    } else if (category === "Inspection") {
      dispatch(
        addEstimateInspectionItem({
          inspectionCode: code,
          title,
          description,
          stage: selectedStage,
        })
      );
      dispatch(assignInspectionHandleControllerForMultiple(true));
    }
    dispatch(setCheckboxState({ code, checked: true }));
  };

  const handleEstimateConcernCheckboxChange = (
    code: string,
    title: string,
    description: string
  ) => {
    dispatch(addEstimateConcernItem({ concernCode: code, title, description }));
    dispatch(setCheckboxState({ code, checked: true }));
    dispatch(assignConcernHandleControllerForMultiple(true));
  };

  const handleAddRelatedServicesInspectionsToEstimate = (
    code: string,
    type: string
  ) => {
    let filteredInspections: any = [];
    let filteredServices: any = [];

    if (type === "Concern" && code) {
      filteredInspections = searchRelatedInspection.filter(
        (item) => item.parentCode === code && item.parentType === "Concern"
      );

      if (filteredInspections.length > 0) {
        filteredInspections.forEach((inspection: any) => {
          if (inspection.stage !== "") {
            dispatch(
              addEstimateInspectionItem({
                inspectionCode: inspection.childCode,
                title: inspection.childTitle,
                description: inspection.childDescription,
                stage: inspection.stage,
              })
            );
          }
          dispatch(
            setCheckboxState({ code: inspection.childCode, checked: true })
          );
        });
      }
      if (filteredInspections.length > 0) {
        dispatch(assignInspectionHandleControllerForMultiple(true));
      }

      // for service
      filteredServices = searchRelatedService.filter(
        (item) => item.parentCode === code && item.parentType === "Concern"
      );

      if (filteredServices.length > 0) {
        filteredServices.forEach((service: any) => {
          if (service.stage !== "") {
            dispatch(
              addEstimateServiceItem({
                serviceCode: service.childCode,
                title: service.childTitle,
                description: service.childDescription,
                stage: service.stage,
              })
            );
          }
          dispatch(
            setCheckboxState({ code: service.childCode, checked: true })
          );
        });
      }
      if (filteredServices?.length > 0) {
        dispatch(assignServiceHandleControllerForMultiple(true));
      }
    } else if (type === "Service" && code) {
      const selectedStage = selectedStages[code];
      if (!selectedStage) {
        return;
      }
      // for inspection
      filteredInspections = searchRelatedInspection.filter(
        (item) => item.parentCode === code && item.parentType === "Service"
      );

      if (filteredInspections.length > 0) {
        filteredInspections.forEach((inspection: any) => {
          if (inspection.stage !== "") {
            dispatch(
              addEstimateInspectionItem({
                inspectionCode: inspection.childCode,
                title: inspection.childTitle,
                description: inspection.childDescription,
                stage: inspection.stage,
              })
            );
          }
          dispatch(
            setCheckboxState({ code: inspection.childCode, checked: true })
          );
        });
      }
      if (filteredInspections.length > 0) {
        dispatch(assignInspectionHandleControllerForMultiple(true));
      }

      //  for service
      filteredServices = searchRelatedService.filter(
        (item) =>
          (item.parentCode === code &&
            item.parentType === "Service" &&
            item.stage === "Accept") ||
          item.stage === "Deferred"
      );

      if (filteredServices.length > 0) {
        filteredServices.forEach((service: any) => {
          if (service.stage !== "") {
            dispatch(
              addEstimateServiceItem({
                serviceCode: service.childCode,
                title: service.childTitle,
                description: service.childDescription,
                stage: service.stage,
              })
            );
          }
          dispatch(
            setCheckboxState({ code: service.childCode, checked: true })
          );
        });
      }

      dispatch(assignServiceHandleControllerForMultiple(true));
    }
    return;
  };

  const handleAppointmentServiceCheckboxChange = (
    code: string,
    title: string
  ) => {
    dispatch(addServiceAppointment({ serviceCode: code, title }));
    dispatch(setCheckboxState({ code, checked: true }));
  };
  const handleAppointmentEstimateCheckboxChange = (
    code: string,
    title: string,
    status:string,
  ) => {
    dispatch(clearCheckboxState())
    dispatch(removeAllEstimateAppointment())
    dispatch(
      addEstimateAppointment({
        estimateCode: code,
        title,
        status
      })
    );
    dispatch(addEstimateCode(code));
    // dispatch(addContactAppointment({ userId: id, name, contactNum, code }));
    dispatch(setCheckboxState({ code: code, checked: true }));
  };

  const handleAppointmentContactCheckboxChange = (
    id: string,
    name: string,
    contactNum: string
  ) => {
    dispatch(addContactAppointment({ userId: id, name, contactNum }));
    dispatch(setCheckboxState({ code: id, checked: true }));
  };

  const handleServiceAdvisorCheckboxChange = (
    code: string,
    title: string,
    description: string
  ) => {
    const selectedStage = selectedStages[code];

    if (!selectedStage) {
      message.error(
        "Please select either 'Accept' or 'Deferred' before adding."
      );
      return;
    }
    dispatch(
      addEstimateServiceItem({
        serviceCode: code,
        title,
        description,
        stage: selectedStage,
      })
    );
    dispatch(setCheckboxState({ code, checked: true }));
  };

  return (
    <div
      key={item.code}
      className=" relative bg-white p-2 mb-2 rounded-md w-full"
    >
      <div className="flex justify-between absolute right-0 top-0">
        <div></div>
        <div className="flex items-center">
          <div className="me-3">
            <p>{item.type}</p>
            {page === "appointment" && !item.type && <p>User</p>}
          </div>
          {type === true &&
            (page === "inspection-item" ? (
              <div>
                {/* <input
                  type="checkbox"
                  name={`selection-${item.code}`}
                  className="cursor-pointer"
                  checked={checkboxStates[item.code] || false}
                  onChange={() =>
                    handleInspectionItemCheckboxChange(
                      item.code,
                      item.name,
                      item.type
                    )
                  }
                /> */}
                {operation ? (
                  <PlusCircleOutlined
                    onClick={() =>
                      handleInspectionItemCheckboxChange(
                        item.code,
                        item.name,
                        item.type
                      )
                    }
                    className="w-7 h-7 text-sm text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : !checkboxStates[item.code] ? (
                  <PlusCircleOutlined
                    onClick={() =>
                      handleInspectionItemCheckboxChange(
                        item.code,
                        item.name,
                        item.type
                      )
                    }
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : (
                  <DeleteOutlined
                    onClick={() => handleDeleteSpecificGeneralTire(item.code)}
                    className="w-7 h-7 text-lg text-red-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Remove"
                  />
                )}
              </div>
            ) : (
              <div>
                {operation ? (
                  <PlusCircleOutlined
                    onClick={() =>
                      handleCheckboxChange(item.code, item.title, item.type)
                    }
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : !checkboxStates[item.code] ? (
                  <PlusCircleOutlined
                    onClick={() =>
                      handleCheckboxChange(item.code, item.title, item.type)
                    }
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : (
                  <DeleteOutlined
                    onClick={() =>
                      handleDeleteSpecificServiceInspection(
                        item.code,
                        item.type
                      )
                    }
                    className="w-7 h-7 text-lg text-red-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Remove"
                  />
                )}
              </div>
            ))}

          {/* for estimate select icon */}
          {page === "estimate" &&
          type === false &&
          (item.type === "Service" || item.type === "Inspection") ? (
            <div>
              <div>
                {operation ? (
                  <PlusCircleOutlined
                    onClick={() => {
                      if (!checkInvoiceAccess(role, estimateType)) return;
                      handleEstimateCheckboxChange(
                        item.code,
                        item.title,
                        item.description,
                        item.type
                      );
                      handleAddRelatedServicesInspectionsToEstimate(
                        item.code,
                        item.type
                      );
                    }}
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : !checkboxStates[item.code] ? (
                  <PlusCircleOutlined
                    onClick={() => {
                      handleEstimateCheckboxChange(
                        item.code,
                        item.title,
                        item.description,
                        item.type
                      );
                      handleAddRelatedServicesInspectionsToEstimate(
                        item.code,
                        item.type
                      );
                    }}
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
                ) : (
                  <DeleteOutlined
                    onClick={() =>
                      handleDeleteEstimateSpecificServiceInspectionConcern(
                        item.code,
                        item.type
                      )
                    }
                    className="w-7 h-7 text-lg text-red-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Remove"
                  />
                )}
              </div>
            </div>
          ) : (
            item.type === "Concern" && (
              <div>
                <div>
                  {operation ? (
                    <PlusCircleOutlined
                      onClick={() => {
                         if (!checkInvoiceAccess(role, estimateType)) return;
                        handleEstimateConcernCheckboxChange(
                          item.code,
                          item.title,
                          item.description
                        );
                        handleAddRelatedServicesInspectionsToEstimate(
                          item.code,
                          item.type
                        );
                      }}
                      className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                      title="Add"
                    />
                  ) : !checkboxStates[item.code] ? (
                    <PlusCircleOutlined
                      onClick={() => {
                        handleEstimateConcernCheckboxChange(
                          item.code,
                          item.title,
                          item.description
                        );
                        handleAddRelatedServicesInspectionsToEstimate(
                          item.code,
                          item.type
                        );
                      }}
                      className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                      title="Add"
                    />
                  ) : (
                    <DeleteOutlined
                      onClick={() =>
                        handleDeleteEstimateSpecificServiceInspectionConcern(
                          item.code,
                          item.type
                        )
                      }
                      className="w-7 h-7 text-lg text-red-600 cursor-pointer hover:scale-105 transition duration-200"
                      title="Remove"
                    />
                  )}
                </div>
              </div>
            )
          )}
          {page === "service-advisor" &&
            type === false &&
            item.type === "Service" && (
              <div>
                  <PlusCircleOutlined
                    onClick={() => {
                      handleServiceAdvisorCheckboxChange(
                        item.code,
                        item.title,
                        item.description,
                        
                      );
                      handleAddRelatedServicesInspectionsToEstimate(
                        item.code,
                        item.type
                      );
                    }}
                    
                    className="w-7 h-7 text-lg text-green-600 cursor-pointer hover:scale-105 transition duration-200"
                    title="Add"
                  />
              </div>
            )}
          {page === "appointment" &&
          type === false &&
          item.type === "Service" ? (
            <div className="p-2">
              <input
                type="checkbox"
                name={`selection-${item.code}`}
                className="cursor-pointer"
                checked={checkboxStates[item.code] || false}
                onChange={() =>
                  handleAppointmentServiceCheckboxChange(item.code, item.title)
                }
              />
            </div>
          ) : item.type === "Estimate" || item.type === "WorkOrder" ? (
            <div className="p-2">
              {/* <input
                type="checkbox"
                name={`selection-${item.customers[0]?.estimateCode}`}
                className="cursor-pointer"
                checked={
                  checkboxStates[item.customers[0]?.estimateCode] || false
                }
                onChange={() =>
                  handleAppointmentEstimateCheckboxChange(
                    item.code,
                    item.title,
                    item.customers[0]?.user?.id,
                    item.customers[0]?.user?.name,
                    item.customers[0]?.user?.contactNum
                  )
                }
              /> */}
             <input
               type="radio"
               name="appointment-selection"
               className="cursor-pointer"
               checked={
                 checkboxStates[item.code] || false
               }
               onChange={() =>
                 handleAppointmentEstimateCheckboxChange(
                   item.code,
                   item.title,
                   item.status,
                 )
               }
           />

            </div>
          ) : (
            !item.type && (
              <div>
                <input
                  type="checkbox"
                  name={`selection-${item.id}`}
                  className="cursor-pointer"
                  checked={checkboxStates[item.id] || false}
                  onChange={() =>
                    handleAppointmentContactCheckboxChange(
                      item.id,
                      item.name,
                      item.contactNum
                    )
                  }
                />
              </div>
            )
          )}
        </div>
      </div>
      {page === "appointment" ? (
        item?.code ? (
          item?.type === "Service" ? (
            <div>
              <h3>{item.code}</h3>
              <p>
                <span>Title: </span>
                <span>{item.title}</span>
              </p>
              <p>
                <span>Description: </span>
                <span>{item.description}</span>
              </p>
            </div>
          ) : (
            item?.type === "Estimate" ||
            (item?.type === "WorkOrder" && (
              <div>
                {/* <h3>{item.code}</h3> */}
                <p>
                  <span>Title: </span>
                  <span>{item?.title}</span>
                </p>
                <p>
                  <span>Customer: </span>
                  <span>{item.customers[0]?.user?.name || "N/A"}</span>
                </p>
              </div>
            ))
          )
        ) : (
          <div>
            <p className="my-3">
              <span>Name: </span>
              <span className="font-bold">{item.name}</span>
            </p>
            <p>
              <span>Contact no.: </span>
              <span>{item.contactNum}</span>
            </p>
          </div>
        )
      ) : (
        <div>
          <h3 className="text-sm">{item.code}</h3>
          {page === "inspection-item" ? (
            <>
              <p>
                <span>Name: </span>
                <span>{item.name}</span>
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                <span>Title: </span>
                <span>{item.title}</span>
              </p>
              {
                item?.description&&<p className="text-sm">
                <span>Description: </span>
                <span>{item.description}</span>
              </p>
              }
            </>
          )}
        </div>
      )}
      {page === "estimate" && type === false && item.type === "Concern" ? (
        <div>
          <SearchRelatedServicesInspections code={{ concernCode: item.code }} />
        </div>
      ) : (
        item.type === "Service" && (
          <div>
            <SearchRelatedServicesInspections
              code={{ serviceCode: item.code }}
            />
          </div>
        )
      )}

      {/* Add checkboxes */}
      {type === true &&
        page !== "appointment" &&
        page !== "inspection-group" &&
        page !== "inspection-item" && (
          // {type === true && (
          <div className="flex justify-center items-center gap-4 ">
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name={`selection-${item.code}`}
                value="Required"
                className="cursor-pointer"
                checked={radioStates[item.code] === "Required"}
                onChange={() => {
                  const codes = Object?.keys(selectedTypes);
                  dispatch(
                    setRadioState({
                      code: item.code,
                      value: "Required",
                    })
                  );
                  handleSelection(item.code, item.title, "Required", item.type);
                  if (codes.includes(item.code)) {
                    if (item?.code?.startsWith("SR")) {
                      dispatch(
                        updateServiceType({
                          code: item.code,
                          type: "Required",
                        })
                      );
                    } else {
                      dispatch(
                        updateInspectionType({
                          code: item?.code,
                          type: "Required",
                        })
                      );
                    }
                  }
                }}
              />
              Required
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name={`selection-${item.code}`}
                value="Recommended"
                className="cursor-pointer"
                checked={radioStates[item.code] === "Recommended"}
                onChange={() => {
                  const codes = Object?.keys(selectedTypes);
                  dispatch(
                    setRadioState({
                      code: item.code,
                      value: "Recommended",
                    })
                  );
                  handleSelection(
                    item.code,
                    item.title,
                    "Recommended",
                    item.type
                  );
                  if (codes.includes(item.code)) {
                    if (item?.type === "Service") {
                      dispatch(
                        updateServiceType({
                          code: item?.code,
                          type: "Recommended",
                        })
                      );
                    } else {
                      dispatch(
                        updateInspectionType({
                          code: item?.code,
                          type: "Recommended",
                        })
                      );
                    }
                  }
                }}
              />
              Recommended
            </label>
          </div>
        )}
      {/* for estimate accept and deferred icon */}
      {/* {type === false &&
        page !== "appointment" &&
        (item.type === "Service" || item.type === "Inspection") && (
          <div className="flex justify-center items-center gap-4">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name={`selection-${item.code}`}
                value="Accept"
                className="cursor-pointer"
                checked={radioStates[item.code] === "Accept"}
                onChange={() => {
                  const codes = Object?.keys(selectedStages);
                  dispatch(
                    setRadioState({
                      code: item.code,
                      value: "Accept",
                    })
                  );
                  dispatch(setSelectedStage({ code:item.code, stage:'Accept' }));
                  if (codes.includes(item.code)) {
                    if (item?.type === "Service") {
                    //   dispatch(
                    //    updateEstimateServiceStage({
                    //      code:item.code,
                    //      stage: "Accept",
                    //    })
                    //  );
                    } else {
                      //  dispatch(
                      //  updateEstimateInspectionStage({
                      //    index,
                      //    stage: "Accept",
                      //  })
                      // );
                    }
                  }
                }}
              />
              Accept
            </label>
            <label className="flex items-center gap-1 text-base">
              <input
                type="radio"
                name={`selection-${item.code}`}
                value="Deferred"
                className="cursor-pointer"
                checked={radioStates[item.code] === "Deferred"}
                onChange={() => {
                  const codes = Object?.keys(selectedTypes);
                  dispatch(
                    setRadioState({
                      code: item.code,
                      value: "Deferred",
                    })
                  );
                  dispatch(setSelectedStage({ code:item.code, stage:'Deferred' }));
                  if (codes.includes(item.code)) {
                    if (item?.type === "Service") {
                      //  dispatch(
                      //  updateEstimateServiceStage({
                      //    code:item.code,
                      //    stage: "Deferred",
                      //  }));
                    } else {
                      // dispatch(
                      //  updateEstimateInspectionStage({
                      //    code:item.code,
                      //    stage: "Deferred",
                      //  }))
                    }
                  }
                }}
              />
              Deferred
            </label>
          </div>
        )} */}
    </div>
  );
};

export default SearchCard;
