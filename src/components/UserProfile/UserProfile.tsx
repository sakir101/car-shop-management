"use client";

import Loading from "@/app/loading";
import { useGetSingleUserQuery } from "@/redux/api/UserApi";
import { getUserInfo } from "@/services/auth.service";
import Image from "next/image";
import React, { useEffect } from "react";
import { MdEmail, MdPhone, MdLocationOn, MdUpdate } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { useAppDispatch } from "@/redux/hooks";


const UserProfile = () => {
  const { userId: id } = getUserInfo() as any;
  const { data, isLoading } = useGetSingleUserQuery(id, {
    refetchOnMountOrArgChange: true,
  });


  if (isLoading) return <Loading />;

  return (
    <div className=" mx-auto p-3 md:p-6">
      {data && Object.keys(data).length > 0 ? (
        <div className="bg-white rounded border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative w-24 h-24">
              <Image
                src={data?.profileImage ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${data?.profileImage}` : "/default-profile.png"}
                alt="Profile"
                fill
                className="rounded-full object-cover bg-slate-500 border-4 border-gray-200 shadow-sm"
              />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {data?.name}
              </h1>
              <p className="text-sm text-gray-500 capitalize mt-1">
                {data?.role}
              </p>
            </div>
          </div>

          {/* Divider */}
          <hr className="my-6 border-gray-200" />

          {/* Personal Info Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MdEmail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium text-gray-800">
                      {data?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MdPhone className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Contact Number</p>
                    <p className="text-sm font-medium text-gray-800">
                      {data?.contactNum || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 md:col-span-2">
                  <MdLocationOn className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-800">
                      {data?.address || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <FaCalendarAlt className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Account Created</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(data?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MdUpdate className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(data?.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 text-sm">
          No user data available.
        </div>
      )}
    </div>
  );
};

export default UserProfile;
