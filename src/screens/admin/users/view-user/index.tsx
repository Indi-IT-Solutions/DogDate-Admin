import { IMAGES } from "@/contants/images";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Modal, OverlayTrigger, Row, Tab, Tabs, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Matches from "../matches";

interface Payments {
    id: number;
    type: "Breeding" | "Playmates";
    recurring: boolean;
    dog: {
        image: string;
        name: string;
        breed: string;
    };
    amount: number;
    paidOn: string;
    status: "Success" | "Failed";
}
interface Dog {
    id: number;
    image: string;
    name: string;
    type: string;
    breed: string;
    gender: string;
    age: string;
    color: string;
    addedOn: string;
    status: "Active" | "Inactive";
}

const UserView: React.FC = () => {
    const [key, setKey] = useState<string>("dogs");
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const paymentsColumns = [
        {
            name: "Payment ID",
            selector: (row: Payments) => row.id,
            width: "120px",
        },
        {
            name: "Type",
            selector: (row: Payments) => row.type,
            width: "130px",
            cell: (row: Payments) => row.type,
        },
        {
            name: "Recurring",
            selector: (row: Payments) => (row.recurring ? "Yes" : "No"),
            width: "110px",
            cell: (row: Payments) => (
                <span className={`badge ${row.recurring ? "bg-success" : "bg-secondary"}`}>
                    {row.recurring ? "Yes" : "No"}
                </span>
            ),
        },
        {
            name: "Dog",
            width: "220px",
            cell: (row: Payments) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.dog.image}
                        alt={row.dog.name}
                        className="rounded"
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div><strong>{row.dog.name}</strong></div>
                        <small className="text-muted">{row.dog.breed}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Amount",
            selector: (row: Payments) => row.amount,
            cell: (row: Payments) => (
                <span className="text-dark" style={{ fontWeight: 600 }}>${row.amount}</span>
            ),
            width: "110px",
        },
        {
            name: "Paid on",
            selector: (row: Payments) => row.paidOn,
            width: "140px",
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


    const dogsColumns = [
        {
            name: "Dog",
            cell: (row: Dog) => (
                <div className="d-flex gap-3 align-items-center py-2">
                    <img
                        src={row.image}
                        alt={row.name}
                        className="rounded"
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <strong>{row.name}</strong>
                        </div>
                        <small className="text-muted">{row.type}</small>
                        <div>
                            <small className="text-muted">{row.breed}</small>
                        </div>
                    </div>
                </div>
            ),
            width: "250px"
        },
        {
            name: "Gender",
            selector: (row: Dog) => row.gender,
        },
        {
            name: "Age",
            selector: (row: Dog) => row.age,
        },
        {
            name: "Color",
            selector: (row: Dog) => row.color,
        },
        {
            name: "Added on",
            selector: (row: Dog) => row.addedOn,
        },
        {
            name: "Status",
            width: "100px",
            cell: (row: Dog) => (
                <span className={`badge ${row.status === "Active" ? "bg-success" : "bg-danger"}`}>
                    {row.status}
                </span>
            ),
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
                    <Link to="/dogs/view-dog">
                        <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];

    // Dog related content update
    const [paymentsData] = useState<Payments[]>([
        {
            id: 1001,
            type: "Breeding",
            recurring: true,
            dog: {
                image: IMAGES.Dog,
                name: "Bruno",
                breed: "Labrador Retriever"
            },
            amount: 499,
            paidOn: "2025-07-30",
            status: "Success"
        },
        {
            id: 1002,
            type: "Playmates",
            recurring: false,
            dog: {
                image: IMAGES.Dog,
                name: "Bella",
                breed: "Pomeranian"
            },
            amount: 199,
            paidOn: "2025-07-20",
            status: "Success"
        },
        {
            id: 1003,
            type: "Breeding",
            recurring: false,
            dog: {
                image: IMAGES.Dog,
                name: "Coco",
                breed: "German Shepherd"
            },
            amount: 299,
            paidOn: "2025-07-10",
            status: "Failed"
        }
    ]);


    const [dogsData] = useState<Dog[]>([
        {
            id: 1,
            image: IMAGES.Dog,
            name: "Charlie",
            type: "Breeding",
            breed: "Labrador Retriever",
            gender: "Male",
            age: "3 yrs",
            color: "Yellow",
            addedOn: "2024-01-15",
            status: "Active",
        },
        {
            id: 2,
            image: IMAGES.Dog,
            name: "Luna",
            type: "Playmates",
            breed: "Pomeranian",
            gender: "Female",
            age: "2 yrs",
            color: "White",
            addedOn: "2024-02-10",
            status: "Active",
        },
        {
            id: 3,
            image: IMAGES.Dog,
            name: "Max",
            type: "Breeding",
            breed: "German Shepherd",
            gender: "Male",
            age: "4 yrs",
            color: "Black and Tan",
            addedOn: "2023-12-05",
            status: "Active",
        },
    ]);

    const filteredPaymentsData = paymentsData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredDogsData = dogsData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>User Details</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body className="mt-3">
                    <div className="taledtl_div">
                        <Row>
                            <Col md={4}>
                                <div className="talefile_box">
                                    <img className="talefile_img" src={IMAGES.Avatar1} alt="User Image" />
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="talefile_list">
                                    <Row>
                                        <Col lg={6}>
                                            {/* Name */}
                                            <div className="tablefilelist_grid">
                                                <h4>Name</h4>
                                                <p>Albert Stevano</p>
                                            </div>

                                            {/* Email */}
                                            <div className="tablefilelist_grid">
                                                <h4>Email</h4>
                                                <p>emma.thompson@example.com</p>
                                            </div>

                                            {/* Age & Gender */}
                                            <div className="tablefilelist_grid">
                                                <h4>Age Range</h4>
                                                <p>26 yr</p>
                                            </div>
                                            {/* Age & Gender */}
                                            <div className="tablefilelist_grid">
                                                <h4>Phone number</h4>
                                                <p>1234567890</p>
                                            </div>

                                            {/* Location */}
                                            <div className="tablefilelist_grid">
                                                <h4>Location (Partial Postcode)</h4>
                                                <p>New York, USA 10001</p>
                                            </div>
                                            {/* About */}
                                            <div className="tablefilelist_grid">
                                                <h4>About</h4>
                                                <div className="about-box">
                                                    <p>
                                                        Fashion enthusiast with a passion for style and creativity. Always exploring the latest trends and expressing myself through fashion.
                                                    </p>
                                                </div>
                                            </div>

                                        </Col>
                                        <Col lg={6}>


                                            {/* Interests */}
                                            <div className="tablefilelist_grid">
                                                <h4 className="mb-2">Lifestyle & Interests</h4>
                                                <h6 style={{ fontSize: '12px' }}>Hobbies</h6>
                                                <div className="d-flex gap-2 mb-3 flex-wrap">
                                                    <span className="badge bg-primary">Reading</span>
                                                    <span className="badge bg-primary">Traveling</span>
                                                    <span className="badge bg-primary">Cooking</span>
                                                    <span className="badge bg-primary">Photography</span>
                                                    <span className="badge bg-primary">Gardening</span>
                                                    <span className="badge bg-primary">Yoga</span>
                                                    <span className="badge bg-primary">Hiking</span>
                                                </div>
                                                <h6 style={{ fontSize: '12px' }}>Meet Up Availability</h6>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    <span className="badge bg-warning">Mornings</span>
                                                    <span className="badge bg-warning">Afternoons</span>
                                                    <span className="badge bg-warning">Evenings</span>
                                                    <span className="badge bg-warning">Weekdays</span>
                                                    <span className="badge bg-warning">Weekends</span>
                                                </div>
                                            </div>

                                            {/* Type */}
                                            <div className="tablefilelist_grid">
                                                <h4>Type</h4>
                                                <p><span className="badge bg-info">Normal</span></p>
                                            </div>

                                            {/* Status */}
                                            <div className="tablefilelist_grid">
                                                <h4>Status</h4>
                                                <p><span className="badge bg-success">Active</span></p>
                                            </div>

                                        </Col>
                                    </Row>



                                </div>
                            </Col>


                        </Row>

                        <hr className="my-4" />

                        <h4>Dog Details</h4>

                        <div className="talefile_list mt-4">
                            <Row>
                                <Col md={4}>
                                    <div className="talefile_box talefile_box2 d-flex flex-wrap gap-2 p-2 justify-content-center align-items-center" style={{ borderRadius: 16 }}>
                                        {[
                                            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&facepad=2",
                                            "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=facearea&w=400&h=400&facepad=2",
                                            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&facepad=2",
                                            "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=400&facepad=2",
                                            "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=facearea&w=400&h=400&facepad=2"
                                        ].map((src, idx) => (
                                            <img
                                                key={idx}
                                                className="talefile_img shadow"
                                                src={src}
                                                alt={`Dog Image ${idx + 1}`}
                                                style={{

                                                    objectFit: "cover",
                                                    borderRadius: 12,
                                                    border: "2px solid #4BBFF9"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </Col>
                                <Col md={8}>
                                    <Row className="gy-3">
                                        <Col md={6}>
                                            <div className="tablefilelist_grid">
                                                <h4>Dog Name</h4>
                                                <p>Rocky</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Breed</h4>
                                                <p>Labrador</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Breed Classification</h4>
                                                <p>Sporting</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Gender</h4>
                                                <p>Male</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Age</h4>
                                                <p>3 years</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Color</h4>
                                                <p>Golden</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Character</h4>
                                                <p>Friendly</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Personality</h4>
                                                <p>Playful, loves attention, good with kids</p>
                                            </div>

                                        </Col>

                                        <Col md={6}>
                                            <div className="tablefilelist_grid">
                                                <h4>What’s Your Dog Like?</h4>
                                                <p>Walks in the Park, Agility Training, Playing with Toys</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Breed Certification</h4>
                                                <p>Uploaded</p>
                                            </div>

                                            <div className="tablefilelist_grid">
                                                <h4>Other Documents</h4>
                                                <p>Inbreeding Coefficient Certificate</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Dog Date Tagline</h4>
                                                <p>“The best cuddle buddy!”</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Favorite Dog Treat</h4>
                                                <p>Peanut Butter Biscuits</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Breeding Price</h4>
                                                <p>$100</p>
                                            </div>
                                            <div className="tablefilelist_grid">
                                                <h4>Available for Breeding?</h4>
                                                <p>Yes</p>
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Pedigree Section */}
                                    <div className="mt-1">
                                        <Row className="gy-3">
                                            <Col md={12}>
                                                <div className="tablefilelist_grid">
                                                    <h4>Pedigree Name</h4>
                                                    <p>Chopped Pedigree </p>
                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-primary" />
                                                        <span style={{ fontSize: '13px' }}>Pedigree_Document.pdf</span>
                                                    </div>
                                                    <div className="d-flex flex-column align-items-center">
                                                        <Icon icon="mdi:image-outline" width={40} className="mb-2 text-primary" />
                                                        <span style={{ fontSize: '13px' }}>Pedigree_Image.jpg</span>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                    <div className="mt-4">
                                        <h5 className="mb-3">Vaccination Certification</h5>
                                        <Row>
                                            {['Breed certification', 'Vaccination certification', 'Flea Documents'].map((doc, idx) => (
                                                <Col md={4} key={idx}>
                                                    <Card >
                                                        <Card.Body className="text-center" >
                                                            <Icon icon="mdi:file-document-outline" width={32} className="mb-2" />
                                                            <p style={{ fontSize: '14px' }}>{doc}</p>
                                                            <Button variant="outline-primary" size="sm">View</Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                        </div>

                    </div>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Body>
                    <Tabs
                        id="boxer-status-tabs"
                        className="customtabs mb-2"
                        activeKey={key}
                        onSelect={(k: any) => setKey(k || "dogs")}
                    >

                        <Tab eventKey="dogs" title="Dogs">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search dogs..."
                                            className="searchfield"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                    <DataTable
                                        columns={dogsColumns as any}
                                        data={filteredDogsData}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No dogs found for this user</p>
                                            </div>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="matches" title="Matches">
                            <Row>
                                <Col md={12}>
                                    <Matches />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="payments" title="Payments">
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
                        </Tab>



                    </Tabs>
                </Card.Body>
            </Card>

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

export default UserView;
