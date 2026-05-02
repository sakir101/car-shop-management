"use client";

import React, { useEffect, useState } from "react";
import { Button, Modal, message } from "antd";
import {
  useAssignRelatedInspectionMutation,
  useAssignRelatedServiceMutation,
  useCreateSingleLabourMutation,
  useCreateSinglePartMutation,
  useDeleteRelatedInspectionToServiceMutation,
  useDeleteRelatedServiceToServiceMutation,
  useDeleteServiceLabourMutation,
  useDeleteSinglePartMutation,
  useGetUnassignServiceInspectionAllDataServiceQuery,
  useUpdateRelatedInspectionToServiceMutation,
  useUpdateRelatedServiceToServiceMutation,
  useUpdateServiceMutation,
  useUpdateSingleLabourMutation,
  useUpdateSinglePartMutation,
} from "@/redux/api/serviceApi";
import DBServiceItem from "../ServiceItem/DBServiceItem";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import {
  addLabour,
  addPart,
  Labour,
  Part,
  removeLabourById,
  removeLabourSingleData,
  removePartById,
  removePartSingleData,
  setDeleteStatusLabour,
  setDeleteStatusPart,
  setNewInsertLabour,
  setNewInsertPart,
  setUpdateStatusLabour,
  setUpdateStatusPart,
  updateLabour,
  updatePart,
} from "@/redux/slice/serviceInspectionItemSlice";
import SearchInput from "../SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "../SearchItemShow/SearchItemShow";
import RelatedItemShowService from "../RelatedItemShow/RelatedItemShowService";
import RelatedItemShowInspection from "../RelatedItemShow/RelatedItemShowInspection";
import {
  clearAllRelatedItemDB,
  removeAllRelatedItemSlice,
} from "@/redux/slice/relatedItemHandleSlice";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  assignInspectionHandleController,
  assignServiceHandleController,
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import FormUpdate from "../Forms/FormUpdate";
import { clearAllSelection } from "@/redux/slice/selectionSlice";

interface ViewUpdateServiceFormProps {
  service: {
    relatedService: unknown;
    code: string;
    title: string;
    type: string;
    serviceType:string;

    description: string;
    serviceLabours: Array<any>;
    ServiceParts: Array<any>;
    ServiceService_ServiceService_serviceIdToService: Array<any>;
    InspectionItemGeneralService: Array<any>;
    InspectionItemTireService: Array<any>;
    relatedServices: Array<any>;
    serviceInspections: Array<any>;
  };
  isLoading?: boolean;
  editable?: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdateService?: (service: any) => void;
  serviceRefatch: () => void;
}

