"use client";

import {
  useDeleteGeneralImageMutation,
  useGetTechnicianSingleTireItemQuery,
  useUpdateTechnicalInspectionItemGeneralMutation,
} from "@/redux/api/technicianInspectionApi";
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Tag,
  Modal,
  Upload,
  Popconfirm,
} from "antd";
import { useEffect, useState } from "react";
import CommonPart from "./CommonPart";
import {
  PlusOutlined,
  DeleteOutlined,
  CameraOutlined,
  MessageOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import Image from "next/image";

// ─────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────
const STATUS: Record<string, { hex: string; label: string }> = {
  GREEN:  { hex: "#22c55e", label: "OK" },
  ORANGE: { hex: "#f97316", label: "Monitor" },
  RED:    { hex: "#ef4444", label: "Urgent" },
};

const StatusDots = ({ value }: { value?: string }) => (
  <div className="flex items-center gap-1 shrink-0">
    {Object.entries(STATUS).map(([key, { hex, label }]) => (
      <span
        key={key}
        title={label}
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          border: `2px solid ${hex}`,
          backgroundColor: value === key ? hex : "transparent",
          display: "inline-block",
          flexShrink: 0,
          transition: "background-color 0.15s",
        }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const getBase64 = (file: File | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (e) => reject(e);
  });

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const GeneralEditComponent = ({ id }: { id: string }) => {
  const [form] = Form.useForm();
  const selectedColor = Form.useWatch("color", form);

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [fileList, setFileList]             = useState<UploadFile[]>([]);
  const [noteOpen, setNoteOpen]             = useState(false);
  const [cameraOpen, setCameraOpen]         = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage]     = useState("");
  const [previewTitle, setPreviewTitle]     = useState("");

  const { data, isLoading, refetch }              = useGetTechnicianSingleTireItemQuery(id);
  const [deleteGeneralImage]                       = useDeleteGeneralImageMutation();
  const [updateTechnicalInspectionItemGeneral]     = useUpdateTechnicalInspectionItemGeneralMutation();

  // ── Pre-fill form on data load ──
  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      color:    data.color || "GREEN",
      problems: data.problem?.filter((p: any) => p.status).map((p: any) => p.id) ?? [],
      maps:     data.map?.filter((m: any) => m.status).map((m: any) => m.id) ?? [],
      solutions:data.solution?.filter((s: any) => s.status).map((s: any) => s.id) ?? [],
      customNote: data.customNote || "",
    });
    if (data.ItemGeneralImage) setExistingImages(data.ItemGeneralImage);
  }, [data, form]);

  // ── Color auto-select from problem ──
  const handleProblemChange = (values: string[]) => {
    if (!values.length) { form.setFieldValue("color", "GREEN"); return; }
    const last  = values[values.length - 1];
    const found = data?.problem?.find((p: any) => p.id === last);
    const c     = found?.color?.toUpperCase();
    form.setFieldValue("color", c === "RED" ? "RED" : c === "ORANGE" ? "ORANGE" : "GREEN");
  };

  // ── Delete existing image ──
  const handleDeleteImage = async (imgId: string, imageUrl: string) => {
    try {
      await deleteGeneralImage(imgId).unwrap();
      await fetch("/api/deleteImage", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
      message.success("Image deleted");
    } catch {
      message.error("Failed to delete image");
    }
  };

  // ── Submit ──
  const handleSubmit = async (values: any) => {
    const fullProblems  = data?.problem  || [];
    const fullMaps      = data?.map      || [];
    const fullSolutions = data?.solution || [];

    const finalProblems  = fullProblems.map((item: any)  => ({ id: item.id, name: item.name, color: item.color, status: (values.problems  || []).includes(item.id) }));
    const finalMaps      = fullMaps.map((item: any)      => ({ id: item.id, name: item.name,                    status: (values.maps      || []).includes(item.id) }));
    const finalSolutions = fullSolutions.map((item: any) => ({ id: item.id, name: item.name,                    status: (values.solutions || []).includes(item.id) }));

    let uploadedImages;
    if (fileList.length > 0) {
      const formData = new FormData();
      fileList.forEach((f) => { if (f.originFileObj) formData.append("images", f.originFileObj); });
      formData.append("itemId", id);
      const res  = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      uploadedImages = json?.images;
    }

    try {
      await updateTechnicalInspectionItemGeneral({
        id,
        customNote: values.customNote,
        color:      values.color,
        problem:    finalProblems,
        map:        finalMaps,
        solution:   finalSolutions,
        images:     uploadedImages,
      }).unwrap();
      refetch();
      setFileList([]);
      message.success("Updated successfully!");
    } catch {
      message.error("Failed to update.");
    }
  };

  if (isLoading) return null;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 py-3">
      <CommonPart id={id} />

      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ color: "GREEN" }}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
      >
        {/* ── Single row (desktop) / stacked (mobile) ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">

          {/* 1. Status dots + Name */}
          <div className="flex items-center gap-2 sm:w-44 shrink-0 min-w-0">
            <Form.Item name="color" noStyle>
              <StatusDots value={selectedColor} />
            </Form.Item>
            <span
              className="text-[13px] font-semibold text-gray-800 truncate leading-tight"
              title={data?.name}
            >
              {data?.name ?? "—"}
            </span>
          </div>

          {/* 2. Selects */}
          <div className="flex flex-col sm:flex-row gap-1.5 flex-1 min-w-0">

            <Form.Item name="problems" noStyle>
              <Select
                mode="multiple"
                placeholder="Problem"
                size="small"
                allowClear
                onChange={handleProblemChange}
                maxTagCount="responsive"
                className="!w-full sm:flex-1"
              >
                {data?.problem?.map((p: any) => (
                  <Select.Option key={p.id} value={p.id}>
                    <Tag color={p.color?.toLowerCase()} style={{ margin: 0, fontSize: 11 }}>
                      {p.name}
                    </Tag>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="solutions" noStyle>
              <Select
                mode="multiple"
                placeholder="Solution"
                size="small"
                allowClear
                maxTagCount="responsive"
                className="!w-full sm:flex-1"
              >
                {data?.solution?.map((s: any) => (
                  <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="maps" noStyle>
              <Select
                mode="multiple"
                placeholder="Map"
                size="small"
                allowClear
                maxTagCount="responsive"
                className="!w-full sm:flex-1"
              >
                {data?.map?.map((m: any) => (
                  <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* 3. Actions */}
          <div className="flex items-center gap-1.5 shrink-0 justify-end">
            <Button
              size="small"
              icon={<CameraOutlined />}
              onClick={() => setCameraOpen(true)}
              className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${
                fileList.length > 0 ? "!bg-blue-50 !text-blue-500" : "!bg-gray-100"
              }`}
            />
            <Button
              size="small"
              icon={<MessageOutlined />}
              onClick={() => setNoteOpen(true)}
              className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${
                form.getFieldValue("customNote") ? "!bg-blue-50 !text-blue-500" : "!bg-gray-100"
              }`}
            />
            <Button
              type="primary"
              size="small"
              htmlType="submit"
              icon={<SaveOutlined />}
              className="!h-7 !px-2.5 !flex items-center gap-1 !rounded-md"
            >
              <span className="hidden sm:inline text-xs font-medium">Update</span>
            </Button>
          </div>
        </div>

        {/* ── Note modal ── */}
        <Modal
          title="Edit Note"
          open={noteOpen}
          onOk={() => setNoteOpen(false)}
          onCancel={() => setNoteOpen(false)}
          destroyOnClose
          width={340}
        >
          <Form.Item name="customNote" style={{ margin: 0 }}>
            <Input.TextArea rows={3} placeholder="Enter custom note…" />
          </Form.Item>
        </Modal>

        {/* ── Camera / Images modal ── */}
        <Modal
          title="Images"
          open={cameraOpen}
          onOk={() => setCameraOpen(false)}
          onCancel={() => setCameraOpen(false)}
          destroyOnClose
          width={480}
        >
          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Saved
              </p>
              <div className="flex flex-wrap gap-2">
               {existingImages.map((img) => (
                 <div key={img.id} className="relative w-24 h-24">
             
                   {/* Image Wrapper */}
                   <Image
                     src={img.imageUrl}
                     alt={img.name}
                     fill
                     className="object-cover rounded-md"
                   />
             
                   {/* Delete Button */}
                   <Popconfirm
                     title="Delete this image?"
                     onConfirm={() => handleDeleteImage(img.id, img.imageUrl)}
                     okText="Yes"
                     cancelText="No"
                   >
                     <Button
                       size="small"
                       danger
                       icon={<DeleteOutlined />}
                       className="!absolute !top-1 !right-1 !w-5 !h-5 !p-0 !rounded-full !bg-white"
                     />
                   </Popconfirm>
             
                 </div>
               ))}
             </div>
            </div>
          )}

          {/* Upload new */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Upload New
          </p>
          <Upload
            listType="picture-card"
            accept="image/*"
            fileList={fileList}
            multiple
            beforeUpload={() => false}
            onChange={({ fileList: next }) => setFileList(next)}
            onRemove={(file) =>
              setFileList((prev) => prev.filter((f) => f.uid !== file.uid))
            }
            onPreview={async (file) => {
              setPreviewImage(file.url || (await getBase64(file.originFileObj!)));
              setPreviewTitle(file.name ?? "");
              setPreviewVisible(true);
            }}
          >
            <div className="flex flex-col items-center">
              <PlusOutlined />
              <span className="text-xs mt-1">Upload</span>
            </div>
          </Upload>
        </Modal>

        {/* Image preview */}
       <Modal
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
    </Modal>
      </Form>
    </div>
  );
};

export default GeneralEditComponent;