import { IMAGES } from "@/contants/images";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Modal, Alert, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { UserService } from "@/services";
import { getProfileImageUrl, getUserProfileImage, getDogProfileImage } from "@/utils/imageUtils";
import { formatDate } from "@/utils/dateUtils";
import AppLoader from "@/components/Apploader";

interface Dog {
    id: number;
    image: string;
    name: string;
    breed: string;
    paymentStatus: string;
}

interface User {
    id: number;
    image: string;
    name: string;
    email: string;
}

interface Match {
    id: number;
    myDog: Dog;
    otherDog: Dog;
    otherUser: User;
    matchedOn: string;
}

const Confirmed: React.FC = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');

    // State management
    const [searchText, setSearchText] = useState<string>("");
    const [matchesData, setMatchesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalRows: 0,
        perPage: 10
    });

    // Modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // Fetch confirmed matches
    const fetchConfirmedMatches = async (page: number = 1, limit: number = 10, search?: string, type?: string) => {
        if (!userId) return;

        try {
            setLoading(true);
            setError("");

            const filters = {
                page,
                limit,
                search: search || undefined,
                type: type || undefined,
            };

            console.log('🔍 Fetching confirmed matches for user:', userId, filters);
            const response: any = await UserService.getUserConfirmedMatches(userId, filters);

            console.log('✅ Confirmed Matches response:', response);

            if (response?.status === 1) {
                setMatchesData(response?.data || []);
                setPagination({
                    currentPage: response?.meta?.page || 1,
                    totalRows: response?.meta?.total || 0,
                    perPage: response?.meta?.limit || 10
                });
            } else {
                setError(response?.message || "Failed to fetch confirmed matches");
                setMatchesData([]);
            }
        } catch (err: any) {
            console.error("Error fetching confirmed matches:", err);
            setError(err.message || "An error occurred while fetching confirmed matches");
            setMatchesData([]);
        } finally {
            setLoading(false);
        }
    };

    // Load data on component mount
    useEffect(() => {
        if (userId) {
            fetchConfirmedMatches(1, 10);
        }
    }, [userId]);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchText !== undefined) {
                fetchConfirmedMatches(1, pagination.perPage, searchText);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchText]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchConfirmedMatches(page, pagination.perPage, searchText);
    };

    const handlePerRowsChange = (perPage: number, page: number) => {
        fetchConfirmedMatches(page, perPage, searchText);
    };

    // Helper function to safely get string value from potentially nested objects
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

    // Helper function to get the current user's dog and other dog details
    const getMatchDetails = (match: any) => {
        const isInitiator = match.initiator?._id === userId;

        return {
            myDog: isInitiator ? match.initiator_dog_details : match.receiver_dog_details,
            otherDog: isInitiator ? match.receiver_dog_details : match.initiator_dog_details,
            otherUser: isInitiator ? match.receiver : match.initiator,
        };
    };



    // Helper function to get match type badge
    const getMatchTypeBadge = (type: string) => {
        const variant = type === 'breeding' ? 'bg-success' : 'bg-primary';
        return <span className={`badge ${variant}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
    };

    const matchesColumns = [
        {
            name: "Sr. No.",
            cell: (row: any, index: number) => (pagination.currentPage - 1) * pagination.perPage + index + 1,
            width: '80px'
        },
        {
            name: "My Dog",
            cell: (row: any) => {
                const details = getMatchDetails(row);
                return (
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={getDogProfileImage(details.myDog)}
                            alt={details.myDog?.dog_name || 'Dog'}
                            className="rounded"
                            width={40}
                            height={40}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = IMAGES.Dog; // Fallback to default dog image on error
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{details.myDog?.dog_name || 'Unknown'}</div>
                            <div style={{ fontSize: 12 }}>{safeGetString(details.myDog?.breed) || 'Unknown breed'}</div>
                            {getMatchTypeBadge(row.type)}
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Other Dog",
            cell: (row: any) => {
                const details = getMatchDetails(row);
                return (
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={getDogProfileImage(details.otherDog)}
                            alt={details.otherDog?.dog_name || 'Dog'}
                            className="rounded"
                            width={40}
                            height={40}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = IMAGES.Dog; // Fallback to default dog image on error
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{details.otherDog?.dog_name || 'Unknown'}</div>
                            <div style={{ fontSize: 12 }}>{safeGetString(details.otherDog?.breed) || 'Unknown breed'}</div>
                            <span className="badge bg-secondary">Matched</span>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Other User",
            cell: (row: any) => {
                const details = getMatchDetails(row);
                return (
                    <div className="d-flex gap-2 align-items-center">
                        <img
                            src={getUserProfileImage(details.otherUser)}
                            alt={details.otherUser?.name || 'User'}
                            className="rounded-circle"
                            width={36}
                            height={36}
                            style={{ objectFit: "cover", border: "1px solid #eee" }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = IMAGES.Avatar1; // Fallback to default avatar on error
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 500 }}>{safeGetString(details.otherUser?.name) || 'Unknown User'}</div>
                            <div style={{ fontSize: 12 }}>{safeGetString(details.otherUser?.email) || 'No email'}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Matched On",
            selector: (row: any) => formatDate(row.created_at),
            sortable: true,
        },
        {
            name: "Status",
            cell: (row: any) => (
                <span className="badge bg-success  text-capitalize">
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
                </span>
            ),
            width: "100px"
        },
    ];

    return (
        <React.Fragment>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0" style={{ fontSize: "18px", fontWeight: "500" }}>
                    Confirmed Matches
                    {pagination.totalRows > 0 && (
                        <span className="text-muted ms-2">({pagination.totalRows} total)</span>
                    )}
                </h4>
                <div className="text-end">
                    <input
                        type="text"
                        placeholder="Search matches..."
                        className="searchfield"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <Alert variant="danger" className="mb-3">
                    {error}
                </Alert>
            )}

            <DataTable
                columns={matchesColumns as any}
                data={matchesData}
                pagination
                paginationServer
                paginationTotalRows={pagination.totalRows}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
                responsive
                className="custom-table"
                progressPending={loading}
                progressComponent={
                    <AppLoader size={150} />
                }
                noDataComponent={
                    <div className="text-center py-4">
                        <Icon icon="mdi:heart-broken" width={48} height={48} className="text-muted mb-2" />
                        <p className="text-muted">
                            {loading ? 'Loading matches...' : 'No confirmed matches found'}
                        </p>
                        {!loading && pagination.totalRows === 0 && (
                            <small className="text-muted">This user hasn't confirmed any matches yet</small>
                        )}
                    </div>
                }
            />

            {/* Delete Modal */}
            <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure ?</h3>
                        <p>You will not be able to recover the deleted record!</p>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-danger"
                            onClick={handleClose}
                            className="px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110"
                            onClick={handleClose}
                        >
                            Ok
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default Confirmed;
