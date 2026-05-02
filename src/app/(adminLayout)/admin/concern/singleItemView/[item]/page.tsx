"use client";
import { Button, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  useAssignConcernToInspectionMutation,
  useAssignConcernToServiceMutation,
  useGetConcernInspectionsQuery,
  useGetConcernServicesQuery,
  useGetUnassignServiceInspectionAllDataQuery,
  useUpdateRelatedInspectionMutation,
  useUpdateRelatedServiceMutation,
  useDeleteRelatedinspectionMutation,
  useDeleteRelatedServiceMutation,
  useUpdateConcernMutation,
  useGetConcernsByCodeQuery,
} from "@/redux/api/concernApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  assignInspectionHandleController,
  assignServiceHandleController,
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import SearchAssignServiceShow from "@/components/SearchAssignItemShow/SearchAssignServiceShow";
import SearchAssignInspectionShow from "@/components/SearchAssignItemShow/SearchAssignInspectionShow";
import {
  removeAllInspectionItem,
  removeAllState,
} from "@/redux/slice/serviceInspectionItemSlice";
import FormUpdate from "@/components/Forms/FormUpdate";
import RelatedItemShowInspection from "@/components/RelatedItemShow/RelatedItemShowInspection";
import RelatedItemShowService from "@/components/RelatedItemShow/RelatedItemShowService";
import {
  clearAllRelatedItemDB,
  removeAllRelatedItemSlice,
} from "@/redux/slice/relatedItemHandleSlice";

