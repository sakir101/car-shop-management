"use client";

import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import UploadImage from "@/components/ui/UploadImage";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  CheckCircleOutlined,
  UnorderedListOutlined,
  PlusCircleFilled,
  ReloadOutlined,
} from "@ant-design/icons";
import { Button, Input, message } from "antd";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { useInspectionGeneralCreateMutation } from "@/redux/api/inspectionGeneralApi";
import {
  removeItemFromArray,
  removeItemFromArrayProblem,
  removeItemFromArrayStatus,
  removeItemFromArrayDepth,
} from "@/utils/removeItemFromArray";
import { useInspectionTireCreateMutation } from "@/redux/api/inspectionTireApi";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { useGetAllServicesQuery } from "@/redux/api/service.Api";
import { yupResolver } from "@hookform/resolvers/yup";
import { inspectItemGeneralSchema } from "@/schemas/inspectItemGeneral";
import { inspectItemTireSchema } from "@/schemas/inspectItemTire";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
  removeServiceItem,
} from "@/redux/slice/searchItemShowSlice";
import SearchAssignServiceShow from "@/components/SearchAssignItemShow/SearchAssignServiceShow";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
  removeAllEstimateState,
} from "@/redux/slice/estimateItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import { removeAllAppointmentState } from "@/redux/slice/appointmentSlice";

