import { useState, useEffect } from "react";
import "./assets/css/style.scss";
import { BrowserRouter as Router } from "react-router-dom";
import "react-activity/dist/library.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminRoutes from "./routes/AdminRoutes";
import { PermissionsProvider } from "./context/PermissionsContext";
import ScrollToTop from "./components/ScrollToTop";
import AppLoader from "./components/Apploader";

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
          <AppLoader size={150} />
        </div>
      ) : (
        <Router basename={base}>
          <ScrollToTop />
          <PermissionsProvider>
            <AdminRoutes />
          </PermissionsProvider>
        </Router>
      )}
    </>
  );
}

export default App;
