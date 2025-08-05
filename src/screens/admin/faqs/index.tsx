import React, { useState } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

interface FaqData {
    id: number;
    order: number;
    question: string;
    answer: string;
    status: "Active" | "Inactive";
}

const initialFaqs: FaqData[] = [
    {
        id: 1,
        order: 1,
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' at login and follow the instructions.",
        status: "Active",
    },
    {
        id: 2,
        order: 2,
        question: "How can I contact support?",
        answer: "You can contact support via the 'Contact' page.",
        status: "Active",
    },
    {
        id: 3,
        order: 3,
        question: "How do I update my profile?",
        answer: "Go to 'Profile Settings' and update your information.",
        status: "Inactive",
    },
];

const FAQs: React.FC = () => {
    const [faqs, setFaqs] = useState<FaqData[]>(initialFaqs);
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editFaq, setEditFaq] = useState<FaqData | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleCloseModal = () => {
        setShowModal(false);
        setEditFaq(null);
    };

    const handleShowModal = (faq?: FaqData) => {
        setEditFaq(faq || null);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            setFaqs(faqs.filter((faq) => faq.id !== deleteId));
            setDeleteId(null);
            setShowDeleteModal(false);
        }
    };

    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const newFaq: FaqData = {
            id: editFaq ? editFaq.id : Date.now(),
            order: Number(formData.get("order")),
            question: String(formData.get("question")),
            answer: String(formData.get("answer")),
            status: formData.get("status") === "Active" ? "Active" : "Inactive",
        };

        if (editFaq) {
            setFaqs(faqs.map((faq) => (faq.id === editFaq.id ? newFaq : faq)));
        } else {
            setFaqs([...faqs, newFaq]);
        }
        handleCloseModal();
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchText.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            name: "Order",
            selector: (row: FaqData) => row.order,
            width: "90px",
            sortable: true,
        },
        {
            name: "Question",
            selector: (row: FaqData) => row.question,
            sortable: true,
            wrap: true,
        },
        {
            name: "Status",
            selector: (row: FaqData) => row.status,
            width: "110px",
            cell: (row: FaqData) => (
                <span className={row.status === "Active" ? "text-success" : "text-danger"}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: "Action",
            width: "120px",
            cell: (row: FaqData) => (
                <div className="d-flex gap-3 justify-content-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`edit-tooltip-${row.id}`}>Edit</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShowModal(row)}>
                            <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row.id}`}>Delete</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleDelete(row.id)}>
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
                        <h5 className="text-dark mb-0">FAQs</h5>
                        <Button variant="primary" onClick={() => handleShowModal()}>
                            <Icon icon="mdi:plus" className="me-1" />
                            Add FAQ
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
                            columns={columns}
                            data={filteredFaqs}
                            pagination
                            responsive
                            className="custom-table"
                            noDataComponent="No FAQs found"
                        />
                    </div>
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
                            <Form.Label>Order</Form.Label>
                            <Form.Control
                                type="number"
                                name="order"
                                min={1}
                                required
                                defaultValue={editFaq ? editFaq.order : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqQuestion">
                            <Form.Label>Question</Form.Label>
                            <Form.Control
                                type="text"
                                name="question"
                                required
                                defaultValue={editFaq ? editFaq.question : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqAnswer">
                            <Form.Label>Answer</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="answer"
                                rows={3}
                                required
                                defaultValue={editFaq ? editFaq.answer : ""}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="faqStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                defaultValue={editFaq ? editFaq.status : "Active"}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" style={{ height: "49px", width: '100px' }} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" style={{ height: "49px", width: '100px' }}>
                            {editFaq ? "Update" : "Add"}
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

export default FAQs;
