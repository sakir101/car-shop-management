"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Form from "@/components/Forms/Form";
import FormInput from "@/components/Forms/FormInput";
import FormTextArea from "@/components/Forms/FormTextArea";
import { Avatar, Button, Checkbox, message, Modal, Select, Upload } from "antd";
import FormSelectField from "@/components/Forms/FormSelectField";
import {
  useCreateContractMutation,
  useUpdateSingleContactMutation,
} from "@/redux/api/createContractApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { contactSchema } from "@/schemas/contact";
import { getUserInfo } from "@/services/auth.service";
import { useAppDispatch } from "@/redux/hooks";
import { clearResetStatus, setResetStatus } from "@/redux/slice/resetForm";
import { BsSearch } from "react-icons/bs";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";
import TextArea from "antd/es/input/TextArea";
import { fetchMakes } from "../GetMake/GetMakes";
import { Option } from "antd/es/mentions";
import { fetchModels } from "../GetModel/GetModel";
import { fetchYears } from "../GetYears/GetYears";
import { number } from "yup";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";


interface Preferences {
  email: boolean;
  sms: boolean;
  call: boolean;
  no: boolean;
}
interface Preferences {
  email: boolean;
  sms: boolean;
  call: boolean;
  no: boolean;
}
interface VehicleInfo {
  numberPlate?: string;
  make?: string;
  model?: string;
  registrationNum?: string;
  vin?: string;
  color?: string;
  year?: string;
  mileage?: number;
  condition?: string;
}
interface ContactInfo {
  name: string;
  contactNum: string;
  address: string;
  email: string;
  role: string;
  customers: any;
  password: string;
  image: string;
  company: string;
  fileAs: string;
  ratePerHour: string;
  note: string;
  optionalContactNums?: string[];
  optionalEmails?: string[];
}

interface ContactInfoFormProps {
  handleEditClick?: (index: number) => void;
  handleSaveClick?: (index: number) => void;
  handleInputField?: () => void;
  handleCancelClick?: () => void;
  handleToggle?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setVehicleInfoArr?: React.Dispatch<
    React.SetStateAction<Partial<VehicleInfo>[]>
  >;
  setPreferences?: React.Dispatch<React.SetStateAction<Preferences>>;
  setEditingIndex?: React.Dispatch<React.SetStateAction<number | null>>;
  setEditedVehicleInfo?: React.Dispatch<
    React.SetStateAction<VehicleInfo | null>
  >;
  editingIndex?: number | null;
  vehicleInfoArr?: Partial<VehicleInfo>[];
  preferences?: Preferences;
  vehicleInfo?: Partial<VehicleInfo>;
  editedVehicleInfo?: VehicleInfo | null;
  pageTitle: string;
  data?: any;
}

interface VehicleInfo {
  numberPlate?: string;
  make?: string;
  model?: string;
  registrationNum?: string;
  vin?: string;
  color?: string;
  id?: string;
}

interface TaxInfo {
  taxId?: string;
  taxName: string;
  exemptionNumber: string;
  percentage: string;
  taxNote: string;
}

interface DiscountInfo {
  laborDiscountId?: string;
  materialDiscountId?: string;
  laborRate: string;
  laborDiscount: string;
  inventoryRate: string;
  materialDiscount: string;
}

