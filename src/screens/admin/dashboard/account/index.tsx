import React, { useState } from "react";
import { Row, Col, Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";

interface Users {
    id: number;
    name: string;
    img: string;
    email: string;
    phonenumber: string;
    message: string;
    created: any;
    location: any;
    dog_img: any;
    dogname: any;
    dogcategories: any;
    dogbreed: any;
    plan: string;
}

const Account: React.FC = () => {
    // const [searchText, setSearchText] = useState<string>("");
    const [reason, setReason] = useState<string>("");
    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [modalType, setModalType] = useState<string>("");
    const handleShow = (type: string) => {
        setModalType(type);
        setShow(true);
    };

    const handleConfirm = (reason: string) => {
        console.log(reason);
        handleClose();
    };


    const columns = [
        {
            name: "User",
            width: "310px",
            selector: (row: Users) => row.img,
            cell: (row: Users) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.img}
                        alt={row.name}
                        className="rounded-circle"
                        width={35}
                        height={35}
                        style={{ objectFit: "cover" }}
                    />
                    <div> <strong>{row.name}</strong><br /><small>{row.email}</small><br /><small>{row.phonenumber}</small></div>
                </div>
            ),
        },
        {
            name: "Created On",
            selector: (row: Users) => row.created,
            sortable: true,
        },
        {
            name: "Dog",
            selector: (row: Users) => row.dog_img,
            width: "200px",
            cell: (row: Users) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.dog_img}
                        alt={row.name}
                        className="rounded-circle"
                        width={35}
                        height={35}
                        style={{ objectFit: "cover" }}
                    />
                    <div><strong>{row.dogname}</strong><br /><small>{row.dogcategories}</small><br /><small>{row.dogbreed}</small></div>
                </div>
            ),
        },

        {
            name: "Plan",
            selector: (row: Users) => row.plan,
            sortable: true,
        },
        {
            name: "Actions",
            width: "200px",
            center: true,
            sortable: false,
            cell: () => (
                <div className="d-flex align-items-center gap-3">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="view-tooltip">View</Tooltip>}
                    >
                        <Link to="/users/view-user">
                            <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="accept-tooltip">Accept</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShow("accept")}>
                            <Icon icon="mdi:check" width={20} height={20} className="text-success" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="reject-tooltip">Reject</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShow("reject")}>
                            <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
                        </Link>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    const [data] = useState<Users[]>([
        {
            id: 1,
            name: "Emma Thompson",
            img: IMAGES.Avatar1,
            email: "emma.thompson@example.com",
            phonenumber: "1234567890",
            message: "User was using abusive language.",
            created: "Jan 10, 2024",
            dog_img: IMAGES.Dog,
            location: "SW1A",
            dogname: "Max",
            dogcategories: "Breeding",
            dogbreed: "Labrador",
            plan: "Free"
        },
        {
            id: 2,
            name: "Emma Thompson",
            img: IMAGES.Avatar1,
            email: "emma.thompson@example.com",
            phonenumber: "1234567890",
            message: "User was using abusive language.",
            created: "Jan 10, 2024",
            dog_img: IMAGES.Dog,
            location: "HA30",
            dogname: "Bella",
            dogcategories: "Playmates",
            dogbreed: "Golden Retriever",
            plan: "Express"
        },
        {
            id: 3,
            name: "Emma Thompson",
            img: IMAGES.Avatar1,
            email: "emma.thompson@example.com",
            phonenumber: "1234567890",
            message: "User was using abusive language.",
            created: "Jan 10, 2024",
            dog_img: IMAGES.Dog,
            location: "SW1A",
            dogname: "Charlie",
            dogcategories: "Breeding",
            dogbreed: "German Shepherd",
            plan: "Free"
        },
        {
            id: 4,
            name: "Emma Thompson",
            img: IMAGES.Avatar1,
            email: "emma.thompson@example.com",
            phonenumber: "1234567890",
            message: "User was using abusive language.",
            created: "Jan 10, 2024",
            dog_img: IMAGES.Dog,
            location: "N/A",
            dogname: "Luna",
            dogcategories: "Playmates",
            dogbreed: "Poodle",
            plan: "Express"
        },
    ]);

    // const filteredData = data.filter(
    //     (item) =>
    //         JSON.stringify(item).toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    // );

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5 className="fw-semibold mb-3">Account Requests</h5>
                    {/* <div className="text-end mb-3">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="searchfield"
                            value={searchText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                        />
                    </div> */}
                    <div className="scrollable-table">
                        <DataTable
                            columns={columns as any}
                            data={data}

                            responsive
                            className="custom-table"
                        />
                    </div>
                </Col>
            </Row>

            {/* Accept/Reject Modal */}
            <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        {modalType === "accept" ? (
                            <>
                                <Icon className="delete_icon text-success" icon="mdi:check-circle" />
                                <h3>Confirm Account</h3>
                                <p>
                                    Are you sure you want to approve this account request? <br />
                                    This action will allow the user to access the platform.
                                </p>
                            </>
                        ) : (
                            <>
                                <Icon className="delete_icon text-danger" icon="mdi:close-circle" />

                                <div className="mt-3">
                                    <label htmlFor="reason" className="form-label text-start w-100">
                                        Please provide a reason for rejecting this account:
                                    </label>
                                    <textarea
                                        id="reason"
                                        className="form-control"
                                        rows={5}
                                        value={reason}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                    />
                                </div>
                            </>
                        )}

                    </div>
                    <Button
                        variant="outline-secondary"
                        onClick={handleClose}
                        className="px-4 me-3"
                        style={{
                            height: '50px'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={modalType === "accept" ? "success" : "danger"}
                        className="px-4 min_width110"
                        onClick={() => handleConfirm(reason)}
                        style={{
                            height: '50px'
                        }}
                        disabled={!reason.trim()}
                    >
                        {modalType === "accept" ? "Confirm" : "Cancel"}
                    </Button>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Account;
