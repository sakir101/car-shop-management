"use client";
import Loading from "@/app/loading";
import GeneralEditComponent from "@/components/TechnicalInspectionComponent/GeneralEditComponent";
import Tires from "@/components/TechnicalInspectionComponent/TireEditComponent";
import { useGetTechnicianSingleTireItemQuery } from "@/redux/api/technicianInspectionApi";
import { Card } from "antd";
import Title from "antd/es/typography/Title";
import React, { useState } from "react";
const colorThemes: Record<string, string> = {
  red: "#ff9999",
  blue: "#d6e4ff",
  green: "#d9f7be",
  orange: "#ffe7ba",
  default: "#ffffff",
};
const InspectionModification = ({ params }: { params: { id: string } }) => {
  const { data, isLoading, refetch } = useGetTechnicianSingleTireItemQuery(
    params.id
  );
  const [selectedColor, setSelectedColor] = useState<string>("default");
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card
      className="my-10 w-[70%] mx-auto"
      style={{
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: colorThemes[selectedColor] || colorThemes.default,
      }}
    >
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
        {data?.name}
      </Title>

      {/* {data?.type === "Tire" && <Tires id={data?.id} />} */}
      {data?.type === "General" && <GeneralEditComponent id={data?.id} />}
    </Card>
  );
};

export default InspectionModification;
