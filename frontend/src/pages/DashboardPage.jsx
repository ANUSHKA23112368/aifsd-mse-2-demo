import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearToken,
  fetchProfile,
  getErrorMessage,
  updateCourse,
  updatePassword,
} from "../services/authService";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [courseForm, setCourseForm] = useState({
    course: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [courseMessage, setCourseMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setStudent(data.student);
        setCourseForm({ course: data.student.course });
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

  const handleCourseChange = (event) => {
    const { name, value } = event.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
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

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    setCourseMessage("");
    setPageError("");

    try {
      const data = await updateCourse(courseForm);
      setStudent(data.student);
      setCourseMessage(data.message);
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
            <p>Loading dashboard...</p>
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
            <h1>Welcome, {student?.name}</h1>
            <p className="support-text">
              View your details, update your password, change your course, and logout
              securely.
            </p>
          </div>
          <button type="button" className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {pageError ? <p className="message error">{pageError}</p> : null}

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h2>Student Details</h2>
            <div className="detail-row">
              <span>Name</span>
              <strong>{student?.name}</strong>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <strong>{student?.email}</strong>
            </div>
            <div className="detail-row">
              <span>Course</span>
              <strong>{student?.course}</strong>
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

          <form className="dashboard-card" onSubmit={handleCourseSubmit}>
            <h2>Change Course</h2>
            <label>
              <span>Course</span>
              <input
                type="text"
                name="course"
                placeholder="Enter updated course"
                value={courseForm.course}
                onChange={handleCourseChange}
                required
              />
            </label>

            {courseMessage ? <p className="message success">{courseMessage}</p> : null}

            <button type="submit" className="primary-btn">
              Update Course
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
