import Navbar from "/home/fortunelia4/Frontend/MyStudentIN/student-dashboard/src/components/Navbar";
import Sidebar from "/home/fortunelia4/Frontend/MyStudentIN/student-dashboard/src/components/Sidebar";

function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="container">
        <Sidebar />

        <main>
          <h1>Welcome Back</h1>

          <p>
            Learn Without Limits
          </p>

          <div className="cards">
            <div className="card">
              <h3>Courses</h3>
              <p>12</p>
            </div>

            <div className="card">
              <h3>Assignments</h3>
              <p>5 Due</p>
            </div>

            <div className="card">
              <h3>Attendance</h3>
              <p>92%</p>
            </div>

            <div className="card">
              <h3>Live Classes</h3>
              <p>3 Today</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;