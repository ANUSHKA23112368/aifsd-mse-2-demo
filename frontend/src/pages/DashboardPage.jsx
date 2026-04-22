import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearToken,
  fetchProfile,
  getErrorMessage,
  updateCondition,
  updatePassword,
} from "../services/authService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [conditionForm, setConditionForm] = useState({
    condition: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [conditionMessage, setConditionMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setPatient(data.patient);
        setConditionForm({ condition: data.patient.condition });
      } catch (apiError) {
        setPageError(getErrorMessage(apiError));

        if (apiError?.response?.status === 401) {
          clearToken();
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (event) => {
    const { name, value } = event.target;
    setConditionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPageError("");

    try {
      const data = await updatePassword(passwordForm);
      setPasswordMessage(data.message);
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (apiError) {
      setPageError(getErrorMessage(apiError));
    }
  };

  const handleConditionSubmit = async (event) => {
    event.preventDefault();
    setConditionMessage("");
    setPageError("");

    try {
      const data = await updateCondition(conditionForm);
      setPatient(data.patient);
      setConditionMessage(data.message);
    } catch (apiError) {
      setPageError(getErrorMessage(apiError));
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <main className="page-shell">
        <section className="dashboard-shell">
          <div className="dashboard-card">
            <p>Loading patient dashboard...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Protected Dashboard</p>
            <h1>Welcome, {patient?.name}</h1>
            <p className="support-text">
              View patient details, update your password, update the medical
              condition, and logout securely.
            </p>
          </div>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {pageError ? <p className="message error">{pageError}</p> : null}

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Patient Details</h2>
            <div className="detail-row">
              <span>Name</span>
              <strong>{patient?.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{patient?.email}</strong>
            </div>
            <div className="detail-row">
              <span>Medical Condition</span>
              <strong>{patient?.condition}</strong>
            </div>
          </article>

          <form className="dashboard-card" onSubmit={handlePasswordSubmit}>
            <h2>Update Password</h2>
            <label>
              <span>Old Password</span>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter old password"
                value={passwordForm.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>

            <label>
              <span>New Password</span>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </label>

            {passwordMessage ? <p className="message success">{passwordMessage}</p> : null}

            <button type="submit" className="primary-btn">
              Update Password
            </button>
          </form>

          <form className="dashboard-card" onSubmit={handleConditionSubmit}>
            <h2>Update Condition</h2>
            <label>
              <span>Medical Condition</span>
              <input
                type="text"
                name="condition"
                placeholder="Enter updated condition"
                value={conditionForm.condition}
                onChange={handleConditionChange}
                required
              />
            </label>

            {conditionMessage ? <p className="message success">{conditionMessage}</p> : null}

            <button type="submit" className="primary-btn">
              Update Condition
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
