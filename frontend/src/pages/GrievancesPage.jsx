import { useEffect, useState } from "react";
import {
  submitGrievance,
  fetchGrievances,
  updateGrievance,
  deleteGrievance,
  getErrorMessage,
} from "../services/grievanceService";

const GrievancesPage = () => {
  const [grievances, setGrievances] = useState([]);
  const [form, setForm] = useState({ subject: "", description: "", category: "Academic" });
  const [searchTitle, setSearchTitle] = useState("");
  const [pageError, setPageError] = useState("");
  const [message, setMessage] = useState("");

  const loadGrievances = async (title) => {
    try {
      const data = await fetchGrievances({ title });
      setGrievances(data.grievances || []);
    } catch (err) {
      setPageError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPageError("");
    setMessage("");

    try {
      const data = await submitGrievance(form);
      setMessage(data.message || "Submitted");
      setForm({ subject: "", description: "", category: "Academic" });
      loadGrievances();
    } catch (err) {
      setPageError(getErrorMessage(err));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadGrievances(searchTitle);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this grievance?")) return;

    try {
      await deleteGrievance(id);
      loadGrievances();
    } catch (err) {
      setPageError(getErrorMessage(err));
    }
  };

  const toggleResolve = async (item) => {
    try {
      await updateGrievance(item._id, { status: item.status === "resolved" ? "pending" : "resolved" });
      loadGrievances();
    } catch (err) {
      setPageError(getErrorMessage(err));
    }
  };

  return (
    <main className="page-shell">
      <section className="dashboard-shell">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">Grievances</p>
            <h1>Submit and manage grievances</h1>
          </div>
        </div>

        {pageError ? <p className="message error">{pageError}</p> : null}
        {message ? <p className="message success">{message}</p> : null}

        <div className="dashboard-grid">
          <form className="dashboard-card" onSubmit={handleSubmit}>
            <h2>Submit Grievance</h2>
            <label>
              <span>Title</span>
              <input name="subject" value={form.subject} onChange={handleChange} required />
            </label>

            <label>
              <span>Category</span>
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Academic</option>
                <option>Hostel</option>
                <option>Transport</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              <span>Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} required />
            </label>

            <button className="primary-btn" type="submit">
              Submit
            </button>
          </form>

          <article className="dashboard-card">
            <h2>Search</h2>
            <form onSubmit={handleSearch}>
              <label>
                <span>Title</span>
                <input value={searchTitle} onChange={(e) => setSearchTitle(e.target.value)} />
              </label>
              <button className="secondary-btn" type="submit">
                Search
              </button>
              <button type="button" className="secondary-btn" onClick={() => { setSearchTitle(""); loadGrievances(); }}>
                Reset
              </button>
            </form>

            <h2 style={{ marginTop: "1rem" }}>All Grievances</h2>
            {grievances.length === 0 ? <p>No grievances found.</p> : null}

            <ul className="grievance-list">
              {grievances.map((g) => (
                <li key={g._id} className="grievance-item">
                  <div>
                    <strong>{g.subject}</strong>
                    <div className="muted">{g.category} • {new Date(g.createdAt).toLocaleString()}</div>
                    <p>{g.description}</p>
                    <div className="muted">Status: {g.status}</div>
                  </div>
                  <div className="grievance-actions">
                    <button className="secondary-btn" onClick={() => toggleResolve(g)}>
                      {g.status === "resolved" ? "Mark Pending" : "Mark Resolved"}
                    </button>
                    <button className="danger-btn" onClick={() => handleDelete(g._id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
};

export default GrievancesPage;
