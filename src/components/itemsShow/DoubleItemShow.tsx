"use client";

import {
  useDeleteInspectionProblemMutation,
  useUpdateInspectionProblemMutation,
} from "@/redux/api/inspectionGeneralApi";
import { message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  PlusCircleFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  useDeleteTireStatusMutation,
  useDeleteTreadDepthMutation,
  useUpdateTireStatusMutation,
  useUpdateTreadDepthMutation,
} from "@/redux/api/inspectionTireApi";

interface Item {
  id: string;
  name: string;
  color: string;
  inspectionId: string;
}

const DoubleItemShow = ({
  items,
}: {
  items:
    | { generalProblems: Item[] }
    | { tireStatus: Item[] }
    | { treadDepth: Item[] };
}) => {
  const { confirm } = Modal;
  const [editableItemId, setEditableItemId] = useState(null);
  const [editedItemDouble, setEditedItemDouble] = useState({
    name: "",
    color: "",
  });

  const [updateInspectionProblem] = useUpdateInspectionProblemMutation();
  const [deleteInspectionProblem] = useDeleteInspectionProblemMutation();
  const [updateTireStatus] = useUpdateTireStatusMutation();
  const [deleteTireStatus] = useDeleteTireStatusMutation();
  const [updateTreadDepth] = useUpdateTreadDepthMutation();
  const [deleteTreadDepth] = useDeleteTreadDepthMutation();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [itemType, setItemType] = useState<string>("");

  useEffect(() => {
    if ("generalProblems" in items) {
      setItemType("generalProblems");
      setAllItems(items.generalProblems || []);
    } else if ("tireStatus" in items) {
      setItemType("tireStatus");
      setAllItems(items.tireStatus || []);
    } else if ("treadDepth" in items) {
      setItemType("treadDepth");
      setAllItems(items.treadDepth || []);
    }
  }, [items]);

  const handleEditItem = async (id: string) => {
    try {
      // Ensure data is formatted correctly
      const data = JSON.stringify(editedItemDouble);

      // Call the mutation and handle response
      if (itemType === "generalProblems") {
        await updateInspectionProblem({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection general updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection general");
            console.error("Error details:", err);
          });
      }
      if (itemType === "tireStatus") {
        await updateTireStatus({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection tire status updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection tire status");
            console.error("Error details:", err);
          });
      }
      if (itemType === "treadDepth") {
        await updateTreadDepth({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection tread depth updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection tread depth");
            console.error("Error details:", err);
          });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      message.error("An unexpected error occurred");
    }
  };

  // Function to show the confirmation modal
  const showDeleteConfirm = (id: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          // Perform the delete operation
          if (itemType === "generalProblems") {
            await deleteInspectionProblem(id).unwrap();
            message.success("Item deleted successfully!");
          }
          if (itemType === "tireStatus") {
            await deleteTireStatus(id).unwrap();
            message.success("Item deleted successfully!");
          }
          if (itemType === "treadDepth") {
            await deleteTreadDepth(id).unwrap();
            message.success("Item deleted successfully!");
          }
        } catch (error) {
          message.error("Failed to delete the item. Please try again.");
        }
      },
    });
  };

  // Example of handling delete button click
  const handleDeleteClick = (id: string) => {
    showDeleteConfirm(id);
  };

  const handleDoubleClick = (item: any) => {
    setEditableItemId(item.id); // Enable editing mode for the clicked item
    setEditedItemDouble({ name: item.name, color: item.color }); // Initialize editing values
  };

  const handleSaveEdit = (id: any) => {
    // Save logic here

    // Exit edit mode after saving
    handleEditItem(id);
    setEditableItemId(null);
    setEditedItemDouble({ name: "", color: "" });
  };

  return (
    <div>
      <ul className="flex flex-wrap">
        {allItems.map((item) => (
          <li
            key={item.id}
            className="flex bg-background-item rounded px-2 py-1 mb-1 me-3 items-center"
          >
            {editableItemId === item.id ? (
              <div className="flex space-x-4">
                {/* Name input */}
                <input
                  type="text"
                  value={editedItemDouble.name}
                  onChange={(e) =>
                    setEditedItemDouble((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(item.id);
                  }}
                  className="mx-4 border rounded px-2"
                  autoFocus
                />

                {/* Color input */}
                <select
                  name="colorType"
                  value={editedItemDouble.color}
                  className="p-2 bg-background-item rounded"
                  onChange={(e) =>
                    setEditedItemDouble((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(item.id);
                  }}
                >
                  <option value="" disabled>
                    Select color
                  </option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="black">Black</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center">
                <p
                  style={{ color: item.color }}
                  className="me-4 cursor-pointer"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  {item.name}
                </p>

                <CloseCircleFilled
                  onClick={() => handleDeleteClick(item.id)}
                  className="text-rose-600 text-[23px] cursor-pointer"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoubleItemShow;
