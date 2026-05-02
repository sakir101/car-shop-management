"use client";

import TechnicianService from "@/components/TechnicianService/TechnicianService";
import React from "react";

const EstimateService = () => {
  return (
    <div className="w-[90%] md:w-[80%] mx-auto py-5">
      <h1 className="text-center text-xl text-blue-500 font-semibold">
        All Services
      </h1>
      <TechnicianService />
    </div>
  );
};

export default EstimateService;
