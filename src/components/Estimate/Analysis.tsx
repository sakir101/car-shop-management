"use client"
import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useGetSingleEstimateForAnalysisQuery } from '@/redux/api/serviceAdvisorApi';
import Loading from '@/app/loading';
import { Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { getUserInfo } from '@/services/auth.service';

const Analysis= () => {
  const [code, setCode] = useState<string>("");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url.match(/\/([^\/?]+)\?$/);
    const extractCode = match ? match[1] : null;
    if (extractCode !== null) {
      setCode(extractCode);
    }
  }, [pathname, searchParams]);

  const { data: analysis, isLoading } = useGetSingleEstimateForAnalysisQuery(
    { code },
    { refetchOnMountOrArgChange: true }
  );

  const { role } = getUserInfo() as any;
  const customer = analysis?.customers?.[0]?.user;
  const vehicle = customer?.vehicles?.[0];
 
  const calculateWorkOrderData = (analysisArray: any[]) => {
    if (!analysisArray || !analysisArray.length) return [];

    const workOrders: any[] = [];

    analysisArray.forEach((analysisItem) => {
      const service = analysisItem.service;
      if (!service) return;

      const labourList = service.estimateServiceLabour || [];
      const technicians = service.estimateTechnician || [];
      let totalTechnicianRate =0
      // Total technician rate
      // const totalTechnicianRate = technicians.reduce(
      //   (sum: number, t: any) => sum + Number(t.technician?.ratePerHour || 0),
      //   0
      // );
      

      // Calculate labour hours and invoiced
      let totalHours = 0;
      let labourInvoiced = 0;
      labourList.forEach((labourItem: any) => {
        const hour = (labourItem.requiredHours || 0) / 60;
        const perHour = Number(labourItem.labour?.ratePerHour || 0);
        totalHours += hour;
        labourInvoiced += hour * perHour;
      });

      for (const tec of technicians) {
        const cost =(Number(tec.technician?.ratePerHour ?? 0) * totalHours * parseFloat(tec.percentage?.replace('%', '') ?? '0')) / 100
        totalTechnicianRate += cost;
      }
      // Labour cost calculation
      const labourCost =  totalTechnicianRate;
      const labourProfit = labourInvoiced - labourCost;

      const labourRow =
        labourList.length > 0
          ? {
              name: "Labor",
              hours: Number(totalHours.toFixed(2)),
              technicianRate: totalTechnicianRate,
              cost: labourCost,
              invoiced: labourInvoiced,
              profit: labourProfit,
              margin:
                labourInvoiced > 0
                  ? Math.round((labourProfit / labourInvoiced) * 100)
                  : 0,
            }
          : null;

      // Parts calculation
      const partsItems = (service.estimateServiceParts || []).map((partItem: any) => {
        const marginValue = partItem.part?.margin || 0;
        const invoiced = partItem?.part?.total || 0;
        const cost = (partItem?.part?.unitPrice || 0) * (partItem.totalUnit || 1);
        const profit = invoiced - cost;

        return {
          name: partItem.part?.name || "Part",
          cost,
          invoiced,
          profit,
          margin: marginValue,
        };
      });

      // Merge items
      const allItems = [];
      if (labourRow) allItems.push(labourRow);
      allItems.push(...partsItems);

      // Total
      const totals = allItems.reduce(
        (acc, item) => ({
          cost: acc.cost + (item.cost || 0),
          invoiced: acc.invoiced + (item.invoiced || 0),
          profit: acc.profit + (item.profit || 0),
        }),
        { cost: 0, invoiced: 0, profit: 0 }
      );

      allItems.push({
        name: "TOTAL",
        cost: totals.cost,
        invoiced: totals.invoiced,
        profit: totals.profit,
        margin:
          totals.invoiced > 0
            ? Math.round((totals.profit / totals.invoiced) * 100)
            : 0,
      });

      workOrders.push({
        title: service.title,
        description: service.description,
        items: allItems,
        technicians: technicians.map((t: any) => t.technician),
      });
    });

    return workOrders;
  };

  const calculateWorkOrderInspection = (inspections: any[]) => {
    if (!inspections || !inspections.length) return [];
 

    const Inspections: any[] = [];

    inspections.forEach((item) => {
      const inspection = item.inspection;
      if (!inspection) return;


      const inspectionHourList = inspection.estimateInspectionHoursForInspection || [];
      const technicians = inspection.estimateInspectionInspector || [];
      let totalTechnicianRate =0
      // Calculate Inspection hour
      let totalHours = 0;
      let InspectionHourInvoiced = 0;
      inspectionHourList.forEach((Item: any) => {
        const hour = (Item.inspectionHours.inspectionHours || 0) / 60;
        const perHour = Number(Item.inspectionHours?.inspectionHourlyRate || 0);
        totalHours += hour;
        InspectionHourInvoiced += hour * perHour;
      });

      for (const tec of technicians) {
        const cost =(Number(tec.inspector?.ratePerHour ?? 0) * totalHours * parseFloat(tec.percentage?.replace('%', '') ?? '0')) / 100
        totalTechnicianRate += cost;
      }
      // Labour cost calculation
      const inspectionHourCost =  totalTechnicianRate;
      const InspectionHourProfit = InspectionHourInvoiced - inspectionHourCost;
      const InspectionHourRow =
        inspectionHourList.length > 0
          ? {
              name: "Inspection Hours",
              hours: Number(totalHours.toFixed(2)),
              technicianRate: totalTechnicianRate,
              cost: inspectionHourCost,
              invoiced: InspectionHourInvoiced,
              profit: InspectionHourProfit,
              margin:
                InspectionHourProfit > 0
                  ? Math.round((InspectionHourProfit / InspectionHourInvoiced) * 100)
                  : 0,
            }
          : null;


      // Merge items
      const allItems = [];
      if (InspectionHourRow) allItems.push(InspectionHourRow);
      // Total
      const totals = allItems.reduce(
        (acc, item) => ({
          cost: acc.cost + (item.cost || 0),
          invoiced: acc.invoiced + (item.invoiced || 0),
          profit: acc.profit + (item.profit || 0),
        }),
        { cost: 0, invoiced: 0, profit: 0 }
      );

      allItems.push({
        name: "TOTAL",
        cost: totals.cost,
        invoiced: totals.invoiced,
        profit: totals.profit,
        margin:
          totals.profit > 0
            ? Math.round((totals.profit / totals.invoiced) * 100)
            : 0,
      });
      Inspections.push({
        title: inspection.title,
        description: inspection.description,
        items: allItems,
        technicians: technicians.map((t: any) => t.inspector),
      });
    });
  

    return Inspections;
  };

  const service = calculateWorkOrderData(analysis?.services);
  const inspection = calculateWorkOrderInspection(analysis?.inspections);

  // Summary calculation with GPS metrics
  const summary = service.reduce(
    (acc, order) => {
      const labour = order.items.find((i: any) => i.name === "Labour");
      const materials = order.items.filter(
        (i: any) => i.name !== "Labour" && i.name !== "TOTAL"
      );

      if (labour) {
        acc.labour.invoiced += labour.invoiced || 0;
        acc.labour.cost += labour.cost || 0;
        acc.labour.profit += labour.profit || 0;
        acc.labour.buildHours += labour.hours || 0; // Build hours from estimate
        
        // Tech hours from technicians' actual work
        order.technicians.forEach((tech: any) => {
          acc.labour.techHours += tech.hoursWorked || labour.hours || 0;
        });
        
        // Clocked hours (typically slightly more than tech hours due to inefficiencies)
        acc.labour.clockedHours += labour.hours ? labour.hours * 1.1 : 0;
      }

      materials.forEach((m: any) => {
        acc.materials.invoiced += m.invoiced || 0;
        acc.materials.cost += m.cost || 0;
        acc.materials.profit += m.profit || 0;
      });

      return acc;
    },
    {
      labour: { 
        invoiced: 0, 
        cost: 0, 
        profit: 0, 
        buildHours: 0,
        techHours: 0,
        clockedHours: 0
      },
      materials: { invoiced: 0, cost: 0, profit: 0 },
    }
  );

  summary.labour.margin =
    summary.labour.invoiced > 0
      ? Math.round((summary.labour.profit / summary.labour.invoiced) * 100)
      : 0;

  summary.materials.margin =
    summary.materials.invoiced > 0
      ? Math.round((summary.materials.profit / summary.materials.invoiced) * 100)
      : 0;

