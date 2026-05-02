"use client";

import {
  useCreateInspectionMapMutation,
  useCreateInspectionProblemMutation,
  useCreateInspectionSolutionGeneralMutation,
  useGetInspectionItemGeneralServicesQuery,
  useGetSingleItemQuery,
  useUnassignInspectionItemGeneralServiceMutation,
  useUpdateGeneralItemInfoMutation,
  useUpdateInspectionItemGeneralServicesMutation,
} from "@/redux/api/inspectionGeneralApi";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, message, Modal, Select } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  PlusCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UploadImage from "@/components/ui/UploadImage";
import FormUpdate from "@/components/Forms/FormUpdate";
import DoubleItemShow from "@/components/itemsShow/DoubleItemShow";
import SingleItemShow from "@/components/itemsShow/SingleItemShow";
import {
  useCreateSolutionTireMutation,
  useCreateTireStatusMutation,
  useCreateTreadDepthMutation,
  useGetInspectionItemTireServicesQuery,
  useGetSingleTireItemQuery,
  useUnassignInspectionItemTireServiceMutation,
  useUpdateInspectionItemTireServicesMutation,
  useUpdateTireItemInfoMutation,
} from "@/redux/api/inspectionTireApi";
import ServiceAssign from "@/components/ServiceAssign/ServiceAssign";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  removeAllEstimateState,
} from "@/redux/slice/estimateItemShowSlice";
import { IService } from "@/types";
import RelatedItemShowService from "@/components/RelatedItemShow/RelatedItemShowService";
import { clearAllRelatedItemDB } from "@/redux/slice/relatedItemHandleSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import Loading from "@/app/loading";

const { Option } = Select;

interface DoubleItem {
  id: string;
  name: string;
  color: string;
  inspectionId: string;
}

interface Item {
  id: string;
  name: string;
  inspectionId: string;
}

