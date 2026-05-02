import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addContactItem } from "@/redux/slice/deleteContactSlice";
import { addEstimateItem } from "@/redux/slice/deleteEstimateSlice";
import { addLaborItem } from "@/redux/slice/deleteLaborSlice";
import { EyeOutlined, BarChartOutlined ,DeleteOutlined } from "@ant-design/icons";
import { PiCurrencyDollarThin } from "react-icons/pi";
import {
  addEstimateInspectionItem,
  addEstimateServiceItem,
  updateSearchRelatedInspection,
  updateSearchRelatedService,
} from "@/redux/slice/estimateItemShowSlice";
import { setCheckboxState, setRadioState } from "@/redux/slice/selectionSlice";
import { Tooltip } from "react-tooltip";
import {
  editDeferredTempInspectionPercentage,
  editDeferredTempMechanicPercentage,
  editTempInspectionPercentage,
  editTempMechanicPercentage,
  removeDeferredTempInspectionHour,
  removeDeferredTempInspectionPercentage,
  removeDeferredTempLabour,
  removeDeferredTempMechanicPercentage,
  removeDeferredTempPart,
  removeTempInspectionHour,
  removeTempInspectionPercentage,
  removeTempLabour,
  removeTempMechanicPercentage,
  removeTempPart,
  updateDeferredTempPart,
  updateTempDeferredLabour,
  updateTempLabour,
  updateTempPart,
} from "@/redux/slice/serviceInspectionItemSlice";
import { getUserInfo } from "@/services/auth.service";
import { formatTooltipContent } from "@/utils/formatTooltip";
import { calculateHours } from "@/utils/total-hour-calculate";
import Link from "next/link";
import React, { useState } from "react";
import {
  setItemToDeleteConcern,
  setItemToDeleteInspection,
  setItemToDeleteInspectionGroup,
  setItemToDeleteInspectionItem,
  setItemToDeleteService,
} from "@/redux/slice/itemDeletionSlice";

import { FiEye, FiTrash2, FiEdit2, FiSave } from "react-icons/fi";
import DateDisplay from "@/utils/DateDisplay";
import ProgressBar from "./ProgressBar";
import TableActionButtons from "./TableActionButtons";

interface TrowProps {
  dataObj: { item: any; index: number };
  page: string;
  handleViewService?: (service: any) => void;
  isLoading?: boolean;
  ItemArray: Array<Record<string, any>>;
}

const SkeletonCell = ({ width = "full" }: { width?: string }) => (
  <td className={`py-4 px-3 border ${width === "full" ? "" : `w-${width}`}`}>
    <div
      className={`h-6 bg-gray-200 rounded animate-pulse ${
        width === "full" ? "w-full" : `w-${width}`
      }`}
    ></div>
  </td>
);

const SkeletonActionButtons = () => (
  <td className="rounded-e-lg py-4 px-3">
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </td>
);

const SkeletonRow = ({ columns, page }: { columns: number; page: string }) => {
  const isEven = Math.floor(Math.random() * 2) === 0;
  const bgColor = isEven ? "bg-[#FFFFFFD1]" : "bg-[#ffffff]";

  if (page === "contact") {
    return (
      <tr className={`${bgColor} text-left py-3 rounded-2xl h-2 overflow-auto`}>
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonActionButtons />
      </tr>
    );
  }

  if (page === "service-item-part") {
    return (
      <tr className={`${bgColor} text-left py-3 rounded-2xl h-2 overflow-auto`}>
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonActionButtons />
      </tr>
    );
  }

  if (page === "service-item-labour") {
    return (
      <tr className={`${bgColor} text-left py-3 rounded-2xl h-2 overflow-auto`}>
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonActionButtons />
      </tr>
    );
  }

  if (page === "inspection-group") {
    return (
      <tr className={`${bgColor} text-left py-3 rounded-2xl`}>
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonCell />
        <SkeletonActionButtons />
      </tr>
    );
  }

  // Default skeleton row
  return (
    <tr className={`${bgColor} text-left py-3 rounded-2xl`}>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonCell key={i} />
      ))}
      {[
        "inspection-item",
        "inspection-item-group",
        "concern",
        "service",
        "estimate",
        "work-order",
        "inspection",
      ].includes(page) && <SkeletonActionButtons />}
    </tr>
  );
};

