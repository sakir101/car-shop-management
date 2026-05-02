"use client";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.service";
import {
  Form,
  Input,
  Button,
  Spin,
  Typography,
  Select,
  Card,
  Tag,
  message,
  Modal,
  Radio,
  Row,
  Col,
} from "antd";

import {
  useCreateInspectionItemGeneralMutation,
  useGetCarByEstimateForTechnicianQuery,
  useGetConcernsByEstimateForTechnicianQuery,
} from "@/redux/api/technicianInspectionApi";
import { useGetSingleItemQuery } from "@/redux/api/inspectionGeneralApi";
import Loading from "@/app/loading";
import Upload from "antd/es/upload/Upload";
import Image from "next/image";

const { Title } = Typography;

interface Problem {
  id: string;
  name: string;
  inspectionId: string;
  color: string;
}

interface MapItem {
  id: string;
  name: string;
  inspectionId: string;
}

interface Solution {
  id: string;
  name: string;
  inspectionId: string;
}

interface InspectionItemGeneral {
  code: string;
  name: string;
  customNote: string;
  type: string;
  problems: Problem[];
  maps: MapItem[];
  solutions: Solution[];
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  color: string;
  vin: string;
  numberPlate: string;
  mileage: number;
  condition: string;
}

const colorThemes: Record<string, string> = {
  red: "#ff9999",
  blue: "#d6e4ff",
  green: "#d9f7be",
  orange: "#ffe7ba",
  default: "#ffffff",
};

