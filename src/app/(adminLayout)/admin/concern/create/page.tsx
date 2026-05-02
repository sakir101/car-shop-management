"use client";

import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  useConcernCreateMutation,
  useGetServiceInspectionAllDataQuery,
} from "@/redux/api/concernApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { CheckCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { concernSchema } from "@/schemas/concern";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import SearchAssignServiceShow from "@/components/SearchAssignItemShow/SearchAssignServiceShow";
import SearchAssignInspectionShow from "@/components/SearchAssignItemShow/SearchAssignInspectionShow";

import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import { removeAllAppointmentState } from "@/redux/slice/appointmentSlice";
import { removeAllEstimateState } from "@/redux/slice/estimateItemShowSlice";

const ConcernCreate = () => {
  const query: Record<string, any> = {};
  let pageTitle = "Create Concern";

  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { inspectionState, serviceState } = useAppSelector(
    (state) => state.searchItemShow
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(setSearchTerm(""));
    dispatch(clearAllSelection());
    dispatch(removeSearchItemShow());
    dispatch(removeAllAppointmentState());
    dispatch(removeAllEstimateState());
  }, [dispatch]);

  query["searchTerm"] = searchTerm;
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const [concernCreate] = useConcernCreateMutation();


  const { data} = useGetServiceInspectionAllDataQuery(
    query,
    {
      refetchOnMountOrArgChange: true,
    }
  );

const inspectionsServices = data?.data;
const [sortedServiceInspection, setSortedServiceInspection] = useState<any>([]);
const [showAdded,setShowAdded]=useState<boolean>(true)


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

// set all serviceInspection in box
const handleAllServiceInspection = () => {
  setSortedServiceInspection(inspectionsServices)
  setShowAdded(true)
};


// create Concern 
  const addDetailsConcern = async (value: any) => {
    const data = {
      code: `CN-${value.code}`,
      title: value.title,
      description: value.description,
      services: serviceState,
      inspections: inspectionState,
    };

    try {
      await concernCreate({ data }).unwrap();
      message.success("Successfully added concern data.");
      dispatch(removeAllServiceItems());
      dispatch(removeAllInspectionItems());
      dispatch(clearAllSelection());
      dispatch(setResetStatus(true));
    } catch (error: any) {
      message.error(`Failed to add concern: ${error.data.message}.`);
      dispatch(clearResetStatus());
    }
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="page-container">
      <div className="create-title-submit">
           <h2 className="page-header">Create Concern</h2>
      </div>
      <div>
        <Form
        className="pt-16"
          submitHandler={addDetailsConcern}
          {...(pageTitle === "Create Concern"
            ? { resolver: yupResolver(concernSchema) }
            : {})}
          formKey="createConcern"
        >
          <div
            className=" create-container "
          >
            <div className="flex justify-between gap-2">
              <div className="w-full ">
              <FormInput
                className="rounded"
                name="title"
                type="text"
                size="middle"
                label="Title"
                placeholder="Title"
                required
              />
            </div>
            <div className=" w-full">
              <FormInput
                name="code"
                size="middle"
                type="text"
                label="Code"
                placeholder="Code"
                required
              />
            </div>
            </div>
            <div className="">
              <FormTextArea
                name="description"
                label="Description"
                rows={2}
                placeholder="Description"
                required
              />
            </div>
          </div>
          <div className="mt-2">
            <div>
              <label htmlFor="">Search for Service / Inspection</label>
            </div>
            <div className="flex items-center gap-1">
              <SearchInput
                placeholder="Search..."
                size="large"
                resetFilters={resetFilters}
              />
                 {showAdded?<Button
                 className=" rounded py-[15px]"
                   
                  size="small"
                   icon={<CheckCircleOutlined />}
                   onClick={handleAddedServiceInspectionFilter}
                 >
                   Added
                 </Button>: <Button
                 className=" rounded py-[15px]"
                
                   size="small"
                   icon={<UnorderedListOutlined />}
                   onClick={handleAllServiceInspection}
                 >
                   All
                 </Button>}
     
            </div>
          </div>
          {/* search item Card */}
          <SearchItemShow data={sortedServiceInspection} type={true} />

          <div className="create-submit-button">
            <Button type="primary" htmlType="submit" className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white ">
              Save
            </Button>
          </div>
        </Form>
      </div>

      {/* Service View starts*/}
      <SearchAssignServiceShow title={`Service`} style={false} />
      {/* Service View ends*/}

      {/* Inspection view starts */}
      <SearchAssignInspectionShow title={`Inspection`} style={false} />
      {/* Inspection view ends */}
    </div>
  );
};

export default ConcernCreate;
