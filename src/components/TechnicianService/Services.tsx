// components/ServiceItem.tsx
import React, { useState } from "react";
import { IServiceData } from "@/types";
import { Select, Input, Button, message } from "antd";
import {
  useAddTechnicianCommentMutation,
  useUpdateTechnicianServiceStatusMutation,
} from "@/redux/api/technicianApi";
import { getUserInfo } from "@/services/auth.service";

const { Option } = Select;
const { TextArea } = Input;

const ServiceItem = ({
  service,
  name,
  id,
}: {
  service: any;
  name: string;
  id: string;
}) => {
  const [status, setStatus] = useState("Incomplete");
  const [newComment, setNewComment] = useState("");

  const [addTechnicianComment] = useAddTechnicianCommentMutation();
  const [updateTechnicianServiceStatus] =
    useUpdateTechnicianServiceStatusMutation();
  const { userId } = getUserInfo() as any;

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const payload = {
        data: {
          name,
          id,
          serviceCode: service.serviceCode,
          comment: newComment,
          userId,
        },
      };
      await addTechnicianComment(payload).unwrap();

      setNewComment("");
      message.success("Comment added successfully");
    } catch (error) {
      message.error("Failed to add comment");
    }
  };

  const handleUpdateStatus = async (value: string) => {
    try {
      const payload = {
        data: {
          name,
          id,
          serviceCode: service.serviceCode,
          status: value,
        },
      };
      await updateTechnicianServiceStatus(payload).unwrap();

      message.success("Status updated successfully");
    } catch (error) {
      message.error("Failed to update status");
    }
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow relative">
      <div className="absolute top-2 right-2">
        <Select
          size="small"
          value={status}
          style={{ width: 150 }}
          onChange={(value) => {
            setStatus(value);
            handleUpdateStatus(value);
          }}
        >
          <Option value="Complete">Complete</Option>
          <Option value="Incomplete">Incomplete</Option>
          <Option value="Waiting_For_Parts">Waiting For Parts</Option>
          <Option value="Part_Received">Part Received</Option>
        </Select>
      </div>

      <h3 className="text-lg font-bold">{service.serviceName}</h3>
      <p className="text-sm text-gray-600 mb-2">{service.serviceDescription}</p>
      <div>
        <h4 className="font-semibold">Parts:</h4>
        <ul className="list-disc list-inside text-sm">
          {service?.parts.map((part: any, index: number) => (
            <li key={index}>
              {part.partName} - {part.unit} unit(s)
            </li>
          ))}
        </ul>
      </div>
      {service.comments?.length > 0 && (
        <div className="mt-2">
          <h4 className="font-semibold">Comments:</h4>
          {service?.comments.map((comment: any, index: number) => (
            <div key={index} className="text-sm mt-1">
              <span className="font-medium">{comment.name}:</span>{" "}
              {comment.comment}
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Section */}
      <div className="mt-4">
        <TextArea
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button type="primary" onClick={handleAddComment} className="mt-2">
          Add Comment
        </Button>
      </div>
    </div>
  );
};

export default ServiceItem;
