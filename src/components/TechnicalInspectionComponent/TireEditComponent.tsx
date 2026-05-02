"use client";
import {
  useCreateNewTireMutation,
  useDeleteTireImageMutation,
  useGetTireStatusTreadDepthQuery,
  useUpdateTechnicalInspectionItemTireMutation,
  useUpdateTechnicalInspectionItemTireSolutionMutation,
  useUpdateTechnicalInspectionItemTireStatusMutation,
  useUpdateTechnicalInspectionItemTreadDepthMutation,
} from "@/redux/api/technicianInspectionApi";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import tireImage from "../../assets/tireImage.png";
import Image from "next/image";
import TextArea from "antd/es/input/TextArea";
import { PlusCircleOutlined, CameraOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import { ImageViewerModal } from "../ui/ImageViewerModal ";
import PhotoUploadModal from "../ui/PhotoUploadModal";

/* ─── colour helpers ─────────────────────────────────────── */
const COLOR_MAP: Record<string, string> = {
  RED: "#ef4444",
  ORANGE: "#f97316",
  GREEN: "#22c55e",
};
const tireColorDot = (color?: string) =>
  color ? (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: COLOR_MAP[color] ?? "#94a3b8",
        marginRight: 6,
        verticalAlign: "middle",
      }}
    />
  ) : null;

/* ─── color circle radio ─────────────────────────────────── */
function ColorRadioGroup({ form }: any) {
  const selectedColor = Form.useWatch("color", form);

  return (
    <Radio.Group
      value={selectedColor}
      onChange={(e) => form.setFieldValue("color", e.target.value)}
      style={{ display: "flex", gap: 10 }}
    >
      {(["GREEN", "ORANGE", "RED"] as const).map((color) => (
        <Radio.Button
          key={color}
          value={color}
          style={{
            borderRadius: "50%",
            width: 32,
            height: 32,
            padding: 0,
            border: `3px solid ${COLOR_MAP[color]}`,
            backgroundColor:
              selectedColor === color ? COLOR_MAP[color] : "transparent",
          }}
        />
      ))}
    </Radio.Group>
  );
}

/* ─── shared compact label style ───────────────────────────  */
const itemStyle = { marginBottom: 10 };