const InspectionItemGeneralPage = () => {
  const router = useRouter();
  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const [createInspectionItemGeneral] =
    useCreateInspectionItemGeneralMutation();
  const code = pathSegments[pathSegments.length - 2];
  const estimateCode = pathSegments[pathSegments.length - 1];
  const inspectionCode = pathSegments[pathSegments.length - 3];

  const [item, setItem] = useState<InspectionItemGeneral | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("default");
  const [form] = Form.useForm();
  const [concerns, setConcerns] = useState<any[]>([]);
  const [acknowledgedConcerns, setAcknowledgedConcerns] = useState<string[]>(
    []
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as Blob);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const { data: concernData, isLoading } =
    useGetConcernsByEstimateForTechnicianQuery(estimateCode, {
      refetchOnMountOrArgChange: true,
    });
  const { data: generalItem, isLoading: generalDataLoading } =
    useGetSingleItemQuery(code, {
      refetchOnMountOrArgChange: true,
    });
  const { data: carData, isLoading: carDataLoading } =
    useGetCarByEstimateForTechnicianQuery(estimateCode, {
      refetchOnMountOrArgChange: true,
    });

  useEffect(() => {
    if (concernData) {
      setConcerns(concernData);
    }
  }, [concernData]);

  useEffect(() => {
    if (generalItem) {
      setItem(generalItem);
      form.setFieldsValue({ customNote: generalItem.customNote });
    }
  }, [generalItem, form]);

  useEffect(() => {
    if (carData) {
      setCar(carData);
    }
  }, [carData]);

  const handleProblemChange = (value: string) => {
    const selectedProblem = item?.problems.find((p) => p.name === value);
    setSelectedColor(selectedProblem?.color || "default");
  };

  const handleAcknowledge = (concernCode: string) => {
    if (!acknowledgedConcerns.includes(concernCode)) {
      setAcknowledgedConcerns((prev) => [...prev, concernCode]);
    }
  };

  const handleSubmit = async (values: {
    customNote: string;
    problem: string[];
    map: string[];
    solution: string[];
    color: string;
  }) => {
    if (!item) {
      message.error("Inspection item data is not loaded.");
      return;
    }

    let problemsTransformed;
    let mapsTransformed;

    if (item.problems.length > 0) {
      problemsTransformed = item.problems.map((p: any) => ({
        name: p.name,
        color: p.color,
        status:
          Array.isArray(values.problem) && values.problem.includes(p.name),
      }));
    }

    if (item.maps.length > 0) {
      mapsTransformed = item.maps.map((m) => ({
        name: m.name,
        status: Array.isArray(values.map) && values.map.includes(m.name),
      }));
    }

    const solutionsTransformed = item.solutions.map((s) => ({
      name: s.name,
      status:
        Array.isArray(values.solution) && values.solution.includes(s.name),
    }));

    const { userId } = getUserInfo() as any;
    const formData = new FormData();
    for (const file of fileList) {
      if (file.originFileObj) {
        formData.append("images", file.originFileObj);
      }
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json(); // <- this parses the response body as JSON

    const payload = {
      ...values,
      problem: problemsTransformed,
      map: mapsTransformed,
      solution: solutionsTransformed,
      estimateCode: estimateCode,
      inspectionCode: inspectionCode,
      inspectionGenralItemCode: code,
      technicianId: userId, // Use the logged-in user's ID
      name: item?.name,
      images: data?.images,
    };

    try {
      createInspectionItemGeneral(payload)
        .unwrap()
        .then(() => {
          message.success("Saved successfully!");
          router.push(
            `/technician/inspection/${inspectionCode}/${estimateCode}`
          );
        })
        .catch(() => {
          message.error("Failed to save. Please try again.");
        });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (generalDataLoading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-[70%] mx-auto py-10">
      <Card
        style={{
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          backgroundColor: colorThemes[selectedColor] || colorThemes.default,
        }}
      >
        {/* <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
          {item?.name}
        </Title> */}

        {/* Car Details */}
        {/* {car && (
          <div style={{ marginBottom: "30px" }}>
            <Title level={4}>Car Details</Title>
            <div
              style={{ marginBottom: "16px", backgroundColor: "#f9f9f9" }}
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
                <strong>Color:</strong> {car.color}
              </p>
              <p>
                <strong>VIN:</strong> {car.vin}
              </p>
              <p>
                <strong>Number Plate:</strong> {car.numberPlate}
              </p>
              <p>
                <strong>Mileage:</strong> {car.mileage}
              </p>
              <p>
                <strong>Condition:</strong> {car.condition}
              </p>
            </div>
          </div>
        )} */}

        {/* Related Concerns */}
        {/* {concerns?.length > 0 && (
          <div style={{ marginBottom: "30px" }}>
            <Title level={4}>Related Concerns</Title>
            {concerns?.map(({ concern }) => {
              const isAcknowledged = acknowledgedConcerns.includes(
                concern.code
              );
              return (
                <Card
                  key={concern.code}
                  style={{ marginBottom: "16px", backgroundColor: "#f9f9f9" }}
                >
                  <Tag color="volcano">{concern.type}</Tag>
                  <Title level={5} style={{ marginBottom: "8px" }}>
                    {concern.title}
                  </Title>
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
        )} */}
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Color is required" }]}
            style={{ marginBottom: 8 }}
          >
            <Radio.Group style={{ display: "flex", gap: "12px" }}>
              {["RED", "ORANGE", "GREEN"].map((color) => (
                <Form.Item noStyle shouldUpdate key={color}>
                  {({ getFieldValue }) => {
                    const selectedColor = getFieldValue("color");
                    const isSelected = selectedColor === color;

                    const getColor = (color: string) => {
                      switch (color) {
                        case "RED":
                          return "#ff4d4f";
                        case "ORANGE":
                          return "#fa8c16";
                        case "GREEN":
                          return "#52c41a";
                        default:
                          return "#d9d9d9";
                      }
                    };

                    return (
                      <Radio.Button
                        value={color}
                        style={{
                          borderRadius: "50%",
                          width: 40,
                          height: 40,
                          padding: 0,
                          border: `2px solid ${getColor(color)}`,
                          backgroundColor: isSelected
                            ? getColor(color)
                            : "transparent",
                          color: isSelected ? "#fff" : getColor(color),
                          lineHeight: "36px",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {color[0]}
                      </Radio.Button>
                    );
                  }}
                </Form.Item>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Upload Images" style={{ marginBottom: 8 }}>
            <Upload
              multiple
              accept="image/*"
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              onPreview={handlePreview}
              beforeUpload={() => false} // prevent auto-upload
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="customNote"
            label="Custom Note"
            style={{ marginBottom: 8 }}
          >
            <Input.TextArea rows={3} placeholder="Enter custom note" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="problem"
                label="Select Problems"
                style={{ marginBottom: 8 }}
              >
                <Select
                  allowClear
                  mode="multiple"
                  placeholder="Select problems"
                  onChange={handleProblemChange}
                >
                  {item?.problems.map((problem) => (
                    <Select.Option key={problem.id} value={problem.name}>
                      <Tag color={problem.color}>{problem.name}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="solution"
                label="Select Solutions"
                style={{ marginBottom: 8 }}
                rules={[{ required: true, message: "Solution is required" }]}
              >
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select solutions"
                >
                  {item?.solutions.map((solution) => (
                    <Select.Option key={solution.id} value={solution.name}>
                      {solution.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="map" label="Select Maps" style={{ marginBottom: 8 }}>
            <Select mode="multiple" allowClear placeholder="Select maps">
              {item?.maps.map((map) => (
                <Select.Option key={map.id} value={map.name}>
                  {map.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item name="color" label="Color">
            <Select placeholder="Select tire color">
              <Select.Option value="RED">Red</Select.Option>
              <Select.Option value="ORANGE">Orange</Select.Option>
              <Select.Option value="GREEN">Green</Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <Image alt="example" width={450} height={500} src={previewImage} />
      </Modal>
    </div>
  );
};

export default InspectionItemGeneralPage;
