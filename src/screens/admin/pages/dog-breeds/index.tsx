import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BreedService, DogBreed } from "@/services";

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const DogBreeds: React.FC = () => {
    const [breeds, setBreeds] = useState<DogBreed[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editBreed, setEditBreed] = useState<DogBreed | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditBreed(null);
    };

    const handleShowModal = (breed?: DogBreed) => {
        setEditBreed(breed || null);
        setShowModal(true);
    };

    const fetchBreeds = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await BreedService.getBreeds();
            setBreeds(response || []);

            // Debug: Log the first breed to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First breed data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching breeds:', err);
            setError(err.message || 'Failed to fetch breeds');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBreeds();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const breedName = String(formData.get("name")).trim();

        if (!breedName) {
            setError('Breed name is required');
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            if (editBreed) {
                await BreedService.updateBreed(editBreed._id, { name: breedName });
                setSuccess('Breed updated successfully');
            } else {
                await BreedService.createBreed({ name: breedName });
                setSuccess('Breed added successfully');
            }

            // Refresh the data
            await fetchBreeds();
            handleCloseModal();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            console.error('❌ Error saving breed:', err);
            setError(err.message || 'Failed to save breed');
        } finally {
            setSaving(false);
        }
    };

    const filteredBreeds = breeds.filter(
        (breed) => breed.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: TableColumn<DogBreed>[] = [
        {
            name: "Sr. No.",
            selector: (_row: DogBreed, index: number) => index + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Breed Name",
            selector: (row: DogBreed) => row.name,
            sortable: true,
            wrap: true,
            width: "300px",
        },
        {
            name: "Status",
            cell: (row: DogBreed) => (
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {row.status}
                </span>
            ),
            width: "120px",
            sortable: true,
        },
        {
            name: "Created Date",
            cell: (row: DogBreed) => formatDate(row.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Action",
            width: "100px",
            cell: (row: DogBreed) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`edit-tooltip-${row._id}`}>Edit</Tooltip>}
                >
                    <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => handleShowModal(row)}
                    >
                        <Icon icon="tabler:edit" width={16} height={16} />
                    </Button>
                </OverlayTrigger>
            ),
            center: true,
        },
    ];

    return (
        <>
            <Row>
                <Col lg={12}>
                    <h5 className="text-dark">Dog Breeds</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">Total: {breeds.length} breeds</span>
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                placeholder="Search breeds..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <Icon icon="mdi:plus" className="me-1" />
                                Add Breed
                            </Button>
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={filteredBreeds}
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
                                    <p className="text-muted">No breeds found</p>
                                </div>
                            }
                            striped
                            highlightOnHover
                        />
                    </div>

                    {filteredBreeds.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {filteredBreeds.length} of {breeds.length} breeds
                            </small>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editBreed ? "Edit Breed" : "Add Breed"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="breedName">
                            <Form.Label>Breed Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                defaultValue={editBreed ? editBreed.name : ""}
                                placeholder="Enter breed name"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Enter the name of the dog breed (e.g., Labrador Retriever, German Shepherd)
                            </Form.Text>
                        </Form.Group>
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
                                    {editBreed ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                editBreed ? "Update" : "Add"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default DogBreeds;
