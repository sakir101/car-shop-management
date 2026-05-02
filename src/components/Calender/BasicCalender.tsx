"use client";
import React, { useState, useMemo, useEffect } from "react";
import Calender from "./Calender";
import {  View, Views } from "react-big-calendar";
import moment from "moment";
import {
  useDeleteAppointmentMutation,
  useGetAllAppointmentQuery,
  useGetAllContactForAppointmentQuery,
  useGetAllWorkOrdersQuery,
  useGetServiceAdvisorTechniciansQuery,
  useUpdateAppointmentMutation,
} from "@/redux/api/appointmentApi";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ReloadOutlined,
  RiseOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  TimePicker,
  Input,
  Select,
  Button,
  message,
  List,
  Radio,
  Switch,
  Modal,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";



import {
  estimateStatusOptionsForFillter,
  tagOptions,
  tagOptionsForFilter,
} from "@/constant/global";
import {
  formatTime,
  formatTo12HourTime,
  parseTime,
} from "@/utils/timeDuration";
import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import SearchItemShow from "../SearchItemShow/SearchItemShow";
import { useAppDispatch, useAppSelector, useDebounced } from "@/redux/hooks";
import { removeAllAppointmentState, removeAllEstimateAppointment, removeEstimateCode } from "@/redux/slice/appointmentSlice";
import Link from "next/link";
import { clearCheckboxState } from "@/redux/slice/selectionSlice";
import { getUserInfo } from "@/services/auth.service";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { SelectedCustomer } from "@/app/(adminLayout)/admin/appointment/create/page";
import { formatLocal12h } from "@/utils/formatLocal12h ";
import { localDateAnd12hToUTC } from "@/utils/localDateAnd12hToUTC";
import { formatLocalDate } from "@/utils/formatLocalDate";
import { it } from "node:test";

interface ServiceAdvisor {
  name: string;
  id: string;
}

interface SelectedEvent {
  id: string;
  estimateCode: string;
  estimate:Estimate
  duration: string;
  start: string | "";
  end: string | "";
  scheduledDate: string;
  hexColor: string;
  note: string;
  odometer: string;
  suggestedHour: string;
  tag: string;
  is_confirm:boolean;
  customerName:string;
  customer:Person;
  assignedServiceAdvisor: ServiceAdvisor;
  unassignedServiceAdvisor: ServiceAdvisor;
  assignedTechnician: Technician[];
  unassignedTechnician: Technician[];
}

interface TempEvent {
  id: string;
  estimateCode: string;
  estimate:Estimate;
  duration: string;
  start: string | Date;
  end: string | Date;
  scheduledDate: string;
  note: string;
  odometer: string;
  suggestedHour: string;
  hexColor: string;
  tag: string;
  is_confirm:boolean;
  customerName:string;
  customer:Person;
  assignedServiceAdvisor: ServiceAdvisor;
  assignedTechnician: Technician[];
}

interface Person {
  name: string;
  contactNum: string;
  address: string;
  email: string;
  id: string;
}
interface Estimate {
  status: string;
  title:string;
}

interface Technician {
  technicianId: string;
  technician: {
    name: string;
  };
}

interface Event {
  scheduled: string;
  startHour: string;
  endHour:string;
  id: string;
  scheduledDate: string;
  hexColor: string;
  start: string;
  end: string;
  duration: string;
  contactId: string;
  serviceAdvisorId: string;
  estimateCode: string;
  note: string;
  odometer: string;
  suggestedHour: string;
  tag: string;
  is_confirm:boolean;
  customerName:string;
  technician: Technician[];
  serviceAdvisor: Person;
  estimate: Estimate;
  customer: Person;
}

const { Option } = Select;

