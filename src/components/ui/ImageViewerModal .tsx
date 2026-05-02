import { useState } from "react";
import { Modal } from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    LeftOutlined,
    RightOutlined,
    PictureOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import Image from "next/image";

interface ImageItem {
    id: string;
    imageUrl: string;
    itemId?: string;
    name: string;
}

interface ImageViewerModalProps {
    open: boolean;
    onClose: () => void;
    existingImages: ImageItem[];
    onAddMore: () => void;
    onDeleteExisting?: (id: string) => void;
}

export const ImageViewerModal = ({
    open,
    onClose,
    existingImages,
    onAddMore,
    onDeleteExisting,
}: ImageViewerModalProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const total = existingImages.length;
    const activeImage = existingImages[activeIndex];

    const handleDelete = () => {
        if (!deleteConfirm) { setDeleteConfirm(true); return; }
        if (onDeleteExisting && activeImage) {
            onDeleteExisting(activeImage.id);
            setActiveIndex((i) => Math.max(0, i - 1));
        }
        setDeleteConfirm(false);
    };

    const go = (dir: 1 | -1) => {
        setActiveIndex((i) => (i + dir + total) % total);
        setDeleteConfirm(false);
    };

    return (
        <>
            <style>{`
                .ivm .ant-modal-content {
                    padding: 0 !important;
                    border-radius: 12px !important;
                    overflow: hidden;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.14) !important;
                }
                .ivm .ant-modal-header {
                    margin: 0 !important;
                    padding: 11px 14px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                    background: #fff !important;
                }
                .ivm .ant-modal-title {
                    font-size: 13px !important;
                    font-weight: 600 !important;
                    color: #0f172a !important;
                }
                .ivm .ant-modal-close {
                    top: 8px !important;
                    right: 10px !important;
                    color: #94a3b8 !important;
                }
                .ivm .ant-modal-body { padding: 0 !important; }
                .ivm-thumbs::-webkit-scrollbar { display: none; }
                .ivm-thumbs { scrollbar-width: none; }
            `}</style>

            <Modal
                open={open}
                onCancel={onClose}
                footer={null}
                centered
                width={500}
                className="ivm"
                title={
                    <div className="flex items-center gap-1.5">
                        <PictureOutlined style={{ color: "#3b82f6", fontSize: 12 }} />
                        <span className="text-slate-800 text-[13px] font-semibold">Photos</span>
                        {total > 0 && (
                            <span className="text-[11px] font-normal text-slate-400">({total})</span>
                        )}
                    </div>
                }
            >
                {total === 0 ? (
                    /* ── Empty State ── */
                    <div className="flex flex-col items-center gap-3 py-9 px-5">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                            <PictureOutlined style={{ color: "#60a5fa", fontSize: 20 }} />
                        </div>
                        <div className="text-center">
                            <p className="text-[13px] font-semibold text-slate-700 mb-0.5">No photos yet</p>
                            <p className="text-[11px] text-slate-400">Upload photos to attach to this item</p>
                        </div>
                        <button
                            onClick={onAddMore}
                            className="flex items-center border-none outline-none cursor-pointer gap-1.5 px-4 py-1.5 bg-blue-600  text-white text-[12px] font-semibold rounded-lg transition-all"
                        >
                            <PlusOutlined style={{ fontSize: 11 }} />
                            Add Photo
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col">

                        {/* ── Main Image ── */}
                        <div className="relative bg-slate-900 h-52 flex items-center justify-center overflow-hidden">
                            <Image
                                height={400}
                                width={600}
                                key={activeImage?.imageUrl || "default"}
                                src={
                                    activeImage?.imageUrl
                                        ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${activeImage.imageUrl}`
                                        : "/placeholder.png" // fallback image
                                }
                                alt={activeImage?.name || "image"}
                                className="max-h-full max-w-full object-contain"
                            />

                            {/* Nav buttons */}
                            {total > 1 && (
                                <>
                                    <button
                                        onClick={() => go(-1)}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 shadow transition-all active:scale-95"
                                    >
                                        <LeftOutlined style={{ fontSize: 9 }} />
                                    </button>
                                    <button
                                        onClick={() => go(1)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-600 shadow transition-all active:scale-95"
                                    >
                                        <RightOutlined style={{ fontSize: 9 }} />
                                    </button>
                                </>
                            )}

                            {/* Overlays */}
                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px] font-semibold">
                                {activeIndex + 1}/{total}
                            </div>
                            {/* {activeImage?.name && (
                                <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/50 text-white text-[10px] max-w-[55%] truncate">
                                    {activeImage.name}
                                </div>
                            )} */}
                        </div>

                        {/* ── Bottom Panel ── */}
                        <div className="bg-white px-3 py-2.5 flex flex-col gap-2">

                            {/* Thumbnails */}
                            <div className="flex gap-1.5 overflow-x-auto ivm-thumbs">
                                {existingImages.map((img, i) => (
                                    <button
                                        key={img.id}
                                        onClick={() => { setActiveIndex(i); setDeleteConfirm(false); }}
                                        className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-all border-2 ${i === activeIndex
                                            ? "border-blue-500 opacity-100 shadow-sm"
                                            : "border-transparent opacity-55 hover:opacity-80"
                                            }`}
                                    >
                                        <Image
                                            height={400}
                                            width={600}
                                            key={img?.imageUrl || "default"}
                                            src={
                                                img?.imageUrl
                                                    ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${img.imageUrl}`
                                                    : "/default-profile.jpg" // fallback image
                                            }
                                            alt={img?.name || "image"}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </button>
                                ))}

                                <button
                                    onClick={onAddMore}
                                    className="flex-shrink-0 w-12 h-12 rounded-lg border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-blue-500 transition-all"
                                >
                                    <PlusOutlined style={{ fontSize: 12 }} />
                                    <span className="text-[9px] font-medium">Add</span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-slate-100" />

                            {/* Meta + Delete */}
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1 pr-2">
                                    <p className="text-[12px] font-semibold text-slate-800 truncate leading-tight">
                                        {activeImage?.name || "Untitled"}
                                    </p>
                                </div>

                                {onDeleteExisting && (
                                    deleteConfirm ? (
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setDeleteConfirm(false)}
                                                className="px-2 py-1 outline-none border-none cursor-pointer text-[12px] font-medium text-slate-500 hover:text-slate-700 rounded hover:bg-slate-100 transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                className="flex items-center gap-1 px-2.5 py-1 outline-none border-none cursor-pointer text-[12px] font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md transition-all active:scale-95"
                                            >
                                                <ExclamationCircleOutlined style={{ fontSize: 10 }} />
                                                Confirm
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleDelete}
                                            className="flex items-center gap-1 px-2 py-1 outline-none border-none cursor-pointer text-[12px] font-medium text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                        >
                                            <DeleteOutlined style={{ fontSize: 10 }} />
                                            Delete
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};