import { usePathname, useSearchParams } from "next/navigation";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import Loading from "@/app/loading";
import { removeAllEstimateState } from "@/redux/slice/estimateItemShowSlice";
const ConcernCreate = () => {
  const [itemCode, setItemCode] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSearchTerm(""));
    dispatch(removeAllInspectionItem());
    dispatch(removeSearchItemShow());
    dispatch(clearAllSelection());
    dispatch(removeAllRelatedItemSlice());
    dispatch(removeSearchItemShow());
    dispatch(removeAllEstimateState());
  }, [dispatch]);
  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setItemCode(extractCode);
    }
  }, [pathname, searchParams]);

  const searchTerm = useAppSelector((state) => state.search.searchTerm);

  const [assignConcernToService] = useAssignConcernToServiceMutation();
  const [assignConcernToInspection] = useAssignConcernToInspectionMutation();
  const [deleteRelatedService] = useDeleteRelatedServiceMutation();
  const [deleteRelatedinspection] = useDeleteRelatedinspectionMutation();
  const [updateRelatedService] = useUpdateRelatedServiceMutation();
  const [updateRelatedInspection] = useUpdateRelatedInspectionMutation();
  const [updateConcern] = useUpdateConcernMutation();

  const { serviceHandle, inspectionHandle, serviceState, inspectionState } =
    useAppSelector((state) => state.searchItemShow);

  const { data: concernService, refetch: rServiceRefettch } =
    useGetConcernServicesQuery(
      { code: itemCode },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const { data: concernInspection, refetch: rInspectionRefetch } =
    useGetConcernInspectionsQuery({ code: itemCode });

  const structuredConcernInspections = concernInspection?.map(
    (item: { concernInspection: any; inspection: any }) => ({
      title: item?.inspection?.title,
      code: item?.concernInspection?.inspectionCode,
      type: item?.concernInspection?.type,
    })
  );
  const structuredConcernServices = concernService?.map(
    (item: { concernService: any; service: any }) => ({
      title: item?.service?.title,
      code: item?.concernService?.serviceCode,
      type: item?.concernService?.type,
    })
  );

  
  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
    dispatch(clearAllRelatedItemDB());
  }, [dispatch]);
  useEffect(() => {
    dispatch(removeAllInspectionItem());
    dispatch(removeAllRelatedItemSlice());
  }, [dispatch]);

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
  const { data, isLoading } = useGetConcernsByCodeQuery(itemCode, {
    refetchOnMountOrArgChange: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConcerns((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [concerns, setConcerns] = useState({
    title: "",
    code: "",
    description: "",
  });
  useEffect(() => {
    if (data) {
      setConcerns({
        title: data?.title || "",
        code: data?.code || "",
        description: data?.description || "",
      });
    }
  }, [data]);

  const { data: services, refetch: serviceInspection } =
    useGetUnassignServiceInspectionAllDataQuery(
      { args: query, code: itemCode },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const inspectionsServices = services?.data || [];
  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const { handleDeleteItemDB, handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );

  useEffect(() => {
    if (handleDeleteItemDB.code) {
      if (
        handleDeleteItemDB.subType === "Inspection" &&
        handleDeleteItemDB.type === "Inspection"
      ) {
        showDeleteConfirmInspection(handleDeleteItemDB.code);
      } else {
        showDeleteConfirm(handleDeleteItemDB.code);
      }

      //
    }
    if (handleUpdateTypeDB.code) {
      if (
        handleUpdateTypeDB.subType === "Inspection" &&
        handleUpdateTypeDB.type === "Inspection"
      ) {
        const updatedInspectionData = {
          concernCode: itemCode,
          inspectionCode: handleUpdateTypeDB.code,
          type:
            handleUpdateTypeDB.category === "Required"
              ? "Required"
              : "Recommended",
        };

        handleUpdateInspectionType(updatedInspectionData);
      } else {
        const updatedServiceData = {
          concernCode: itemCode,
          serviceCode: handleUpdateTypeDB.code,
          type:
            handleUpdateTypeDB.category === "Required"
              ? "Required"
              : "Recommended",
        };
        handleUpdateServiceType(updatedServiceData);
      }
    }
  }, [handleDeleteItemDB, handleUpdateTypeDB]);

  const showDeleteConfirm = (code: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this service?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteRelatedService({
            code: itemCode,
            serviceCode: code,
          }).unwrap();
          message.success("Item deleted successfully!");
          rServiceRefettch();
          serviceInspection();

          dispatch(clearAllRelatedItemDB());
          dispatch(clearAllSelection());
        } catch (error) {
          message.error("Failed to delete the service. Please try again.");
          dispatch(clearAllRelatedItemDB());
        }
      },
      onCancel: async () => {
        dispatch(clearAllRelatedItemDB());
      },
    });
  };

  const showDeleteConfirmInspection = (code: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this inspection?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteRelatedinspection({
            code: itemCode,
            inspectionCode: code,
          }).unwrap();
          rInspectionRefetch();
          serviceInspection();
          message.success("Item deleted successfully!");
          dispatch(clearAllSelection());
          dispatch(clearAllRelatedItemDB());
        } catch (error) {
          message.error("Failed to delete the service. Please try again.");
          dispatch(clearAllRelatedItemDB());
        }
      },
      onCancel: async () => {
        dispatch(clearAllRelatedItemDB());
      },
    });
  };

  useEffect(() => {
    if (serviceHandle && serviceState.length > 0) {
      assignService();
    }
  }, [serviceHandle]);

  useEffect(() => {
    if (inspectionHandle && inspectionState.length > 0) {
      assignInspection();
    }
  }, [inspectionHandle]);

  const assignService = async () => {
    try {
      await assignConcernToService({
        data: serviceState,
        code: itemCode,
      }).unwrap();
      message.success("Service assign successfully!");
      dispatch(assignServiceHandleController(false));
      rServiceRefettch();
      serviceInspection();
      dispatch(removeAllServiceItems());
    } catch (error) {
      dispatch(assignServiceHandleController(false));
      message.error("Failed to assign the service. Please try again.");
    }
  };

  const assignInspection = async () => {
    try {
      await assignConcernToInspection({
        data: inspectionState,
        code: itemCode,
      }).unwrap();
      dispatch(assignInspectionHandleController(false));
      rInspectionRefetch();
      serviceInspection();
      message.success("Inspection assign successfully!");
      dispatch(removeAllInspectionItems());
    } catch (error) {
      dispatch(assignInspectionHandleController(false));
      message.error("Failed to assign the inspection Please try again.");
    }
  };

  const handleUpdateServiceType = async (data: any) => {
    try {
      await updateRelatedService(data).unwrap();
      rServiceRefettch();
      message.success("Type updated successfully!");
      dispatch(clearAllRelatedItemDB());
    } catch (error) {
      message.error("Failed to update the service type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };
  const handleUpdateInspectionType = async (data: any) => {
    try {
      await updateRelatedInspection(data).unwrap();
      rInspectionRefetch();
      message.success("Type updated successfully!");
      dispatch(clearAllRelatedItemDB());
    } catch (error) {
      message.error("Failed to update the inspection type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };

  const handleUpdateConcern = async () => {
    try {
      await updateConcern({ code: itemCode, data: concerns })
        .unwrap()
        .then(() => {
          message.success("Concern updated successfully");
        });
    } catch (error: any) {
      message.error(`Failed to Concern: ${error.data.message}.`);
    }
  };
  // waiting for data
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="page-container">
      <div className="create-title-submit">
        <h2 className="page-header">Update Concern</h2>
      </div>
      <div>
        <FormUpdate submitHandler={handleUpdateConcern} formKey="createConcern" >
          <div
           
            className="create-container mt-16"
          >
            <div >
              <label className="block mb-2 text-gray-700" htmlFor="itemName">
                Title
              </label>
              <input
                onChange={(e) => handleChange(e)}
                type="text"
                id="title"
                name="title"
                placeholder="Enter your item name"
                value={concerns?.title || ""}
               className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mt-1" >
              <label className="block mb-2 text-gray-700" htmlFor="itemCode">
              code
              </label>
              <input
                type="text"
                disabled
                id="code"
                placeholder="code"
                defaultValue={concerns?.code}
                className="w-full px-3 py-2 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mt-1">
              <label className="block mb-2 text-gray-700" htmlFor="code">
                description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="description"
                defaultValue={concerns?.description}
                 className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
                rows={3}
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>

          <div className="create-submit-button">
            <Button type="primary" htmlType="submit"  className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white ">
              Update
            </Button>
          </div>
        </FormUpdate>
      </div>
      <div className="mt-2">
        <div>
          <label htmlFor="">Search for Service / Inspection</label>
        </div>
        <div className="flex items-center">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>
      </div>
      <SearchItemShow data={inspectionsServices} type={true} page="Service" operation="update"  />
      <div className="mt-10"></div>
      {/* <SearchAssignServiceShow title={`Related Service`} style={true} />
              <SearchAssignInspectionShow title={`Related Inspection`} style={true} /> */}
      <RelatedItemShowService
        data={structuredConcernServices}
        type={"Service"}
        subType={"Service"}
      ></RelatedItemShowService>
      <RelatedItemShowInspection
        data={structuredConcernInspections}
        type={"Inspection"}
        subType={"Inspection"}
      ></RelatedItemShowInspection>
    </div>
  );
};

export default ConcernCreate;
