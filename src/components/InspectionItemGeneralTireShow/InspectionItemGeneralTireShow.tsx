import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useGetRelatedInspectionItemsFromInspectionQuery } from "@/redux/api/estimateApi";
import ViewTable from "../ViewItems/ViewTable";

interface Props {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  inspectionCode: string;
}

const InspectionItemGeneralTireShow = ({
  isModalOpen,
  inspectionCode,
  setIsModalOpen,
}: Props) => {
  const [code, setCode] = useState("");
  const [generalItems, setGeneralItems] = useState<any[]>([]);
  const [tireItems, setTireItems] = useState<any[]>([]);

  useEffect(() => {
    if (inspectionCode) {
      setCode(inspectionCode);
    }
  }, []);

  const { data, isLoading } = useGetRelatedInspectionItemsFromInspectionQuery(
    { inspectionCode: code },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (data) {
      setGeneralItems(data.generalItems || []);
      setTireItems(data.tireItems || []);
    }
  }, [data]);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const allItems = [...generalItems, ...tireItems];

  return (
    <div>
      {isLoading ? (
        <div></div>
      ) : (
        data && (
          <Modal
            title="All Inspection Items"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true}
            okButtonProps={{
            className: "bg-neutral-800 hover:bg-neutral-700 border-neutral-800",
            }}
          >
            <div>
              {allItems?.length > 0 ? (
                <ViewTable
                  ItemArray={allItems}
                  page="inspection-item-general-tire"
                />
              ) : (
                <div className="flex justify-center items-center h-full">
                  No items found for this inspection
                </div>
              )}
            </div>
          </Modal>
        )
      )}
    </div>
  );
};

export default InspectionItemGeneralTireShow;