// Update the summary calculation to include inspections
const summaryInspection = inspection.reduce(
  (acc, order) => {
    const inspectionHour = order.items.find((i: any) => i.name === "Inspection Hours");

    if (inspectionHour) {
      acc.inspection.invoiced += inspectionHour.invoiced || 0;
      acc.inspection.cost += inspectionHour.cost || 0;
      acc.inspection.profit += inspectionHour.profit || 0;
      acc.inspection.buildHours += inspectionHour.hours || 0;
      
      // Tech hours from inspectors' actual work
      order.technicians.forEach((tech: any) => {
        acc.inspection.techHours += tech.hoursWorked || inspectionHour.hours || 0;
      });
      
      // Clocked hours
      acc.inspection.clockedHours += inspectionHour.hours ? inspectionHour.hours * 1.1 : 0;
    }

    return acc;
  },
  {
    inspection: { 
      invoiced: 0, 
      cost: 0, 
      profit: 0, 
      buildHours: 0,
      techHours: 0,
      clockedHours: 0
    }
  }
);

summaryInspection.inspection.margin =
  summaryInspection.inspection.invoiced > 0
    ? Math.round((summaryInspection.inspection.profit / summaryInspection.inspection.invoiced) * 100)
    : 0;

  // GPS Calculations
  const gpsBuildHour = summary.labour.buildHours > 0 
    ? summary.labour.profit / summary.labour.buildHours 
    : 0;
  const gpsTechHour = summary.labour.techHours > 0 
    ? summary.labour.profit / summary.labour.techHours 
    : 0;
  const gpsClockedHour = summary.labour.clockedHours > 0 
    ? summary.labour.profit / summary.labour.clockedHours 
    : 0;

  // Effective Labour Rates
  const effRateBuildHours = summary.labour.buildHours > 0 
    ? summary.labour.invoiced / summary.labour.buildHours 
    : 0;
  const effRateTechHours = summary.labour.techHours > 0 
    ? summary.labour.invoiced / summary.labour.techHours 
    : 0;
  const effRateClockedHours = summary.labour.clockedHours > 0 
    ? summary.labour.invoiced / summary.labour.clockedHours 
    : 0;

  const getMarginColor = (margin: number) => {
    if (margin >= 85) return 'text-green-600';
    if (margin >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return <Loading />;
  }
 
  return (
   <div className="mx-auto bg-white px-6 py-2 flex gap-4 max-w-7xl h-screen overflow-hidden">
      <div className="w-[75%] rounded shadow-sm hide-scroll overflow-y-auto ">

        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Service Analysis</h1>

          <Link href={`/${role}/work-order/single-work-order/${analysis?.code}`}>
            <Button size="small" className='px-2' icon={<EyeOutlined />}>
              Workorder
            </Button>
          </Link>
        </div>

        {/* Work Orders */}
        <div className="p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Work Order</h2>
          {service.map((order, orderIndex) => (
            <div key={orderIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        {order.title}
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Invoiced
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Cost
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Profit
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Margin
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item: any, itemIndex: number) => {
                      const isTotal = item.name === "TOTAL";
                      return (
                        <tr key={itemIndex} className={isTotal ? 'bg-gray-50 font-semibold' : ''}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.invoiced?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.cost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.profit.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${getMarginColor(item.margin)}`}>{item.margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          {inspection.map((order, orderIndex) => (
            <div key={orderIndex} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                        {order.title}
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Invoiced
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Cost
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Profit
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                        Margin
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {order.items.map((item: any, itemIndex: number) => {
                      const isTotal = item.name === "TOTAL";
                      return (
                        <tr key={itemIndex} className={isTotal ? 'bg-gray-50 font-semibold' : ''}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.invoiced?.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.cost.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">${item.profit.toFixed(2)}</td>
                          <td className={`px-4 py-3 text-sm text-right font-semibold ${getMarginColor(item.margin)}`}>{item.margin}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Summary */}
          <div className="border border-gray-200 p-3 bg-gray-50 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-900">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-3 py-2 text-left">Category</th>
                    <th className="px-3 py-2 text-right">Invoiced</th>
                    <th className="px-3 py-2 text-right">Cost</th>
                    <th className="px-3 py-2 text-right">Profit</th>
                    <th className="px-3 py-2 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">Labor</td>
                    <td className="px-3 py-2 text-right">${summary.labour.invoiced.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">${summary.labour.cost.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">${summary.labour.profit.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${getMarginColor(summary.labour.margin)}`}>
                      {summary.labour.margin}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">Materials</td>
                    <td className="px-3 py-2 text-right">${summary.materials.invoiced.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">${summary.materials.cost.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">${summary.materials.profit.toFixed(2)}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${getMarginColor(summary.materials.margin)}`}>
                      {summary.materials.margin}%
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                      <td className="px-3 py-2 font-medium">Inspection Hours</td>
                      <td className="px-3 py-2 text-right">${summaryInspection.inspection.invoiced.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">${summaryInspection.inspection.cost.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right">${summaryInspection.inspection.profit.toFixed(2)}</td>
                      <td className={`px-3 py-2 text-right font-semibold ${getMarginColor(summaryInspection.inspection.margin)}`}>
                        {summaryInspection.inspection.margin}%
                      </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* GPS calculation */}
          <div className="border border-gray-200 p-3 bg-gray-50 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">GPS & Effective Labour Rate Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-fixed text-sm text-gray-900">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="w-1/3 px-3 py-2 text-left">Description</th>
                    <th className="w-1/6 px-3 py-2 text-right">Invoiced</th>
                    <th className="w-1/6 px-3 py-2 text-right">Cost</th>
                    <th className="w-1/6 px-3 py-2 text-right">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">GPS/Build Hour ({summary.labour.buildHours.toFixed(2)}h)</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-600">${gpsBuildHour.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">GPS/Tech Hour ({summary.labour.techHours.toFixed(2)}h)</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-600">${gpsTechHour.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">GPS/Clocked Hour ({summary.labour.clockedHours.toFixed(2)}h)</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-600">${gpsClockedHour.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">Effective Labour Rate - Build Hours</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">${effRateBuildHours.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-3 py-2 font-medium">Effective Labour Rate - Tech Hours</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">${effRateTechHours.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Effective Labour Rate - Clocked Hours</td>
                    <td className="px-3 py-2 text-right font-semibold text-green-600">${effRateClockedHours.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right">-</td>
                    <td className="px-3 py-2 text-right">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
     
      <div className="w-[25%] bg-white rounded py-2">
        {/* Header */}
        <div className="border-b pb-4 ">
          <h2 className="text-md font-semibold text-gray-900">{analysis?.title}</h2>
          <span
            className={`text-xs px-3 py-0.5 rounded mt-2 inline-block ${
              analysis?.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {analysis?.status}
          </span>
        </div>
                  {/* Analysis Info */}
          <div className="grid grid-cols-1 gap-3">
          
            {/* Customer Info */}
            <div className="p-3 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-2">Customer Info</h3>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {customer?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {customer?.email || "N/A"}
              </p>
          
              {vehicle && (
                <div className="mt-3">
                  <h4 className="font-semibold text-gray-800 mb-1">Vehicle Details</h4>
                  <p className="text-sm text-gray-700"><strong>Make:</strong> {vehicle?.make || "N/A"}</p>
                  <p className="text-sm text-gray-700"><strong>Model:</strong> {vehicle?.model || "N/A"}</p>
                  <p className="text-sm text-gray-700"><strong>Year:</strong> {vehicle?.year || "N/A"}</p>
                  <p className="text-sm text-gray-700"><strong>VIN:</strong> {vehicle?.vin || "N/A"}</p>
                  <p className="text-sm text-gray-700"><strong>Plate:</strong> {vehicle?.numberPlate || "N/A"}</p>
                  <p className="text-sm text-gray-700"><strong>Mileage:</strong> {vehicle?.mileage || "N/A"}</p>
                </div>
              )}
            </div>
          
            {/* Provider Info */}
            <div className="p-3 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-800 mb-2">Provider Info</h3>
              <p className="text-sm text-gray-700">
                <strong>Name:</strong> {analysis?.provider?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Email:</strong> {analysis?.provider?.email || "N/A"}
              </p>
          
              <div className="mt-3">
                <h4 className="font-semibold text-gray-800 mb-1">Analysis Details</h4>
                <p className="text-sm text-gray-700">
                  <strong>Type:</strong> {analysis?.type || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Created At:</strong>{" "}
                  {analysis?.createdAt
                    ? new Date(analysis.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          
          </div>
          
     </div>
     
    </div>
  );
};

export default Analysis;