"use client";

import React, { useEffect, useState } from "react";
import {
  useDeleteServiceMutation,
  useGetAllServiceQuery,
} from "@/redux/api/serviceApi";
import { Button, message, Modal, Pagination, Spin } from "antd";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { useDispatch } from "react-redux";
import ViewTable from "@/components/ViewItems/ViewTable";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.service";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { clearItemToDelete } from "@/redux/slice/itemDeletionSlice";
import { useRouter } from "next/navigation";

const ServiceView = () => {
  const router =useRouter()
  const { confirm } = Modal;
  const [deleteService] = useDeleteServiceMutation();
  const [metadata, setMetadata] = useState<any>({
    page: 1,
    total: 0,
    limit: 10,
  });
  const [services, setServices] = useState<any[]>([]);
  const key = "loadingKey";
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [isLoading, setIsLoading] = useState(false);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>();
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const dispatch = useDispatch();
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
    dispatch(setSearchTerm(""));
  }, [dispatch]);
  useEffect(() => {
    if (searchTerm) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }
  const resetFilters = () => {
    setCreatedAt("");
    setUpdatedAt("");
    dispatch(setSearchTerm(""));
  };

  const {
    data,
    error,
    isLoading: dataLoading,
    refetch,
  } = useGetAllServiceQuery({ currentPage, searchTerm });
  useEffect(() => {
    refetch();
  }, [refetch]);

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
      if (type === "Service") {
        await deleteService(code).unwrap();
        message.success("Service deleted successfully");
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

  useEffect(() => {
    if (dataLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      message.destroy(key);
    }

    if (data) {
      setMetadata(data?.meta);
      setServices(data?.data);
    }

    if (error) {
      message.error({ content: "Failed to load services", key, duration: 2 });
    }
  }, [data, dataLoading, error]);

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <p>No services found</p>
      </div>
    );
  }
  const { role } = getUserInfo() as any;
 
  return (
    <div className="view-page-container">
      <div className="flex flex-col w-full ">
        <div className="flex justify-between flex-col md:flex-row gap-3 mb-3">
          <SearchInput
            placeholder="Search..."
            size="large"
            resetFilters={resetFilters}
          />
      
          <Button
            type="primary"
            onClick={() => router.push(`/${role}/service/create`)}
            className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
          >
            <PlusOutlined />
            <span className="text-md">Add New Service</span>
          </Button>
        </div>

        <ViewTable
          isLoading={isLoading}
          ItemArray={services}
          page={"service"}
        />
        <div className="flex w-full justify-center">
          <Pagination
            current={metadata.page}
            total={metadata.total}
            pageSize={metadata.limit}
            showSizeChanger={false}
            onChange={handlePageChange}
            defaultCurrent={1}
            style={{ display: "flex", justifyContent: "center", marginTop: 8 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceView;
