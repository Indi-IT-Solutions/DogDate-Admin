
import { IMAGES } from "@/contants/images";
import React from "react";
import { Card, Col, Row, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

// Example payment record with all required details
const paymentRecord = {
    id: 1001,
    type: "Breeding" as "Breeding" | "Playmates" | "Registration",
    recurring: true,
    dog: {
        name: "Bruno",
        breed: "Labrador Retriever",
        image: IMAGES.Dog, // Replace with IMAGES.Dog if available
    },
    user: {
        name: "Priya Mehta",
        email: "priya.mehta@email.com",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    amount: 499,
    paidOn: "30 Jul 2025",
    status: "Success" as "Success" | "Failed",
    transactionId: "TXN123456789",
    paymentMethod: "Debit Card",
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
                                    {/* Payment ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment ID</h4>
                                        <p>{paymentRecord.id}</p>
                                    </div>
                                    {/* Transaction ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Transaction ID</h4>
                                        <p>{paymentRecord.transactionId}</p>
                                    </div>
                                    {/* Type */}
                                    <div className="tablefilelist_grid">
                                        <h4>Type</h4>
                                        <p>{paymentRecord.type}</p>
                                    </div>
                                    {/* Recurring */}
                                    <div className="tablefilelist_grid">
                                        <h4>Recurring</h4>
                                        <p>{paymentRecord.recurring ? "Yes" : "No"}</p>
                                    </div>
                                    {/* Paid On */}
                                    <div className="tablefilelist_grid">
                                        <h4>Paid On</h4>
                                        <p>{paymentRecord.paidOn}</p>
                                    </div>
                                    {/* Payment Method */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment Method</h4>
                                        <p>{paymentRecord.paymentMethod}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="talefile_list">
                                    {/* Dog */}
                                    <div className="tablefilelist_grid">

                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={paymentRecord.dog.image}
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                alt={paymentRecord.dog.name}
                                                style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{paymentRecord.dog.name}</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>{paymentRecord.dog.breed}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* User */}
                                    <div className="tablefilelist_grid">

                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={paymentRecord.user.image}
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                alt={paymentRecord.user.name}
                                                style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{paymentRecord.user.name}</div>
                                                <div className="text-muted" style={{ fontSize: 12 }}>{paymentRecord.user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Amount */}
                                    <div className="tablefilelist_grid">
                                        <h4>Amount</h4>
                                        <p>${paymentRecord.amount}</p>
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
