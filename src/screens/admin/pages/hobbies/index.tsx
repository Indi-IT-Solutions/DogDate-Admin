import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { HobbyService, Hobby } from "@/services";

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

const Hobbies: React.FC = () => {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editHobby, setEditHobby] = useState<Hobby | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditHobby(null);
    };

    const handleShowModal = (hobby?: Hobby) => {
        setEditHobby(hobby || null);
        setShowModal(true);
    };

    const fetchHobbies = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await HobbyService.getHobbies();
            setHobbies(response || []);

            // Debug: Log the first hobby to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First hobby data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching hobbies:', err);
            setError(err.message || 'Failed to fetch hobbies');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHobbies();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const hobbyName = String(formData.get("name")).trim();
        const hobbyDescription = String(formData.get("description") || "").trim();

        if (!hobbyName) {
            setError('Hobby name is required');
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const hobbyData = {
                name: hobbyName,
                ...(hobbyDescription && { description: hobbyDescription })
            };

            if (editHobby) {
                await HobbyService.updateHobby(editHobby._id, hobbyData);
                setSuccess('Hobby updated successfully');
            } else {
                await HobbyService.createHobby(hobbyData);
                setSuccess('Hobby added successfully');
            }

            // Refresh the data
            await fetchHobbies();
            handleCloseModal();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            console.error('❌ Error saving hobby:', err);
            setError(err.message || 'Failed to save hobby');
        } finally {
            setSaving(false);
        }
    };

    const filteredHobbies = hobbies.filter(
        (hobby) => hobby.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: TableColumn<Hobby>[] = [
        {
            name: "Sr. No.",
            selector: (_row: Hobby, index: number) => index + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Hobby Name",
            selector: (row: Hobby) => row.name,
            sortable: true,
            wrap: true,
            width: "250px",
        },
        {
            name: "Description",
            selector: (row: Hobby) => row.description || '',
            wrap: true,
            width: "300px",
            cell: (row: Hobby) => (
                <div style={{ maxWidth: '280px' }}>
                    {row.description || 'No description'}
                </div>
            ),
        },
        {
            name: "Status",
            cell: (row: Hobby) => (
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {row.status}
                </span>
            ),
            width: "120px",
            sortable: true,
        },
        {
            name: "Created Date",
            cell: (row: Hobby) => formatDate(row.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Action",
            width: "100px",
            cell: (row: Hobby) => (
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
                    <h5 className="text-dark">Hobbies</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">Total: {hobbies.length} hobbies</span>
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                placeholder="Search hobbies..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <Icon icon="mdi:plus" className="me-1" />
                                Add Hobby
                            </Button>
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={filteredHobbies}
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
                                    <p className="text-muted">No hobbies found</p>
                                </div>
                            }
                            striped
                            highlightOnHover
                        />
                    </div>

                    {filteredHobbies.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {filteredHobbies.length} of {hobbies.length} hobbies
                            </small>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editHobby ? "Edit Hobby" : "Add Hobby"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="hobbyName">
                            <Form.Label>Hobby Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                defaultValue={editHobby ? editHobby.name : ""}
                                placeholder="Enter hobby name"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Enter the name of the hobby (e.g., Swimming, Running, Playing)
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="hobbyDescription">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                defaultValue={editHobby ? editHobby.description || "" : ""}
                                placeholder="Enter hobby description"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Provide a brief description of the hobby
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
                                    {editHobby ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                editHobby ? "Update" : "Add"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default Hobbies;
