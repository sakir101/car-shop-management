import React, { useEffect, useState } from "react";
import { Button, Input, message, Select, Tabs } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { formatDate } from "@/utils/formatDate";
import { useDispatch } from "react-redux";
import {
  setAllAuthorizedStatus,
  setAuthorizationDeleteStatus,
  setAuthorizationEditStatus,
  setAuthorizationId,
  setAuthorizationIds,
  setSingleAuthorization,
} from "@/redux/slice/estimateItemShowSlice";

const { Option } = Select;
const { TabPane } = Tabs;

interface AuthorizedItem {
  id: string;
  estimateCode: string;
  providerId: string;
  customerId: string;
  authorizationMedium: string;
  authorizationStatus: string;
  note: string;
  amount: string;
  signature: string;
  createdAt: string;
  customer: any;
}

interface AuthorizedHistoryProps {
  onClose: () => void;
  estimateAuthorization: AuthorizedItem[];
}

const AuthorizedHistory: React.FC<AuthorizedHistoryProps> = ({
  onClose,
  estimateAuthorization,
}) => {
  useEffect(() => {
    setData(estimateAuthorization);
  }, [estimateAuthorization]);

  const [data, setData] = useState<AuthorizedItem[]>(estimateAuthorization);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AuthorizedItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("incomplete");
  const dispatch = useDispatch();

  // Filter estimates based on status
  const incompleteEstimates = data.filter(
    (item) => item.authorizationStatus === "Incomplete"
  );
  const completeEstimates = data.filter(
    (item) => item.authorizationStatus === "Complete"
  );

  const handleEdit = (item: AuthorizedItem) => {
    setEditingId(item.id);
    setFormData({ ...item });
  };

  const handleDelete = (item: AuthorizedItem) => {
    dispatch(setAuthorizationId(item.id));
    dispatch(setAuthorizationDeleteStatus(true));
  };

  const handleSave = () => {
    if (formData) {
      const { authorizationMedium, authorizationStatus, note, amount } =
        formData;
      if (
        !authorizationMedium?.trim() ||
        !authorizationStatus?.trim() ||
        !note?.trim() ||
        !amount
      ) {
        message.error("All fields are required.");
        return;
      }

      const formattedFormData = {
        id: formData.id,
        authorizationMedium: formData.authorizationMedium,
        amount: parseFloat(formData.amount),
        note: formData.note,
        authorizationStatus: formData.authorizationStatus,
      };
      
      dispatch(setAuthorizationEditStatus(true));
      dispatch(setSingleAuthorization(formattedFormData));

      setData((prev) =>
        prev.map((item) => (item.id === editingId ? formData : item))
      );
      setEditingId(null);
      setFormData(null);
    }
  };

  const handleChange = (field: keyof AuthorizedItem, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const incompleteIds = incompleteEstimates.map((item) => item.id);

  const handleAllAuthorized = () => {
    if (incompleteIds.length > 0) {
      dispatch(setAuthorizationIds(incompleteIds));
      dispatch(setAllAuthorizedStatus(true));
    }
  };

  // Function to render authorization items
  const renderAuthorizationItems = (items: AuthorizedItem[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center  text-gray-500">
          No {activeTab === "incomplete" ? "Incomplete" : "Complete"} History Available!
        </div>
      );
    }

    return items.map((item) => (
      <div
        key={item.id}
        className="border text-sm border-gray-400 rounded   bg-white"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            {editingId === item.id && formData ? (
              <>
                <div>
                  <p>
                    <strong>TIME :</strong>{" "}
                    {formatDate(item.createdAt, true)}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Authorize by : </strong>{" "}
                    {item?.customer?.name}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Authorized Medium :</p>
                  <Select
                    value={formData?.authorizationMedium}
                    onChange={(value) =>
                      handleChange("authorizationMedium", value)
                    }
                    style={{ width: "100%" }}
                  >
                    <Option value="Mail">EMAIL</Option>
                    <Option value="SMS">SMS</Option>
                    <Option value="Call">CALL</Option>
                  </Select>
                </div>
                <div>
                  <p className="font-semibold">Authorized Status :</p>
                  <Select
                    value={formData?.authorizationStatus}
                    onChange={(value) =>
                      handleChange("authorizationStatus", value)
                    }
                    style={{ width: "100%" }}
                  >
                    <Option value="Incomplete">Incomplete</Option>
                    <Option value="Complete">Complete</Option>
                  </Select>
                </div>
                <div>
                  <p className="font-semibold">Note :</p>
                  <Input
                    value={formData.note}
                    onChange={(e) => handleChange("note", e.target.value)}
                  />
                </div>
                <div>
                  <p className="font-semibold">Amount :</p>
                  <Input
                    value={formData.amount}
                    onChange={(e) =>
                      handleChange("amount", e.target.value)
                    }
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1">
                <p>
                  <strong>TIME :</strong>{" "}
                  {formatDate(item.createdAt, true)}
                </p>
                <p>
                  <strong>Authorize by : </strong> {item?.customer?.name}
                </p>
                <p>
                  <strong>Authorized Medium :</strong>{" "}
                  {item.authorizationMedium}
                </p>
                <p>
                  <strong>Authorized Status :</strong>{" "}
                  {item.authorizationStatus}
                </p>
                <p>
                  <strong>Note :</strong> {item.note}
                </p>
                <p>
                  <strong>Amount :</strong> ${item.amount}
                </p>
              </div>
            )}
          </div>

          <div className="ml-4 mt-1 flex items-center space-x-2">
            <div>
              {editingId === item.id ? (
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                />
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(item)}
                />
              )}
            </div>
            <div>
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        </div>
        <hr className="my-2 text-gray-300"></hr>
      </div>
    ));
  };

  return (
    <div className="bg-white border border-solid border-gray-300 p-2 w-full  rounded-md">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="-mt-3"
      >
        <TabPane
          tab={
            <span className="flex items-center">
              <CloseCircleOutlined className="mr-1" />
              Incomplete
              {incompleteEstimates.length > 0 && (
                <span className="ml-2 bg-red-500 text-white rounded-full px-1 text-xs">
                  {incompleteEstimates.length}
                </span>
              )}
            </span>
          }
          key="incomplete"
        >
          {renderAuthorizationItems(incompleteEstimates)}
        </TabPane>
        <TabPane
          tab={
            <span className="flex items-center">
              <CheckCircleOutlined className="mr-1" />
              Complete
              {completeEstimates.length > 0 && (
                <span className="ml-2 bg-green-500 text-white rounded-full px-2 text-xs">
                  {completeEstimates.length}
                </span>
              )}
            </span>
          }
          key="complete"
        >
          {renderAuthorizationItems(completeEstimates)}
        </TabPane>
      </Tabs>

      {/* Footer Buttons */}
      <div className="flex justify-between mt-2">
        {incompleteEstimates.length === 0 ? (
          <Button disabled danger icon={<CheckCircleOutlined />}>
            Authorization All
          </Button>
        ) : (
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleAllAuthorized}
          >
            Authorization All
          </Button>
        )}
        <Button
          onClick={onClose}
          type="default"
          className="bg-black text-white"
        >
          CLOSE
        </Button>
      </div>
    </div>
  );
};

export default AuthorizedHistory;