// PhotoUploadModal.tsx
import { useRef, useState, useCallback, useEffect } from "react";
import { Modal } from "antd";
import {
    CameraOutlined, UploadOutlined, PlusOutlined,
    CheckOutlined, CloseOutlined, ReloadOutlined,
    StopOutlined,
} from "@ant-design/icons";

const MAX_PHOTOS = 10;

type Photo = {
    id: string;
    file: File;
    preview: string;
};
type Tab = "camera" | "upload";

type Props = {
    open: boolean;
    onClose: () => void;
    onFilesChange?: (files: FileList | File[]) => void;
};

function uid() { return Math.random().toString(36).slice(2); }

export default function PhotoUploadModal({ open, onClose, onFilesChange }: Props) {
    const [tab, setTab] = useState<Tab>("camera");
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [camState, setCamState] = useState<"idle" | "loading" | "active" | "error">("idle");
    const [camError, setCamError] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setCamState("idle");
    }, []);

    const reset = useCallback(() => {
        stopCamera();
        setPhotos([]);
        setCamError("");
        setTab("camera");
    }, [stopCamera]);

    const handleClose = () => { reset(); onClose(); };

    useEffect(() => {
        if (!open) stopCamera();
        return () => stopCamera();
    }, [open, stopCamera]);

    const startCamera = async (facing: "user" | "environment" = facingMode) => {
        setCamError("");
        setCamState("loading");
        try {
            streamRef.current?.getTracks().forEach(t => t.stop());
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
            });
            streamRef.current = stream;
            setCamState("active");
            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            }, 0);
        } catch (err: any) {
            setCamState("error");
            setCamError(
                err.name === "NotAllowedError" ? "Camera permission denied. Please allow access and try again." :
                    err.name === "NotFoundError" ? "No camera found on this device." :
                        "Unable to open camera. Use the Upload tab instead."
            );
        }
    };

    const flipCamera = () => {
        const next = facingMode === "user" ? "environment" : "user";
        setFacingMode(next);
        startCamera(next);
    };

    const snap = () => {
        if (photos.length >= MAX_PHOTOS || !videoRef.current || !canvasRef.current) return;

        const v = videoRef.current;
        const c = canvasRef.current;

        c.width = v.videoWidth;
        c.height = v.videoHeight;

        const ctx = c.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(v, 0, 0);

        // ✅ Convert to Blob → File
        c.toBlob((blob) => {
            if (!blob) return;

            const file = new File([blob], `general`, {
                type: "image/jpeg",
            });
            // ✅ store file instead of dataUrl
            setPhotos(prev => {
                const next = [...prev, { id: uid(), file, preview: URL.createObjectURL(file) }];
                if (next.length >= MAX_PHOTOS) stopCamera();
                return next;
            });

        }, "image/jpeg", 0.92);
    };

    const addFromFiles = (fileList: FileList | File[]) => {
        const arr = Array.from(fileList)
            .filter(f => f.type.startsWith("image/"))
            .slice(0, MAX_PHOTOS - photos.length);

        const newPhotos = arr.map(file => ({
            id: uid(),
            file,
            preview: URL.createObjectURL(file),
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    const removePhoto = (id: string) => setPhotos(prev => prev.filter(p => p.id !== id));

    const handleConfirm = () => {
        const files = photos.map((p, index) => {
            return new File(
                [p.file],
                `general`,
                { type: p.file.type }
            );
        });
        onFilesChange?.(files);
        handleClose();
    };

    const canSnap = camState === "active" && photos.length < MAX_PHOTOS;

    return (
        <Modal
            open={open}
            onCancel={handleClose}
            footer={null}
            closeIcon={null}
            width={500}
            centered
            styles={{
                content: {
                    padding: 0, borderRadius: 20, overflow: "hidden",
                    boxShadow: "0 32px 64px -12px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)"
                },
                mask: { backdropFilter: "blur(6px)", backgroundColor: "rgba(0,0,0,0.4)" },
            }}
        >
            <canvas ref={canvasRef} className="hidden" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[10px] bg-blue-50 flex items-center justify-center">
                        <CameraOutlined className="text-blue-600 text-sm" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900 leading-none">Add photos</p>
                        <p className="text-[11px] text-gray-400 mt-0.5 leading-none">
                            {photos.length > 0
                                ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} ready to upload`
                                : "Camera or upload — multiple supported"}
                        </p>
                    </div>
                </div>
                <button onClick={handleClose}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 border-0 cursor-pointer transition-all">
                    <CloseOutlined style={{ fontSize: 11, color: "#6b7280" }} />
                </button>
            </div>

            {/* ── Tabs ── */}
            <div className="flex border-b border-gray-100 px-[18px]">
                {(["camera", "upload"] as Tab[]).map(t => (
                    <button key={t}
                        onClick={() => { setTab(t); if (t === "upload") stopCamera(); }}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 -mb-px transition-all cursor-pointer bg-transparent border-l-0 border-r-0 border-t-0
              ${tab === t ? "border-blue-500 text-blue-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                        {t === "camera" ? <CameraOutlined /> : <UploadOutlined />}
                        {t === "camera" ? "Camera" : "Upload files"}
                    </button>
                ))}
            </div>

            <div className="p-[18px] space-y-4">

                {/* ── Camera Tab ── */}
                {tab === "camera" && (
                    <div>
                        {/* Error */}
                        {camError && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5 text-xs text-red-700 mb-3">
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                {camError}
                            </div>
                        )}

                        {/* Idle state */}
                        {camState === "idle" && !camError && (
                            <div className="text-center py-8">
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3.5">
                                    <CameraOutlined className="text-2xl text-gray-300" />
                                </div>
                                <p className="text-sm font-medium text-gray-700 mb-1">Use your camera</p>
                                <p className="text-xs text-gray-400 mb-4">Take multiple photos one by one</p>
                                <button onClick={() => startCamera()}
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium border-0 cursor-pointer transition-all">
                                    Open camera
                                </button>
                            </div>
                        )}

                        {/* Error idle */}
                        {camState === "error" && (
                            <div className="text-center py-6">
                                <button onClick={() => startCamera()}
                                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer bg-white">
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Camera active / loading */}
                        {(camState === "loading" || camState === "active") && (
                            <>
                                <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: "16/10" }}>
                                    {camState === "loading" && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                                    {/* Viewfinder corners */}
                                    {camState === "active" && (
                                        <div className="absolute inset-0 pointer-events-none">
                                            {["top-3 left-3 border-t-2 border-l-2 rounded-tl-md",
                                                "top-3 right-3 border-t-2 border-r-2 rounded-tr-md",
                                                "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md",
                                                "bottom-3 right-3 border-b-2 border-r-2 rounded-br-md",
                                            ].map((cls, i) => (
                                                <div key={i} className={`absolute w-5 h-5 border-white/70 ${cls}`} />
                                            ))}
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm">
                                                {photos.length}/{MAX_PHOTOS} captured
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Camera controls */}
                                <div className="flex items-center justify-between mt-3.5">
                                    <button onClick={flipCamera}
                                        className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-all">
                                        <ReloadOutlined style={{ fontSize: 15, color: "#6b7280" }} />
                                    </button>

                                    {/* Shutter */}
                                    <button onClick={snap} disabled={!canSnap}
                                        className="w-16 h-16 rounded-full border-[3px] border-blue-400 bg-white hover:border-blue-600 flex items-center justify-center cursor-pointer transition-all active:scale-90 disabled:opacity-40">
                                        <span className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 block transition-colors" />
                                    </button>

                                    <button onClick={() => stopCamera()}
                                        className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 hover:bg-red-50 hover:border-red-100 flex items-center justify-center cursor-pointer transition-all group">
                                        <StopOutlined style={{ fontSize: 14, color: "#6b7280" }} className="group-hover:!text-red-400" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── Upload Tab ── */}
                {tab === "upload" && (
                    <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={e => { e.preventDefault(); setIsDragging(false); addFromFiles(e.dataTransfer.files); }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed py-10 cursor-pointer transition-all
              ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"}`}
                    >
                        <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center">
                            <UploadOutlined className={`text-base ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-700">Drop photos here</p>
                            <p className="text-xs text-gray-400 mt-0.5">or <span className="text-blue-500 font-medium">browse files</span></p>
                        </div>
                        <p className="text-[11px] text-gray-300">PNG, JPG, WEBP — up to 10 MB each</p>
                    </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => { if (e.target.files) addFromFiles(e.target.files); e.target.value = ""; }} />

                {/* ── Photo strip ── */}
                {photos.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">
                                <span className="font-medium text-gray-700">{photos.length}</span> of {MAX_PHOTOS} photos
                            </span>
                            <button onClick={() => setPhotos([])}
                                className="text-[11px] text-gray-400 hover:text-red-400 bg-transparent border-0 cursor-pointer transition-colors p-0">
                                Clear all
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {photos.map((p, i) => (
                                <div key={p.id} className="relative w-[72px] h-[72px] rounded-xl overflow-hidden border border-gray-100 group">
                                    <img src={p.preview} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                                    <button onClick={() => removePhoto(p.id)}
                                        className="absolute top-1 right-1 w-[18px] h-[18px] rounded-[5px] bg-black/60 hover:bg-black/80 border-0 cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <CloseOutlined style={{ fontSize: 8, color: "white" }} />
                                    </button>
                                    <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[9px] px-1 py-0.5 rounded-sm leading-none">{i + 1}</span>
                                </div>
                            ))}

                            {/* Add more tile */}
                            {photos.length < MAX_PHOTOS && (
                                <button
                                    onClick={() => tab === "camera" ? startCamera() : fileInputRef.current?.click()}
                                    className="w-[72px] h-[72px] rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 bg-gray-50 hover:bg-blue-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all group">
                                    <PlusOutlined className="text-gray-300 group-hover:text-blue-400 text-sm transition-colors" />
                                    <span className="text-[10px] text-gray-300 group-hover:text-blue-400 transition-colors">Add more</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between px-[18px] py-3.5 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                    {photos.length === 0 ? "No photos yet" : `${photos.length} photo${photos.length !== 1 ? "s" : ""} selected`}
                </span>
                <div className="flex gap-2 items-center">
                    <button onClick={handleClose}
                        className="px-4 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 cursor-pointer bg-white transition-all">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} disabled={photos.length === 0}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white text-xs font-medium border-0 cursor-pointer transition-all active:scale-95">
                        <CheckOutlined style={{ fontSize: 11 }} />
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
}