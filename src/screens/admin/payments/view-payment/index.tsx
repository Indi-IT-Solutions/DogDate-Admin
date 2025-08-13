
import { IMAGES } from "@/contants/images";
import React, { useState, useEffect } from "react";
import { Card, Col, Row, Image, Alert, Spinner } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { PaymentService, PaymentHistory } from "@/services";
import { Icon } from "@iconify/react/dist/iconify.js";

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

// Helper function to map payment status
const getPaymentStatusDisplay = (status: string): "Success" | "Failed" => {
    return status === 'paid' ? 'Success' : 'Failed';
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

const ViewPayment: React.FC = () => {
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('id');

    const [paymentData, setPaymentData] = useState<PaymentHistory | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Fetch payment data
    const fetchPayment = async () => {
        if (!paymentId) {
            setError('Payment ID is required to view details');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await PaymentService.getPaymentById(paymentId);
            setPaymentData(response);
        } catch (err: any) {
            console.error('❌ Error fetching payment:', err);
            setError(err.message || 'Failed to fetch payment details');
            setPaymentData(null);
        } finally {
            setLoading(false);
        }
    };

    // Load payment on component mount
    useEffect(() => {
        fetchPayment();
    }, [paymentId]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
                <span className="ms-2">Loading payment details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                <Icon icon="mdi:alert-circle" className="me-2" />
                {error}
            </Alert>
        );
    }

    if (!paymentData) {
        return (
            <Alert variant="warning">
                <Icon icon="mdi:alert" className="me-2" />
                Payment not found
            </Alert>
        );
    }
    const paymentStatus = getPaymentStatusDisplay(paymentData.status);
    const paymentType = getPaymentTypeDisplay(paymentData.relation_with, paymentData.transaction_type);
    const isRecurring = paymentData.transaction_type === 'Auto-Renewable Subscription';

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>View Payment</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/payments">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body className="mt-3">
                    <div className="taledtl_div">
                        <Row>
                            <Col md={6}>
                                <div className="talefile_list">
                                    {/* Payment ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment ID</h4>
                                        <p className="text-primary" style={{ fontWeight: 500, fontSize: 14 }}>
                                            {paymentData._id}
                                        </p>
                                    </div>
                                    {/* Transaction ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Transaction ID</h4>
                                        <p>{paymentData.transaction_id || 'N/A'}</p>
                                    </div>
                                    {/* Payment Purpose */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment Purpose</h4>
                                        <div>
                                            <span className="badge bg-info mb-2">{paymentType}</span>
                                            <p className="text-muted" style={{ fontSize: 12, marginTop: 5 }}>
                                                {getPaymentPurposeDescription(paymentData.relation_with)}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Transaction Type */}
                                    <div className="tablefilelist_grid">
                                        <h4>Transaction Type</h4>
                                        <span className="badge bg-secondary">{paymentData.transaction_type}</span>
                                    </div>
                                    {/* Recurring */}
                                    <div className="tablefilelist_grid">
                                        <h4>Recurring</h4>
                                        <span className={`badge ${isRecurring ? "bg-warning" : "bg-secondary"}`}>
                                            {isRecurring ? "Yes" : "No"}
                                        </span>
                                    </div>
                                    {/* Paid On */}
                                    <div className="tablefilelist_grid">
                                        <h4>Paid On</h4>
                                        <p>{formatDate(paymentData.payment_time)}</p>
                                    </div>
                                    {/* Payment Platform */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment Platform</h4>
                                        <p>{paymentData.payment_platform === 'ios_iap' ? 'iOS In-App Purchase' :
                                            paymentData.payment_platform === 'android_iap' ? 'Android In-App Purchase' :
                                                paymentData.payment_platform || 'N/A'}</p>
                                    </div>
                                    {/* Purchase ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Purchase ID</h4>
                                        <p>{paymentData.purchase_id || 'N/A'}</p>
                                    </div>
                                    {/* Product ID */}
                                    <div className="tablefilelist_grid">
                                        <h4>Product ID</h4>
                                        <p>{paymentData.iap_product_id || 'N/A'}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="talefile_list">
                                    {/* Dog */}
                                    <div className="tablefilelist_grid">
                                        <h4>Dog</h4>
                                        {paymentData.dog_details ? (
                                            <div className="d-flex align-items-center">
                                                <Image
                                                    src={
                                                        (typeof paymentData.dog_details.profile_picture === 'string'
                                                            ? paymentData.dog_details.profile_picture
                                                            : paymentData.dog_details.profile_picture?.file_path) || IMAGES.Dog
                                                    }
                                                    roundedCircle
                                                    width={40}
                                                    height={40}
                                                    alt={paymentData.dog_details.dog_name || 'Dog'}
                                                    style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{paymentData.dog_details.dog_name || 'N/A'}</div>
                                                    <div className="text-muted" style={{ fontSize: 12 }}>
                                                        {safeGetString(paymentData.dog_details.breed) || 'Unknown breed'}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted">No dog data available</div>
                                        )}
                                    </div>
                                    {/* User */}
                                    <div className="tablefilelist_grid">
                                        <h4>User</h4>
                                        {paymentData.user_details ? (
                                            <div className="d-flex align-items-center">
                                                <Image
                                                    src="https://via.placeholder.com/40x40/007bff/ffffff?text=U"
                                                    roundedCircle
                                                    width={40}
                                                    height={40}
                                                    alt={paymentData.user_details.name || 'User'}
                                                    style={{ objectFit: "cover", marginRight: 10, border: "1px solid #eee" }}
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{paymentData.user_details.name || 'N/A'}</div>
                                                    <div className="text-muted" style={{ fontSize: 12 }}>{paymentData.user_details.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted">No user data available</div>
                                        )}
                                    </div>
                                    {/* Amount */}
                                    <div className="tablefilelist_grid">
                                        <h4>Amount</h4>
                                        <p className="text-success" style={{ fontWeight: 600, fontSize: 18 }}>
                                            ${(paymentData.paid_price / 1000).toFixed(2)}
                                        </p>
                                    </div>
                                    {/* Status */}
                                    <div className="tablefilelist_grid">
                                        <h4>Status</h4>
                                        <span className={`badge ${paymentStatus === "Success" ? "bg-success" : "bg-danger"}`}>
                                            {paymentStatus}
                                        </span>
                                    </div>
                                    {/* Payment Region */}
                                    <div className="tablefilelist_grid">
                                        <h4>Payment Region</h4>
                                        <p>{paymentData.payment_region || 'N/A'}</p>
                                    </div>
                                    {/* Created At */}
                                    <div className="tablefilelist_grid">
                                        <h4>Created At</h4>
                                        <p>{formatDate(paymentData.created_at)}</p>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Additional Information */}
                        {(paymentData.product_details || paymentData.refund_reason) && (
                            <Row className="mt-4">
                                <Col md={12}>
                                    <Card className="bg-light">
                                        <Card.Header>
                                            <h6 className="mb-0">Additional Information</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            {paymentData.product_details && (
                                                <div className="mb-3">
                                                    <h6>Product Details:</h6>
                                                    <pre className="bg-white p-3 rounded" style={{ fontSize: 12 }}>
                                                        {JSON.stringify(paymentData.product_details, null, 2)}
                                                    </pre>
                                                </div>
                                            )}
                                            {paymentData.refund_reason && (
                                                <div>
                                                    <h6>Refund Reason:</h6>
                                                    <p className="text-danger">{paymentData.refund_reason}</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default ViewPayment;
