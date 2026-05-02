import { getBaseUrl } from "@/helpers/config/envConfig";
import {
  useGetConcernByEstimateQuery,
  useGetTechnicianSingleTireItemQuery,
} from "@/redux/api/technicianInspectionApi";
import { Button, Card, Tag } from "antd";
import Title from "antd/es/typography/Title";
import React, { useEffect, useState } from "react";

const CommonPart = ({ id }: { id: string }) => {
  const { data, isLoading, refetch } = useGetTechnicianSingleTireItemQuery(id);
  const [concerns, setConcerns] = useState<any[]>([]);
  const [acknowledgedConcerns, setAcknowledgedConcerns] = useState<string[]>(
    []
  );
  const { data: concerndata } = useGetConcernByEstimateQuery(
    data?.estimateCode
  );
  useEffect(() => {
    setConcerns(concerndata);
  }, [concerndata]);
  const car =
    data?.type === "Tire"
      ? data?.estimate?.vehicle[0]?.vehicle
      : data?.Estimate?.vehicle[0]?.vehicle;
  const handleAcknowledge = (concernCode: string) => {
    if (!acknowledgedConcerns.includes(concernCode)) {
      setAcknowledgedConcerns((prev) => [...prev, concernCode]);
    }
  };

  //   const fetchConcerns = async () => {
  //     try {
  //       const response = await fetch(
  //         `${getBaseUrl()}/task-dashboard/get-concerns-by-estimate/${
  //           data?.estimateCode
  //         }`
  //       );
  //       const successData = await response.json();
  //       if (successData.success) {
  //         setConcerns(successData.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching concerns:", error);
  //     }
  //   };
  //   if (data?.estimateCode) fetchConcerns();
  // }, [data?.estimateCode]);
  return (
    <div>
      {car && (
        <div style={{ marginBottom: 30 }}>
          <Title level={4}>Car Details</Title>
          <div
            style={{ backgroundColor: "#f9f9f9" }}
            className="flex flex-wrap gap-4 p-4"
          >
            <p>
              <strong>Make:</strong> {car.make}
            </p>
            <p>
              <strong>Model:</strong> {car.model}
            </p>
            <p>
              <strong>Year:</strong> {car.year}
            </p>
            <p>
              <strong>VIN:</strong> {car.vin}
            </p>
            <p>
              <strong>Plate:</strong> {car.numberPlate}
            </p>
            <p>
              <strong>Mileage:</strong> {car.mileage}
            </p>
            <p>
              <strong>Condition:</strong> {car.condition}
            </p>
          </div>
        </div>
      )}
      {concerns?.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <Title level={4}>Related Concerns</Title>
          {concerns?.map(({ concern }) => {
            const isAcknowledged = acknowledgedConcerns.includes(concern.code);
            return (
              <Card
                key={concern.code}
                style={{ marginBottom: "16px", backgroundColor: "#f9f9f9" }}
              >
                <Tag color="volcano">{concern.type}</Tag>
                <Title level={5}>{concern.title}</Title>
                <p>{concern.description}</p>
                {!isAcknowledged ? (
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleAcknowledge(concern.code)}
                  >
                    Acknowledge
                  </Button>
                ) : (
                  <Tag color="green">Acknowledged</Tag>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommonPart;
