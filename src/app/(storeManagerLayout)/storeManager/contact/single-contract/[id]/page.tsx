"use client";

import Loading from "@/app/loading";
import Contact from "@/components/ui/Contact";
import { useGetSingleContactQuery } from "@/redux/api/createContractApi";

import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
interface VehicleInfo {
  numberPlate?: string;
  make?: string;
  model?: string;
  registration?: string;
  vin?: string;
  color?: string;
}
interface ContactInfo {
  name: string;
  contactNum: string;
  address: string;
  email: string;
  role: string;
  customers: any;
}
const ViewContact = () => {
  const [itemId, setItemId] = useState<string>("");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    const match = url?.match(/\/([^\/?]+)\?$/);
    const extractId = match ? match[1] : null;
    if (extractId) setItemId(extractId);
  }, [pathname, searchParams]);

  const { data, refetch ,isLoading} = useGetSingleContactQuery(itemId, {
    refetchOnMountOrArgChange: true,
  });
  if(isLoading){
    return <Loading></Loading>
  }

  return (
    <div>
      <Contact data={data} pageTitle={"Contact"}></Contact>
    </div>
  );
};

export default ViewContact;
