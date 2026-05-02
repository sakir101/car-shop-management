"use client";

import { technicianServiceStatusOptions } from "@/constant/global";
import {
  useAddTechnicianCommentMutation,
  useGetSingleServiceTechnicianQuery,
  useUpdateTechnicianServiceStatusMutation,
} from "@/redux/api/technicianApi";
import { Button, message, Select } from "antd";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Input } from "antd";
import { getUserInfo } from "@/services/auth.service";
import Loading from "@/app/loading";

const SingleService = () => {
  const params = useParams();
  const [id, setId] = useState<string>("");
  const [serviceCode, setServiceCode] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [newComment, setNewComment] = useState("");
  const { TextArea } = Input;
  const { userId } = getUserInfo() as any;

  useEffect(() => {
    if (params) {
      const idParam = params.id;
      const serviceCodeParam = params.serviceCode;

      setId(Array.isArray(idParam) ? idParam[0] : idParam || "");
      setServiceCode(
        Array.isArray(serviceCodeParam)
          ? serviceCodeParam[0]
          : serviceCodeParam || ""
      );
    }
  }, [params]);

  //Technician comment and status update
  const [addTechnicianComment] = useAddTechnicianCommentMutation();
  const [updateTechnicianServiceStatus] =
    useUpdateTechnicianServiceStatusMutation();

  const { data, refetch, isLoading } = useGetSingleServiceTechnicianQuery(
    {
      id,
      serviceCode,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    setStatus(data?.serviceStatus);
  }, [data]);

  //update status function
  const handleUpdateStatus = async (value: string) => {
    setStatus(value);
    let name = "";
    if (data?.type === "Estimate") {
      name = "Estimate";
    }
    if (data?.type === "Tire") {
      name = "Tire";
    }
    if (data?.type === "General") {
      name = "General";
    }
    try {
      const payload = {
        data: {
          name,
          id,
          serviceCode: data?.serviceCode,
          status: value,
        },
      };
      await updateTechnicianServiceStatus(payload).unwrap();

      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  //Post comment function
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    let name = "";
    if (data?.type === "Estimate") {
      name = "Estimate";
    }
    if (data?.type === "Tire") {
      name = "ItemTire";
    }
    if (data?.type === "General") {
      name = "ItemGeneral";
    }

    try {
      const payload = {
        data: {
          name,
          id,
          serviceCode: data?.serviceCode,
          comment: newComment,
          userId,
        },
      };

      await addTechnicianComment(payload).unwrap();
      message.success("Comment added successfully");

      setNewComment("");
      refetch();
    } catch (error) {
      message.error("Failed to add comment");
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-[90%] md:w-[80%] mx-auto py-5">
      <h3 className="text-red-500 text-center my-4">
        You have been assigned {data?.technicianPercentage} (percentage) of this
        service
      </h3>
      {/* Service info */}
      <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
        <div className="text-center">
          <h4>Service Info</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 w-32">Title:</span>
          <span>{data?.serviceTitle}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 w-32">Description:</span>
          <span>{data?.serviceDescription}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 w-32">Status:</span>
          <Select
            size="small"
            value={status}
            style={{ minWidth: 200 }}
            options={technicianServiceStatusOptions}
            onChange={(value) => {
              setStatus(value);
              handleUpdateStatus(value);
            }}
          />
        </div>
      </div>

      {/* Block 2: Customer & Vehicle Info */}
      {data?.customerName ? (
        <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
          <div className="text-center">
            <h4>Customer & Vehicle Info</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Name:</span>
            <span>{data?.customerName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Contact:</span>
            <span>{data?.contactNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Address:</span>
            <span>{data?.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Vehicle Make:</span>
            <span>{data?.make}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Model:</span>
            <span>{data?.vehicleModel}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Color:</span>
            <span>{data?.color}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">VIN:</span>
            <span>{data?.vin}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Number Plate:</span>
            <span>{data?.numberPlate}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
          <h4 className="text-center">No customer available</h4>
        </div>
      )}

      {/* Block 3: Estimate Info */}
      <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
        <div className="text-center">
          <h4>Estimate Info</h4>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700 w-32">Title:</span>
          <span>{data?.estimateTitle}</span>
        </div>
      </div>

      {/* Block 4: General / Tire Info */}
      {data?.type === "General" && (
        <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
          <div className="text-center">
            <h4>General</h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Title:</span>
            <span>{data?.itemName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Color:</span>
            <span>{data?.generalInfo?.color}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Custom Note:</span>
            <span>{data?.generalInfo?.customNote}</span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-700 w-32">Map:</span>
            <div className="space-y-1">
              {data?.generalInfo?.map?.map((item: any, index: number) => (
                <div key={index} className="ml-1">
                  • {item.name}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-700 w-32">Problem:</span>
            <div className="space-y-1">
              {data?.generalInfo?.problem?.map((item: any, index: number) => (
                <div key={index} className="ml-1">
                  • {item.name} - {item.color}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-gray-700 w-32">Solution:</span>
            <div className="space-y-1">
              {data?.generalInfo?.solution?.map((item: any, index: number) => (
                <div key={index} className="ml-1">
                  • {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {data?.type === "Tire" && (
        <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
          <div className="text-center">
            <h4>Tire Info</h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700 w-32">Title:</span>
            <span>{data?.itemName}</span>
          </div>
          <div></div>
          {data?.tireInfo?.length > 0 &&
            data?.tireInfo?.map((tire: any, index: number) => {
              let bgColor = "bg-orange-500";
              let textColor = "text-black";

              if (tire?.color === "GREEN") {
                bgColor = "bg-green-500";
                textColor = "text-white";
              } else if (tire?.color === "RED") {
                bgColor = "bg-red-500";
                textColor = "text-white";
              }

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow ${bgColor} ${textColor} my-4 space-y-3`}
                >
                  <h4 className="font-bold text-lg">{tire?.tireName}</h4>

                  {/* Tire Position, Axle Number, Tire Number in one row */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <p>
                      <strong>Tire Position:</strong> {tire?.tirePosition}
                    </p>
                    <p>
                      <strong>Axle Number:</strong> {tire?.axleNumber}
                    </p>
                    <p>
                      <strong>Tire Number:</strong> {tire?.tireNumber}
                    </p>
                    <p>
                      <strong>Is Inner:</strong> {tire?.isInner ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p>
                      <strong>DOT:</strong> {tire?.dot}
                    </p>
                    <p>
                      <strong>PSI Before:</strong> {tire?.psiBefore}
                    </p>
                    <p className="col-span-2">
                      <strong>Custom Note: </strong>
                      <div className="bg-white text-black rounded px-3 py-1 mt-1 inline-block">
                        {tire?.customNote}
                      </div>
                    </p>
                  </div>

                  {/* Tread Depths */}
                  {tire?.treadDepths?.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Tread Depths:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.treadDepths.map((depth: any, i: number) => (
                          <li key={i}>
                            {depth.name} - {depth.color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tire Status */}
                  {tire?.tireStatus?.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Tire Status:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.tireStatus.map((status: any, i: number) => (
                          <li key={i}>
                            {status.name} - {status.color}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Solutions */}
                  {tire?.solution?.length > 0 && (
                    <div>
                      <p className="font-semibold mt-2">Solutions:</p>
                      <ul className="list-disc list-inside ml-2">
                        {tire.solution.map((s: any, i: number) => (
                          <li key={i}>{s.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Block 5: Parts Info */}
      <div className="p-4 bg-gray-100 rounded-lg shadow space-y-2 my-4">
        <div className="text-center">
          <h4>Parts Info</h4>
        </div>

        {data?.parts && data.parts.length > 0 ? (
          data.parts.map((part: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-bold text-gray-700 w-32">Part Name:</span>
              <span className="mr-4">{part.partName}</span>
              <span className="font-bold text-gray-700 w-16">Unit:</span>
              <span>{part.unit}</span>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm">
            No parts information available.
          </div>
        )}
      </div>

      {/* Block 5: Comments */}
      <div className="p-4 bg-gray-100 rounded-lg shadow space-y-4 my-4">
        <div className="text-center">
          <h4>Comments</h4>
        </div>

        {data?.comments?.length > 0 ? (
          <div className="space-y-2">
            {data.comments.map((c: any, index: any) => (
              <div
                key={index}
                className="p-2 border rounded-md bg-white shadow-sm flex justify-between"
              >
                <span className="font-semibold text-blue-700">{c.name}:</span>
                <span className="text-gray-800">{c.comment}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}

        <div className="mt-4 flex gap-2 items-center">
          <TextArea
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-md"
          />
          <Button
            onClick={handlePostComment}
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700 transition"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleService;
