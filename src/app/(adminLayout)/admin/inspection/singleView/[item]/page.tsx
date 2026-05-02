"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import {
  useGetInspectionQuery,
  useSearchInspectionItemsQuery,
  useDeleteInspectionItemMutation,
  useAssignInspectionItemMutation,
  useUpdateInspectionMutation,
} from "@/redux/api/inspectionApi";
import SearchItemShow from "@/components/SearchItemShow/SearchItemShow";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { useDispatch } from "react-redux";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import RelatedInspectionItem from "@/components/RelatedItemShow/RelatedInspectionItem";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  removeAllInspectionGeneralItems,
  removeAllInspectionTireItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import { clearAllSelection } from "@/redux/slice/selectionSlice";
import {
  clearAllRelatedItemDB,
  removeAllRelatedItemSlice,
} from "@/redux/slice/relatedItemHandleSlice";
import FormUpdate from "@/components/Forms/FormUpdate";
import Loading from "@/app/loading";

const InspectionEdit = () => {
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useDispatch();
  const { handleDeleteItemDB } = useAppSelector(
    (state) => state.relatedItemHandleDB
  );
  const { inspectionGeneralItemState, inspectiontireItemState } =
    useAppSelector((state) => state.searchItemShow);
  useEffect(() => {
    dispatch(setSearchTerm(""));
    dispatch(removeSearchItemShow());
    dispatch(removeAllInspectionGeneralItems());
    dispatch(removeAllInspectionTireItems());
    dispatch(removeAllRelatedItemSlice());
    setIsInitialized(true);
  }, [dispatch]);
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  query["searchTerm"] = searchTerm;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const [code, setCode] = useState<string>("");
  const pathname = usePathname();
  useEffect(() => {
    const parts = pathname.split("/");
    const lastPart = parts.pop();
    if (lastPart) {
      setCode(lastPart);
    }
  }, [pathname]);
  const { data, isLoading, refetch } = useSearchInspectionItemsQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const inspectionItem: any = data || [];
  const {
    data: singleInspection,
    isLoading: isFetching,
    error: fetchError,
  } = useGetInspectionQuery(code, {
    skip: !code,
  });
  const [deleteInspectionItem] = useDeleteInspectionItemMutation();
  const [assignInspectionItem] = useAssignInspectionItemMutation();
  const [updateInspection] = useUpdateInspectionMutation();
  const [inspection, setInspection] = useState({
    title: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    if (singleInspection) {
      setInspection({
        title: singleInspection?.inspection?.title || "",
        code: singleInspection?.inspection?.code || "",
        description: singleInspection?.inspection?.description || "",
      });
    }
  }, [singleInspection]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInspection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  useEffect(() => {
    if (!isInitialized) return;
    if (
      (inspectionGeneralItemState && inspectionGeneralItemState.length > 0) ||
      (inspectiontireItemState && inspectiontireItemState.length > 0)
    ) {
      assignInspectionGeneral();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionGeneralItemState, inspectiontireItemState, isInitialized]);

  const handleUpdateInspection = async () => {
    try {
      await updateInspection({ data: inspection })
        .unwrap()
        .then(() => {
          message.success("Inspection updated successfully");
        });
    } catch (error: any) {
      message.error(`Failed to Inspection: ${error.data.message}.`);
    }
  };
  const assignedCodes = singleInspection?.inspectionItems?.map(
    (item: { inspectionItemCode: any }) => item.inspectionItemCode
  );
  const unassignedItems = inspectionItem?.data?.filter(
    (item: { code: any }) => !assignedCodes?.includes(item.code)
  );
  const assignInspectionGeneral = async () => {
    const inspectionItemArr = [
      ...inspectionGeneralItemState,
      ...inspectiontireItemState,
    ];
    const inspectionItem: any = inspectionItemArr[0];
    const data: any = {
      code: code,
      type: inspectionItem.type,
      itemCode: inspectionItem.generalCode ?? inspectionItem.tireCode,
    };
    try {
      await assignInspectionItem({ data }).unwrap();
      message.success("Inspection item assign successfully!");
      dispatch(removeAllInspectionGeneralItems());
      dispatch(removeAllInspectionTireItems());
      dispatch(clearAllSelection());
      refetch();
    } catch (error) {
      dispatch(removeAllInspectionGeneralItems());
      dispatch(removeAllInspectionTireItems());

      message.error("Failed to asign the service. Please try again.");
    }
  };
  useEffect(() => {
    if (handleDeleteItemDB.code) {
      showDeleteConfirmInspection(handleDeleteItemDB.code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleDeleteItemDB]);

  const showDeleteConfirmInspection = (code: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this inspection?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteInspectionItem({
            code: code,
          }).unwrap();
          message.success("Item deleted successfully!");
          dispatch(clearAllRelatedItemDB());
        } catch (error) {
          message.error("Failed to delete the service. Please try again.");
          dispatch(clearAllRelatedItemDB());
        }
      },
      onCancel: async () => {
        dispatch(clearAllRelatedItemDB());
      },
    });
  };
  if(isFetching){
    return <Loading></Loading>
  }
  return (
    <div className="page-container">
      <div className="create-title-submit">
        <h2 className="page-header">Edit Inspection</h2>
      </div>
      <FormUpdate 
        submitHandler={handleUpdateInspection}
        formKey="updateInspection"
      
      >
        <div
         
          className="create-container mt-16"
        >
          <div >
            <label className="block mb-2 text-gray-700" htmlFor="itemName">
              Title
            </label>
            <input
              onChange={(e) => handleChange(e)}
              type="text"
              id="title"
              name="title"
              placeholder="Enter your item name"
              value={inspection?.title || ""}
              className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="my-3">
            <label className="block mb-2 text-gray-700" htmlFor="itemName">
              Name
            </label>
            <input
              type="text"
              disabled
              id="code"
              placeholder="code"
              defaultValue={inspection?.code}
              className="w-full px-3 py-3 border border-solid border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div >
            <label className="block mb-2 text-gray-700" htmlFor="code">
              description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="description"
              defaultValue={inspection?.description}
              className="p-[10px] bg-white text-black border-solid border-[1px] border-gray-300 outline-none w-full rounded-md hover:border-blue-500 focus:border-blue-500"
              rows={3}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div className="flex items-center mt-2">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
        </div>
        <SearchItemShow
          data={unassignedItems}
          type={true}
          page={"inspection-item"}
          operation="update" 
        />
        <div className="mt-3"></div>
        <RelatedInspectionItem
          data={singleInspection?.inspectionItems}
          type={"inspection-item"}
          subType={"inspection-item"}
        ></RelatedInspectionItem>
        <div className="create-submit-button">
          <Button type="primary" className="bg-neutral-800 rounded font-bold hover:bg-neutral-700 mt-2" htmlType="submit">
            Update Inspection
          </Button>
        </div>
      </FormUpdate>
    </div>
  );
};

export default InspectionEdit;
