"use client";
import { Button, Input, message, Select } from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useMemo, useState } from "react";
import CarList from "../VehicleUsersSearch/CarList";
import {
  BarChartOutlined,
  CheckOutlined,
  EditOutlined,
  HistoryOutlined,
  ReloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { estimateStatusOptions, estimateTypeOptions } from "@/constant/global";
import {
  useGetAllTechniciansQuery,
  useGetCarsBySearchTermQuery,
  useGetOwnerVehicleQuery,
  useGetAllTechniciansWhenCreateEstimateQuery,
  useGetAllAssignedTechniciansQuery,
  useAssignTechnicianToEstimateMutation,
  useUnassignTechnicianFromEstimateMutation,
  useUpdateEstimateMutation,
  useAssignCustomerVehicleToEstimateMutation,
} from "@/redux/api/estimateApi";
import Loading from "@/app/loading";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getUserInfo } from "@/services/auth.service";
import { useGetSingleUserQuery } from "@/redux/api/UserApi";
import SelectedCar from "../VehicleUsersSearch/SelectedCar";
import AuthorizedHistory from "../AuthorizedHistory/AuthorizedHistory";
import { formatDate } from "@/utils/formatDate";
import RelatedOwnerVehicle from "../RelatedItemShow/RelatedOwnerVehicle";
import { removeSelectedCar, setSelectedCar } from "@/redux/slice/CarSlice";
import {
  removeAllEstimateTechnician,
  removeAllInspectionItem,
  setEstimateTechnicianUpdateStatus,
  setUpdateStatusMechanicPercentage,
} from "@/redux/slice/serviceInspectionItemSlice";
import { addEstimateTechnician } from "@/redux/slice/serviceInspectionItemSlice";
import {
  setAuthorizationAddStatus,
  setEstimateStatus,
  setEstimateStatusTypeUpdate,
  setEstimateType,
  setTitleEstimate,
  setUpdateAuthorization,
} from "@/redux/slice/estimateItemShowSlice";
import { calculateAddAmount } from "@/utils/amount";
import { setResetStatus } from "@/redux/slice/resetForm";
import { useRouter } from "next/navigation";
import { checkInvoiceAccess } from "@/utils/InvoiceAccessCheck";

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  condition: string;
  mileage: number;
  numberPlate: string;
  registrationNum: string;
  vin: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

interface Owner {
  owner: any;
  id: string;
  name: string;
  email: string;
  password: string;
  contactNum: string;
  optionalContactNum: string[];
  optionalEmail: string[];
  address: string;
  companyName: string;
  preferredCommunicationType: string;
  fileAs: string | null;
  note: string;
  role: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
  vehicle: Vehicle;
}

type Props = {
  createType?: string;
  page?: boolean;
  estimate?: any;
  estimateOwnerVehicle?: Owner;
  assingedOwnerVehicleRefetch?: () => void;
  estimateFetch?: () => void;
  authorizationFetch?: any;
  pageType?:string;
};


