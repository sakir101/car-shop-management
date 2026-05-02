"use client";

import React from "react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import BasicCalender from "@/components/Calender/BasicCalender";

const AppointmentView = () => {
  return (
    <div className="w-[95%]  mx-auto ">
      <div className="h-[82vh]">
        <BasicCalender />
      </div>
    </div>
  );
};

export default AppointmentView;
