import "./Messages.css";

function Messages() {
  return (
    <div className="messages-page">

      <h1>Messages</h1>

      <div className="message-card">

        <h3>Dr. Thanks</h3>

        <p>
          Assignment deadline has been extended to Friday.
        </p>

        <span>2 min ago</span>

      </div>

      <div className="message-card">

        <h3>Dr Precious</h3>

        <p>
          New course materials uploaded.
        </p>

        <span>1 day ago</span>

      </div>

    </div>
  );
}

export default Messages;