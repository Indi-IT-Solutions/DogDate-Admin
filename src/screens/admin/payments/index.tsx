import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";


interface Payments {
    id: number;
    date: string;
    transactionId: string;
    user: string;
    dogName: string;
    meetupWith: string;
    planType: string;
    planName: string;
    paymentMethod: string;
    amount: number;
    status: "Success" | "Failed";
}



const Payments: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");


    const paymentsColumns = [
        {
            name: "Transaction ID",
            selector: (row: Payments) => row.transactionId,
            width: "150px",
        },
        {
            name: "Date",
            selector: (row: Payments) => row.date,
            width: "120px",
        },
        // {
        //     name: "User",
        //     selector: (row: Payments) => row.user,
        //     width: "150px",
        // },
        {
            name: "Dog Name",
            selector: (row: Payments) => row.dogName,
            width: "120px",
        },
        {
            name: "Meetup With",
            selector: (row: Payments) => row.meetupWith,
            width: "180px",
        },
        {
            name: "Type",
            selector: (row: Payments) => row.planType,
        },
        // {
        //     name: "Plan Name",
        //     selector: (row: Payments) => row.planName,
        // },
        // {
        //     name: "Payment Method",
        //     selector: (row: Payments) => row.paymentMethod,
        //     width: "150px",
        // },
        {
            name: "Amount",
            selector: (row: Payments) => row.amount,
            cell: (row: Payments) => (
                <span className="text-dark" style={{ fontWeight: 600 }}>₹{row.amount}</span>
            ),
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
            status: "Success",

        },
        {
            id: 2,
            date: "20 Jul 2025",
            transactionId: "TXN234567890",
            user: "John Carter",
            dogName: "Bella",
            meetupWith: "Coco (Emma Ray)",
            planType: "Playmate",
            planName: "Basic",
            paymentMethod: "Credit Card",
            amount: 199,
            status: "Success",

        },
        {
            id: 3,
            date: "10 Jul 2025",
            transactionId: "TXN345678901",
            user: "Emma Ray",
            dogName: "Coco",
            meetupWith: "Tiger (Arjun Singh)",
            planType: "Playmate",
            planName: "Premium",
            paymentMethod: "Debit Card",
            amount: 299,
            status: "Failed",

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