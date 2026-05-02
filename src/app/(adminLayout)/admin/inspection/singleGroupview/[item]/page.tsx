"use client";
import React, { useState, useEffect } from "react";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  useAddInspectionHoursMutation,
  useAssignInspectionToGroupMutation,
  useDeleteInspectionHoursToGroupMutation,
  useGetAssignedInspectionsQuery,
  useGetInspectionGroupByCodeQuery,
  useGetInspectionHoursQuery,
  useGetUnassignInspectionsQuery,
  useUnassignInspectionMutation,
  useUpdateInspectionGroupMutation,
  useUpdateInspectionHoursMutation,
} from "@/redux/api/inspectionGroupApi";
import { Button, message, Modal } from "antd";
import {
  removeAllInspectionItems,
  removeServiceHandleController,
} from "@/redux/slice/searchItemShowSlice";
import {
  addInspectionHours,
  removeAllInspectionHours,
  removeAllInspectionItem,
  removeNewInsertInspectionHour,
  setDeleteStatusInspectionHour,
  setUpdateStatusInspectionHour,
} from "@/redux/slice/serviceInspectionItemSlice";
import { usePathname, useSearchParams } from "next/navigation";
import FormUpdate from "@/components/Forms/FormUpdate";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import RelatedItemShowInspection from "@/components/RelatedItemShow/RelatedItemShowInspection";
import { clearAllRelatedItemDB } from "@/redux/slice/relatedItemHandleSlice";
import DBInspectionItem from "@/components/inspectionItem/DBInspectionItem";
import Loading from "@/app/loading";

