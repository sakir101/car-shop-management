import React, { useEffect, useState } from "react";
import {
  CloseCircleFilled,
  EditFilled,
  FileDoneOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearAllRelatedItemDB,
  setDeleteItemDB,
  setUpdateItemDB,
} from "@/redux/slice/relatedItemHandleSlice";
import DBInspectionItem from "../inspectionItem/DBInspectionItem";
import InspectionItemGeneralTireShow from "../InspectionItemGeneralTireShow/InspectionItemGeneralTireShow";
import DBServiceItem from "../ServiceItem/DBServiceItem";
import RelatedServicesInspections from "../RelatedServicesInspections/RelatedServicesInspections";
import { Button } from "antd";
import {
  setEstimateConcernUpdateStatus,
  setEstimateInspectionUpdateStatus,
  setEstimateServiceUpdateStatus,
  updateEstimateConcernItem,
  updateEstimateConcernSingleItem,
  updateEstimateInspectionItem,
  updateEstimateInspectionSingleItem,
  updateEstimateServiceItem,
  updateEstimateServiceSingleItem,
} from "@/redux/slice/estimateItemShowSlice";
import SearchRelatedServicesInspections from "../RelatedServicesInspections/SearchRelatedServicesInspections";
import { checkInvoiceAccess } from "@/utils/InvoiceAccessCheck";
import { getUserInfo } from "@/services/auth.service";

interface RelatedItemShowCardProps {
  item: any;
  type: string;
  subType: string;
}

