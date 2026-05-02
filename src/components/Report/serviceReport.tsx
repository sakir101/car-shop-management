"use client";
import {
  useCreateReportMutation,
  useGetSingleEstimatesForServiceAdvisorQuery,
  useSendReportToUserMutation,
  useUpdateReportByEstimateCodeMutation,
} from "@/redux/api/serviceAdvisorApi";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, message, Modal } from "antd";
import Loading from "@/app/loading";
import { getUserInfo } from "@/services/auth.service";
import TireItem from "@/components/ServiceAdvisorItems/TireItem";
import { calculateUnitPriceWithMargin } from "@/utils/amount";

const ServiceReport = () => {
  const pathname = usePathname();
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const searchParams = useSearchParams();
  const [code, setCode] = useState<any>("");
  const [collapseStates, setCollapseStates] = useState<{
    [key: string]: boolean;
  }>({});
  const savedCheckedStates = JSON.parse(
    localStorage.getItem("checkedItem") || "{}"
  );
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>(savedCheckedStates);
  const [updateReportByEstimateCode] = useUpdateReportByEstimateCodeMutation()
  const [sendReportToUser] = useSendReportToUserMutation()
  const [createReport] = useCreateReportMutation();
  const { userId: provideId } = getUserInfo() as any;
  
  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setCode(extractCode);
    }
  }, [pathname, searchParams]);
  
  const {
    data: estimateData,
    refetch,
    isLoading,
  } = useGetSingleEstimatesForServiceAdvisorQuery(code, {
    refetchOnMountOrArgChange: true,
  });
  
  const singleEstimate: any = estimateData?.data;
  const customers = singleEstimate?.customers || [];

  const vehicle = singleEstimate?.vehicle || [];
  const report = singleEstimate?.report || {};
  const technicianInspectionItemGeneral =
    singleEstimate?.technicianInspectionItemGeneral || [];
  const technicianInspectionItemTire =
    singleEstimate?.technicianInspectionItemTire || [];
  const technicianInspectionItemGeneralNonGreen = technicianInspectionItemGeneral.filter(
    (item: { color: string; }) => item.color !== "GREEN"
  );
  const technicianInspectionItemTireNonGreen = technicianInspectionItemTire.filter((item: { Tire: any[]; }) =>
    item.Tire.some((tire) => tire.color !== "GREEN")
  );
  const technicianInspectionItemTiresId = technicianInspectionItemTire.map(
    (item: any) => item.id
  );
  
  const technicianInspectionItemGeneralsId =
    technicianInspectionItemGeneral.map((item: any) => item.id);

  const technicianInspectionItem = [
    ...technicianInspectionItemGeneralNonGreen,
    ...technicianInspectionItemTireNonGreen,
  ];
  
  const goodItemGeneral = technicianInspectionItemGeneral.filter(
    (item: { color: string; }) => item.color === "GREEN"
  ).length;

  const goodItemTire = technicianInspectionItemTire.filter((item: { Tire: any[]; }) =>
    item.Tire.every((tire) => tire.color === "GREEN")
  ).length;

  const goodItemCount = goodItemGeneral + goodItemTire

  const totalPartsAmount = technicianInspectionItem.reduce(
    (sum, item) => sum + (item.partsTotalAmount || 0),
    0
  );
  const totalLabourAmount = technicianInspectionItem.reduce(
    (sum, item) => sum + (item.labourTotalAmount || 0),
    0
  );
  const totalAmount = totalLabourAmount + totalPartsAmount;
 const amount = useMemo(() => ({
  totalAmount,
  totalLabourAmount,
  totalPartsAmount,
}), [totalAmount, totalLabourAmount, totalPartsAmount]);

