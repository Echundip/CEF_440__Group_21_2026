import "./Calendar.css";

function Calendar() {
  return (
    <div className="calendar-page">

      <h1>Calendar</h1>

      <div className="calendar-box">

        <h3>Upcoming Schedule</h3>

        <ul>
          <li>📚 Assignment Deadline - June 15</li>
          <li>🎥 Live Class - June 18</li>
          <li>📝 Exam Week - June 25</li>
        </ul>

      </div>

    </div>
  );
}

export default Calendar;