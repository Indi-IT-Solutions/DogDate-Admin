import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, OverlayTrigger, Tooltip, Alert, Spinner, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { ReportService, PaginationMeta } from "@/services";
import { showError, showSuccess, showDeleteConfirmation, handleApiError } from "@/utils/sweetAlert";
import { Report as ReportType } from "@/types/api.types";
import { formatDateTime } from "@/utils/dateUtils";



const safeGetUserData = (userData: any): { name: string; email: string } => {
    if (typeof userData === 'string') {
        return { name: `User ID: ${userData}`, email: 'N/A' };
    }
    if (userData && typeof userData === 'object') {
        return {
            name: userData.name || 'Unknown User',
            email: userData.email || 'N/A'
        };
    }
    return { name: 'Unknown User', email: 'N/A' };
};

const getActionBadge = (action: string) => {
    switch (action) {
        case 'pending':
            return <Badge bg="warning">Pending</Badge>;
        case 'processed':
            return <Badge bg="success">Processed</Badge>;
        default:
            return <Badge bg="secondary">{action}</Badge>;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'active':
            return <Badge bg="success">Active</Badge>;
        case 'deleted':
            return <Badge bg="danger">Deleted</Badge>;
        default:
            return <Badge bg="secondary">{status}</Badge>;
    }
};

const Report: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [deleting, setDeleting] = useState<boolean>(false);
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

    const handleCloseDeleteModal = (): void => {
        setShowDeleteModal(false);
        setSelectedReport(null);
    };

    const handleShowDeleteModal = (report: Report): void => {
        setSelectedReport(report);
        setShowDeleteModal(true);
    };

    const fetchReports = async (page: number = 1, searchTerm: string = '') => {
        try {
            setLoading(true);
            setError("");

            const response: any = await ReportService.getReports({
                page,
                limit: 10,
                search: searchTerm
            });

            setReportData(response.data || []);

            // Debug: Log the first report to see the data structure
            if (response.data && response.data.length > 0) {
                console.log('🔍 First report data:', JSON.stringify(response.data[0], null, 2));
            }
            setPagination({
                current_page: response.meta?.current_page || 1,
                total_pages: response.meta?.total_pages || 1,
                total: response.meta?.total_reports || 0,
                per_page: response.meta?.per_page || 10,
                has_next_page: response.meta?.has_next_page || false,
                has_prev_page: response.meta?.has_prev_page || false,
                page: response.meta?.current_page || 1,
                limit: response.meta?.per_page || 10,
                totalPages: response.meta?.total_pages || 1,
            });
        } catch (err: any) {
            console.error('❌ Error fetching reports:', err);
            handleApiError(err, 'Failed to fetch reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports(1, searchText);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchReports(1, searchText);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    const handlePageChange = (page: number) => {
        fetchReports(page, searchText);
    };

    const handleDeleteReport = async () => {
        if (!selectedReport) return;

        try {
            setDeleting(true);

            await ReportService.deleteReport(selectedReport?._id as string);

            // Refresh the data
            fetchReports(pagination.current_page, searchText);

            showSuccess('Success', 'Report deleted successfully');
            handleCloseDeleteModal();
        } catch (err: any) {
            console.error('❌ Error deleting report:', err);
            handleApiError(err, 'Failed to delete report');
        } finally {
            setDeleting(false);
        }
    };

    const columns: any = [
        {
            name: "ID",
            selector: (row: any) => row?._id.substring(-8),
            width: "100px",
            sortable: true,
            cell: (row: any) => (
                <span className="text-muted">#{row?._id.substring(-8)}</span>
            ),
        },
        {
            name: "Reported By",
            cell: (row: any) => {
                const userData = safeGetUserData(row?.report_from);
                return (
                    <div>
                        <div>{userData.name}</div>
                        <div className="text-muted small">{userData.email}</div>
                    </div>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Reported Against",
            cell: (row: any) => {
                const userData = safeGetUserData(row?.report_against);
                return (
                    <div>
                        <div>{userData.name}</div>
                        <div className="text-muted small">{userData.email}</div>
                    </div>
                );
            },
            width: "200px",
            sortable: true,
        },
        {
            name: "Message",
            selector: (row: any) => row?.message,
            wrap: true,
            sortable: true,
            width: "300px",
            cell: (row: any) => (
                <div style={{
                    maxWidth: '280px',
                    maxHeight: '100px',
                    overflow: 'scroll',
                    wordWrap: 'break-word'
                }} className="custom-scrollbar">
                    {row?.message}
                </div>
            ),
        },
        {
            name: "Action",
            cell: (row: any) => getActionBadge(row?.action),
            width: "120px",
            sortable: true,
        },
        {
            name: "Status",
            cell: (row: any) => getStatusBadge(row?.status),
            width: "100px",
            sortable: true,
        },
        {
            name: "Date",
            cell: (row: any) => formatDateTime(row?.created_at),
            width: "150px",
            sortable: true,
        },
        {
            name: "Actions",
            width: "100px",
            center: true,
            cell: (row: any) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
                >
                    <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleShowDeleteModal(row)}
                        disabled={row?.status === 'deleted'}
                    >
                        <Icon icon="icon-park-outline:close-one" width={16} height={16} />
                    </Button>
                </OverlayTrigger>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5 className="text-dark">Reports</h5>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">Total: {pagination.total || 0} reports</span>
                            {loading && <Spinner animation="border" size="sm" className="ms-2" />}
                        </div>
                        <div className="text-end">
                            <input
                                type="text"
                                placeholder="Search by name, email, message..."
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
                            data={reportData}
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
                                    <p className="text-muted">No reports found</p>
                                </div>
                            }
                            responsive
                            className="custom-table"
                            striped
                            highlightOnHover
                        />
                    </div>

                    {/* {reportData.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing page {pagination?.current_page} of {pagination?.total_pages} ({pagination?.total || 0} total reports)
                            </small>
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">Page {pagination?.current_page} of {pagination?.total_pages}</small>
                            </div>
                        </div>
                    )} */}
                </Col>
            </Row>

            <Modal className="modal_Delete" show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure?</h3>
                        <p>You will not be able to recover the deleted record!</p>
                        {selectedReport && (
                            <div className="mt-3 p-3 bg-light rounded">
                                <small className="text-muted">
                                    <strong>Report:</strong> {selectedReport?.message.substring(0, 100)}...
                                </small>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-danger"
                            onClick={handleCloseDeleteModal}
                            className="px-4"
                            disabled={deleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="px-4"
                            onClick={handleDeleteReport}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Report;
