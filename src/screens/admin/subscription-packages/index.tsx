import React, { useState } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

type SubscriptionType = "Breeding" | "Breeding" | "Playmates";
type IntervalType = "One time" | "Monthly" | "Yearly";

interface DataType {
    id: number;
    type: SubscriptionType;
    title: string;
    amount: string;
    interval: IntervalType;
    matches: number | string;
    features: string[];
}

const defaultEditData: DataType = {
    id: 0,
    type: "Breeding",
    title: "",
    amount: "",
    interval: "One time",
    matches: "",
    features: [],
};

const SubscriptionPackages: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editData, setEditData] = useState<DataType>(defaultEditData);

    const handleCloseModal = (): void => setShowModal(false);

    const handleShowModal = (row?: DataType): void => {
        if (row) {
            setEditData({
                ...row,
                features: [...row.features],
            });
        } else {
            setEditData(defaultEditData);
        }
        setShowModal(true);
    };

    const columns = [
        {
            name: "Sr. No.",
            selector: (row: DataType) => row.id,
            width: "100px",
            sortable: true,
        },
        {
            name: "Type",
            selector: (row: DataType) => row.type,
            width: "140px",
            sortable: true,
        },
        {
            name: "Title",
            selector: (row: DataType) => row.title,
            sortable: true,
            width: "150px",
        },
        {
            name: "Amount",
            selector: (row: DataType) => row.amount,
            sortable: true,
            width: "120px",
        },
        {
            name: "Interval",
            selector: (row: DataType) => row.interval,
            sortable: true,
            width: "120px",
        },
        {
            name: "Matches",
            selector: (row: DataType) => row.matches,
            sortable: true,
            width: "110px",
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
            sortable: false,
            wrap: true,
        },
        {
            name: "Actions",
            minWidth: "100px",
            allowOverflow: true,
            button: true,
            cell: (row: DataType) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`edit-tooltip-${row.id}`}>Edit</Tooltip>}
                >
                    <Link to="#" onClick={() => handleShowModal(row)}>
                        <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];

    const data: DataType[] = [
        {
            id: 1,
            type: "Breeding",
            title: "Free",
            amount: "$0",
            interval: "One time",
            matches: "3/day",
            features: [
                "Create up to 3 dog profiles per day",
                "Basic dog filters (age, breed, location)",
            ],
        },
        {
            id: 2,
            type: "Breeding",
            title: "Express",
            amount: "$5.99",
            interval: "Monthly",
            matches: "Unlimited",
            features: [
                "Unlimited dog profile creation",
                "breed, health status, pedigree",
                "Access to dog breeding match suggestions",
            ],
        },
        {
            id: 3,
            type: "Playmates",
            title: "Free",
            amount: "$4.99",
            interval: "Yearly",
            matches: 100,
            features: [
                "100 dog playmate matches per year",
                "Priority support for dog owners",
                "Exclusive dog events and meetups",
            ],
        },
    ];

    const filteredData = data.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    // Handle form changes in modal
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "features") {
            setEditData({
                ...editData,
                features: value.split("\n").map(f => f.trim()).filter(f => f),
            });
        } else if (name === "matches") {
            setEditData({
                ...editData,
                matches: value,
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

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

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="modalhead">Edit Subscription</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Form>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Type</Form.Label>
                                <Form.Select
                                    name="type"
                                    value={editData.type}
                                    onChange={handleEditChange}
                                >

                                    <option value="Breeding">Breeding</option>
                                    <option value="Playmates">Playmates</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={editData.title}
                                    placeholder="Enter title"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="amount"
                                    value={editData.amount}
                                    placeholder="Enter amount"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Interval</Form.Label>
                                <Form.Select
                                    name="interval"
                                    value={editData.interval}
                                    onChange={handleEditChange}
                                >
                                    <option value="One time">One time</option>
                                    <option value="Monthly">Monthly</option>
                                    <option value="Yearly">Yearly</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Matches</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="matches"
                                    value={editData.matches}
                                    placeholder="Enter matches (e.g. 3/day, Unlimited, 100)"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Features</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="features"
                                    rows={4}
                                    value={editData.features.join("\n")}
                                    placeholder="Enter features (one per line)"
                                    onChange={handleEditChange}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <Button onClick={handleCloseModal} className="btn btn-primary px-4 w-100">
                        Update
                    </Button>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default SubscriptionPackages;
