import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { DogLikeService, DogLike } from "@/services";
import { formatDateTime } from "@/utils/dateUtils";
import { Link } from "react-router-dom";
import AppLoader from "@/components/Apploader";
import AppLoaderbtn from "@/components/Apploaderbtn";

const DogLikes: React.FC = () => {
    const [dogLikes, setDogLikes] = useState<DogLike[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editDogLike, setEditDogLike] = useState<DogLike | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditDogLike(null);
    };

    const handleShowModal = (dogLike?: DogLike) => {
        setEditDogLike(dogLike || null);
        setShowModal(true);
    };

    const fetchDogLikes = async () => {
        try {

            setError("");

            const response = await DogLikeService.getDogLikes();
            setDogLikes(response || []);

            // Debug: Log the first dog like to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First dog like data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching dog likes:', err);
            setError(err.message || 'Failed to fetch dog likes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDogLikes();
    }, []);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const dogLikeName = String(formData.get("name")).trim();
        const dogLikeDescription = String(formData.get("description") || "").trim();

        if (!dogLikeName) {
            setError('Dog like name is required');
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const dogLikeData = {
                name: dogLikeName,
                ...(dogLikeDescription && { description: dogLikeDescription })
            };

            if (editDogLike) {
                await DogLikeService.updateDogLike(editDogLike._id, dogLikeData);
                setSuccess('Dog like updated successfully');
            } else {
                await DogLikeService.createDogLike(dogLikeData);
                setSuccess('Dog like added successfully');
            }

            // Refresh the data
            await fetchDogLikes();
            handleCloseModal();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            console.error('❌ Error saving dog like:', err);
            setError(err.message || 'Failed to save dog like');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this dog like?')) {
            try {
                await DogLikeService.deleteDogLike(id);
                setSuccess('Dog like deleted successfully');
                await fetchDogLikes();
                handleCloseModal(); // Close modal if it was open for deletion
            } catch (err: any) {
                console.error('❌ Error deleting dog like:', err);
                setError(err.message || 'Failed to delete dog like');
            }
        }
    };

    const filteredDogLikes = dogLikes.filter(
        (dogLike) => dogLike.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns: TableColumn<DogLike>[] = [
        {
            name: "Sr. No.",
            selector: (row: DogLike, rowIndex: number | undefined) => (rowIndex ?? 0) + 1,
            width: "90px",
            sortable: false,
        },
        {
            name: "Dog Like Name",
            selector: (row: DogLike) => row.name,
            sortable: true,
            wrap: true,
            width: "250px",
        },
        {
            name: "Description",
            selector: (row: DogLike) => row.description || '',
            wrap: true,
            width: "300px",
            cell: (row: DogLike) => (
                <div style={{ maxWidth: '280px' }}>
                    {row.description || 'No description'}
                </div>
            ),
        },
        {
            name: "Status",
            cell: (row: DogLike) => (
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'} text-capitalize`}>
                    {row.status}
                </span>
            ),
            width: "120px",
            sortable: true,
        },
        {
            name: "Created Date",
            cell: (row: DogLike) => formatDateTime(row.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Action",
            width: "120px",
            cell: (row: DogLike) => (
                <div className="d-flex gap-2 justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`edit-tooltip-${row._id}`}>Edit</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShowModal(row)}>
                            <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row._id}`}>Delete</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleDelete(row._id)}>
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
                        <h5 className="text-dark">Dog Likes</h5>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                placeholder="Search dog likes..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <Icon icon="mdi:plus" className="me-1" />
                                Add Dog Like
                            </Button>
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={filteredDogLikes}
                            pagination
                            responsive
                            className="custom-table"
                            progressPending={loading}
                            progressComponent={
                                <AppLoader size={150} />
                            }
                            noDataComponent={
                                <div className="text-center p-4">
                                    <p className="text-muted">No dog likes found</p>
                                </div>
                            }
                            striped
                            highlightOnHover
                        />
                    </div>

                    {/* {filteredDogLikes.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {filteredDogLikes.length} of {dogLikes.length} dog likes
                            </small>
                        </div>
                    )} */}
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editDogLike ? "Edit Dog Like" : "Add Dog Like"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="dogLikeName">
                            <Form.Label>Dog Like Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                defaultValue={editDogLike ? editDogLike.name : ""}
                                placeholder="Enter dog like name"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Enter the name of what dogs like (e.g., Belly Rubs, Playing Fetch, Walks)
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="dogLikeDescription">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                defaultValue={editDogLike ? editDogLike.description || "" : ""}
                                placeholder="Enter dog like description"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Provide a brief description of the dog like
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
                            className="py-0"
                        >
                            {saving ? (
                                <>
                                    <AppLoaderbtn size={70} />
                                </>
                            ) : (
                                editDogLike ? "Update" : "Add"
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
};

export default DogLikes;
