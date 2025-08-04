import React from "react";
import { Row, Col } from "react-bootstrap";
import Stats from "./Stats";
import Account from "./account";
import UserVendorGrowthChart from "./UserVendorGrowthChart";
import RevenueStatsChart from "./RevenueStatsChart";

const Dashboard: React.FC = () => {
  return (
    <React.Fragment>
      <Stats />
      <Row className="mt-4">
        <Col lg={12}>
          <Account />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={6}>
          <UserVendorGrowthChart />
        </Col>
        <Col lg={6}>
          <RevenueStatsChart />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
