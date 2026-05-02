"use client";
import {
  useGetReportByCustomerIdQuery,
  useUpdateReportMutation,
  useUpdateServiceTypeGeneralItemMutation, 
  useUpdateServiceTypeTireItemMutation 
} from '@/redux/api/serviceAdvisorApi';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FiPhoneIncoming, FiMail } from "react-icons/fi";
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { Checkbox, Modal, Button, Divider, message } from 'antd';
import Loading from '@/app/loading';
import TireItem from '@/components/ServiceAdvisorItems/TireItem';
import { calculateUnitPriceWithMargin } from '@/utils/amount';

const Page = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [code, setCode] = useState<any>("");
  const [collapseStates, setCollapseStates] = useState<{ [key: string]: boolean }>({});
  const [checkedStates, setCheckedStates] = useState<{ [key: string]: boolean }>({});
  const [updateServiceTypeGeneralItem] = useUpdateServiceTypeGeneralItemMutation();
  const [updateServiceTypeTireItem] = useUpdateServiceTypeTireItemMutation();
  const [updateReport] = useUpdateReportMutation();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("checkedItem-clent");
      if (saved) {
        setCheckedStates(JSON.parse(saved));
      }
    }
  }, []);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setCode(extractCode);
    }
  }, [pathname, searchParams]);

  const {data: estimateData, refetch, isLoading} = useGetReportByCustomerIdQuery(code, {
    refetchOnMountOrArgChange: true,
  });
  
  const singleEstimate: any = estimateData?.estimate;
  const customers = singleEstimate?.customers || [];
  const vehicle = singleEstimate?.vehicle || [];
  const technicianInspectionItemTire = estimateData?.technicianInspectionItemTire || [];
  const technicianInspectionItemGeneral = estimateData?.technicianInspectionItemGeneral || [];
  
  const goodItemGeneral = technicianInspectionItemGeneral.filter(
    (item: { color: string; }) => item.color === "GREEN"
  ).length;

  const goodItemTire = technicianInspectionItemTire.filter((item: { Tire: any[]; }) =>
    item.Tire.every((tire) => tire.color === "GREEN")
  ).length;

  const goodItemCount = goodItemGeneral + goodItemTire;
  
  const technicianInspectionItemGeneralNonGreen = technicianInspectionItemGeneral.filter(
    (item: { color: string; }) => item.color !== "GREEN"
  );
  
  const technicianInspectionItemTireNonGreen = technicianInspectionItemTire.filter((item: { Tire: any[]; }) =>
    item.Tire.some((tire) => tire.color !== "GREEN")
  );
  
  const technicianInspectionItem = [
    ...technicianInspectionItemGeneralNonGreen,
    ...technicianInspectionItemTireNonGreen,
  ];

  const totalPartsAmount = technicianInspectionItem.reduce(
    (sum, item) => sum + (item.partsTotalAmount || 0),
    0
  );
  
  const totalLabourAmount = technicianInspectionItem.reduce(
    (sum, item) => sum + (item.labourTotalAmount || 0),
    0
  );
  
  const totalAmount = totalPartsAmount + totalLabourAmount;
  const [acceptedServices, setAcceptedServices] = useState<string[]>([]);
  
  const handleStaseChange = (code: string) => {
    setAcceptedServices((prev) => [...prev, code]);
  };

  const handleUpdateServiceStage = async (service: any, type: string) => {
    const confirmed = await new Promise((resolve) => {
      Modal.confirm({
        title: "Confirm Deferred",
        content: "If you Deferred This Service You Can't able to Accept!",
        okText: "Yes, Deferred",
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
      if(type === "General"){
        await updateServiceTypeGeneralItem({
          technicianInspectionItemGeneralId: service?.itemId,
          serviceCode: service?.serviceCode,
          data: { stage:"Deferred" },
        }).unwrap();
        await refetch();
        message.success("Service Deferred successfully!");
      }
      
      if(type === "Tire"){
        await updateServiceTypeTireItem({
          technicianInspectionItemTireId: service?.itemId,
          serviceCode: service?.serviceCode,
          data: { stage:"Deferred" },
        }).unwrap();
        await refetch();
        message.success("Service Deferred successfully!");
      }
    } catch(err:any) {
      if(err.data.message){
        message.error(err.data.message)
      }else{
        message.error("Failed to change the service type. Please try again.");
      }
      
    }
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const amount = { totalAmount, totalLabourAmount, totalPartsAmount };
  
  useEffect(() => {
    if(code){
      const updateData = async () => {
        try {
          await updateReport({ customId:code, data: amount });
        } catch (err) {
        }
      };
      updateData();
    }
  }, [totalLabourAmount, totalPartsAmount, totalAmount]);

  if(isLoading) {
    return <Loading />;
  }

  return (
    <div className="px-3 mx-auto md:w-[85%] py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Service Report</h1>
          <p className="text-gray-600 text-sm">Comprehensive service details and recommendations</p>
        </div>
        <Button 
          icon={<FiPhoneIncoming className="mr-1" />} 
          className="flex items-center bg-green-600 text-white hover:bg-green-700 py-2 border-none text-sm"
        >
          Contact Advisor
        </Button>
      </div>

      {/* Customer and Vehicle Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gray-700 text-white px-4 py-2">
          <h2 className="text-base font-semibold">Customer & Vehicle Information</h2>
        </div>
        <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Customer Details</h3>
            <div className="space-y-1 text-xs">
              <div>
                <p className="text-gray-500">Full Name</p>
                <p className="font-medium">{customers[0]?.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact Number</p>
                <p className="font-medium">{customers[0]?.user?.contactNum || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Email Address</p>
                <p className="font-medium">{customers[0]?.user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Address</p>
                <p className="font-medium">{customers[0]?.user?.address || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 pb-1 border-b">Vehicle Details</h3>
            {vehicle.map((item: any, index: number) => (
              <div key={index} className="space-y-1 text-xs">
                <div>
                  <p className="text-gray-500">License Plate</p>
                  <p className="font-medium">{item?.vehicle?.numberPlate || 'N/A'}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500">Make</p>
                    <p className="font-medium">{item?.vehicle?.make || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Model</p>
                    <p className="font-medium">{item?.vehicle?.model || 'N/A'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-500">Year</p>
                    <p className="font-medium">{item?.vehicle?.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium">{item?.vehicle?.color || 'N/A'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gray-700 text-white px-4 py-2">
          <h2 className="text-base font-semibold">Service Summary</h2>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <div className="bg-blue-50 p-2 rounded border border-blue-100">
              <p className="text-xs text-blue-600 font-medium">Report Number</p>
              <p className="text-sm font-bold text-gray-800">{estimateData?.customId || 'N/A'}</p>
            </div>
            <div className="bg-green-50 p-2 rounded border border-green-100">
              <p className="text-xs text-green-600 font-medium">Service Date</p>
              <p className="text-sm font-bold text-gray-800">{formatDate(estimateData?.provider?.createdAt)}</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border border-purple-100">
              <p className="text-xs text-purple-600 font-medium">Service Advisor</p>
              <p className="text-sm font-bold text-gray-800">{estimateData?.provider?.name || 'N/A'}</p>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="bg-gray-50 p-3 rounded">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Service Cost Breakdown</h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Parts Total</span>
                <span className="font-medium">${parseFloat(totalPartsAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Labor Total</span>
                <span className="font-medium">${parseFloat(totalLabourAmount).toFixed(2)}</span>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-800">Total Amount</span>
                <span className="text-blue-600">${parseFloat(totalAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Recommendations */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-gray-700 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-base font-semibold">Items Recommendations</h2>
          <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
            {technicianInspectionItem.length} Recommended Items
          </span>
        </div>
        <div className="p-3">
          {technicianInspectionItem.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm">No service recommendations found for this vehicle.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {technicianInspectionItem.map((item, index) => {
                const generalResult = item?.itemGeneralServices?.map((serviceItem: any) => {
                  const matchingParts = item?.itemGeneralServiceParts.filter(
                    (part: any) => part.serviceCode === serviceItem.serviceCode
                  );
                  
                  return {
                    serviceCode: serviceItem.serviceCode,
                    service: serviceItem,
                    parts: matchingParts
                  };
                });

                const tireResult = item?.itemTireService?.map((serviceItem: any) => {
                  const matchingParts = item.ItemTireServiceParts.filter(
                    (part: any) => part.serviceCode === serviceItem.serviceCode
                  );

                  return {
                    serviceCode: serviceItem.serviceCode,
                    service: serviceItem,
                    parts: matchingParts
                  };
                });

                const itemCollapsed = collapseStates[item.id] || false;
                const itemChecked = checkedStates[item.id] || false;
                localStorage.setItem("checkedItem-clent", JSON.stringify(checkedStates));

                return (
                  <div key={item.id} className='border border-red-200 rounded-lg overflow-hidden'>
                    <div className={`flex justify-between items-center p-2 cursor-pointer ${itemCollapsed ? 'bg-red-50' : 'bg-white'}`}>
                      <div className="flex items-center">
                        <Checkbox
                          checked={itemChecked}
                          onChange={(e) => {
                            setCheckedStates(prev => ({
                              ...prev,
                              [item.id]: e.target.checked
                            }));
                          }}
                          className="mr-2 [&_input]:scale-110"
                        />
                        <h3 className="text-sm font-medium text-gray-800">{item.name}</h3>
                      </div>
                      <button
                        onClick={() => {
                          setCollapseStates(prev => ({
                            ...prev,
                            [item.id]: !itemCollapsed,
                          }));
                        }}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                      >
                        {itemCollapsed ? <CaretUpOutlined /> : <CaretDownOutlined />}
                      </button>
                    </div>

                    {itemCollapsed && (
                      <div className="p-2 border-t bg-white">
                        <div className="mb-3">
                          <div className="flex flex-col gap-2">
                            {item.type === "General" && (
                              <div className="flex items-start gap-2 p-2 border rounded bg-white text-xs">
                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500 flex-shrink-0">
                                  Image
                                </div>
                                <div className="space-y-1">
                                  <div>
                                    <strong>Problem: </strong>
                                    {item.problem
                                      .filter((p: { status: boolean }) => p.status)
                                      .map((p: { name: string }) => p.name)
                                      .join(', ')}
                                  </div>
                                  <div>
                                    <strong>Solution: </strong>
                                    {item.solution
                                      .filter((p: { status: boolean }) => p.status)
                                      .map((p: { name: string }) => p.name)
                                      .join(', ')}
                                  </div>
                                  <div>
                                    <strong>Map: </strong>
                                    {item.map
                                      .filter((p: { status: boolean }) => p.status)
                                      .map((p: { name: string }) => p.name)
                                      .join(', ')}
                                  </div>
                                  {item.customNote && (
                                    <div>
                                      <strong>Note: </strong>
                                      {item.customNote}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {item?.type === 'Tire' && <TireItem ItemTire={item} option={'reprot'} />}
                          </div>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-2">
                          {item?.type === "General" && generalResult?.map((service: any, index: number) => (
                            service?.service?.stage === "Accept" && (
                              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-2 py-1 flex justify-between items-center gap-1">
                                  <h4 className="font-medium text-xs">{service?.service?.serviceGeneralTitle}</h4>
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => handleStaseChange(service?.serviceCode)}
                                      disabled={true}
                                      type="primary"
                                      className={`${acceptedServices.includes(service?.serviceCode) ? 'bg-green-600' : 'bg-gray-400'} text-xs`}
                                      size="small"
                                    >
                                      {acceptedServices.includes(service?.serviceCode) ? "Accepted" : "Accept"}
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateServiceStage(service?.service, item.type)}
                                      danger
                                      size="small"
                                      className="text-xs"
                                      disabled={service?.service?.stage === "Deferred" || estimateData?.estimate?.status ==='Report_Authorized'}
                                    >
                                      Deferred
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Part Name</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Unit Price</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Qty</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {service?.parts?.map((p: any) => (
                                          p.stage === "Accept" && (
                                            <tr key={p.id} className="border-t border-gray-100">
                                              <td className="px-1 py-0.5">{p?.part?.name}</td>
                                              <td className="px-1 py-0.5">${calculateUnitPriceWithMargin(p.part.unitPrice,p.part.margin)}</td>
                                              <td className="px-1 py-0.5">{p?.totalUnit}</td>
                                              <td className="px-1 py-0.5">${p?.part?.total?.toFixed(2)}</td>
                                            </tr>
                                          )
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                          
                          {item?.type === "Tire" && tireResult?.map((service: any, index: number) => (
                            service?.service?.stage === "Accept" && (
                              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-2 py-1 flex justify-between items-center gap-1">
                                  <h4 className="font-medium text-xs">{service?.service?.serviceTireTitle}</h4>
                                  <div className="flex gap-1">
                                    <Button
                                      onClick={() => handleStaseChange(service?.serviceCode)}
                                      disabled={true}
                                      type="primary"
                                      className={`${acceptedServices.includes(service?.serviceCode) ? 'bg-green-600' : 'bg-gray-400'} text-xs`}
                                      size="small"
                                    >
                                      {acceptedServices.includes(service?.serviceCode) ? "Accepted" : "Accept"}
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateServiceStage(service?.service, item.type)}
                                      danger
                                      size="small"
                                      className="text-xs"
                                      disabled={service?.service?.stage === "Deferred" || estimateData.estimate.status ==='Report_Authorized'}
                                    >
                                      Deferred
                                    </Button>
                                  </div>
                                </div>
                                <div className="p-2">
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full text-xs">
                                      <thead className="bg-gray-50">
                                        <tr>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Part Name</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Unit Price</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Qty</th>
                                          <th className="px-1 py-0.5 text-left text-gray-500">Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {service?.parts?.map((p: any) => (
                                          p.stage === "Accept" && (
                                            <tr key={p.id} className="border-t border-gray-100">
                                              <td className="px-1 py-0.5">{p?.part?.name}</td>
                                              <td className="px-1 py-0.5">${calculateUnitPriceWithMargin(p.part.unitPrice,p.part.margin)}</td>
                                              <td className="px-1 py-0.5">{p?.totalUnit}</td>
                                              <td className="px-1 py-0.5">${p?.part?.total?.toFixed(2)}</td>
                                            </tr>
                                          )
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>

                        {/* Service Summary */}
                        <div className="mt-3 bg-gray-50 p-2 rounded text-xs">
                          <h4 className="font-medium text-gray-700 mb-1">Service Summary</h4>
                          <div className="space-y-0.5">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Parts Total</span>
                              <span className="font-medium">${item?.partsTotalAmount?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Labor Total</span>
                              <span className="font-medium">${parseFloat(item?.labourTotalAmount?.toString() || "0").toFixed(2)}</span>
                            </div>
                            <Divider className="my-1" />
                            <div className="flex justify-between font-bold">
                              <span className="text-gray-800">Total Service Cost</span>
                              <span className="text-blue-600">${parseFloat(item?.totalAmount?.toString() || "0").toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Good Condition Items */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
        <div className="bg-green-600 text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-base font-semibold">Items in Good Condition</h2>
          <span className="bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">
            {goodItemCount} Items
          </span>
        </div>
        <div className="p-3">
          <div className="bg-green-50 border border-green-100 rounded p-2 text-center text-xs">
            <p className="text-green-700 font-medium">
              {goodItemCount} vehicle components were inspected and found to be in good condition.
            </p>
          </div>
        </div>
      </div>

      {/* Footer with Contact Information */}
      <div className="bg-gray-800 text-white text-center py-3 px-3 rounded shadow-sm">
        <h2 className="text-sm font-semibold mb-2">Need Further Assistance?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs">
          <div className="flex items-center">
            <FiPhoneIncoming className="mr-1" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <FiMail className="mr-1" />
            <span>support@zhoopzhoop.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;