useEffect(() => {
  if (!code) return;

  updateReportByEstimateCode({ code, data: amount });
}, [code, amount, updateReportByEstimateCode]);

  const handleCreateReport = async () => {
    const reportPayload = {
      providerId: provideId,
      estimateCode: code,
      labourTotalAmount: totalLabourAmount,
      partsTotalAmount: totalPartsAmount,
      totalAmount: totalLabourAmount + totalPartsAmount,
      technicianInspectionItemTire: technicianInspectionItemTiresId,
      technicianInspectionItemGeneral: technicianInspectionItemGeneralsId,
    };
    try {
      await createReport(reportPayload)
        .unwrap()
        .then(() => {
          message.success("Report Saved Successfully!");
        });
    } catch (err) {
      message.error("Report Saved Failed!");
    }
  };

  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${baseUrl}/serviceReport/${report?.customId}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  
  if (!estimateData) {
    return <Loading></Loading>;
  }

  const handleReportSendToCustomer = async (customId: string) => {
    try {
      const email = customers[0]?.user?.email;
      const response = await sendReportToUser({ customId, email });
      if(response.data){
        message.success("Report sent successfully");
      }
    } catch (error) {
      console.error('Failed to send report to customer:', error);
    }
  };

  return (
    <div className="view-page-container mx-auto">
      {/* Header */}
      <div className="sticky top-2 z-50 bg-white border border-gray-200 rounded border-solid py-2 px-4 ">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <h1 className="text-lg font-semibold text-gray-800">Service Report</h1>
          <div
            onClick={!report?.customId ? handleCreateReport : undefined}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded text-white text-sm shadow transition duration-200
              ${
                report?.customId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 cursor-pointer"
              }
            `}
          >
            <span className="font-medium">
              {report?.customId ? "Report Saved" : "Save Report"}
            </span>
            {report?.customId && <CheckOutlined className="text-xs" />}
          </div>
        </div>
      </div>

      {/* Customer & Vehicle Information */}
      <div className="bg-white border border-gray-300 rounded p-3 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1 border-b">Vehicle Information</h3>
            {vehicle.map((item: any, index: number) => (
              <div key={item?.id} className="mb-2 last:mb-0">
                <h4 className="text-sm font-medium text-gray-600">Vehicle {index + 1}</h4>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <div className="text-gray-500">Number Plate:</div>
                  <div>{item?.vehicle?.numberPlate}</div>
                  <div className="text-gray-500">Model:</div>
                  <div>{item?.vehicle?.model}</div>
                  <div className="text-gray-500">Color:</div>
                  <div>{item?.vehicle?.color}</div>
                  <div className="text-gray-500">Make:</div>
                  <div>{item?.vehicle?.make}</div>
                </div>
              </div>
            ))}
            
            <h3 className="text-base font-semibold text-gray-700 mt-3 mb-2 pb-1 border-b">Owner Information</h3>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <div className="text-gray-500">Customer Name:</div>
              <div>{customers[0]?.user?.name}</div>
              <div className="text-gray-500">Contact Number:</div>
              <div>{customers[0]?.user?.contactNum}</div>
              <div className="text-gray-500">Email:</div>
              <div className="break-all whitespace-normal">{customers[0]?.user?.email}</div>
              <div className="text-gray-500">Address:</div>
              <div>{customers[0]?.user?.address}</div>
            </div>
          </div>

          {report?.customId && (
            <div>
              <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1 border-b">Report Details</h3>
              <div className="flex items-center gap-2 mb-2">
                <div className="font-medium">Report No: {report?.customId}</div>
                <Button size="small" onClick={() => handleReportSendToCustomer(report?.customId)}>Send</Button>
                <Button
                  size="small"
                  type="text"
                  onClick={copyLink}
                  icon={copied ? <CheckOutlined /> : <CopyOutlined />}
                  className={`${copied ? "text-green-500" : "text-blue-500"}`}
                >
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex">
                  <div className="text-gray-500 w-20">Prepared by:</div>
                  <div>{report?.provider?.name}</div>
                </div>
                <div className="flex">
                  <div className="text-gray-500 w-20">Number:</div>
                  <div>{report?.provider?.contactNum}</div>
                </div>
                <div className="flex">
                  <div className="text-gray-500 w-20">Email:</div>
                  <div>{report?.provider?.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="bg-gray-100 rounded-md p-3 mb-4 text-sm">
        <div className="grid grid-cols-2 gap-1">
          <div>Parts Amount:</div>
          <div className="text-right">{`$${parseFloat(totalPartsAmount).toFixed(2)}`}</div>
          <div>Labor Amount:</div>
          <div className="text-right">{`$${parseFloat(totalLabourAmount).toFixed(2)}`}</div>
          <div className="border-t pt-1 font-medium">Total Amount:</div>
          <div className="border-t pt-1 font-medium text-right">{`$${parseFloat(totalAmount).toFixed(2)}`}</div>
        </div>
      </div>

      {/* Service Items */}
      <div className="space-y-3">
        {technicianInspectionItem.map((item) => {
          const generalResult = item?.itemGeneralServices?.map(
            (serviceItem: { serviceCode: any }) => {
              const matchingParts = item?.itemGeneralServiceParts.filter(
                (part: { serviceCode: any }) =>
                  part.serviceCode === serviceItem.serviceCode
              );

              return {
                serviceCode: serviceItem.serviceCode,
                service: serviceItem,
                parts: matchingParts,
              };
            }
          );

          const tireResult = item?.itemTireService?.map(
            (serviceItem: { serviceCode: any }) => {
              const matchingParts = item.ItemTireServiceParts.filter(
                (part: { serviceCode: any }) =>
                  part.serviceCode === serviceItem.serviceCode
              );

              return {
                serviceCode: serviceItem.serviceCode,
                service: serviceItem,
                parts: matchingParts,
              };
            }
          );
          
          const itemCollapsed = collapseStates[item.id] || false;
          const itemChecked = checkedStates[item.id] || false;
          localStorage.setItem("checkedItem", JSON.stringify(checkedStates));

          const handleCheckboxChange = (e: { target: { checked: any; }; }) => {
            setCheckedStates({
              ...savedCheckedStates,
              [item.id]: e.target.checked,
            });
          };

          const toggleCollapse = () => {
            setCollapseStates({
              ...collapseStates,
              [item.id]: !itemCollapsed,
            });
          };

          return (
            <div key={item.id} className="border border-red-300 border-solid rounded-md p-2">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-medium text-red-700">{item.name}</h2>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={itemChecked}
                    onChange={handleCheckboxChange}
                    className="[&_input]:scale-110"
                  />
                  <Button 
                    type="text" 
                    size="small" 
                    icon={itemCollapsed ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    onClick={toggleCollapse}
                  />
                </div>
              </div>
              
              {itemCollapsed && (
                <div className="mt-2 pt-2 border-t space-y-3">
                  {/* Problem Section */}
                  <div className="text-sm">
                    {item.type === "General" && (
                      <div className="flex gap-3 p-2 bg-gray-50 rounded">
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-xs text-gray-500 flex-shrink-0">
                          Image
                        </div>
                        <div className="space-y-1">
                          <div><span className="font-medium">Problem:</span> {item.problem
                            .filter((p: { status: boolean }) => p.status)
                            .map((p: { name: string }) => p.name)
                            .join(', ')}
                          </div>
                          <div><span className="font-medium">Solution:</span> {item.solution
                            .filter((p: { status: boolean }) => p.status)
                            .map((p: { name: string }) => p.name)
                            .join(', ')}
                          </div>
                          <div><span className="font-medium">Map:</span> {item.map
                            .filter((p: { status: boolean }) => p.status)
                            .map((p: { name: string }) => p.name)
                            .join(', ')}
                          </div>
                          {item.customNote && (
                            <div><span className="font-medium">Note:</span> {item.customNote}</div>
                          )}
                        </div>
                      </div>
                    )}
                    {item?.type === 'Tire' && <TireItem ItemTire={item} option={'reprot'} />}
                  </div>

                  {/* Service Section */}
                  {item.type === 'General' &&
                    generalResult?.map(
                      (service: { service: { serviceGeneralTitle: string; stage: string;}; parts: any[]; }, index: React.Key | null ) =>
                        service?.service?.stage === 'Accept' && (
                          <div key={index} className="border border-gray-200 rounded-md p-2 text-sm">
                            <div className="bg-red-100 px-2 py-1 rounded font-medium mb-2">
                              Service: {service?.service?.serviceGeneralTitle}
                            </div>
                            {service.parts.length > 0 && (
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-1">Part Name</th>
                                    <th className="text-right py-1">Unit Price</th>
                                    <th className="text-right py-1">Qty</th>
                                    <th className="text-right py-1">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {service?.parts?.map(
                                    (p, idx) =>
                                      p.stage === 'Accept' && (
                                        <tr key={idx} className="border-b border-dashed last:border-b-0">
                                          <td className="py-1">{p?.part?.name}</td>
                                          <td className="text-right py-1">${calculateUnitPriceWithMargin(p.part.unitPrice,p.part.margin)}</td>
                                          <td className="text-right py-1">{p?.totalUnit}</td>
                                          <td className="text-right py-1">
                                            ${(p?.part?.total).toFixed(2)}
                                          </td>
                                        </tr>
                                      )
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )
                    )}

                  {item.type === 'Tire' &&
                    tireResult?.map(
                      (service: { service: { serviceTireTitle: string; stage: string;}; parts: any[]; }, index: React.Key | null | undefined) =>
                        service?.service?.stage === 'Accept' && (
                          <div key={index} className="border border-gray-200 rounded-md p-2 text-sm">
                            <div className="bg-red-100 px-2 py-1 rounded font-medium mb-2">
                              Service: {service?.service?.serviceTireTitle}
                            </div>
                            {service.parts.length > 0 && (
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-1">Part Name</th>
                                    <th className="text-right py-1">Unit Price</th>
                                    <th className="text-right py-1">Qty</th>
                                    <th className="text-right py-1">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {service?.parts?.map(
                                    (p, idx) =>
                                      p.stage === 'Accept' && (
                                        <tr key={idx} className="border-b border-dashed last:border-b-0">
                                          <td className="py-1">{p?.part?.name}</td>
                                          <td className="text-right py-1">${calculateUnitPriceWithMargin(p.part.unitPrice,p.part.margin)}</td>
                                          <td className="text-right py-1">{p?.totalUnit}</td>
                                          <td className="text-right py-1">
                                            ${(p?.part?.total).toFixed(2)}
                                          </td>
                                        </tr>
                                      )
                                  )}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )
                    )}

                  {/* Total Summary */}
                  <div className="bg-gray-50 rounded-md p-2 text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Total Labor</span>
                      <span>${parseFloat(item?.labourTotalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Total Parts</span>
                      <span>${parseFloat(item?.partsTotalAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Total Amount</span>
                      <span>${parseFloat(item?.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All Good Section */}
      <div className="mt-4 p-3 bg-gray-100 rounded-md">
        <div className="flex items-center font-medium mb-1">
          <span className="mr-2">☰</span> All Good Items
        </div>
        <div className="bg-green-100 text-green-800 px-3 py-1.5 rounded text-sm">
          The remaining {goodItemCount} items are in good condition.
        </div>
      </div>

      {/* Contact Footer */}
      <div className="bg-gray-800 text-white text-center py-4 px-3 rounded-md mt-4 text-sm">
        <h2 className="font-medium mb-2">Need Services?</h2>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <div className="flex items-center">
            <span className="mr-1">📞</span>
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📧</span>
            <span>support@zhoopzhoop.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceReport;