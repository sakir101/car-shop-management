
"use client";

import React, { useState } from "react";
import { Table, Typography, Select, DatePicker, Space } from "antd";
import { useGetSellAnalysisReportQuery } from "@/redux/api/estimateApi";
import Loading from "@/app/loading";
import moment from "moment";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const SellAnalysis = () => {
  const [dateRange, setDateRange] = useState("today");
  const [customDates, setCustomDates] = useState<[moment.Moment, moment.Moment] | null>(null);

  // Build query params
  let queryParams: any = { dateRange };
  if (dateRange === "custom") {
    if (customDates) {
      queryParams = {
        dateRange: "custom",
        startDate: customDates[0].format("YYYY-MM-DD"),
        endDate: customDates[1].format("YYYY-MM-DD"),
      };
    } else {
      queryParams = null; // skip query if custom dates not selected
    }
  }

  const { data, isLoading } = useGetSellAnalysisReportQuery(queryParams!, {
    skip: !queryParams,
  });

  // Columns template with fixed width
  const columns = [
    { title: "Metric", dataIndex: "metric", key: "metric", width: "33%" },
    { title: "Current", dataIndex: "current", key: "current", width: "33%", render: (val: number) => val.toFixed(2) },
    { title: "Last Year", dataIndex: "previous", key: "previous", width: "33%", render: (val: number) => val.toFixed(2) },
  ];

  if (isLoading) return <Loading />;

  // Helper to generate table data
  const getTableData = (section: any, sectionKey: string) => {
    if (sectionKey === "Overall") {
      return [
        {
          key: "total",
          metric: "Total",
          current: section[sectionKey].overallTotal ?? 0,
          previous: data.previous[sectionKey].overallTotal ?? 0,
        },
        {
          key: "cost",
          metric: "Cost",
          current: section[sectionKey].overallCost ?? 0,
          previous: data.previous[sectionKey].overallCost ?? 0,
        },
        {
          key: "revenue",
          metric: "Revenue",
          current: section[sectionKey].overallRevenue ?? 0,
          previous: data.previous[sectionKey].overallRevenue ?? 0,
        },
      ];
    }

    // For tire, part, labour
    return [
      {
        key: "total",
        metric: "Total",
        current: section[sectionKey][sectionKey + "Total"] ?? 0,
        previous: data.previous[sectionKey][sectionKey + "Total"] ?? 0,
      },
      {
        key: "cost",
        metric: "Cost",
        current: section[sectionKey][sectionKey + "TotalCost"] ?? 0,
        previous: data.previous[sectionKey][sectionKey + "TotalCost"] ?? 0,
      },
      {
        key: "revenue",
        metric: "Revenue",
        current: section[sectionKey][sectionKey + "TotalRevenue"] ?? 0,
        previous: data.previous[sectionKey][sectionKey + "TotalRevenue"] ?? 0,
      },
    ];
  };

  return (
    <div style={{ padding: 20, width: "100%" }}>
      <Title level={3} style={{ marginBottom: 10 }}>Sells Analysis Report</Title>

      {/* Date range filter */}
      <Space size="middle" style={{ marginBottom: 10 }}>
        <Select
          value={dateRange}
          onChange={(value) => {
            setDateRange(value);
            setCustomDates(null);
          }}
          size="middle"
          style={{ width: 160 }}
          options={[
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 Days" },
            { value: "30days", label: "Last 30 Days" },
            { value: "custom", label: "Custom Range" },
          ]}
        />

        {dateRange === "custom" && (
          <RangePicker
            size="middle"
            value={customDates as any}
            onChange={(dates) => setCustomDates(dates as any)}
            allowClear={false}
            style={{ minWidth: 250 }}
          />
        )}
      </Space>

      {/* Tables */}
      {data ? (
        <>
          <Title level={5} style={{ marginTop: 5 }}>Tire</Title>
          <Table
            columns={columns}
            dataSource={getTableData(data.current, "tire")}
            pagination={false}
            bordered
            size="small"
          />

          <Title level={5} style={{ marginTop: 16 }}>Part</Title>
          <Table
            columns={columns}
            dataSource={getTableData(data.current, "part")}
            pagination={false}
            bordered
            size="small"
          />

          <Title level={5} style={{ marginTop: 16 }}>Labour</Title>
          <Table
            columns={columns}
            dataSource={getTableData(data.current, "labour")}
            pagination={false}
            bordered
            size="small"
          />

          <Title level={5} style={{ marginTop: 16 }}>Inspection</Title>
          <Table
            columns={columns}
            dataSource={getTableData(data.current, "inspectionHour")}
            pagination={false}
            bordered
            size="small"
          />

          <Title level={5} style={{ marginTop: 16 }}>Overall</Title>
          <Table
            columns={columns}
            dataSource={getTableData(data.current, "Overall")}
            pagination={false}
            bordered
            size="small"
          />
        </>
      ) : dateRange === "custom" && !customDates ? (
        <div>Please select start and end dates.</div>
      ) : (
        <div>No data available.</div>
      )}
    </div>
  );
};

export default SellAnalysis;
