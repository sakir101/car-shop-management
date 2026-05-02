import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setImageUrl } from "@/redux/slice/imageSlice";
import {
  LoadingOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import Image from "next/image";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

type ImageUploadProps = {
  name: string;
};

const UploadImage = ({ name }: ImageUploadProps) => {
  const { imageUrl } = useAppSelector((state) => state.imageUrl);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const { setValue } = useFormContext();
  const [removeImage, setRemoveImage] = useState();

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setValue(name, info.file.originFileObj);
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        dispatch(setImageUrl(url));
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>{loading ? <p></p> : <p>Upload</p>}</div>
    </div>
  );

  const imageRemove = () => {
    dispatch(setImageUrl(""));
  };

  return (
    <>
      <Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/file"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <div className="flex justify-center items-start">
            {" "}
            <Image
              src={imageUrl}
              alt="avatar"
              style={{ width: "100%" }}
              width={100}
              height={100}
            />
            <CloseCircleOutlined
              className="cursor-pointer"
              onClick={imageRemove}
            />
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};

export default UploadImage;
