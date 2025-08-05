import { IMAGES } from "@/contants/images";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Modal, Row, Tab, Tabs } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";

interface BreedingOwner {
    image: string;
    name: string;
    email: string;
}

interface OtherDog {
    image: string;
    name: string;
    breed: string;
}

interface BreedingRecord {
    id: number;
    otherDog: OtherDog;
    owner: BreedingOwner;
    breedDate: string;
    status: "Success" | "Failed";
}

interface PlaydateRecord {
    id: number;
    otherDog: OtherDog;
    owner: BreedingOwner;
    playDate: string;
}

const ViewDog: React.FC = () => {
    const [key, setKey] = useState<string>("breedings");
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // Updated columns for Breedings (Other Dog, Dog Owner, Breed Date)
    const BreedingsColumns = [
        {
            name: "Other Dog",
            cell: (row: BreedingRecord) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.otherDog.image}
                        alt={row.otherDog.name}
                        className="rounded"
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div><strong>{row.otherDog.name}</strong></div>
                        <small className="text-muted">{row.otherDog.breed}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Dog Owner",
            cell: (row: BreedingRecord) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.owner.image}
                        alt={row.owner.name}
                        className="rounded"
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div><strong>{row.owner.name}</strong></div>
                        <small className="text-muted">{row.owner.email}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Breed Date",
            selector: (row: BreedingRecord) => row.breedDate,

        },
    ];

    // Playdates columns: Other Dog (image, name, breed), Dog Owner (Image, Name,Email), Play date
    const PlaydatesColumns = [
        {
            name: "Other Dog",
            cell: (row: PlaydateRecord) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.otherDog.image}
                        alt={row.otherDog.name}
                        className="rounded"
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div><strong>{row.otherDog.name}</strong></div>
                        <small className="text-muted">{row.otherDog.breed}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Dog Owner",
            cell: (row: PlaydateRecord) => (
                <div className="d-flex align-items-center gap-2">
                    <img
                        src={row.owner.image}
                        alt={row.owner.name}
                        className="rounded"
                        width={40}
                        height={40}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                    />
                    <div>
                        <div><strong>{row.owner.name}</strong></div>
                        <small className="text-muted">{row.owner.email}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Play Date",
            selector: (row: PlaydateRecord) => row.playDate,
        },
    ];


    // Dog related content update
    const [BreedingsData] = useState<BreedingRecord[]>([
        {
            id: 1001,
            otherDog: {
                image: IMAGES.Dog,
                name: "Bruno",
                breed: "Labrador Retriever"
            },
            owner: {
                image: IMAGES.Dog,
                name: "John Doe",
                email: "john@example.com"
            },
            breedDate: "2025-07-30",
            status: "Success"
        },
        {
            id: 1002,
            otherDog: {
                image: IMAGES.Dog,
                name: "Bella",
                breed: "Pomeranian"
            },
            owner: {
                image: IMAGES.Dog,
                name: "Jane Smith",
                email: "jane@example.com"
            },
            breedDate: "2025-07-20",
            status: "Success"
        },
        {
            id: 1003,
            otherDog: {
                image: IMAGES.Dog,
                name: "Coco",
                breed: "German Shepherd"
            },
            owner: {
                image: IMAGES.Dog,
                name: "Alex Brown",
                email: "alex@example.com"
            },
            breedDate: "2025-07-10",
            status: "Failed"
        }
    ]);

    // Playdates data
    const [playdatesData] = useState<PlaydateRecord[]>([
        {
            id: 2001,
            otherDog: {
                image: IMAGES.Dog,
                name: "Buddy",
                breed: "Golden Retriever"
            },
            owner: {
                image: IMAGES.Dog,
                name: "Emily Clark",
                email: "emily@example.com"
            },
            playDate: "2025-08-05"
        },
        {
            id: 2002,
            otherDog: {
                image: IMAGES.Dog,
                name: "Lucy",
                breed: "Beagle"
            },
            owner: {
                image: IMAGES.Dog,
                name: "Michael Lee",
                email: "michael@example.com"
            },
            playDate: "2025-08-10"
        },
        {
            id: 2003,
            otherDog: {
                image: IMAGES.Dog,
                name: "Daisy",
                breed: "Shih Tzu"
            },
            owner: {
                image: IMAGES.Dog,
                name: "Sarah Kim",
                email: "sarah@example.com"
            },
            playDate: "2025-08-15"
        }
    ]);

    const filteredBreedingsData = BreedingsData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredPlaydatesData = playdatesData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );



    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>Dog Details</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body>
                    <div className="taledtl_div mt-2">
                        <div className="talefile_list">
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
                        onSelect={(k: any) => setKey(k || "breedings")}
                    >
                        <Tab eventKey="breedings" title="Breedings">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search breedings..."
                                            className="searchfield"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                    <DataTable
                                        columns={BreedingsColumns as any}
                                        data={filteredBreedingsData}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No breedings found for this user</p>
                                            </div>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="playdates" title="Playdates">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search playdates..."
                                            className="searchfield"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                    <DataTable
                                        columns={PlaydatesColumns as any}
                                        data={filteredPlaydatesData}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No playdates found for this user</p>
                                            </div>
                                        }
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

export default ViewDog;
