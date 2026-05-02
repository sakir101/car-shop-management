"use client";
import React, { useState, useEffect } from "react";
import { Button, Spin, message } from "antd";
import { usePathname } from "next/navigation";
import ViewUpdateServiceForm from "@/components/Service/ViewUpdateServiceForm";
import { useGetServiceByCodeQuery } from "@/redux/api/serviceApi";
import { useAppDispatch } from "@/redux/hooks";
import {
  addLabours,
  addParts,
  removeAllInspectionItem,
  removeAllLabours,
  removeAllParts,
} from "@/redux/slice/serviceInspectionItemSlice";
import Head from "next/head";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { removeSearchItemShow } from "@/redux/slice/searchItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { removeAllEstimateState } from "@/redux/slice/estimateItemShowSlice";
import Loading from "@/app/loading";

const SingleItemViewPage: React.FC = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [editable, setEditable] = useState(false);
  const [itemId, setItemId] = useState<string>("");
useEffect(()=>{
dispatch(setSearchTerm(""))
dispatch(removeAllInspectionItem())
dispatch(removeSearchItemShow())
dispatch(clearAllSelection())
dispatch(removeAllEstimateState());
},[dispatch])
  // Extract item ID directly from the path
  useEffect(() => {
    const pathSegments = pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];
    if (id) setItemId(id);
  }, [pathname]);

  // Fetch service data using the itemId
  const {
    data: serviceData,
    refetch: serviceRefatch,
    isLoading,
    error,
  } = useGetServiceByCodeQuery(itemId, {
    skip: !itemId, 
  });
  // Manage labours and parts in Redux
  useEffect(() => {
    if (serviceData) {
      // Clear previous data immediately
      dispatch(removeAllLabours());
      dispatch(removeAllParts());

      // Use setTimeout to delay dispatching new data
      const timeoutId = setTimeout(() => {
        const labourArray = serviceData?.serviceLabours?.map((item: any) => ({
          serviceCode: item.serviceCode,
          labourId: item.labourId,
          name: item.labour.name,
          ratePerHour: item.labour.ratePerHour,
          requiredHours: item.hours,
        }));

        const partsArray = serviceData?.serviceParts?.map((item: any) => ({
          serviceCode: serviceData.code,
          partId: item.part?.partsId || item?.partId,
          name: item.part?.name,
          unitPrice: item.part.unitPrice,
          provider: item.part.provider,
          installationHours: item.part.installationHours,
          quantity: item?.quantity,
          total:item?.part?.total,
          margin:item?.part?.margin
        }));
        // Dispatch new data after the timeout
        dispatch(addLabours(labourArray));
        dispatch(addParts(partsArray));
      }, 500);

      // Cleanup function to clear timeout if serviceData changes before timeout completes
      return () => clearTimeout(timeoutId);
    }
  }, [serviceData, dispatch]);

  // Show error message if fetching fails
  useEffect(() => {
    if (error) {
      message.error("Failed to fetch service details");
    }
  }, [error]);

  const toggleEditable = () => setEditable((prev) => !prev);

  // Reset state on unmount
  useEffect(() => {
    return () => {
      dispatch(removeAllLabours());
      dispatch(removeAllParts());
      setEditable(false);
      setItemId("");
    };
  }, [dispatch]);
  if(isLoading){
    return<Loading></Loading>
  }

  return (
    <>
      <div className=" page-container">
      <div className="create-title-submit flex">
       <h2 className="page-header">{serviceData?.title || "Service Details"}</h2>
          <div className="create-submit-button">
            <Button
              type="primary"
             className="mt-2 font-bold bg-neutral-800 rounded hover:bg-neutral-700 text-white "
              onClick={toggleEditable}
            >
              {editable ? "View" : "Edit"}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Spin />
          </div>
        ) : serviceData ? (
          <ViewUpdateServiceForm
            key={itemId} 
            service={serviceData}
            setEditable={setEditable}
            editable={editable}
            onUpdateService={() =>
              message.success("Service updated successfully")
            }
            serviceRefatch={serviceRefatch}
          />
        ) : (
          <div>No Service details found</div>
        )}
      </div>
    </>
  );
};

export default SingleItemViewPage;