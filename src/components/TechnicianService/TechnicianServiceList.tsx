import React from "react";
import { IFormattedServiceEstimate } from "@/types";
import { Button } from "antd";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.service";

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Complete":
      return "bg-blue-500 text-white";
    case "Incomplete":
      return "bg-red-500 text-white";
    case "Waiting_For_Parts":
      return "bg-yellow-300 text-black";
    case "Part_Received":
      return "bg-orange-400 text-black";
    default:
      return "bg-gray-200 text-black";
  }
};

const TechnicianServiceList = ({
  data,
}: {
  data: IFormattedServiceEstimate[];
}) => {
  const { role } = getUserInfo() as any;
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((service, index) => (
        <div
          key={index}
          className={`rounded-xl p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${getStatusStyles(
            service.serviceStatus
          )}`}
        >
          <div className="space-y-2">
            <p className="text-base font-semibold">
              <span className="font-bold">Service Title:</span>{" "}
              {service.serviceName}
            </p>
            <p className="text-sm">
              <span className="font-bold">Service Code:</span>{" "}
              {service.serviceCode}
            </p>
            <p className="text-sm">
              <span className="font-bold">Number Plate:</span>{" "}
              {service.numberPlate}
            </p>
            <p className="text-sm font-semibold">
              <span className="font-bold">Status:</span>{" "}
              {service.serviceStatus.replace(/_/g, " ")}
            </p>
            {service?.technicianInspectionItemGeneralId ? (
              <Link
                href={`/${role}/estimateService/singleService/${service.technicianInspectionItemGeneralId}/${service.serviceCode}`}
                className="font-normal"
              >
                <Button> View</Button>
              </Link>
            ) : service?.technicianInspectionItemTireId ? (
              <Link
                href={`/${role}/estimateService/singleService/${service.technicianInspectionItemTireId}/${service.serviceCode}`}
                className="font-normal"
              >
                <Button>View</Button>
              </Link>
            ) : (
              <Link
                href={`/${role}/estimateService/singleService/${service.estimateCode}/${service.serviceCode}`}
                className="font-normal"
              >
                <Button>View</Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechnicianServiceList;
