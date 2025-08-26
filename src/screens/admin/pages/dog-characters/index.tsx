import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DogCharacterService, DogCharacter } from "@/services";
import { formatDateTime } from "@/utils/dateUtils";
import { Link } from "react-router-dom";


const DogCharacters: React.FC = () => {
    const [dogCharacters, setDogCharacters] = useState<DogCharacter[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editDogCharacter, setEditDogCharacter] = useState<DogCharacter | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditDogCharacter(null);
    };

    const handleShowModal = (dogCharacter?: DogCharacter) => {
        setEditDogCharacter(dogCharacter || null);
        setShowModal(true);
    };

    const fetchDogCharacters = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await DogCharacterService.getDogCharacters();
            setDogCharacters(response || []);

            // Debug: Log the first dog character to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First dog character data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching dog characters:', err);
            setError(err.message || 'Failed to fetch dog characters');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDogCharacters();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const dogCharacterName = String(formData.get("name")).trim();
        const dogCharacterDescription = String(formData.get("description") || "").trim();

        if (!dogCharacterName) {
            setError('Dog character name is required');
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const dogCharacterData = {
                name: dogCharacterName,
                ...(dogCharacterDescription && { description: dogCharacterDescription })
            };

            if (editDogCharacter) {
                await DogCharacterService.updateDogCharacter(editDogCharacter._id, dogCharacterData);
                setSuccess('Dog character updated successfully');
            } else {
                await DogCharacterService.createDogCharacter(dogCharacterData);
                setSuccess('Dog character added successfully');
            }

            // Refresh the data
            await fetchDogCharacters();
            handleCloseModal();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            console.error('❌ Error saving dog character:', err);
            setError(err.message || 'Failed to save dog character');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this dog character?')) {
            try {
                await DogCharacterService.deleteDogCharacter(id);
                setSuccess('Dog character deleted successfully');
                await fetchDogCharacters();
                handleCloseModal(); // Close modal if it was open for deletion
            } catch (err: any) {
                console.error('❌ Error deleting dog character:', err);
                setError(err.message || 'Failed to delete dog character');
            }
        }
    };

    const filteredDogCharacters = dogCharacters.filter(
        (dogCharacter) => dogCharacter.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: TableColumn<DogCharacter>[] = [
        {
            name: "Sr. No.",
            selector: (row: DogCharacter, rowIndex: number | undefined) => (rowIndex ?? 0) + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Character Name",
            selector: (row: DogCharacter) => row.name,
            sortable: true,
            wrap: true,
            width: "250px",
        },
        // {
        //     name: "Description",
        //     selector: (row: DogCharacter) => row.description || '',
        //     wrap: true,
        //     width: "300px",
        //     cell: (row: DogCharacter) => (
        //         <div style={{ maxWidth: '280px' }}>
        //             {row.description || 'No description'}
        //         </div>
        //     ),
        // },
        {
            name: "Status",
            cell: (row: DogCharacter) => (
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'} text-capitalize`}>
                    {row.status}
                </span>
            ),
            width: "120px",
            sortable: true,
        },
        {
            name: "Created Date",
            cell: (row: DogCharacter) => formatDateTime(row.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Action",
            width: "120px",
            cell: (row: DogCharacter) => (
                <div className="d-flex gap-2 justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`edit-tooltip-${row._id}`}>Edit</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShowModal(row)}>
                            <Icon icon="tabler:edit" width={16} height={16} className="text-warning" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row._id}`}>Delete</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleDelete(row._id)}>
                            <Icon icon="icon-park-outline:close-one" width={16} height={16} className="text-danger" />
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
                        <h5 className="text-dark">Dog Characters</h5>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                placeholder="Search dog characters..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <Icon icon="mdi:plus" className="me-1" />
                                Add Character
                            </Button>
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={filteredDogCharacters}
                            pagination
                            responsive
                            className="custom-table"
                            progressPending={loading}
                            progressComponent={
                                <div className="text-center p-4">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            }
                            noDataComponent={
                                <div className="text-center p-4">
                                    <p className="text-muted">No dog characters found</p>
                                </div>
                            }
                            striped
                            highlightOnHover
                        />
                    </div>

                    {/* {filteredDogCharacters.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {filteredDogCharacters.length} of {dogCharacters.length} dog characters
                            </small>
                        </div>
                    )} */}
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editDogCharacter ? "Edit Dog Character" : "Add Dog Character"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="dogCharacterName">
                            <Form.Label>Character Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                defaultValue={editDogCharacter ? editDogCharacter.name : ""}
                                placeholder="Enter character name"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Enter the name of the dog character (e.g., Friendly, Playful, Calm)
                            </Form.Text>
                        </Form.Group>
                        {/* <Form.Group className="mb-3" controlId="dogCharacterDescription">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                defaultValue={editDogCharacter ? editDogCharacter.description || "" : ""}
                                placeholder="Enter character description"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Provide a brief description of the dog character
                            </Form.Text>
                        </Form.Group> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="outline-secondary"
                            onClick={handleCloseModal}
                            disabled={saving}
                            style={{ height: "49px", width: '100px' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={saving}
                            style={{ height: "49px", width: '100px' }}
                        >
                            {saving ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    {editDogCharacter ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                editDogCharacter ? "Update" : "Add"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default DogCharacters;
