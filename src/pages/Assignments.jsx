import "./Assignments.css";

function Assignments() {
  const assignments = [
    {
      name: "Project 1",
      course: "Web Development",
      deadline: "15 Jun",
      status: "Pending"
    },
    {
      name: "Quiz 2",
      course: "Database Systems",
      deadline: "18 Jun",
      status: "Submitted"
    },
    {
      name: "Lab Report",
      course: "Networking",
      deadline: "10 Jun",
      status: "Overdue"
    }
  ];

  return (
    <div className="assignments-page">

      <h1>Assignments Due</h1>

      <table className="assignments-table">

        <thead>
          <tr>
            <th>Assignment</th>
            <th>Course</th>
            <th>Deadline</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {assignments.map((item, index) => (

            <tr key={index}>

              <td>{item.name}</td>

              <td>{item.course}</td>

              <td>{item.deadline}</td>

              <td>
                <span
                  className={`status ${item.status.toLowerCase()}`}
                >
                  {item.status}
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Assignments;