import { IMAGES } from "@/contants/images";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Row, Col, OverlayTrigger, Tooltip, Image, Alert, Spinner } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { Link } from "react-router-dom";
import { PaymentService, PaymentHistory, PaginationMeta } from "@/services";

// Helper function to safely extract string values from populated objects
const safeGetString = (value: any): string => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && value.name) return value.name;
    return '';
};

// Helper function to map payment type from backend enums to display format
const getPaymentTypeDisplay = (relationWith: string, transactionType: string): string => {
    // Map relation_with to display text
    switch (relationWith) {
        case 'dog_profile_express_registeration':
            return 'Express Registration';
        case 'one_time_payment_for_match':
            return 'One-time Match';
        case 'subscription_for_match':
            return 'Match Subscription';
        case 'subscription_renewal_for_match':
            return 'Match Renewal';
        case 'use_of_redeemable_coins_for_match_to_enable_chat':
            return 'Chat Coins';
        case 'use_of_playdate_premium_paws_subscription_for_match_to_enable_chat':
            return 'Premium Chat';
        default:
            // Fallback to transaction type
            if (transactionType.includes('Auto-Renewable')) return 'Subscription';
            if (transactionType.includes('Consumable')) return 'One-time Payment';
            return relationWith || 'Other';
    }
};

// Helper function to map payment status
const getPaymentStatusDisplay = (status: string): "Success" | "Failed" => {
    return status === 'paid' ? 'Success' : 'Failed';
};

// Helper function to get payment purpose description
const getPaymentPurposeDescription = (relationWith: string): string => {
    switch (relationWith) {
        case 'dog_profile_express_registeration':
            return 'Express dog profile registration';
        case 'one_time_payment_for_match':
            return 'One-time payment for dog matching';
        case 'subscription_for_match':
            return 'Subscription for dog matching service';
        case 'subscription_renewal_for_match':
            return 'Renewal of dog matching subscription';
        case 'use_of_redeemable_coins_for_match_to_enable_chat':
            return 'Purchase of chat coins for messaging';
        case 'use_of_playdate_premium_paws_subscription_for_match_to_enable_chat':
            return 'Premium subscription for chat access';
        default:
            return 'Other payment';
    }
};

// Helper function to format date
const formatDate = (dateString: string): string => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch (error) {
        return 'N/A';
    }
};