const SingleItemView = () => {
  const { confirm } = Modal;
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm();
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
    dispatch(removeAllEstimateState());
  }, [dispatch]);
  const { handleDeleteItemDB, handleUpdateTypeDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );
  const [showField, setShowField] = useState<string>("");
  const [showFieldTire, setShowFieldTire] = useState<string>("");
  const [problemInput, setProblemInput] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [solutionInput, setSolutionInput] = useState<string>("");
  const [mapInput, setMapInput] = useState<string>("");
  const [statusInput, setStatusInput] = useState<string>("");
  const [depthInput, setDepthInput] = useState<string>("");

  const [itemCode, setItemCode] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedItemType, setSelectedItemType] = useState<string>("");

  const [generalSolutions, setGeneralSolutions] = useState<{
    solutions: Item[];
  }>({ solutions: [] });
  const [generalMaps, setGeneralMaps] = useState<{
    maps: Item[];
  }>({ maps: [] });
  const [generalProblems, setGeneralProblems] = useState<{
    generalProblems: DoubleItem[];
  }>({ generalProblems: [] });

  const [tireSolutions, setTireSolutions] = useState<{
    tireSolutions: Item[];
  }>({ tireSolutions: [] });
  const [tireStatus, setTireStatus] = useState<{
    tireStatus: DoubleItem[];
  }>({ tireStatus: [] });
  const [treadDepth, setTreadDepth] = useState<{
    treadDepth: DoubleItem[];
  }>({ treadDepth: [] });
  const [services, setServices] = useState<IService[]>([]);

  const [formItemName, setFormItemName] = useState<string>("");
  const [formNote, setFormNote] = useState<string>("");
  const [formPsiBefore, setFormPsiBefore] = useState<string>("");

  const { data, isLoading, refetch } = useGetSingleItemQuery(
    itemCode,

    { refetchOnMountOrArgChange: true }
  );
  const {
    data: tireItem,
    isLoading: tireLoading,
    refetch: tireFetch,
  } = useGetSingleTireItemQuery(
    itemCode,

    { refetchOnMountOrArgChange: true }
  );

  const [updateGeneralItemInfo] = useUpdateGeneralItemInfoMutation();
  const [updateTireItemInfo] = useUpdateTireItemInfoMutation();
  const [createInspectionProblem] = useCreateInspectionProblemMutation();
  const [createInspectionSolutionGeneral] =
    useCreateInspectionSolutionGeneralMutation();
  const [createInspectionMap] = useCreateInspectionMapMutation();
  const [createTireStatus] = useCreateTireStatusMutation();
  const [createTreadDepth] = useCreateTreadDepthMutation();
  const [createSolutionTire] = useCreateSolutionTireMutation();

  const [unassignInspectionItemTireService] =
    useUnassignInspectionItemTireServiceMutation();

  const [unassignInspectionItemGeneralService] =
    useUnassignInspectionItemGeneralServiceMutation();

  const [updateInspectionItemGeneralServices] =
    useUpdateInspectionItemGeneralServicesMutation();

  const [updateInspectionItemTireServices] =
    useUpdateInspectionItemTireServicesMutation();

  useEffect(() => {
    dispatch(removeAllEstimateConcernItems());
    dispatch(removeAllEstimateInspectionItems());
    dispatch(removeAllEstimateServiceItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllInspectionItems());
  }, [dispatch, data, tireItem]);

  useEffect(() => {
    if (data) {
      setSelectedItemType(data?.type);
    }
    if (tireItem) {
      setSelectedItemType(tireItem?.type);
    }
  }, [data, setSelectedItemType, tireItem]);

  useEffect(() => {
    if (selectedItemType === "General") {
      setGeneralProblems({ generalProblems: data?.problems || [] });
      setGeneralSolutions({ solutions: data?.solutions || [] });
      setGeneralMaps({ maps: data?.maps || [] });
      setFormItemName(data?.name);
      setFormNote(data?.customNote);
    } else {
      setTireStatus({ tireStatus: tireItem?.tireStatuses || [] });
      setTreadDepth({ treadDepth: tireItem?.treadDepths || [] });
      setTireSolutions({ tireSolutions: tireItem?.solutions || [] });
      setFormItemName(tireItem?.name);
      setFormPsiBefore(tireItem?.psiBefore);
    }
  }, [selectedItemType, data, tireItem]);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setItemCode(extractCode);
    }
  }, [pathname, searchParams]);

  const { data: tireItemServices, refetch: tireServiceFetch } =
    useGetInspectionItemTireServicesQuery(
      { code: itemCode },
      { refetchOnMountOrArgChange: true }
    );
  const { data: generalItemServices, refetch: generalServiceFetch } =
    useGetInspectionItemGeneralServicesQuery(
      { code: itemCode },

      { refetchOnMountOrArgChange: true }
    );

  useEffect(() => {
    if (tireItemServices) {
      setServices(tireItemServices?.data);
    }
    if (generalItemServices) {
      setServices(generalItemServices?.data);
    }
  }, [tireItemServices, generalItemServices]);

  const showDeleteConfirm = (code: string) => {
    confirm({
      title: "Are you sure you want to delete this service?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          // Perform the delete operation
          if (selectedItemType === "Tire") {
            await unassignInspectionItemTireService({
              inspectionItemTireCode: itemCode,
              serviceCode: code,
            }).unwrap();
            tireServiceFetch();
            dispatch(clearAllRelatedItemDB());
            dispatch(clearAllSelection());
            if(services.length===1){
              setServices([])
            }
            message.success("Item deleted successfully!");
          }
          if (selectedItemType === "General") {
            await unassignInspectionItemGeneralService({
              inspectionItemGeneralCode: itemCode,
              serviceCode: code,
            }).unwrap();
            generalServiceFetch();
            dispatch(clearAllRelatedItemDB());
            dispatch(clearAllSelection());
            if(services.length===1){
              setServices([])
            }
            message.success("Item deleted successfully!");
          }
        } catch (error) {
          message.error("Failed to delete the service. Please try again.");
          dispatch(clearAllRelatedItemDB());
        }
      },
      onCancel() {
        dispatch(clearAllRelatedItemDB());
      },
    });
  };

  const handleUpdateServiceType = async (code: string, type: string) => {
    try {
      if (selectedItemType === "Tire") {
        await updateInspectionItemTireServices({
          inspectionItemTireCode: itemCode,
          serviceCode: code,
          data: { type },
        }).unwrap();
        message.success("Service type updated successfully!");
        dispatch(clearAllRelatedItemDB());
        tireServiceFetch();
      }
      if (selectedItemType === "General") {
        await updateInspectionItemGeneralServices({
          inspectionItemGeneralCode: itemCode,
          serviceCode: code,
          data: { type },
        }).unwrap();
        message.success("Service type updated successfully!");
        dispatch(clearAllRelatedItemDB());
        generalServiceFetch();
      }
    } catch (error) {
      message.error("Failed to delete the service. Please try again.");
      dispatch(clearAllRelatedItemDB());
    }
  };

  useEffect(() => {
    if (
      handleDeleteItemDB.code &&
      (handleDeleteItemDB.type === "General" ||
        handleDeleteItemDB.type === "Tire")
    ) {
      showDeleteConfirm(handleDeleteItemDB.code);
    }

    if (
      handleUpdateTypeDB.code &&
      (handleUpdateTypeDB.type === "General" ||
        handleUpdateTypeDB.type === "Tire")
    ) {
      handleUpdateServiceType(
        handleUpdateTypeDB.code,
        handleUpdateTypeDB.category
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDeleteItemDB, handleUpdateTypeDB]);

  const handleAddProblem = async () => {
    const data = {
      name: problemInput,
      color: selectedColor,
    };

    try {
      await createInspectionProblem({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection general problem created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection general problem");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleAddSolution = async () => {
    const data = {
      name: solutionInput,
    };
    try {
      await createInspectionSolutionGeneral({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection general solution created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection general solution");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleAddMaps = async () => {
    const data = {
      name: mapInput,
    };
    try {
      await createInspectionMap({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection general map created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection general map");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleAddTireStatus = async () => {
    const data = {
      name: statusInput,
      color: selectedColor,
    };

    try {
      await createTireStatus({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection tire status created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection tire status");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleAddTreadDepth = async () => {
    const data = {
      name: depthInput,
      color: selectedColor,
    };

    try {
      await createTreadDepth({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection tread depth created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection tread depth");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleAddTireSolution = async () => {
    const data = {
      name: solutionInput,
    };
    try {
      await createSolutionTire({ code: itemCode, data })
        .unwrap()
        .then(() => {
          message.success("Inspection tire solution created successfully");
        })
        .catch((err) => {
          message.error("Failed to create inspection tire solution");
        });
    } catch (err) {
      message.error("An unexpected error occurred");
    }
  };

  const handleClickGeneral = (key: number) => {
    if (key === 1) {
      setShowField("color-problem");
    } else if (key == 2) {
      setShowField("solution");
    } else {
      setShowField("MAP");
    }
  };

  const handleClickTire = (key: number) => {
    if (key === 1) {
      setShowFieldTire("tire-status-problem");
    } else if (key === 2) {
      setShowFieldTire("tire-depth-problem");
    } else {
      setShowFieldTire("tire-solutions");
    }
  };

  const onSubmit = async () => {
    if (formItemName === "") {
      message.error("Item name must have value");
      return;
    }
    if (data && data?.type === "General") {
      const value = {
        name: formItemName,
      };
      try {
        const data = JSON.stringify(value);

        await updateGeneralItemInfo({ code: itemCode, data })
          .unwrap()
          .then(() => {
            message.success("Inspection general updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection general");
          });
      } catch (err) {
        message.error("An unexpected error occurred");
      }
    }
    if (tireItem && tireItem.type === "Tire") {
      const value = {
        name: formItemName,
      };
      try {
        const data = JSON.stringify(value);

        await updateTireItemInfo({ code: itemCode, data })
          .unwrap()
          .then(() => {
            message.success("Inspection tire updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection tire");
          });
      } catch (err) {
        message.error("An unexpected error occurred");
      }
    }
  };
  // waiting for data
  if(tireLoading){
    return <Loading></Loading>
  }
  return (
    <div className="page-container">
      <div className="create-title-submit">
    <h2 className="page-header">Edit Inspection Item</h2>
    </div>
      <FormUpdate submitHandler={onSubmit} formKey="create-item-general">
        {/* Item Name */}
        <div
         
          className=" create-container mt-16"
        >
          <div >
            <label className="block mb-2 text-gray-700" htmlFor="itemName">
              Item Name :
            </label>
            <input
              onChange={(e) => setFormItemName(e.target.value)}
              type="text"
              id="itemName"
              placeholder="Enter your item name"
              defaultValue={data ? data?.name : tireItem?.name}
              className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Select Item */}
          <div className="my-2">
            <p className="block  text-gray-700">
              <span>Select Item: </span>
              <span className="font-bold">{selectedItemType}</span>
            </p>
          </div>

          {/* Code */}
          <div>
            <label className="block mb-2 text-gray-700" htmlFor="code">
              Code :
            </label>
            <input
              type="text"
              id="code"
              defaultValue={data ? data?.code : tireItem?.code}
              disabled
              placeholder="Enter your code"
              className="w-full px-3 py-2 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </div>

        {/* inspection general starts here */}
        {selectedItemType === "General" && (
          <div
            className="create-container mt-3 space-y-1 "
          >
            {/* <div className="flex gap-3 justify-end mb-6">
              <p className="text-[#00236e] text-[30px]">
                <EditFilled />
              </p>
              <p className="text-rose-600 text-[30px]">
                <CloseCircleFilled />
              </p>
              <p className="text-[#3bc990] text-[30px]">
                <CheckCircleFilled />
              </p>
            </div> */}

            {/* Inspect General Problem starts */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2  w-[150px]">
                problem & color
              </p>
              <div
                onClick={() => handleClickGeneral(1)}
                className="bg-background-item cursor-pointer text-md inline-flex justify-center  gap-3 p-1 w-[150px]"
              >
                <span className="mt-1">Add Value</span>
                <span className="   text-[20px] text-black">
                  <PlusCircleFilled />
                </span>
              </div>

              {showField === "color-problem" && (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    name="problem"
                    type="text"
                    placeholder="Enter problem"
                    value={problemInput}
                    className="p-2 bg-white text-slate-500 border-gray-400 outline-none rounded"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProblemInput(e.target.value)
                    }
                  />
                  <select
                    name="colorType"
                    value={selectedColor}
                    className="p-2 bg-white text-slate-600 border-gray-400 rounded"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedColor(e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select color
                    </option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>
                  <p
                    onClick={handleAddProblem}
                    className="py-2 px-3 cursor-pointer bg-[#3bc990] rounded-md border-none "
                  >
                    Add
                  </p>
                  <p
                    onClick={() => setShowField("")}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <DoubleItemShow items={generalProblems} />

            {/* Inspect General Problem ends */}

            {/* Inspect general solution starts */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Solution</p>
              <div
                onClick={() => handleClickGeneral(2)}
                className="bg-background-item cursor-pointer text-md inline-flex justify-center  gap-3 p-1 w-[150px]"
              >
                <span className="mt-1">Add Value</span>
                <span className="   text-[20px] text-black">
                  <PlusCircleFilled />
                </span>
              </div>

              {showField === "solution" && (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    name="solutions"
                    type="text"
                    placeholder="Enter solution"
                    value={solutionInput}
                    className="p-2 bg-white text-slate-600 border-gray-400 outline-none rounded"
                    onChange={(e) => setSolutionInput(e.target.value)}
                  />
                  <p
                    onClick={handleAddSolution}
                    className="py-2 px-3 bg-[#3bc990] cursor-pointer rounded-md border-none"
                  >
                    Add
                  </p>
                  <p
                    onClick={() => setShowField("")}
                    className="text-rose-600 text-[23px]"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <SingleItemShow items={generalSolutions} />

            {/* Inspect general solution ends */}

            {/* Inspect general map starts */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">MAP</p>
              <div
                onClick={() => handleClickGeneral(3)}
                className="bg-background-item text-md inline-flex justify-center  gap-3 p-1 w-[150px] cursor-pointer"
              >
                <span className="mt-1">Add Value</span>
                <span className="   text-[20px] cursor-pointer text-black">
                  <PlusCircleFilled />
                </span>
              </div>

              {showField === "MAP" && (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    name="map"
                    type="text"
                    placeholder="Enter map"
                    value={mapInput}
                    className="p-2 bg-white text-slate-600 border-gray-400 outline-none rounded"
                    onChange={(e) => setMapInput(e.target.value)}
                  />
                  <p
                    onClick={handleAddMaps}
                    className="py-2 px-3 cursor-pointer bg-[#3bc990] rounded-md border-none "
                  >
                    Add
                  </p>
                  <p
                    onClick={() => setShowField("")}
                    className="text-rose-600 text-[23px]"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <SingleItemShow items={generalMaps} />

            {/* Inspect general map ends */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Note
              </p>
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Text
              </p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Media
              </p>
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                image/File
              </p>
            </div>
          </div>
        )}
        {/* inspection general ends here */}

        {/* inspection tire starts here */}
        {selectedItemType === "Tire" && (
          <div className="create-container mt-3 space-y-1 ">
            {/* tire and color start tire */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2  w-[150px]">Tire Status</p>
              <div
                onClick={() => handleClickTire(1)}
                className="bg-background-item text-md inline-flex cursor-pointer justify-center  gap-3 p-1 w-[150px]"
              >
                <span className="mt-1">Add Value</span>
                <span
                  className=" cursor-pointer
                  text-[20px] text-black"
                >
                  <PlusCircleFilled />
                </span>
              </div>

              {showFieldTire === "tire-status-problem" && (
                <div className="flex gap-2 justify-center items-center">
                  {/* Input for tire status */}
                  <input
                    name="status"
                    type="text"
                    placeholder="Enter tire status"
                    value={statusInput}
                    className="p-2 bg-white text-slate-500 border-gray-400 outline-none rounded"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStatusInput(e.target.value)
                    }
                  />
                  {/* Dropdown for selecting color */}
                  <select
                    name="colorType"
                    value={selectedColor}
                    className="p-2 bg-white text-slate-600 border-gray-400 rounded"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedColor(e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select color
                    </option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>

                  {/* Add tire status */}
                  <p
                    onClick={handleAddTireStatus}
                    className="py-2 px-3 bg-[#3bc990] rounded-md border-none cursor-pointer"
                  >
                    Add
                  </p>

                  {/* Close button */}
                  <p
                    onClick={() => setShowFieldTire("")}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <DoubleItemShow items={tireStatus} />

            {/* tire and color end tire */}

            {/* tread depth starts here*/}
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2  w-[150px]">Tread Depth</p>
              <div
                onClick={() => handleClickTire(2)}
                className="bg-background-item text-md inline-flex justify-center  gap-3 p-1 w-[150px] cursor-pointer"
              >
                <span className="mt-1">Add Value</span>
                <span className="   text-[20px] text-black">
                  <PlusCircleFilled />
                </span>
              </div>

              {showFieldTire === "tire-depth-problem" && (
                <div className="flex gap-2 justify-center items-center">
                  {/* Input for tire status */}
                  <input
                    name="depth"
                    type="text"
                    placeholder="Enter tire status"
                    value={depthInput}
                    className="p-2 bg-white text-slate-500 border-gray-400 outline-none rounded"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDepthInput(e.target.value)
                    }
                  />
                  {/* Dropdown for selecting color */}
                  <select
                    name="colorType"
                    value={selectedColor}
                    className="p-2 bg-white text-slate-600 border-gray-400 rounded"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedColor(e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select color
                    </option>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>

                  {/* Add tire status */}
                  <p
                    onClick={handleAddTreadDepth}
                    className="py-2 px-3 bg-[#3bc990] rounded-md border-none cursor-pointer"
                  >
                    Add
                  </p>

                  {/* Close button */}
                  <p
                    onClick={() => setShowFieldTire("")}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <DoubleItemShow items={treadDepth} />
            {/* tread depth ends here*/}

            {/* tire solution starts here*/}
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Solution</p>
              <div
                onClick={() => handleClickTire(4)}
                className="bg-background-item text-md cursor-pointer inline-flex justify-center  gap-3 p-1 w-[150px]"
              >
                <span className="mt-1">Add Value</span>
                <span className="   text-[20px] text-black">
                  <PlusCircleFilled />
                </span>
              </div>
              {showFieldTire === "tire-solutions" && (
                <div className="flex gap-2 justify-center items-center">
                  <input
                    name="solutions"
                    type="text"
                    placeholder="Enter solution"
                    value={solutionInput}
                    className="p-2 bg-white text-slate-600 border-gray-400 outline-none rounded"
                    onChange={(e) => setSolutionInput(e.target.value)}
                  />
                  <p
                    onClick={handleAddTireSolution}
                    className="py-2 px-3 bg-[#3bc990] cursor-pointer rounded-md border-none"
                  >
                    Add
                  </p>
                  <p
                    onClick={() => setShowFieldTire("")}
                    className="text-rose-600 text-[23px]"
                  >
                    <CloseCircleFilled />
                  </p>
                </div>
              )}
            </div>
            <SingleItemShow items={tireSolutions} />
            {/* tire solution ends here*/}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 text-center w-[150px]">
                PSI Before
              </p>
              <p className="bg-background-item text-md p-2 text-center w-[150px]">
                Text
              </p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md text-center p-2 w-[150px]">
                Note
              </p>
              <p className="bg-background-item text-md  text-center p-2 w-[150px]">
                Text
              </p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Media
              </p>
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                image/File
              </p>
            </div>
          </div>
        )}
        {/* inspection tire starts here */}

        {/* Service assign starts */}
        <ServiceAssign
          code={data ? { General: data?.code } : { Tire: tireItem?.code }} operation="update" 
        />
        {/* Service assign ends */}

        {/* Related service view starts */}
        <RelatedItemShowService
          data={services}
          type={selectedItemType}
          subType="Service"
        />

        {/* Submit Button */}
        <div className="create-submit-button">
          <Button type="primary" className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white " htmlType="submit">
            Update
          </Button>
        </div>
      </FormUpdate>
    </div>
  );
};

export default SingleItemView;
