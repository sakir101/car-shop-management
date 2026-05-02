"use client";
import { Pagination, Modal, Button, message } from "antd";
import React, { useEffect, useState } from "react";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { useDispatch } from "react-redux";
import ViewTable from "@/components/ViewItems/ViewTable";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import {
  removeAllInspectionItems,
  removeAllServiceItems,
} from "@/redux/slice/searchItemShowSlice";
import { removeAllState } from "@/redux/slice/serviceInspectionItemSlice";
import {
  useDeleteConcernMutation,
  useGetConcernsAllDataQuery,
} from "@/redux/api/concernApi";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.service";
import { clearItemToDelete } from "@/redux/slice/itemDeletionSlice";
import { pageSizeOptionsArr } from "@/utils/paigination";
import { useRouter } from "next/navigation";

const ItemView = () => {
  const { confirm } = Modal;
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(removeAllInspectionItems());
    dispatch(removeAllServiceItems());
    dispatch(removeAllState());
    dispatch(setSearchTerm(""));
  }, [dispatch]);
  const searchTerm = useAppSelector((state) => state.search.searchTerm);

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
  } = useGetConcernsAllDataQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteConcern] = useDeleteConcernMutation();

  const allItemsData: any = allItems?.data;
  const allItemsMeta: any = allItems?.meta;

  const { code, type } = useAppSelector((state) => state.itemDelete);

  useEffect(() => {
    if (code && type) {
      showDeleteConfirm(code, type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, type]);

  const showDeleteConfirm = (code: string, type: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        await handleDeletion(code, type);
      },
      onCancel() {
        dispatch(clearItemToDelete());
      },
    });
  };

  const handleDeletion = async (code: string, type: string) => {
    try {
      if (type === "Concern") {
        await deleteConcern({ code }).unwrap();
        message.success("Concern deleted successfully!");
        dispatch(clearItemToDelete());
      } else {
        message.warning("Delete action not configured for this type.");
      }
    } catch (error: any) {
      message.error(
        error?.data?.message || "Something went wrong while deleting."
      );
      dispatch(clearItemToDelete());
    }
  };

  const handlePageChange = (currentPage: number, pageSize: number) => {
    setPage(currentPage);
    if (pageSize !== size) {
      setSize(pageSize);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [size]);


  const resetFilters = () => {
    dispatch(setSearchTerm(""));
  };
  const { role } = getUserInfo() as any;
  const router = useRouter()
  return (
    <div className="view-page-container">
      <div className="flex justify-between flex-col md:flex-row gap-3 mb-3">
        <SearchInput
          placeholder="Search..."
          resetFilters={resetFilters}

        />
        <Button
          type="primary"
          onClick={() => router.push(`/${role}/concern/create`)}
          className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
        >
          <PlusOutlined />
          <span className="text-md"> Add New Concern</span>
        </Button>
      </div>
      <ViewTable
        isLoading={isLoading}
        ItemArray={allItemsData}
        page={"concern"}
      />
      {
        allItemsData?.length > 4 && (
          <Pagination
            current={page}
            total={allItemsMeta?.total}
            pageSize={size}
            onChange={handlePageChange}
            pageSizeOptions={pageSizeOptionsArr}
            showSizeChanger
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          />
        )
      }


    </div>
  );
};

export default ItemView;
