import { useNavigate } from "react-router-dom";

export default function Header({ activeTab, setActiveTab }) {
  const agent = JSON.parse(localStorage.getItem("agent"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("agent");
    navigate("/");
  };

  return (
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
  );
}