const EstimateSidebar: React.FC<Props> = ({
  page,
  createType,
  estimate,
  estimateOwnerVehicle,
  assingedOwnerVehicleRefetch,
  authorizationFetch,
  pageType
}) => {
  const query: Record<string, any> = {};
  const dispatch = useDispatch();
  const [searchTermCar, setSearchTermCar] = useState<string>("");
  const [groupedCars, setGroupedCars] = useState<any[]>([]);
  const [isAuthorization, setAuthorization] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [techFormattedData, setTechFormattedData] = useState<
    { id: string; name: string }[]
  >([]);
    const {role}=useAppSelector((state)=>state.imageUrl)

  const { userId, vehicleId, selectedCar } = useAppSelector(
    (state) => state.carGroupInfo
  );
  const { titleEstimate } = useAppSelector((state) => state.estimateItemShow);
  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 300,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const currentTime = moment().format("DD-MMMM-YYYY h:mm A");
  const { userId: id } = getUserInfo() as any;
  const { data } = useGetSingleUserQuery(page ? estimate?.providerId : id, {
    refetchOnMountOrArgChange: true,
  });
  const { data: allTechniciansRaw } =
    useGetAllTechniciansWhenCreateEstimateQuery(query, {
      refetchOnMountOrArgChange: true,
    });

  const allTechnicians = allTechniciansRaw ?? [];

  const { tempTotalAmount, totalAmount } = useAppSelector(
    (state) => state.serviceInspectionItem
  );
  const { data: allCarUsers, isLoading } = useGetCarsBySearchTermQuery(
    { searchTerm: searchTermCar },
    { refetchOnMountOrArgChange: true }
  );

  const { data: assignedTechnicians, refetch: techFormattedDataFetch } =
    useGetAllAssignedTechniciansQuery(
      { code: estimate?.code },
      { refetchOnMountOrArgChange: true }
    );
  useEffect(() => {
    if (assignedTechnicians && assignedTechnicians.length > 0) {
      const formatted = assignedTechnicians.map((item: any) => ({
        id: item.technician?.id,
        name: item.technician?.name,
      }));
      setTechFormattedData(formatted);
    }
  }, [assignedTechnicians]);

  const { data: unassignTechnicians, refetch: unassignTechniciansFetch } =
    useGetAllTechniciansQuery({
      estimateCode: estimate?.code,
      arg: query,
    });
  const [assignTechnicianToEstimate] = useAssignTechnicianToEstimateMutation();
  const [unassignTechnicianFromEstimate] =
    useUnassignTechnicianFromEstimateMutation();
  const [assignCustomerVehicleToEstimate] =
    useAssignCustomerVehicleToEstimateMutation();
  const [note, setNote] = useState("");
  const [authorizationMedium, setAuthorizationMedium] = useState("");
  const [authorizationStatus, setAuthorizationStatus] = useState("Incomplete");
  const [amount, setAmount] = useState<any>(tempTotalAmount);
  const [type, setType] = useState(createType);
  const [estimateTitle, setEstimateTitle] = useState("");
  const [status, setStatus] = useState<string | undefined>();
  const [selectedTechIds, setSelectedTechIds] = useState<string[]>([]);
  const [selectedTechIdsUpdate, setSelectedTechIdsUpdate] = useState<string[]>(
    []
  );

  const router =useRouter()

  const {isReset}=useAppSelector((state)=>state.reset)
  // Determine which page to come
  useEffect(()=>{
   
       if (type) {

         dispatch(setEstimateType(type));
      }
  },[dispatch])

 
  useEffect(() => {
    if (estimate?.type && page) {
      setType(estimate?.type);
      setStatus(estimate?.status);
      setEstimateTitle(estimate?.title);
      dispatch(setTitleEstimate(estimate.title))
      dispatch(setEstimateStatus(estimate?.status));
      dispatch(setEstimateType(estimate?.type));
    }
  }, [dispatch,estimate?.type, estimate?.status, estimate?.title]);
  useEffect(() => {
    const assignVehicle = async () => {
      if (page && selectedCar) {
        const payload = {
          customerId: userId,
          vehicleId,
        };
        try {
          await assignCustomerVehicleToEstimate({
            estimateCode: estimate?.code,
            payload,
          });
          assingedOwnerVehicleRefetch?.();
          setGroupedCars([]);
          dispatch(setSelectedCar(null));
          message.success("Customer Vehicle Successful !");
        } catch (error) {
          console.error("Error assigning vehicle:", error);
        }
      }
    };

    assignVehicle();
  }, [vehicleId, userId]);


  useEffect(() => {
    setAmount(totalAmount || tempTotalAmount);
  }, [tempTotalAmount, totalAmount]);

  const [showHistory, setShowHistory] = useState(false);
  const [authorizationData, setAuthorizationData] = useState({
    authorizationMedium: "",
    amount: "",
    note: "",
    customerId: selectedCar?.ownerId || estimateOwnerVehicle?.owner?.id,
    providerId: data?.id,
    authorizationStatus: "Incomplete",
  });

 const handleToggle = () => {
  let nextType: "Estimate" | "WorkOrder" | "Invoice" | undefined;

  if (!page) {
    if (createType === "Estimate") nextType = "WorkOrder";
    else if (createType === "WorkOrder") nextType = "Invoice";
  } else {
    if (type === "Estimate") {
      nextType = "WorkOrder";
      dispatch(setEstimateStatusTypeUpdate(true));
      window.open(`/${role}/work-order/single-work-order/${estimate?.code}`, "_blank");
  
    } else if (type === "WorkOrder") {
      nextType = "Invoice";
      dispatch(setEstimateStatusTypeUpdate(true));
      window.open(`/${role}/invoice-generate/invoice/${estimate?.code}`, "_blank");
    }else{
      if (!checkInvoiceAccess(role, estimate?.type)) return;
      nextType="Invoice"
      dispatch(setEstimateStatusTypeUpdate(true));
       window.open(`/${role}/invoice-generate/invoice/${estimate?.code}`, "_blank"); 
    }
  }

  if (nextType) {
    setType(nextType);
    dispatch(setEstimateType(nextType));
  }
};

  const handleChange = (selectedIds: string[]) => {

    const selectedTechs = allTechnicians
      .filter((tech: { id: string }) => selectedIds.includes(tech.id))
      .map((tech: { id: string; name: string }) => ({
        id: tech.id,
        name: tech.name,
      }));

    setSelectedTechIds(selectedIds);
    dispatch(removeAllEstimateTechnician())
    // Dispatch only id and name
    selectedTechs.forEach((tech: { id: string; name: string }) => {
      dispatch(addEstimateTechnician(tech));
    });
  };

  useEffect(() => {
    if (techFormattedData.length > 0 && selectedTechIdsUpdate.length === 0) {
      const initialIds = techFormattedData.map((tech) => tech.id);
      setSelectedTechIdsUpdate(initialIds);
    }
  }, [selectedTechIdsUpdate.length, techFormattedData]);

  const handleChangeUpdate = async (values: any[]) => {
      if (!checkInvoiceAccess(role, estimate?.type)) return;
    setLoading(true);
    message.loading({
      content: "Updating technicians...",
      key: "technicianUpdate",
    });

    const selectedIds = values.map((item) => item.value);
    const previousIds = techFormattedData.map((tech) => tech.id);

    const unassignedIds = previousIds.filter((id) => !selectedIds.includes(id));
    const newlyAssignedIds = selectedIds.filter(
      (id) => !previousIds.includes(id)
    );

    let hasError = false;

    // Unassign technicians
    for (const techId of unassignedIds) {
      try {
        await unassignTechnicianFromEstimate({
          estimateCode: estimate.code,
          technicianId: techId,
        }).unwrap();
        message.success(`Successfully unassigned technician`, 2);
      } catch (error) {
        hasError = true;
        message.error("Failed to unassign technician");
        console.error(error);
      }
    }

    // Assign technicians
    for (const techId of newlyAssignedIds) {
      try {
        await assignTechnicianToEstimate({
          estimateCode: estimate.code,
          technicianId: techId,
        }).unwrap();
        message.success(`Successfully assigned technician`, 2);
      } catch (error) {
        hasError = true;
        message.error("Failed to assign technician");
        console.error(error);
      }
    }

    // Refresh data and update state
    await techFormattedDataFetch();
    await unassignTechniciansFetch();
    if (!selectedIds.length) {
      setTechFormattedData([]);
    }
    setSelectedTechIdsUpdate(selectedIds);
    dispatch(setEstimateTechnicianUpdateStatus(true));

    if (!hasError) {
      message.success({
        content: "Technician update complete",
        key: "technicianUpdate",
        duration: 2,
      });
    } else {
      message.error({
        content: "Update completed with some errors",
        key: "technicianUpdate",
        duration: 2,
      });
    }

    setLoading(false);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTermCar(term);
  };

  const resetFilters = () => setSearchTermCar("");

  const groupCarsByOwner = (data: any[]) => {
    return data.reduce((acc, car) => {
      const { ownerId, owner, ...carDetails } = car;
      if (!acc[ownerId]) {
        acc[ownerId] = { ownerId, owner, cars: [] };
      }
      acc[ownerId].cars.push(carDetails);
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchCars = async () => {
      if (searchTermCar.trim() === "") return setGroupedCars([]);
      if (isLoading) return <Loading />;

      try {
        const groupedData = groupCarsByOwner(
          (allCarUsers?.items as any[]) || []
        );
        setGroupedCars(Object.values(groupedData));
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };
    fetchCars();
  }, [searchTermCar, allCarUsers, isLoading]);

  const handleSave = () => {
    if (!authorizationMedium || amount === null || amount === undefined) {
  message.error("All fields including technician(s) are required!");
  return;
}

    setAuthorizationData({
      authorizationMedium,
      amount,
      note,
      customerId: selectedCar?.ownerId || estimateOwnerVehicle?.owner?.id,
      providerId: data?.id,
      authorizationStatus,
    });

    const payload = {
      authorizationMedium,
      amount: parseFloat(amount),
      note,
      customerId: selectedCar?.ownerId || estimateOwnerVehicle?.owner?.id,
      providerId: id,
      authorizationStatus,
    };

    dispatch(setUpdateAuthorization(payload));
    dispatch(setAuthorizationAddStatus(true));
  };
  const handleEstimateTitleUpdate = () => {
    if (!checkInvoiceAccess(role, estimate?.type)) return;
    dispatch(setTitleEstimate(estimateTitle));
    dispatch(setEstimateStatusTypeUpdate(true));
  };
  const handleEstimateTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    
    if (!page) {
      dispatch(setTitleEstimate(e.target.value));
    }else{
      setEstimateTitle(e.target.value);
    }
  };

  // hide authorization field
  useEffect(() => {
    if (authorizationData?.authorizationMedium && authorizationData?.amount) {
      setAuthorization(true);
    }
  }, [authorizationData]);

  useEffect(() => {
    if (assignedTechnicians) {
      const ids = assignedTechnicians.map(
        (item: { technician: { technicianId: string } }) =>
          item?.technician?.technicianId
      );
      setSelectedTechIds(ids);
    }
  }, [assignedTechnicians]);

  if (isReset){
    setSelectedTechIds([]);
      setAuthorizationData({
    authorizationMedium: "",
    amount: "",
    note: "",
    customerId: selectedCar?.ownerId || estimateOwnerVehicle?.owner?.id,
    providerId: data?.id,
    authorizationStatus: "Incomplete",
  })
  setSearchTermCar("")
  setNote("")
  setAmount(0)
  setAuthorizationStatus("Incomplete")
  dispatch(setResetStatus(false))
  }

// Filter estimates based on status
  const incompleteEstimates = authorizationFetch?.filter(
    (item: { authorizationStatus: string; }) => item.authorizationStatus === "Incomplete"
  );
  const completeEstimates = authorizationFetch?.filter(
    (item: { authorizationStatus: string; }) => item.authorizationStatus === "Complete"
  );
  return (
    <div>
      <div className="flex items-center gap-1">
        {page ? (
           (incompleteEstimates?.length <= 0 && completeEstimates?.length > 0) ? (
             <Button
               onClick={() =>{
                  
                 setAuthorization(!isAuthorization)
               }}
               className="bg-gray-300 text-xs w-1/2 rounded-md text-black font-semibold"
             >
               <CheckCircleOutlined className="text-green-600 border border-green-500 rounded-full p-1 text-lg" />{" "}
               Authorized
             </Button>
           ) : (estimateOwnerVehicle?.owner?.id && estimateOwnerVehicle?.vehicle?.id)? (
             <Button
               onClick={() => {
                if (!checkInvoiceAccess(role, estimate.type)) return;
                setAuthorization(!isAuthorization)
               }}
               className="bg-[#fdcbcb] w-1/2 px-3"
             >
               <CloseCircleOutlined className="border text-xs border-red-500 text-red-600 rounded " />{" "}
               Authorization
             </Button>
           ) : (
             <Button
               disabled
               className="bg-[#D9D9D9] w-1/2 cursor-not-allowed rounded-md text-black font-semibold"
             >
               <CloseCircleOutlined className="border border-gray-800 text-gray-800 rounded text-xs" />
               Authorized
             </Button>
           )
         ) : (authorizationData?.authorizationStatus === 'Complete')? (
           <Button
             onClick={() => setAuthorization(!isAuthorization)}
             className="bg-gray-300 text-xs w-1/2 rounded-md text-black font-semibold"
           >
             <CheckCircleOutlined className="text-green-600 border border-green-500 rounded-full p-1 text-lg" />{" "}
             Authorized
           </Button>
         ) :  !!userId ? (
           <Button
             onClick={() => setAuthorization(!isAuthorization)}
             className="bg-[#fdcbcb] w-1/2 px-3"
           >
             <CloseCircleOutlined className="border text-xs border-red-500 text-red-600 rounded " />{" "}
             Authorization
           </Button>
         ) : (
           <Button
             disabled
             className="bg-[#D9D9D9] w-1/2 cursor-not-allowed rounded-md text-black font-semibold"
           >
             <CloseCircleOutlined className="border border-gray-800 text-gray-800 rounded text-xs" />
             Authorization
           </Button>
         )}
          {createType === "Estimate" && (
            <Button
              onClick={handleToggle}
              className="bg-blue-700 w-1/2 px-3 text-white text-xs"
            >
              {type ==='WorkOrder'? 'Work Order' :'Convert To WorkOrder'}
            </Button>
          )}
          
          {createType === "WorkOrder" && (
            <Button
              onClick={handleToggle}
              className="bg-blue-700 w-1/2 px-3 text-white text-xs"
            >
               {type ==='Invoice'? 'Invoice' :'Generate Invoice'}
            </Button>
          )}
          {type === "Estimate"&& page && (
            <Button
              onClick={handleToggle}
              className="bg-blue-700 w-1/2 px-3 text-white text-xs"
            >
               {type ==='Estimate'? 'Convert To WorkOrder' :'Estimate'}
            </Button>
          )}
           {type === "WorkOrder"&& page && (
            <Button
              onClick={handleToggle}
              className="bg-blue-700 w-1/2 px-3 text-white text-xs"
            >
               {type ==='WorkOrder'? 'Generate Invoice' :'Work Order'}
            </Button>
          )}
          {type === "Invoice"&& page && (
            <Button
            onClick={handleToggle}
              className="bg-blue-700 w-1/2 px-3 text-white text-xs"
            >
               Regenerate Invoice
            </Button>
          )}
      </div>
      <div
        className={`flex gap-2 items-start flex-1 mt-2 ${
          showHistory ? "flex-col" : "justify-between items-center"
        }`}
      >
        {page && (
          <div className="flex justify-between gap-2 items-center w-full">
            <Select
              className="w-1/2"
              placeholder="Select Status"
              value={status}
              onChange={(value) => {
                if (!checkInvoiceAccess(role, estimate?.type)) return;
                setStatus(value);
                if (page) {
                  dispatch(setEstimateStatus(value));
                  dispatch(setEstimateStatusTypeUpdate(true));
                }
              }}
            >
              {estimateStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>

           <div className="flex gap-2 w-1/2">
               <Button
                 className="w-1/2 flex items-center gap-2"
                 onClick={() =>{
                    if (!checkInvoiceAccess(role, estimate.type)) return;
                   setShowHistory(true)
                 }}
               >
                 <HistoryOutlined  />
                
               </Button>
             
               <Button onClick={()=>router.push(`/${role}/work-order/analysis/${estimate.code}`)} className="w-1/2 flex items-center gap-2">
                 <BarChartOutlined  />
               
               </Button>
          </div>
          </div>
        )}

        {showHistory && (
          <div className="w-full ">
            <AuthorizedHistory
              onClose={() => setShowHistory(false)}
              estimateAuthorization={authorizationFetch}
            />
          </div>
        )}
      </div>

      {/* Authorization Section */}
      {isAuthorization &&
        (userId ||
          (estimateOwnerVehicle?.owner && estimateOwnerVehicle?.vehicle)) && (
          <div className="w-full mt-2 my-2 mx-auto border p-2 rounded-md  border-solid border-gray-200 space-y-1 bg-white">
            <p className="text-sm">
              <span className="font-semibold">TIME : </span>
              <span className="text-blue-600">{currentTime}</span>
            </p>
            <p className="text-sm">
              <span className="font-semibold">Authorize by : </span>
              {selectedCar?.owner.name || estimateOwnerVehicle?.owner?.name}
            </p>

            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="p-[10px] bg-white text-black border border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
                placeholder="my custom note.."
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Authorized medium
              </label>
              <Select
                className="w-full"
                placeholder="select"
                onChange={(value) => setAuthorizationMedium(value)}
              >
                <Option value="SMS">SMS</Option>
                <Option value="Mail">MAIL</Option>
                <Option value="Call">CALL</Option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-[10px] bg-white text-black border border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
                placeholder="$ 10,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Authorization Status
              </label>
              <Select
                className="w-full"
                placeholder="Select"
                value={authorizationStatus}
                onChange={(value) => setAuthorizationStatus(value)}
              >
                <Option value="Incomplete">Incomplete</Option>
                <Option value="Complete">Complete</Option>
              </Select>
            </div>

            <button
                 onClick={handleSave}
                 disabled={authorizationStatus === 'Incomplete'}
                 className={`w-full py-2 rounded-md font-semibold transition
                   ${
                     authorizationStatus === 'Incomplete'
                       ? 'bg-gray-400 cursor-not-allowed'
                       : 'bg-black text-white cursor-pointer hover:bg-gray-800'
                   }`}
               >
                 SAVE
           </button>
          </div>
        )}
      {page ? (
        <div className="mt-2 bg-white border border-solid pb-2 border-gray-200 ">
          <h4 className="bg-[#F9F9F9] px-2 py-1 text-md">Estimate</h4>
          <div className="text-sm px-2">
            <div className="flex justify-between items-center">
              <p>Estimate</p>
              <p className="">{estimate?.title}</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Total</p>
              <p className="">${totalAmount}</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Create On</p>
              <p className="">
                {estimate?.createdAt ? formatDate(estimate.createdAt) : ""}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p>Last Modified</p>
              <p className="">
                {estimate?.updatedAt ? formatDate(estimate.updatedAt) : ""}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <p>Provider</p>
              <p className="">{data?.name || "N/A"}</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Technician</p>
            </div>
            {/* update Estimate Technician start */}
            <Select
              showSearch
              mode="multiple"
              labelInValue
              placeholder="Assign technician(s)"
              style={{ width: "100%" }}
              onChange={(values) => {
                handleChangeUpdate(values);
              }}
              value={selectedTechIdsUpdate.map((id) => {
                const tech = techFormattedData?.find((t) => t.id === id);
                return {
                  value: id,
                  label: tech?.name, // fallback to id if name is not found
                };
              })}
              filterOption={false}
              onSearch={setSearchTerm}
              notFoundContent={null}
            >
              {unassignTechnicians?.data?.map(
                (tech: { id: string; name: string }) => (
                  <Option key={tech.id} value={tech.id}>
                    {tech.name}
                  </Option>
                )
              )}
            </Select>

            {/* update Estimate Technician end here */}
          </div>
        </div>
      ) : (
        <div className=" bg-white border border-solid pb-2 border-gray-200 ">
          
          <h4 className="bg-[#F9F9F9] px-2 py-1 text-md">Estimate</h4>
          <div className="text-sm px-2">
            <div  className="flex justify-between items-center ">
              <p>Estimate</p>
              <p className="">{titleEstimate}</p>
            </div>
            <div  className="flex justify-between items-center ">
              <p>Total</p>
              <p className="">${tempTotalAmount}</p>
            </div>
            <div  className="flex justify-between items-center ">
              <p>Create On</p>
              <p className="">N/A</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Last Modified</p>
              <p className="">N/A</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Provider</p>
              <p className="">{data?.name}</p>
            </div>
            <div className="flex justify-between items-center ">
              <p>Technician</p>
            </div>
            {/* create Estimate Technician start here */}
            <Select
              showSearch
              mode="multiple"
              placeholder="Assign technician(s)"
              style={{ width: "100% " }}
              onChange={handleChange}
              value={selectedTechIds}
              filterOption={false}
              onSearch={setSearchTerm}
              notFoundContent={null}
            >
              {allTechnicians?.map((tech: { id: string; name: string }) => (
                <Option key={tech.id} value={tech.id}>
                  {tech.name}
                </Option>
              ))}
            </Select>

            {/* Create Estimate Technician End here */}
          </div>
       
        </div>
      )}

      {/* Search Car Section */}

      {page && estimateOwnerVehicle?.owner && estimateOwnerVehicle?.vehicle && (
        <RelatedOwnerVehicle
          data={estimateOwnerVehicle}
          type="Estimate"
          subType="Vehicle"
        />
      )}
      {!estimateOwnerVehicle?.owner && !estimateOwnerVehicle?.vehicle && (
        <div className="mt-2">
          <div>
            <p>Search Customer & Vehicle</p>
          </div>
          <div className="w-full flex">
            <Input
              type="text"
              disabled={role !=='admin'&&estimate?.type==='Invoice'}
              
              placeholder="Search..."
              className="w-full lg:w-full rounded"
              value={searchTermCar || ""}
              onChange={handleInputChange}
            />
            {!!searchTermCar && (
              <Button
                onClick={resetFilters}
                type="primary"
                style={{ margin: "0px 5px" }}
              >
                <ReloadOutlined />
              </Button>
            )}
          </div>
        </div>
      )}

      {groupedCars.length > 0 && <CarList groupedCars={groupedCars} />}
      {!page && <SelectedCar />}

      {page ? (
        <div className="relative mt-2">
          <input
            type="text"
            id="title"
            disabled={role !=='admin'&&estimate.type==='Invoice'}
            placeholder="Enter your estimate title"
            value={estimateTitle}
            onChange={handleEstimateTitleChange}
            className="p-[8px] pr-10  bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
          />
          {/* Update Icon */}
          <SaveOutlined
            onClick={handleEstimateTitleUpdate}
            className="absolute right-3 top-[50%] translate-y-[-50%] text-xl text-gray-500 cursor-pointer hover:text-blue-500"
            title="Update"
          />
        </div>
      ) : (
        <div className="relative mb-5 mt-3">
          <input
            type="text"
            id="title"
            placeholder="Enter your estimate title"
            value={titleEstimate}
            onChange={handleEstimateTitleChange}
            className="p-[10px] pr-10  bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default EstimateSidebar;
