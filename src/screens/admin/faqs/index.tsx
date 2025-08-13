import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FAQService, FAQ } from "@/services";

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

const FAQs: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editFaq, setEditFaq] = useState<FAQ | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [saving, setSaving] = useState<boolean>(false);
    const [deleting, setDeleting] = useState<boolean>(false);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditFaq(null);
    };

    const handleShowModal = (faq?: FAQ) => {
        setEditFaq(faq || null);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId !== null) {
            try {
                setDeleting(true);
                setError("");
                setSuccess("");

                await FAQService.deleteFAQ(deleteId);
                setSuccess('FAQ deleted successfully');

                // Refresh the data
                await fetchFAQs();
                setDeleteId(null);
                setShowDeleteModal(false);

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess("");
                }, 5000);
            } catch (err: any) {
                console.error('❌ Error deleting FAQ:', err);
                setError(err.message || 'Failed to delete FAQ');
            } finally {
                setDeleting(false);
            }
        }
    };

    const fetchFAQs = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await FAQService.getFAQs({ search: searchText });
            setFaqs(response || []);

            // Debug: Log the first FAQ to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First FAQ data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching FAQs:', err);
            setError(err.message || 'Failed to fetch FAQs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, []);

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchFAQs();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const order = Number(formData.get("order"));
        const question = String(formData.get("question")).trim();
        const answer = String(formData.get("answer")).trim();
        const status = formData.get("status") === "active" ? "active" as const : "inactive" as const;

        if (!question || !answer || order < 1) {
            setError('Please fill all required fields correctly');
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const faqData = {
                order,
                question,
                answer,
                status
            };

            if (editFaq) {
                await FAQService.updateFAQ(editFaq._id, faqData);
                setSuccess('FAQ updated successfully');
            } else {
                await FAQService.createFAQ(faqData);
                setSuccess('FAQ added successfully');
            }

            // Refresh the data
            await fetchFAQs();
            handleCloseModal();

            // Clear success message after 5 seconds
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err: any) {
            console.error('❌ Error saving FAQ:', err);
            setError(err.message || 'Failed to save FAQ');
        } finally {
            setSaving(false);
        }
    };

    const columns: TableColumn<FAQ>[] = [
        {
            name: "Order",
            selector: (row: FAQ) => row.order,
            width: "90px",
            sortable: true,
            center: true,
        },
        {
            name: "Question",
            selector: (row: FAQ) => row.question,
            sortable: true,
            wrap: true,
            width: "300px",
            cell: (row: FAQ) => (
                <div style={{ maxWidth: '280px' }}>
                    {row.question}
                </div>
            ),
        },
        {
            name: "Answer",
            selector: (row: FAQ) => row.answer,
            sortable: true,
            wrap: true,
            width: "400px",
            cell: (row: FAQ) => (
                <div style={{ maxWidth: '380px' }}>
                    {row.answer.length > 100 ? `${row.answer.substring(0, 100)}...` : row.answer}
                </div>
            ),
        },
        {
            name: "Status",
            cell: (row: FAQ) => (
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                    {row.status}
                </span>
            ),
            width: "120px",
            sortable: true,
            center: true,
        },
        {
            name: "Updated Date",
            cell: (row: FAQ) => formatDate(row.updated_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Actions",
            width: "120px",
            cell: (row: FAQ) => (
                <div className="d-flex gap-2 justify-content-center">
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
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row._id}`}>Delete</Tooltip>}
                    >
                        <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(row._id)}
                        >
                            <Icon icon="icon-park-outline:close-one" width={16} height={16} />
                        </Button>
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
                    <h5 className="text-dark">Frequently Asked Questions</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">Total: {faqs.length} FAQs</span>
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                        <div className="d-flex gap-2">
                            <input
                                type="text"
                                placeholder="Search FAQs..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                            <Button variant="primary" onClick={() => handleShowModal()}>
                                <Icon icon="mdi:plus" className="me-1" />
                                Add FAQ
                            </Button>
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={faqs}
                            pagination={false}
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
                                    <p className="text-muted">No FAQs found</p>
                                </div>
                            }
                            striped
                            highlightOnHover
                        />
                    </div>

                    {faqs.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {faqs.length} FAQs
                            </small>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Add/Edit Modal */}
            <Modal className="edit_modal" show={showModal} onHide={handleCloseModal} centered>
                <Form onSubmit={handleSave}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editFaq ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="faqOrder">
                            <Form.Label>Order *</Form.Label>
                            <Form.Control
                                type="number"
                                name="order"
                                min={1}
                                required
                                defaultValue={editFaq ? editFaq.order : ""}
                                placeholder="Enter order number"
                                disabled={saving}
                            />
                            <Form.Text className="text-muted">
                                Order determines the display sequence (1, 2, 3...)
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqQuestion">
                            <Form.Label>Question *</Form.Label>
                            <Form.Control
                                type="text"
                                name="question"
                                required
                                defaultValue={editFaq ? editFaq.question : ""}
                                placeholder="Enter the question"
                                disabled={saving}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqAnswer">
                            <Form.Label>Answer *</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="answer"
                                rows={4}
                                required
                                defaultValue={editFaq ? editFaq.answer : ""}
                                placeholder="Enter the answer"
                                disabled={saving}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                defaultValue={editFaq ? editFaq.status : "active"}
                                required
                                disabled={saving}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Inactive FAQs won't be shown to users
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
                                    {editFaq ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                editFaq ? "Update" : "Add"
                            )}
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
                        <p>You will not be able to recover the deleted FAQ!</p>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                        <Button
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4 me-3"
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Ok'
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default FAQs;
