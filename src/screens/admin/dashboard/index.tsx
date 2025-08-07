import React, { useState, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import Stats from "./Stats";
import Account from "./account";
import UserVendorGrowthChart from "./UserVendorGrowthChart";
import RevenueStatsChart from "./RevenueStatsChart";
import { DashboardService, type DashboardOverview } from "@/services";

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await DashboardService.getDashboardOverview();

      if (response.status === 1 && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
      }
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "An error occurred while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Stats data={dashboardData?.stats} />

      <Row className="mt-4">
        <Col lg={12}>
          <Account
            data={dashboardData?.account_requests}
            onRefresh={fetchDashboardData}
          />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col lg={6}>
          <UserVendorGrowthChart data={dashboardData?.user_growth} />
        </Col>
        <Col lg={6}>
          <RevenueStatsChart data={dashboardData?.revenue_data} />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
