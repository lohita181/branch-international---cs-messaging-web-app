export default function MessageBox({
  msg,
  isExpanded,
  setExpandedId,
  replyText,
  setReplyText,
  sendReply,
  cannedMessages
}) {
  return (
    <div
      className={`message-card ${msg.urgency} ${isExpanded ? "expanded" : ""}`}
      onClick={() => setExpandedId(isExpanded ? null : msg._id)}
    >
      <div className="message-row">
        <p className="message-text">
          {msg.messageText.slice(0, 90)}...
        </p>

        <div className="info-wrapper" onClick={(e) => e.stopPropagation()}>
          <span className="info-icon">ℹ️</span>

          <div className="tooltip">
            <p><strong>Customer:</strong> {msg.userName}</p>
            <p><strong>Urgency:</strong> {msg.urgency}</p>
            <p><strong>Message:</strong> {msg.messageText}</p>
            <p className="tooltip-time">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="message-expanded">
          <p><strong>Full Message:</strong></p>
          <p>{msg.messageText}</p>

          {msg.agentReply ? (
            <p><strong>Reply:</strong> {msg.agentReply}</p>
          ) : (
            <>
              <select
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">-- Select a canned message --</option>
                {cannedMessages.map((text, idx) => (
                  <option key={idx} value={text}>
                    {text}
                  </option>
                ))}
              </select>

              <textarea
                rows="3"
                placeholder="Type reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sendReply(msg._id);
                }}
              >
                Send Reply
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
