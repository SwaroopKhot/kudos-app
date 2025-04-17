import React, { useState } from "react";
import "./WeekNavigator.css"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, isAfter } from "date-fns";

const WeekNavigator = ({ onWeekChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const getWeekRange = (date) => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
  };

  const notifyChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    if (onWeekChange) {
      onWeekChange(formattedDate);
    }
  };

  const handlePrevWeek = () => {
    const newDate = subWeeks(currentDate, 1);
    setCurrentDate(newDate);
    notifyChange(newDate);
  };

  const handleNextWeek = () => {
    const nextWeekStart = startOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 });
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
  
    if (nextWeekStart > thisWeekStart) return;

    const newDate = addWeeks(currentDate, 1);
    setCurrentDate(newDate);
    notifyChange(newDate);
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate) && !isAfter(newDate, today)) {
      setCurrentDate(newDate);
      notifyChange(newDate);
    }
  };

  const disableForward = format(startOfWeek(currentDate, { weekStartsOn: 1 }), "yyyy-MM-dd") ===
                        format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd");
  return (
    <div className="weeknavigator_container">
      <div className="weeknavigator_icon">
        <FaChevronLeft
          style={{ cursor: "pointer" }}
          onClick={handlePrevWeek}
          title="Previous Week"
        />
      </div>

      <div>
        <input
          type="date"
          value={format(currentDate, "yyyy-MM-dd")}
          onChange={handleDateChange}
          style={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px 8px",
            fontSize: "0.9rem"
          }}
        />
      </div>

      <div className="weeknavigator_icon">
        <FaChevronRight
          style={{ cursor: disableForward ? "not-allowed" : "pointer", opacity: disableForward ? 0.3 : 1 }}
          onClick={!disableForward ? handleNextWeek : null}
          title="Next Week"
        />
      </div>

      <p>
        (showing results for - <span style={{fontWeight: 500}}>{getWeekRange(currentDate)}</span>)
      </p>
    </div>
  );
};

export default WeekNavigator;