const RelatedItemShowCard: React.FC<RelatedItemShowCardProps> = ({
  item,
  type,
  subType,
}) => {
  const { role } = getUserInfo() as any;
   const {
    estimateType,
  } = useAppSelector((state) => state.estimateItemShow);
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
  const dispatch = useAppDispatch();
  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);

  useEffect(() => {
    dispatch(clearAllRelatedItemDB());
  }, [dispatch]);

  const handleSave = () => {
    const { code, title, description, type } = changeItem;

    // Determine the type by matching the code prefix or some property
    if (type === "Service") {
      dispatch(
        updateEstimateServiceSingleItem({
          serviceCode: code,
          title,
          description,
        })
      );
      dispatch(setEstimateServiceUpdateStatus(true));
    } else if (type === "Inspection") {
      dispatch(
        updateEstimateInspectionSingleItem({
          inspectionCode: code,
          title,
          description,
        })
      );
      dispatch(setEstimateInspectionUpdateStatus(true));
    } else if (type === "Concern") {
      dispatch(
        updateEstimateConcernSingleItem({
          concernCode: code,
          title,
          description,
        })
      );
      dispatch(setEstimateConcernUpdateStatus(true));
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
      {type !== "service-advisor" && (
        <div className="flex justify-between items-center absolute top-0 right-0 p-2">
          <div></div>
          {
            type ==="Estimate" && (subType ==="Inspection"||subType==="Service"||subType ==="Concern")? ""
            : <CloseCircleFilled
            className="text-sm text-red-600 rounded cursor-pointer hover:text-red-800"
            onClick={() =>{
              if (!checkInvoiceAccess(role, estimateType)) return;
              dispatch(
                setDeleteItemDB({
                  code:
                    item?.code ||
                    item?.inspectionItemCode ||
                    (item?.owner && {
                      ownerId: item?.owner?.id,
                      vehicleId: item?.vehicle?.id,
                    }),
                  type,
                  subType,
                })
              )
            }
            }
          />
          }
        </div>
      )}

      {/* Input and Checkbox Options */}
      <div
        className={`${
          type !== "Estimate" &&
          type !== "service-advisor" &&
          (subType === "Inspection" ||
            subType === "Service" ||
            subType === "Concern")
            ? "flex  items-center flex-wrap sm:flex-nowrap gap-1 "
            : "mx-auto"
        }`}
      >
        {/* Input Field */}
        <div className="w-full">
          {type !== "Estimate" &&
          type !== "service-advisor" &&
          (subType === "Service" ||
            subType === "Inspection" ||
            subType === "Concern") ? (
            <div>
              <input
                type="text"
                id="code"
                value={item?.title}
                disabled
                placeholder="Enter your code"
                className=" text-start  bg-transparent border-none  outline-none"
              />
            </div>
          ) : (
            subType === "Vehicle" && (
              <div className="text-sm">
                <div>
                    <p>
                     Owner Name: {item?.owner?.name}
                    </p>
                    <p>
                    Phone: {item?.owner?.contactNum}
                    </p>
                    <p>
                      Number Plate:
                      {item?.vehicle?.numberPlate}
                    </p>
                    <p>
                      Model: {item?.vehicle?.model}
                    </p>
                    <p>
                      Color: {item?.vehicle?.color}
                    </p>
                </div>
              </div>
            )
          )}
        </div>
        {/* service for type */}
        {type === "Service" &&
          (subType === "Service" || subType === "Service") && (
            <div className="flex items-center gap-2 mr-7 ">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item?.type === "Required"}
                  onClick={() =>
                    dispatch(
                      setUpdateItemDB({
                        code: item.code,
                        category: "Required",
                        type,
                        subType,
                      })
                    )
                  }
                  className="cursor-pointer"
                />
                <label className="font-medium">Required</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item?.type === "Recommended"}
                  onClick={() =>
                    dispatch(
                      setUpdateItemDB({
                        code: item.code,
                        category: "Recommended",
                        type,
                        subType,
                      })
                    )
                  }
                  className="cursor-pointer"
                />
                <label className="font-medium">Recommended</label>
              </div>
            </div>
          )}
        {/* inspection for type */}
        {type === "Inspection" && subType === "Inspection" && (
          <div className="flex items-center gap-2 mr-7">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item?.type === "Required"}
                onClick={() =>
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Required",
                      type,
                      subType,
                    })
                  )
                }
                className="cursor-pointer"
              />
              <label className="font-medium">Required</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item?.type === "Recommended"}
                onClick={() =>
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Recommended",
                      type,
                      subType,
                    })
                  )
                }
                className="cursor-pointer"
              />
              <label className="font-medium">Recommended</label>
            </div>
          </div>
        )}

        {/* Conditional Checkbox Options */}
        {(type === "General" || type === "Tire") && (
          <div className="flex items-center gap-5 mr-7">
            {/* Required Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  type === "Tire"
                    ? item?.inspectionItemTires?.[0]?.type === "Required"
                    : item?.inspectionItemGenerals?.[0]?.type === "Required"
                }
                onClick={() =>
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Required",
                      type,
                      subType,
                    })
                  )
                }
                className="cursor-pointer"
                readOnly
              />
              <label className="font-medium">Required</label>
            </div>

            {/* Recommended Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={
                  type === "Tire"
                    ? item?.inspectionItemTires?.[0]?.type === "Recommended"
                    : item?.inspectionItemGenerals?.[0]?.type === "Recommended"
                }
                onClick={() =>
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Recommended",
                      type,
                      subType,
                    })
                  )
                }
                className="cursor-pointer"
                readOnly
              />
              <label className="font-medium">Recommended</label>
            </div>
          </div>
        )}

        {type === "Estimate" &&
          (subType === "Service" || subType === "Inspection") && (
            <div className="flex items-center justify-center gap-5 -mt-1 py-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item?.stage === "Accept"}
                  onClick={() =>{
                     if (!checkInvoiceAccess(role, estimateType)) return;
                    dispatch(
                      setUpdateItemDB({
                        code: item.code,
                        category: "Deferred",
                        type,
                        subType,
                      })
                    )
                    dispatch(
                      setUpdateItemDB({
                        code: item.code,
                        category: "Accept",
                        type,
                        subType,
                      })
                    )
                  }
                  }
                  className="cursor-pointer"
                />
                <label className="font-medium">Accept</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item?.stage === "Deferred"}
                  onClick={() =>{
                     if (!checkInvoiceAccess(role, estimateType)) return;
                    dispatch(
                      setUpdateItemDB({
                        code: item.code,
                        category: "Deferred",
                        type,
                        subType,
                      })
                    )
                  }
                  }
                  className="cursor-pointer"
                />
                <label className="font-medium">Deferred</label>
              </div>
            </div>
          )}
        {type === "service-advisor" && subType === "Service" && (
          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={item?.stage === "Accept"}
                onClick={() =>
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Accept",
                      type,
                      subType,
                    })
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
                  dispatch(
                    setUpdateItemDB({
                      code: item.code,
                      category: "Deferred",
                      type,
                      subType,
                    })
                  )
                }
                className="cursor-pointer"
              />
              <label className="font-medium">Deferred</label>
            </div>
          </div>
        )}

        {(type === "Estimate" || type === "service-advisor") &&
          (subType === "Service" ||
            subType === "Inspection" ||
            subType === "Concern") && (
            <div className="estimate-service-title-des">
              
              <div className="w-full">
                <div className={`${isActive.code !== item.code?'flex justify-start  gap-2 items-start':''}`}>
                <p>Title:</p>
                <input
                  type="text"
                  id="code"
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
              <div
              className={`${
                isActive.code !== item.code
                  ? "flex justify-start gap-2 items-start w-full"
                  : ""
              }`}
            >
              <p>Description:</p>
              <textarea
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
              rows={1}
            />
            
            </div>
              </div>
              <div className={`flex justify-between items-center ${isActive.code !== item.code ? '':'mt-3'} `}>
                <div></div>
                <div>
                  {isActive.active ? (
                    <Button onClick={handleSave}>Save</Button>
                  ) : (
                    <Button
                      onClick={() => {
                         if (!checkInvoiceAccess(role, estimateType)) return;
                        setIsActive({
                          code: item.code,
                          active: true,
                        });
                        setChangeItem({
                          code: item.code,
                          type:
                            item.type === "Service"
                              ? "Service"
                              : item.type === "Inspection"
                              ? "Inspection"
                              : item.type === "Concern"
                              ? "Concern"
                              : "",
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
          )}
      </div>

      {/* Additional Functionality for Estimate Type */}
      {type === "Estimate" && subType === "Inspection" && (
        <>
          <div className="flex justify-between items-center relative">
            <div></div>
            <div>
              <FileDoneOutlined
                className="text-xl font-bold cursor-pointer  absolute right-1 top-4  mt-1"
                onClick={() => setIsInspectionModalOpen(true)}
              />
            </div>
          </div>
          {isInspectionModalOpen && (
            <InspectionItemGeneralTireShow
              isModalOpen={isInspectionModalOpen}
              inspectionCode={item?.code}
              setIsModalOpen={setIsInspectionModalOpen}
            />
          )}
          <div>
            <DBInspectionItem
              item="inspectionHour"
              inspectionCode={item?.code}
              stage={item?.stage}
            />
            <DBInspectionItem
              item="inspectionPercentage"
              inspectionCode={item?.code}
              stage={item?.stage}
            />
          </div>
        </>
      )}
      {type === "inspection-item" && subType === "inspection-item" && (
        <div className="flex justify-start items-center">
          <div>
            <input
              type="text"
              id="code"
              value={
                item?.InspectionItemGeneral?.name ||
                item?.InspectionItemTire?.name
              }
              disabled
              placeholder="Enter your code"
              className="w-full bg-transparent border-none outline-none"
            />
          </div>
        </div>
      )}

      {type === "Estimate" && subType === "Service" && (
        <div>
          <DBServiceItem
            item="part"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <DBServiceItem
            item="labour"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <DBServiceItem
            item="mechanicPercentage"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <RelatedServicesInspections code={{ serviceCode: item?.code }} />
          {/* <SearchRelatedServicesInspections
            code={{ serviceCode: item?.code }}
          /> */}
        </div>
      )}

      {type === "service-advisor" && subType === "Service" && (
        <div>
          <DBServiceItem
            item="part"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <DBServiceItem
            item="labour"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <DBServiceItem
            item="mechanicPercentage"
            serviceCode={item?.code}
            stage={item?.stage}
          />
          <RelatedServicesInspections
            code={{ serviceCode: item?.code }}
            page={"service-advisor"}
          />
        </div>
      )}

      {type === "Estimate" && subType === "Concern" && (
        <RelatedServicesInspections code={{ concernCode: item?.code }} />
      )}
    </div>
  );
};

export default RelatedItemShowCard;
