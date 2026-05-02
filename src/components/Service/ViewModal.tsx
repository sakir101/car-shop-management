// import React, { useState, useEffect } from "react";
// import { Button, Modal, Spin, message } from "antd";
// import ViewUpdateServiceForm from "@/components/Service/ViewUpdateServiceForm";
// import { useGetServiceByCodeQuery } from "@/redux/api/serviceApi";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { addLabours, addParts, removeAllLabours, removeAllParts,  } from "@/redux/slice/serviceInspectionItemSlice";
// import { addInspectionItem, addServiceItem, addServiceItems } from "@/redux/slice/searchItemShowSlice";

// interface ServiceViewModalProps {
//   serviceCode: string;
//   isModalOpen: boolean;
//   handleOk: () => void;
//   handleCancel: () => void;
// }

// /**
//  * ServiceViewModal component displays a modal with service details and allows editing.
//  *
//  * @param {ServiceViewModalProps} props - The props for the component.
//  * @param {Service} props.service - The service object containing details to display.
//  * @param {boolean} props.isModalOpen - Flag to control the visibility of the modal.
//  * @param {() => void} props.handleOk - Function to handle the OK button click.
//  * @param {() => void} props.handleCancel - Function to handle the Cancel button click.
//  *
//  * @returns {JSX.Element} The rendered ServiceViewModal component.
//  *
//  * @component
//  * @example
//  * const service = { code: '123', title: 'Service Title' };
//  * const isModalOpen = true;
//  * const handleOk = () => console.log('OK clicked');
//  * const handleCancel = () => console.log('Cancel clicked');
//  *
//  * <ServiceViewModal
//  *   service={service}
//  *   isModalOpen={isModalOpen}
//  *   handleOk={handleOk}
//  *   handleCancel={handleCancel}
//  * />
//  */

// const ServiceViewModal: React.FC<ServiceViewModalProps> = ({
//   serviceCode,
//   isModalOpen,
//   handleOk,
//   handleCancel,
// }) => {

//   const dispatch = useAppDispatch()
//   const [editable, setEditable] = useState(false);
//   const { data:serviceData,refetch:serviceRefatch, isLoading, error } = useGetServiceByCodeQuery(serviceCode);

//   useEffect(() => {
//     if (serviceData) {
//       // Clear previous data immediately
//       dispatch(removeAllLabours());
//       dispatch(removeAllParts());
  
//       // Use setTimeout to delay dispatching new data
//       const timeoutId = setTimeout(() => {
//         const labourArray = serviceData?.serviceLabours?.map((item: any) => ({
//           serviceCode: item.serviceCode,
//           labourId: item.labourId,
//           name: item.labour.name,
//           ratePerHour: item.labour.ratePerHour,
//           requiredHours: item.hours,
//         }));
  
//         const partsArray = serviceData?.serviceParts?.map((item: any) => ({
//           serviceCode: serviceData.code,
//           partId: item.part?.partsId || item?.partId,
//           name: item.part?.name,
//           unitPrice: item.part.unitPrice,
//           provider: item.part.provider,
//           installationHours: item.part.installationHours,
//           quantity: item?.quantity,
//         }));
  
//         // Dispatch new data after the timeout
//         dispatch(addLabours(labourArray));
//         dispatch(addParts(partsArray));
//       }, 500); // Delay in milliseconds (500ms = 0.5 seconds)
  
//       // Cleanup function to clear timeout if serviceData changes before timeout completes
//       return () => clearTimeout(timeoutId);
//     }
//   }, [serviceData, dispatch]);
  
//     const {
//       part,
//       labour,
//       totalHours,
//       totalAmount,
//       partsTotalAmount,
//       labourTotalAmount,
//       labourTotalHours,
//     } = useAppSelector((state) => state.serviceInspectionItem);


//   useEffect(() => {
//     if (error) {
//       message.error("Failed to fetch service details");
//     }
//   }, [error]);

//   const toggleEditable = () => setEditable((prev) => !prev);
//   return (
//     <Modal
//       title={serviceData?.title || "Service Details"}
//       open={isModalOpen}
//       onOk={handleOk}
//       onCancel={handleCancel}
//       width={800}
//       footer={[
//         <Button key="back" danger onClick={handleCancel}>
//           Close
//         </Button>,
//         <Button key="submit" type="primary" onClick={toggleEditable}>
//           {editable ? "View" : "Edit"}
//         </Button>,
//       ]}
//     >
//       {isLoading ? (
//         <div className="flex justify-center items-center p-4">
//           <Spin />
//         </div>
//       ) : serviceData ? (
//         <ViewUpdateServiceForm
//           service={serviceData}
//           setEditable={setEditable}
//           editable={editable}
//           onUpdateService={() =>
//             message.success("Service updated successfully")
//           }
//           serviceRefatch={serviceRefatch}
//         />
//       ) : (
//         <div>No service details found</div>
//       )}
//     </Modal>
//   );
// };

// export default ServiceViewModal;
