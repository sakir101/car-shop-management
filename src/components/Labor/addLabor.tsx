import { message, Modal } from 'antd';
import React, { useState } from 'react';
import {
  PlusOutlined
} from "@ant-design/icons";
interface AddLaborProps {
  isModalVisible:boolean;
  onSubmit: (data: any) => Promise<void>;
  handleModalCancel:()=>void;
}
const AddLabor = ({
  isModalVisible,
  onSubmit,
  handleModalCancel,
}:AddLaborProps) => {
      const [labourData, setLabourData] = useState({
        name: "Labor",
        ratePerHour: "100",
        requiredHours: "",
      });

    const onLabourChange = (field: string, value: string | null | string[]) => {
    setLabourData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? value : "",
    }));
  };
  const handleSubmit = async () => {
    const { name, ratePerHour, requiredHours } = labourData;
    if (!name || !ratePerHour || !requiredHours) {
          message.error("All fields are required!");
          return;
    }
    const formattedData = {
          ...labourData,
          requiredHours: labourData.requiredHours
            ? parseFloat(labourData.requiredHours)*60
            : 0,
          ratePerHour: parseFloat(labourData.ratePerHour),
        };

    await onSubmit(formattedData);

    setLabourData({
        name: "Labor",
        ratePerHour: "100",
        requiredHours: "",
      });
  }
    return  <Modal
    title={
      <div className="flex items-center">
        <span>Add New Labor</span>
      </div>
    }
    open={isModalVisible}
    onOk={() => handleSubmit()}
    onCancel={handleModalCancel}
    width={500}
    okText="Add Labour"
    cancelText="Cancel"
    okButtonProps={{
      className: "bg-neutral-800 hover:bg-neutral-700 border-neutral-800",
      icon: <PlusOutlined />
    }}
  >
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">
            Description <span className="text-red-500">*</span>
          </label>
        <input
          name="name"
          type="text"
          placeholder="Labour Description"
          value={labourData.name}
          onChange={(e) => onLabourChange("name", e.target.value)}
            className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
        />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium">
            Labour Rate <span className="text-red-500">*</span>
          </label>
          <input
            name="ratePerHour"
            type="text"
            placeholder="Labour Rate"
            value={labourData.ratePerHour}
            onChange={(e) => onLabourChange("ratePerHour", e.target.value)}
              className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="mb-1 text-sm font-medium">
            Hours <span className="text-red-500">*</span>
          </label>
          {/* <TimePicker
            name="requiredHours"
            onChange={(time, timeString) =>
              onLabourChange("requiredHours", timeString)
            }
            defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
              className="p-[5px] border border-gray-400 outline-none rounded w-full focus:border-blue-500"
            format="HH:mm"
            size="small"
            value={
              labourData.requiredHours
                ? dayjs(labourData.requiredHours, "HH:mm")
                : null
            }
          /> */}
            <input
              name="requiredHours"
              type="text"
              placeholder="Hours"
              value={labourData.requiredHours}
              onChange={(e) => onLabourChange("requiredHours", e.target.value)}
                className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
            />
        </div>
      </div>
    </div>
  </Modal>
    
};

export default AddLabor;