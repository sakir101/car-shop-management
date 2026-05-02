import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";
import { useSearchParams, useRouter } from "next/navigation";

export const SetDefaultTimes = () => {
  const { watch, setValue } = useFormContext();
  const startHour = watch("startHour");
  const duration = watch("duration");
  const scheduled = watch("scheduled");
  
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const clickedDate = searchParams.get("date");
    const clickedTime = searchParams.get("startTime");
    localStorage.setItem(
      "formValues_createAppointment",
      JSON.stringify({ scheduled: clickedDate, startHour: "", duration: "" })
    );
    // Set scheduled date from URL if present and form is empty
    if (clickedDate && !scheduled) {
      setValue("scheduled", clickedDate);
    }
    
    // Set default start time if empty
    if (!startHour) {
      if(clickedTime){
        setValue("startHour", clickedTime);
      }else{
        setValue("startHour", dayjs().format("h:mm A"));
      }
    }
    
    // Set default duration if empty
    if (!duration) {
      setValue("duration", "01:00");
    }
  }, [duration, startHour, scheduled, searchParams, setValue]);

  // Update URL when scheduled date changes in form
  useEffect(() => {
    if (scheduled) {
      const formattedDate = dayjs(scheduled).format("YYYY-MM-DD");
      const currentDateParam = searchParams.get("date");
      
      // Only update URL if the date actually changed
      if (currentDateParam !== formattedDate) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("date", formattedDate);
        router.push(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [scheduled, router, searchParams]);

  return null;
};