"use client";
import SearchInput from "@/components/SearchbarComponent/SearchbarComponent";
import ViewTable from "@/components/ViewItems/ViewTable";
import {
  useDeleteContractByIdMutation,
  useGetAllContractQuery,
} from "@/redux/api/createContractApi";
import { useAppSelector, useDebounced } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slice/searchSlice";
import { message, Modal, Button, Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { clearContactState } from "@/redux/slice/deleteContactSlice";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.service";
import { pageSizeOptions, pageSizeOptionsArr } from "@/utils/paigination";
import { useRouter } from "next/navigation";

interface Item {
  address?: string;
  contactNum?: string;
  customers?: { customerId?: string } | null;
  email?: string;
  employees?: any | null;
  id?: string;
  name?: string;
  password?: string;
  role?: string;
  vehicles?: any[];
}
interface AllItemsResponse {
  items: {
    meta: any;
    data: Item[];
  };
  meta?: any;
}

const ViewContract = () => {
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(50);

  const searchTerm = useAppSelector((state) => state.search.searchTerm);
  const { ContactState } = useAppSelector((state) => state.deleteContact);

  query["searchTerm"] = searchTerm;
  query["size"] = size;
  query["page"] = page;

  useEffect(() => {
    if (searchTerm) {
      setPage(1);
    }
  }, [searchTerm]);

  // Reset page to 1 when size changes
  useEffect(() => {
    setPage(1);
  }, [size]);

  const debouncedTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedTerm) {
    query["searchTerm"] = debouncedTerm;
  }

  const { data: allItems, isLoading, refetch } = useGetAllContractQuery(query, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteContractById] = useDeleteContractByIdMutation();

  useEffect(() => {
    if (ContactState.id) {
      handleDelete(ContactState.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContactState]);

  const handleDelete = (id: string) => {
    confirm({
      title: "Are you sure you want to delete this item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteContractById(id).unwrap();
          message.success("Item deleted successfully!");
          refetch();
          dispatch(clearContactState());
        } catch (error) {
          dispatch(clearContactState());
          message.error("Failed to delete the item. Please try again.");
        }
      },
      onCancel() {
        dispatch(clearContactState());
      },
    });
  };

  const allItemsData: Item[] = (allItems as AllItemsResponse)?.items?.data || [];
  const allItemsMeta: any = (allItems as AllItemsResponse)?.items?.meta;

  const handlePageChange = (currentPage: number, pageSize?: number) => {
    setPage(currentPage);
    if (pageSize && pageSize !== size) {
      setSize(pageSize);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1);
  };

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
          size="large"
          resetFilters={resetFilters}
        />
        <Button
          type="primary"
          onClick={() => router.push(`/${role}/contact/create`)}
          className="flex rounded items-center gap-1 bg-[#2E2E2E] hover:bg-neutral-700 cursor-pointer font-medium hover:font-semibold"
        >
          <PlusOutlined />
          <span className="text-md">Add New Contact</span>
        </Button>

      </div>

      <ViewTable
        ItemArray={allItemsData}
        page="contact"
        isLoading={isLoading}
        pageTitle=""
      />

      {
        allItemsData?.length > 4 && <Pagination
          current={page}
          total={allItemsMeta?.total || 0}
          pageSize={size}
          onChange={handlePageChange}
          onShowSizeChange={handleSizeChange}
          pageSizeOptions={pageSizeOptionsArr}
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 20
          }}
        />
      }
    </div>
  );
};

export default ViewContract;