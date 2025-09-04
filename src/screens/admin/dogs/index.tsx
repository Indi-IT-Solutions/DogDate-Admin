import React, { useState, useEffect } from "react";
import { Row, Col, Button, Modal, Badge, Alert, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IMAGES } from "@/contants/images";
import { DogService } from "@/services";
import type { Dog, DogFilters, PaginatedResponse } from "@/types/api.types";
import { showError, showSuccess, showDeleteConfirmation, handleApiError } from "@/utils/sweetAlert";
import { getDogProfileImage } from "@/utils/imageUtils";
import { formatDate } from "@/utils/dateUtils";

const Dogs: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState<boolean>(false);
    const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
    const [dogsData, setDogsData] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [totalRows, setTotalRows] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(10);

    // Helper functions
    const safeGetString = (value: any): string => {
        if (!value) return 'N/A';
        if (typeof value === 'string') return value;
        if (typeof value === 'object') {
            if (value.name && typeof value.name === 'string') return value.name;
            if (value.name && typeof value.name === 'object' && value.name.name) return value.name.name;
            if (value._id) return value._id.toString();
        }
        return 'Unknown';
    };

    const getStatusBadge = (status: string) => {
        return status === 'active' ? 'success' : 'danger';
    };



    // Fetch dogs with debounced search
    const fetchDogs = async (page: number = 1, limit: number = 10, search?: string) => {
        try {

            setError("");

            const filters: DogFilters = {
                page,
                limit,
                search: search || undefined,
            };

            const response: any = await DogService.getDogs(filters);

            if (response?.status === 1) {
                setDogsData(response?.data || []);
                setTotalRows(response?.meta?.total || 0);
                setCurrentPage(response?.meta?.page || 1);
                setPerPage(response?.meta?.limit || 10);
            } else {
                handleApiError(response, "Failed to fetch dogs");
                setDogsData([]);
                setTotalRows(0);
            }
        } catch (err: any) {
            handleApiError(err, "Failed to fetch dogs");
            setDogsData([]);
            setTotalRows(0);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchDogs(1, 10);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchText.trim() !== '') {
                fetchDogs(1, perPage, searchText.trim());
            } else {
                fetchDogs(1, perPage);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, perPage]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchDogs(page, perPage, searchText.trim() || undefined);
    };

    const handlePerRowsChange = (perPage: number, page: number) => {
        fetchDogs(page, perPage, searchText.trim() || undefined);
    };

    // Modal handlers
    const handleClose = (): void => setShow(false);

    const handleShow = (dog: Dog): void => {
        setSelectedDog(dog);
        setShow(true);
    };

    // Delete modal handlers
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    const handleCloseDeleteModal = (): void => {
        setShowDeleteModal(false);
        setSelectedDog(null);
    };

    const handleShowDeleteModal = (dog: Dog): void => {
        setSelectedDog(dog);
        setShowDeleteModal(true);
    };

    const handleToggleStatus = async () => {
        if (!selectedDog) return;

        try {
            setLoading(true);
            const newStatus = selectedDog.status === "active" ? "inactive" : "active";

            const response = await DogService.updateDogStatus(selectedDog._id, newStatus);
            if (response.status === 1) {
                showSuccess("Success", `Dog ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`);
                fetchDogs(currentPage, perPage, searchText.trim() || undefined);
            } else {
                showError("Error", response.message || "Failed to update dog status");
            }
        } catch (err: any) {
            handleApiError(err, "Failed to update dog status");
        } finally {
            setLoading(false);
            setShow(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedDog) return;
        try {
            setIsDeleting(true);
            await DogService.deleteDog(selectedDog._id);
            showSuccess("Success", "Dog deleted successfully");
            handleCloseDeleteModal();
            await fetchDogs(currentPage, perPage, searchText.trim() || undefined);
        } catch (err: any) {
            handleApiError(err, "Failed to delete dog");
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            name: "S.no.",
            cell: (row: Dog, index: number) => (currentPage - 1) * perPage + index + 1,
            width: '80px'
        },
        {
            name: "Dog",
            cell: (row: Dog) => (
                <div className="d-flex align-items-center">
                    <img
                        src={getDogProfileImage(row)}
                        alt={row.dog_name}
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", marginRight: 10 }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = IMAGES.Dog; // Fallback to default dog image on error
                        }}
                    />
                    <div>
                        <div className="fw-bold">{row.dog_name}</div>
                        <div className="text-muted small">{row.profile_type}</div>
                        <div className="text-muted small">{safeGetString(row.breed)}</div>
                    </div>
                </div>
            ),
            minWidth: "220px"
        },
        {
            name: "User",
            cell: (row: Dog) => (
                <div className="d-flex align-items-center">

                    <div>
                        <div>{row.user_details?.name || safeGetString(row.user_id)}</div>
                        <div className="text-muted small">{row.user_details?.email || (typeof row.user_id === 'object' && row.user_id?.email ? row.user_id.email : 'No email')}</div>
                        <div className="text-muted small">{row.gender}</div>
                    </div>
                </div>
            ),
            minWidth: "220px"
        },
        {
            name: "Age",
            selector: (row: Dog) => `${row.age} yr${row.age > 1 ? "s" : ""}`,
            width: "80px",
        },
        {
            name: "Color",
            selector: (row: Dog) => row.colour,
            width: "100px",
        },
        {
            name: "Added On",
            selector: (row: Dog) => formatDate(row.created_at),
            width: "120px",
        },
        {
            name: "Status",
            cell: (row: Dog) => (
                <Badge bg={getStatusBadge(row.status)}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
            ),
            width: "100px",
        },
        {
            name: "Action",
            width: "140px",
            center: true,
            cell: (row: Dog) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`view-tooltip-${row._id}`}>View</Tooltip>}
                    >
                        <Link to={`/dogs/view-dog?id=${row._id}`}>
                            <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id={`block-tooltip-${row._id}`}>
                                {row.status === "active" ? "Block" : "Unblock"}
                            </Tooltip>
                        }
                    >
                        <Link to="#" onClick={e => { e.preventDefault(); handleShow(row); }}>
                            <Icon
                                icon={row.status === "active" ? "material-symbols-light:block" : "mdi:check-circle-outline"}
                                width={22}
                                height={22}
                                className={row.status === "active" ? "text-danger" : "text-success"}
                            />
                        </Link>
                    </OverlayTrigger>
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`delete-tooltip-${row._id}`}>Delete</Tooltip>}
                    >
                        <Link to="javascript:void(0)" onClick={() => handleShowDeleteModal(row)}>
                            <Icon icon="icon-park-outline:close-one" width={16} height={16} className="text-danger" />
                        </Link>
                    </OverlayTrigger>
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="text-dark">Dogs</h5>
                        <input
                            type="text"
                            placeholder="Search dogs..."
                            className="searchfield"
                            value={searchText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                        />
                    </div>

                    {error && (
                        <Alert variant="danger" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    <div className="scrollable-table">
                        <DataTable
                            columns={columns}
                            data={dogsData}
                            pagination
                            paginationServer
                            paginationTotalRows={totalRows}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handlePerRowsChange}
                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            progressPending={loading}
                            progressComponent={<Spinner animation="border" role="status" />}
                            responsive
                            className="custom-table"
                            noDataComponent={
                                <div className="text-center p-4">
                                    <Icon icon="hugeicons:dog" width={48} height={48} className="text-muted mb-3" />
                                    <p className="text-muted">No dogs found</p>
                                </div>
                            }
                        />
                    </div>
                </Col>
            </Row>

            <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="mdi:alert-circle-outline" />
                        <h3>
                            {selectedDog?.status === "active" ? "Block Dog?" : "Unblock Dog?"}
                        </h3>
                        <p>
                            {selectedDog?.status === "active"
                                ? `Are you sure you want to block ${selectedDog?.dog_name}? The dog will not be visible to other users.`
                                : `Are you sure you want to unblock ${selectedDog?.dog_name}? The dog will be visible to other users again.`}
                        </p>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-danger"
                            onClick={handleClose}
                            className="px-4"
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110"
                            onClick={handleToggleStatus}
                            disabled={loading}
                        >
                            {loading ? <Spinner size="sm" /> : 'Ok'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal className="modal_Delete" show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure?</h3>
                        <p>You will not be able to recover this dog: <strong>{selectedDog?.dog_name}</strong></p>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-secondary"
                            onClick={handleCloseDeleteModal}
                            className="px-4"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="px-4 min_width110"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Dogs;
