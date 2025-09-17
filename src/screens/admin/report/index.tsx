import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, OverlayTrigger, Tooltip, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { ReportService } from "@/services";
import { showSuccess, handleApiError } from "@/utils/sweetAlert";
import { Report as ReportType } from "@/types/api.types";
import { formatDateTime } from "@/utils/dateUtils";
import { Link } from "react-router-dom";
import AppLoader from "@/components/Apploader";
import AppLoaderbtn from "@/components/Apploaderbtn";


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
    const [deleting, setDeleting] = useState<boolean>(false);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(10);

    const handleCloseDeleteModal = (): void => {
        setShowDeleteModal(false);
        setSelectedReport(null);
    };

    const handleShowDeleteModal = (report: ReportType): void => {
        setSelectedReport(report);
        setShowDeleteModal(true);
    };

    const fetchReports = async (page: number = 1, limit: number = 10, search?: string) => {
        try {
            const response: any = await ReportService.getReports({
                page,
                limit,
                search: search || undefined
            });

            if (response?.status === 1) {
                setReportData(response?.data || []);
                setTotalRows(response?.meta?.total_reports || 0);
                setPerPage(response?.meta?.limit || 10);
            } else {
                setReportData([]);
                setTotalRows(0);
            }
        } catch (err: any) {
            console.error('❌ Error fetching reports:', err);
            setReportData([]);
            setTotalRows(0);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchReports(1, 10);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchText.trim() !== '') {
                fetchReports(1, perPage, searchText.trim());
            } else {
                fetchReports(1, perPage);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, perPage]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchReports(page, perPage, searchText.trim() || undefined);
    };

    const handlePerRowsChange = (perPage: number, page: number) => {
        fetchReports(page, perPage, searchText.trim() || undefined);
    };

    const handleDeleteReport = async () => {
        if (!selectedReport) return;

        try {
            setDeleting(true);

            await ReportService.deleteReport(selectedReport?._id as string);

            // Refresh the data
            fetchReports(1, perPage, searchText.trim() || undefined);

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
            sortable: false,
        },
        {
            name: "Message",
            selector: (row: any) => row?.message,
            wrap: true,
            sortable: false,
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
            name: "Status",
            cell: (row: any) => getStatusBadge(row?.status),
            width: "100px",
            sortable: false,
        },
        {
            name: "Date",
            cell: (row: any) => formatDateTime(row?.created_at),
            width: "150px",
            sortable: false,
        },
        {
            name: "Action",
            width: "100px",
            cell: (row: ReportType) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id={`delete-tooltip-${row._id}`}>Delete</Tooltip>}
                >
                    <Link to="javascript:void(0)" onClick={() => handleShowDeleteModal(row)}>
                        <Icon icon="icon-park-outline:close-one" width={16} height={16} className="text-danger" />
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
                        <h5 className="text-dark">Reports</h5>
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
                                    <Icon icon="mdi:alert-circle-outline" width={48} height={48} className="text-muted mb-3" />
                                    <h5 className="text-muted">No Reports Found</h5>
                                    <p className="text-muted">
                                        {searchText ? 'Try adjusting your search criteria' : 'No report records available'}
                                    </p>
                                </div>
                            }
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
                            className="px-4 py-0"
                            onClick={handleDeleteReport}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <>
                                    <AppLoaderbtn size={40} />
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
