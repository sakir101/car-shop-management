"use client";

import React, { useEffect, useMemo, useState } from "react";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import { Button, Input, message, Select } from "antd";
import FormDatePicker from "@/components/Forms/FormDatePicker";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import {
  useAppointmentCreateMutation,
  useGetAllContactForAppointmentQuery,
  useGetAllWorkOrdersQuery,
  useGetServiceAdvisorTechniciansQuery,
} from "@/redux/api/appointmentApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { appointmentSchema } from "@/schemas/appointment";
import FormTimePicker from "@/components/Forms/FormTimePicker";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import {
  removeAllAppointmentState,
  removeAllContactAppointment,
  removeEstimateCode,
} from "@/redux/slice/appointmentSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import { CheckOutlined, CloseOutlined, DisconnectOutlined, LinkOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  removeAllEstimateConcernItems,
  removeAllEstimateInspectionItems,
  removeAllEstimateServiceItems,
} from "@/redux/slice/estimateItemShowSlice";
import { setUserId, setVehicleId } from "@/redux/slice/CarSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import FormSelectField from "@/components/Forms/FormSelectField";
import { tagOptions } from "@/constant/global";
import Form from "@/components/Forms/Form";
import { setResetStatus } from "@/redux/slice/resetForm";
import { useSearchParams } from "next/navigation";
import { Option } from "antd/es/mentions";
import { removeEmptyFields } from "@/utils/removeEmptyFields";
import { AutoEndHour } from "@/helpers/AutoEndHour";
import { SetDefaultTimes } from "@/helpers/SetDefaultTimes";
import { getUserInfo } from "@/services/auth.service";
import { localDateAnd12hToUTC } from "@/utils/localDateAnd12hToUTC";


export type SelectOption = {
  label: string;
  value: string;
};

export type Person = {
  name: string;
  value: string;
};
export interface SelectedCustomer {
  id: string;
  name: string;
}

