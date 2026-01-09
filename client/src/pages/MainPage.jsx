import { useEffect, useState } from "react";
import {useNavigate} from"react-router-dom";
import Header from "../components/Header";
import MessageBox from "../components/MessageBox";

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
        <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        />


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
        {sortedMessages.map((msg) => (
            <MessageBox
                key={msg._id}
                msg={msg}
                isExpanded={expandedId === msg._id}
                setExpandedId={setExpandedId}
                replyText={replyText}
                setReplyText={setReplyText}
                sendReply={sendReply}
                cannedMessages={cannedMessages}
            />
        ))}

    </div>
    );
}