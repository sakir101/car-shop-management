import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Calender = (props: Omit<CalendarProps, "localizer">) => {
  return (
    <BigCalendar {...props} localizer={localizer} tooltipAccessor={null} />
  );
};

export default Calender;
