import React, { useState } from "react";
import { Row, Col, Button, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import { DashboardService, type AccountRequest } from "@/services";
import { showError, showSuccess, handleApiError } from "@/utils/sweetAlert";
import { formatDate } from "@/utils/dateUtils";
import AppLoader from "@/components/Apploader";
import AppLoaderbtn from "@/components/Apploaderbtn";

interface AccountProps {
    data?: AccountRequest[];
    onRefresh?: () => Promise<void>;
}

const Account: React.FC<AccountProps> = ({ data = [], onRefresh }) => {
    const [reason, setReason] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<AccountRequest | null>(null);
    const [loading, setLoading] = useState(false);
    // Modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        setSelectedRequest(null);
        setReason("");
    };

    const [modalType, setModalType] = useState<string>("");
    const handleShow = (type: string, request: AccountRequest) => {
        setModalType(type);
        setSelectedRequest(request);
        setShow(true);
    };

    const handleConfirm = async () => {
        if (!selectedRequest) return;
        try {
            setIsSubmitting(true);
            setLoading(true);
            let response;

            if (modalType === "accept") {
                response = await DashboardService.approveAccountRequest(selectedRequest?.dog?._id, selectedRequest?.user?._id);
            } else {
                if (!reason.trim()) {
                    showError("Validation Error", "Please provide a reason for rejection");
                    return;
                }
                response = await DashboardService.rejectAccountRequest(selectedRequest?.dog?._id, selectedRequest?.user?._id, reason);
            }

            if (response.status === 1) {
                handleClose();
                showSuccess("Success", modalType === "accept" ? "Account request approved successfully!" : "Account request rejected successfully!");
                if (onRefresh) {
                    await onRefresh();
                }
            } else {
                showError("Operation Failed", response.message || "Operation failed");
            }
        } catch (error: any) {
            console.error("Error processing request:", error);
            handleApiError(error, "Failed to process account request");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    const columns = [
        {
            name: "User",
            width: "310px",
            selector: (row: AccountRequest) => row.user.name,
            cell: (row: AccountRequest) => (
                <div className="d-flex align-items-center gap-2">
                    <div>
                        <strong>{row?.user?.name}</strong><br />
                        <small>{row?.user?.email}</small><br />
                        {/* <small>{row.user.phone_number ? `+${row.user.country_code} ${row.user.phone_number}` : ''}</small> */}
                    </div>
                </div>
            ),
        },
        {
            name: "Created On",
            selector: (row: AccountRequest) => formatDate(row.created_at),
            sortable: true,
        },
        {
            name: "Dog",
            selector: (row: AccountRequest) => row.dog.dog_name,
            width: "200px",
            cell: (row: AccountRequest) => (
                <div className="d-flex align-items-center gap-2">
                    <div>
                        <strong>{row.dog.dog_name}</strong><br />
                        <small>{row.dog.profile_type}</small><br />
                        <small>{row.dog.breed}</small>
                    </div>
                </div>
            ),
        },
        {
            name: "Plan",
            selector: (row: AccountRequest) => row.plan || 'Free',
            sortable: true,
        },
        {
            name: "Actions",
            width: "200px",
            center: true,
            sortable: false,
            cell: (row: AccountRequest) => (
                <div className="d-flex align-items-center gap-3">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="view-tooltip">View</Tooltip>}
                    >
                        <Link to={`/users/view-user?id=${row.user._id}`}>
                            <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                        </Link>
                    </OverlayTrigger>
                    <>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="accept-tooltip">Accept</Tooltip>}
                        >
                            <Link to="javascript:void(0)" onClick={() => handleShow("accept", row)}>
                                <Icon icon="mdi:check" width={20} height={20} className="text-success" />
                            </Link>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="reject-tooltip">Reject</Tooltip>}
                        >
                            <Link to="javascript:void(0)" onClick={() => handleShow("reject", row)}>
                                <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
                            </Link>
                        </OverlayTrigger>
                    </>
                    {/* )} */}
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <h5 className="fw-semibold mb-3">Dog Verification Requests ({data.length})</h5>
                    <div className="scrollable-table">
                        <DataTable
                            columns={columns as any}
                            data={data}
                            responsive
                            className="custom-table"
                            noDataComponent={
                                <div className="text-center py-4">
                                    <p>No pending account requests</p>
                                </div>
                            }
                            progressPending={loading}
                            progressComponent={<AppLoader size={150} />}
                        />
                    </div>
                </Col>
            </Row>

            <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        {modalType === "accept" ? (
                            <>
                                <Icon className="delete_icon text-success" icon="mdi:check-circle" />
                                <h3>Confirm Account</h3>
                                <p>
                                    Are you sure you want to approve this account request for <strong>{selectedRequest?.user.name}</strong>? <br />
                                    This action will allow the user to access the platform.
                                </p>
                            </>
                        ) : (
                            <>
                                <Icon className="delete_icon text-danger" icon="mdi:close-circle" />
                                <h3>Reject Account</h3>
                                <div className="mt-3">
                                    <label htmlFor="reason" className="form-label text-start w-100">
                                        Please provide a reason for rejecting <strong>{selectedRequest?.user.name}</strong>'s account:
                                    </label>
                                    <textarea
                                        id="reason"
                                        className="form-control"
                                        rows={5}
                                        value={reason}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
                                        placeholder="Enter reason for rejection..."
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-secondary"
                            onClick={handleClose}
                            className="px-4"
                            style={{ height: '50px' }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant={modalType === "accept" ? "success" : "danger"}
                            className="px-4 min_width110 py-0"
                            onClick={handleConfirm}
                            style={{ height: '50px' }}
                            disabled={isSubmitting || (modalType === "reject" && !reason.trim())}
                        >
                            {isSubmitting ? <AppLoaderbtn size={70} /> : modalType === "accept" ? "Approve" : "Reject"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Account;
