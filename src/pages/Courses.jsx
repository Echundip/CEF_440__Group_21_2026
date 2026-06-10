import "./Courses.css";

function Courses() {
  const courses = [
    {
      title: "Web Development",
      lecturer: "Dr. Thanks",
      progress: 65,
      image: "https://via.placeholder.com/120"
    },
    {
      title: "Database Systems",
      lecturer: "Dr. Lawrence",
      progress: 40,
      image: "https://via.placeholder.com/120"
    }
  ];

  return (
    <div className="courses-page">
      <h1>Courses Enrolled</h1>

      <div className="courses-grid">
        {courses.map((course, index) => (
          <div key={index} className="course-card">

            <img
              src={course.image}
              alt={course.title}
              className="course-image"
            />

            <h3>{course.title}</h3>

            <p>{course.lecturer}</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <p>{course.progress}% Complete</p>

            <button className="continue-btn">
              Continue Learning
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;