const CreateAppointment = () => {
  const query: Record<string, any> = {};
  const queryWorkOrder: Record<string, any> = {};
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState<string>("");
  const [isChecked, setIsChecked] = useState<Boolean>(false);
  const [workOrder, setWorkOrder] = useState<Boolean>(false);
  const [searchTermWorkOrder, setSearchTermWorkOrder] = useState<string>("");
  const [serviceAdvisor, setServiceAdvisor] = useState<Person>({
    name: "",
    value: "",
  });
  const { role} = getUserInfo() as any;
  const [technicians, setTechnicians] = useState<{ technicians: any[] }>({
    technicians: [],
  });
  let pageTitle = "Create Appointment";

  const [appointmentCreate] = useAppointmentCreateMutation();
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { contactState, estimateCode } = useAppSelector(
    (state) => state.appointmentItemShow
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
  }, [dispatch]);


  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });
  const debouncedTermWorkOrder = useDebounced({
    searchQuery: searchTermWorkOrder,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  if (!!debouncedTermWorkOrder) {
    queryWorkOrder["searchTerm"] = debouncedTermWorkOrder;
  }

  const { data: allWorkOrders } = useGetAllWorkOrdersQuery(
    queryWorkOrder,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const allWorkOrdersData: any = allWorkOrders?.data;
  const { data: serviceAdvisorTechnician } =
    useGetServiceAdvisorTechniciansQuery(
      { code: estimateCode },
      {
        refetchOnMountOrArgChange: true,
      }
    );

  useEffect(() => {
    if (serviceAdvisorTechnician) {
      setServiceAdvisor({
        name: serviceAdvisorTechnician?.serviceAdvisor?.name,
        value: serviceAdvisorTechnician?.serviceAdvisor?.id,
      });

      setTechnicians({ technicians: serviceAdvisorTechnician?.technician });
    }
  }, [serviceAdvisorTechnician,contactState,estimateCode]);


  const searchParams = useSearchParams();
  const clickedDate: any = searchParams.get("date");

  const keyName = "formValues_createAppointment";

  const handleDateChange = (selectedDate: string) => {
    localStorage.setItem(
      keyName,
      JSON.stringify({ scheduled: selectedDate, startHour: "", duration: "" })
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(selectedDate);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < today) {
      message.error("You cannot select a past date.");
      setError("You cannot select a past date.");
    } else {
      setError("");
      setDate(new Date(selectedDate));
    }
  };

  useEffect(() => {
    if (contactState.length === 0) {
     setTechnicians({ technicians: [] });
     setServiceAdvisor({ name: "", value: "" });
    }
  }, [contactState]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const [selectedCustomer, setSelectedCustomer] = useState<{
  id: string | null;
  name: string;
} | null>(null);
  const handleReset = () => {
      dispatch(removeAllContactAppointment());
      dispatch(clearAllSelection());
      setServiceAdvisor({ name: "", value: "" });
      setSelectedCustomer(null);
      setTechnicians({ technicians: [] });
      setIsChecked(false);
      setWorkOrder(false)
      dispatch(removeEstimateCode())
      dispatch(setResetStatus(true));
      
  };

  const resetFilters = () => {
   setSearchTermWorkOrder('')
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTermWorkOrder(term);
  };


  const {data,refetch }:any=  useGetAllContactForAppointmentQuery(query,{
        refetchOnMountOrArgChange: true,
      })


  const contact = useMemo(() => data?.data?.data || [], [data]);

useEffect(() => {
  if (!searchTerm) return;

  const trimmed = searchTerm.trim().toLowerCase();

  const exactMatch = contact.find(
    (c: any) =>
      c.name.trim().toLowerCase() === trimmed
  );

  if (exactMatch) {
    // ✅ Customer exists
    setSelectedCustomer({
      id: exactMatch.id,
      name: exactMatch.name,
    });
  } else {
    // ✅ Customer does NOT exist
    setSelectedCustomer({
      id: null,
      name: searchTerm,
    });
  }
}, [searchTerm, contact]);

  const handleCreateCustomer = (term: string) => {
  const url = `/${role}/contact/create?name=${encodeURIComponent(term)}`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
};



  const handleSubmit = async (data: any) => {
   if (!selectedCustomer?.name) {
     message.error("Customer name is required!");
     return;
   }
   const { scheduled, ...rest } = data;
   const scheduledUTC = new Date(`${scheduled}T00:00:00`).toISOString();
   const startUTC = localDateAnd12hToUTC(scheduled, data.startHour);
  const endUTC = localDateAnd12hToUTC(scheduled, data.endHour);
   const rawValue = {
     ...rest,
     scheduled: scheduledUTC,
     startHour: startUTC,
     endHour: endUTC,
     customerId:selectedCustomer?.id,
     customerName:selectedCustomer?.name,
     estimateCode: estimateCode,
     is_confirm:isChecked,
     serviceAdvisorId: serviceAdvisor?.value,
     technician:
       technicians?.technicians?.length > 0 ? technicians?.technicians : [],
   };
   const value = removeEmptyFields(rawValue)
   
   try {
     await appointmentCreate({ data: value }).unwrap();
     message.success("Appointment added successfully");
     dispatch(removeAllContactAppointment());
     dispatch(clearAllSelection());
     setServiceAdvisor({ name: "", value: "" });
     setSelectedCustomer(null)
     setSearchTerm("")
     setTechnicians({ technicians: [] });
     setIsChecked(false);
     refetch()
     dispatch(setResetStatus(true));
   } catch (error) {
     message.error(`Failed to add appointment Please try again`);
   }
 };




return (
  <div className="max-w-6xl mx-auto px-2 sm:px-4 py-1 mb-2 mt-3">
 <div className="flex items-center mb-2">
  <button
  type="button"
  onClick={() => handleReset()}
  className="inline-flex items-center gap-2 px-3 rounded-sm cursor-pointer border border-solid border-gray-300 py-0.5  text-sm  text-gray-700 bg-gray-200 "
>
  <ReloadOutlined  className="text-xs" />
  Reset
</button>
</div>


  <Form
    submitHandler={handleSubmit}
    {...(pageTitle === "Create Appointment"
      ? { resolver: yupResolver(appointmentSchema) }
      : {})}
    formKey="createAppointment"
  >
    <div className="border border-gray-200 border-solid p-5 rounded bg-white">

      {/* FIRST GRID — 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="-mt-3 col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Customer Name <span className="text-red-500">*</span>
  </label>

<Select
  showSearch
  labelInValue
  placeholder="Select Customer"
  style={{ width: "100%", height: "32px" }}
  filterOption={false}
  value={
    selectedCustomer
      ? { value: selectedCustomer.id ?? "temp", label: selectedCustomer.name }
      : undefined
  }
  onSearch={(value) => dispatch(setSearchTerm(value))}
  onChange={(value: any) => {
    setSelectedCustomer({
      id: value.value === "temp" ? null : value.value,
      name: value.label,
    });
  }}
  notFoundContent={
    searchTerm ? (
      <div
        onMouseDown={(e) => e.preventDefault()}   
        className="flex justify-between px-2 text-sm text-black rounded-md"
      >
        <span
        className="cursor-pointer"
        onClick={() => {
          setSelectedCustomer({
            id: null,
            name: searchTerm,
          });

          dispatch(setSearchTerm("")); // dropdown clear
        }}
      >
        {searchTerm}
      </span>

        <span
          onClick={(e) => {
            e.stopPropagation();
            handleCreateCustomer(searchTerm);
          }}
          className="text-xs underline font-semibold cursor-pointer"
        >
          Create Contact
        </span>
      </div>
    ) : null
  }
>
  {contact.map((c: any) => (
    <Option key={c.id} value={c.id}>
      {c.name}
    </Option>
  ))}
</Select>
        </div>
        <SetDefaultTimes></SetDefaultTimes>
        <FormDatePicker
          name="scheduled"
          label="Schedule"
          required
          placeholder="Schedule"
          handleChange={handleDateChange}
          disablePast={true}
        />

      </div>

      {/* SECOND GRID — 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-3 items-center  mt-2">
        
        <FormTimePicker
          name="startHour"
          label="Start Time"
          placeholder="Select Appointment Start Time"
          selectedDate={date||clickedDate}
        />

        <FormTimePicker
          name="duration"
          label="Duration"
          placeholder="Select Appointment Duration"
        />
        <AutoEndHour></AutoEndHour>
        <FormTimePicker
         name="endHour"
         label="End Time"
         placeholder="End Time"
         disabled={true}
       />
        <FormInput
          name="suggestedHour"
          type="text"
          size="middle"
          placeholder="Suggested Hour"
          label="Suggested Hour"
        />

        <FormSelectField
          size="middle"
          name="tag"
          options={tagOptions}
          label="Tag"
          placeholder="Tag"
        />

        <FormInput
          name="odometer"
          type="text"
          size="middle"
          label="Odometer"
          placeholder="Enter odometer reading"
        />

        {/* Note full width */}
        <div className="md:col-span-3">
          <FormTextArea
            name="note"
            label="Note"
            placeholder="Enter something..."
            rows={3}
          />
        </div>
      </div>

      {/* SERVICE ADVISOR / TECHNICIAN SECTION */}
      <div className="flex flex-col md:flex-row gap-4 mt-4">

        <div className="md:w-1/2">
          <label className="block mb-1 text-gray-700 font-medium">
            Service Advisor
          </label>
          <input
            type="text"
            defaultValue={serviceAdvisor.name}
            disabled
            className="w-full px-3 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="md:w-1/2">
          <label className="block mb-1 text-gray-700 font-medium">
            Technician
          </label>
          <ul className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-gray-50 list-none">
            {technicians?.technicians?.map((person: any) => (
              <li
                key={person.id}
                className="px-3 py-1 rounded-full bg-white text-gray-700 shadow-sm border border-transparent hover:bg-blue-50 hover:border-blue-300 transition-all text-sm font-medium"
              >
                {person.name}
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>

    {/* Confirm + Buttons */}
    <div className="flex mt-2 flex-col md:flex-row md:justify-between md:items-center gap-3">

      <div className="flex items-center">
        <div onClick={handleCheckboxChange} className="mr-2 cursor-pointer">
          {isChecked ? (
            <FaCheckCircle size={18} color="#3bc990" />
          ) : (
            <FaRegCircle size={18} color="#A8B5DE" />
          )}
        </div>
        <span className="text-sm font-medium">
          This appointment is confirmed
        </span>
      </div>

      <div className="flex flex-wrap gap-2 justify-start md:justify-end">

  {/* Connect Work Order */}
  <Button
  type="primary"
  icon={workOrder ? <DisconnectOutlined /> : <LinkOutlined />}
  className={`font-medium py-1.5 px-4 w-full sm:w-auto flex items-center
    ${workOrder
      ? 'bg-gray-500 hover:bg-gray-600'
      : 'bg-[#1e8cec] hover:bg-[#187bd6]'}
  `}
  onClick={() => setWorkOrder(!workOrder)}
>
  {workOrder ? 'Hide Work Order' : 'Connect Work Order'}
</Button>

  {/* Submit */}
  <Button
    type="primary"
    icon={<CheckOutlined />}
    htmlType="submit"
    className="bg-[#3bc990] hover:bg-[#34b884] font-medium py-1.5 px-3 w-full sm:w-auto flex items-center"
  >
    Submit
  </Button>

  {/* Cancel */}
  <Button
    type="primary"
    danger
    icon={<CloseOutlined />}
    className="font-medium py-1.5 px-3 w-full sm:w-auto flex items-center"
    onClick={() => window.history.back()}
  >
  
  </Button>

</div>
    </div>

    {/* Work Order Section */}
    {workOrder && (
      <div className="mt-5 p-4 border rounded-lg bg-gray-50">
        <label className="block mb-2 font-medium text-gray-700">
          Search for WorkOrder
        </label>

        <div className="flex gap-2">
          <Input
            type="text"
            size="middle"
            placeholder="Search..."
            className="w-full"
            value={searchTermWorkOrder || ""}
            onChange={handleInputChange}
          />

          {!!searchTermWorkOrder && (
            <Button onClick={resetFilters} size="middle" type="primary">
              <ReloadOutlined />
            </Button>
          )}
        </div>

        <SearchItemShow
          data={allWorkOrdersData}
          type={false}
          page="appointment"
        />
      </div>
    )}

  </Form>
</div>

);

};

export default CreateAppointment;
