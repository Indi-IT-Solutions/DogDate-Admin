import React, { useState } from "react";
import { Row, Col, Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

interface ReportData {
    id: number;
    reportedBy: {
        name: string;
        email: string;
    };
    reportedTo: {
        name: string;
        email: string;
    };
    reason: string;
    date: string;
}

const Report: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const handleClose = (): void => setShow(false);
    const handleShow = (): void => setShow(true);

    const columns = [
        {
            name: "ID",
            selector: (row: ReportData) => row.id,
            width: "80px",
            sortable: true,
        },
        {
            name: "Reported By",
            cell: (row: ReportData) => (
                <div>
                    <div>{row.reportedBy.name}</div>
                    <div className="text-mute small">{row.reportedBy.email}</div>
                </div>
            ),
            width: "230px",
            sortable: true,
        },
        {
            name: "Reported To",
            cell: (row: ReportData) => (
                <div>
                    <div>{row.reportedTo.name}</div>
                    <div className="text-mute small">{row.reportedTo.email}</div>
                </div>
            ),
            width: "200px",
            sortable: true,
        },
        {
            name: "Reason",
            selector: (row: ReportData) => row.reason,

            sortable: true,
        },
        {
            name: "Date",
            selector: (row: ReportData) => row.date,
            sortable: true,
        },
        {
            name: "Actions",
            width: "100px",
            center: true,
            fixed: "right",

            cell: () => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="close-tooltip">Delete</Tooltip>}
                >
                    <Link to="javascript:void(0)" onClick={handleShow}>
                        <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];

    const [data] = useState<ReportData[]>([
        {
            id: 1,
            reportedBy: {
                name: "Maria James",
                email: "mariajames@gmail.com"
            },
            reportedTo: {
                name: "John Smith",
                email: "johnsmith@gmail.com"
            },
            reason: "Abusive Language",
            date: "2024-01-15"
        },
        {
            id: 2,
            reportedBy: {
                name: "Johnson Charles",
                email: "johnsoncharles@gmail.com"
            },
            reportedTo: {
                name: "David Wilson",
                email: "davidwilson@gmail.com"
            },
            reason: "Inappropriate Behavior",
            date: "2024-01-14"
        },
        {
            id: 3,
            reportedBy: {
                name: "Ava Smith",
                email: "avasmith@gmail.com"
            },
            reportedTo: {
                name: "Emma Davis",
                email: "emmadavis@gmail.com"
            },
            reason: "Harassment",
            date: "2024-01-13"
        },
        {
            id: 4,
            reportedBy: {
                name: "Michael Brown",
                email: "michaelbrown@gmail.com"
            },
            reportedTo: {
                name: "Sarah Johnson",
                email: "sarahjohnson@gmail.com"
            },
            reason: "Spam Content",
            date: "2024-01-12"
        },
        {
            id: 5,
            reportedBy: {
                name: "Emily Davis",
                email: "emilydavis@gmail.com"
            },
            reportedTo: {
                name: "James Wilson",
                email: "jameswilson@gmail.com"
            },
            reason: "Fake Profile",
            date: "2024-01-11"
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
                    <h5 className="text-dark">Reports</h5>
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

            <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure ?</h3>
                        <p>You will not be able to recover the deleted record!</p>
                    </div>
                    <Button
                        variant="outline-danger"
                        onClick={handleClose}
                        className="px-4 me-3"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        className="px-4 min_width110"
                        onClick={handleClose}
                    >
                        Ok
                    </Button>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Report;
