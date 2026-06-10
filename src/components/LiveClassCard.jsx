import "./LiveClassCard.css";
import { FaVideo } from "react-icons/fa";

function LiveClassCard({ course, date, time }) {
  return (
    <div className="live-card">

      <div className="live-info">
        <h3>{course}</h3>
        <p>{date}</p>
        <span>{time}</span>
      </div>

      <button className="join-btn">
        <FaVideo />
        Join Class
      </button>

    </div>
  );
}

export default LiveClassCard;