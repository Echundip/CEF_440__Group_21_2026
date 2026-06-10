import "./CourseCard.css";

function CourseCard({ course, instructor, progress }) {
  return (
    <div className="course-card">

      <div className="course-header">
        <h3>{course}</h3>
        <p>Instructor: {instructor}</p>
      </div>

      <div className="course-progress">

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <span className="progress-text">
          {progress}%
        </span>

      </div>

    </div>
  );
}

export default CourseCard;