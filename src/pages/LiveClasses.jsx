import "./LiveClasses.css";

function LiveClasses() {
  const classes = [
    {
      course: "Web Development",
      date: "June 15",
      time: "10:00 AM"
    },
    {
      course: "Networking",
      date: "June 18",
      time: "2:00 PM"
    }
  ];

  return (
    <div className="live-page">

      <h1>Live Classes</h1>

      <div className="live-grid">

        {classes.map((item, index) => (
          <div className="live-item" key={index}>
            <h3>{item.course}</h3>
            <p>{item.date}</p>
            <span>{item.time}</span>

            <button>Join Class</button>
          </div>
        ))}

      </div>

    </div>
  );
}

export default LiveClasses;