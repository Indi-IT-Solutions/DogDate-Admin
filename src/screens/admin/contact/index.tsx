import React, { useState } from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

interface ReportData {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
}

const ContactUs: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const handleClose = (): void => setShow(false);
    const handleShow = (): void => setShow(true);


    const columns = [
        {
            name: "Sr. No.",
            selector: (row: ReportData) => row.id,
            width: "100px",
            sortable: true,
        },
        {
            name: "Full Name",
            selector: (row: ReportData) => row.name,
            width: "180px",
            sortable: true,
        },
        {
            name: "Email Address",
            selector: (row: ReportData) => row.email,

            wrap: true,
            sortable: true,
        },
        {
            name: "Phone Number",
            selector: (row: ReportData) => row.phone,

            sortable: true,
        },
        {
            name: "Query",
            selector: (row: ReportData) => row.message,
            wrap: true,
            sortable: true,
            width: "260px",
        },
        {
            name: "Actions",
            width: "120px",
            center: true,
            cell: () => (
                <Link onClick={handleShow} to="javascript:void(0)">
                    <Icon icon="ri:reply-line" width={20} height={20} className="text-primary" />
                </Link>
            ),
        },
    ];

    const [data] = useState<ReportData[]>([
        {
            id: 1,
            name: "Alex Wilson",
            email: "alexwilson41@gmail.com",
            phone: "+1 786 542 6325",
            message: "I would like to schedule a dog meetup in my area.",
        },
        {
            id: 2,
            name: "Maria James",
            email: "mariajames@gmail.com",
            phone: "+1 555 123 4567",
            message: "How do I join a dog meetup event?",
        },
        {
            id: 3,
            name: "Johnson Charles",
            email: "johnsoncharles@gmail.com",
            phone: "+1 555 987 6543",
            message: "Can I bring more than one dog to the meetup?",
        },
        {
            id: 4,
            name: "Ava Smith",
            email: "avasmith@gmail.com",
            phone: "+1 555 456 7890",
            message: "Is there a fee for attending dog meetups?",
        },
    ]);




    const filteredData = data.filter(
        (item) =>
            JSON.stringify(item).toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5>Contact Us</h5>
                    <div className="text-end mb-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="searchfield"
                            value={searchText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                        />
                    </div>
                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            responsive
                            className="custom-table"
                        />
                    </div>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="modalhead">Reply</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Form>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    defaultValue="Alex Wilson"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Email Address</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Enter your email"
                                    defaultValue="alexwilson41@gmail.com"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    defaultValue="+1 786 542 6325"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Query</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Write your message here..."
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <Button onClick={handleClose} className="btn btn-primary px-4 w-100">
                        Send
                    </Button>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ContactUs;
