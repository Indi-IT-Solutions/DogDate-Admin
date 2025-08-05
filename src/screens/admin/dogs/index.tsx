import React, { useState } from "react";
import { Row, Col, Button, Modal, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { IMAGES } from "@/contants/images";

interface DogData {
    id: number;
    dog: {
        image: string;
        name: string;
        type: string;
        breed: string;
    };
    user: {
        image: string;
        name: string;
        email: string;
    };
    gender: "Male" | "Female";
    age: number; // in years
    color: string;
    addedOn: string;
    status: "Active" | "Blocked";
}

const Dogs: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [selectedDogId, setSelectedDogId] = useState<number | null>(null);
    const [data, setData] = useState<DogData[]>([
        {
            id: 1,
            dog: {
                image: IMAGES.Dog,
                name: "Buddy",
                type: "Breeding",
                breed: "Golden Retriever"
            },
            user: {
                image: IMAGES.Avatar1,
                name: "Maria James",
                email: "mariajames@gmail.com"
            },
            gender: "Male",
            age: 3,
            color: "Golden",
            addedOn: "2024-01-15",
            status: "Active"
        },
        {
            id: 2,
            dog: {
                image: IMAGES.Dog,
                name: "Max",
                type: "Playmates",
                breed: "German Shepherd"
            },
            user: {
                image: IMAGES.Avatar2,
                name: "Johnson Charles",
                email: "johnsoncharles@gmail.com"
            },
            gender: "Male",
            age: 4,
            color: "Black & Tan",
            addedOn: "2024-01-14",
            status: "Blocked"
        },
        {
            id: 3,
            dog: {
                image: IMAGES.Dog,
                name: "Bella",
                type: "Breeding",
                breed: "Labrador"
            },
            user: {
                image: IMAGES.Avatar3,
                name: "Ava Smith",
                email: "avasmith@gmail.com"
            },
            gender: "Female",
            age: 2,
            color: "Yellow",
            addedOn: "2024-01-13",
            status: "Active"
        },
        {
            id: 4,
            dog: {
                image: IMAGES.Dog,
                name: "Rocky",
                type: "Playmates",
                breed: "Boxer"
            },
            user: {
                image: IMAGES.Avatar4,
                name: "Michael Brown",
                email: "michaelbrown@gmail.com"
            },
            gender: "Male",
            age: 5,
            color: "Brindle",
            addedOn: "2024-01-12",
            status: "Active"
        },
        {
            id: 5,
            dog: {
                image: IMAGES.Dog,
                name: "Lucy",
                type: "Breeding",
                breed: "Poodle"
            },
            user: {
                image: IMAGES.Avatar5,
                name: "Emily Davis",
                email: "emilydavis@gmail.com"
            },
            gender: "Female",
            age: 1,
            color: "White",
            addedOn: "2024-01-11",
            status: "Blocked"
        },
    ]);

    const handleClose = (): void => setShow(false);
    const handleShow = (id: number): void => {
        setSelectedDogId(id);
        setShow(true);
    };

    const handleToggleStatus = () => {
        if (selectedDogId !== null) {
            setData(prev =>
                prev.map(dog =>
                    dog.id === selectedDogId
                        ? {
                            ...dog,
                            status: dog.status === "Active" ? "Blocked" : "Active"
                        }
                        : dog
                )
            );
        }
        setShow(false);
    };

    const columns = [
        {
            name: "Dog",
            cell: (row: DogData) => (
                <div className="d-flex align-items-center">
                    <img
                        src={row.dog.image}
                        alt={row.dog.name}
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", marginRight: 10 }}
                    />
                    <div>
                        <div className="fw-bold">{row.dog.name}</div>
                        <div className="text-muted small">{row.dog.type}</div>
                        <div className="text-muted small">{row.dog.breed}</div>
                    </div>
                </div>
            ),
            minWidth: "220px"
        },
        {
            name: "User",
            cell: (row: DogData) => (
                <div className="d-flex align-items-center">
                    <img
                        src={row.user.image}
                        alt={row.user.name}
                        style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", marginRight: 8 }}
                    />
                    <div>
                        <div>{row.user.name}</div>
                        <div className="text-muted small">{row.user.email}</div>
                        <div className="text-muted small">{row.gender}</div>
                    </div>
                </div>
            ),
            minWidth: "220px"
        },

        {
            name: "Age",
            selector: (row: DogData) => `${row.age} yr${row.age > 1 ? "s" : ""}`,
            width: "80px",
            sortable: true,
        },
        {
            name: "Color",
            selector: (row: DogData) => row.color,
            width: "100px",
            sortable: true,
        },
        {
            name: "Added On",
            selector: (row: DogData) => row.addedOn,
            width: "120px",
            sortable: true,
        },
        {
            name: "Status",
            cell: (row: DogData) => (
                <Badge bg={row.status === "Active" ? "success" : "danger"}>
                    {row.status}
                </Badge>
            ),
            width: "100px",
            sortable: true,
        },
        {
            name: "Action",
            width: "140px",
            center: true,
            cell: (row: DogData) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`view-tooltip-${row.id}`}>View</Tooltip>}
                    >
                        <Link to={`/dogs/view-dog`}>
                            <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`block-tooltip-${row.id}`}>
                                {row.status === "Active" ? "Block" : "Unblock"}
                            </Tooltip>
                        }
                    >
                        <Link to="#" onClick={e => { e.preventDefault(); handleShow(row.id); }}>
                            <Icon
                                icon={row.status === "Active" ? "material-symbols-light:block" : "mdi:check-circle-outline"}
                                width={22}
                                height={22}
                                className={row.status === "Active" ? "text-danger" : "text-success"}
                            />
                        </Link>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    const filteredData = data.filter(
        (item) =>
            JSON.stringify(item)
                .toLowerCase()
                .indexOf(searchText.toLowerCase()) !== -1
    );

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5 className="text-dark">Dogs</h5>
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
                        <h3>
                            {selectedDogId !== null && data.find(d => d.id === selectedDogId)?.status === "Active"
                                ? "Block Dog?"
                                : "Unblock Dog?"}
                        </h3>
                        <p>
                            {selectedDogId !== null && data.find(d => d.id === selectedDogId)?.status === "Active"
                                ? "Are you sure you want to block this dog? The user will not be able to access this dog's profile."
                                : "Are you sure you want to unblock this dog? The user will regain access to this dog's profile."}
                        </p>
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
                        onClick={handleToggleStatus}
                    >
                        Ok
                    </Button>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Dogs;
