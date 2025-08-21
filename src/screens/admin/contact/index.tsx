import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, Alert, Spinner, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ContactService, PaginationMeta } from "@/services";
import { showError, showSuccess, handleApiError } from "@/utils/sweetAlert";
import { formatDateTime } from "@/utils/dateUtils";



const getStatusBadge = (status: string) => {
    switch (status) {
        case 'pending':
            return <Badge bg="warning">Pending</Badge>;
        case 'replied':
            return <Badge bg="info">Replied</Badge>;
        case 'resolved':
            return <Badge bg="success">Resolved</Badge>;
        default:
            return <Badge bg="secondary">{status}</Badge>;
    }
};

const ContactUs: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [replyMessage, setReplyMessage] = useState<string>("");
    const [contactData, setContactData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [sendingReply, setSendingReply] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationMeta>({
        current_page: 1,
        total_pages: 1,
        total: 0,
        per_page: 10,
        has_next_page: false,
        has_prev_page: false,
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const handleClose = (): void => {
        setShowModal(false);
        setSelectedContact(null);
        setReplyMessage("");
    };

    const handleShow = (contact: any): void => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const fetchContactQueries = async (page: number = 1, searchTerm: string = '') => {
        try {

            setError("");

            const response: any = await ContactService.getContactQueries({
                page,
                limit: 10,
                search: searchTerm
            });

            setContactData(response.data || []);
            setPagination({
                current_page: response.meta?.current_page || 1,
                total_pages: response.meta?.total_pages || 1,
                total: response.meta?.total_queries || 0,
                per_page: response.meta?.per_page || 10,
                has_next_page: response.meta?.has_next_page || false,
                has_prev_page: response.meta?.has_prev_page || false,
                page: response.meta?.current_page || 1,
                limit: response.meta?.per_page || 10,
                totalPages: response.meta?.total_pages || 1,
            });
        } catch (err: any) {
            console.error('❌ Error fetching contact queries:', err);
            handleApiError(err, 'Failed to fetch contact queries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactQueries(1, searchText);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchContactQueries(1, searchText);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const handlePageChange = (page: number) => {
        fetchContactQueries(page, searchText);
    };

    const handleSendReply = async () => {
        if (!selectedContact || !replyMessage.trim()) {
            showError('Validation Error', 'Please enter a reply message');
            return;
        }

        try {
            setSendingReply(true);

            await ContactService.sendContactReply({
                contact_id: selectedContact._id,
                reply_message: replyMessage.trim(),
                admin_name: "Admin" // You can get this from auth context
            });

            // Update the contact status to replied
            await ContactService.updateContactStatus(selectedContact._id, {
                query_status: 'replied'
            });

            // Refresh the data
            fetchContactQueries(pagination.current_page, searchText);

            showSuccess('Success', `Reply sent successfully to ${selectedContact.name} (${selectedContact.email})`);
            handleClose();
        } catch (err: any) {
            console.error('❌ Error sending reply:', err);
            handleApiError(err, 'Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const columns: TableColumn<any>[] = [
        {
            name: "Sr. No.",
            selector: (row: any) => contactData.indexOf(row) + 1,
            width: "100px",
            sortable: true,
        },
        {
            name: "Name",
            selector: (row: any) => row.name,
            width: "150px",
            sortable: true,
        },
        {
            name: "Email",
            selector: (row: any) => row.email,
            width: "200px",
            sortable: true,
        },
        {
            name: "Phone",
            cell: (row: any) => (
                <span>
                    {row.country_code && row.phone_number
                        ? `${row.country_code} ${row.phone_number}`
                        : 'N/A'
                    }
                </span>
            ),
            width: "150px",
            sortable: true,
        },
        {
            name: "Query",
            selector: (row: any) => row.query,
            wrap: true,
            sortable: true,
            width: "300px",
            cell: (row: any) => (
                <div style={{ maxWidth: '280px' }}>
                    {row.query.length > 100
                        ? `${row.query.substring(0, 100)}...`
                        : row.query
                    }
                </div>
            ),
        },
        {
            name: "Status",
            cell: (row: any) => getStatusBadge(row.query_status),
            width: "120px",
            sortable: true,
        },
        {
            name: "Date",
            cell: (row: any) => formatDateTime(row.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Actions",
            width: "130px",
            center: true,
            cell: (row: any) => (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShow(row)}
                    disabled={row.query_status === 'resolved'}
                    className=" align-items-center"
                >
                    <Icon icon="ri:reply-line" width={16} height={16} className="me-1" />
                    Reply
                </Button>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5>Contact Us Queries</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">Total: {pagination.total || 0} queries</span>
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                        <div className="text-end">
                            <input
                                type="text"
                                placeholder="Search by name, email, phone..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '300px' }}
                            />
                        </div>
                    </div>

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={contactData}
                            pagination
                            paginationServer
                            paginationTotalRows={pagination.total || 0}
                            paginationDefaultPage={pagination.current_page}
                            paginationPerPage={pagination.per_page}
                            onChangePage={handlePageChange}
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
                                    <p className="text-muted">No contact queries found</p>
                                </div>
                            }
                            responsive
                            className="custom-table"
                            striped
                            highlightOnHover
                        />
                    </div>

                    {/* {contactData.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing page {pagination.current_page} of {pagination.total_pages} ({pagination.total || 0} total queries)
                            </small>
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">Page {pagination.current_page} of {pagination.total_pages}</small>
                            </div>
                        </div>
                    )} */}
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="modalhead">Reply to Query</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedContact && (
                        <div className="modaldelete_div">
                            <Form>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={selectedContact.name}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={selectedContact.email}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={selectedContact.country_code && selectedContact.phone_number
                                            ? `${selectedContact.country_code} ${selectedContact.phone_number}`
                                            : 'N/A'
                                        }
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Original Query</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        value={selectedContact.query}
                                        readOnly
                                        className="bg-light"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Your Reply</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        placeholder="Enter your reply message..."
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                    />
                                    <Form.Text className="text-muted">
                                        This reply will be sent to the user's email address.
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </div>
                    )}

                    <div className="d-flex justify-content-end gap-3">
                        <Button onClick={handleClose} variant="secondary" disabled={sendingReply}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSendReply}
                            className="btn btn-primary px-4"
                            disabled={sendingReply || !replyMessage.trim()}
                        >
                            {sendingReply ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Icon icon="ri:send-plane-line" className="me-1" />
                                    Send Reply
                                </>
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ContactUs;
