"use client";

import {
  useDeleteInspectionMapMutation,
  useDeleteInspectionSolutionGeneralMutation,
  useUpdateInspectionMapMutation,
  useUpdateInspectionSolutionGeneralMutation,
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
  useDeleteSolutionTireMutation,
  useUpdateSolutionTireMutation,
} from "@/redux/api/inspectionTireApi";

interface Item {
  id: string;
  name: string;
  inspectionId: string;
}

const SingleItemShow = ({
  items,
}: {
  items: { solutions: Item[] } | { maps: Item[] } | { tireSolutions: Item[] };
}) => {
  const { confirm } = Modal;
  const [editableItemId, setEditableItemId] = useState(null);
  const [editedItemSingle, setEditedItemSingle] = useState({
    name: "",
  });

  const [updateInspectionSolutionGeneral] =
    useUpdateInspectionSolutionGeneralMutation();
  const [deleteInspectionSolutionGeneral] =
    useDeleteInspectionSolutionGeneralMutation();

  const [updateInspectionMap] = useUpdateInspectionMapMutation();
  const [deleteInspectionMap] = useDeleteInspectionMapMutation();

  const [updateSolutionTire] = useUpdateSolutionTireMutation();
  const [deleteSolutionTire] = useDeleteSolutionTireMutation();

  const [allItems, setAllItems] = useState<Item[]>([]);
  const [itemType, setItemType] = useState<string>("");

  useEffect(() => {
    if ("solutions" in items) {
      setItemType("solution");
      setAllItems(items.solutions || []);
    } else if ("maps" in items) {
      setItemType("map");
      setAllItems(items.maps || []);
    } else if ("tireSolutions" in items) {
      setItemType("tireSolutions");
      setAllItems(items.tireSolutions || []);
    }
  }, [items]);

  const handleEditItem = async (id: string) => {
    try {
      const data = JSON.stringify(editedItemSingle);

      if (itemType === "solution") {
        await updateInspectionSolutionGeneral({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection general solution updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection general solution");
            console.error("Error details:", err);
          });
      }
      if (itemType === "map") {
        await updateInspectionMap({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection general map updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection general map");
            console.error("Error details:", err);
          });
      }
      if (itemType === "tireSolutions") {
        await updateSolutionTire({ id, data })
          .unwrap()
          .then(() => {
            message.success("Inspection tire solution updated successfully");
          })
          .catch((err) => {
            message.error("Failed to update inspection tire solution");
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
          if (itemType === "solution") {
            await deleteInspectionSolutionGeneral(id).unwrap();
            message.success("Item deleted successfully!");
          }

          if (itemType === "map") {
            await deleteInspectionMap(id).unwrap();
            message.success("Item deleted successfully!");
          }

          if (itemType === "tireSolutions") {
            await deleteSolutionTire(id).unwrap();
            message.success("Item deleted successfully!");
          }
        } catch (error) {
          message.error("Failed to delete the item. Please try again.");
        }
      },
    });
  };

  const handleDeleteClick = (id: string) => {
    showDeleteConfirm(id);
  };

  const handleDoubleClick = (item: any) => {
    setEditableItemId(item.id);
    setEditedItemSingle({ name: item.name });
  };

  const handleSaveEdit = (id: any) => {
    handleEditItem(id);
    setEditableItemId(null);
    setEditedItemSingle({ name: "" });
  };

  return (
    <div>
      <ul className="flex flex-wrap">
        {allItems.map((item) => (
          <li
            key={item.id}
            className="flex bg-[#A8B5DE4A] rounded px-2 py-1 mb-1 me-3 items-center"
          >
            {editableItemId === item.id ? (
              <div className="flex space-x-4">
                {/* Name input */}
                <input
                  type="text"
                  value={editedItemSingle.name}
                  onChange={(e) =>
                    setEditedItemSingle((prev) => ({
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
              </div>
            ) : (
              <div className="flex items-center">
                <p
                  className="me-3 cursor-pointer"
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

export default SingleItemShow;