const Payments: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [paymentsData, setPaymentsData] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [pagination, setPagination] = useState<any>({
        page: 1,
        limit: 10,
        totalPages: 1,
        total: 0,
    });

    const paymentsColumns: TableColumn<PaymentHistory>[] = [
        {
            name: "Payment ID",
            selector: (row: PaymentHistory) => row._id,
            width: "120px",
            cell: (row: PaymentHistory) => (
                <span className="text-primary" style={{ fontWeight: 500, fontSize: 12 }}>
                    {row._id.slice(-8)}...
                </span>
            ),
        },
        {
            name: "Purpose",
            width: "160px",
            cell: (row: PaymentHistory) => {
                const purpose = getPaymentTypeDisplay(row.relation_with, row.transaction_type);
                const description = getPaymentPurposeDescription(row.relation_with);
                let badgeClass = "bg-info";

                // Color coding based on purpose
                if (purpose.includes('Registration')) badgeClass = "bg-primary";
                else if (purpose.includes('Match')) badgeClass = "bg-success";
                else if (purpose.includes('Chat')) badgeClass = "bg-warning";
                else if (purpose.includes('Subscription')) badgeClass = "bg-info";

                return (
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`purpose-tooltip-${row._id}`}>{description}</Tooltip>}
                    >
                        <span className={`badge ${badgeClass}`}>
                            {purpose}
                        </span>
                    </OverlayTrigger>
                );
            },
        },
        {
            name: "Transaction Type",
            width: "140px",
            cell: (row: PaymentHistory) => {
                let badgeClass = "bg-secondary";

                // Color coding based on transaction type
                if (row.transaction_type.includes('Auto-Renewable')) badgeClass = "bg-info";
                else if (row.transaction_type.includes('Consumable')) badgeClass = "bg-success";

                return (
                    <span className={`badge ${badgeClass}`} style={{ fontSize: '11px' }}>
                        {row.transaction_type}
                    </span>
                );
            },
        },

        {
            name: "Dog",
            width: "220px",
            cell: (row: PaymentHistory) => {
                const dogDetails = row.dog_details;
                if (!dogDetails) {
                    return (
                        <div className="text-muted" style={{ fontSize: 12 }}>
                            No dog data
                        </div>
                    );
                }
                return (
                    <div className="d-flex align-items-center">
                        <Image
                            src={
                                (typeof dogDetails.profile_picture === 'string'
                                    ? dogDetails.profile_picture
                                    : dogDetails.profile_picture?.file_path) || IMAGES.Dog
                            }
                            roundedCircle
                            width={40}
                            height={40}
                            alt={dogDetails.dog_name || 'Dog'}
                            style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                        />
                        <div>
                            <div style={{ fontWeight: 600 }}>{dogDetails.dog_name || 'N/A'}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>
                                {safeGetString(dogDetails.breed) || 'Unknown breed'}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "User",
            width: "260px",
            cell: (row: PaymentHistory) => {
                const userDetails = row.user_details;
                if (!userDetails) {
                    return (
                        <div className="text-muted" style={{ fontSize: 12 }}>
                            No user data
                        </div>
                    );
                }
                return (
                    <div className="d-flex align-items-center">

                        <div>
                            <div style={{ fontWeight: 600 }}>{userDetails.name || 'N/A'}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>{userDetails.email || 'N/A'}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Amount",
            width: "110px",
            cell: (row: PaymentHistory) => (
                <span className="text-dark" style={{ fontWeight: 600 }}>
                    ${(row.paid_price / 1000).toFixed(2)}
                </span>
            ),
        },
        {
            name: "Date",
            width: "120px",
            cell: (row: PaymentHistory) => (
                <span className="text-muted" style={{ fontSize: 12 }}>
                    {formatDate(row.payment_time)}
                </span>
            ),
        },
        {
            name: "Status",
            cell: (row: PaymentHistory) => {
                const status = getPaymentStatusDisplay(row.status);
                return (
                    <span className={`badge ${status === "Success" ? "bg-success" : "bg-danger"}`}>
                        {status}
                    </span>
                );
            },
            width: "100px"
        },
        // {
        //     name: "Actions",
        //     center: true,
        //     sortable: false,
        //     cell: (row: PaymentHistory) => (
        //         <OverlayTrigger
        //             placement="top"
        //             overlay={<Tooltip id="view-tooltip">View</Tooltip>}
        //         >
        //             <Link to={`/payments/view-payment?id=${row._id}`}>
        //                 <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
        //             </Link>
        //         </OverlayTrigger>
        //     ),
        // },
    ];

    // Fetch payments data
    const fetchPayments = async (page: number = 1, searchTerm: string = '') => {
        try {
            setLoading(true);
            setError('');

            const response = await PaymentService.getPayments({
                page,
                limit: 10,
                search: searchTerm,
            });

            setPaymentsData(response.data || []);
            setPagination(response.meta);
        } catch (err: any) {
            console.error('❌ Error fetching payments:', err);
            setError(err.message || 'Failed to fetch payments');
            setPaymentsData([]);
        } finally {
            setLoading(false);
        }
    };

    // Load payments on component mount
    useEffect(() => {
        fetchPayments(1, searchText);
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPayments(1, searchText);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchPayments(page, searchText);
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    {error && (
                        <Alert variant="danger" className="mb-3">
                            <Icon icon="mdi:alert-circle" className="me-2" />
                            {error}
                        </Alert>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="text-muted me-2">
                                Total: {pagination.total_payments} payments
                            </span>
                            {loading && (
                                <Spinner animation="border" size="sm" className="ms-2" />
                            )}
                        </div>
                        <div className="text-end">
                            <input
                                type="text"
                                placeholder="Search payments, users, dogs, purpose..."
                                className="searchfield"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                disabled={loading}
                                style={{ minWidth: '250px' }}
                            />
                        </div>
                    </div>

                    <DataTable
                        columns={paymentsColumns}
                        data={paymentsData}
                        pagination
                        paginationServer
                        paginationTotalRows={pagination.total_payments}
                        paginationDefaultPage={pagination.current_page}
                        paginationPerPage={pagination.per_page}
                        onChangePage={handlePageChange}
                        progressPending={loading}
                        progressComponent={
                            <div className="d-flex justify-content-center align-items-center p-4">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                                <span className="ms-2">Loading payments...</span>
                            </div>
                        }
                        noDataComponent={
                            <div className="text-center p-4">
                                <Icon icon="mdi:credit-card-off" width={48} height={48} className="text-muted mb-3" />
                                <h5 className="text-muted">No Payments Found</h5>
                                <p className="text-muted">
                                    {searchText ? 'Try adjusting your search criteria' : 'No payment records available'}
                                </p>
                            </div>
                        }
                        responsive
                        className="custom-table"
                        striped
                        highlightOnHover
                    />

                    {/* Pagination Info */}
                    {paymentsData.length > 0 && (
                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <small className="text-muted">
                                Showing page {pagination.current_page} of {pagination.total_pages}
                                ({pagination.total_payments} total payments)
                            </small>
                            <div className="d-flex align-items-center">
                                <small className="text-muted me-2">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </small>
                            </div>
                        </div>
                    )}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Payments;