"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.service";
import tireImage from "@/assets/tireImage.png";
import {
  PlusOutlined,
  CloseCircleFilled,
  CameraOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
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
  Upload,
  Radio,
  Row,
  Col,
} from "antd";
import { getBaseUrl } from "@/helpers/config/envConfig";
import Image from "next/image";
import { BsCheck } from "react-icons/bs";
import {
  useCreateInspectionTireMutation,
  useGetCarByEstimateQuery,
  useGetConcernByEstimateQuery,
  useInspectionItemTireSingleTireItemQuery,
} from "@/redux/api/technicianInspectionApi";
import PhotoUploadModal from "../ui/PhotoUploadModal";

const { Title } = Typography;

interface TireStatus {
  id: string;
  name: string;
  color: string;
}

interface TreadDepth {
  id: string;
  name: string;
  color: string;
}

interface Solution {
  id: string;
  name: string;
}

interface InspectionItemTire {
  code: string;
  name: string;
  customNote: string;
  type: string;
  solutions: Solution[];
  tireStatuses: TireStatus[];
  treadDepths: TreadDepth[];
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

// Enhanced Tire interface with complete position tracking
interface Tire {
  id: number;
  position: "front" | "rear";
  axleIndex: number;
  tireIndex: number; // Position in the axle (0-3 for a 4-tire axle)
  isInner: boolean; // Whether this is an inner tire
}

// Define the FormTireData interface for the form values
interface FormTireData {
  psiBefore?: string;
  customNote?: string;
  solutions?: string[];
  tireStatus?: string[];
  treadDepths?: string[];
  position: "front" | "rear";
  axleIndex: number;
  tireIndex: number;
  isInner: boolean;
}

// Form values interface
interface FormValues {
  tires: Record<string, FormTireData>;
}

const InspectionItemTirePage = ({
  InspectionItemTire,
  estimateCode,
  inspectionCode,
  refetchInspectionGeneralItem
}: {
  InspectionItemTire: any;
  estimateCode: string;
  inspectionCode: string;
  refetchInspectionGeneralItem: () => void;
}) => {
  const [createInspectionTire] = useCreateInspectionTireMutation();
  const user = getUserInfo();

  useEffect(() => {
    setItem(InspectionItemTire);
  }, [InspectionItemTire]);


  const [item, setItem] = useState<InspectionItemTire | null>(null);

  const [form] = Form.useForm();

  const [cameraOpen, setCameraOpen] = useState(false);
  // Tire configuration state
  const [frontAxles, setFrontAxles] = useState([
    {
      axleIndex: 0,
      hasInnerTires: false,
      tires: [
        {
          id: 1,
          position: "front" as const,
          axleIndex: 0,
          tireIndex: 0,
          isInner: false,
        },
        {
          id: 2,
          position: "front" as const,
          axleIndex: 0,
          tireIndex: 1,
          isInner: false,
        },
      ],
    },
  ]);

  const [rearAxles, setRearAxles] = useState([
    {
      axleIndex: 0,
      hasInnerTires: false,
      tires: [
        {
          id: 3,
          position: "rear" as const,
          axleIndex: 0,
          tireIndex: 0,
          isInner: false,
        },
        {
          id: 4,
          position: "rear" as const,
          axleIndex: 0,
          tireIndex: 1,
          isInner: false,
        },
      ],
    },
  ]);

  const [nextTireId, setNextTireId] = useState(5);
  const [selectedTireId, setSelectedTireId] = useState<number | null>(null);

  const [tires, setTires] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileLists, setFileLists] = useState<{ [key: string]: UploadFile[] }>(
    {}
  );
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
  const handleProblemChange = (values: any[], item: any, name: any) => {

    if (!values.length) {
      form.setFieldValue(name, "GREEN");
      return;
    }

    // ✅ get last selected
    const last = values[values.length - 1];

    // find full problem object
    const found = item?.treadDepths?.find(
      (p: any) => p.name === last || p.name === last?.name
    );
    const color = found?.color?.toLowerCase();
    if (color === "red") {
      form.setFieldValue(name, "RED");
    } else if (color === "orange") {
      form.setFieldValue(name, "ORANGE");
    } else {
      form.setFieldValue(name, "GREEN");
    }
  };
  const getBase64 = (file: File | Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const showModal = (tireId: number, tireData: any, formIndex: string) => {
    setSelectedTireId(tireId);
    setIsModalOpen(true);
    // Find the existing tire data
    const existingTire = tires.find(
      (t) =>
        t.position === tireData.position &&
        t.axleIndex === tireData.axleIndex &&
        t.tireIndex === tireData.tireIndex &&
        t.isInner === tireData.isInner
    );

    if (existingTire) {
      // Map the data back into the form structure
      form.setFieldsValue({
        tires: {
          [formIndex]: {
            position: existingTire.position,
            axleIndex: existingTire.axleIndex,
            tireIndex: existingTire.tireIndex,
            isInner: existingTire.isInner,
            psiBefore: existingTire.psiBefore,
            dot: existingTire.dot,
            customNote: existingTire.customNote,
            solutions: existingTire.solutions
              ?.filter((s: any) => s.status)
              .map((s: any) => s.name),
            tireStatus: existingTire.tireStatus
              ?.filter((s: any) => s.status)
              .map((s: any) => s.name),
            treadDepths: existingTire.treadDepths
              ?.filter((d: any) => d.status)
              .map((d: any) => d.name),
            color: existingTire.color,
          },
        },
      });
      setFileLists((prev) => ({
        ...prev,
        [tireId]: prev[tireId] || [],
      }));
    } else {
      // Set initial values for a fresh tire input (optional)
      form.setFieldsValue({
        tires: {
          [formIndex]: {
            position: tireData.position,
            axleIndex: tireData.axleIndex,
            tireIndex: tireData.tireIndex,
            isInner: tireData.isInner,
          },
        },
      });
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const tireData = values.tires;
      const tireKey = Object.keys(tireData)[0];
      const newTire = tireData[tireKey];

      // All available statuses and depths from the `item` prop
      const allStatuses = item?.tireStatuses || [];
      const allDepths = item?.treadDepths || [];
      const allSolutions = item?.solutions || [];

      // Convert selected tireStatus names into full objects with status flag
      const fullTireSolutions = allSolutions.map((solution) => ({
        name: solution.name,
        status: newTire.solutions?.includes(solution.name) || false,
      }));
      const fullTireStatuses = allStatuses.map((status) => ({
        name: status.name,
        color: status.color,
        status: newTire.tireStatus?.includes(status.name) || false,
      }));

      // Convert selected treadDepths into full objects with status flag
      const fullTreadDepths = allDepths.map((depth) => ({
        name: depth.name,
        color: depth.color,
        status: newTire.treadDepths?.includes(depth.name) || false,
      }));

      // Construct the position label (e.g., Front Axle 1 - Outer Left)
      const tireName = `${newTire.position === "front" ? "Front" : "Rear"
        } Axle ${newTire.axleIndex + 1} - ${getTirePositionName(
          newTire.tireIndex,
          newTire.isInner
        )}`;
      // const images = fileLists[selectedTireId!] || [];
      // const formData = new FormData();
      // for (const file of fileLists[selectedTireId!] || []) {
      //   if (file.originFileObj) {
      //     formData.append("images", file.originFileObj);
      //   }
      // }

      // const res = await fetch("/api/uploadTireImage", {
      //   method: "POST",
      //   body: formData,
      // });
      // const images = await res.json();
      const tireWithLabel = {
        ...newTire,
        tireName,
        solutions: fullTireSolutions,
        tireStatus: fullTireStatuses,
        treadDepths: fullTreadDepths,
        image: fileLists[selectedTireId!]
      };

      // Prevent duplicates by matching position, axleIndex, tireIndex, and isInner
      setTires((prev) => {
        const filtered = prev.filter(
          (t) =>
            !(
              t.position === tireWithLabel.position &&
              t.axleIndex === tireWithLabel.axleIndex &&
              t.tireIndex === tireWithLabel.tireIndex &&
              t.isInner === tireWithLabel.isInner
            )
        );
        return [...filtered, tireWithLabel];
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      message.error("Failed to send data");
    }
  };

  const handleCancel = () => {
    setSelectedTireId(null);
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmitFinalData = async () => {
    const cleanedTires = Object.entries(tires).reduce((acc, [key, value]: any) => {
      const { image, ...rest } = value;

      acc.push({
        ...rest
      });

      return acc;
    }, [] as any[]);

    const payload = {
      technicianId:
        typeof user === "object" && user !== null && "userId" in user
          ? (user as any).userId
          : undefined,
      estimateCode,
      inspectionCode,
      name: item?.name,
      inspectionItemTireCode: item?.code,
      tires: cleanedTires,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    Object.entries(tires).forEach(([tireKey, tireValue]: any) => {
      if (tireValue.image && tireValue.image.length > 0) {
        tireValue.image.forEach((fileObj: any, index: number) => {
          const file = fileObj;
          if (file instanceof File) {
            const newFile = new File(
              [file],
              `${tireKey}__${index}__${file.name}`,
              { type: file.type }
            );
            formData.append("tireImages", newFile);
          }
        });
      }
    });
    try {
      await createInspectionTire(formData).unwrap();;
      message.success("Successfully send data");
      refetchInspectionGeneralItem()
      setTires([]);
    } catch (error) {
      message.error("Failed to send data");
    }
  };


  const handleDeleteAxle = (axlePosition: string, axleIndex: number) => {
    if (axlePosition === "front") {
      setFrontAxles((prev) =>
        prev.filter((axle) => axle.axleIndex !== axleIndex)
      );
    } else if (axlePosition === "rear") {
      setRearAxles((prev) =>
        prev.filter((axle) => axle.axleIndex !== axleIndex)
      );
    }
  };

  // Add a new axle with two outer tires
  const addAxle = (position: "front" | "rear") => {
    if (position === "front") {
      const newAxleIndex =
        frontAxles.length > 0
          ? Math.max(...frontAxles.map((a) => a.axleIndex)) + 1
          : 0;

      setFrontAxles([
        ...frontAxles,
        {
          axleIndex: newAxleIndex,
          hasInnerTires: false,
          tires: [
            {
              id: nextTireId,
              position: "front" as const,
              axleIndex: newAxleIndex,
              tireIndex: 0,
              isInner: false,
            },
            {
              id: nextTireId + 1,
              position: "front" as const,
              axleIndex: newAxleIndex,
              tireIndex: 1,
              isInner: false,
            },
          ],
        },
      ]);

      setNextTireId(nextTireId + 2);
    } else {
      const newAxleIndex =
        rearAxles.length > 0
          ? Math.max(...rearAxles.map((a) => a.axleIndex)) + 1
          : 0;

      setRearAxles([
        ...rearAxles,
        {
          axleIndex: newAxleIndex,
          hasInnerTires: false,
          tires: [
            {
              id: nextTireId,
              position: "rear" as const,
              axleIndex: newAxleIndex,
              tireIndex: 0,
              isInner: false,
            },
            {
              id: nextTireId + 1,
              position: "rear" as const,
              axleIndex: newAxleIndex,
              tireIndex: 1,
              isInner: false,
            },
          ],
        },
      ]);

      setNextTireId(nextTireId + 2);
    }
  };

  // Add inner tires to an axle
  const addInnerTires = (position: "front" | "rear", axleIndex: number) => {
    if (position === "front") {
      setFrontAxles(
        frontAxles.map((axle) => {
          if (axle.axleIndex === axleIndex) {
            return {
              ...axle,
              hasInnerTires: true,
              tires: [
                ...axle.tires,
                {
                  id: nextTireId,
                  position: "front" as const,
                  axleIndex: axleIndex,
                  tireIndex: 0,
                  isInner: true,
                },
                {
                  id: nextTireId + 1,
                  position: "front" as const,
                  axleIndex: axleIndex,
                  tireIndex: 1,
                  isInner: true,
                },
              ],
            };
          }
          return axle;
        })
      );

      setNextTireId(nextTireId + 2);
    } else {
      setRearAxles(
        rearAxles.map((axle) => {
          if (axle.axleIndex === axleIndex) {
            return {
              ...axle,
              hasInnerTires: true,
              tires: [
                ...axle.tires,
                {
                  id: nextTireId,
                  position: "rear" as const,
                  axleIndex: axleIndex,
                  tireIndex: 0,
                  isInner: true,
                },
                {
                  id: nextTireId + 1,
                  position: "rear" as const,
                  axleIndex: axleIndex,
                  tireIndex: 1,
                  isInner: true,
                },
              ],
            };
          }
          return axle;
        })
      );

      setNextTireId(nextTireId + 2);
    }
  };

  // Get tire position name based on index and inner/outer status
  const getTirePositionName = (tireIndex: number, isInner: boolean) => {
    if (isInner) {
      return tireIndex === 0 ? "Inner Left" : "Inner Right";
    } else {
      return tireIndex === 0 ? "Outer Left" : "Outer Right";
    }
  };

  // Render tire card with clear position labels
  const renderTireCard = (tire: {
    id: number;
    position: "front" | "rear";
    axleIndex: number;
    tireIndex: number;
    isInner: boolean;
  }) => {
    const formIndex = `${tire.position}-${tire.axleIndex}-${tire.isInner ? "inner" : "outer"
      }-${tire.tireIndex}`;

    const isTireFilled = tires.some(
      (t) =>
        t.position === tire.position &&
        t.axleIndex === tire.axleIndex &&
        t.tireIndex === tire.tireIndex &&
        t.isInner === tire.isInner
    );

    const tirePosition = tire.position === "front" ? "Front" : "Rear";
    const axleNumber = tire.axleIndex + 1;
    const positionName = getTirePositionName(tire.tireIndex, tire.isInner);

    return (
      <>
        <Modal
          className="z-50"
          open={previewVisible}
          title={previewTitle}
          footer={null}
          zIndex={1100}
          onCancel={() => setPreviewVisible(false)}
        >
          <Image alt="example" width={450} height={500} src={previewImage} />
        </Modal>
        <Card
          key={`tire-${tire.id}`}
          className="cursor-pointer !p-0"
          bodyStyle={{ display: "none" }}
          headStyle={{ padding: "6px 10px", minHeight: 0 }}
          onClick={() => showModal(tire.id, tire, formIndex)}
          title={
            <div className="flex items-center justify-between gap-3">
              {/* LEFT SIDE */}
              <div className="flex items-center gap-2 min-w-0">
                <Image
                  src={tireImage}
                  width={28}
                  height={28}
                  alt="Tire"
                  style={{ flexShrink: 0 }}
                />

                <span className="text-sm truncate">
                  {`${tirePosition} Axle ${axleNumber} - ${positionName}`}
                </span>
              </div>

              {/* RIGHT STATUS */}
              {isTireFilled ? (
                <span className="text-green-600 text-xs font-semibold whitespace-nowrap">
                  [ Selected ]
                </span>
              ) : (
                <span className="text-gray-500 text-xs font-semibold whitespace-nowrap">
                  [ Not selected ]
                </span>
              )}
            </div>
          }
        />
        {selectedTireId === tire.id && (
          <Modal
            title={`${tirePosition} Axle ${axleNumber} - ${positionName}`}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name={["tires", formIndex, "color"]}
              >
                <Radio.Group className="flex items-center -mb-10 gap-2 color-radio-group">
                  {["GREEN", "ORANGE", "RED"].map((color) => (
                    <Form.Item shouldUpdate key={color}>
                      {({ getFieldValue }) => {
                        const selectedColor = getFieldValue([
                          "tires",
                          formIndex,
                          "color",
                        ]);
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
                            disabled
                            value={color}
                            style={{
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                              padding: 0,
                              border: `4px solid ${getColor(color)}`,
                              backgroundColor: isSelected
                                ? getColor(color)
                                : "transparent",
                              color: isSelected ? "#fff" : getColor(color),
                              lineHeight: "36px",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >

                          </Radio.Button>
                        );
                      }}
                    </Form.Item>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item >

                <Button
                  size="small"
                  icon={<CameraOutlined />}
                  onClick={() => setCameraOpen(true)}
                  className="!h-8 !px-2 gap-2 !flex items-center gap-1 !rounded-md !border-none bg-blue-100 hover:!bg-blue-200 !text-blue-600"
                >
                  Add Photo
                </Button>
              </Form.Item>
              <PhotoUploadModal
                open={cameraOpen}
                onClose={() => setCameraOpen(false)}
                onFilesChange={handleFiles}
              />

              <Form.Item
                name={["tires", formIndex, "position"]}
                initialValue={tire.position}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>

              <Form.Item
                name={["tires", formIndex, "axleIndex"]}
                initialValue={tire.axleIndex}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>
              <Form.Item
                name={["tires", formIndex, "tireIndex"]}
                initialValue={tire.tireIndex}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>
              <Form.Item
                name={["tires", formIndex, "isInner"]}
                initialValue={tire.isInner}
                noStyle
              >
                <Input type="hidden" />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["tires", formIndex, "psiBefore"]}
                    label="PSI Before Inspection"
                    style={{ marginBottom: 8 }}
                  >
                    <Input placeholder="Enter PSI" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["tires", formIndex, "dot"]}
                    label="DOT Number"
                    style={{ marginBottom: 8 }}
                  >
                    <Input placeholder="Enter DOT Number" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name={["tires", formIndex, "customNote"]}
                label="Custom Note"
                style={{ marginBottom: 8 }}
              >
                <Input.TextArea rows={2} defaultValue={item?.customNote} />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={["tires", formIndex, "solutions"]}
                    label="Solutions"
                    style={{ marginBottom: 8 }}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Choose solutions"
                    >
                      {item?.solutions.map((sol) => (
                        <Select.Option key={sol.id} value={sol.name}>
                          {sol.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={["tires", formIndex, "tireStatus"]}
                    label="Tire Status"
                    style={{ marginBottom: 8 }}
                  >
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Select status"
                    >
                      {item?.tireStatuses.map((status) => (
                        <Select.Option key={status.id} value={status.name}>
                          <Tag color={status.color}>{status.name}</Tag>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name={["tires", formIndex, "treadDepths"]}
                label="Tread Depths"
                style={{ marginBottom: 8 }}
              >
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  dropdownAlign={{ points: ["bl", "tl"] }}
                  onChange={(values) => handleProblemChange(values, item, ["tires", formIndex, "color"])}
                  mode="multiple" allowClear placeholder="Select depth">
                  {item?.treadDepths.map((depth) => (
                    <Select.Option key={depth.id} value={depth.name}>
                      <Tag color={depth.color}>{depth.name}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {/* <Form.Item
                name={["tires", formIndex, "color"]}
                rules={[{ required: true, message: "Color is required" }]}
                label="Tire Color"
              >
                <Select placeholder="Select tire color">
                  <Select.Option value="RED">Red</Select.Option>
                  <Select.Option value="ORANGE">Orange</Select.Option>
                  <Select.Option value="GREEN">Green</Select.Option>
                </Select>
              </Form.Item> */}
            </Form>
          </Modal>
        )}
      </>
    );
  };
  const handleFiles = (fileList: any) => {
    setFileLists((prev) => ({
      ...prev,
      [selectedTireId!]: fileList,
    }))
  };
  // if (isLoading) {
  //   return (
  //     <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
  //   );
  // }

  return (
    <div className="w-full  mx-auto md:my-5 md:shadow-sm">
      <Card
      >
        {/* <h1  className="text-[18px] font-semibold text-center text-gray-800 flex-1 truncate">
          {item?.name}
        </h1> */}

        <Form form={form} layout="vertical">
          {/* Front axles section */}
          <div>

            {frontAxles.map((axle) => (
              <div key={`front-axle-${axle.axleIndex}`}>
                <div className="flex items-center gap-x-2">
                  {axle.axleIndex !== 0 && (
                    <CloseCircleFilled
                      onClick={() => handleDeleteAxle("front", axle.axleIndex)}
                      className="text-lg text-red-600 rounded cursor-pointer hover:text-red-800"
                    />
                  )}

                </div>
                <div
                  className={`grid gap-4 mb-4 ${axle.hasInnerTires ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                    }`}
                >
                  {/* Render all tires for this axle */}
                  {axle.tires.map((tire) => renderTireCard(tire))}
                </div>

                {/* Add inner tires button */}
                {!axle.hasInnerTires && (
                  <Button
                    type="dashed"
                    onClick={() => addInnerTires("front", axle.axleIndex)}
                    style={{ marginBottom: "16px" }}
                    block
                  >
                    + Add Inner Tires to Front Axle {axle.axleIndex + 1}
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="dashed"
              onClick={() => addAxle("front")}
              block
              style={{ marginBottom: "32px" }}
            >
              + Add Front Axle
            </Button>
          </div>

          {/* Rear axles section */}
          <div>

            {rearAxles.map((axle) => (
              <div key={`rear-axle-${axle.axleIndex}`}>
                <div className="flex items-center gap-x-2">
                  {axle.axleIndex !== 0 && (
                    <CloseCircleFilled
                      onClick={() => handleDeleteAxle("rear", axle.axleIndex)}
                      className="text-lg text-red-600 rounded cursor-pointer hover:text-red-800"
                    />
                  )}
                  {/* <Title level={5}>Rear Axle {axle.axleIndex + 1}</Title> */}
                </div>

                <div
                  className={`grid gap-4 mb-4 ${axle.hasInnerTires ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2"
                    }`}
                >
                  {/* Render all tires for this axle */}
                  {axle.tires.map((tire) => renderTireCard(tire))}
                </div>

                {/* Add inner tires button */}
                {!axle.hasInnerTires && (
                  <Button
                    type="dashed"
                    onClick={() => addInnerTires("rear", axle.axleIndex)}
                    style={{ marginBottom: "16px" }}
                    block
                  >
                    + Add Inner Tires to Rear Axle {axle.axleIndex + 1}
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="dashed"
              onClick={() => addAxle("rear")}
              block
              style={{ marginBottom: "32px" }}
            >
              + Add Rear Axle
            </Button>
          </div>
        </Form>
        <Button
          onClick={handleSubmitFinalData}
          disabled={!tires?.length}
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Card>
    </div>
  );
};

export default InspectionItemTirePage;