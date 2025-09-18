import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { FAQService, FAQ } from "@/services";
import { showError, showSuccess, handleApiError } from "@/utils/sweetAlert";
import { formatDateTime } from "@/utils/dateUtils";
import { Link } from "react-router-dom";
import AppLoader from "@/components/Apploader";
import AppLoaderbtn from "@/components/Apploaderbtn";


const FAQs: React.FC = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editFaq, setEditFaq] = useState<FAQ | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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

                await FAQService.deleteFAQ(deleteId);
                showSuccess('Success', 'FAQ deleted successfully');

                // Refresh the data
                await fetchFAQs();
                setDeleteId(null);
                setShowDeleteModal(false);
            } catch (err: any) {
                console.error('❌ Error deleting FAQ:', err);
                handleApiError(err, 'Failed to delete FAQ');
            } finally {
                setDeleting(false);
            }
        }
    };

    const fetchFAQs = async () => {
        try {



            const response = await FAQService.getFAQs({ search: searchText });
            setFaqs(response || []);

            // Debug: Log the first FAQ to see the data structure
            if (response && response.length > 0) {
                console.log('🔍 First FAQ data:', JSON.stringify(response[0], null, 2));
            }
        } catch (err: any) {
            console.error('❌ Error fetching FAQs:', err);
            handleApiError(err, 'Failed to fetch FAQs');
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
            showError('Validation Error', 'Please fill all required fields correctly');
            return;
        }

        try {
            setSaving(true);

            const faqData = {
                order,
                question,
                answer,
                status
            };

            if (editFaq) {
                await FAQService.updateFAQ(editFaq._id, faqData);
                showSuccess('Success', 'FAQ updated successfully');
            } else {
                await FAQService.createFAQ(faqData);
                showSuccess('Success', 'FAQ added successfully');
            }

            // Refresh the data
            await fetchFAQs();
            handleCloseModal();
        } catch (err: any) {
            console.error('❌ Error saving FAQ:', err);

            // Extract the actual error message from the backend
            let errorMessage = 'Failed to save FAQ';

            if (err.message) {
                // If it's a direct error message (like from our service)
                errorMessage = err.message;
            } else if (err.response?.data?.message) {
                // If it's an axios error response
                errorMessage = err.response.data.message;
            } else if (err.data?.message) {
                // If it's a direct response object
                errorMessage = err.data.message;
            }

            // Show the specific error message to the user
            showError('Error', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const columns: TableColumn<FAQ>[] = [
        {
            name: "Order",
            selector: (row: FAQ) => row.order,

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
                <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-secondary'} text-capitalize`}>
                    {row.status}
                </span>
            ),

            sortable: true,
            center: true,
        },
        {
            name: "Updated Date",
            cell: (row: FAQ) => formatDateTime(row.updated_at),

            sortable: true,
        },
        {
            name: "Action",

            cell: (row: FAQ) => (
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
                        <h5 className="text-dark">Frequently Asked Questions</h5>
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
                                <AppLoader size={150} />
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

                    {/* {faqs.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing {faqs.length} FAQs
                            </small>
                        </div>
                    )} */}
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
                            className="py-0"
                        >
                            {saving ? (
                                <>
                                    <AppLoaderbtn size={70} />
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
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-danger"
                            onClick={() => setShowDeleteModal(false)}
                            className="px-4"
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110 py-0"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <AppLoaderbtn size={70} />
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
