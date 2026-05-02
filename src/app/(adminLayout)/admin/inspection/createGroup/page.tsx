"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import FormInput from "@/components/Forms/FormInput";
import Form from "@/components/Forms/Form";
import FormTextArea from "@/components/Forms/FormTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { inspectionGroupSchema } from "@/schemas/inspectionGroup";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  useCreateInspectionGroupMutation,
  useGetAllInspectionsFromGroupQuery,
} from "@/redux/api/inspectionGroupApi";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import SearchAssignInspectionShow from "@/components/SearchAssignItemShow/SearchAssignInspectionShow";
import { Button, message } from "antd";
import { CheckCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import {
  removeAllState,
  removeAllTempInspectionItems,
  removeTempInspectionHour,
} from "@/redux/slice/serviceInspectionItemSlice";
import InspectionItem from "@/components/inspectionItem/inspectionItem";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
} from "@/redux/slice/estimateItemShowSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import { removeAllAppointmentState } from "@/redux/slice/appointmentSlice";

const GroupCreate = () => {
  const query: Record<string, any> = {};
  const dispatch = useAppDispatch();
  const [page, setPage] = useState<number>();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { inspectionState } = useAppSelector((state) => state.searchItemShow);
  const {
    tempInspectionHour,
    tempInspectionTotalAmount,
    tempInspectionTotalHours,
  } = useAppSelector((state) => state.serviceInspectionItem);
  const [createInspectionGroup] = useCreateInspectionGroupMutation();
  query["searchTerm"] = searchTerm;
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
  }, [dispatch]);

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

  const { data: inspections, refetch } = useGetAllInspectionsFromGroupQuery(
    query,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const inspectionData = inspections?.data;
  const [sortedInspection, setSortedInspection] = useState<any>([]);
const [showAdded,setShowAdded]=useState<boolean>(true)
useEffect(() => {
  if (inspectionData) {
    setSortedInspection(inspectionData);
  }
}, [inspectionData]);
 
  
const handleAddedInspectionFilter = () => {
  const filteredInspection = inspectionData?.filter(stateItem =>
    inspectionState.some(inspection => inspection.inspectionCode === stateItem.code)
  );
  setSortedInspection(filteredInspection)
  setShowAdded(false)
};
const handleAllInspection = () => {

  setSortedInspection(inspectionData)
  setShowAdded(true)
};

  const onSubmit = async (value: any) => {
    const { code, ...others } = value;
    const data = {
      code: `IG-${value.code}`,
      ...others,
      totalHours: tempInspectionTotalHours,
      totalAmount: tempInspectionTotalAmount,
      inspections: inspectionState.map((item) => item.inspectionCode),
      inspectionHours: tempInspectionHour,
    };
    try {
      await createInspectionGroup({ data }).unwrap();
      message.success("Successfully added Group data.");
      dispatch(setResetStatus(true));
      refetch();
      dispatch(removeAllInspectionItems());
      dispatch(removeAllTempInspectionItems());
      dispatch(clearAllSelection());
    } catch (error: any) {
      message.error(`Failed to add Group: ${error.data.message}.`);
      dispatch(clearResetStatus());
    }
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  return (
   <div className="page-container">
      <div className="create-title-submit">
    <h2 className="page-header">Create Inspection Group</h2>
    </div>
      <Form
        submitHandler={onSubmit}
        resolver={yupResolver(inspectionGroupSchema)}
        formKey="create-inspection-group"
        className="pt-16"
      >
        <div
         
          className=" create-container  "
        >
          <div className="flex justify-between gap-2">
            <div className="w-full">
            <FormInput
              name="name"
              type="text"
              size="middle"
              label="Inspection group name"
              placeholder="Inspection group"
              required
            />
          </div>
          <div className="w-full">
            <FormInput
              name="code"
              type="text"
              size="middle"
              label="Code"
              placeholder="Code"
              required
            />
          </div>
          </div>
          <div >
            <FormTextArea
              name="description"
              label="Description"
              placeholder="Description"
              rows={2}
              required
            />
          </div>
        </div>
        <div className="create-submit-button">
          <Button type="primary"  htmlType="submit" className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white ">
            Save
          </Button>
        </div>
      </Form>
      <div className="mt-5">
        <div>
          <label htmlFor="">Search for Inspection</label>
        </div>
        <div className="flex items-center gap-1">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
            {showAdded?<Button
              type="default"
              className=" rounded py-[15px]"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={handleAddedInspectionFilter}
            >
              Added
            </Button>: <Button
              type="default"
              className=" rounded py-[15px]"
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={handleAllInspection}
            >
              All
            </Button>}
        </div>
      </div>
      <SearchItemShow
        data={sortedInspection}
        type={true}
        page="inspection-group"
      />
      <SearchAssignInspectionShow
        title={`Inspection`}
        page={"inspection-group"}
        style={false}
      />
      <InspectionItem inspectionCode={""} item="inspectionHour" stage="" />
    </div>
  );
};

export default GroupCreate;
