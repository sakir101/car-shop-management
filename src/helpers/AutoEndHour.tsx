import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import dayjs from "dayjs";

export const AutoEndHour = () => {
  const { watch, setValue } = useFormContext();

  const startHour = watch("startHour");
  const duration = watch("duration");

  useEffect(() => {
    if (startHour && duration) {
      // Parse startHour
      const start = dayjs(startHour, "h:mm A");
      // Parse duration
      const [hours, minutes] = duration.split(":").map(Number);
      // Calculate endHour
      const end = start.add(hours, "hour").add(minutes, "minute");
      // Set endHour in the form
      setValue("endHour", end.format("h:mm A"));
    }
  }, [startHour, duration, setValue]);

  return null;
};
