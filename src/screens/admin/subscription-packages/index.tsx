import React, { useState } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

interface DataType {
    id: number;
    title: string;
    amount: string;
    features: string[];
}

const SubscriptionPackages: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [show1, setShow1] = useState<boolean>(false);
    const handleClose1 = (): void => setShow1(false);
    const handleShow1 = (): void => {
        setShow1(true);
    };
    const columns = [
        {
            name: "Sr. No.",
            selector: (row: DataType) => row.id,
            width: "100px",
            sortable: true,
        },
        {
            name: "Title",
            selector: (row: DataType) => row.title,
            sortable: true,
            width: "170px",
        },
        {
            name: "Amount",
            selector: (row: DataType) => row.amount,
            sortable: true,
            width: "150px",
        },
        {
            name: "Features",
            cell: (row: DataType) => (
                <div>
                    {row.features.map((feature, index) => (
                        <span key={index} className="badge bg-primary me-2 mb-2 p-2">
                            {feature}
                        </span>
                    ))}
                </div>
            ),
            sortable: true,
            wrap: true,
        },
        {
            name: "Actions",
            minWidth: "100px",
            allowOverflow: true,
            button: true,
            cell: () => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="view-tooltip">Edit</Tooltip>}
                >
                    <Link to="javascript:void(0)" onClick={handleShow1}>
                        <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                    </Link>
                </OverlayTrigger>


            ),
        },
    ];

    const data: DataType[] = [
        {
            id: 1,
            title: "Free Plan",
            amount: "£0",
            features: [
                "Create up to 3 events per day",
                "Basic filters (age, location, category)",
            ],
        },
        {
            id: 2,
            title: "Premium Plan",
            amount: "£5.99",
            features: [
                "Unlimited event creation",
                "Advanced filters: custom budget, Start time",
            ],
        },
    ];

    const filteredData = data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Row>
            <Col lg={12}>
                <h5>Subscription Packages</h5>
                <div className="text-end mb-3">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="searchfield"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    responsive
                    className="custom-table"
                />
            </Col>


            <Modal show={show1} onHide={handleClose1} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="modalhead">Edit Subscription</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Form>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder="Enter title" />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="text" placeholder="Enter amount" />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Features</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Enter features (one per line)"
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <Button onClick={handleClose1} className="btn btn-primary px-4 w-100">
                        Update
                    </Button>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default SubscriptionPackages;
