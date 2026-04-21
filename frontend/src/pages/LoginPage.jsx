import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage, loginStudent, setToken } from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const data = await loginStudent(formData);
      setToken(data.token);
      navigate("/dashboard");
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
          <p className="eyebrow">MERN Stack Project</p>
          <h1>Student Authentication System</h1>
          <p className="support-text">
            Sign in to access your protected dashboard, update your password, and manage
            your current course.
          </p>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <h2>Login</h2>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {error ? <p className="message error">{error}</p> : null}

          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Login"}
          </button>

          <p className="helper-text">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
