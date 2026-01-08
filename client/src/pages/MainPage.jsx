import { useEffect, useState } from "react";
import {useNavigate} from"react-router-dom";

const API_URL = "http://localhost:8080/api/messages";

const urgencyOrder = {
  high: 0,
  medium: 1,
  low: 2
};
export default function MainPage(){
    const [messages, setMessages] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [customerSearch, setCustomerSearch] = useState("");
    const [messageSearch, setMessageSearch] = useState("");

    const [activeTab, setActiveTab] = useState("open"); 
    const agent = JSON.parse(localStorage.getItem("agent"));
    const navigate = useNavigate();

    const handleLogout = () => {
    localStorage.removeItem("agent");
    navigate("/");
    };


    const cannedMessages = [
    "Your loan process will be initiated soon",
    "Your issue has been escalated to the concerned team.",
    "We will get back to you within 24 hours.",
    "Thank you for contacting us!"
    ];

    useEffect(() => {
    fetchMessages();
    const interval = setInterval(() => {
        fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setMessages(data);
    };

    const sendReply = async (id) => {
    if (!replyText.trim()) return;

    const res = await fetch(`${API_URL}/${id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replyText })
    });

    const updatedMessage = await res.json();
    setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? updatedMessage : msg))
    );

    setReplyText("");
    setExpandedId(null);
    };

    const filteredMessages = messages.filter((msg) => {
        const matchesCustomer =
            msg.userName
            .toLowerCase()
            .includes(customerSearch.toLowerCase());

        const matchesMessage =
            msg.messageText
            .toLowerCase()
            .includes(messageSearch.toLowerCase());

        const matchesTab =
            (activeTab === "open" && !msg.agentReply) ||
            (activeTab === "history" && msg.agentReply);

        return matchesCustomer && matchesMessage && matchesTab;
    });


    const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (activeTab === "open") {
        const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        if (urgencyDiff !== 0) return urgencyDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
        return new Date(b.repliedAt || b.createdAt) - new Date(a.repliedAt || a.createdAt);
    }
    });

    return (
    <div className="app-container">
        {/* Header */}
        <div className="header">
            <div className="header-title">CS Messaging Web App</div>

            <div className="header-tabs">
                <span
                className={`tab ${activeTab === "open" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("open")}
                >
                Open Messages
                </span>

                <span
                className={`tab ${activeTab === "history" ? "active-tab" : ""}`}
                onClick={() => setActiveTab("history")}
                >
                History
                </span>
            </div>

                <div className="header-right">
                    <div className="profile-wrapper">
                    <span className="profile-icon">👤</span>

                    <div className="profile-tooltip">
                        <p><strong>{agent?.name}</strong></p>
                        <p>{agent?.email}</p>

                        <hr />

                        <button className="logout-btn" onClick={handleLogout}>
                        Logout
                        </button>
                    </div>
                    </div>
                </div>
            </div>


        {/* Search Bar */}
        <div className="filters">
        <input
            type="text"
            placeholder="Search by customer name..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
        />

        <input
            type="text"
            placeholder="Search by message text..."
            value={messageSearch}
            onChange={(e) => setMessageSearch(e.target.value)}
        />
        </div>


        {/* Messages */}
        {sortedMessages.map((msg) => {
        const isExpanded = expandedId === msg._id;

        return (
            <div
            key={msg._id}
            className={`message-card ${msg.urgency} ${isExpanded ? "expanded" : ""}`}
            onClick={() => setExpandedId(isExpanded ? null : msg._id)}
            >
            <div className="message-row">
                <p className="message-text">{msg.messageText.slice(0, 90)}...</p>

                <div className="info-wrapper" onClick={(e) => e.stopPropagation()}>
                <span className="info-icon">ℹ️</span>

                <div className="tooltip">
                    <p>
                    <strong>Customer:</strong> {msg.userName}
                    </p>
                    <p>
                    <strong>Urgency:</strong> {msg.urgency}
                    </p>
                    <p>
                    <strong>Message:</strong> {msg.messageText}
                    </p>
                    <p className="tooltip-time">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                </div>
            </div>

            {isExpanded && (
                <div className="message-expanded">
                <p>
                    <strong>Full Message:</strong>
                </p>
                <p>{msg.messageText}</p>

                {msg.agentReply ? (
                    <p>
                    <strong>Reply:</strong> {msg.agentReply}
                    </p>
                ) : (
                    <>
                    {/* Canned messages dropdown */}
                    <select
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        style={{ marginBottom: "8px", width: "100%", padding: "5px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <option value="">-- Select a canned message --</option>
                        {cannedMessages.map((msgText, idx) => (
                        <option key={idx} value={msgText}>
                            {msgText}
                        </option>
                        ))}
                    </select>

                    {/* Reply textarea */}
                    <textarea
                        rows="3"
                        placeholder="Type reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginBottom: "8px", width: "100%", padding: "5px" }}
                    />

                    {/* Send button */}
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
        })}
    </div>
    );
}