const GroupUpdate = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSearchTerm(""));
    dispatch(removeAllInspectionItem());
  }, []);
  const query: Record<string, any> = {};

  // dispatch(removeAllState());
  const [itemCode, setItemCode] = useState<string>("");

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { inspectionState } = useAppSelector((state) => state.searchItemShow);
  const { inspectionHandle } = useAppSelector((state) => state.searchItemShow);
  const { deleteStatusInspectionHour, updateStatusInspectionHour } =
    useAppSelector((state) => state.serviceInspectionItem);
  const { handleDeleteItemDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );
  const { changeInspectionHour } = useAppSelector(
    (state) => state.serviceInspectionItem
  );

  const { newInsertInspectionHour } = useAppSelector(
    (state) => state.serviceInspectionItem
  );

  const inspectionsCode = inspectionState.map((item) => item.inspectionCode);
  const [assignInspectionToGroup] = useAssignInspectionToGroupMutation();
  const [unassignInspection] = useUnassignInspectionMutation();
  const [addedInspectionHours] = useAddInspectionHoursMutation();
  const [deleteInspectionHoursToGroup] = useDeleteInspectionHoursToGroupMutation();
  const [updateInspectionHours] = useUpdateInspectionHoursMutation();
  const [updateInspectionGroup] = useUpdateInspectionGroupMutation();

  const { data: inspectionHours } = useGetInspectionHoursQuery(itemCode);
  const inspectionHourArray = inspectionHours?.map(
    (item: { InspectionHour: any }) => item.InspectionHour
  );
  const { data ,isLoading:groupLoading} = useGetInspectionGroupByCodeQuery(itemCode, {
    refetchOnMountOrArgChange: true,
  });

  const [inspections, setInspections] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    if (inspectionHours) {
      dispatch(removeAllInspectionHours());
      const inspectionHour = inspectionHourArray?.map((item: any) => ({
        inspectionHourId: item.id,
        inspectionHours: item.inspectionHours,
        inspectionHourlyRate: item.inspectionHourlyRate,
      }));
      dispatch(addInspectionHours(inspectionHour));
    }
  }, [inspectionHours, dispatch]);

  useEffect(() => {
    if (data) {
      setInspections({
        name: data?.name || "",
        code: data?.code || "",
        description: data?.description || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInspections((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setItemCode(extractCode);
    }
  }, [pathname, searchParams]);

  const { data: inspection, refetch: UnAssignInspection,isLoading} =
    useGetUnassignInspectionsQuery(
      { code: itemCode, args: query },
      {
        refetchOnMountOrArgChange: true,
      }
    );
  const inspectionData = inspection?.data;
  const { data: GroupInspections } = useGetAssignedInspectionsQuery({
    code: itemCode,
    args: query,
  });

  useEffect(() => {
    if (inspectionHandle && inspectionState.length > 0) {
      assignInspectionHandle();
    }
  }, [inspectionHandle]);
  useEffect(() => {
    if (deleteStatusInspectionHour) {
      handleDeleteInspectionHour(changeInspectionHour);
    }
  }, [deleteStatusInspectionHour]);

  useEffect(() => {
    if (updateStatusInspectionHour) {
      handleUpdateInspectionHour(changeInspectionHour);
    }
  }, [updateStatusInspectionHour]);

  useEffect(() => {
    if (handleDeleteItemDB && handleDeleteItemDB.code) {
      deleteInspectionDB();
    }
  }, [handleDeleteItemDB]);

  useEffect(() => {
    if (newInsertInspectionHour) {
      assignInspectionHour(changeInspectionHour);
    }
  }, [newInsertInspectionHour]);

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const assignInspectionHandle = async () => {
    try {
      await assignInspectionToGroup({
        code: itemCode,
        data: { inspections: inspectionsCode },
      })
        .unwrap()
        .then(() => {
          message.success("Inspection added successfully");
          UnAssignInspection();
          dispatch(removeAllInspectionItems());
          dispatch(removeServiceHandleController());
        });
    } catch (err) {
      dispatch(removeServiceHandleController());
      message.error("Failed to assign inspections. Please try again.");
    }
  };
  const deleteInspectionDB = async () => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this Inspection?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(clearAllRelatedItemDB());
      return;
    }
    try {
      await unassignInspection({
        inspectionGroupCode: itemCode,
        inspectionCode: handleDeleteItemDB?.code,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection unassign successfully");
        });
    } catch (err) {
      dispatch(clearAllRelatedItemDB());
      message.error("Failed to unassign inspections. Please try again.");
    }
  };
  const assignInspectionHour = async (InspectionHour: any) => {
    try {
      await addedInspectionHours({
        code: itemCode,
        data: InspectionHour,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection Hour added successfully");
          dispatch(removeNewInsertInspectionHour());
        });
    } catch (err) {
      dispatch(removeNewInsertInspectionHour());
      message.error("Failed to assign inspections. Please try again.");
    }
  };
  const handleDeleteInspectionHour = async (inspectionHoure: any) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Are you sure you want to delete this InspectionHour?",
        content: "This action cannot be undone.",
        okText: "Yes, delete",
        okType: "danger",
        cancelText: "No, cancel",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (!confirmed) {
      dispatch(setDeleteStatusInspectionHour(false));
      return;
    }
    try {
      await deleteInspectionHoursToGroup({
        inspectionGroupCode: itemCode,
        inspectionHoursId: inspectionHoure?.inspectionHourId,
      })
        .unwrap()
        .then(() => {
          message.success("Inspection Delete successfully");
          dispatch(setDeleteStatusInspectionHour(false));
        });
    } catch (err) {
      dispatch(setDeleteStatusInspectionHour(false));
      message.error("Failed to delete inspections. Please try again.");
    }
  };
  const handleUpdateInspectionHour = async (inspectionHoure: any) => {
    try {
      await updateInspectionHours({
        inspectionGroupCode: itemCode,
        inspectionHoursId: inspectionHoure?.inspectionHourId,
        data: { inspectionHour: inspectionHoure },
      })
        .unwrap()
        .then(() => {
          message.success("InspectionHour updated successfully");
          dispatch(setUpdateStatusInspectionHour(false));
        });
    } catch (err) {
      dispatch(setUpdateStatusInspectionHour(false));
      message.error("Failed to update inspectionHour. Please try again.");
    }
  };
  const handleUpdateInspectionGroup = async () => {
    try {
      await updateInspectionGroup({ code: itemCode, data: inspections })
        .unwrap()
        .then(() => {
          message.success("Inspection Group updated successfully");
        });
    } catch (error: any) {
      message.error(`Failed to Update group Group: ${error.data.message}.`);
    }
  };
   // waiting for data
  if(groupLoading){
    return <Loading></Loading>
  }

  return (
    <div className="page-container">
      <div className="create-title-submit">
      <h2 className="page-header"> Update inspection group</h2>
   </div>
      <FormUpdate
        submitHandler={handleUpdateInspectionGroup}
        formKey="create-item-general"
      >
        <div
        className=" create-container mt-16 "
        >
          <div>
            <label className="block mb-2 text-gray-700" htmlFor="itemName">
              Item Name
            </label>
            <input
              onChange={(e) => handleChange(e)}
              type="text"
              id="name"
              name="name"
              placeholder="Enter your item name"
              value={inspections?.name || ""}
              className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="my-2" >
            <label className="block  text-gray-700" htmlFor="itemName">
              Name
            </label>
            <input
              type="text"
              disabled
              id="code"
              placeholder="code"
              defaultValue={inspections?.code}
              className="w-full px-3 py-3 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div >
            <label className="block mb-2 text-gray-700" htmlFor="code">
              description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="description"
              defaultValue={inspections?.description}
              className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
              rows={3}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="create-submit-button">
          <Button type="primary" htmlType="submit" className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white ">
            Update
          </Button>
        </div>
      </FormUpdate>
      <div className="mt-3">
        <div>
          <label htmlFor="">Search for Inspection</label>
        </div>
        <div className="flex items-center">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>
      </div>
      <SearchItemShow
        data={inspectionData}
        type={true}
        page="inspection-group"
        operation="update" 
      />
      {/* <SearchAssignInspectionShow title={`Inspection`} page={'inspection-group'} style={true} /> */}
      <RelatedItemShowInspection
        data={GroupInspections?.data}
        type={"inspection-group"}
        subType="Inspection"
      />
      <DBInspectionItem item="inspectionHour" stage=""></DBInspectionItem>
    </div>
  );
};
export default GroupUpdate;