const { Option } = Select;
// test
const GeneralPage = () => {
  const query: Record<string, any> = {};
  let pageTitle = "Create Item";
  const [isReset, setIsReset] = useState(false);
  const [problemInput, setProblemInput] = useState<string>("");
  const [solutionInput, setSolutionInput] = useState<string>("");

  const [mapInput, setMapInput] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedColorTireStatus, setSelectedColorTireStatus] =
    useState<string>("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tireStatus, setTireStatus] = useState<TireStatus[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [maps, setMaps] = useState<string[]>([]);
  const [showField, setShowField] = useState<string>("color-problem");
  const [showFieldTire, setShowFieldTire] = useState<string>(
    "tire-status-problem"
  );
  const [selectedItem, setSelectedItem] = useState<string>("");

  // const [tireStatus,setTireStatus] =useState<Problem[]>([]);
  const [tireDepth, setTireDepth] = useState<TireDepth[]>([]);
  const [tireSolutions, setTireSolutions] = useState<string[]>([]);
  const [statusInput, setStatusInput] = useState<string>("");
  const [depthInput, setDepthInput] = useState<string>("");
  const [tireSolutionInput, setTireSolutionInput] = useState<string>("");
  const [tireSelectedColor, setTireSelectedColor] = useState<string>("");

  const [page, setPage] = useState<number>();

  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { serviceState } = useAppSelector((state) => state.searchItemShow);
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
  const [inspectionGeneralCreate, { isSuccess, isError, isLoading }] =
    useInspectionGeneralCreateMutation();
  const [inspectionTireCreate] = useInspectionTireCreateMutation();

  const {
    data: serviceData,
    isLoading: serviceLoading,
    refetch,
  } = useGetAllServicesQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const services = serviceData?.data;
  const meta = serviceData?.meta;
const [sortedService, setSortedService] = useState<any>([]);
const [showAdded,setShowAdded]=useState<boolean>(true)
useEffect(() => {
  if (services) {
    setSortedService(services);
  }
}, [services]);
  const handleSelectChange = (value: string) => {
    setSelectedItem(value);
  };
  
const handleAddedServiceFilter = () => {
  const filteredService = services?.filter(stateItem =>
    serviceState.some(serviceItem => serviceItem.serviceCode === stateItem.code)
  );
  setSortedService(filteredService)
  setShowAdded(false)
};
const handleAllService = () => {

  setSortedService(services)
  setShowAdded(true)
};

  interface Problem {
    problem: string;
    color: string;
  }
  const handleAddProblem = (): void => {
    if (problemInput.trim() && selectedColor) {
      setProblems((prevProblems) => [
        ...prevProblems,
        { problem: problemInput, color: selectedColor },
      ]);
      setProblemInput("");
      setSelectedColor("");
    }
  };
  const handleAddTireStatus = (): void => {
    if (statusInput.trim() && selectedColorTireStatus) {
      setTireStatus((prevStatuses) => [
        ...prevStatuses,
        { name: statusInput, color: selectedColorTireStatus },
      ]);

      setStatusInput("");
      setTireSelectedColor("");
    }
  };
  const handleAddTireDepth = (): void => {
    if (depthInput.trim() && selectedColorTireStatus) {
      // Update the array of tire statuses
      setTireDepth((prevStatuses) => [
        ...prevStatuses,
        { name: depthInput, color: selectedColorTireStatus },
      ]);

      setDepthInput("");
      setTireSelectedColor("");
    }
  };

  const handleSolutionInput = () => {
    if (solutionInput.trim()) {
      setSolutions((prevSolutions) => [...prevSolutions, solutionInput]);
      setSolutionInput("");
    }
  };
  const handleTireSolutionInput = () => {
    if (tireSolutionInput.trim()) {
      setTireSolutions((prevSolutions) => [
        ...prevSolutions,
        tireSolutionInput,
      ]);
      setTireSolutionInput("");
    }
  };

  const handleMapInput = () => {
    if (mapInput.trim()) {
      setMaps((prevSolutions) => [...prevSolutions, mapInput]);
      setMapInput("");
    }
  };

  const handleClick = (key: number) => {
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
  const onSubmit = async (values: any) => {
    const { code, ...others } = values;
    const fromData = {
      code: `Gen-${values.code}`,
      ...others,
      problems,
      solutions,
      maps,
      services: serviceState,
    };
    const fromDataForTire = {
      code: `Tir-${values.code}`,
      ...others,
      tireStatuses: tireStatus,
      treadDepths: tireDepth,
      solutions: tireSolutions,
      services: serviceState,
    };

    const key = "loadingKey";
    message.loading({ content: "Loading...", key });

    try {
      if (selectedItem === "general") {
        const data = JSON.stringify(fromData);
        await inspectionGeneralCreate(data).unwrap();
        message.success("Successfully added inspection general item data");
        dispatch(setResetStatus(true));
        dispatch(setSearchTerm(""));
        dispatch(removeAllServiceItems());
        dispatch(removeAllInspectionItems());
        dispatch(clearAllSelection());
        setProblems([]);
        setSolutions([]);
        setMaps([]);
        setTireStatus([]);
        setTireDepth([]);
        setTireSolutions([]);
        setIsReset(true);
        message.destroy(key);
      } else if (selectedItem === "tire") {
        const dataForTire = JSON.stringify(fromDataForTire);
        await inspectionTireCreate(dataForTire).unwrap();
        message.success("Successfully added inspection tire item data");
        dispatch(setSearchTerm(""));
        dispatch(removeAllServiceItems());
        dispatch(removeAllInspectionItems());
        dispatch(clearAllSelection());
        dispatch(setResetStatus(true));
        setProblems([]);
        setSolutions([]);
        setMaps([]);
        setTireStatus([]);
        setTireDepth([]);
        setTireSolutions([]);
        setIsReset(true);
        message.destroy(key);
      } else {
        message.error("Invalid selected item");
        message.destroy(key);
        dispatch(clearResetStatus());
      }
    } catch (error: any) {
      message.error(`An unexpected error occurred: ${error.data.message}.`);
      message.destroy(key);
      dispatch(clearResetStatus());
    }
  };

  //Tire functionality

  interface TireStatus {
    name: string;
    color: string;
  }

  interface TireDepth {
    name: string;
    color: string;
  }

  const handleDeleteSpecificService = (serviceCode: string) => {
    dispatch(removeServiceItem(serviceCode));
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };

  return (
    <div className="page-container">
      <div className="create-title-submit">
        <h2 className="page-header">Create Inspection Item</h2>
      </div>
      <Form
      className="pt-16"
        submitHandler={onSubmit}
        {...(pageTitle === "Create Item"
          ? {
              resolver: yupResolver(
                selectedItem === "general"
                  ? inspectItemGeneralSchema
                  : inspectItemTireSchema
              ),
            }
          : {})}
        formKey="create-item-general"
        isReset={isReset}
      >
        {/* create inspection start here */}
        <div
          className="create-container  "
        >
          <div >
            <FormInput
              name="itemName"
              type="text"
              size="large"
              label="Item name"
              placeholder="Enter Item Name"
              required
            />
          </div>
          <div className=" my-3">
            <label className="block mb-2 text-gray-700">Select Item</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select an option"
              onChange={handleSelectChange}
              value={selectedItem || undefined}
            >
              <Option value="general">General</Option>
              <Option value="tire">Tire</Option>
            </Select>
          </div>
          <div >
            <FormInput
              name="code"
              type="text"
              size="large"
              label="Code"
              placeholder="Enter Item Code"
              required
            />
          </div>
        </div>
        {/* create inspection end here */}

        {/* inspection general starts here */}
        {selectedItem === "general" && (
          <div
           
            className="create-container space-y-1 mt-3 "
          >
            {/* problems and color start general */}

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <p className="bg-background-item text-sm sm:text-md p-2 w-full sm:w-[150px]">
                problem & color
              </p>
              <div
                onClick={() => handleClick(1)}
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
            <div>
              <ul className="flex flex-wrap">
                {problems.map((problem, index) => (
                  <li
                    key={index}
                    className="flex bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                  >
                    <p style={{  color: problem.color  }} className="me-3">
                      {problem.problem}
                    </p>

                    <p
                      onClick={() =>
                        removeItemFromArrayProblem(index, setProblems)
                      }
                      className="text-rose-600 text-[23px] cursor-pointer"
                    >
                      <CloseCircleFilled />
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">
                Solution
              </p>
              <div
                onClick={() => handleClick(2)}
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
                    onClick={handleSolutionInput}
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
            <ul className="flex flex-wrap">
              {solutions.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                >
                  <p className="me-3">{item}</p>

                  <p
                    onClick={() => removeItemFromArray(index, setSolutions)}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">MAP</p>
              <div
                onClick={() => handleClick(3)}
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
                    onClick={handleMapInput}
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
            <ul className="flex flex-wrap">
              {maps.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                >
                  <p className="me-3">{item}</p>

                  <p
                    onClick={() => removeItemFromArray(index, setMaps)}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Note</p>
              <p className="bg-background-item text-md text-center p-2 w-[150px]">
                Text Area
              </p>
              {/* <FormTextArea name="note" rows={5}></FormTextArea> */}
            </div>

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Media</p>
              <p className="bg-background-item text-md text-center p-2 w-[150px]">
                Image/Video
              </p>
              {/* <UploadImage name="image"></UploadImage> */}
            </div>
          </div>
        )}
        {/* inspection general ends here */}

        {/* inspection tire starts here */}
        {selectedItem === "tire" && (
          <div
             className="create-container space-y-1 mt-3 "
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

            {/* tire and color start tire */}

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2  w-[150px]">
                Tire Status
              </p>
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
                    value={selectedColorTireStatus}
                    className="p-2 bg-white text-slate-600 border-gray-400 rounded"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedColorTireStatus(e.target.value)
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
            <div>
              <ul className="flex flex-wrap">
                {tireStatus.map((status, index) => (
                  <li
                    key={index}
                    className="flex justify-between bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                  >
                    <p  style={{
                       color: status.color
                     }} className="me-3">
                      {status.name}
                    </p>

                    <p
                      onClick={() =>
                        removeItemFromArrayStatus(index, setTireStatus)
                      }
                      className="text-rose-600 text-[23px] cursor-pointer"
                    >
                      <CloseCircleFilled />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2  w-[150px]">
                Tread Depth
              </p>
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
                    value={selectedColorTireStatus}
                    className="p-2 bg-white text-slate-600 border-gray-400 rounded"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setSelectedColorTireStatus(e.target.value)
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
                    onClick={handleAddTireDepth}
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
            <div>
              <ul className="flex flex-wrap">
                {tireDepth.map((depth, index) => (
                  <li
                    key={index}
                    className="flex justify-between bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                  >
                    <p style={{ color: depth.color }} className="me-3">
                      {depth.name}
                    </p>

                    <p
                      onClick={() =>
                        removeItemFromArrayDepth(index, setTireDepth)
                      }
                      className="text-rose-600 text-[23px] cursor-pointer"
                    >
                      <CloseCircleFilled />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">
                Solution
              </p>
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
                    value={tireSolutionInput}
                    className="p-2 bg-white text-slate-600 border-gray-400 outline-none rounded"
                    onChange={(e) => setTireSolutionInput(e.target.value)}
                  />
                  <p
                    onClick={handleTireSolutionInput}
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
            <ul className="flex flex-wrap">
              {tireSolutions.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
                >
                  <p className="me-3">{item}</p>

                  <p
                    onClick={() => removeItemFromArray(index, setTireSolutions)}
                    className="text-rose-600 text-[23px] cursor-pointer"
                  >
                    <CloseCircleFilled />
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">
                PSI Before
              </p>
              {/* <FormTextArea name="psiBefore" rows={5}></FormTextArea> */}
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Text
              </p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">DOT</p>
              <p className="bg-background-item text-center text-md p-2 w-[150px]">
                Text
              </p>
            </div>
            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Note</p>
              <p className="bg-background-item text-md text-center p-2 w-[150px]">
                Text Area
              </p>
              {/* <FormTextArea name="note" rows={5}></FormTextArea> */}
            </div>

            <div className="flex gap-3 justify-start items-center">
              <p className="bg-background-item text-md p-2 w-[150px]">Media</p>
              <p className="bg-background-item text-md text-center p-2 w-[150px]">
                Image/Video
              </p>
              {/* <UploadImage name="image"></UploadImage> */}
            </div>
          </div>
        )}

        {/* inspection tire ends here */}

        <div className="mt-2">
          <div>
            <label htmlFor="">Search for Service</label>
          </div>
          <div className="flex items-center gap-1">
            
            <SearchInput
              placeholder="Search..."
              size="large"
              resetFilters={resetFilters}
            />
           
      

      {/* All Button */}
      {showAdded?<Button
        type="default"
        size="small"
        className=" rounded py-[15px]"
        icon={<CheckCircleOutlined />}
        onClick={handleAddedServiceFilter}
      >
        Added
      </Button>: <Button
        type="default"
        className=" rounded py-[15px]"
        size="small"
        icon={<UnorderedListOutlined />}
        onClick={handleAllService}
      >
        All
      </Button>}
     
          </div>
        </div>

        <SearchItemShow data={sortedService} type={true} />
        

        <div className="create-submit-button">
          <Button type="primary" className="bg-neutral-800 hover:bg-neutral-700 rounded font-bold mt-2 " htmlType="submit">
            Save
          </Button>
        </div>

        {/* Service View starts*/}
        <SearchAssignServiceShow title={`Service`} style={false} />
        {/* Service View ends*/}
      </Form>
    </div>
  );
};
export default GeneralPage;