const Trow: React.FC<TrowProps> = ({
  dataObj,
  page,
  isLoading,
}) => {
  const { item, index } = dataObj;
  const { role } = getUserInfo() as any;
  const dispatch = useAppDispatch();
  const [editingPartIndex, setEditingPartIndex] = useState<number | null>(null);
  const [editingLabourIndex, setEditingLabourIndex] = useState<number | null>(null);
  const [editPartData, setEditPartData] = useState<any>(null);
  const [editLabourData, setEditLabourData] = useState<any>(null);
  const { checkboxStates } = useAppSelector((state) => state.selection);
  const [editMechanicPercentage, setEditMechanicPercentage] = useState({
    id: "",
    serviceCode: "",
    percentage: "",
    isEdit: false,
  });
  const [editInspectionPercentage, setEditInspectionPercentage] = useState({
    id: "",
    inspectionCode: "",
    percentage: "",
    isEdit: false,
  });

  if (isLoading) {
    switch (page) {
      case "inspection-item":
      case "inspection-item-group":
      case "concern":
      case "service":
      case "estimate":
      case "work-order":
      case "inspection":
        return <SkeletonRow columns={3} page={page} />;
      case "inspection-group":
        return <SkeletonRow columns={4} page={page} />;
      case "contact":
        return <SkeletonRow columns={3} page={page} />;
      case "service-item-part":
        return <SkeletonRow columns={4} page={page} />;
      case "service-item-labour":
        return <SkeletonRow columns={3} page={page} />;
      case "service-item-mechanicPercentage":
        return <SkeletonRow columns={2} page={page} />;
      case "inspection-item-inspectionHour":
        return <SkeletonRow columns={2} page={page} />;
      case "inspection-item-inspectionPercentage":
        return <SkeletonRow columns={2} page={page} />;
      case "related-services":
      case "related-inspections":
      case "inspection-item-general-tire":
        return <SkeletonRow columns={3} page={page} />;
      default:
        return <SkeletonRow columns={3} page={page} />;
    }
  }

  const handleEditAcceptMechanicPercentage = (
    id: string,
    serviceCode: string,
    percentage: string
  ) => {
    dispatch(
      editTempMechanicPercentage({
        id,
        serviceCode,
         percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
        name: item.name,
      })
    );
    setEditMechanicPercentage({ id, serviceCode, percentage, isEdit: false });
  };

  const handleEditDeferredMechanicPercentage = (
    id: string,
    serviceCode: string,
    percentage: string
  ) => {
    dispatch(
      editDeferredTempMechanicPercentage({
        id,
        serviceCode,
        percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
        name: item.name,
      })
    );
    setEditMechanicPercentage({ id, serviceCode,  percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`, isEdit: false });
  };

  const handleEditAcceptInspectionPercentage = (
    id: string,
    inspectionCode: string,
    percentage: string
  ) => {
    dispatch(
      editTempInspectionPercentage({
        id,
        inspectionCode,
        percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
        name: item.name,
      })
    );
    setEditInspectionPercentage({
      id,
      inspectionCode,
      percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
      isEdit: false,
    });
  };

  const handleEditDeferredInspectionPercentage = (
    id: string,
    inspectionCode: string,
    percentage: string
  ) => {
    dispatch(
      editDeferredTempInspectionPercentage({
        id,
        inspectionCode,
         percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
        name: item.name,
      })
    );
    setEditInspectionPercentage({
      id,
      inspectionCode,
       percentage: percentage.toString().endsWith("%")
      ? percentage
      : `${percentage}%`,
      isEdit: false,
    });
  };

  const handleEditPart = (item: any, index: number) => {
    setEditingPartIndex(index);
    setEditPartData({ ...item ,partId:index,});
  };

  const handleEditLabour = (item: any, index: number) => {
    setEditingLabourIndex(index);
    setEditLabourData(
      { 
        ...item ,
        requiredHours:(Number(item.requiredHours)/60).toString(),
        labourId:index
      });
  };

   const onPartUpdateChange = (
      key: string, value: string,
  ) => {
    let newData = { ...editPartData, [key]: value };
  
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
  
    setEditPartData(newData);
    
  
  };

  const onLabourUpdateChange = (
    field: string,
    value: string | null | string[]
  ) => {
    setEditLabourData((prev: any) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };

  const handleUpdatePart = () => {
        item?.serviceStage === "Accept" || item?.serviceStage === ""?
          dispatch(updateTempPart({
          ...editPartData,
          unitPrice: parseFloat(editPartData.unitPrice),
          quantity: parseInt(editPartData.quantity, 10),
          total:parseFloat(editPartData.total),
          margin:parseFloat(editPartData.margin)
        })):dispatch(updateDeferredTempPart({
          ...editPartData,
          unitPrice: parseFloat(editPartData.unitPrice),
          quantity: parseInt(editPartData.quantity, 10),
          total:parseFloat(editPartData.total),
          margin:parseFloat(editPartData.margin)
        }))
        
        setEditingPartIndex(null)
  }
  
  const handleUpdateLabour = () => {
        item?.serviceStage === "Accept" || item?.serviceStage === ""?
          dispatch(updateTempLabour({
          ...editLabourData,
          requiredHours:Number(editLabourData?.requiredHours)*60
        })):dispatch(updateTempDeferredLabour({
         ...editLabourData,
          requiredHours:Number(editLabourData?.requiredHours)*60
        }))
        
        setEditingLabourIndex(null)
  }
  return (
    <>
      {page === "inspection-item" && (
        <tr key={item?.code} className={`trow-tr`}>
          <td className="trow-td">{item?.name}</td>
          <td className="trow-td">
            <span className=""> {item?.code}</span>
          </td>
          <td className="trow-td">
            <span className=""> {item?.type}</span>
          </td>
          <td className="py-2 px-3">
             <TableActionButtons
                viewHref={`/admin/inspection/singleItemView/${item?.code}`}
                onDelete={() => dispatch(
                    setItemToDeleteInspectionItem({
                      code: item.code,
                      type: item.type,
                    })
                  )}
              />
          </td>
        </tr>
      )}
      {page === "inspection-item-group" && (
        <tr key={item?.code} className={`trow-tr`}>
          <td className="trow-td">{item?.name}</td>
          <td className="trow-td">
            <span className=""> {item?.code}</span>
          </td>
          <td className="trow-td">
            {<DateDisplay date={item?.createdAt}></DateDisplay>}
          </td>

          <td className="py-2 px-3">
             <TableActionButtons
                viewHref={`/admin/inspection/singleGroupview/${item?.code}`}
                onDelete={() => dispatch(
                    setItemToDeleteInspectionGroup({
                      code: item.code,
                      type: item.type,
                    })
                  )}
              />
          </td>
        </tr>
      )}
      {page === "concern" && (
        <tr
          key={item?.code}
          className={`hover:bg-[#FAFAFA] border-b border-l-0 border-r-0 border-[1px] border-gray-200 border-solid last:border-b-0 `}
        >
          <td className="px-3  border border-gray-300 py-3  text-sm break-words">
            {item?.title}
          </td>
          <td className="px-3 border border-gray-300 py-3 text-sm break-words">
            <span> {item?.code}</span>
          </td>
          <td className=" px-3 border border-gray-300 py-3 text-sm break-words">
            {<DateDisplay date={item?.createdAt}></DateDisplay>}
          </td>

          <td className="py-2 px-3">
           <TableActionButtons
                viewHref={`/admin/concern/singleItemView/${item?.code}`}
                onDelete={() => dispatch(
                  setItemToDeleteConcern({
                    code: item.code,
                    type: item.type,
                  })
                )}
              />
        </td>
        </tr>
      )}
      {page === "service" && (
        <tr key={item?.code} className={`trow-tr`}>
          <td className="trow-td">{item?.title}</td>
          <td className="trow-td">
            <span className=""> {item?.code}</span>
          </td>
          <td className="trow-td">
            {<DateDisplay date={item?.createdAt}></DateDisplay>}
          </td>
          <td className="py-2 px-3">
            <TableActionButtons
             viewHref={`/admin/service/singleItemView/${item.code}`}
             onDelete={() =>
               dispatch(setItemToDeleteService({ code: item.code, type: item.type }))
             }
          />
          </td>
          

        </tr>
      )}

      {(page === "estimate" || page === "work-order") && (
        <tr key={item?.code} className={`trow-tr`}>
          <td className="trow-td">{item?.title}</td>
          <td className="trow-td">
            {<DateDisplay date={item?.createdAt}></DateDisplay>}
          </td>
         
          <td className="trow-td">
            {item?.vehicle[0]?.vehicle?.numberPlate || "N/A"}
          </td>
          <td className="py-2 px-1">
         <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
           {page === "estimate" ? (
             <Link
               href={`/${role}/estimate/singleEstimateView/${item?.code}`}
               prefetch
               className="trow-view-button flex items-center justify-center"
             >
               <EyeOutlined style={{ fontSize: 18 }} />
             </Link>
           ) : (
             <>
               <Link
                 href={`/${role}/work-order/analysis/${item?.code}`}
                 prefetch
                 className="trow-view-button flex items-center justify-center"
               >
                 <BarChartOutlined style={{ fontSize: 16 }} />
               </Link>
       
               <Link
                 href={`/${role}/work-order/single-work-order/${item?.code}`}
                 prefetch
                 className="trow-view-button flex items-center justify-center"
               >
                 <EyeOutlined style={{ fontSize: 16 }} />
               </Link>
             </>
           )}
       
           <button
             onClick={() => dispatch(addEstimateItem({ code: item.code }))}
             className="trow-delete-button flex items-center justify-center"
           >
             <DeleteOutlined style={{ fontSize: 16 }} />
           </button>
         </div>
    </td>

        </tr>
      )}
      {page === "inspection-group" && (
        <tr
          key={index}
          className={`${
            index % 2 === 0 ? "bg-[#FFFFFFD1]" : "bg-[#ffffff]"
          } text-left py-3 rounded-2xl`}
        >
          <td className="rounded-l-lg py-4 px-3 border text-sm md:text-base break-words">
            {item.labourName}
          </td>
          <td className="py-4 px-3 border text-sm md:text-base break-words">
            {item.hoursWorked}
          </td>
          <td className="py-4 px-3 border text-sm md:text-base break-words">
            {item.labourRatePerHour}
          </td>
          <td className="py-4 px-3 border text-sm md:text-base break-words">
            {item.total}
          </td>
          <td className="rounded-e-lg py-4 px-3">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <div
                onClick={() => dispatch(addLaborItem({ id: index }))}
                className="bg-[#f66868] text-black text-sm md:text-base px-2 py-1 rounded-md text-center border-none hover:bg-red-600 hover:text-white cursor-pointer"
              >
                Delete
              </div>
            </div>
          </td>
        </tr>
      )}

      {page === "contact" && (
        <>
          <tr
            key={item.id}
            data-tooltip-id={item.id}
            data-tooltip-html={formatTooltipContent(item)}
            className={`trow-tr`}
          >
            <td className="trow-td">{item.name}</td>

            <td className="trow-td ">
              {<DateDisplay date={item?.createdAt}></DateDisplay>}
            </td>
            <td className="trow-td">{item.role}</td>
            <td className="py-2 px-3">
              <TableActionButtons
                viewHref={`/${role}/contact/single-contract/${item.id}`}
                onDelete={() => dispatch(addContactItem({ id: item.id }))}
              />
            </td>
          </tr>

        </>
      )}

          <Tooltip
            id={item.id}
            place="top"
            className="!bg-[#7F7F7F] !text-white !rounded-lg !shadow-lg !max-w-xs !z-[1000] !whitespace-normal !overflow-hidden"
            arrowColor="#7F7F7F"
          />
      {page === "service-item-part" && (
        <tr key={item.id} className="trow-tr-part grid grid-cols-7 items-center">

  {/* Name */}
  <td className="trow-td-part col-span-2">
    {editingPartIndex === index ? (
      <input
        type="text"
        value={editPartData.name}
        onChange={(e: any) =>
          onPartUpdateChange('name',e.target.value)
        }
        className="input-field"
      />
    ) : (
      item.name
    )}
  </td>

  {/* Margin */}
  <td className="trow-td-part flex items-center">
    {editingPartIndex === index ? (
      <input
        type="text"
        value={editPartData.margin}
        onChange={(e) =>
          onPartUpdateChange('margin',e.target.value)
        }
        className="input-field"
      />
    ) : (
      `${item.margin?.toFixed(2)}`
    )}%
  </td>

  {/* Unit Price */}
  <td className="trow-td-part">
    {editingPartIndex === index ? (
      <input
        type="text"
        value={editPartData.unitPrice}
        onChange={(e) =>
          onPartUpdateChange('unitPrice',e.target.value)
        }
        className="input-field"
      />
    ) : (
      `${item.unitPrice} Unit`
    )}
  </td>

  {/* Quantity */}
  <td className="trow-td-part flex items-center">
    <PiCurrencyDollarThin />
    {editingPartIndex === index ? (
      <input
        type="text"
        value={editPartData.quantity}
        onChange={(e) =>
          onPartUpdateChange('quantity',e.target.value)
        }
        className="input-field"
      />
    ) : (
      `${item.quantity}/Unit`
    )}
  </td>

  {/* Total */}
  <td className="trow-td-part flex items-center">
    <PiCurrencyDollarThin />
    {editingPartIndex === index ? (
      <input
        type="text"
        value={editPartData.total}
        onChange={(e) =>
          onPartUpdateChange('total',e.target.value)
        }
        className="input-field"
      />
    ) : (
      item.total?.toFixed(2)
    )}
  </td>

  {/* Action Buttons */}
  <td className="trow-td-part px-3">
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">

      {editingPartIndex === index ? (
        <button
        className="trow-delete-button px-2"
          type="button"
          onClick={handleUpdatePart}
         
        >
          <FiSave className="text-sm" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => handleEditPart(item, index)}
          className="trow-delete-button px-2"
        >
          <FiEdit2 className="text-sm" />
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          dispatch(
            item?.serviceStage === "Accept" || item?.serviceStage === ""
              ? removeTempPart({ partId: index })
              : removeDeferredTempPart({ partId: index })
          )
        }
        className="trow-delete-button px-2"
      >
        <FiTrash2 className="text-sm" />
      </button>
    </div>
  </td>
</tr>
      )}

      {page === "service-item-labour" && (
      <tr key={item.id} className={`trow-tr-part grid grid-cols-6 items-center`}>
        <td className="trow-td-part col-span-2">
          {editingLabourIndex === index ? (
            <input
              type="text"
              value={editLabourData.name}
              onChange={(e) =>
                onLabourUpdateChange("name", e.target.value)
              }
              className="input-field"
            />
          ) : (
            `${item.name}`
          )}
        </td>
        
        {/* Required Hours */}
        <td className="trow-td-part">
            {editingLabourIndex === index ? (
              <input
                type="string"
                value={(editLabourData.requiredHours)}
                onChange={(e) =>
                  onLabourUpdateChange(
                    "requiredHours", e.target.value)
                }
                className="input-field w-20"
              />
            ) : (
            `${(item.requiredHours / 60)?.toFixed(2)} Hour`
            )}
          </td>
        
        {/* Rate Per Hour */}
        <td className="trow-td-part flex items-center">
          {editingLabourIndex === index ? (
            <input
              type="string"
              value={editLabourData.ratePerHour}
              onChange={(e) =>
                onLabourUpdateChange("ratePerHour", e.target.value)
              }
              className="input-field w-20"
            />
          ) : (
            <>
              <PiCurrencyDollarThin />
              {item.ratePerHour}/Hour
            </>
          )}
        </td>
        
        {/* Total */}
        <td className="trow-td-part flex items-center">
          <PiCurrencyDollarThin />
          {(
            (editingLabourIndex === index
              ? editLabourData.ratePerHour *
                (editLabourData.requiredHours)
              : item.ratePerHour * (item.requiredHours / 60)
            ) || 0
          ).toFixed(2)}
        </td>
          {/* Action Buttons */}
          <td className="trow-td-part px-3">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              {editingLabourIndex === index ? (
                <button
                className="trow-delete-button px-2"
                  type="button"
                  onClick={handleUpdateLabour}
                 
                >
                  <FiSave className="text-sm" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleEditLabour(item, index)}
                  className="trow-delete-button px-2"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  item?.serviceStage === "Accept" || item?.serviceStage === ""
                    ? dispatch(removeTempLabour({ labourId: index }))
                    : dispatch(removeDeferredTempLabour({ labourId: index }))
                }
                className="trow-delete-button px-2"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </td>
        </tr>
      )}

      {page === "service-item-mechanicPercentage" && (
        <tr key={item.id} className={`trow-tr-part grid grid-cols-7  gap-2`}>
          <td className="trow-td-part col-span-2 ">{item.name}</td>
          {editMechanicPercentage.isEdit ? (
            <td className=" trow-td-part col-span-3">
              <input
                type="text"
                value={editMechanicPercentage.percentage}
                onChange={(e) =>
                  setEditMechanicPercentage({
                    ...editMechanicPercentage,
                    percentage: e.target.value,
                  })
                }
                className="border border-gray-200 border-solid outline-none rounded p-2"
              />
            </td>
          ) : (
        <td className="trow-td-part col-span-3 ">
        <ProgressBar percentage={item?.percentage}/>
        </td>
          )}
          <td className="trow-td-part sm:flex justify-start sm:justify-end items-center col-span-2 ">
            <div className="flex flex-row justify-center items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  item?.serviceStage === "Accept"
                    ? dispatch(
                        removeTempMechanicPercentage({
                          id: item.id,
                          serviceCode: item.serviceCode,
                        })
                      )
                    : dispatch(
                        removeDeferredTempMechanicPercentage({
                          id: item.id,
                          serviceCode: item.serviceCode,
                        })
                      )
                }
                className="trow-delete-button-part px-2"
              >
                <FiTrash2 className="text-sm" />
              </button>
              {editMechanicPercentage.isEdit ? (
                <button
                  type="button"
                  onClick={() =>
                    item?.serviceStage === "Accept"
                      ? handleEditAcceptMechanicPercentage(
                          item.id,
                          item.serviceCode,
                          editMechanicPercentage.percentage
                        )
                      : handleEditDeferredMechanicPercentage(
                          item.id,
                          item.serviceCode,
                          editMechanicPercentage.percentage
                        )
                  }
                  className="trow-delete-button-part px-2"
                >
                  <FiSave className="text-sm" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setEditMechanicPercentage({
                      id: item.id,
                      serviceCode: item.serviceCode,
                      percentage: item.percentage,
                      isEdit: true,
                    })
                  }
                  className="trow-delete-button-part px-2"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              )}
            </div>
          </td>
        </tr>
      )}

      {page === "inspection-item-inspectionHour" && (
        <tr key={item.id} className={`trow-tr-part grid grid-cols-4 items-center`}>
          <td className="trow-td-part ">
            {(item.inspectionHours/60).toFixed(2)} Hour
          </td>
          <td className="trow-td-part flex items-center"> <PiCurrencyDollarThin />{item.inspectionHourlyRate}/Hour</td>
          <td className="trow-td-part flex items-center"> <PiCurrencyDollarThin />{(item.inspectionHourlyRate*(item.inspectionHours/60))?.toFixed(2)}</td>
          <td className=" px-3">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  item?.inspectionStage === "Accept" ||
                  item?.inspectionStage === ""
                    ? dispatch(
                        removeTempInspectionHour({
                          inspectionHours: item.inspectionHours,
                        })
                      )
                    : dispatch(
                        removeDeferredTempInspectionHour({
                          inspectionHours: item.inspectionHours,
                        })
                      )
                }
                className="trow-delete-button"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          </td>
        </tr>
      )}

      {page === "inspection-item-inspectionPercentage" && (
        <tr key={item.id} className={`trow-tr-part grid grid-cols-7  gap-2`}>
          <td className="trow-td-part col-span-2">{item.name}</td>
          {editInspectionPercentage.isEdit ? (
            <td className="trow-td-part col-span-3">
              <input
                type="text"
                value={editInspectionPercentage.percentage}
                onChange={(e) =>
                  setEditInspectionPercentage({
                    ...editInspectionPercentage,
                    percentage: e.target.value,
                  })
                }
                className="border border-gray-200 border-solid outline-none rounded p-2"
              />
            </td>
          ) : (
             <td className="trow-td-part col-span-3 ">
               <ProgressBar percentage={item?.percentage}/>
             </td>
          )}
          <td className="trow-td-part sm:flex justify-start sm:justify-end items-center col-span-2">
            <div className="flex flex-row justify-center items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  item?.inspectionStage === "Accept"
                    ? dispatch(
                        removeTempInspectionPercentage({
                          id: item.id,
                          inspectionCode: item.inspectionCode,
                        })
                      )
                    : dispatch(
                        removeDeferredTempInspectionPercentage({
                          id: item.id,
                          inspectionCode: item.inspectionCode,
                        })
                      )
                }
                className="trow-delete-button-part px-2"
              >
                <FiTrash2 className="text-sm" />
              </button>
              {editInspectionPercentage.isEdit ? (
                <button
                  type="button"
                  onClick={() =>
                    item?.inspectionStage === "Accept"
                      ? handleEditAcceptInspectionPercentage(
                          item.id,
                          item.inspectionCode,
                          editInspectionPercentage.percentage 
                        )
                      : handleEditDeferredInspectionPercentage(
                          item.id,
                          item.inspectionCode,
                          editInspectionPercentage.percentage
                        )
                  }
                  className="trow-delete-button-part px-2"
                >
                  <FiSave className="text-sm" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setEditInspectionPercentage({
                      id: item.id,
                      inspectionCode: item.inspectionCode,
                      percentage: item.percentage,
                      isEdit: true,
                    })
                  }
                  className="trow-delete-button-part px-2"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              )}
            </div>
          </td>
        </tr>
      )}

      {page === "related-services" && (
        <tr key={item.id} className={`trow-tr`}>
          <td className="trow-td">{item.name}</td>
          <td className="trow-td">{item.code}</td>
          <td className="trow-td">{item.type}</td>
          <td className="trow-td flex justify-center">
            <div>
              <input
                type="checkbox"
                name={`selection-${item.code}`}
                className="cursor-pointer w-4 h-4 "
                checked={checkboxStates[item.code] || false}
                onChange={() => {
                  dispatch(
                    addEstimateServiceItem({
                      serviceCode: item.code,
                      title: item.name,
                      description: item.description,
                      stage: "Accept",
                    })
                  );
                  dispatch(
                    setCheckboxState({ code: item.code, checked: true })
                  );
                }}
              />
            </div>
          </td>
        </tr>
      )}

      {page === "related-inspections" && (
        <tr key={item.id} className={`trow-tr`}>
          <td className="trow-td">{item.name}</td>
          <td className="trow-td">{item.code}</td>
          <td className="trow-td">{item.type}</td>
          <td className="trow-td flex justify-center">
            <div>
              <input
                type="checkbox"
                name={`selection-${item.code}`}
                className="cursor-pointer w-4 h-4 scale-110"
                checked={checkboxStates[item.code] || false}
                onChange={() => {
                  dispatch(
                    addEstimateInspectionItem({
                      inspectionCode: item.code,
                      title: item.name,
                      description: item.description,
                      stage: "Accept",
                    })
                  );
                  dispatch(
                    setCheckboxState({ code: item.code, checked: true })
                  );
                }}
              />
            </div>
          </td>
        </tr>
      )}

      {page === "related-services-search" && (
        <tr key={item.id} className={`trow-tr`}>
          <td className="trow-td">{item.childTitle}</td>
          <td className="trow-td">{item.childCode}</td>
          <td className="trow-td">{item.childType}</td>
          <td className=" trow-td  flex justify-center  items-center space-x-4">
            {/* Accept Checkbox */}
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={item.stage === "Accept"}
                onChange={() => {
                  const newStage = item.stage === "Accept" ? "" : "Accept";

                  if (item?.childCode) {
                    dispatch(
                      updateSearchRelatedService({
                        parentCode: item.parentCode,
                        childCode: item.childCode,
                        stage: newStage,
                      })
                    );
                  }

                  const code = item.serviceCode || item.inspectionCode;
                  if (code) {
                    dispatch(
                      setRadioState({
                        code,
                        value: "Required",
                      })
                    );
                  }
                }}
                className="cursor-pointer w-4 h-4"
              />
              <span className="text-sm">Accept</span>
            </label>

            {/* Deferred Checkbox */}
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={item.stage === "Deferred"}
                onChange={() => {
                  const newStage = item.stage === "Deferred" ? "" : "Deferred";

                  if (item?.childCode) {
                    dispatch(
                      updateSearchRelatedService({
                        parentCode: item.parentCode,
                        childCode: item.childCode,
                        stage: newStage,
                      })
                    );
                  }

                  const code = item.childCode;
                  if (code) {
                    dispatch(
                      setRadioState({
                        code,
                        value: newStage,
                      })
                    );
                  }
                }}
                className="cursor-pointer w-4 h-4"
              />
              <span className="text-sm">Deferred</span>
            </label>
          </td>
        </tr>
      )}

      {page === "related-inspections-search" && (
        <tr key={item.id} className={`trow-tr`}>
          <td className="trow-td">{item.childTitle}</td>
          <td className="trow-td">{item.childCode}</td>
          <td className="trow-td">{item.childType}</td>
          <td className="trow-td flex justify-center space-x-4">
            {/* Accept Checkbox */}
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={item.stage === "Accept"}
                onChange={() => {
                  const newStage = item.stage === "Accept" ? "" : "Accept";

                  if (item?.childCode) {
                    dispatch(
                      updateSearchRelatedInspection({
                        parentCode: item.parentCode,
                        childCode: item.childCode,
                        stage: newStage,
                      })
                    );
                  }

                  const code = item.serviceCode || item.inspectionCode;
                  if (code) {
                    dispatch(
                      setRadioState({
                        code,
                        value: "Required",
                      })
                    );
                  }
                }}
                className="cursor-pointer w-4 h-4"
              />
              <span className="text-sm">Accept</span>
            </label>

            {/* Deferred Checkbox */}
            <label className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={item.stage === "Deferred"}
                onChange={() => {
                  const newStage = item.stage === "Deferred" ? "" : "Deferred";

                  if (item?.childCode) {
                    dispatch(
                      updateSearchRelatedInspection({
                        parentCode: item.parentCode,
                        childCode: item.childCode,
                        stage: newStage,
                      })
                    );
                  }

                  const code = item.childCode;
                  if (code) {
                    dispatch(
                      setRadioState({
                        code,
                        value: newStage,
                      })
                    );
                  }
                }}
                className="cursor-pointer w-4 h-4"
              />
              <span className="text-sm">Deferred</span>
            </label>
          </td>
        </tr>
      )}

      {page === "inspection-item-general-tire" && (
        <tr key={item.id} className={`trow-tr`}>
          <td className="trow-td">{item.name}</td>
          <td className="trow-td">{item.code}</td>
          <td className="trow-td">{item.type}</td>
        </tr>
      )}
      {page === "inspection" && (
        <tr key={item?.code} className={`trow-tr`}>
          <td className="trow-td">{item?.title}</td>
          <td className="trow-td">
            <span className=""> {item?.code}</span>
          </td>
          <td className="trow-td">
            {<DateDisplay date={item?.createdAt}></DateDisplay>}
          </td>

          <td className="py-2 px-3">
             <TableActionButtons
                viewHref={`/${role}/inspection/singleView/${item?.code}`}
                onDelete={() => dispatch(
                    setItemToDeleteInspection({
                      code: item.code,
                      type: item.type,
                    })
                  )}
              />
          </td>

        </tr>
      )}
    </>
  );
};

export default Trow;