const BasicCalender = () => {
  dayjs.extend(utc);
  const queryWorkOrder: Record<string, any> = {};
  const query: Record<string, any> = {};
  const { role} = getUserInfo() as any;
  const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(
    null
  );
  const [showSortedList, setShowSortedList] = useState(false);
  const [tempEvent, setTempEvent] = useState<TempEvent | null>(null);
  const [estimateCode, setEstimateCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>( localStorage.getItem('currentView') as View ||Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [end, setEnd] = useState<string>("");
  const [filter, setFilter] = useState("Tag");
  const [statusFilter, setStatusFilter] = useState("Status");
  const [selectedCustomer, setSelectedCustomer] =useState<SelectedCustomer | null>(null);
  const [workOrder, setWorkOrder] = useState<Boolean>(false);
  const [searchTermWorkOrder, setSearchTermWorkOrder] = useState<string>("");
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
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
  const {estimateState,estimateCode:estimateCodeState} = useAppSelector((state) => state.appointmentItemShow);
  const dispatch =useAppDispatch()
  const resetFilters = () => {
  setSearchTermWorkOrder('')
 };

  const router = useRouter();
  const {data:allData }:any=  useGetAllContactForAppointmentQuery(query,{
          refetchOnMountOrArgChange: true,
        })
const [deleteAppointment]  =useDeleteAppointmentMutation()
  const contact = allData?.data?.data || [];

  useEffect(() => {
  if (!searchTerm || contact.length === 0) return;

  // exact match (case-insensitive)
  const exactMatch = contact.find(
    (c:any) => c.name.trim().toLowerCase() === searchTerm.trim().toLowerCase()
  );
  if (exactMatch && selectedCustomer?.name !== exactMatch.name) {
    setSelectedCustomer({
      name:exactMatch.name,
      id:exactMatch.id,
    });
    dispatch(setSearchTerm(""));
  }
}, [dispatch,searchTerm, contact, selectedCustomer]);


  const { data, isLoading, refetch } = useGetAllAppointmentQuery(
    {
      tag: `${filter}`,
      status: `${statusFilter}`,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const statusOrder = {
    Pending: 1,
    Approved: 2,
    Rejected: 3,
    Report_Generated: 4,
    Report_Authorized:5,
  };

  const sortedData: any = data?.data
    ?.slice()
    .sort(
      (
        a: { estimate: { status: string } },
        b: { estimate: { status: string } }
      ) => {
        const aStatus = a.estimate?.status as keyof typeof statusOrder;
        const bStatus = b.estimate?.status as keyof typeof statusOrder;

        return statusOrder[aStatus] - statusOrder[bStatus];
      }
    );

  const selectedDate = new Date(currentDate);
  const formattedLabelDate = selectedDate.toLocaleDateString().split("T")[0];

  // Filter appointments based on scheduled date
  const filteredData = sortedData?.filter((item: any) => {
    const startHourDate = new Date(item.startHour)
      ?.toLocaleDateString()
      ?.split("T")[0];
    return startHourDate === formattedLabelDate;
  });
  const { data: allWorkOrders } = useGetAllWorkOrdersQuery(
     queryWorkOrder,
     {
       refetchOnMountOrArgChange: true,
     }
   );
 
   const allWorkOrdersData: any = allWorkOrders?.data;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTermWorkOrder(term);
  };

const handleCreateCustomer = (term: string) => {
  const url = `/${role}/contact/create?name=${encodeURIComponent(term)}`;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.click();
};
  const {
    data: serviceAdvisorTechnician,
    refetch: serviceAdvisorTechnicianRefetch,
    isLoading:loading
  } = useGetServiceAdvisorTechniciansQuery(
     { code: estimateCode || estimateCodeState || null },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [updateAppointment] = useUpdateAppointmentMutation();
  const handleViewChange = (view: View) => {
    setCurrentView(view);
    localStorage.setItem('currentView',view)
  };
  const appointmentData = sortedData;
  const closeModal = () => {
    dispatch(removeAllEstimateAppointment())
    dispatch(removeEstimateCode())
    dispatch(clearCheckboxState())
    setSearchTermWorkOrder('')
    setIsModalOpen(false);
    setWorkOrder(false);
    setSelectedCustomer(null)

  };

  useEffect(()=>{
    localStorage.removeItem('formValues_createAppointment')
    dispatch(removeAllAppointmentState())
  },[dispatch])
  useEffect(() => {
    if ((
    serviceAdvisorTechnician?.serviceAdvisor ||
    serviceAdvisorTechnician?.technician?.length > 0
    )&& !loading) {
      const fetchedServiceAdvisor = serviceAdvisorTechnician?.serviceAdvisor;
      const fetchedTechnicians = serviceAdvisorTechnician?.technician || [];
      const assignedServiceAdvisor = tempEvent?.assignedServiceAdvisor;
      const assignedTechnicians = tempEvent?.assignedTechnician || [];
      // ✅ Extract assigned technician IDs correctly
      const assignedTechnicianIds = assignedTechnicians.map(
        (tech) => tech.technicianId
      );

      const unassignedTechnicians = fetchedTechnicians
        .filter((tech: any) => !assignedTechnicianIds.includes(tech.id))
        .map((tech: any) => ({
          technicianId: tech.id,
          technician: {
            name: tech.name,
          },
        }));
      // ✅ Handle serviceAdvisor correctly
      const unassignedServiceAdvisor =
        fetchedServiceAdvisor &&
        (!assignedServiceAdvisor ||
          fetchedServiceAdvisor.id !== assignedServiceAdvisor.id)
          ? fetchedServiceAdvisor
          : null;
      if (tempEvent && (tempEvent.estimateCode || estimateCodeState)) {
        const updatedSelectedEvent: SelectedEvent = {
          id: tempEvent?.id,
          estimateCode: tempEvent?.estimateCode || estimateCodeState,
          estimate:tempEvent.estimate ||{status:estimateState[0]?.status,title:estimateState[0]?.title} ,
          duration: tempEvent.duration || "",
          start:
            tempEvent.start instanceof Date
              ? tempEvent.start.toISOString()
              : tempEvent.start || "",
          end:
            tempEvent.end instanceof Date
              ? tempEvent.end.toISOString()
              : tempEvent.end || "",
          note: tempEvent.note,
          suggestedHour: tempEvent.suggestedHour,
          odometer: tempEvent.odometer,
          scheduledDate: tempEvent.scheduledDate || "",
          hexColor: tempEvent.hexColor || "gray",
          tag: tempEvent.tag || "",
          is_confirm:tempEvent?.is_confirm,
          customerName:tempEvent?.customerName||"",
          customer:tempEvent.customer||{},
          assignedServiceAdvisor: tempEvent.assignedServiceAdvisor || {},
          unassignedServiceAdvisor: unassignedServiceAdvisor || {},
          assignedTechnician: tempEvent.assignedTechnician || [],
          unassignedTechnician: unassignedTechnicians || [],
        };
        setSelectedEvent(updatedSelectedEvent);
      }
    }
    else{
      if (!serviceAdvisorTechnician?.serviceAdvisor &&
        serviceAdvisorTechnician?.technician?.length === 0 && (tempEvent?.customer?.name||tempEvent?.customerName) && !loading) {
        const updatedSelectedEvent: SelectedEvent = {
          id: tempEvent.id,
          estimateCode: tempEvent.estimateCode,
          estimate:tempEvent.estimate,
          duration: tempEvent.duration || "",
          start:
            tempEvent.start instanceof Date
              ? tempEvent.start.toISOString()
              : tempEvent.start || "",
          end:
            tempEvent.end instanceof Date
              ? tempEvent.end.toISOString()
              : tempEvent.end || "",
          note: tempEvent.note,
          suggestedHour: tempEvent.suggestedHour,
          odometer: tempEvent.odometer,
          scheduledDate: tempEvent.scheduledDate || "",
          hexColor: tempEvent.hexColor || "gray",
          is_confirm:tempEvent?.is_confirm,
          customerName:tempEvent?.customerName||"",
          customer:tempEvent.customer,
          tag: tempEvent.tag || "",
          assignedServiceAdvisor: tempEvent.assignedServiceAdvisor || {},
          unassignedServiceAdvisor:{
            name: "",
            id: ""
          },
          assignedTechnician: tempEvent.assignedTechnician || [],
          unassignedTechnician:  [],
        };

        setSelectedEvent(updatedSelectedEvent);
      }
      }
     
      
  }, [serviceAdvisorTechnician, tempEvent]);

  useEffect(() => {
    if (selectedEvent?.start && selectedEvent?.duration) {
      const formattedTimeStart = formatTo12HourTime(selectedEvent?.start);
      const startTime = parseTime(formattedTimeStart);

      if (startTime) {
        const [durationHours, durationMinutes] = selectedEvent?.duration
          .split(":")
          .map(Number);

        startTime.setHours(startTime.getHours() + durationHours);
        startTime.setMinutes(startTime.getMinutes() + durationMinutes);

        setEnd(formatTime(startTime));
      }
    }
  }, [selectedEvent?.start, selectedEvent?.duration]);

  const updateSelectedEvent = (key: keyof SelectedEvent, value: any) => {
    setSelectedEvent((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleEventClick =  (event: Event) => {
  
   const scheduled = dayjs(event?.scheduled).local().format("YYYY-MM-DD");
    setSelectedEvent(null)
     setEstimateCode(event?.estimateCode);
     const startHour = new Date(event?.startHour); 
     const endHour = new Date(event?.endHour); 
     if(event){
      setIsModalOpen(true);
     }

    const eventFormatted = {
      id: event?.id,
      estimateCode: event?.estimateCode,
      estimate:event?.estimate,
      duration: event?.duration,
      start: event?.start ||startHour,
      end: event?.end ||endHour,
      note: event?.note,
      suggestedHour: event?.suggestedHour,
      odometer: event?.odometer,
      scheduledDate: event?.scheduledDate || scheduled,
      hexColor:
        event?.hexColor || getProfessionalColor(event?.estimate?.status),
      tag: event?.tag,
      is_confirm:event?.is_confirm,
      customerName:event?.customerName,
      customer:event?.customer,
      assignedServiceAdvisor: event?.serviceAdvisor
        ? {
            name: event?.serviceAdvisor?.name,
            id: event?.serviceAdvisorId,
          }
        : {
            name: "",
            id: "",
          },
      assignedTechnician: event?.technician
        ? event?.technician.map((tech) => ({
            technicianId: tech.technicianId,
            technician: {
              name: tech?.technician?.name || "",
            },
          }))
        : [],
    };
    setTempEvent(eventFormatted);
  };

  // Function to determine background color based on duration
  const getProfessionalColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "#2E7D32";
      case "Pending":
        return "#FFA500";
      case "Rejected":
        return "#C62828";
      default:
        return "#9E9E9E";
    }
  };
  const handleDeleteAppointment =async(id:string)=>{
    const confirmed = await new Promise((resolve) => {
          Modal.confirm({
            title: "Are you sure you want to delete this Appointment?",
            content: "This action cannot be undone.",
            okText: "Yes, delete",
            okType: "danger",
            cancelText: "No, cancel",
            onOk: () => resolve(true),
            onCancel: () => resolve(false),
          });
        });
    
        if (!confirmed) {
          return;
        }
    
        try {
          await deleteAppointment(id)
            .unwrap()
            .then(() => {
              message.success(" Appointment successfully !");
            });
        } catch (err: any) {
          message.error(
            `Failed to delete Appointment, Please try again.`
          );
        }
  }
  const handleClick=(date:any)=>{
  if (currentView === Views.MONTH) {
    setCurrentDate(moment(date).toDate());
    setCurrentView(Views.DAY);
    return;
  }

  }

  const events = useMemo(() => {
    const dailyStats: Record<string, { totalHours: number; count: number }> =
      {};
    const mappedEvents = appointmentData
      ?.map((appointment: any) => {
        const {
          id,
          scheduled,
          startHour,
          endHour,
          duration,
          serviceAdvisorId,
          estimateCode,
          estimate,
          note,
          odometer,
          suggestedHour,
          tag,
          technician,
          contact,
          serviceAdvisor,
          customerName,
          customer,
          is_confirm
        } = appointment;

        if (!scheduled || !startHour || !endHour) return null;
        const scheduledDate = moment(scheduled).format("YYYY-MM-DD");
        const eventDate = moment(startHour).local().format("YYYY-MM-DD");

        const startTime = new Date(startHour); 
        const endTime = new Date(endHour);
        const parseDurationToHours = (duration: string) => {
          const [hours, minutes] = duration.split(":").map(Number);
          return hours + minutes / 60;
        };
        const numericHours = parseDurationToHours(duration);

        if (!dailyStats[eventDate]) {
          dailyStats[eventDate] = { totalHours: 0, count: 0 };
        }
        dailyStats[eventDate].totalHours += numericHours;
        dailyStats[eventDate].count += 1;


        // Determine background color based on the duration
        const backgroundColor = getProfessionalColor(estimate?.status);

        return {
          id,
          start: startTime,
          end: endTime,
          scheduledDate,
          duration,
          hexColor: backgroundColor,
          serviceAdvisorId,
          estimateCode,
          note,
          odometer,
          suggestedHour,
          tag,
          technician,
          contact,
          serviceAdvisor,
          estimate,
          customerName,
          customer,
          is_confirm
        };
      })
      .filter(Boolean);
    if (currentView === Views.MONTH ) {
      return Object.keys(dailyStats).map((date) => {
        const totalMinutes = dailyStats[date].totalHours * 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);
        return {
          start: moment(date).toDate(),
          end: moment(date).toDate(),
          title: (
             <div onClick={()=>handleClick(date)}>
          {/* Desktop view: show key + value */}
          <div className="hidden md:flex flex-col text-white">
            <div >
              Booked :{" "}
              <strong>
                {hours > 0 ? `${hours} h ` : ""}
                {minutes > 0 ? `${minutes} m` : ""}
              </strong>
            </div>
            <div>
              Appointment : <strong>{dailyStats[date].count}</strong>
            </div>
          </div>
      
          {/* Mobile view: show only value */}
          <div className="flex md:hidden sm:gap-3 sm:flex-row flex-col text-white">
            <div>
              <strong>
                {hours > 0 ? `${hours} h ` : ""}
                {minutes > 0 ? `${minutes} m` : ""}
              </strong>
            </div>
            <div>
              <strong>{dailyStats[date].count}</strong>
            </div>
          </div>
        </div>
        ),

          hexColor: "#033b94",
        };
      });
    } 
    else if (currentView === Views.WEEK) {
  const eventItems = mappedEvents?.map((event: any) => {
    const parseDurationToHours = (duration: string) => {
          const [hours, minutes] = duration.split(":").map(Number);
          return hours + minutes / 60;
        };
        const numericHours = parseDurationToHours(event.duration);
        const totalMinutes = numericHours * 60;
        const StatusDisplayNames: { [key: string]: string } = {
          Pending: "Pending",
          Approved: "Approved",
          Rejected: "Rejected",
          Report_Generated: "Report Generated",
          Report_Authorized: "Report Authorized",
        };
        const TagDisplayNames: { [key: string]: string } = {
          Waiting_For_Parts: "Waiting for Parts",
          Parts_Received: "Parts Received",
          Waiter: "Waiter",
          Shuttle: "Shuttle",
          Overnight: "Overnight",
          Awaiting_Approval: "Awaiting Approval",
          Priority: "Priority",
          Invoice_Finalized: "Invoice Finalized",
          Drop_Off: "Drop Off",
        };
        return {
          start: event?.start,
          end: event?.end,
          title: (
           <Tooltip 
            
             color="#f5f5f5" // light gray background
             overlayInnerStyle={{ 
               width: "250px", 
               maxWidth: "250px",
               padding: "10px",
               fontSize: "12px",
               lineHeight: "1.5",
             }}
             title={
               <div className="text-gray-900">
              
           
                 {event?.customerName && (
                   <div>
                     <strong>Customer:</strong> {event.customerName}
                   </div>
                 )}
           
                 {event?.tag && (
                   <div>
                     <strong>Tag:</strong> {TagDisplayNames[event.tag] || event.tag}
                   </div>
                 )}
           
                 {event?.scheduledDate && (
                   <div>
                     <strong>Scheduled Date:</strong> {event.scheduledDate}
                   </div>
                 )}
           
                 {event?.start && (
                   <div>
                     <strong>Start:</strong> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                 )}
           
                 {event?.end && (
                   <div>
                     <strong>End:</strong> {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                 )}
           
                 {event?.duration && (
                   <div>
                     <strong>Duration:</strong> {event.duration}
                   </div>
                 )}
           
                 {event?.estimate?.name && (
                   <div>
                     <strong>Estimate:</strong> {event.estimate.name}
                   </div>
                 )}
           
                 {event?.estimate?.vehicle?.length > 0 && (
                   <div>
                     <strong>Vehicle:</strong>{" "}
                     {event.estimate.vehicle
                       .map((v: any) => `${v.vehicle.year} ${v.vehicle.model}`)
                       .join(", ")}
                   </div>
                 )}
           
                 {event?.odometer && (
                   <div>
                     <strong>Odometer:</strong> {event.odometer}
                   </div>
                 )}
           
                 {event?.suggestedHour && (
                   <div>
                     <strong>Suggested Hour:</strong> {event.suggestedHour}
                   </div>
                 )}
           
                 {event?.is_confirm !== undefined && (
                   <div>
                     <strong>Confirm:</strong> {event.is_confirm ? "Confirmed" : "Pending"}
                   </div>
                 )}
           
                 {event?.note && (
                   <div>
                     <strong>Note:</strong> {event.note}
                   </div>
                 )}
                 {event?.estimate && (
                   <div>
                     <strong>Estimate:</strong> {event.estimate.title}
                   </div>
                 )}
               </div>
             }
           >
                   <div>
             <div
              className="flex flex-col h-full cursor-pointer focus:outline-none p-1 rounded-none "
              style={{ backgroundColor: event.is_confirm ? event?.hexColor : "#FDE68A" }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start relative">
                
                 <p className="text-xs flex flex-wrap gap-1">
                  {(event?.customerName) && (event?.customerName)}
                 </p>
        
                {/* Delete Icon */}
               <DeleteOutlined
                     className="text-red-500 text-lg hover:text-red-700 absolute right-0 top-0"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteAppointment(event.id);
                     }}
                   />
              </div>
             
            </div>
             
           </div>

           </Tooltip>
          ),
          
          eventInfo: event,
          totalMinutes: totalMinutes,
          hexColor: event.is_confirm ? event?.hexColor : "#FDE68A",
    };
  }) || [];

  const dailySummaryItems = Object.keys(dailyStats).map((date) => {
    const totalMinutes = dailyStats[date].totalHours * 60;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);

    return {
      start: moment(date).toDate(),
      end: moment(date).toDate(),
      title: (
        <div>
          {/* Desktop */}
          <div className="hidden md:flex flex-col text-white">
            <div>
              Booked :{" "}
              <strong>
                {hours > 0 ? `${hours} h ` : ""}
                {minutes > 0 ? `${minutes} m` : ""}
              </strong>
            </div>
            <div>
              Appointment :{" "}
              <strong>{dailyStats[date].count}</strong>
            </div>
          </div>

          {/* Mobile */}
          <div className="flex md:hidden flex-col text-white">
            <strong>
              {hours > 0 ? `${hours} h ` : ""}
              {minutes > 0 ? `${minutes} m` : ""}
            </strong>
            <strong>{dailyStats[date].count}</strong>
          </div>
        </div>
      ),
      hexColor: "#033b94",
    };
  });

  // ✅ return both together
  return [...eventItems, ...dailySummaryItems];
    }
    else if (currentView === Views.DAY) {
      return mappedEvents?.map((event: any) => {
        
        const parseDurationToHours = (duration: string) => {
          const [hours, minutes] = duration.split(":").map(Number);
          return hours + minutes / 60;
        };
        const numericHours = parseDurationToHours(event.duration);
        const totalMinutes = numericHours * 60;
        const StatusDisplayNames: { [key: string]: string } = {
          Pending: "Pending",
          Approved: "Approved",
          Rejected: "Rejected",
          Report_Generated: "Report Generated",
          Report_Authorized: "Report Authorized",
        };
        const TagDisplayNames: { [key: string]: string } = {
          Waiting_For_Parts: "Waiting for Parts",
          Parts_Received: "Parts Received",
          Waiter: "Waiter",
          Shuttle: "Shuttle",
          Overnight: "Overnight",
          Awaiting_Approval: "Awaiting Approval",
          Priority: "Priority",
          Invoice_Finalized: "Invoice Finalized",
          Drop_Off: "Drop Off",
        };
        return {
          start: event?.start,
          end: event?.end,
          title: (
           <Tooltip 
            
             color="#f5f5f5" // light gray background
             overlayInnerStyle={{ 
               width: "250px", 
               maxWidth: "250px",
               padding: "10px",
               fontSize: "12px",
               lineHeight: "1.5",
             }}
             title={
               <div className="text-gray-900">
              
           
                 {event?.customerName && (
                   <div>
                     <strong>Customer:</strong> {event.customerName}
                   </div>
                 )}
                 
           
                 {event?.tag && (
                   <div>
                     <strong>Tag:</strong> {TagDisplayNames[event.tag] || event.tag}
                   </div>
                 )}
           
                 {event?.scheduledDate && (
                   <div>
                     <strong>Scheduled Date:</strong> {event.scheduledDate}
                   </div>
                 )}
           
                 {event?.start && (
                   <div>
                     <strong>Start:</strong> {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                 )}
           
                 {event?.end && (
                   <div>
                     <strong>End:</strong> {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </div>
                 )}
           
                 {event?.duration && (
                   <div>
                     <strong>Duration:</strong> {event.duration}
                   </div>
                 )}
           
                 {event?.estimate?.name && (
                   <div>
                     <strong>Estimate:</strong> {event.estimate.name}
                   </div>
                 )}
           
                 {event?.estimate?.vehicle?.length > 0 && (
                   <div>
                     <strong>Vehicle:</strong>{" "}
                     {event.estimate.vehicle
                       .map((v: any) => `${v.vehicle.year} ${v.vehicle.model}`)
                       .join(", ")}
                   </div>
                 )}
           
                 {event?.odometer && (
                   <div>
                     <strong>Odometer:</strong> {event.odometer}
                   </div>
                 )}
           
                 {event?.suggestedHour && (
                   <div>
                     <strong>Suggested Hour:</strong> {event.suggestedHour}
                   </div>
                 )}
           
                 {event?.is_confirm !== undefined && (
                   <div>
                     <strong>Confirm:</strong> {event.is_confirm ? "Confirmed" : "Pending"}
                   </div>
                 )}
           
                 {event?.note && (
                   <div>
                     <strong>Note:</strong> {event.note}
                   </div>
                 )}
                 {event?.estimate && (
                   <div>
                     <strong>Estimate:</strong> {event.estimate.title}
                   </div>
                 )}
               </div>
             }
           >
                   <div>
             <div
              className="flex flex-col h-full cursor-pointer focus:outline-none p-1 rounded-none "
              style={{ backgroundColor: event.is_confirm ? event?.hexColor : "#FDE68A" }}
            >
              {/* Top Row */}
              <div className="flex justify-between items-start relative">
                
           <p className="text-xs flex flex-wrap gap-1">
            {[
              event?.tag && (
                <strong className="flex items-center gap-1">
                  <TagOutlined />
                  {TagDisplayNames[event?.tag] || event?.tag}
                </strong>
              ),
          
              event?.estimate?.status && (
                <strong className="flex items-center gap-1">
                  <RiseOutlined />
                  {StatusDisplayNames[event?.estimate?.status] ||
                    event?.estimate?.status}
                </strong>
              ),
              event?.customerName && event?.customerName,
          
              event?.estimate?.vehicle?.length && event?.estimate?.vehicle
                ?.map((v: any) => v?.vehicle?.year+" "+v?.vehicle?.model)
                .join(" "),
          
              event?.note,
            ]
              .filter(Boolean)
              .map((item, index, arr) => (
                <span key={index}>
                  {item}
                  {index !== arr.length - 1 && ", "}
                </span>
              ))}
            </p> 
        
                {/* Delete Icon */}
               <DeleteOutlined
                     className="text-red-500 text-lg hover:text-red-700 absolute right-0 top-0"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteAppointment(event.id);
                     }}
                   />
              </div>
             
            </div>
             
           </div>

           </Tooltip>
          ),
          
          eventInfo: event,
          totalMinutes: totalMinutes,
          hexColor: event.is_confirm ? event?.hexColor : "#FDE68A",
        };
      });
    } else if (currentView === Views.AGENDA) {
      return mappedEvents?.map((event: any) => {
        const totalMinutes = event?.duration * 60;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = Math.round(totalMinutes % 60);

        return {
          start: event?.start,
          end: event?.end,
          title: (
            <div>
              <div>
                Duration:{" "}
                <strong>
                  {hours > 0 ? `${hours}h ` : ""}
                  {minutes > 0 ? `${minutes}m` : ""}
                </strong>
              </div>
            </div>
          ),
        };
      });
    }
  }, [appointmentData, currentView]);

  const eventStyleGetter = (
    event: any,
    start: any,
    end: any,
    isSelected: any
  ) => {
    const backgroundColor = event.hexColor;
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: "10px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
    };

    return {
      style: style,
    };
  };

  const handleSubmit = async () => {
    const formattedScheduled = formatLocalDate(selectedEvent?.scheduledDate)
    if (selectedEvent) {
      const serviceAdvisorId =
        selectedEvent.assignedServiceAdvisor?.id ||
        selectedEvent.unassignedServiceAdvisor?.id ||
        "";
      // Merge assigned and unassigned technicians
      const mergedTechnicians = [
        ...selectedEvent.assignedTechnician,
        ...selectedEvent.unassignedTechnician,
      ].map((tech) => ({
        name: tech.technician.name,
        id: tech.technicianId,
      }));

      const formattedTimeStart = formatTo12HourTime(selectedEvent.start);
      // Create the formatted data
      const formattedData = {
        startHour: localDateAnd12hToUTC(formattedScheduled,formattedTimeStart)  || undefined,
        endHour: localDateAnd12hToUTC(formattedScheduled,end) || undefined,
        estimateCode:selectedEvent.estimateCode || undefined,
        suggestedHour: selectedEvent.suggestedHour,
        duration: selectedEvent.duration || undefined,
        odometer: selectedEvent.odometer,
        note: selectedEvent.note,
        tag: selectedEvent.tag,
        scheduled: new Date(`${formattedScheduled}T00:00:00`) || undefined,
        serviceAdvisorId: serviceAdvisorId || undefined,
        is_confirm:selectedEvent.is_confirm,
        customerName:selectedCustomer?.name ||selectedEvent.customerName,
        customerId:selectedCustomer?.id || undefined,
        technician: mergedTechnicians.length > 0 ? mergedTechnicians : null,
      };

      try {
        await updateAppointment({
          id: selectedEvent.id,
          data: formattedData,
        }).unwrap();
        refetch();
        serviceAdvisorTechnicianRefetch();
        message.success("Appointment updated successfully");
        setIsModalOpen(false);
      } catch (error) {
        message.error(`Failed to update appointment`);
      }
    }
  };
  const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
  return (
    <div className="flex flex-wrap items-center justify-between py-2 gap-2">
      {/* Navigation Buttons */}
      <div className="flex gap-1 w-full sm:w-auto justify-center sm:justify-start">
        <button
          className="px-3 py-1 rounded border cursor-pointer border-gray-300 hover:bg-gray-100"
          onClick={() => onNavigate("PREV")}
        >
          Back
        </button>
        <button
          className="px-3 py-1 rounded border cursor-pointer border-gray-300 hover:bg-gray-100"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
        <button
          className="px-3 py-1 rounded border cursor-pointer border-gray-300 hover:bg-gray-100"
          onClick={() => onNavigate("NEXT")}
        >
          Next
        </button>
      </div>

      {/* Center Section */}
      <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-2 w-full sm:w-auto">
        <span className="text-lg font-medium">{label}</span>

        {view === Views.DAY && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select
              value={filter}
              className="w-full sm:w-40"
              onChange={(value) => setFilter(value)}
              options={tagOptionsForFilter}
            />
            <Select
              value={statusFilter}
              className="w-full sm:w-40"
              onChange={(value) => setStatusFilter(value)}
              options={estimateStatusOptionsForFillter}
            />
            <Button
              className="w-full sm:w-auto"
              onClick={() => setShowSortedList(!showSortedList)}
            >
              {showSortedList ? "Hide List" : "Show List"}
            </Button>
          </div>
        )}
      </div>

      {/* View Buttons */}
      <div className="flex gap-1 w-full sm:w-auto justify-center sm:justify-end">
        <button
          className={`px-3 py-1 rounded border cursor-pointer ${
            view === Views.MONTH
              ? "bg-blue-100 border-blue-300"
              : "border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => {
            onView(Views.MONTH);
            setFilter("Tag");
            setStatusFilter("Status");
          }}
        >
          Month
        </button>
        <button
          className={`px-3 py-1 rounded cursor-pointer border ${
            view === Views.WEEK
              ? "bg-blue-100 border-blue-300"
              : "border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => {
            onView(Views.WEEK);
            setFilter("Tag");
            setStatusFilter("Status");
          }}
        >
          Week
        </button>
        <button
          className={`px-3 py-1 rounded cursor-pointer border ${
            view === Views.DAY
              ? "bg-blue-100 border-blue-300"
              : "border-gray-300 hover:bg-gray-100"
          }`}
          onClick={() => onView(Views.DAY)}
        >
          Day
        </button>
      </div>
    </div>
  );
};
  const handleDateClick = (slotInfo: any) => {
  const { start } = slotInfo;
//   const date = start;
//    const today = new Date();
//  if(currentView ==='month'){
//    today.setHours(0, 0, 0, 0);
//    date.setHours(0, 0, 0, 0);
//  }
  // if (date < today) {
  //    message.error("You cannot create an appointment in the past!");
  //   return;
  // }
  const formattedDate = start.toLocaleDateString("en-CA");
  const startTime =formatTo12HourTime(start)
  if(currentView ==='day'||currentView==='week'){
    router.push(`/admin/appointment/create?date=${formattedDate}&startTime=${startTime}`);
  }else{
    router.push(`/admin/appointment/create?date=${formattedDate}`);
  }
  
};
 if(isLoading){
    return <Loading></Loading>
  }

// const dayPropGetter = (date: Date): HTMLAttributes<HTMLDivElement> => {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const currentDate = new Date(date);
//   currentDate.setHours(0, 0, 0, 0);

//   // Only disable past dates
//   const isPast = currentDate < today;

//   if (isPast&&currentView==='month') {
//     return {
//       className: 'disabled-date',
//       style: {
//         backgroundColor: '#f5f5f5',
//         color: '#bbb',
//         cursor: 'not-allowed',
//         pointerEvents: 'none',
//         opacity: 0.6
//       } as React.CSSProperties
//     };
//   }
//   return {};
// };
 

  return (
    <>
      {currentView === Views.DAY && showSortedList ? (
        <div className="p-2 md:p-6">
          {/* Header with Buttons */}
          <div className="flex items-center justify-between mb-6">
  {/* Left */}
  <h2 className="text-xl font-semibold text-gray-800">
    Appointments
  </h2>

  {/* Middle Date */}
  <div className="text-lg font-medium text-gray-800">
   {new Date(filteredData[0]?.scheduled)?.toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
})}
  </div>

  {/* Right Button */}
  <div className="flex gap-3">
    <button
      onClick={() => setShowSortedList(false)}
      className="px-4 py-1 cursor-pointer bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
    >
      Back To Calendar
    </button>
  </div>
</div>

          {/* Appointment List */}
              <div className="space-y-2">
              <List
                itemLayout="horizontal"
                dataSource={filteredData}
                renderItem={(item: any) => {
                  const bgColor = item?.is_confirm
                    ? getProfessionalColor(item.estimate?.status)
                    : '#FDE68A';
            
                  return (
                    <List.Item
                      onClick={() => {
                        handleEventClick(item);
                      }}
                      style={{
                        backgroundColor: bgColor,
                        borderRadius: '6px',
                        padding: '10px 12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom:'3px'
                      }}
                      className="hover:opacity-95"
                    >
                      <List.Item.Meta
                        title={
                          <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
                            <span>{item.customer?item.customer.name : item?.customerName}</span>
            
                            {item?.estimate?.status && (
                              <span className="text-[11px] px-2 py-[1px] rounded bg-black/20 text-white">
                                {item.estimate.status}
                              </span>
                            )}
                          </div>
                        }
                        description={
                          <div className="text-xs text-gray-800 space-y-1 mt-1">
                            <div>
                              ⏰ {formatLocal12h(item.startHour)} – {formatLocal12h(item.endHour)}
            
                            </div>
                            <div>
                              👤 {item.serviceAdvisor?.name || 'Unassigned'}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            </div>

        </div>
      ) : (
        <Calender
          view={currentView}
          date={currentDate}
          onView={handleViewChange}
          onNavigate={(date) => setCurrentDate(date)}
          events={events}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day"]}
          step={30}
          timeslots={2}
          selectable
          // dayPropGetter={dayPropGetter}
          dayLayoutAlgorithm="no-overlap"
          onSelectEvent={(slotInfo: any) =>
            handleEventClick(slotInfo.eventInfo)
          }
          onSelectSlot={handleDateClick}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      )}

      {isLoading ? (
        <Loading />
      ) : (
        isModalOpen&& (
          <div className="sticky z-50 inset-0 flex items-center  h-screen justify-center bg-black bg-opacity-30">
            <div
              style={{ backgroundColor: 'white' }}
              className="p-5 rounded-md shadow-lg border sm:w-[60vw] sm:max-h-[80vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 flex items-center cursor-pointer gap-1 text-xl bg-transparent border-none z-50"
              >
                <CloseCircleOutlined className="text-2xl text-black" />
              </button>
             {
              typeof selectedEvent?.is_confirm === "boolean" &&<Switch className="mb-2"
                checked={selectedEvent?.is_confirm}
                onChange={(checked) =>
                  updateSelectedEvent("is_confirm", checked)
                }
                checkedChildren="Confirmed"
                unCheckedChildren="Pending"
              />
             }

             <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-3 flex items-end gap-2 ">

                 <div className={selectedEvent?.estimateCode ? 'flex-1' : 'w-full'} >
                <label className="block w-full text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
              
                <Select
                    showSearch
                    labelInValue
                    placeholder="Select Customer"
                    style={{ width: "100%", height: "32px" }}
                    value={selectedCustomer?.name|| selectedEvent?.customer?.name||selectedEvent?.customerName||undefined}
                    filterOption={false}
                    onSearch={(value) => dispatch(setSearchTerm(value))}
                    onChange={(value:any, option: any) => {
                      const name = option?.['data-name'];
                      setSelectedCustomer({
                        name,
                        id:value?.value
                      });
                    }}
                    notFoundContent={
                    searchTerm ? (
                      <div
                        className="flex items-center justify-between px-2 py-1 -m-1 -mx-2.5  cursor-pointer bg-[#f5f5f5] rounded-md"
                        onClick={() => handleCreateCustomer(searchTerm)}
                      >
                        <h2 className="text-[15px] text-gray-800 font-medium">
                          {searchTerm}
                        </h2>
                  
                        <span className="text-xs  text-gray-800 underline font-semibold ">
                          Create Contact
                        </span>
                      </div>
                    ) : null
                }
                
                  >
                {contact.map((c: { id: string; name: string; email?: string; contactNum?: string; address?:string;label?:string}) => (
                    <Option key={c.id} value={c.id} data-name={c.name}>
                    <div className="flex justify-between items-center gap-3 w-full">
                      {/* Name */}
                      <span className="font-medium w-1/3 text-gray-800 ">{c.name}</span>
                
                      {/* Email & Contact Number */}
                      
                      <div className="text-xs text-gray-500 truncate  flex gap-1">
                        {c.email && <><MailOutlined className="text-gray-400" /> {c.email} </>}
                        {c.contactNum && <><PhoneOutlined className="text-gray-400" /> {c.contactNum}</>}
                        {c.address && <><EnvironmentOutlined className="text-gray-400" /> {c.address}</>}
                      </div>
                    </div>
                  </Option>
                ))}
                  </Select>
              </div>
              <div className="">
                {/* Go To Work Order Button */}
              {selectedEvent?.estimateCode && (
                <Link
                  prefetch={true}
                  href={`/admin/work-order/single-work-order/${selectedEvent?.estimateCode}`}
                 className="h-8 px-4 rounded-md bg-gray-800 text-white text-sm font-medium flex items-center whitespace-nowrap t-1 hover:bg-gray-900"
                >
                  Go to Workorder
                </Link>
              )}
              </div>
            </div>
          
            {/* Side-by-side fields (3 columns layout) */}
              <div className="col-span-3">
              <label className="block font-semibold">Scheduled Date</label>
              <DatePicker
                className="text-black w-full"
                value={
                  selectedEvent?.scheduledDate
                    ? dayjs(selectedEvent?.scheduledDate)
                    : null
                }
                format="YYYY-MM-DD"
                onChange={(date) =>
                  updateSelectedEvent("scheduledDate", date)
                }
              />
            </div>
          
            <div>
              <label className="block font-semibold">Start Time</label>
              <TimePicker
                className="text-black w-full"
                value={selectedEvent?.start ? dayjs(selectedEvent?.start) : null}
                format="h:mm A"
                use12Hours
                needConfirm={false}
                minuteStep={15}
                renderExtraFooter={() => null}
                popupClassName="no-footer-picker"
                onChange={(time) =>
                  updateSelectedEvent("start", time?.toISOString())
                }
              />
            </div>
          
            <div>
              <label className="block font-semibold">Duration</label>
              <TimePicker
                className="text-black w-full"
                value={
                  selectedEvent?.duration
                    ? dayjs(selectedEvent.duration, "HH:mm")
                    : null
                }
                minuteStep={15}
                renderExtraFooter={() => null}
                popupClassName="no-footer-picker"
                format="HH:mm"
                needConfirm={false}
                onChange={(time, timeString) =>
                  updateSelectedEvent("duration", timeString)
                }
              />
            </div>
            <div>
              <label className="block font-semibold">End Time</label>
              <Input className="text-black" value={end} disabled />
            </div>
            <div>
              <label className="block font-semibold">Suggested Hour</label>
              <Input
                className="text-black"
                value={selectedEvent?.suggestedHour || ""}
                onChange={(e) => updateSelectedEvent("suggestedHour", e.target.value)}
              />
            </div>
          
            <div>
              <label className="block font-semibold">Odometer</label>
              <Input
                className="text-black"
                value={selectedEvent?.odometer || ""}
                onChange={(e) => updateSelectedEvent("odometer", e.target.value)}
              />
            </div>
          
            <div>
              <label className="block font-semibold">Tag</label>
              <Select
                className="w-full"
                value={selectedEvent?.tag}
                onChange={(value) => updateSelectedEvent("tag", value)}
              >
                {tagOptions.map((tag) => (
                  <Option key={tag.value} value={tag.value}>
                    {tag.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="col-span-3">
              <label className="block font-semibold">Note</label>
              <Input.TextArea
                className="text-black"
                value={selectedEvent?.note || ""}
                onChange={(e) => updateSelectedEvent("note", e.target.value)}
              />
            </div>
          
            {/* Work Order Section */}
            {selectedEvent?.estimateCode ? (
              <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Work Order Title */}
                {selectedEvent?.estimate?.title && (
                  <div>
                    <label className="block font-semibold">Work Order</label>
                    <p className="text-black border rounded-md p-2">
                      {selectedEvent.estimate.title}
                    </p>
                  </div>
                )}
          
                {/* Assigned Service Advisor */}
                {selectedEvent?.assignedServiceAdvisor.name && (
                  <div>
                    <label className="block font-semibold">Assigned Service Advisor</label>
                    <p className="text-black border rounded-md p-2">
                      {selectedEvent.assignedServiceAdvisor.name}
                    </p>
                  </div>
                )}
          
                {/* Unassigned Service Advisor */}
                {selectedEvent?.unassignedServiceAdvisor?.name && (
                  <div>
                    <label className="block font-semibold">Unassigned Service Advisor</label>
                    <p className="text-black border rounded-md p-2">
                      {selectedEvent.unassignedServiceAdvisor.name}
                    </p>
                  </div>
                )}
          
                {/* Assigned Technicians */}
                {selectedEvent?.assignedTechnician?.length > 0 && (
                  <div className="col-span-3">
                    <label className="block font-semibold">Assigned Technicians</label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-2">
                      {selectedEvent.assignedTechnician.map((tech) => (
                        <span
                          key={tech.technicianId}
                          className="px-3 py-1 rounded-md bg-gray-100 text-black"
                        >
                          {tech?.technician?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
          
                {/* Unassigned Technicians */}
                {selectedEvent?.unassignedTechnician?.length > 0 && (
                  <div className="col-span-3">
                    <label className="block font-semibold">Unassigned Technicians</label>
                    <div className="flex flex-wrap gap-2 border rounded-md p-2">
                      {selectedEvent.unassignedTechnician.map((tech) => (
                        <span
                          key={tech.technicianId}
                          className="px-3 py-1 rounded-md bg-gray-100 text-black"
                        >
                          {tech?.technician?.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => setWorkOrder(!workOrder)}
                className="col-span-3 bg-neutral-800 px-2 py-2 rounded-md cursor-pointer text-center font-semibold text-white"
              >
                Assign Work Order
              </div>
            )}
          </form>
          
              {workOrder && (
                <div className="mt-5 p-4 border rounded-lg bg-gray-50">
                  <label className="block mb-2 font-medium text-gray-700">
                    Search for WorkOrder
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      size="large"
                      placeholder="Search..."
                      className="w-full"
                      
                      value={searchTermWorkOrder || ""}
                      onChange={handleInputChange}
                    />
                    {!!searchTermWorkOrder && (
                      <Button onClick={resetFilters} size="large" type="primary">
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
              <Button
                type="primary"
                block
                className="mt-4 bg-neutral-800 cursor-pointer font-semibold"
                onClick={handleSubmit}
              >
                Update
              </Button>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default BasicCalender;
