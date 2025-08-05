import React, { useState } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

interface DogBreed {
    id: number;
    title: string;
}

const initialBreeds: DogBreed[] = [
    { id: 1, title: "Labrador Retriever" },
    { id: 2, title: "German Shepherd" },
    { id: 3, title: "Golden Retriever" },
];

const DogLikes: React.FC = () => {
    const [breeds, setBreeds] = useState<DogBreed[]>(initialBreeds);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editBreed, setEditBreed] = useState<DogBreed | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditBreed(null);
    };

    const handleShowModal = (breed?: DogBreed) => {
        setEditBreed(breed || null);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            setBreeds(breeds.filter((breed) => breed.id !== deleteId));
            setDeleteId(null);
            setShowDeleteModal(false);
        }
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const newBreed: DogBreed = {
            id: editBreed ? editBreed.id : Date.now(),
            title: String(formData.get("title")),
        };

        if (editBreed) {
            setBreeds(breeds.map((breed) => (breed.id === editBreed.id ? newBreed : breed)));
        } else {
            setBreeds([...breeds, newBreed]);
        }
        handleCloseModal();
    };

    const filteredBreeds = breeds.filter(
        (breed) => breed.title.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            name: "Sr. No.",
            selector: (_row: DogBreed, index: number) => index + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Title",
            selector: (row: DogBreed) => row.title,
            sortable: true,
            wrap: true,
        },
        {
            name: "Action",
            width: "120px",
            cell: (row: DogBreed) => (
                <div className="d-flex gap-3 justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`edit-tooltip-${row.id}`}>Edit</Tooltip>}
                    >
                        <Link to="#" onClick={() => handleShowModal(row)}>
                            <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row.id}`}>Delete</Tooltip>}
                    >
                        <Link to="#" onClick={() => handleDelete(row.id)}>
                            <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
                        </Link>
                    </OverlayTrigger>
                </div>
            ),
            center: true,
        },
    ];

    return (
        <>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="text-dark mb-0">Dog Likes</h5>
                        <Button variant="primary" onClick={() => handleShowModal()}>
                            <Icon icon="mdi:plus" className="me-1" />
                            Add Like
                        </Button>
                    </div>
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
                            columns={columns as any}
                            data={filteredBreeds}
                            pagination
                            responsive
                            className="custom-table"
                            noDataComponent="No Likes found"
                        />
                    </div>
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editBreed ? "Edit Like" : "Add Like"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="breedTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                required
                                defaultValue={editBreed ? editBreed.title : ""}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" style={{ height: "49px", width: '100px' }} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" style={{ height: "49px", width: '100px' }}>
                            {editBreed ? "Update" : "Add"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Delete Modal */}
            <Modal className="modal_Delete" show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Body>
                    <div className="modaldelete_div text-center">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure?</h3>
                        <p>You will not be able to recover the deleted like!</p>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <Button
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 me-3"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110"
                            onClick={confirmDelete}
                        >
                            Ok
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default DogLikes;
