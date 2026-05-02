
import {
  PlusOutlined
} from "@ant-design/icons";
import { message, Modal } from 'antd';
import React, { useState } from 'react';
interface IService {
  code: string;
  title?: string;
  description?: string;
  type?: string;
  stage: string;
}
interface AddPartProps {
  isModalVisible:boolean;
  onSubmit: (data: any) => Promise<void>;
  handleModalCancel:()=>void;
}
const AddPart = ({
  isModalVisible,
  onSubmit,
  handleModalCancel,
}:AddPartProps
) => {
const [partData, setPartData] = useState({
  name: "",
  unitPrice: "",
  provider: "",
  installationHours: null as string | null,
  quantity: "",
  margin: "50",
  total: ""
});
        
const handleSubmit = async () => {
    const { name, unitPrice, quantity,total,margin } = partData;
        
            if (!name) {
              message.error("Name is required!");
              return;
            }
            
            if (!unitPrice) {
              message.error("Unit Price is required!");
              return;
            }
            
            if (!quantity) {
              message.error("Quantity is required!");
              return;
            }
            if (!total) {
              message.error("Total is required!");
              return;
            }
            if (!margin) {
              message.error("Margin is required!");
              return;
            }

    const formattedData = {
      ...partData,
      unitPrice: parseFloat(unitPrice),
      quantity: parseInt(quantity, 10),
      margin: parseFloat(margin),
      total: parseFloat(total),
      installationHours: partData.installationHours
        ? parseInt(partData.installationHours.split(":")[0], 10) * 60 +
          parseInt(partData.installationHours.split(":")[1], 10)
        : 0,
    };

    await onSubmit(formattedData);

    setPartData({
      name: "",
      unitPrice: "",
      provider: "",
      installationHours: null,
      quantity: "",
      margin: "50",
      total: "",
    });
  };
        const onPartChange = (key: any, value: any) => {
        let newData = { ...partData, [key]: value };
      
        const price = parseFloat(newData.unitPrice) || 0;
        const qty = parseFloat(newData.quantity) || 0;
        const base = price * qty;
      
        // -----------------------------
        // When Unit Price or Quantity changes
        // -----------------------------
        if (key === "unitPrice" || key === "quantity") {
          const margin = parseFloat(newData.margin) || 0;
      
          // 1. Recalculate total based on new base and current margin
          const updatedTotal = base * (1 + margin / 100);
          newData.total = updatedTotal.toString();
      
          // 2. Recalculate margin again using NEW base & NEW total
          if (base > 0) {
            const autoMargin = ((updatedTotal - base) / base) * 100;
            newData.margin = autoMargin.toString();
          } else {
            newData.margin = "50";
          }
        }
      
        // -----------------------------
        // When TOTAL changes → update margin
        // -----------------------------
        if (key === "total") {
          const total = parseFloat(value) || 0;
          if (base > 0) {
            newData.margin = (((total - base) / base) * 100).toString();
          } else {
            newData.margin = "50";
          }
        }
      
        // -----------------------------
        // When MARGIN changes → update total
        // -----------------------------
        if (key === "margin") {
          const margin = parseFloat(value) || 0;
          newData.total = (base * (1 + margin / 100)).toString();
        }
      
        setPartData(newData);
       };
    return (
        
             <Modal
                      title={
                     <div className="flex items-center ">
                       <span>Add New Part</span>
                     </div>
                     }
                     open={isModalVisible}
                     onOk={() => handleSubmit()}
                     onCancel={handleModalCancel}
                     width={600}
                     okText="Add Part"
                     cancelText="Cancel"
                     okButtonProps={{
                       className: "bg-neutral-800 hover:bg-neutral-700 border-neutral-800",
                       icon: <PlusOutlined />
                     }}
                        >
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col w-full">
                               <label className="mb-1 text-sm font-medium">
                               Product Name <span className="text-red-500">*</span>
                              </label>
                                <input
                                  name="name"
                                  type="text"
                                  placeholder="Product Name"
                                  value={partData.name}
                                  onChange={(e) => onPartChange("name", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium">
                               Supplier 
                             </label>
                                <input
                                  name="provider"
                                  type="text"
                                  placeholder="Supplier"
                                  value={partData.provider}
                                  onChange={(e) => onPartChange("provider", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                  
                              
                            </div>
                  
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium">
                               Unite Price <span className="text-red-500">*</span>
                             </label>
                                <input
                                  name="unitPrice"
                                  type="text"
                                  placeholder="Unit Price"
                                  value={partData.unitPrice}
                                  onChange={(e) => onPartChange("unitPrice", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium">
                               Quantity <span className="text-red-500">*</span>
                             </label>

                                <input
                                  name="quantity"
                                  type="text"
                                  placeholder="Quantity"
                                  value={partData.quantity}
                                  onChange={(e) => onPartChange("quantity", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                            </div>
                  
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium">
                               Total <span className="text-red-500">*</span>
                             </label>
                                <input
                                  name="total"
                                  type="text"
                                  placeholder="Total"
                                  value={partData.total}
                                  onChange={(e) => onPartChange("total", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                              <div className="flex flex-col w-full">
                                <label className="mb-1 text-sm font-medium">
                               Margin(%) <span className="text-red-500">*</span>
                             </label>
                                <input
                                  name="margin"
                                  type="text"
                                  placeholder="Margin"
                                  value={partData.margin}
                                  onChange={(e) => onPartChange("margin", e.target.value)}
                                  className="p-2 border border-gray-400 outline-none rounded w-full focus:border-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </Modal>
    );
};

export default AddPart;