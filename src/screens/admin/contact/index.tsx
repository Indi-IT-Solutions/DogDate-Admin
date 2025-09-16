import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { ContactService } from "@/services";
import { showError, showSuccess, handleApiError } from "@/utils/sweetAlert";
import { formatDateTime } from "@/utils/dateUtils";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import AppLoader from "@/components/Apploader";
import AppLoaderbtn from "@/components/Apploaderbtn";


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
    const [sendingReply, setSendingReply] = useState<boolean>(false);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(10);

    const handleClose = (): void => {
        setShowModal(false);
        setSelectedContact(null);
        setReplyMessage("");
    };

    const handleShow = (contact: any): void => {
        setSelectedContact(contact);
        setShowModal(true);
    };

    const fetchContactQueries = async (page: number = 1, limit: number = 10, search?: string) => {
        try {
            const response: any = await ContactService.getContactQueries({
                page,
                limit,
                search: search || undefined
            });

            if (response?.status === 1) {
                setContactData(response?.data || []);
                setTotalRows(response?.meta?.total_queries || 0);
                setPerPage(response?.meta?.limit || 10);
            } else {
                setContactData([]);
                setTotalRows(0);
            }
        } catch (err: any) {
            console.error('❌ Error fetching contact queries:', err);
            setContactData([]);
            setTotalRows(0);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchContactQueries(1, 10);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchText.trim() !== '') {
                fetchContactQueries(1, perPage, searchText.trim());
            } else {
                fetchContactQueries(1, perPage);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, perPage]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchContactQueries(page, perPage, searchText.trim() || undefined);
    };

    const handlePerRowsChange = (perPage: number, page: number) => {
        fetchContactQueries(page, perPage, searchText.trim() || undefined);
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
            fetchContactQueries(1, perPage, searchText.trim() || undefined);

            showSuccess('Success', `Reply sent successfully to ${selectedContact.name} (${selectedContact.email})`);
            handleClose();
        } catch (err: any) {
            console.error('❌ Error sending reply:', err);
            handleApiError(err, 'Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const columns: any[] = [
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
            name: "Action",
            width: "100px",
            cell: (row: any) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`view-tooltip-${row._id}`}>Reply</Tooltip>}
                >
                    <Link to="javascript:void(0)" onClick={() => handleShow(row)}>
                        <Icon icon="tabler:arrow-back-up" width={16} height={16} className="text-primary" />
                    </Link>
                </OverlayTrigger>
            ),
            center: true,
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5>Contact Us Queries</h5>
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
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            progressPending={loading}
                            progressComponent={<AppLoader size={150} />}
                            responsive
                            className="custom-table"
                            striped
                            highlightOnHover
                            noDataComponent={
                                <div className="text-center p-4">
                                    <Icon icon="mdi:email-outline" width={48} height={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">No Contact Queries Found</h5>
                                    <p className="text-muted">
                                        {searchText ? 'Try adjusting your search criteria' : 'No contact queries available'}
                                    </p>
                                </div>
                            }
                        />
                    </div>


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
                            className="btn btn-primary px-4 py-0"
                            disabled={sendingReply || !replyMessage.trim()}
                        >
                            {sendingReply ? (
                                <>
                                    <AppLoaderbtn size={70} />
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
