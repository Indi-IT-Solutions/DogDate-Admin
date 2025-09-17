import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import DataTable, { TableColumn } from "react-data-table-component";
import { PaymentService, PaymentHistory } from "@/services";
import { formatDate } from "@/utils/dateUtils";
import AppLoader from "@/components/Apploader";


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
    return status === 'paid' || status === 'skipped' ? 'Success' : 'Failed';
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



const Payments: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [paymentsData, setPaymentsData] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(10);

    const paymentsColumns: TableColumn<PaymentHistory>[] = [
        {
            name: "Payment ID",
            selector: (row: PaymentHistory) => row._id,

            wrap: true,
            cell: (row: PaymentHistory) => (
                <span className="text-primary" style={{ fontWeight: 500, fontSize: 12 }}>
                    {row?.purchase_id || 'N/A'}
                </span>
            ),
        },
        {
            name: "Purpose",

            cell: (row: PaymentHistory) => {
                const purpose = getPaymentTypeDisplay(row?.relation_with, row?.transaction_type);
                const description = getPaymentPurposeDescription(row?.relation_with);
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
        // {
        //     name: "Transaction Type",
        //     width: "140px",
        //     cell: (row: PaymentHistory) => {
        //         let badgeClass = "bg-secondary";

        //         // Color coding based on transaction type
        //         if (row.transaction_type.includes('Auto-Renewable')) badgeClass = "bg-info";
        //         else if (row.transaction_type.includes('Consumable')) badgeClass = "bg-success";

        //         return (
        //             <span className={`badge ${badgeClass}`} style={{ fontSize: '11px' }}>
        //                 {row.transaction_type}
        //             </span>
        //         );
        //     },
        // },

        // {
        //     name: "Dog",
        //     width: "220px",
        //     cell: (row: PaymentHistory) => {
        //         const dogDetails = row?.dog_details;
        //         if (!dogDetails) {
        //             return (
        //                 <div className="text-muted" style={{ fontSize: 12 }}>
        //                     No dog data
        //                 </div>
        //             );
        //         }
        //         return (
        //             <div className="d-flex align-items-center">
        //                 <Image
        //                     src={
        //                         (typeof dogDetails?.profile_picture === 'string'
        //                             ? dogDetails?.profile_picture
        //                             : dogDetails?.profile_picture?.file_path) || IMAGES.Dog
        //                     }
        //                     roundedCircle
        //                     width={40}
        //                     height={40}
        //                     alt={dogDetails?.dog_name || 'Dog'}
        //                     style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
        //                 />
        //                 <div>
        //                     <div style={{ fontWeight: 600 }}>{dogDetails?.dog_name || 'N/A'}</div>
        //                     <div className="text-muted" style={{ fontSize: 12 }}>
        //                         {safeGetString(dogDetails?.breed) || 'Unknown breed'}
        //                     </div>
        //                 </div>
        //             </div>
        //         );
        //     },
        // },
        {
            name: "User",

            cell: (row: PaymentHistory) => {
                const userDetails = row?.user_details;
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
                            <div style={{ fontWeight: 600 }}>{userDetails?.name || 'N/A'}</div>
                            <div className="text-muted" style={{ fontSize: 12 }}>{userDetails.email || 'N/A'}</div>
                        </div>
                    </div>
                );
            },
        },
        {
            name: "Amount",

            cell: (row: PaymentHistory) => (
                <span className="text-dark" style={{ fontWeight: 600 }}>
                    ${(row?.paid_price / 1000).toFixed(2)}
                </span>
            ),
        },
        {
            name: "Date",

            cell: (row: PaymentHistory) => (
                <span className="text-muted" style={{ fontSize: 12 }}>
                    {formatDate(row?.payment_time)}
                </span>
            ),
        },
        {
            name: "Status",
            cell: (row: PaymentHistory) => {
                const status = getPaymentStatusDisplay(row?.status);
                return (
                    <span className={`badge ${status === "Success" ? "bg-success" : "bg-danger"} text-capitalize`}>
                        {status}
                    </span>
                );
            },

        },

    ];

    // Fetch payments data
    const fetchPayments = async (page: number = 1, limit: number = 10, search?: string) => {
        try {
            const response = await PaymentService.getPayments({
                page,
                limit,
                search: search || undefined,
            });

            if (response?.status === 1) {
                setPaymentsData(response?.data || []);
                setTotalRows(response?.meta?.total_payments || 0);
                setPerPage(response?.meta?.limit || 10);
            } else {
                setPaymentsData([]);
                setTotalRows(0);
            }
        } catch (err: any) {
            console.error('❌ Error fetching payments:', err);
            setPaymentsData([]);
            setTotalRows(0);
        } finally {
            setLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchPayments(1, 10);
    }, []);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchText.trim() !== '') {
                fetchPayments(1, perPage, searchText.trim());
            } else {
                fetchPayments(1, perPage);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchText, perPage]);

    // Pagination handlers
    const handlePageChange = (page: number) => {
        fetchPayments(page, perPage, searchText.trim() || undefined);
    };

    const handlePerRowsChange = (perPage: number, page: number) => {
        fetchPayments(page, perPage, searchText.trim() || undefined);
    };

    return (
        <React.Fragment>
            <Row>
                <Col md={12}>
                    {/* {error && (
                        <Alert variant="danger" className="mb-3">
                            <Icon icon="mdi:alert-circle" className="me-2" />
                            {error}
                        </Alert>
                    )} */}
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className="text-dark">Payments</h5>
                        <div className="d-flex justify-content-between align-items-center mb-3">
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
                    </div>

                    <DataTable
                        columns={paymentsColumns}
                        data={paymentsData}
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
                                <Icon icon="mdi:credit-card-off" width={48} height={48} className="text-muted mb-3" />
                                <h5 className="text-muted">No Payments Found</h5>
                                <p className="text-muted">
                                    {searchText ? 'Try adjusting your search criteria' : 'No payment records available'}
                                </p>
                            </div>
                        }
                    />

                    {/* Pagination Info */}
                    {/* {paymentsData.length > 0 && (
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
                    )} */}
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Payments;