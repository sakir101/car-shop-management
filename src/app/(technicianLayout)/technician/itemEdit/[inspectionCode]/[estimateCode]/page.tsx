"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Spin,
  Tabs,
  Form,
  Select,
  Button,
  Tag,
  Modal,
  message,
  Input,
  Upload,
  Popconfirm,
} from "antd";
const { TabPane } = Tabs;
import {
  useGetSingleInspectionDataQuery,
  useUpdateTechnicalInspectionItemGeneralMutation,
  useDeleteGeneralImageMutation,
} from "@/redux/api/technicianInspectionApi";
import {
  CameraOutlined,
  MessageOutlined,
  SaveOutlined,
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import tireImage from "@/assets/tireImage.png";
import type { UploadFile } from "antd/es/upload/interface";
import UpdateInspectionItemTirePage from "@/components/TechnicalInspectionComponent/TireEditComponent";
import PhotoUploadModal from "@/components/ui/PhotoUploadModal";
import { ImageViewerModal } from "@/components/ui/ImageViewerModal ";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────
interface InspectionItemGeneral {
  id: string;
  code: string;
  technicianId: string;
  inspectionItemCode: string;
  inspectionCode: string;
  name: string;
  customNote: string;
  type: string;
  estimateCode: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  problem?: { id: string; name: string; color: string; status?: boolean }[];
  solution?: { id: string; name: string; status?: boolean }[];
  map?: { id: string; name: string; status?: boolean }[];
  ItemGeneralImage?: { id: string; name: string; imageUrl: string }[];
}

interface InspectionItemTire {
  id: string;
  name: string;
  inspectionItemCode: string;
  inspectionCode: string;
  type: string;
  inspectionItemTire: {
    code: string;
    name: string;
    customNote: string;
    psiBefore: string;
    dot: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
}

// ─────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────
const STATUS: Record<string, { hex: string; label: string }> = {
  GREEN: { hex: "#22c55e", label: "OK" },
  ORANGE: { hex: "#f97316", label: "Monitor" },
  RED: { hex: "#ef4444", label: "Urgent" },
};

// ─────────────────────────────────────────────
// Status Dots — identical to create page
// ─────────────────────────────────────────────
const StatusDots = ({ value }: { value?: string }) => (
  <div className="flex items-center gap-1 shrink-0">
    {Object.entries(STATUS).map(([key, { hex, label }]) => (
      <span
        key={key}
        title={label}
        style={{
          width: 20,
          height: 20,
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
// General Row — same layout as create, pre-filled
// ─────────────────────────────────────────────
const UpdateGeneralRow = ({
  item,
  refetch,
}: {
  item: InspectionItemGeneral;
  refetch: () => void;
}) => {
  const gen = item
  const name = gen?.name ?? item.name ?? "—";

  const [form] = Form.useForm();
  const selectedColor = Form.useWatch("color", form);

  const [noteOpen, setNoteOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [updateInspectionItemGeneral] = useUpdateTechnicalInspectionItemGeneralMutation();
  const [deleteGeneralImage] = useDeleteGeneralImageMutation();

  // ── Pre-fill on mount ──
  useEffect(() => {
    form.setFieldsValue({
      color: item?.color,
      problem: item?.problem?.filter((p) => p.status).map((p) => p.id) ?? [],
      solution: item?.solution?.filter((s) => s.status).map((s) => s.name) ?? [],
      map: item?.map?.filter((m) => m.status).map((m) => m.name) ?? [],
      customNote: item?.customNote ?? "",
    });
  }, []);

  // ── Color auto-select from problem ──
  const handleProblemChange = (values: string[]) => {
    if (!values.length) { form.setFieldValue("color", "GREEN"); return; }
    const last = values[values.length - 1];
    const found = item?.problem?.find((p) => p.id === last);
    const c = found?.color?.toUpperCase();
    form.setFieldValue("color", c === "RED" ? "RED" : c === "ORANGE" ? "ORANGE" : "GREEN");
  };

  // ── Submit ──
  const handleSubmit = async (values: any) => {
    const problem = item?.problem?.length
      ? item.problem.map((p) => ({
        id: p.id,
        name: p.name, color: p.color,
        status: Array.isArray(values.problem) && values.problem.includes(p.id),
      }))
      : undefined;

    const map = item?.map?.length
      ? item.map.map((m) => ({
        id: m.id,
        name: m.name,
        status: Array.isArray(values.map) && values.map.includes(m.name),
      }))
      : undefined;

    const solution = item?.solution?.map((s) => ({
      id: s.id,
      name: s.name,
      status: Array.isArray(values.solution) && values.solution.includes(s.name),
    }));

    try {
      const payload = {
        id: item.id,
        ...values,
        problem,
        map,
        solution,
        estimateCode: item.estimateCode,
        inspectionCode: item.inspectionCode,
        inspectionGenralItemCode: item.inspectionItemCode,
        customNote: form.getFieldValue("customNote"),
        name,
      }
      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      files.forEach((file) => formData.append("tireImages", file));
      await updateInspectionItemGeneral({
        id: item.id,
        formData,
      }).unwrap();
      refetch();
      setFileList([]);
      setFiles([]);
      message.success("Updated!");
    } catch {
      message.error("Failed to update.");
    }
  };

  const handleFiles = (fileList: any) => {
    setFiles(fileList);
  };
  const [viewerOpen, setViewerOpen] = useState(false);

  const handleCameraClick = () => {
    setViewerOpen(true);
  };

  const handleAddMore = () => {
    setViewerOpen(false);
    setCameraOpen(true);
  };
  const handleDeleteExisting = async (id: string) => {
    try {
      const res = await deleteGeneralImage(id).unwrap();
      message.success("Deleted!");
      refetch();
    } catch {
      message.error("Failed to delete.");
    }

  }

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{ color: "GREEN" }}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1.5 shadow-sm"
    >
      {/* Desktop: single row | Mobile: stacked — identical structure to create */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">

        {/* 1. Dots + Name */}
        <div className="flex items-center gap-2 sm:w-1/4 shrink-0 min-w-0">
          <Form.Item name="color" noStyle>
            <StatusDots value={selectedColor} />
          </Form.Item>
          <span
            className="text-[15px] font-semibold text-gray-800 truncate leading-tight"
            title={item.name}
          >
            {item.name}
          </span>
        </div>

        {/* 2. Selects */}
        <div className="flex flex-col sm:flex-row flex-1 gap-3 sm:w-1/4">
          <Form.Item name="problem" noStyle>
            <Select
              mode="multiple"
              placeholder="Problem"
              size="small"
              onChange={handleProblemChange}
              maxTagCount="responsive"
              className="!w-full sm:flex-1"
            >
              {item?.problem?.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  <Tag color={p.color?.toLowerCase()} style={{ margin: 0, fontSize: 11 }}>
                    {p.name}
                  </Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="solution" noStyle>
            <Select
              mode="multiple"
              placeholder="Solution"
              size="small"
              maxTagCount="responsive"
              className="!w-full sm:flex-1"
            >
              {item?.solution?.map((s) => (
                <Select.Option key={s.id} value={s.name}>{s.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="map" noStyle>
            <Select
              mode="multiple"
              placeholder="Map"
              size="small"
              maxTagCount="responsive"
              className="!w-full sm:flex-1"
            >
              {item?.map?.map((m) => (
                <Select.Option key={m.id} value={m.name}>{m.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* 3. Actions — identical to create */}
        <div className="flex items-center gap-1.5 shrink-0 sm:w-1/5 justify-end">
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
            existingImages={gen?.ItemGeneralImage || []}      // from API
            onAddMore={handleAddMore}
            onDeleteExisting={(id) => handleDeleteExisting(id)}
          />
          <PhotoUploadModal
            open={cameraOpen}
            onClose={() => setCameraOpen(false)}
            onFilesChange={handleFiles}
          />
          <Button
            size="small"
            icon={<MessageOutlined />}
            onClick={() => setNoteOpen(true)}
            className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${item?.customNote ? "!bg-blue-50 !text-blue-500" : "!bg-gray-100"
              }`}
          />
          <Button
            type="primary"
            size="small"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="!h-7 !px-2.5 !flex items-center gap-1 !rounded-md"
          />
        </div>
      </div>

      {/* Note modal */}
      <Modal
        title="Edit Note"
        open={noteOpen}
        onOk={() => setNoteOpen(false)}
        onCancel={() => setNoteOpen(false)}
        destroyOnClose
        width={340}
      >
        <Form.Item name="customNote" style={{ margin: 0 }}>
          <Input.TextArea rows={3} placeholder="Enter note…" />
        </Form.Item>
      </Modal>
    </Form>
  );
};

// ─────────────────────────────────────────────
// Tire Row — identical to create page tire row
// ─────────────────────────────────────────────
const UpdateTireRow = ({
  item,
  refetch,
}: {
  item: InspectionItemTire;
  refetch: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const name = item?.inspectionItemTire?.name ?? item?.name ?? "Tire Item";

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1.5 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer text-left"
      >
        <Image
          src={tireImage}
          width={36}
          height={22}
          alt="tire"
          className="rounded shrink-0 object-cover"
        />
        <span className="text-[15px] font-semibold text-gray-800 flex-1 truncate">
          {name}
        </span>
        {open
          ? <UpOutlined className="text-gray-400 text-[11px] shrink-0" />
          : <DownOutlined className="text-gray-400 text-[11px] shrink-0" />
        }
      </button>

      {open && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <UpdateInspectionItemTirePage
            key={item.id}
            id={item.id}
            item={item}
            refetch={refetch}
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Page — same tabs/layout as create page
// ─────────────────────────────────────────────
const Page = () => {
  const params = useParams();
  const inspectionCode = params.inspectionCode as string;
  const estimateCode = params.estimateCode as string;
  const { data, isLoading, refetch } = useGetSingleInspectionDataQuery(
    {
      inspectionCode: inspectionCode,
      estimateCode: estimateCode
    },
    { refetchOnMountOrArgChange: true }
  );
  const generalItems: InspectionItemGeneral[] = data?.General ?? [];
  const tireItems: InspectionItemTire[] = data?.Tire ?? [];
  const all = [...tireItems, ...generalItems];
  const renderItems = (items: (InspectionItemGeneral | InspectionItemTire)[]) => (
    <div className="w-full">
      {items.map((item: any) =>
        item.type === "General" ? (
          <UpdateGeneralRow key={item.id} item={item} refetch={refetch} />
        ) : (
          <UpdateTireRow key={item.id} item={item} refetch={refetch} />
        )
      )}
    </div>
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-3 py-3">
      <Tabs
        defaultActiveKey="all"
        type="card"
        size="small"
        className="[&_.ant-tabs-nav]:!mb-2"
      >
        <TabPane tab={`All (${all.length})`} key="all">
          {renderItems(all)}
        </TabPane>
        <TabPane tab={`General (${generalItems.length})`} key="general">
          {renderItems(generalItems)}
        </TabPane>
        <TabPane tab={`Tire (${tireItems.length})`} key="tire">
          {renderItems(tireItems)}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Page;