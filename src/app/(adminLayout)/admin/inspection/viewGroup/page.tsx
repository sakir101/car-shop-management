"use client";
import { Pagination, Modal, message, Button } from "antd";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import { clearInspectionState } from "@/redux/slice/deleteInspectionSlice";
import ViewTable from "@/components/ViewItems/ViewTable";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
  removeSearchItemShow,
} from "@/redux/slice/searchItemShowSlice";
import {
  useDeleteInspectionGroupMutation,
  useGetInspectionGroupQuery,
} from "@/redux/api/inspectionGroupApi";
import { getUserInfo } from "@/services/auth.service";
import { clearAllRelatedItemDB } from "@/redux/slice/relatedItemHandleSlice";
import { clearItemToDelete } from "@/redux/slice/itemDeletionSlice";
import { useRouter } from "next/navigation";

const ItemView = () => {
  const { confirm } = Modal;
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllServiceItems());
    dispatch(removeSearchItemShow());
    dispatch(clearInspectionState());
    dispatch(clearAllRelatedItemDB());
    dispatch(setSearchTerm(""));
  }, [dispatch]);
  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { code, type } = useAppSelector((state) => state.itemDelete);

  useEffect(() => {
    if (code && type) {
      showDeleteConfirm(code, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type]);

  query["size"] = size;
  query["page"] = page;
  query["sortBy"] = sortBy;
  query["sortOrder"] = sortOrder;
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

  const {
    data: allItems,
    isLoading,
    refetch,
  } = useGetInspectionGroupQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteInspectionGroup] = useDeleteInspectionGroupMutation();

  const allItemsData: any = allItems?.data;
  const allItemsMeta: any = allItems?.meta;

  const showDeleteConfirm = (code: string, type: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        await handleDeleteOk(code, type);
      },
      onCancel() {
        dispatch(clearItemToDelete());
      },
    });
  };

  const handleDeleteOk = async (code: string, type: string) => {
    message.loading({ content: "Loading...", key: "loadingKey" });
    try {
      if (type === "Inspection-Group") {
        await deleteInspectionGroup({ code }).unwrap();
        message.success("Inspection group deleted successfully");
        dispatch(clearItemToDelete());
      } else {
        message.warning("Delete action not configured for this type.");
      }
    } catch (error: any) {
      message.error(
        error?.data?.message || "Something went wrong while deleting."
      );
      dispatch(clearItemToDelete());
    } finally {
      message.destroy("loadingKey");
    }
  };

  const handlePageChange = (currentPage: number) => {
    setPage(currentPage);
  };

  useEffect(() => {
    setSize(10);
    setPage(allItemsMeta?.page);
  }, [allItemsMeta]);

  const resetFilters = () => {
    setCreatedAt("");
    setUpdatedAt("");
    dispatch(setSearchTerm(""));
  };
  const { role } = getUserInfo() as any;
  const router= useRouter()
  return (
    <div className="view-page-container">
   
      <div className="flex justify-between flex-col md:flex-row gap-3 mb-3">
        <SearchInput
          placeholder="Search..."
          size="large"
          resetFilters={resetFilters}
        />
        <Button
           type="primary"
           onClick={() => router.push(`/${role}/inspection/createGroup`)}
           className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
         >
           <PlusOutlined />
           <span className="text-md">Add Inspection Group</span>
         </Button>
      </div>

      <ViewTable ItemArray={allItemsData} isLoading={isLoading} page={"inspection-item-group"} />

      <Pagination
        current={page}
        defaultCurrent={1}
        total={allItemsMeta?.total}
        pageSize={10}
        onChange={handlePageChange}
        style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
      />
    </div>
  );
};

export default ItemView;