/* ═══════════════════════════════════════════════════════════ */
const Tires = ({
  id,
  item,
  refetch,
}: {
  id: string;
  item: any;
  refetch: () => void;
}) => {
  console.log("item", item)

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const tirePosition = Form.useWatch("tirePosition", addForm);
  const axleNumber = Form.useWatch("axleNumber", addForm);
  const side = Form.useWatch("side", addForm);
  const placement = Form.useWatch("placement", addForm);
  const tireLabel = `${tirePosition || "?"} Axle ${axleNumber || "?"} – ${side || "?"} ${placement || "?"}`;

  /* mutations */
  const [updateTechnicalInspectionItemTire] = useUpdateTechnicalInspectionItemTireMutation();
  const [updateTechnicalInspectionItemTireStatus] = useUpdateTechnicalInspectionItemTireStatusMutation();
  const [updateTechnicalInspectionItemTreadDepth] = useUpdateTechnicalInspectionItemTreadDepthMutation();
  const [updateTechnicalInspectionItemTireSolution] = useUpdateTechnicalInspectionItemTireSolutionMutation();
  const { data: statusDepthSolutionData, refetch: tireDepRefetch } = useGetTireStatusTreadDepthQuery(item?.inspectionItemTireCode);
  const [createNewTire] = useCreateNewTireMutation();
  const [deleteTireImage] = useDeleteTireImageMutation();

  /* local state */
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedItemTire, setSelectedItemTire] = useState<any>(null);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraOpenForAdd, setCameraOpenForAdd] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  console.log("selectedItemTire", selectedItemTire)
  const handleCameraClick = () => {
    setViewerOpen(true);
  };
  const handleAddMore = () => {
    setViewerOpen(false);
    setCameraOpen(true);
  };

  const handleDeleteExisting = async (id: string) => {
    try {
      const res = await deleteTireImage(id).unwrap();
      message.success("Deleted!");
      refetch();
      setSelectedItemTire((p: any) => ({
        ...p,
        ItemTireImage: p.ItemTireImage.filter((img: any) => img.id !== id),
      }))
    } catch {
      message.error("Failed to delete.");
    }

  }

  const handleFiles = (fileList: any) => {
    setFiles(fileList);
  };
  useEffect(() => {
    if (!selectedItemTire) return;
    form.setFieldsValue({
      tireName: selectedItemTire.tireName || "",
      customNote: selectedItemTire.customNote || "",
      dot: selectedItemTire.dot || "",
      psiBefore: selectedItemTire.psiBefore || "",
      color: selectedItemTire.color || "GREEN",
      solution: selectedItemTire.solution?.filter((s: any) => s.status).map((s: any) => s.name),
      tireStatus: selectedItemTire.tireStatus?.filter((s: any) => s.status).map((s: any) => s.name),
      treadDepths: selectedItemTire.treadDepths?.filter((d: any) => d.status).map((d: any) => d.name),
    });
    setExistingImages(selectedItemTire.ItemTireImage || []);
  }, [selectedItemTire, form]);


  /* handlers */
  const handleSubmitForTire = async (values: any) => {

    const formData = new FormData()
    formData.append("data", JSON.stringify(values))
    files.forEach((file) => {
      formData.append("tireImages", file)
    })
    try {
      const res = await updateTechnicalInspectionItemTire({ formData, id: selectedItemTire.id }).unwrap()
      message.success("Tire updated Successfully");
      refetch();
      setIsModalOpen2(false);
      setFileList([]);
      setFiles([]);
      setExistingImages([]);
    } catch (err) {
      message.error("Tire updated Failed");
    }
  };

  const handleTireSolutionUpdate = (names: string[]) => {
    (selectedItemTire?.solution || []).forEach((s: any) => {
      if (s.status !== names.includes(s.name))
        updateTechnicalInspectionItemTireSolution({ ...s, status: names.includes(s.name) }).unwrap()
          .then(() => { refetch(); message.success("Solution updated"); })
          .catch(() => message.error("Something went wrong."));
    });
    setSelectedItemTire((p: any) => ({ ...p, solution: p.solution.map((s: any) => ({ ...s, status: names.includes(s.name) })) }));
  };

  const handleTireStatusUpdate = (names: string[]) => {
    (selectedItemTire?.tireStatus || []).forEach((s: any) => {
      if (s.status !== names.includes(s.name))
        updateTechnicalInspectionItemTireStatus({ ...s, status: names.includes(s.name) }).unwrap()
          .then(() => { refetch(); message.success("Status updated"); });
    });
    setSelectedItemTire((p: any) => ({ ...p, tireStatus: p.tireStatus.map((s: any) => ({ ...s, status: names.includes(s.name) })) }));
  };

  const handleTreadDepthChange = (names: string[]) => {

    const updated = (selectedItemTire?.treadDepths || []).map((d: any) => ({
      ...d,
      status: names.includes(d.name),
    }));

    // 1. update backend
    updated.forEach((d: any) => {
      updateTechnicalInspectionItemTreadDepth(d)
        .unwrap()
        .then(() => message.success("Tread depth updated"));
    });

    // 2. update local state
    setSelectedItemTire((p: any) => ({
      ...p,
      treadDepths: updated,
    }));

    // 3. update form value
    form.setFieldValue("treadDepths", names);

    // 4. COLOR LOGIC (use UPDATED data - NOT state)
    if (!names.length) {
      form.setFieldValue("color", "GREEN");
      return;
    }

    const last = names[names.length - 1];

    const found = updated.find((p: any) => p.name === last);
    const c = found?.color?.toUpperCase();
  };

  const addNewTire = async (values: any) => {
    const all = statusDepthSolutionData;
    const payload = {
      tireName: `${values.tirePosition} Axle ${values.axleNumber} - ${values.side} ${values.placement}`,
      tirePosition: values.tirePosition,
      axleNumber: values.axleNumber,
      isInner: values.side === "Inner",
      color: values.color,
      customNote: values.customNote,
      dot: values.dot,
      psiBefore: values.psiBefore,
      solution: (all?.solutions || []).map((s: any) => ({ name: s.name, status: values.solutions?.includes(s.name) || false })),
      tireStatus: (all?.tireStatuses || []).map((s: any) => ({ name: s.name, color: s.color, status: values.tireStatuses?.includes(s.name) || false })),
      treadDepths: (all?.treadDepths || []).map((d: any) => ({ name: d.name, color: d.color, status: values.treadDepths?.includes(d.name) || false })),
      tireIndex: values.axleNumber,
      id,
    }
    const formData = new FormData()
    formData.append("data", JSON.stringify(payload))
    files.forEach((file) => {
      formData.append("tireImages", file)
    })
    try {
      const res = await createNewTire({ formData, id }).unwrap()
      message.success("Tire added");
      refetch();
      addForm.resetFields()
      setIsModalOpen3(false);
      setFiles([]);

    } catch (err) {
      message.error("Something went wrong.")
    }

  };
  /* ── render ─────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        .tire-card {
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: box-shadow .18s, border-color .18s, transform .15s;
          position: relative;
          overflow: hidden;
        }
        .tire-card:hover {
          box-shadow: 0 4px 18px rgba(0,0,0,.08);
          border-color: #94a3b8;
          transform: translateY(-1px);
        }
        .tire-card::before {
          content: "";
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          border-radius: 10px 0 0 10px;
          background: var(--tire-accent, #e2e8f0);
        }
        .tire-card .tc-name {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.3;
          letter-spacing: -.01em;
        }
        .tire-card .tc-sub {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
        .tires-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .add-tire-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          background: #1e293b;
          border: none;
          cursor: pointer;
          transition: background .2s, transform .15s;
          letter-spacing: .01em;
        }
        .add-tire-btn:hover {
          background: #334155;
          transform: translateY(-1px);
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: .07em;
        }
        /* compact modal form */
        .ant-form-item-label > label {
          font-size: 12px !important;
          font-weight: 600 !important;
          color: #64748b !important;
          letter-spacing: .03em !important;
        }
        .compact-divider {
          border-top: 1px solid #f1f5f9;
          margin: 10px 0;
        }
        .img-thumb-wrap {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }
        .img-thumb-wrap img { width:100%; height:100%; object-fit:cover; }
        .img-del-btn {
          position: absolute;
          top: 3px; right: 3px;
          background: rgba(255,255,255,.9) !important;
          border-radius: 50% !important;
          width: 22px !important;
          height: 22px !important;
          min-width: unset !important;
          padding: 0 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .existing-imgs { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:10px; }
        .preview-label {
          font-size: 11px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 6px;
        }
        /* slim upload */
        .ant-upload-select-picture-card, .ant-upload-list-picture-card-container {
          width: 72px !important;
          height: 72px !important;
        }
      `}</style>

      {/* ── Add Tire Modal ─────────────────────────────────── */}
      {/* <Modal
        open={addPreviewVisible}
        title={addPreviewTitle}
        footer={null}
        onCancel={() => setAddPreviewVisible(false)}
      >
        <Image
          src={addPreviewImage}
          alt="preview"
          width={600}
          height={400}
          className="w-full h-auto object-contain"
        />
      </Modal> */}

      <Modal
        title={
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            Add New Tire
          </span>
        }
        open={isModalOpen3}
        onOk={() => addForm.submit()}
        onCancel={() => { setIsModalOpen3(false); addForm.resetFields(); }}
        okText="Add Tire"
        okButtonProps={{ style: { background: "#1e293b", borderColor: "#1e293b", fontWeight: 600 } }}
        width={480}
      >
        <div style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", borderRadius: 6, padding: "6px 10px", marginBottom: 12, fontFamily: "monospace" }}>
          {tireLabel}
        </div>
        <Form form={addForm} layout="vertical" onFinish={addNewTire} size="small">
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="tirePosition" label="Position" rules={[{ required: true }]} style={itemStyle}>
                <Select placeholder="Select">
                  <Select.Option value="Front">Front</Select.Option>
                  <Select.Option value="Rear">Rear</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="axleNumber" label="Axle №" rules={[{ required: true }]} style={itemStyle}>
                <Select placeholder="Select">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <Select.Option key={n} value={n}>{n}</Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="side" label="Side" rules={[{ required: true }]} style={itemStyle}>
                <Select placeholder="Select">
                  <Select.Option value="Inner">Inner</Select.Option>
                  <Select.Option value="Outer">Outer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="placement" label="Placement" rules={[{ required: true }]} style={itemStyle}>
                <Select placeholder="Select">
                  <Select.Option value="Left">Left</Select.Option>
                  <Select.Option value="Right">Right</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="color" label="Color" style={itemStyle}>
            <ColorRadioGroup form={addForm} />
          </Form.Item>

          <Form.Item label="Photos" style={itemStyle}>
            <Button
              size="small"
              icon={<CameraOutlined />}
              onClick={() => setCameraOpenForAdd(true)}
              className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${fileList.length > 0
                ? "!bg-blue-50 !text-blue-500"
                : "!bg-gray-100"
                }`}
            />
            <PhotoUploadModal
              open={cameraOpenForAdd}
              onClose={() => setCameraOpenForAdd(false)}
              onFilesChange={handleFiles}
            />
          </Form.Item>

          <div className="compact-divider" />

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="dot" label="DOT" style={itemStyle}>
                <Input placeholder="Enter DOT" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="psiBefore" label="PSI Before" style={itemStyle}>
                <Input placeholder="Enter PSI" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="customNote" label="Note" style={itemStyle}>
            <TextArea rows={2} placeholder="Optional note…" />
          </Form.Item>

          <div className="compact-divider" />

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="solutions" label="Solutions" style={itemStyle}>
                <Select mode="multiple" allowClear placeholder="Select" size="small">
                  {statusDepthSolutionData?.solutions.map((s: any) => (
                    <Select.Option key={s.id} value={s.name}>
                      <Tag color={s.color} style={{ fontSize: 11, margin: 0 }}>{s.name}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tireStatuses" label="Tire Status" style={itemStyle}>
                <Select mode="multiple" allowClear placeholder="Select" size="small">
                  {statusDepthSolutionData?.tireStatuses.map((s: any) => (
                    <Select.Option key={s.id} value={s.name}>
                      <Tag color={s.color} style={{ fontSize: 11, margin: 0 }}>{s.name}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="treadDepths" label="Tread Depths" style={itemStyle}>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select"
              size="small"
              getPopupContainer={(trigger) => trigger.parentNode}
              dropdownAlign={{ points: ["bl", "tl"] }}
            // onChange={(values) => handleTreadDepthChange(values)}
            >
              {statusDepthSolutionData?.treadDepths.map((d: any) => (
                <Select.Option key={d.id} value={d.name}>
                  <Tag color={d.color} style={{ fontSize: 11, margin: 0 }}>
                    {d.name}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* ── Page body ──────────────────────────────────────── */}
      <div className="section-header">
        <span className="section-title">Tires ({item?.Tire?.length ?? 0})</span>
        <button className="add-tire-btn" onClick={() => setIsModalOpen3(true)}>
          <PlusCircleOutlined style={{ fontSize: 14 }} />
          Add Tire
        </button>
      </div>

      <div className="tires-grid">
        {item?.Tire?.map((t: any) => {
          const accent = t.color ? COLOR_MAP[t.color] : "#e2e8f0";
          return (
            <div
              key={t.id}
              className="tire-card"
              style={{ "--tire-accent": accent } as React.CSSProperties}
              onClick={() => { setSelectedItemTire(t); setIsModalOpen2(true); }}
            >
              <Image src={tireImage} width={38} height={38} alt="Tire" style={{ opacity: .85, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div className="tc-name" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tireColorDot(t.color)}{t.tireName}
                </div>
                <div className="tc-sub">
                  {t.dot && <span style={{ marginRight: 8 }}>DOT: {t.dot}</span>}
                  {t.psiBefore && <span>PSI: {t.psiBefore}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Edit Tire Modal ────────────────────────────────── */}
      <Modal
        title={
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            {selectedItemTire?.tireName || "Inspection Form"}
          </span>
        }
        open={isModalOpen2}
        onOk={() => form.submit()}
        onCancel={() => { setIsModalOpen2(false); setFileList([]); }}
        okText="Save Changes"
        okButtonProps={{ style: { background: "#1e293b", borderColor: "#1e293b", fontWeight: 600 } }}
        width={520}
      >
        <Form form={form} onFinish={handleSubmitForTire} layout="vertical" size="small">
          <Form.Item name="tireName" label="Tire Name" style={itemStyle}>
            <Input readOnly style={{ background: "#f8fafc", color: "#475569", cursor: "default" }} />
          </Form.Item>

          <Form.Item name="color" label="Color" style={itemStyle}>
            <ColorRadioGroup form={form} />
          </Form.Item>

          <Form.Item label="Add Photos" style={itemStyle}>
            {/* <Upload
              listType="picture-card"
              accept="image/*"
              fileList={fileList}
              onPreview={async (f) => { setPreviewImage(f.url || await getBase64(f.originFileObj!)); setPreviewVisible(true); setPreviewTitle(f.name); }}
              onChange={({ fileList: nfl }) => setFileList(nfl)}
              beforeUpload={() => false}
              onRemove={(f) => setFileList((p) => p.filter((x) => x.uid !== f.uid))}
              multiple
            >
              <div><PlusOutlined /><div style={{ marginTop: 4, fontSize: 11 }}>Upload</div></div>
            </Upload> */}
            <Button
              size="small"
              icon={<CameraOutlined />}
              onClick={handleCameraClick}
              className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${fileList.length > 0
                ? "!bg-blue-50 !text-blue-500"
                : "!bg-gray-100"
                }`}
            />
            <ImageViewerModal
              open={viewerOpen}
              onClose={() => setViewerOpen(false)}
              existingImages={existingImages || []}      // from API
              onAddMore={handleAddMore}
              onDeleteExisting={(id) => handleDeleteExisting(id)}
            />
            <PhotoUploadModal
              open={cameraOpen}
              onClose={() => setCameraOpen(false)}
              onFilesChange={handleFiles}
            />
          </Form.Item>

          {/* <Modal
            open={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewVisible(false)}
          >
            <div className="relative w-full h-[400px]">
              <Image
                src={previewImage}
                alt="preview"
                fill
                className="object-contain"
              />
            </div>
          </Modal> */}

          <div className="compact-divider" />

          <Form.Item name="customNote" label="Note" style={itemStyle}>
            <Input.TextArea rows={2} placeholder="Custom note…" />
          </Form.Item>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="dot" label="DOT" style={itemStyle}><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="psiBefore" label="PSI Before" style={itemStyle}><Input /></Form.Item>
            </Col>
          </Row>

          <div className="compact-divider" />

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="solution" label="Solutions" style={itemStyle}>
                <Select
                  mode="multiple"
                  placeholder="Select"
                  value={selectedItemTire?.solution?.filter((s: any) => s.status).map((s: any) => s.name) || []}
                  onChange={handleTireSolutionUpdate}
                  size="small"
                >
                  {selectedItemTire?.solution?.map((s: any) => (
                    <Select.Option key={s.id} value={s.name}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="tireStatus" label="Tire Status" style={itemStyle}>
                <Select
                  mode="multiple"
                  placeholder="Select"
                  value={selectedItemTire?.tireStatus?.filter((s: any) => s.status).map((s: any) => s.name) || []}
                  onChange={handleTireStatusUpdate}
                  size="small"
                >
                  {selectedItemTire?.tireStatus?.map((s: any) => (
                    <Select.Option key={s.id} value={s.name}>
                      <Tag color={s.color} style={{ fontSize: 11, margin: 0 }}>{s.name}</Tag>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="treadDepths" label="Tread Depths" style={itemStyle}>
            <Select
              mode="multiple"
              placeholder="Select tread depth"
              value={selectedItemTire?.treadDepths?.filter((d: any) => d.status).map((d: any) => d.name) || []}
              onChange={handleTreadDepthChange}
              getPopupContainer={(trigger) => trigger.parentNode} // important
              dropdownAlign={{ points: ["bl", "tl"] }} // 👈 bottom → top force
              size="small"
            >
              {selectedItemTire?.treadDepths?.map((d: any) => (
                <Select.Option key={d.id} value={d.name}>
                  <Tag color={d.color} style={{ fontSize: 11, margin: 0 }}>{d.name}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Tires;