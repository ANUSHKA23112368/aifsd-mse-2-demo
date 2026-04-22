import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getToken,
  registerStudent,
  setToken,
} from "../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    course: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (getToken()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const data = await registerStudent(formData);
      setToken(data.token);
      setMessage("Registration successful. Redirecting to dashboard...");
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      setError(getErrorMessage(apiError));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="auth-panel">
        <div className="brand-block">
          <p className="eyebrow">Create Account</p>
          <h1>Register as a Student</h1>
          <p className="support-text">
            Fill in your details to create an account and start using the dashboard.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Register</h2>
          <label>
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Course</span>
            <input
              type="text"
              name="course"
              placeholder="Enter your course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </label>

          {message ? <p className="message success">{message}</p> : null}
          {error ? <p className="message error">{error}</p> : null}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Register"}
          </button>

          <p className="helper-text">
            Already registered? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default RegisterPage;
