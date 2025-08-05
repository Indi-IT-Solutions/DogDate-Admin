import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Row, Col, OverlayTrigger, Tooltip, Image } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

interface DogInfo {
    name: string;
    breed: string;
    image: string;
}

interface UserInfo {
    name: string;
    email: string;
    image: string;
}

interface Payments {
    id: number;
    type: "Breeding" | "Playmates" | "Registration";
    recurring: boolean;
    dog: DogInfo;
    user: UserInfo;
    amount: number;
    paidOn: string;
    status: "Success" | "Failed";
}

const Payments: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");

    const paymentsColumns = [
        {
            name: "Payment ID",
            selector: (row: Payments) => row.id,
            width: "120px",
        },
        {
            name: "Type",
            selector: (row: Payments) => row.type,
            width: "120px",
        },

        {
            name: "Dog",
            width: "220px",
            cell: (row: Payments) => (
                <div className="d-flex align-items-center">
                    <Image
                        src={row.dog.image}
                        roundedCircle
                        width={40}
                        height={40}
                        alt={row.dog.name}
                        style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{row.dog.name}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{row.dog.breed}</div>
                    </div>
                </div>
            ),
        },
        {
            name: "User",
            width: "260px",
            cell: (row: Payments) => (
                <div className="d-flex align-items-center">
                    <Image
                        src={row.user.image}
                        roundedCircle
                        width={40}
                        height={40}
                        alt={row.user.name}
                        style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                    />
                    <div>
                        <div style={{ fontWeight: 600 }}>{row.user.name}</div>
                        <div className="text-muted" style={{ fontSize: 12 }}>{row.user.email}</div>
                    </div>
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row: Payments) => row.amount,
            cell: (row: Payments) => (
                <span className="text-dark" style={{ fontWeight: 600 }}>₹{row.amount}</span>
            ),
            width: "110px",
        },

        {
            name: "Status",
            cell: (row: Payments) => (
                <span className={`badge ${row.status === "Success" ? "bg-success" : "bg-danger"}`}>
                    {row.status}
                </span>
            ),
            width: "100px"
        },
        {
            name: "Actions",
            center: true,
            sortable: false,
            cell: () => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="view-tooltip">View</Tooltip>}
                >
                    <Link to="/payments/view-payment">
                        <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];

    const [paymentsData] = useState<Payments[]>([
        {
            id: 1001,
            type: "Breeding",
            recurring: true,
            dog: {
                name: "Bruno",
                breed: "Labrador Retriever",
                image: IMAGES.Dog
            },
            user: {
                name: "Priya Mehta",
                email: "priya.mehta@email.com",
                image: "https://randomuser.me/api/portraits/women/44.jpg"
            },
            amount: 499,
            paidOn: "30 Jul 2025",
            status: "Success"
        },
        {
            id: 1002,
            type: "Playmates",
            recurring: false,
            dog: {
                name: "Bella",
                breed: "Golden Retriever",
                image: IMAGES.Dog
            },
            user: {
                name: "John Carter",
                email: "john.carter@email.com",
                image: "https://randomuser.me/api/portraits/men/32.jpg"
            },
            amount: 199,
            paidOn: "20 Jul 2025",
            status: "Success"
        },
        {
            id: 1003,
            type: "Registration",
            recurring: false,
            dog: {
                name: "Coco",
                breed: "Poodle",
                image: IMAGES.Dog
            },
            user: {
                name: "Emma Ray",
                email: "emma.ray@email.com",
                image: "https://randomuser.me/api/portraits/women/65.jpg"
            },
            amount: 299,
            paidOn: "10 Jul 2025",
            status: "Failed"
        }
    ]);

    const filteredPaymentsData = paymentsData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
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
                        columns={paymentsColumns as any}
                        data={filteredPaymentsData}
                        pagination
                        responsive
                        className="custom-table"
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Payments;