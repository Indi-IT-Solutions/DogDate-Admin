import { IMAGES } from "@/contants/images";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Dog {
    id: number;
    image: string;
    name: string;
    breed: string;
    paymentStatus: string;
}

interface User {
    id: number;
    image: string;
    name: string;
    email: string;
}

interface LostMatch {
    id: number;
    myDog: Dog;
    otherDog: Dog;
    otherUser: User;
    lostOn: string;
}

const LostMatches: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const matchesColumns = [
        {
            name: "Sr. No.",
            selector: (row: LostMatch) => row.id,
            width: '80px'
        },
        {
            name: "My Dog",
            cell: (row: LostMatch) => (
                <Link to={`/dogs/${row.myDog.id}`} className="text-decoration-none text-dark">
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={row.myDog.image}
                            alt={row.myDog.name}
                            className="rounded"
                            width={40}
                            height={40}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{row.myDog.name}</div>
                            <div style={{ fontSize: 12 }}>{row.myDog.breed}</div>
                            <span className={`badge ${row.myDog.paymentStatus === "Paid" ? "bg-success" : "bg-danger"}`}>
                                {row.myDog.paymentStatus}
                            </span>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            name: "Other Dog",
            cell: (row: LostMatch) => (
                <Link to={`/dogs/${row.otherDog.id}`} className="text-decoration-none text-dark">
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={row.otherDog.image}
                            alt={row.otherDog.name}
                            className="rounded"
                            width={40}
                            height={40}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{row.otherDog.name}</div>
                            <div style={{ fontSize: 12 }}>{row.otherDog.breed}</div>
                            <span className={`badge ${row.otherDog.paymentStatus === "Paid" ? "bg-success" : "bg-danger"}`}>
                                {row.otherDog.paymentStatus}
                            </span>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            name: "Other User",
            cell: (row: LostMatch) => (
                <Link to={`/users/${row.otherUser.id}`} className="text-decoration-none text-dark">
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={row.otherUser.image}
                            alt={row.otherUser.name}
                            className="rounded-circle"
                            width={36}
                            height={36}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{row.otherUser.name}</div>
                            <div style={{ fontSize: 12 }}>{row.otherUser.email}</div>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            name: "Lost On",
            selector: (row: LostMatch) => row.lostOn,
            sortable: true,
        },
    ];

    // Example data
    const [matchesData] = useState<LostMatch[]>([
        {
            id: 1,
            myDog: {
                id: 101,
                image: IMAGES.Dog,
                name: "Bella",
                breed: "Labrador",
                paymentStatus: "Paid",
            },
            otherDog: {
                id: 201,
                image: IMAGES.Dog,
                name: "Luna",
                breed: "Golden Retriever",
                paymentStatus: "Unpaid",
            },
            otherUser: {
                id: 301,
                image: IMAGES.Avatar1,
                name: "John Doe",
                email: "john@example.com",
            },
            lostOn: "2024-06-01",
        },
        {
            id: 2,
            myDog: {
                id: 102,
                image: IMAGES.Dog,
                name: "Max",
                breed: "Beagle",
                paymentStatus: "Paid",
            },
            otherDog: {
                id: 202,
                image: IMAGES.Dog,
                name: "Charlie",
                breed: "Poodle",
                paymentStatus: "Paid",
            },
            otherUser: {
                id: 302,
                image: IMAGES.Avatar2,
                name: "Jane Smith",
                email: "jane@example.com",
            },
            lostOn: "2024-06-02",
        },
        // ...etc
    ]);

    const filteredMatchesData = matchesData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <React.Fragment>
            <h4 className="mb-0" style={{ fontSize: "18px", fontWeight: "500" }}>Lost Matches</h4>
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
                columns={matchesColumns as any}
                data={filteredMatchesData}
                pagination
                responsive
                className="custom-table"
            />

            {/* Delete Modal */}
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

export default LostMatches;
