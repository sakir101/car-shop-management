"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import { Button, message, Select } from "antd";
import { CheckCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import ServiceItem from "../ServiceItem/ServiceItem";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import SearchItemShow from "../SearchItemShow/SearchItemShow";
import SearchAssignServiceShow from "../SearchAssignItemShow/SearchAssignServiceShow";
import SearchAssignInspectionShow from "../SearchAssignItemShow/SearchAssignInspectionShow";
import { useGetServiceInspectionAllDataQuery } from "@/redux/api/serviceApi";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchInput from "../SearchbarComponent/SearchbarComponent";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  removeAllEstimateState,
} from "@/redux/slice/estimateItemShowSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { removeAllAppointmentState } from "@/redux/slice/appointmentSlice";
import { Option } from "antd/es/mentions";
import FormSelectField from "../Forms/FormSelectField";
import { yupResolver } from "@hookform/resolvers/yup";
import { serviceValidation } from "@/schemas/service";

interface CreateServiceFormProps {
  service?: any;
  isLoading?: boolean;
  editable?: boolean;
  onSubmitForm: (service: any) => void;
}

const CreateServiceForm: React.FC<CreateServiceFormProps> = ({
  service,
  isLoading,
  editable = false,
  onSubmitForm,
}) => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { inspectionState, serviceState } = useAppSelector(
    (state) => state.searchItemShow
  );
  const dispatch = useAppDispatch();
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
    dispatch(removeSearchItemShow());
    dispatch(removeAllAppointmentState());
    dispatch(removeAllEstimateState());

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
  const { tempLabour, tempPart } = useAppSelector(
    (state) => state.serviceInspectionItem
  );

  const updatedLabourDetails = tempLabour.map(
    ({ serviceCode, ...rest }) => rest
  );
  const updatedPartsDetails = tempPart.map(({ serviceCode, ...rest }) => rest);
  const [parts, setParts] = React.useState<number>(1);

  const { data } = useGetServiceInspectionAllDataQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const inspectionsServices = data?.data;
  const [sortedServiceInspection, setSortedServiceInspection] = useState<any>([]);
  const [showAdded,setShowAdded]=useState<boolean>(true)
  
  // first time come undifiend that's why use this
  useEffect(() => {
    if (inspectionsServices) {
      setSortedServiceInspection(inspectionsServices);
    }
  }, [inspectionsServices]);
  
  //sort added serviceInspection
    const handleAddedServiceInspectionFilter = () => {
    const filteredService = inspectionsServices?.filter(stateItem =>
      serviceState.some(serviceItem => serviceItem.serviceCode === stateItem.code)
    );
    const filteredInspection = inspectionsServices?.filter(stateItem =>
      inspectionState.some(inspectionItem => inspectionItem.inspectionCode === stateItem.code)
    );
    setSortedServiceInspection([...(filteredService || []), ...(filteredInspection || [])]);
  
    setShowAdded(false)
  };
  // useEffect(()=>{
  //   handleAddedServiceInspectionFilter()
  // },[checkboxStates])
  
  // set all serviceInspection in box
  const handleAllServiceInspection = () => {
    setSortedServiceInspection(inspectionsServices)
    setShowAdded(true)
  };
  const FormDataModifier = (data: any) => {
    if(!data.serviceType){
      return message.error('Service Type is required!')
    }
    const serviceData = {
      title: data.title,
      description: data.description,
      code: data.code,
      serviceType:data.serviceType,
      serviceLabours: updatedLabourDetails,
      serviceParts: updatedPartsDetails,
      relatedServices: serviceState.map((service) => ({
        relatedServiceId: service.serviceCode,
        required: service.type === "Required" ? true : false,
        recommended: service.type === "Required" ? false : true,
      })),
      relatedInspection: inspectionState.map((inspection) => ({
        inspectionType: inspection.type,
        inspectionItemCode: inspection.inspectionCode,
        type: inspection.type ? "Required" : "Recommended",
        required: inspection.type === "Required" ? true : false,
        recommended: inspection.type === "Required" ? false : true,
      })),
    };

    onSubmitForm(serviceData);
  };
  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const renderFields = (
    count: number,
    renderFunction: (index: number) => JSX.Element
  ) => Array.from({ length: count }, (_, index) => renderFunction(index));

  const renderlabourField = () => (
    <ServiceItem serviceCode={"x"} item="labour" stage="" />
  );

  const renderPartField = () => (
    <ServiceItem serviceCode={"x"} item="part" stage="" />
  );

  return (
    <Form
      formKey="serviceCreate"
      className="flex flex-col "
      submitHandler={FormDataModifier}
      resolver={yupResolver(serviceValidation)}
    >
      <div
        className=" create-container mt-16 "
      >
        <FormInput
          disabled={editable}
          defaultValue={service?.title || ""}
          name="title"
          label="Title"
          placeholder="Enter service title"
          required
        />
     <div className="flex gap-2 items-start w-full">
  {/* Code input */}
  <div className="w-1/2">
    <FormInput
      disabled={editable}
      defaultValue={service?.code || ""}
      name="code"
      label="Code"
      placeholder="Enter service code"
      required
    />
  </div>

          {/* Select type */}
          <div className="w-1/2">
          <FormSelectField
            name="serviceType"
            label="Select Type"
            placeholder="Select type"
            required
            options={[
              { label: "Tire", value: "tire" },
              { label: "General", value: "general" },
            ]}
          />
        </div>
        </div>
        <FormTextArea
          disabled={editable}
          value={service?.description || ""}
          name="description"
          label="Description"
          placeholder="Enter service description"
         
        />
      </div>
      <div>{renderFields(parts, renderPartField)}</div>
      <div>{renderlabourField()}</div>
      <div className="mt-5">
        <div>
          <label htmlFor="">Search for Service / Inspection</label>
        </div>
        <div className="flex items-center gap-1">
          <SearchInput
            placeholder="Search..." // Pass props as needed
            size="middle"
            resetFilters={resetFilters}
          />
          {showAdded?<Button
             type="default"
             size="small"
             className=" rounded py-[15px]"
             icon={<CheckCircleOutlined />}
             onClick={handleAddedServiceInspectionFilter}
           >
             Added
           </Button>: <Button
             type="default"
             size="small"
             className=" rounded py-[15px]"
             icon={<UnorderedListOutlined />}
             onClick={handleAllServiceInspection}
           >
             All
           </Button>}
        </div>
      </div>
      <SearchItemShow data={sortedServiceInspection} type={true} />
      <SearchAssignServiceShow title={`Service`} style={false} />
      <SearchAssignInspectionShow title={`Inspection`} style={false} />

      <div className="create-submit-button">
        <Button
        disabled={editable}
        loading={isLoading}
        htmlType="submit"
        type="primary"
        className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white "
      >
        Save
      </Button>
      </div>
    </Form>
  );
};

export default CreateServiceForm;