const ViewUpdateServiceForm: React.FC<ViewUpdateServiceFormProps> = ({
  service: serviceData,
  isLoading,
  editable = true,
  onUpdateService,
  serviceRefatch,
  setEditable,
}) => {
  const dispatch = useAppDispatch();
  const {
    newInsertLabour,
    changeLabour,
    deleteStatusLabour,
    deleteStatusPart,
    updateStatusLabour,
    updateStatusPart,
    changePart,
    newInsertPart,
  } = useAppSelector((state) => state.serviceInspectionItem);
  useEffect(() => {
    dispatch(removeAllRelatedItemSlice());
    dispatch(clearAllRelatedItemDB());
  }, []);
  const [page, setPage] = useState<number>();
  const [updateService] = useUpdateServiceMutation();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const [service, setService] = useState({
    title: "",
    code: "",
    description: "",
    serviceType:"",
  });
  useEffect(() => {
    if (serviceData) {
      setService({
        title: serviceData?.title || "",
        code: serviceData?.code || "",
        description: serviceData?.description || "",
        serviceType: serviceData?.serviceType || "",
      });
    }
  }, [serviceData]);
  const { serviceHandle, inspectionHandle, serviceState, inspectionState } =
    useAppSelector((state) => state.searchItemShow);
  const relatedServices = serviceData?.relatedServices;
  const relatedInspections = serviceData?.serviceInspections;

  const structuredRelatedService = relatedServices.map((item) => ({
    code: item.relatedService.code,
    title: item.relatedService.title,
    type: item.required ? "Required" : "Recommended",
  }));
  const structuredServiceInspections = relatedInspections.map((item) => ({
    code: item.inspection.code,
    title: item.inspection.title,
    type: item.type === "Required" ? "Required" : "Recommended",
  }));

  useEffect(() => {
    if (newInsertLabour) {
      handleNewInsertLabour(changeLabour);
    }
  }, [newInsertLabour]);
  useEffect(() => {
    if (deleteStatusLabour) {
      handleDeleteLabour(changeLabour);
    }
  }, [deleteStatusLabour]);
  useEffect(() => {
    if (updateStatusLabour) {
      handleUpdateLabour(changeLabour);
    }
  }, [updateStatusLabour]);

  useEffect(() => {
    if (newInsertPart) {
      handleNewInsertPart(changePart);
    }
  }, [newInsertPart]);
  useEffect(() => {
    if (deleteStatusPart) {
      handleDeletePart(changePart);
    }
  }, [deleteStatusPart]);

  useEffect(() => {
    if (updateStatusPart) {
      handleUpdatePart(changePart);
    }
  }, [updateStatusPart]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const [createSingleLabour] = useCreateSingleLabourMutation();
  const [deleteServiceLabour] = useDeleteServiceLabourMutation();
  const [updateSingleLabour] = useUpdateSingleLabourMutation();
  const [createSinglePart] = useCreateSinglePartMutation();
  const [deleteSinglePart] = useDeleteSinglePartMutation();
  const [updateSinglePart] = useUpdateSinglePartMutation();
  const [assignRelatedService] = useAssignRelatedServiceMutation();
  const [updateRelatedServiceToService] =
    useUpdateRelatedServiceToServiceMutation();
  const [deleteRelatedServiceToService] =
    useDeleteRelatedServiceToServiceMutation();
  const [deleteRelatedInspectionToService] =
    useDeleteRelatedInspectionToServiceMutation();
  const [assignRelatedInspection] = useAssignRelatedInspectionMutation();
  const [updateRelatedInspectionToService] =
    useUpdateRelatedInspectionToServiceMutation();

  const handleNewInsertLabour = async (newLabour: Labour) => {
    const { serviceCode, requiredHours, ratePerHour, name } = newLabour;
    try {
      const response = await createSingleLabour({
        serviceCode: serviceCode,
        labour: {
          labourName: name,
          ratePerHour: ratePerHour,
          requiredHours: requiredHours,
        },
      }).unwrap();

      if (response) {
        dispatch(
          addLabour({
            serviceCode,
            labourId: response.labourId,
            requiredHours: response.hours,
            ratePerHour: response.ratePerHour,
            name: response.name,
          })
        );

        message.success("Labour added successfully");
      }

      dispatch(removeLabourSingleData());
      dispatch(setNewInsertLabour(false));
    } catch (err) {
      message.error("Failed to add inspection hour. Please try again.");
      dispatch(removeLabourSingleData());
      dispatch(setNewInsertLabour(false));
    }
  };
  const handleNewInsertPart = async (newPart: Part) => {
    try {
      const response = await createSinglePart(newPart).unwrap();
      if (response) {
        dispatch(
          addPart({
            name: response?.name,
            unitPrice: response?.unitPrice,
            serviceCode: response?.serviceId,
            quantity: response?.quantity,
            provider: response?.provider,
            partId: response?.partId,
            installationHours: response?.installationHours,
            total: response.total,
            margin: response.margin
          })
        );

        message.success("Part added successfully");
      }
      dispatch(removePartSingleData());
      dispatch(setNewInsertPart(false));
    } catch (err) {
      message.error("Failed to add Part. Please try again.");
      dispatch(removePartSingleData());
      dispatch(setNewInsertPart(false));
    }
  };

  const handleDeleteLabour = async (newLabour: Labour) => {
    const { serviceCode, labourId } = newLabour;
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this Labour?",
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
      deleteServiceLabour({ labourId, serviceCode })
        .unwrap()
        .then((response) => {
          dispatch(removeLabourById(labourId));
          dispatch(removeLabourSingleData());
          message.success({
            content: "Labour Delete successfully!",
          });
          dispatch(setDeleteStatusLabour(false));
        })
        .catch((error) => {
          dispatch(removeLabourSingleData());
          dispatch(setDeleteStatusLabour(false));
          message.error({
            content: "Labour Delete  failed!",
          });
        });
    } catch (err) {
      message.error("Failed to add Labour. Please try again.");
      dispatch(removeLabourSingleData());
      dispatch(setDeleteStatusLabour(false));
    }
  };

  const handleDeletePart = async (newPart: Part) => {
    const { partId } = newPart;

    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this Part?",
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
      deleteSinglePart(partId)
        .unwrap()
        .then((response) => {
          message.success({
            content: "Part Delete successfully!",
          });
          dispatch(removePartSingleData());
          dispatch(removePartById(partId));
          dispatch(setDeleteStatusPart(false));
        });
    } catch (err) {
      message.error("Failed to add Part. Please try again.");
      dispatch(removePartSingleData());
      dispatch(setDeleteStatusPart(false));
    }
  };

  const handleUpdateLabour = async (changedLabour: Labour) => {
    try {
      const response = await updateSingleLabour(changedLabour).unwrap();

      if (response) {
        dispatch(
          updateLabour({
            labourId: response.labourId,
            requiredHours: response.hours,
            ratePerHour: response.ratePerHour,
            name: response.name,
          })
        );
        dispatch(removeLabourSingleData());
        dispatch(setUpdateStatusLabour(false));
        message.success("Labour added successfully");
      }
    } catch (err) {
      message.error("Failed to Update Labour. Please try again.");
      dispatch(removeLabourSingleData());
      dispatch(setUpdateStatusLabour(false));
    }
  };

  const handleUpdatePart = async (changedPart: Part) => {
    try {
      const response = await updateSinglePart(changePart).unwrap();
      if (response) {
        dispatch(
          updatePart({
            name: response?.name,
            unitPrice: response?.unitPrice,
            serviceCode: response?.serviceCode,
            quantity: response?.quantity,
            provider: response?.provider,
            partId: response?.partId,
            installationHours: response?.installationHours,
            total: response.total,
            margin: response.margin
          })
        );
        dispatch(removePartSingleData());
        dispatch(setUpdateStatusPart(false));
        message.success("Part updated  successfully");
      }
    } catch (err) {
      message.error("Failed to Update Part. Please try again.");
      dispatch(removePartSingleData());
      dispatch(setUpdateStatusPart(false));
    }
  };

  const updateServiceKey = "updateServiceKey";

  const handleUpdate = async () => {
    const updatedService = {
      title: service?.title,
      description: service?.description,
      serviceType:service?.serviceType
    };

    updateService({ code: serviceData.code, data: updatedService })
      .unwrap()
      .then((response) => {
        message.success({
          content: "Service updated successfully",
          key: updateServiceKey,
          duration: 2,
        });
        serviceRefatch();
        onUpdateService && onUpdateService(response);
        setEditable(false);
      })
      .catch((error) => {
        message.error({
          content: "Failed to update service",
          key: updateServiceKey,
          duration: 2,
        });
      })
      .finally(() => {
        message.destroy(updateServiceKey);
      });
  };

  const renderLabourField = () => (
    <div>
      <DBServiceItem item={"labour"} serviceCode={service?.code} stage="" />
    </div>
  );
  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const query: Record<string, any> = {};
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

  const { data: services, refetch } =
    useGetUnassignServiceInspectionAllDataServiceQuery(
      { args: query, code: serviceData?.code },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  const inspectionsServices = services?.data?.data?.data[0] || [];

  const { handleDeleteItemDB, handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );

  useEffect(() => {
    if (handleDeleteItemDB?.code) {
      if (
        handleDeleteItemDB.subType === "Inspection" &&
        handleDeleteItemDB.type === "Inspection"
      ) {
        showDeleteConfirmInspection(handleDeleteItemDB.code);
      } else {
        showDeleteConfirm(handleDeleteItemDB.code);
      }
    }

    if (handleUpdateTypeDB.code) {
      if (
        handleUpdateTypeDB.subType === "Inspection" &&
        handleUpdateTypeDB.type === "Inspection"
      ) {
        const updatedInspectionData = {
          serviceCode: serviceData?.code,
          inspectionCode: handleUpdateTypeDB.code,
          type:
            handleUpdateTypeDB.category === "Required"
              ? "Required"
              : "Recommended",
        };

        handleUpdateInspectionType(updatedInspectionData);
      } else {
        const updatedServiceData = {
          serviceId: serviceData?.code,
          relatedServiceId: handleUpdateTypeDB.code,
          recommended: handleUpdateTypeDB.category === "Recomended",
          required: handleUpdateTypeDB.category === "Required",
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
          await deleteRelatedServiceToService(code).unwrap();
          dispatch(clearAllRelatedItemDB());
          serviceRefatch();
          refetch();
          message.success("Item deleted successfully!");
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
    const serviceCode = serviceData.code;

    Modal.confirm({
      title: "Are you sure you want to delete this inspection?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteRelatedInspectionToService({
            code,
            serviceCode,
          }).unwrap();
          serviceRefatch();
          refetch();
          message.success("Item deleted successfully!");
          dispatch(clearAllRelatedItemDB());
          dispatch(clearAllSelection());
        } catch (error) {
          message.error("Failed to delete the service. Please try again.");
          dispatch(clearAllRelatedItemDB());
        }
      },
      onCancel: () => {
        dispatch(clearAllRelatedItemDB());
      },
    });
  };

  const assignServiceData = serviceState?.map((item) => ({
    serviceId: serviceData?.code,
    relatedServiceId: item.serviceCode,
    recommended: item.type === "Recommended",
    required: item.type === "Required",
  }));

  const assignInspectonData = inspectionState?.map((item) => ({
    serviceCode: serviceData?.code,
    inspectionCode: item.inspectionCode,
    type: item.type === "Required" ? "Required" : "Recommended",
  }));
  useEffect(() => {
    if (serviceHandle && assignServiceData.length > 0) {
      assignService();
    }
    if (inspectionHandle && assignInspectonData.length > 0) {
      assignInspection();
    }
  }, [serviceHandle, inspectionHandle]);

  const assignService = async () => {
    try {
      await assignRelatedService(assignServiceData).unwrap();
      message.success("Service assign successfully!");
      dispatch(assignServiceHandleController(false));
      serviceRefatch();
      refetch();
      dispatch(removeAllServiceItems());
    } catch (error) {
      message.error("Failed to asign the service. Please try again.");
    }
  };
  const assignInspection = async () => {
    try {
      await assignRelatedInspection(assignInspectonData).unwrap();
      message.success("Inspection assign successfully!");
      dispatch(assignInspectionHandleController(false));
      serviceRefatch();
      refetch();
      dispatch(removeAllInspectionItems());
    } catch (error) {
      message.error("Failed to asign the Inspection. Please try again.");
    }
  };
  const handleUpdateServiceType = async (data: any) => {
    try {
      await updateRelatedServiceToService(data).unwrap();
      dispatch(clearAllRelatedItemDB());
      serviceRefatch();
      message.success("Type updated successfully!");
    } catch (error) {
      message.error("Failed to update the service type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };
  const handleUpdateInspectionType = async (data: any) => {
    try {
      await updateRelatedInspectionToService(data).unwrap();
      dispatch(clearAllRelatedItemDB());
      serviceRefatch();
      message.success("Type updated successfully!");
    } catch (error) {
      message.error("Failed to update the inpspection type. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };
  const renderPartField = () => (
    <DBServiceItem item={"part"} serviceCode={service?.code} stage="" />
  );

  const renderRelatedServiceField = (relatedService: any) => {
    return (
      <div>
        <div className="mt-5">
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
        <SearchItemShow data={inspectionsServices} type={true} page="Service" operation="update" />
        <div className="mt-10"></div>
        <RelatedItemShowService
          data={structuredRelatedService}
          type={"Service"}
          subType={"Service"}
        ></RelatedItemShowService>
        <RelatedItemShowInspection
          data={structuredServiceInspections}
          type={"Inspection"}
          subType={"Inspection"}
        ></RelatedItemShowInspection>
      </div>
    );
  };

  return (
    <FormUpdate submitHandler={handleUpdate} formKey="updateService">
      <div className="create-container mt-16 "
          >
        <div>
          <label className="block mb-2 text-gray-700" htmlFor="title">
            Title
          </label>
          <input
            onChange={(e) => handleChange(e)}
            disabled={!editable}
            type="text"
            id="title"
            name="title"
            placeholder="Enter Title"
            value={service?.title || ""}
            className="input-field"
          />
        </div>

       <div className="flex gap-2 items-center">
        <div className="my-2 w-1/2">
          <label className="block mb-2 text-gray-700" htmlFor="code">
            Code
          </label>
          <input
            type="text"
            disabled
            id="code"
            name="code"
            placeholder="Enter Code"
            value={serviceData?.code || ""}
            className="w-full px-3 py-1.5 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="my-2 w-1/2">
            <label className="block mb-2 text-gray-700" htmlFor="serviceType">
              Service Type
            </label>
            <select
             onChange={(e) => handleChange(e)}
              id="serviceType"
              name="serviceType"
              value={service?.serviceType ||""}
             className="input-field"
            >
              <option value="general">General</option>
              <option value="tire">Tire</option>
            </select>
          </div>
                 </div>
          
        <div>
          <label className="block mb-2 text-gray-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter Description"
            value={service?.description || ""}
            disabled={!editable}
            onChange={(e) => handleChange(e)}
            rows={3}
            className="input-field"
          />
        </div>
      </div>

      {editable && (
        <div className="flex justify-center">
          <Button
            htmlType="submit"
            type="primary"
            loading={isLoading}
            className="w-[140px] bg-neutral-800 hover:bg-neutral-700 font-bold mx-auto mt-4"
          >
            Update Service
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2 ">{renderLabourField()}</div>

      <div className="flex flex-col gap-2 ">{renderPartField()}</div>

      <div className="my-5">{renderRelatedServiceField(relatedServices)}</div>
    </FormUpdate>
  );
};

export default ViewUpdateServiceForm;
