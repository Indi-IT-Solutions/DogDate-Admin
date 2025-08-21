import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Form, OverlayTrigger, Tooltip, Alert, Spinner } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { SubscriptionService, SubscriptionPackage, PaginationMeta } from "@/services";
import { formatDate } from "@/utils/dateUtils";

// Helper function to format amount
const formatAmount = (amount: number): string => {
    return amount === 0 ? "Free" : `$${amount.toFixed(2)}`;
};



const defaultEditData: Partial<SubscriptionPackage> = {
    type: "Breeding",
    title: "",
    amount: 0,
    interval: "One time",
    matches: "",
    features: [],
    iap_product_id: "",
};

const SubscriptionPackages: React.FC = () => {
    const [searchText, setSearchText] = useState("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const [editData, setEditData] = useState<Partial<SubscriptionPackage>>(defaultEditData);
    const [subscriptionData, setSubscriptionData] = useState<SubscriptionPackage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
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

    const handleCloseModal = (): void => {
        setShowModal(false);
        setIsCreateMode(false);
        setEditData(defaultEditData);
    };

    const handleShowCreateModal = (): void => {
        setIsCreateMode(true);
        setEditData(defaultEditData);
        setShowModal(true);
        setError('');
        setSuccess('');
    };

    const handleShowEditModal = (row: SubscriptionPackage): void => {
        if (row) {
            setIsCreateMode(false);
            setEditData({
                ...row,
                features: [...row.features],
            });
            setShowModal(true);
            setError('');
            setSuccess('');
        }
    };

    // Fetch subscription packages data
    const fetchSubscriptionPackages = async (page: number = 1, searchTerm: string = '') => {
        try {
            setLoading(true);
            setError('');

            const response = await SubscriptionService.getSubscriptionPackages({
                page,
                limit: 10,
                search: searchTerm,
            });

            setSubscriptionData(response.data || []);
            setPagination(response.meta);
        } catch (err: any) {
            console.error('❌ Error fetching subscription packages:', err);
            setError(err.message || 'Failed to fetch subscription packages');
            setSubscriptionData([]);
        } finally {
            setLoading(false);
        }
    };

    // Load subscription packages on component mount
    useEffect(() => {
        fetchSubscriptionPackages(1, searchText);
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchSubscriptionPackages(1, searchText);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchSubscriptionPackages(page, searchText);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Validate required fields for create mode
            if (isCreateMode) {
                const requiredFields = ['type', 'title', 'amount', 'interval', 'matches', 'iap_product_id'];
                const missingFields = requiredFields.filter(field => !editData[field as keyof typeof editData]);

                if (missingFields.length > 0) {
                    setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
                    return;
                }

                if (!editData.features || editData.features.length === 0) {
                    setError('Please add at least one feature');
                    return;
                }

                // Create new package
                await SubscriptionService.createSubscriptionPackage({
                    type: editData.type as "Breeding" | "Playmates",
                    title: editData.title || '',
                    amount: editData.amount || 0,
                    interval: editData.interval as "One time" | "Monthly" | "Yearly",
                    matches: editData.matches || '',
                    features: editData.features || [],
                    iap_product_id: editData.iap_product_id || '',
                });

                setSuccess('Subscription package created successfully!');
                setError('');
                handleCloseModal();
                fetchSubscriptionPackages(1, searchText); // Refresh to first page
            } else {
                // Update existing package
                if (!editData._id) {
                    setError('Cannot edit package without ID');
                    return;
                }

                if (!editData.features || editData.features.length === 0) {
                    setError('Please add at least one feature');
                    return;
                }

                await SubscriptionService.updateSubscriptionPackage(editData._id, {
                    type: editData.type,
                    title: editData.title,
                    interval: editData.interval,
                    matches: editData.matches,
                    features: editData.features,
                });

                setSuccess('Subscription package updated successfully!');
                setError('');
                handleCloseModal();
                fetchSubscriptionPackages(pagination.current_page, searchText);
            }
        } catch (err: any) {
            console.error(`❌ Error ${isCreateMode ? 'creating' : 'updating'} subscription package:`, err);
            setError(err.message || `Failed to ${isCreateMode ? 'create' : 'update'} subscription package`);
        }
    };

    const columns: TableColumn<SubscriptionPackage>[] = [
        {
            name: "Sr. No.",
            selector: (row: SubscriptionPackage) => subscriptionData.indexOf(row) + 1,
            width: "100px",
            sortable: true,
        },
        {
            name: "Type",
            selector: (row: SubscriptionPackage) => row.type,
            width: "140px",
            sortable: true,
            cell: (row: SubscriptionPackage) => (
                <span className={`badge ${row.type === 'Breeding' ? 'bg-success' : 'bg-info'}`}>
                    {row.type}
                </span>
            ),
        },
        {
            name: "Title",
            selector: (row: SubscriptionPackage) => row.title,
            sortable: true,
            width: "150px",
        },
        {
            name: "Amount",
            width: "120px",
            cell: (row: SubscriptionPackage) => (
                <span className="text-success" style={{ fontWeight: 600 }}>
                    {formatAmount(row.amount)}
                </span>
            ),
        },
        {
            name: "Interval",
            selector: (row: SubscriptionPackage) => row.interval,
            sortable: true,
            width: "120px",
            cell: (row: SubscriptionPackage) => (
                <span className={`badge ${row.interval === 'One time' ? 'bg-secondary' : row.interval === 'Monthly' ? 'bg-primary' : 'bg-warning'}`}>
                    {row.interval}
                </span>
            ),
        },
        {
            name: "Matches",
            selector: (row: SubscriptionPackage) => row.matches,
            sortable: true,
            width: "110px",
        },
        {
            name: "Status",
            width: "100px",
            cell: (row: SubscriptionPackage) => (
                <span className={`badge ${row.is_active ? 'bg-success' : 'bg-danger'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            name: "Features",
            cell: (row: SubscriptionPackage) => (
                <div>
                    {row.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className="badge bg-primary me-1 mb-1 p-1" style={{ fontSize: 10 }}>
                            {feature.length > 20 ? feature.substring(0, 20) + '...' : feature}
                        </span>
                    ))}
                    {row.features.length > 2 && (
                        <span className="badge bg-secondary me-1 mb-1 p-1" style={{ fontSize: 10 }}>
                            +{row.features.length - 2} more
                        </span>
                    )}
                </div>
            ),
            sortable: false,
            wrap: true,
        },
        {
            name: "Actions",
            minWidth: "100px",
            allowOverflow: true,
            button: true,
            cell: (row: SubscriptionPackage) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`edit-tooltip-${row._id}`}>Edit</Tooltip>}
                >
                    <Link to="#" onClick={() => handleShowEditModal(row)}>
                        <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];



    // Handle form changes in modal
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "features") {
            setEditData({
                ...editData,
                features: value.split("\n").map(f => f.trim()).filter(f => f),
            });
        } else if (name === "amount") {
            setEditData({
                ...editData,
                [name]: parseFloat(value) || 0,
            });
        } else {
            setEditData({
                ...editData,
                [name]: value,
            });
        }
    };

    return (
        <Row>
            <Col lg={12}>
                <h5>Subscription Packages</h5>

                {error && (
                    <Alert variant="danger" className="mb-3">
                        <Icon icon="mdi:alert-circle" className="me-2" />
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert variant="success" className="mb-3" onClose={() => setSuccess('')} dismissible>
                        <Icon icon="mdi:check-circle" className="me-2" />
                        {success}
                    </Alert>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <span className="text-muted me-2">
                            Total: {pagination.total || 0} packages
                        </span>
                        {loading && (
                            <Spinner animation="border" size="sm" className="ms-2" />
                        )}
                    </div>
                    {/* <div className="d-flex align-items-center gap-3">
                        <input
                            type="text"
                            placeholder="Search packages..."
                            className="searchfield"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            disabled={loading}
                            style={{ minWidth: '250px' }}
                        />
                        <Button
                            variant="primary"
                            onClick={handleShowCreateModal}
                            disabled={loading}
                            className="d-flex align-items-center gap-2"
                        >
                            <Icon icon="mdi:plus" width={16} height={16} />
                            Add New Package
                        </Button>
                    </div> */}
                </div>

                <DataTable
                    columns={columns}
                    data={subscriptionData}
                    pagination
                    paginationServer
                    paginationTotalRows={pagination.total || 0}
                    paginationDefaultPage={pagination.current_page}
                    paginationPerPage={pagination.per_page}
                    onChangePage={handlePageChange}
                    progressPending={loading}
                    progressComponent={
                        <div className="d-flex justify-content-center align-items-center p-4">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <span className="ms-2">Loading subscription packages...</span>
                        </div>
                    }
                    noDataComponent={
                        <div className="text-center p-4">
                            <Icon icon="mdi:package-variant" width={48} height={48} className="text-muted mb-3" />
                            <h5 className="text-muted">No Subscription Packages Found</h5>
                            <p className="text-muted">
                                {searchText ? 'Try adjusting your search criteria' : 'No subscription packages available'}
                            </p>
                        </div>
                    }
                    responsive
                    className="custom-table"
                    striped
                    highlightOnHover
                />

                {/* Pagination Info */}
                {/* {subscriptionData.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                            Showing page {pagination.current_page} of {pagination.total_pages}
                            ({pagination.total || 0} total packages)
                        </small>
                        <div className="d-flex align-items-center">
                            <small className="text-muted me-2">
                                Page {pagination.current_page} of {pagination.total_pages}
                            </small>
                        </div>
                    </div>
                )} */}
            </Col>

            <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="modalhead">
                            {'Edit Subscription Package'}
                        </h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Type *</Form.Label>
                                        <Form.Select
                                            name="type"
                                            value={editData.type || ''}
                                            onChange={handleEditChange}
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        >
                                            <option value="">Select Type</option>
                                            <option value="Breeding">Breeding</option>
                                            <option value="Playmates">Playmates</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Title *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            value={editData.title || ''}
                                            onChange={handleEditChange}
                                            placeholder="Enter package title"
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Amount ($) *</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="amount"
                                            value={editData.amount || ''}
                                            onChange={handleEditChange}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0"
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Interval *</Form.Label>
                                        <Form.Select
                                            name="interval"
                                            value={editData.interval || ''}
                                            onChange={handleEditChange}
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        >
                                            <option value="">Select Interval</option>
                                            <option value="One time">One time</option>
                                            <option value="Monthly">Monthly</option>
                                            <option value="Yearly">Yearly</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>Matches *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="matches"
                                            value={editData.matches || ''}
                                            onChange={handleEditChange}
                                            placeholder="e.g., 10 matches per month"
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3 form-group">
                                        <Form.Label>IAP Product ID *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="iap_product_id"
                                            value={editData.iap_product_id || ''}
                                            onChange={handleEditChange}
                                            placeholder="com.app.product.id"
                                            disabled={!isCreateMode}
                                            className={!isCreateMode ? 'bg-light' : ''}
                                        />
                                        {!isCreateMode && (
                                            <Form.Text className="text-muted">
                                                IAP Product ID cannot be changed after creation
                                            </Form.Text>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3 form-group">
                                <Form.Label>Features *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="features"
                                    rows={6}
                                    value={(editData.features || []).join("\n")}
                                    placeholder="Enter features (one per line)&#10;e.g.,&#10;Unlimited messaging&#10;Priority matching&#10;Advanced filters"
                                    onChange={handleEditChange}
                                />
                                <Form.Text className="text-muted">
                                    {isCreateMode
                                        ? 'Enter each feature on a new line. These features will be displayed to users.'
                                        : 'You can edit the features of this subscription package. Other details are managed by the backend.'
                                    }
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>
                    <Button onClick={handleSubmit} className="btn btn-primary px-4 w-100">
                        {isCreateMode ? 'Create Package' : 'Update Package'}
                    </Button>
                </Modal.Body>
            </Modal>
        </Row>
    );
};

export default SubscriptionPackages;
