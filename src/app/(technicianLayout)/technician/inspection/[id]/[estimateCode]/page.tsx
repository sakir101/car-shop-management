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
} from "antd";
const { TabPane } = Tabs;
import {
  useCreateInspectionItemGeneralMutation,
  useGetUnassignItemInspectionForTechnicianQuery,
} from "@/redux/api/technicianInspectionApi";
import {
  CameraOutlined,
  MessageOutlined,
  SaveOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { getUserInfo } from "@/services/auth.service";
import Image from "next/image";
import tireImage from "@/assets/tireImage.png";
import InspectionItemTirePage from "@/components/TechnicalInspectionComponent/InspectionItemTirePage";
import PhotoUploadModal from "@/components/ui/PhotoUploadModal";
// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────
interface InspectionItemGeneral {
  id: string;
  inspectionItemCode: string;
  inspectionCode: string;
  type: string;
  InspectionItemGeneral: {
    code: string;
    name: string;
    customNote: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    problems?: { id: string; name: string; color: string }[];
    solutions?: { id: string; name: string }[];
    maps?: { id: string; name: string }[];
  };
}

interface InspectionItemTire {
  id: string;
  inspectionItemCode: string;
  inspectionCode: string;
  type: string;
  InspectionItemTire: {
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
// Status Dots (read-only, driven by form value)
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
// General Row
// ─────────────────────────────────────────────
const InspectionItemGeneralRow = ({
  item,
  estimateCode,
  inspectionCode,
  refetchInspectionGeneralItem,
}: {
  item: any;
  estimateCode: string;
  inspectionCode: string;
  refetchInspectionGeneralItem: () => void;
}) => {
  const [form] = Form.useForm();
  const selectedColor = Form.useWatch("color", form);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [createInspectionItemGeneral] = useCreateInspectionItemGeneralMutation();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const name = item?.InspectionItemGeneral?.name ?? "—";

  const handleProblemChange = (values: string[]) => {
    if (!values.length) { form.setFieldValue("color", "GREEN"); return; }
    const last = values[values.length - 1];
    const found = item?.InspectionItemGeneral?.problems?.find((p: any) => p.id === last);
    const c = found?.color?.toUpperCase();
    form.setFieldValue(
      "color",
      c === "RED" ? "RED" : c === "ORANGE" ? "ORANGE" : "GREEN"
    );
  };

  const handleSubmit = (values: any) => {
    if (!item?.id) { message.error("Item data not loaded."); return; }
    const { InspectionItemGeneral: gen } = item;

    const problem = gen.problems?.length
      ? gen.problems.map((p: any) => ({
        name: p.name,
        color: p.color,
        status: Array.isArray(values.problem) && values.problem.includes(p.id),
      }))
      : undefined;


    const map = gen.maps?.length
      ? gen.maps.map((m: any) => ({
        name: m.name,
        status: Array.isArray(values.map) && values.map.includes(m.name),
      }))
      : undefined;

    const solution = gen.solutions?.map((s: any) => ({
      name: s.name,
      status: Array.isArray(values.solution) && values.solution.includes(s.name),
    }));

    const { userId } = getUserInfo() as any;
    const payload = {
      ...values,
      problem,
      map,
      solution,
      estimateCode,
      inspectionCode,
      inspectionGenralItemCode: item.inspectionItemCode,
      technicianId: userId,
      customNote: noteValue,
      name,
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    files.forEach((file) => formData.append("tireImages", file));
    createInspectionItemGeneral(formData)
      .unwrap()
      .then(() => { message.success("Saved!"); refetchInspectionGeneralItem(); })
      .catch(() => message.error("Failed to save."));
  };
  const handleFiles = (fileList: any) => {
    setFiles(fileList);
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      initialValues={{ color: "GREEN" }}
      className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1.5 shadow-sm"
    >
      {/*
        Desktop (sm+): single row — [dots + name] [problem] [solution] [map] [actions]
        Mobile:        stacked  — name row, then selects, then actions
      */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">

        {/* ── 1. Dots + Name ── */}
        <div className="flex items-center gap-2 sm:w-1/4 shrink-0 min-w-0">
          <Form.Item name="color" noStyle>
            <StatusDots value={selectedColor} />
          </Form.Item>
          <span
            className="text-[15px] font-semibold text-gray-800 truncate leading-tight"
            title={name}
          >
            {name}
          </span>
        </div>

        {/* ── 2. Selects ── */}
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
              {item?.InspectionItemGeneral?.problems?.map((p: any) => (
                <Select.Option key={p.id} value={p.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Tag
                      color={p.color?.toLowerCase()}
                      style={{
                        margin: 0,
                        fontSize: 11,
                        lineHeight: "16px",
                        padding: "0 6px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.name}
                    </Tag>
                  </div>
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
              {item?.InspectionItemGeneral?.solutions?.map((s: any) => (
                <Select.Option key={s.id} value={s.name}>
                  {s.name}
                </Select.Option>
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
              {item?.InspectionItemGeneral?.maps?.map((m: any) => (
                <Select.Option key={m.id} value={m.name}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        {/* ── 3. Actions ── */}
        <div className="flex items-center gap-1.5 shrink-0 sm:w-1/5 justify-end">
          <Button
            size="small"
            icon={<CameraOutlined />}
            className="!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !bg-gray-100 !border-none hover:!bg-gray-200"
            onClick={() => setPhotoModalOpen(true)}
          />
          <PhotoUploadModal
            open={photoModalOpen}
            onClose={() => setPhotoModalOpen(false)}
            onFilesChange={handleFiles}
          />
          <Button
            size="small"
            icon={<MessageOutlined />}
            onClick={() => setNoteOpen(true)}
            className={`!h-7 !w-7 !p-0 !flex items-center justify-center !rounded-md !border-none hover:!bg-gray-200 ${noteValue ? "!bg-blue-50 !text-blue-500" : "!bg-gray-100"
              }`}
          />
          <Button
            type="primary"
            size="small"
            htmlType="submit"
            icon={<SaveOutlined />}
            className="!h-7 !px-2.5 !flex items-center gap-1 !rounded-md"
          >

          </Button>
        </div>
      </div>


      {/* Note modal */}
      <Modal
        title="Add Note"
        open={noteOpen}
        onOk={() => {
          setNoteValue(form.getFieldValue("customNote") ?? "");
          setNoteOpen(false);
        }}
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
// Tire Row
// ─────────────────────────────────────────────
const InspectionItemTireRow = ({
  item,
  estimateCode,
  inspectionCode,
  refetchInspectionGeneralItem,
}: {
  item: any;
  estimateCode: string;
  inspectionCode: string;
  refetchInspectionGeneralItem: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const name = item?.InspectionItemTire?.name ?? "Tire Item";

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-1.5 shadow-sm">
      {/* Single-line toggle header */}
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

      {/* Expanded tire form */}
      {open && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <InspectionItemTirePage
            key={item.id}
            InspectionItemTire={item.InspectionItemTire}
            estimateCode={estimateCode}
            inspectionCode={inspectionCode}
            refetchInspectionGeneralItem={refetchInspectionGeneralItem}
          />
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
const InspectionItemsPage = () => {
  const [generalItems, setGeneralItems] = useState<InspectionItemGeneral[]>([]);
  const [tireItems, setTireItems] = useState<InspectionItemTire[]>([]);
  const params = useParams();
  const inspectionCode = params.id as string;
  const estimateCode = params.estimateCode as string;

  const { data, isLoading, refetch: refetchInspectionGeneralItem } =
    useGetUnassignItemInspectionForTechnicianQuery(
      { inspectionCode, estimateCode },
      { refetchOnMountOrArgChange: true }
    );

  useEffect(() => {
    if (data) {
      setGeneralItems(data?.generalInspection ?? []);
      setTireItems(data?.tireInspection ?? []);
    }
  }, [data]);

  const sharedProps = { estimateCode, inspectionCode, refetchInspectionGeneralItem };
  const all = [...tireItems, ...generalItems];

  const renderItems = (items: any[]) => (
    <div className="w-full">
      {items.map((item: any) =>
        item.type === "General" ? (
          <InspectionItemGeneralRow key={item.id} item={item} {...sharedProps} />
        ) : (
          <InspectionItemTireRow key={item.id} item={item} {...sharedProps} />
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

export default InspectionItemsPage;