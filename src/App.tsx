import { useState, useEffect } from "react";
import "./assets/css/style.scss";
import { BrowserRouter as Router } from "react-router-dom";
import "react-activity/dist/library.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Sentry } from "react-activity";
import AdminRoutes from "./routes/AdminRoutes";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const base = import.meta.env.REACT_APP_BASENAME || "/";

  return (
    <>
      {loading ? (
        <div className="loaderdiv">
          <Sentry color="#0d6efd" size={40} speed={1} animating={true} />
        </div>
      ) : (
        <Router basename={base}>
          <ScrollToTop />
          <AdminRoutes />
        </Router>
      )}
    </>
  );
}

export default App;