const Contact: React.FC<ContactInfoFormProps> = ({ pageTitle, data }) => {
  const { role } = getUserInfo() as any;
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const router = useRouter();
  const pathname = usePathname();
  const isSubmitting = useRef(false);
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [vehicleInfoArr, setVehicleInfoArr] = useState<Partial<VehicleInfo>[]>(
    []
  );
  const [vinNum, setVinNum] = useState("");
  const dispatch = useAppDispatch();

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [isTaxExempted, setIsTaxExempted] = useState(false);
  const [isDiscountAdded, setIsDiscountAdded] = useState(false);
  const [taxForm, setTaxForm] = useState<Partial<TaxInfo>>({});

  // Discount Form state
  const [discountForm, setDiscountForm] = useState<Partial<DiscountInfo>>({});

  useEffect(() => {

    if (data) {
      setContactInfo({
        name: data.name || "",
        email: data.email || "",
        contactNum: data.contactNum || "",
        optionalContactNums: data.optionalContactNum || [],
        optionalEmails: data.optionalEmail || [],
        address: data.address || "",
        role: data.role,
        image: data.profileImage,
        company: data.companyName || "",
        fileAs: data.fileAS || "",
        note: data.note || "",
        customers: {
          preferredCommunicationType: data?.preferredCommunicationType,
        },
        password: data?.password,
        ratePerHour: data.ratePerHour || "",
      });
      setVehicleInfoArr([...data?.vehicles]);

      if (data?.TaxExemption) {
        setTaxForm({
          taxId: data?.TaxExemption?.id || "",
          taxName: data?.TaxExemption?.taxName || "",
          exemptionNumber: data?.TaxExemption?.exemptionNumber || "",
          percentage: data?.TaxExemption?.percentage || "",
          taxNote: data?.TaxExemption?.taxNote || "",
        });
        setIsTaxExempted(true);
      }

      if (data?.LabourDiscount || data?.MaterialDiscount) {
        setDiscountForm({
          laborDiscountId: data?.LabourDiscount?.id || "",
          materialDiscountId: data?.MaterialDiscount?.id || "",
          laborRate: data?.LabourDiscount?.labourRate || "",
          laborDiscount: data?.LabourDiscount?.labourDiscount || "",
          inventoryRate: data?.MaterialDiscount?.inventorySellRate || "",
          materialDiscount: data?.MaterialDiscount?.materialDiscount || "",
        });
        setIsDiscountAdded(true);
      }
    }
  }, [data]);

  useEffect(() => {
    if (name) {
      setContactInfo?.((prev: any) => ({
        ...prev,
        name: name || "",
      }));
    }
  }, [name]);

  const [updateSingleContact, { isSuccess, isError: err, isLoading, reset }] =
    useUpdateSingleContactMutation();
  const [createContract] = useCreateContractMutation();

  const [contactFields, setContactFields] = useState(["phone"]);


  const handleAddContactField = () => {
    const newField = `phone-${contactFields.length}`;
    setContactFields([...contactFields, newField]);
  };
  const [emailFields, setEmailFields] = useState(["email"]);


  const handleAddEmailField = () => {
    const newField = `email-${emailFields.length}`;
    setEmailFields([...emailFields, newField]);
  };
  const [preferences, setPreferences] = useState<Preferences>({
    email: false,
    sms: false,
    call: false,
    no: true,
  });
  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    if (pageTitle === "Contact") {
      setContactInfo((prev) => ({
        ...prev,
        customers: {
          ...prev?.customers,
          preferredCommunicationType: name,
        },
      }));
    } else if (pageTitle === "Create Contact") {
      setPreferences({
        email: name === "email",
        sms: name === "sms",
        call: name === "call",
        no: name === "no",
      });
    }
  };

  const handleTaxChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setTaxForm({ ...taxForm, [name]: value });
  };

  const handleDiscountChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setDiscountForm({ ...discountForm, [name]: value });
  };
  useEffect(() => {
    if (!isDiscountAdded) {
      setDiscountForm({
        laborRate: "",
        laborDiscount: "",
        inventoryRate: "",
        materialDiscount: "",
      });
    }
  }, [isDiscountAdded]);
  useEffect(() => {
    if (!isTaxExempted) {
      setTaxForm({
        taxName: "",
        exemptionNumber: "",
        percentage: "",
        taxNote: "",
      });
    }
  }, [isTaxExempted]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedVehicleInfo, setEditedVehicleInfo] =
    useState<VehicleInfo | null>(null)
  const [vehicleInfo, setVehicleInfo] = useState<Partial<VehicleInfo>>({});
  const handleVinInfo = async () => {
    try {
      const res =
        await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vinNum}?format=json
`);
      const apiData = await res.json();
      const vehicleData = {
        numberPlate: apiData.Results[0]?.VehicleDescriptor,
        make: apiData.Results[0]?.Make,
        model: apiData.Results[0]?.Model,
        registrationNum: apiData.Results[0]?.VIN,
        vin: apiData.Results[0]?.VIN,
        color: apiData.Results[0]?.BodyClass,
        year: apiData.Results[0]?.ModelYear,
      };
      setVehicleInfo(vehicleData);
    } catch (err) {
      message.error("api response not found !");
    }
  };
  const handleInputField = () => {
    const { numberPlate, make, model, registrationNum, vin, year, color } =
      vehicleInfo;

    const updatedVehicleInfo: VehicleInfo = {
      ...vehicleInfo,
      mileage: 2,
      condition: "nice",
    };

    if (!numberPlate || !make || !model || !registrationNum || !vin || !color || !year) {
      return message.error("All vehicle field are required !");
    }
    setVehicleInfoArr((prev) => [...prev, updatedVehicleInfo]);
    setVehicleInfo({
      numberPlate: "",
      make: "",
      model: "",
      registrationNum: "",
      vin: "",
      color: "",
      year: ""
    });
    setVinNum("")
  };
  const handleCancelClick = () => {
    setEditingIndex(null);
    setEditedVehicleInfo(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleInfo((prev) => ({
      ...prev,
      [name]: value,
      vin: vinNum,
    }));
    setEditedVehicleInfo((prev) => prev && { ...prev, [name]: value });
  };
  const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedVehicleInfo((prev) => prev && { ...prev, [name]: value });
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditedVehicleInfo({
      numberPlate:
        vehicleInfoArr[index]?.numberPlate || data.vehicles[index]?.numberPlate,
      make: vehicleInfoArr[index]?.make || data.vehicles[index]?.make,
      model: vehicleInfoArr[index]?.model || data.vehicles[index]?.model,
      registrationNum:
        vehicleInfoArr[index]?.registrationNum ||
        data.vehicles[index]?.registrationNum,
      vin: vehicleInfoArr[index]?.vin || data.vehicles[index]?.vin,
      color: vehicleInfoArr[index]?.color || data.vehicles[index]?.color,
      year: vehicleInfoArr[index]?.year || data?.vehicles[index]?.year,
      mileage: vehicleInfoArr[index]?.mileage || data?.vehicles[index]?.mileage,
      condition: vehicleInfoArr[index]?.condition || data?.vehicles[index]?.condition,
    });
  };
  const handleSaveClick = (index: number) => {
    const id = vehicleInfoArr[index]?.id;

    if (editedVehicleInfo) {
      const updatedArray = [...vehicleInfoArr];
      updatedArray[index] = { ...editedVehicleInfo, id, };
      setVehicleInfoArr(updatedArray);
    }
    setEditingIndex(null);
  };

  const handleSubmitContract = async (value: any) => {
    if (isSubmitting.current) return; // ← block if already running
    isSubmitting.current = true;
    // optional Emails
    const emails = Object.keys(value)
      .filter((key) => key.startsWith("email-"))
      .map((key) => value[key])
      .filter(Boolean);

    // optional Phone
    const phones = Object.keys(value)
      .filter((key) => key.startsWith("phone-"))
      .map((key) => value[key])
      .filter(Boolean);
    if (pageTitle === "Contact") {
      const { preferredCommunicationType } = contactInfo.customers || {};

      const updatedPreferences = {
        call: false,
        sms: false,
        email: false,
        no: false,
        [preferredCommunicationType || "no"]: true,
      };

      if (
        (contactInfo?.role === "admin" ||
          contactInfo?.role === "storeManager" ||
          contactInfo?.role === "technician" ||
          contactInfo?.role === "serviceAdvisor") &&
        contactInfo?.password === ""
      ) {
        return message.error("Password is required for this role.");
      }
      if (
        (contactInfo?.role === "admin" ||
          contactInfo?.role === "storeManager" ||
          contactInfo?.role === "technician" ||
          contactInfo?.role === "serviceAdvisor") &&
        contactInfo?.email === ""
      ) {

        return message.error("Email is required for this role.");
      }

      if (
        updatedPreferences.email === false &&
        updatedPreferences.sms === false &&
        updatedPreferences.call === false &&
        updatedPreferences.no === false
      ) {
        return message.error(
          "Please select at least one communication preference."
        );
      }

      if (Array.isArray(vehicleInfoArr) && vehicleInfoArr.length > 0) {
        const allValid = vehicleInfoArr.every(
          (vehicle) =>
            vehicle.numberPlate?.trim() &&
            vehicle.make?.trim() &&
            vehicle.model?.trim() &&
            vehicle.registrationNum?.trim() &&
            vehicle.vin?.trim() &&
            vehicle.color?.trim()
        );

        if (!allValid) {
          return message.error(
            "All fields in each vehicle must be filled out."
          );
        }
      }

      // Early validation
      const { taxId, exemptionNumber, percentage, taxName, taxNote } = taxForm;
      const {
        laborDiscountId,
        materialDiscountId,
        inventoryRate,
        laborDiscount,
        laborRate,
        materialDiscount,
      } = discountForm;

      if (
        isTaxExempted &&
        (!exemptionNumber || !percentage || !taxName || !taxNote)
      ) {
        return message.error("Please fill all tax exemption fields.");
      }

      if (
        isDiscountAdded &&
        (!inventoryRate || !laborDiscount || !laborRate || !materialDiscount)
      ) {
        return message.error("Please fill all discount fields.");
      }

      // Build conditional nested fields
      const taxInfo = isTaxExempted
        ? { id: taxId || "", exemptionNumber, percentage, taxName, taxNote }
        : undefined;

      const discountInfoLabour = isDiscountAdded
        ? {
          id: laborDiscountId || "",
          labourRate: laborRate,
          labourDiscount: laborDiscount,
        }
        : undefined;

      const discountInfoParts = isDiscountAdded
        ? {
          id: materialDiscountId || "",
          inventorySellRate: inventoryRate,
          materialDiscount: materialDiscount,
        }
        : undefined;

      const primaryPhone = contactInfo?.contactNum?.trim() || "";
      const optionalPhones = [...(contactInfo.optionalContactNums ?? [])]
        .map((p) => p?.trim())
        .filter(Boolean);
      const allPhones = [primaryPhone, ...optionalPhones].filter(Boolean);

      const primaryEmail = contactInfo?.email?.trim();
      const optionalEmails = [...(contactInfo.optionalEmails ?? [])]
        .map((e) => e?.trim())
        .filter(Boolean);
      const allEmails = [primaryEmail, ...optionalEmails].filter(Boolean);

      // Check for duplicate phones
      const hasDuplicatePhones = new Set(allPhones).size !== allPhones.length;
      if (hasDuplicatePhones) {
        return message.error("Phone numbers must be unique.");
      }

      // Check for duplicate emails
      const hasDuplicateEmails = new Set(allEmails).size !== allEmails.length;
      if (hasDuplicateEmails) {
        return message.error("Email addresses must be unique.");
      }

      const updatedVaicalInfoArr = vehicleInfoArr.map((vehicle: any) => ({
        ...vehicle,
        year: parseInt(vehicle.year),
        mileage: 786,
        condition: "nice",
      }));


      // delete contactInfo.customers;
      const updatedContactInfo = {
        ...contactInfo,
        emails: (contactInfo?.optionalEmails ?? []).filter(Boolean),
        phones: (contactInfo?.optionalContactNums ?? []).filter(Boolean),
        companyName: contactInfo.company || "",
        password: contactInfo?.password || "",
      };

      delete updatedContactInfo.optionalEmails;
      delete updatedContactInfo.optionalContactNums;
      const payload = {
        ...updatedContactInfo,
        preferences: updatedPreferences,
        vehicleInfoArr: updatedVaicalInfoArr,
        taxInfo,
        discountInfoLabour,
        discountInfoParts,
      };
      const id = data?.id;
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      const file = fileList?.[0]?.originFileObj;



      if (file instanceof File) {
        formData.append("profileImage", file);
      } else {
        console.error("FILE MISSING");
      }


      const key = "loadingKey";
      message.loading({ content: "Loading...", key });

      try {
        await updateSingleContact({ id, data: formData })
          .unwrap()
          .then(() => {
            setFileList([])
            message.success("Contact Update successfully");
          });
      } catch (error: any) {

        let errorMessage = "Vehicle update failed!";

        // Check for Prisma unique constraint in the stack
        if (error?.data?.stack?.includes("Unique constraint failed")) {
          if (error.data.stack.includes("numberPlate")) {
            errorMessage = "This Number Plate already exists!";
          } else if (error.data.stack.includes("registrationNum")) {
            errorMessage = "This Registration Number already exists!";
          } else {
            errorMessage = "Unique constraint violated!";
          }
        }

        // Show the error with Ant Design
        message.error(errorMessage);
      }
      finally {
        isSubmitting.current = false;
      }
    } else {
      if (
        (value?.role === "admin" ||
          value?.role === "storeManager" ||
          value?.role === "technician" ||
          value?.role === "serviceAdvisor") &&
        !contactInfo?.name
      ) {
        return message.error(`Name is required!`);
      }
      if (
        (value?.role === "admin" ||
          value?.role === "storeManager" ||
          value?.role === "technician" ||
          value?.role === "serviceAdvisor") &&
        (!contactInfo?.password || contactInfo.password.length < 6)
      ) {
        return message.error("Password must be at least 6 characters!");
      }
      if (
        preferences.email === false &&
        preferences.sms === false &&
        preferences.call === false &&
        preferences.no === false
      ) {
        return message.error(
          "Please select at least one communication preference."
        );
      }

      const { exemptionNumber, percentage, taxName, taxNote } = taxForm;
      const { inventoryRate, laborDiscount, laborRate, materialDiscount } =
        discountForm;

      if (Array.isArray(vehicleInfoArr) && vehicleInfoArr.length > 0) {
        const allValid = vehicleInfoArr.every(
          (vehicle) =>
            vehicle.numberPlate?.trim() &&
            vehicle.make?.trim() &&
            vehicle.model?.trim() &&
            vehicle.registrationNum?.trim() &&
            vehicle.vin?.trim() &&
            vehicle.color?.trim()
        );

        if (!allValid) {
          return message.error(
            "All fields in each vehicle must be filled out."
          );
        }
      }

      // Early validation
      if (
        isTaxExempted &&
        (!exemptionNumber || !percentage || !taxName || !taxNote)
      ) {
        return message.error("Please fill all tax exemption fields.");
      }

      if (
        isDiscountAdded &&
        (!inventoryRate || !laborDiscount || !laborRate || !materialDiscount)
      ) {
        return message.error("Please fill all discount fields.");
      }

      // Build conditional nested fields
      const taxInfo = isTaxExempted
        ? { exemptionNumber, percentage, taxName, taxNote }
        : undefined;

      const discountInfoLabour = isDiscountAdded
        ? {
          labourRate: laborRate,
          labourDiscount: laborDiscount,
        }
        : undefined;

      const discountInfoParts = isDiscountAdded
        ? {
          inventorySellRate: inventoryRate,
          materialDiscount: materialDiscount,
        }
        : undefined;

      const primaryPhone = value.phone?.trim();
      const optionalPhones = [...phones]
        .map((p) => p?.trim())
        .filter(Boolean);
      const allPhones = [primaryPhone, ...optionalPhones].filter(Boolean);

      const primaryEmail = value.email?.trim();
      const optionalEmails = [...emails]
        .map((e) => e?.trim())
        .filter(Boolean);
      const allEmails = [primaryEmail, ...optionalEmails].filter(Boolean);

      // Check for duplicate phones
      const hasDuplicatePhones = new Set(allPhones).size !== allPhones.length;
      if (hasDuplicatePhones) {
        return message.error("Phone numbers must be unique.");
      }

      // Check for duplicate emails
      const hasDuplicateEmails = new Set(allEmails).size !== allEmails.length;
      if (hasDuplicateEmails) {
        return message.error("Email addresses must be unique.");
      }

      const updatedVaicalInfoArr = vehicleInfoArr.map((vehicle: any) => ({
        ...vehicle,
        year: parseInt(vehicle.year),
      }));

      const payload = {
        name: contactInfo.name || "",
        address: value.address || "",
        phone: value.phone || "",
        phones: [...phones].filter(Boolean),
        email: value.email || "",
        emails: [...emails].filter(Boolean),
        note: value.note || "",
        role: value.role || "customer",
        preferences,
        vehicleInfoArr: updatedVaicalInfoArr,
        taxInfo,
        discountInfoLabour,
        discountInfoParts,
        companyName: contactInfo.company || "",
        password: contactInfo.password || "",
        ratePerHour: contactInfo.ratePerHour || "",
      };
      const formData = new FormData();

      formData.append("data", JSON.stringify(payload));

      const file = fileList?.[0]?.originFileObj;


      if (file instanceof File) {
        formData.append("profileImage", file);
      } else {
        console.error("FILE MISSING");
      }



      try {
        const key = "loadingKey";
        message.loading({ content: "Loading...", key });

        await createContract(formData)
          .unwrap()
          .then(() => {
            message.success("Contract added successfully");
            router.replace(pathname);
            setContactInfo(prev => ({
              ...prev,
              role: "customer"
            }));
            setVehicleInfoArr([]);
            setFileList([]);
            setVinNum("")
            setIsTaxExempted(false)
            setIsDiscountAdded(false)
            setEmailFields(['email'])
            setContactFields(['phone'])
            dispatch(setResetStatus(true));
            setPreferences({
              email: false,
              sms: false,
              call: false,
              no: true,
            });
          }
          )
          .catch((err) => {

            if (err.data.message) {
              message.error(err?.data?.message);
            } else {
              message.error('Something went wrong !')
            }
            dispatch(clearResetStatus());
          })
          .finally(() => {

            message.destroy(key);
          });
      } catch (error: any) {

      }
      finally {
        isSubmitting.current = false;
      }
    }
  };
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || "Profile Preview");
  };

  const options = [
    {
      label: `${contactInfo.company}`,
      value: `${contactInfo.company}`,
    },
    {
      label: `${contactInfo.name}`,
      value: `${contactInfo.name}`,
    },
    {
      label: `${contactInfo.name}(${contactInfo.company})`,
      value: `${contactInfo.name}(${contactInfo.company})`,
    },
    {
      label: `${contactInfo.company}(${contactInfo.name})`,
      value: `${contactInfo.company}(${contactInfo.name})`,
    },
  ];


  // states 
  const [makes, setMakes] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [years, setYears] = useState<any>({});


  useEffect(() => {
    let isMounted = true;


    fetchMakes(isMounted, setMakes);

    return () => {
      isMounted = false;
    };
  }, []);


  // Load models when make changes
  useEffect(() => {
    if (!vehicleInfo?.make) return;
    let isMounted = true;
    // setModels([])
    // setYears({})
    // setVehicleInfo((prev) => ({
    //     ...prev,
    //     model: '',
    //     year: ''
    // }));

    fetchModels(vehicleInfo?.make, isMounted, setModels);
    return () => {
      isMounted = false;
    };
  }, [vehicleInfo.make]);


  // Load models when model changes
  useEffect(() => {
    if (!vehicleInfo?.model) return;
    let isMounted = true;
    // setYears({})
    // setVehicleInfo((prev) => ({
    //     ...prev,
    //     year: ''
    // }));

    fetchYears(vehicleInfo?.model, isMounted, setYears);
    return () => {
      isMounted = false;
    };
  }, [vehicleInfo.model]);


  const handleSelectChange = (field: string, value: any) => {
    setVehicleInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const imageUrl =
    data?.profileImage && data.profileImage !== ""
      ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.profileImage}`
      : "/default-profile.jpg";
  return (
    <div className=" mx-auto p-3 md:p-0 md:w-[80%]  ">
      <div className="create-title-submit ">
        <h2 className="w-[80%] mx-auto">{pageTitle === "Contact" ? "Update Contact" : "Create Contact"}</h2>
      </div>

      <Form
        submitHandler={handleSubmitContract}
        {...(pageTitle === "Create Contact"
          ? { resolver: yupResolver(contactSchema) }
          : {})}
        formKey="createContract"
        className="pt-16"
      >


        <div className="create-container">
          {pageTitle === "Contact" ? (
            <div className="flex gap-6 items-center my-2 w-fit">
              <div className="relative w-10 h-10">
                <Image
                  src={imageUrl}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-2 border-gray-200"
                  sizes="40px"
                />
              </div>

              <Upload
                listType="picture"
                maxCount={1}
                beforeUpload={() => false}
                onChange={({ fileList }) => {
                  setFileList(fileList);
                }}
                fileList={fileList}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} size="small">
                  Choose Image
                </Button>
              </Upload>
            </div>
          ) : (
            <div className="flex flex= sm:flex-row justify-start sm:justify-between items-center gap-3">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={({ fileList: newList }) => setFileList(newList.slice(-1))}
                beforeUpload={() => false}
                accept="image/*"

              >
                {fileList.length >= 1 ? null : (
                  <div className="flex flex-col items-center justify-center p-2">
                    <UploadOutlined className="text-lg text-gray-500" />
                    <span className="mt-1 text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </Upload>

              <Modal
                open={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <div className="relative w-full h-[400px] flex items-center justify-center">
                  <Image
                    src={previewImage}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </Modal>
            </div>
          )}

          <div className="space-y-2">
            {pageTitle === "Contact" ? (
              <div>
                <label className="text-sm">Name</label>
                <input
                  name="name"
                  value={contactInfo?.name || ""}
                  placeholder="Enter your name"
                  className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  onChange={(e) => {
                    if (contactInfo) {
                      setContactInfo?.({
                        ...contactInfo,
                        name: e.target.value || "",
                      });
                    }
                  }}
                />
              </div>
            ) : (
              <FormInput
                name="name"
                type="text"
                size="middle"
                label="Name"
                required={(contactInfo?.role === 'storeManager' || contactInfo?.role == 'supplier' || contactInfo?.role == 'serviceAdvisor' || contactInfo?.role === 'technician')}
                value={contactInfo?.name || name || ""}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    name: e.target.value,
                  })
                }
                className="mt-1"
                placeholder="Enter user name"
              ></FormInput>
            )}

            {pageTitle === "Create Contact" ? (
              <FormTextArea
                name="address"
                label="Address"
                placeholder="Write address"
                value={contactInfo?.address || ""}
                rows={3}
              ></FormTextArea>
            ) : (
              <div>
                <label className="text-sm">Address</label>
                <textarea
                  name="address"
                  value={contactInfo?.address || ""}
                  placeholder="Enter your address"
                  className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  rows={3}
                  onChange={(e) => {
                    if (contactInfo) {
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.value || "",
                      });
                    }
                  }}
                />
              </div>
            )}

            <div className="flex justify-between flex-col sm:flex-row sm:gap-6 items-center">
              <div className="w-full">
                <div>
                  {pageTitle === "Contact" ? (
                    <div>
                      <label className="text-sm">Contact Number</label>
                      <input
                        type="text"
                        name="contactNum"
                        className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                        value={contactInfo?.contactNum || ""}
                        placeholder="Enter phone number"
                        onChange={(e) => {
                          if (contactInfo) {
                            setContactInfo?.({
                              ...contactInfo,
                              contactNum: e.target.value || "",
                            });
                          }
                        }}
                        required
                      />
                      <div className="flex flex-col gap-1.5 mt-1.5">
                        {(contactInfo.optionalContactNums ?? []).map((phone, index) => (
                          <div key={index}>
                            <input
                              type="text"
                              name={`contactNum${index + 1}`}
                              className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                              value={phone || ""}
                              placeholder={`Enter phone number ${index + 1}`}
                              onChange={(e) => {
                                const updatedPhones = [...(contactInfo.optionalContactNums ?? [])];
                                updatedPhones[index] = e.target.value;

                                setContactInfo({
                                  ...contactInfo,
                                  optionalContactNums: updatedPhones,
                                });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      {contactFields.map((fieldName, index) => (
                        <div key={fieldName} className="flex items-center justify-center gap-1 mb-2">
                          <div className="w-full">
                            <FormInput
                              name={fieldName}
                              type="text"
                              size="middle"
                              placeholder="Enter phone number"
                              label={index === 0 ? "Contact Number" : `Contact Number ${index + 1}`}
                              required={index === 0}
                            />
                          </div>
                          <div>
                            {index === contactFields.length - 1 && (
                              <Button
                                size="middle"
                                onClick={handleAddContactField}
                                className="cursor-pointer px-2 py-2 mt-4 rounded-lg outline-none"
                              >
                                <PlusOutlined></PlusOutlined>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full">
                {pageTitle === "Contact" ? (
                  <div>
                    <label className="text-sm">Email</label>
                    <input
                      type="text"
                      name="email"
                      className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      value={contactInfo?.email || ""}
                      onChange={(e) => {
                        if (contactInfo) {
                          setContactInfo?.({
                            ...contactInfo,
                            email: e.target.value || "",
                          });
                        }
                      }}
                    />
                    <div className="flex flex-col gap-1.5 mt-1.5">
                      {(contactInfo.optionalEmails ?? []).map((email, index) => (
                        <div key={index} className="flex flex-col">
                          <input
                            type="text"
                            name={`email${index + 1}`}
                            className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                            value={email || ""}
                            placeholder={`Enter Email${index + 1}`}
                            onChange={(e) => {
                              const updatedEmails = [...(contactInfo.optionalEmails ?? [])];
                              updatedEmails[index] = e.target.value;

                              setContactInfo({
                                ...contactInfo,
                                optionalEmails: updatedEmails,
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    {emailFields.map((fieldName, index) => (
                      <div key={fieldName} className="flex items-center justify-center gap-1 mb-2">
                        <div className="w-full">
                          <FormInput
                            name={fieldName}
                            required={index == 0 && (contactInfo?.role === 'storeManager' || contactInfo?.role == 'supplier' || contactInfo?.role == 'serviceAdvisor' || contactInfo?.role === 'technician')}
                            type="email"
                            size="middle"
                            placeholder="Enter Email"
                            label={index === 0 ? "Email" : `Email ${index + 1}`}
                          />
                        </div>
                        <div>
                          {index === emailFields.length - 1 && (
                            <Button
                              size="middle"
                              onClick={handleAddEmailField}
                              className="cursor-pointer px-2 py-2 mt-4 rounded-lg outline-none"
                            >
                              <PlusOutlined></PlusOutlined>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              {pageTitle === "Contact" && (
                <div className="flex flex-col sm:flex-row sm:gap-6">
                  <div className="w-full">
                    <label htmlFor="file_as" className="block mb-1.5 text-sm">
                      Role
                    </label>
                    <Select
                      className="w-full border rounded-lg bg-white text-gray-700"
                      value={contactInfo?.role || ""}
                      options={[
                        { label: "Customer", value: "customer" },
                        { label: "Store Manager", value: "storeManager" },
                        { label: "Technician", value: "technician" },
                        { label: "Service Advisor", value: "serviceAdvisor" },
                        { label: "Supplier", value: "supplier" },
                      ]}
                      placeholder="Select roles"
                      size="middle"
                      onChange={(value) => {
                        setContactInfo({ ...contactInfo, role: value });
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <label className="text-sm">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      value={contactInfo?.company || ""}
                      onChange={(e) => {
                        if (contactInfo) {
                          setContactInfo?.({
                            ...contactInfo,
                            company: e.target.value || "",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="w-full mt-2">
                {pageTitle === "Contact" && (
                  <div>
                    <label htmlFor="file_as" className="block mb-1.5 text-sm">
                      File As
                    </label>
                    <Select
                      className="w-full border rounded-lg bg-white text-gray-700"
                      id="file_as"
                      value={contactInfo?.fileAs || options[0].value}
                      onChange={(value) => {
                        setContactInfo({ ...contactInfo, fileAs: value });
                      }}
                      options={options}
                    />
                  </div>
                )}
              </div>
            </div>

            {pageTitle === "Create Contact"
              ? role === "admin" && (
                <div className="flex justify-between items-center flex-col sm:flex-row sm:gap-6">
                  <div className="w-full">
                    <FormSelectField
                      name="role"
                      label="Role"
                      options={[
                        { label: "Customer", value: "customer" },
                        { label: "Store Manager", value: "storeManager" },
                        { label: "Technician", value: "technician" },
                        { label: "Service Advisor", value: "serviceAdvisor" },
                        { label: "Supplier", value: "supplier" },
                      ]}
                      defaultValue={"customer"}
                      size="middle"
                      handleChange={(value) => {
                        setContactInfo({ ...contactInfo, role: value });
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <FormInput
                      name="company"
                      type="text"
                      size="middle"
                      label="Company"
                      value={contactInfo?.company || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          company: e.target.value,
                        })
                      }
                      placeholder="Enter company name"
                    ></FormInput>
                  </div>
                </div>
              )
              : role === "admin" && (
                <div className="flex items-center gap-6">
                  {/* ... edit form fields ... */}
                </div>
              )}

            {pageTitle === "Create Contact" &&
              contactInfo.name &&
              contactInfo.company && (
                <div className="flex gap-6 bg-white">
                  <div className="w-full">
                    <FormSelectField
                      name="fileAs"
                      label="File as"
                      options={[
                        {
                          label: `${contactInfo.company}`,
                          value: `${contactInfo.company}`,
                        },
                        {
                          label: `${contactInfo.name}`,
                          value: `${contactInfo.name}`,
                        },
                        {
                          label: `${contactInfo.name}(${contactInfo.company})`,
                          value: `${contactInfo.name}(${contactInfo.company})`,
                        },
                        {
                          label: `${contactInfo.company}(${contactInfo.name})`,
                          value: `${contactInfo.company}(${contactInfo.name})`,
                        },
                      ]}
                      placeholder="Select how to file this contact"
                      size="middle"
                      handleChange={(value) => {
                        setContactInfo({ ...contactInfo, fileAs: value });
                      }}
                    />
                  </div>
                </div>
              )}

            {pageTitle === "Create Contact" &&
              (contactInfo.role === "serviceAdvisor" ||
                contactInfo.role === "storeManager" ||
                contactInfo.role === "technician" ||
                contactInfo.role === "admin") && (
                <div className="space-y-4">
                  <div className=" flex justify-center w-full items-center gap-10">
                    <FormInput
                      className="w-full"
                      name="password"
                      type="password"
                      size="middle"
                      label="Password"
                      required
                      value={contactInfo.password || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password or leave blank to auto-generate"
                    />
                    {
                      contactInfo.role === "technician" &&
                      <FormInput
                        className="w-full"
                        name="ratePerHour"
                        type="text"
                        size="middle"
                        label="RatePerHour"
                        required
                        value={contactInfo.ratePerHour || ""}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            ratePerHour: e.target.value,
                          })
                        }
                        placeholder="Enter RatePerHour"
                      />
                    }
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const chars =
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                        const autoPassword = Array(12)
                          .fill("")
                          .map(() =>
                            chars.charAt(
                              Math.floor(Math.random() * chars.length)
                            )
                          )
                          .join("");

                        setContactInfo({
                          ...contactInfo,
                          password: autoPassword,
                        });
                      }}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Generate Password
                    </button>

                    {contactInfo.password && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!contactInfo?.password) return;
                          try {
                            await navigator.clipboard.writeText(
                              contactInfo.password
                            );
                            message.success("Password copied to clipboard!");
                          } catch (err) {
                            message.error("Failed to copy password");
                            console.error("Failed to copy password: ", err);
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Copy to clipboard"
                        disabled={!contactInfo?.password}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            {pageTitle === "Contact" &&
              (contactInfo.role === "serviceAdvisor" ||
                contactInfo.role === "storeManager" ||
                contactInfo.role === "technician" ||
                contactInfo.role === "admin") && (
                <div className="space-y-4">
                  <div className=" flex justify-center w-full items-center gap-10">
                    <FormInput
                      className="w-full"
                      name="password"
                      type="password"
                      size="middle"
                      label="Password"
                      value={contactInfo.password}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          password: e.target.value,
                        })
                      }
                      placeholder="Enter password or leave blank to auto-generate"
                    />
                    {contactInfo?.role === "technician" &&
                      <FormInput
                        className="w-full"
                        name="ratePerHour"
                        type="text"
                        size="middle"
                        label="RatePerHour"
                        value={contactInfo.ratePerHour}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            ratePerHour: e.target.value,
                          })
                        }
                        placeholder="Enter RatePerHour"
                      />}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const chars =
                          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                        const autoPassword = Array(12)
                          .fill("")
                          .map(() =>
                            chars.charAt(
                              Math.floor(Math.random() * chars.length)
                            )
                          )
                          .join("");

                        setContactInfo({
                          ...contactInfo,
                          password: autoPassword,
                        });
                      }}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Generate Password
                    </button>

                    {contactInfo.password && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (!contactInfo?.password) return;
                          try {
                            await navigator.clipboard.writeText(
                              contactInfo.password
                            );
                            message.success("Password copied to clipboard!");
                          } catch (err) {
                            message.error("Failed to copy password");
                            console.error("Failed to copy password: ", err);
                          }
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Copy to clipboard"
                        disabled={!contactInfo?.password}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            {pageTitle === "Contact" && (
              <div className="flex items-start flex-col sm:flex-row justify-between gap-3">
                <div className="w-full sm:w-[40%]">
                  <p className="text-sm mb-1.5">Preferred Communication Type</p>
                  <div className="border-solid border-[1px] rounded border-gray-300 p-2">
                    {["email", "sms", "call", "no"].map((type) => (
                      <div key={type} className="form-control">
                        <label className="label cursor-pointer py-1">
                          <input
                            type="checkbox"
                            className={`toggle toggle-sm ${contactInfo?.customers?.preferredCommunicationType ===
                              type
                              ? "bg-blue-500 border-blue-500"
                              : ""
                              }`}
                            name={type.toLowerCase()}
                            checked={
                              contactInfo?.customers?.preferredCommunicationType ===
                              type
                            }
                            onChange={() =>
                              setContactInfo((prev) => ({
                                ...prev,
                                customers: {
                                  ...prev?.customers,
                                  preferredCommunicationType:
                                    prev?.customers?.preferredCommunicationType ===
                                      type
                                      ? ""
                                      : type,
                                },
                              }))
                            }
                          />
                          <span
                            className={`label-text text-sm ${contactInfo?.customers?.preferredCommunicationType ===
                              type
                              ? "text-blue-500 font-bold"
                              : "text-black"
                              }`}
                          >
                            {type.toUpperCase()}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full sm:w-[60%]">
                  <div>
                    <p className="text-sm mb-1.5">Note</p>
                    <TextArea
                      value={contactInfo?.note}
                      name="note"
                      rows={4}
                      onChange={(e) => {
                        if (contactInfo) {
                          setContactInfo?.({
                            ...contactInfo,
                            note: e.target.value || contactInfo?.note,
                          });
                        }
                      }}
                    ></TextArea>
                  </div>
                </div>
              </div>
            )}

            {pageTitle === "Create Contact" && (
              <div className="flex items-start flex-col sm:flex-row justify-between gap-3">
                <div className="w-full sm:w-[40%]">
                  <p className="text-sm mb-1.5">Preferred Communication Type</p>
                  <div className="p-2 bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md">
                    <div className="form-control">
                      <label className="label cursor-pointer py-1">
                        <input
                          type="checkbox"
                          className={`toggle toggle-sm ${preferences?.email ? "bg-green-500 border-green-500" : ""
                            }`}
                          name="email"
                          checked={preferences?.email}
                          onChange={handleToggle}
                        />
                        <span
                          className={`label-text text-sm ${preferences?.email
                            ? "text-green-500 font-bold"
                            : "text-black"
                            }`}
                        >
                          EMAIL
                        </span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer py-1">
                        <input
                          type="checkbox"
                          className={`toggle toggle-sm ${preferences?.sms ? "bg-green-500 border-green-500" : ""
                            }`}
                          name="sms"
                          checked={preferences?.sms}
                          onChange={handleToggle}
                        />
                        <span
                          className={`label-text text-sm ${preferences?.sms
                            ? "text-green-500 font-bold"
                            : "text-black"
                            }`}
                        >
                          SMS
                        </span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer py-1">
                        <input
                          type="checkbox"
                          className={`toggle toggle-sm ${preferences?.call ? "bg-green-500 border-green-500" : ""
                            }`}
                          name="call"
                          checked={preferences?.call}
                          onChange={handleToggle}
                        />
                        <span
                          className={`label-text text-sm ${preferences?.call
                            ? "text-green-500 font-bold"
                            : "text-black"
                            }`}
                        >
                          CALL
                        </span>
                      </label>
                    </div>
                    <div className="form-control">
                      <label className="label cursor-pointer py-1">
                        <input
                          type="checkbox"
                          className={`toggle toggle-sm ${preferences?.no ? "bg-green-500 border-green-500" : ""
                            }`}
                          name="no"
                          checked={preferences?.no}
                          onChange={handleToggle}
                        />
                        <span
                          className={`label-text text-sm ${preferences?.no ? "text-green-500 font-bold" : "text-black"
                            }`}
                        >
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-[60%]">
                  <FormTextArea name="note" rows={4} label="Note" />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Checkbox
                checked={isTaxExempted}
                onChange={() => setIsTaxExempted(!isTaxExempted)}
              >
                Tax Exemption
              </Checkbox>
              <Checkbox
                checked={isDiscountAdded}
                onChange={() => setIsDiscountAdded(!isDiscountAdded)}
              >
                ADD Discount
              </Checkbox>
            </div>
          </div>
        </div>
        <div>
          {/* Tax field */}
          {isTaxExempted && (
            <div
              className="mt-4 space-y-3 p-4 bg-white border border-solid border-gray-200 rounded"
            >
              <h1 className="font-semibold text-lg text-gray-800">
                Tax Exemption
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block mb-1 text-gray-600">Tax Name</label>
                  {pageTitle === "Contact" ? (
                    <input
                      name="taxName"
                      type="text"
                      defaultValue={taxForm?.taxName || ""}
                      onChange={handleTaxChange}
                      placeholder="Enter tax name"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  ) : (
                    <input
                      name="taxName"
                      value={taxForm.taxName}
                      onChange={handleTaxChange}
                      placeholder="Enter tax name"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
                <div className="col-span-2 sm:col-auto">
                  <label className="block mb-1 text-gray-600">
                    Exemption Number
                  </label>
                  {pageTitle === "Contact" ? (
                    <input
                      name="exemptionNumber"
                      type="text"
                      defaultValue={taxForm?.exemptionNumber || ""}
                      onChange={handleTaxChange}
                      placeholder="Enter exemption number"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  ) : (
                    <input
                      name="exemptionNumber"
                      value={taxForm.exemptionNumber}
                      onChange={handleTaxChange}
                      placeholder="Enter Exemption Number"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
                <div className="col-span-2 sm:col-auto">
                  <label className="block mb-1 text-gray-600">Percentage</label>
                  {pageTitle === "Contact" ? (
                    <input
                      name="percentage"
                      type="text"
                      defaultValue={taxForm?.percentage || ""}
                      onChange={handleTaxChange}
                      placeholder="Enter percentage"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  ) : (
                    <input
                      name="percentage"
                      value={taxForm.percentage}
                      onChange={handleTaxChange}
                      placeholder="0.00%"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 text-gray-600">Note</label>
                  {pageTitle === "Contact" ? (
                    <textarea
                      name="taxNote"
                      defaultValue={taxForm?.taxNote || ""}
                      onChange={handleTaxChange}
                      placeholder="Enter note"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      rows={4}
                    />
                  ) : (
                    <textarea
                      name="taxNote"
                      value={taxForm.taxNote}
                      onChange={handleTaxChange}
                      rows={3}
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          {/* discount field */}
          {isDiscountAdded && (
            <div
              className="mt-5 space-y-6 p-4  bg-[#FFFFFF]  border border-solid border-gray-200 rounded"
            >
              <h1 className="font-semibold text-lg text-gray-800">
                ADD Discount
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">
                    Default Labor Rate
                  </label>
                  {pageTitle === "Contact" ? (
                    <div>
                      <select
                        name="laborRate"
                        defaultValue={discountForm?.laborRate || ""}
                        onChange={handleDiscountChange}
                        className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      >
                        <option value="" disabled hidden>
                          Select Labor Rate
                        </option>
                        <option value="Level_1">Level_1</option>
                        <option value="Level_2">Level_2</option>
                        <option value="Level_3">Level_3</option>
                        <option value="Level_4">Level_4</option>
                        <option value="Fleet_Diesel">Fleet_Diesel</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <select
                        name="laborRate"
                        value={discountForm.laborRate || ""}
                        onChange={handleDiscountChange}
                        className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      >
                        <option value="" disabled hidden>
                          Select Labor Rate
                        </option>
                        <option value="Level_1">Level_1</option>
                        <option value="Level_2">Level_2</option>
                        <option value="Level_3">Level_3</option>
                        <option value="Level_4">Level_4</option>
                        <option value="Fleet_Diesel">Fleet_Diesel</option>
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Labor Discount
                  </label>
                  {pageTitle === "Contact" ? (
                    <input
                      name="laborDiscount"
                      type="text"
                      defaultValue={discountForm?.laborDiscount || ""}
                      onChange={handleDiscountChange}
                      placeholder="0.00%"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  ) : (
                    <input
                      name="laborDiscount"
                      value={discountForm.laborDiscount}
                      onChange={handleDiscountChange}
                      placeholder="0.00%"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700">
                    Default Inventory Sell Level Rate
                  </label>
                  {pageTitle === "Contact" ? (
                    <div>
                      <select
                        name="inventoryRate"
                        defaultValue={discountForm?.inventoryRate || ""}
                        onChange={handleDiscountChange}
                        className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      >
                        <option value="" disabled hidden>
                          Select Material Rate
                        </option>
                        <option value="Level_1">Level_1</option>
                        <option value="Level_2">Level_2</option>
                        <option value="Level_3">Level_3</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <select
                        name="inventoryRate"
                        value={discountForm.inventoryRate || ""}
                        onChange={handleDiscountChange}
                        className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                      >
                        <option value="" disabled hidden>
                          Select Inventory Rate
                        </option>
                        <option value="Level_1">Level_1</option>
                        <option value="Level_2">Level_2</option>
                        <option value="Level_3">Level_3</option>
                        <option value="Level_4">Level_4</option>
                        <option value="EDAP">EDAP</option>
                        <option value="Stock_Transfer">Stock_Transfer</option>
                      </select>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Material Discount
                  </label>
                  {pageTitle === "Contact" ? (
                    <input
                      name="materialDiscount"
                      type="text"
                      defaultValue={discountForm?.materialDiscount || ""}
                      onChange={handleDiscountChange}
                      placeholder="0.00%"
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  ) : (
                    <input
                      name="materialDiscount"
                      value={discountForm.materialDiscount}
                      placeholder="0.00%"
                      onChange={handleDiscountChange}
                      className="p-[5px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
          <div>
            {vehicleInfoArr.length > 0 && (
              <div
                className="mt-5 space-y-2 relative p-4 bg-[#FFFFFF]  border border-solid border-gray-200 rounded"
              >
                {vehicleInfoArr.map((item, index) => (
                  <div key={index} className="border-b ">
                    <div className="flex justify-between items-center ">
                      <h4 className="font-bold text-lg text-gray-800">
                        Vehicle {index + 1}
                      </h4>
                      <div className="flex gap-3">
                        {editingIndex === index ? (
                          <>
                            {editedVehicleInfo?.make === "" ||
                              editedVehicleInfo?.model === "" ||
                              editedVehicleInfo?.registrationNum === "" ||
                              editedVehicleInfo?.vin === "" ||
                              editedVehicleInfo?.color === "" ||
                              editedVehicleInfo?.year === "" ||
                              editedVehicleInfo?.numberPlate === "" ? (
                              <p></p>
                            ) : (
                              <p
                                onClick={() => handleSaveClick(index)}
                                className="text-[#3bc990] text-[30px] cursor-pointer"
                              >
                                <CheckCircleFilled />
                              </p>
                            )}
                            <p
                              onClick={handleCancelClick}
                              className="text-rose-600 text-[30px] cursor-pointer"
                            >
                              <CloseCircleFilled />
                            </p>
                          </>
                        ) : (
                          <p
                            onClick={() => handleEditClick(index)}
                            className="text-gray-800 text-[30px] cursor-pointer"
                          >
                            <EditFilled />
                          </p>
                        )}
                      </div>
                    </div>

                    {editingIndex === index ? (
                      <div className="space-y-3 ">
                        <div>
                          <label className="mb-3">Number Plate</label>
                          <input
                            name="numberPlate"
                            type="text"
                            defaultValue={editedVehicleInfo?.numberPlate || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="Number Plate"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-3">Registration</label>
                          <input
                            name="registrationNum"
                            type="text"
                            defaultValue={
                              editedVehicleInfo?.registrationNum || ""
                            }
                            onChange={handleInputChangeEdit}
                            placeholder="Registration"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-3">VIN</label>
                          <input
                            name="vin"
                            type="text"
                            defaultValue={editedVehicleInfo?.vin || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="VIN"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-3">Make</label>
                          <input
                            name="make"
                            type="text"
                            defaultValue={editedVehicleInfo?.make || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="Make"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-3">Model</label>
                          <input
                            name="model"
                            type="text"
                            defaultValue={editedVehicleInfo?.model || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="Model"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="mb-3">Year</label>
                          <input
                            name="year"
                            type="text"
                            defaultValue={editedVehicleInfo?.year || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="Model"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-3">Type</label>
                          <input
                            name="color"
                            type="text"
                            defaultValue={editedVehicleInfo?.color || ""}
                            onChange={handleInputChangeEdit}
                            placeholder="Color"
                            className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                          {[
                            { label: "Number Plate", value: item?.numberPlate },
                            { label: "Registration", value: item?.registrationNum },
                            { label: "VIN", value: item?.vin },
                            { label: "Make", value: item?.make },
                            { label: "Model", value: item?.model },
                            { label: "Type", value: item?.color },
                            { label: "Year", value: item?.year },
                          ].map(({ label, value }) => (
                            <div key={label} className="flex  border-b border-gray-200 pb-2">
                              <span className="text-gray-900 font-semibold ">{label} :  </span>
                              <span className="text-gray-900 font-medium ml-1"> {value || "-"}</span>
                            </div>
                          ))}
                        </div>

                      </div>

                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div

            className="mt-5 space-y-3 relative p-4  border border-solid border-gray-200 rounded "
          >
            <h1 className="font-semibold text-lg text-gray-800">
              Vehicle Information
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-center">
              {/* Number Plate */}
              <div>
                <label htmlFor="numberPlate" className="block mb-1 text-gray-600">
                  Number Plate
                </label>
                <input
                  id="numberPlate"
                  name="numberPlate"
                  type="text"
                  placeholder="Enter number plate"
                  value={vehicleInfo.numberPlate}
                  className="p-[7px] bg-white text-black border border-solid border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  onChange={handleInputChange}
                />
              </div>

              {/* Registration Number */}
              <div>
                <label htmlFor="registrationNum" className="block mb-1 text-gray-600">
                  Registration
                </label>
                <input
                  id="registrationNum"
                  name="registrationNum"
                  type="text"
                  placeholder="Enter registration"
                  value={vehicleInfo.registrationNum}
                  className="p-[7px] bg-white text-black border border-solid border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  onChange={handleInputChange}
                />
              </div>

              {/* VIN */}
              <div className="flex flex-col">
                <label htmlFor="vin" className="mb-1 text-gray-600">
                  Vin
                </label>
                <div className="relative">
                  <input
                    id="vin"
                    name="vin"
                    type="text"
                    placeholder="Search VIN"
                    value={vinNum}
                    onChange={(e) => setVinNum(e.target.value)}
                    className="p-[7px] bg-white text-black border border-solid border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  />
                  <button
                    type="button"
                    className={`absolute top-1/2 transform -translate-y-1/2 right-2 bg-transparent border-none ${vinNum ? "" : "hidden"
                      }`}
                    onClick={handleVinInfo}
                  >
                    <BsSearch className="text-black cursor-pointer" />
                  </button>
                </div>
              </div>

              {/* Make */}
              <div>
                <label htmlFor="make" className="block mb-1 text-gray-600">
                  Make
                </label>
                <Select
                  showSearch
                  placeholder="Select make"
                  value={vehicleInfo.make}
                  onChange={(value) => handleSelectChange("make", value)}
                  filterOption={(input, option) =>
                    (option?.children ?? "").toString()?.toLowerCase()?.includes(input.toLowerCase())
                  }
                  className="w-full"
                >
                  {makes.map((make) => (
                    <Option key={make.make_id} value={make.make_id}>
                      {make.make_display}
                    </Option>
                  ))}
                </Select>
              </div>


              <div>
                <label htmlFor="model" className="block mb-1 text-gray-600">
                  Model
                </label>
                <Select
                  showSearch
                  placeholder="Select model"
                  disabled={models?.length <= 0 && !vehicleInfo?.model}
                  value={vehicleInfo.model}
                  onChange={(value) => handleSelectChange("model", value)}
                  filterOption={(input, option) =>
                    (option?.children ?? "")?.toString()?.toLowerCase()?.includes(input.toLowerCase())
                  }
                  className="w-full"
                >
                  {models?.map((model: any) => (
                    <Option key={model.model_make_id} value={model.model_name}>
                      {model.model_name}
                    </Option>
                  ))}
                </Select>
              </div>


              <div>
                <label htmlFor="model" className="block mb-1 text-gray-600">
                  Year
                </label>
                <Select
                  showSearch
                  placeholder="Select year"
                  value={vehicleInfo.year}
                  disabled={!years.max_year && !vehicleInfo.year}
                  onChange={(value) => handleSelectChange("year", value)}
                  filterOption={(input, option) =>
                    (option?.children ?? "")?.toString()?.toLowerCase()?.includes(input.toLowerCase())
                  }
                  className="w-full"
                >
                  <Option key={years.max_year} value={years.max_year}>
                    {years.max_year}
                  </Option>
                </Select>
              </div>

              {/* Type */}
              <div>
                <label htmlFor="color" className="block mb-1 text-gray-600">
                  Type
                </label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  placeholder="Enter Type"
                  value={vehicleInfo.color}
                  className="p-[7px] bg-white text-black border border-solid border-gray-300 outline-none w-full rounded-md focus:border-blue-500"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div
              onClick={handleInputField}
              className="p-2 text-white max-w-[150px] text-center rounded-md font-semibold cursor-pointer bg-neutral-800 hover:bg-neutral-700 transition"
            >
              {vehicleInfoArr.length > 0 ? 'Add Another Car' : 'Add Car'}
            </div>

          </div>
        </div>

        <div className="flex justify-center  items-center z-50 fixed top-0 right-2 md:right-32 ">
          <Button
            type="primary"
            className="mt-2 font-bold bg-neutral-800 rounded-md hover:bg-neutral-700 text-white "
            htmlType="submit"
          >
            {pageTitle === "Create Contact" ? "Add" : "Update"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Contact;
