
import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const paymentRecord = {
    id: 1,
    date: "30 Jul 2025",
    transactionId: "TXN123456789",
    user: "Priya Mehta",
    dogName: "Bruno",
    meetupWith: "Max (John Carter)",
    planType: "Breeding",
    planName: "Premium",
    paymentMethod: "Debit Card",
    amount: 499,
    status: "Success" as "Success" | "Failed",
};

const ViewPayment: React.FC = () => {
    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>View Payment</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/payments">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body className="mt-3">
                    <div className="taledtl_div">
                        <Row>
                            <Col md={6}>
                                <div className="talefile_list">
                                    {/* Transaction ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Transaction ID</h4>
                                        <p>{paymentRecord.transactionId}</p>
                                    </div>
                                    {/* Date */}
                                    <div className="tablefilelist_grid">
                                        <h4>Date</h4>
                                        <p>{paymentRecord.date}</p>
                                    </div>
                                    {/* User */}
                                    <div className="tablefilelist_grid">
                                        <h4>User</h4>
                                        <p>{paymentRecord.user}</p>
                                    </div>
                                    {/* Dog Name */}
                                    <div className="tablefilelist_grid">
                                        <h4>Dog Name</h4>
                                        <p>{paymentRecord.dogName}</p>
                                    </div>
                                    {/* Meetup With */}
                                    <div className="tablefilelist_grid">
                                        <h4>Meetup With</h4>
                                        <p>{paymentRecord.meetupWith}</p>
                                    </div>

                                    {/* Meetup With */}
                                    <div className="tablefilelist_grid">
                                        <h4>Meetup With</h4>
                                        <p>{paymentRecord.meetupWith}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="talefile_list">

                                    {/* Plan Type */}
                                    <div className="tablefilelist_grid">
                                        <h4>Type</h4>
                                        <p>{paymentRecord.planType}</p>
                                    </div>
                                    {/* Plan Name */}
                                    <div className="tablefilelist_grid">
                                        <h4>Plan Name</h4>
                                        <p>{paymentRecord.planName}</p>
                                    </div>
                                    {/* Payment Method */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment Method</h4>
                                        <p>{paymentRecord.paymentMethod}</p>
                                    </div>
                                    {/* Amount */}
                                    <div className="tablefilelist_grid">
                                        <h4>Amount</h4>
                                        <p>₹{paymentRecord.amount}</p>
                                    </div>
                                    {/* Status */}
                                    <div className="tablefilelist_grid">
                                        <h4>Status</h4>
                                        <span className={`badge ${paymentRecord.status === "Success" ? "bg-success" : "bg-danger"}`}>
                                            {paymentRecord.status}
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default ViewPayment;
