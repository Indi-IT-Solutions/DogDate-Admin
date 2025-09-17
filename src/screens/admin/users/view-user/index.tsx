import { IMAGES } from "@/contants/images";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Modal, OverlayTrigger, Row, Tab, Tabs, Tooltip, Alert } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import Matches from "../matches";
import { UserService, RedeemableCoinService, type User } from "@/services";
import { getUserProfileImage, getDogProfileImage } from "@/utils/imageUtils";
import { formatDate } from "@/utils/dateUtils";
import AppLoader from "@/components/Apploader";


interface Dog {
    id: number;
    image: string;
    name: string;
    type: string;
    breed: string;
    gender: string;
    age: string;
    color: string;
    addedOn: string;
    status: "Active" | "Inactive";
}

const UserView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const userId = searchParams.get('id');

    // State for user data
    const [userData, setUserData] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // State for dogs data
    const [dogsData, setDogsData] = useState<any[]>([]);
    const [dogsLoading, setDogsLoading] = useState(false);
    const [dogsError, setDogsError] = useState<string>("");
    const [dogsPagination, setDogsPagination] = useState({
        currentPage: 1,
        totalRows: 0,
        perPage: 10
    });

    // State for payments data
    const [paymentsData, setPaymentsData] = useState<any[]>([]);
    const [paymentsLoading, setPaymentsLoading] = useState(false);
    const [paymentsError, setPaymentsError] = useState<string>("");
    const [paymentsPagination, setPaymentsPagination] = useState({
        currentPage: 1,
        totalRows: 0,
        perPage: 10
    });

    // State for gifted matches
    const [giftTotals, setGiftTotals] = useState<{ total_gifted: number; available: number; redeemed: number } | null>(null);
    const [giftItems, setGiftItems] = useState<any[]>([]);
    const [giftLoading, setGiftLoading] = useState(false);
    const [giftError, setGiftError] = useState<string>("");

    // Other states
    const [key, setKey] = useState<string>("dogs");
    const [searchText, setSearchText] = useState<string>("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // Fetch user data
    const fetchUserData = async () => {
        if (!userId) {
            setError("User ID is required");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            console.log('🔍 Fetching user data for ID:', userId);
            const response = await UserService.getUserById(userId);

            console.log('📋 User response:', response);

            if (response.status === 1 && response.data) {
                setUserData(response.data);
            } else {
                setError(response.message || "Failed to fetch user data");
            }
        } catch (err: any) {
            console.error("Error fetching user data:", err);
            setError(err.message || "An error occurred while fetching user data");
        } finally {
            setLoading(false);
        }
    };

    // Fetch user's dogs
    const fetchUserDogs = async (page: number = 1, limit: number = 10, search?: string) => {
        if (!userId) return;

        try {
            setDogsLoading(true);
            setDogsError("");

            const filters = {
                page,
                limit,
                search: search || undefined,
            };

            console.log('🔍 Fetching dogs for user:', userId, filters);
            const response: any = await UserService.getUserDogs(userId, filters);

            console.log('🐕 Dogs response:', response);

            if (response.status === 1) {
                setDogsData(response.data || []);
                setDogsPagination({
                    currentPage: response?.meta?.page || 1,
                    totalRows: response?.meta?.total || 0,
                    perPage: response?.meta?.limit || 10
                });
            } else {
                setDogsError(response.message || "Failed to fetch user's dogs");
                setDogsData([]);
            }
        } catch (err: any) {
            console.error("Error fetching user's dogs:", err);
            setDogsError(err.message || "An error occurred while fetching dogs");
            setDogsData([]);
        } finally {
            setDogsLoading(false);
        }
    };

    // Fetch user's payments
    const fetchUserPayments = async (page: number = 1, limit: number = 10, search?: string) => {
        if (!userId) return;

        try {
            setPaymentsLoading(true);
            setPaymentsError("");

            const filters = {
                page,
                limit,
                search: search || undefined,
            };

            console.log('🔍 Fetching payments for user:', userId, filters);
            const response: any = await UserService.getUserPayments(userId, filters);

            console.log('💳 Payments response:', response);

            if (response.status === 1) {
                setPaymentsData(response.data || []);
                setPaymentsPagination({
                    currentPage: response?.meta?.page || 1,
                    totalRows: response?.meta?.total || 0,
                    perPage: response?.meta?.limit || 10
                });
            } else {
                setPaymentsError(response.message || "Failed to fetch user's payments");
                setPaymentsData([]);
            }
        } catch (err: any) {
            console.error("Error fetching user's payments:", err);
            setPaymentsError(err.message || "An error occurred while fetching payments");
            setPaymentsData([]);
        } finally {
            setPaymentsLoading(false);
        }
    };

    // Fetch user's admin-gifted matches
    const fetchUserGifts = async () => {
        if (!userId) return;
        try {
            setGiftLoading(true);
            setGiftError("");
            const res: any = await RedeemableCoinService.listByUser(userId);
            if (res.status === 1) {
                setGiftTotals(res.data?.totals || { total_gifted: 0, available: 0, redeemed: 0 });
                setGiftItems(res.data?.items || []);
            } else {
                setGiftTotals(null);
                setGiftItems([]);
                setGiftError(res.message || 'Failed to fetch gifted matches');
            }
        } catch (err: any) {
            setGiftTotals(null);
            setGiftItems([]);
            setGiftError(err.message || 'Failed to fetch gifted matches');
        } finally {
            setGiftLoading(false);
        }
    };

    // Load user data on component mount
    useEffect(() => {
        fetchUserData();
    }, [userId]);

    // Fetch dogs when Dogs tab is selected
    useEffect(() => {
        if (key === "dogs" && userId) {
            fetchUserDogs(1, 10);
        }
    }, [key, userId]);

    // Fetch payments when Payments tab is selected
    useEffect(() => {
        if (key === "payments" && userId) {
            fetchUserPayments(1, 10);
        }
    }, [key, userId]);

    // Fetch gifts when User Details loads
    useEffect(() => {
        if (userId) fetchUserGifts();
    }, [userId]);

    // Handle search for dogs with debounce
    useEffect(() => {
        if (key === "dogs") {
            const timeoutId = setTimeout(() => {
                if (searchText !== undefined) {
                    fetchUserDogs(1, dogsPagination.perPage, searchText);
                }
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [searchText, key]);

    // Handle search for payments with debounce
    useEffect(() => {
        if (key === "payments") {
            const timeoutId = setTimeout(() => {
                if (searchText !== undefined) {
                    fetchUserPayments(1, paymentsPagination.perPage, searchText);
                }
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [searchText, key]);

    // Handle case where no user ID is provided
    useEffect(() => {
        if (!userId) {
            setError("No user ID provided in URL");
            setLoading(false);
        }
    }, [userId]);

    // Helper functions for displaying data
    const getStatusBadge = (status: string) => {
        const variant = status === 'active' ? 'bg-success' :
            status === 'inactive' ? 'bg-warning' : 'bg-danger';
        return <span className={`badge ${variant}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
    };

    const getRegisterTypeBadge = (type: string) => {
        const variant = type === 'normal' ? 'bg-info' :
            type === 'google' ? 'bg-danger' : 'bg-dark';
        return <span className={`badge ${variant}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>;
    };



    // Helper function to safely extract names from populated fields
    const extractNames = (items: any[]) => {
        if (!items || !Array.isArray(items)) return [];
        return items.map(item => {
            if (typeof item === 'string') return item; // ObjectId as string
            if (item && typeof item === 'object') {
                // Handle nested object with name property
                if (item.name && typeof item.name === 'string') return item.name;
                if (item.name && typeof item.name === 'object' && item.name.name) return item.name.name;
                // If it's an object but no name property, return the _id or first available string value
                if (item._id) return item._id.toString();
            }
            return 'Unknown'; // Fallback
        });
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

    const paymentsColumns = [
        {
            name: "Payment ID",
            selector: (row: any) => row.transaction_id || row._id,

        },
        {
            name: "Type",
            selector: (row: any) => row.relation_with,

            wrap: true,
            cell: (row: any) => (
                <span className="badge bg-info text-capitalize" style={{
                    whiteSpace: 'break-spaces',
                    textAlign: 'left'
                }}>
                    {row?.relation_with?.replace(/_/g, ' ') || 'N/A'}
                </span>
            ),
        },
        {
            name: "Transaction Type",
            selector: (row: any) => row.transaction_type,

            cell: (row: any) => (
                <span className={`badge ${row.transaction_type === "Auto-Renewable Subscription" ? "bg-success" : "bg-warning"}`}>
                    {row.transaction_type === "Auto-Renewable Subscription" ? "Subscription" : "One-time"}
                </span>
            ),
        },
        // {
        //     name: "Dog",
        //     width: "220px",
        //     cell: (row: any) => (
        //         <div className="d-flex align-items-center gap-2">
        //             {row.dog_details ? (
        //                 <>
        //                     <img
        //                         src={row.dog_details.profile_picture || IMAGES.Dog}
        //                         alt={row.dog_details.dog_name || 'Dog'}
        //                         className="rounded"
        //                         width={40}
        //                         height={40}
        //                         style={{ objectFit: "cover", border: "1px solid #eee" }}
        //                         onError={(e) => {
        //                             const target = e.target as HTMLImageElement;
        //                             target.src = IMAGES.Dog;
        //                         }}
        //                     />
        //                     <div>
        //                         <div><strong>{row.dog_details.dog_name || 'Unknown'}</strong></div>
        //                         <small className="text-muted">{row.dog_details.breed || 'Unknown breed'}</small>
        //                     </div>
        //                 </>
        //             ) : (
        //                 <span className="text-muted">No dog associated</span>
        //             )}
        //         </div>
        //     ),
        // },
        {
            name: "Amount",
            selector: (row: any) => row.paid_price,
            cell: (row: any) => {
                const amount = row.paid_price ? (row.paid_price / 1000).toFixed(2) : '0.00';
                return (
                    <span className="text-dark" style={{ fontWeight: 600 }}>${amount}</span>
                );
            },

        },
        {
            name: "Platform",
            selector: (row: any) => row.payment_platform,

            cell: (row: any) => (
                <span className={`badge ${row.payment_platform === 'ios_iap' ? 'bg-dark' : 'bg-success'}`}>
                    {row.payment_platform === 'ios_iap' ? 'iOS' : 'Android'}
                </span>
            ),
        },
        {
            name: "Paid on",
            selector: (row: any) => row.payment_time,
            cell: (row: any) => formatDate(row.payment_time),
        },
        {
            name: "Status",
            cell: (row: any) => (
                <span className={`badge ${row.status === "paid" ? "bg-success" : "bg-danger"} text-capitalize`}>
                    {row.status || 'Unknown'}
                </span>
            ),
        },
    ];

    const dogsColumns = [
        {
            name: "Dog",
            cell: (row: any) => (
                <div className="d-flex gap-3 align-items-center py-2">
                    <img
                        src={getDogProfileImage(row)}
                        alt={row.dog_name || 'Dog'}
                        className="rounded"
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", border: "1px solid #eee" }}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = IMAGES.Dog; // Fallback to default dog image on error
                        }}
                    />
                    <div>
                        <div className="d-flex align-items-center gap-2">
                            <strong>{row.dog_name || 'Unknown'}</strong>
                        </div>
                        <small className="text-muted">{row.profile_type || 'N/A'}</small>
                        <div>
                            <small className="text-muted">{safeGetString(row.breed) || 'Unknown breed'}</small>
                        </div>
                    </div>
                </div>
            ),
            width: "250px"
        },
        {
            name: "Gender",
            selector: (row: any) => row.gender || 'N/A',
        },
        {
            name: "Age",
            selector: (row: any) => row.age ? `${row.age} yrs` : 'N/A',
        },
        {
            name: "Color",
            selector: (row: any) => row.colour || 'N/A',  // Fixed: using 'colour' from schema
        },
        {
            name: "Character",
            cell: (row: any) => (
                <div className="d-flex gap-1 flex-wrap">
                    {row.character && row.character.length > 0 ? (
                        row.character.slice(0, 2).map((char: any, index: number) => (
                            <span key={index} className="badge bg-info" style={{ fontSize: '10px' }}>
                                {safeGetString(char)}
                            </span>
                        ))
                    ) : (
                        <span className="text-muted" style={{ fontSize: '12px' }}>None</span>
                    )}
                    {row.character && row.character.length > 2 && (
                        <span className="text-muted" style={{ fontSize: '10px' }}>+{row.character.length - 2}</span>
                    )}
                </div>
            ),
            width: "150px"
        },
        {
            name: "Added on",
            selector: (row: any) => formatDate(row.created_at),
        },
        {
            name: "Status",
            width: "100px",
            cell: (row: any) => (
                <span className={`badge ${row.status === "active" ? "bg-success" : "bg-danger"} text-capitalize`}>
                    {row.status?.charAt(0).toUpperCase() + row.status?.slice(1) || 'Unknown'}
                </span>
            ),
        },
        {
            name: "Actions",
            center: true,
            sortable: false,
            cell: (row: any) => (
                <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="view-tooltip">View</Tooltip>}
                >
                    <Link to={`/dogs/view-dog?id=${row._id}`}>
                        <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
                    </Link>
                </OverlayTrigger>
            ),
        },
    ];



    const filteredDogsData = dogsData.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
    );

    // Loading state
    if (loading) {
        return (
            <Card>
                <Card.Body className="text-center py-5">
                    <AppLoader size={150} />
                </Card.Body>
            </Card>
        );
    }

    // Error state
    if (error) {
        return (
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>User Details</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Alert variant="danger" className="text-center">
                        <Icon icon="mdi:alert" width={48} height={48} className="mb-2" />
                        <h6>Error Loading User</h6>
                        <p>{error}</p>
                        <Button variant="outline-primary" onClick={fetchUserData}>
                            Try Again
                        </Button>
                    </Alert>
                </Card.Body>
            </Card>
        );
    }

    // No user data
    if (!userData) {
        return (
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>User Details</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>
                <Card.Body>
                    <Alert variant="warning" className="text-center">
                        <Icon icon="mdi:account-off" width={48} height={48} className="mb-2" />
                        <h6>User Not Found</h6>
                        <p>The requested user could not be found.</p>
                    </Alert>
                </Card.Body>
            </Card>
        );
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>User Details - {userData.name}</h5>
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body className="mt-3">
                    <div className="taledtl_div">
                        <Row>
                            <Col md={4}>
                                <div className="talefile_box">
                                    <img
                                        className="talefile_img"
                                        src={getUserProfileImage(userData)}
                                        alt="User Image"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = IMAGES.Avatar1; // Fallback to default avatar on error
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col md={8}>
                                <div className="talefile_list">
                                    <Row>
                                        <Col lg={6}>
                                            {/* Name */}
                                            <div className="tablefilelist_grid">
                                                <h4>Name</h4>
                                                <p>{userData.name || 'N/A'}</p>
                                            </div>

                                            {/* Email */}
                                            <div className="tablefilelist_grid">
                                                <h4>Email</h4>
                                                <p>{userData.email || 'N/A'}</p>
                                            </div>

                                            {/* Age & Gender */}
                                            <div className="tablefilelist_grid">
                                                <h4>Age</h4>
                                                <p>{userData.age || 'N/A'}</p>
                                            </div>

                                            {/* Gender */}
                                            <div className="tablefilelist_grid">
                                                <h4>Gender</h4>
                                                <p>{userData.gender ? userData.gender.charAt(0).toUpperCase() + userData.gender.slice(1) : 'N/A'}</p>
                                            </div>

                                            {/* Phone number */}
                                            <div className="tablefilelist_grid">
                                                <h4>Phone number</h4>
                                                <p>{userData.phone_number ? `${userData.country_code || ''} ${userData.phone_number}` : 'N/A'}</p>
                                            </div>

                                            {/* Location */}
                                            <div className="tablefilelist_grid">
                                                <h4>Location</h4>
                                                <p>{userData.address?.city || userData.address?.full_address || 'N/A'}</p>
                                            </div>

                                            {/* About */}
                                            <div className="tablefilelist_grid">
                                                <h4>About</h4>
                                                <div className="about-box">
                                                    <p>{userData.about || 'No description provided'}</p>
                                                </div>
                                            </div>

                                        </Col>
                                        <Col lg={6}>
                                            {/* Interests */}
                                            <div className="tablefilelist_grid">
                                                <h4 className="mb-2">Lifestyle & Interests</h4>
                                                <h6 style={{ fontSize: '12px' }}>Hobbies</h6>
                                                <div className="d-flex gap-2 mb-3 flex-wrap">
                                                    {userData.hobbies && userData.hobbies.length > 0 ? (
                                                        extractNames(userData.hobbies).map((hobby, index) => (
                                                            <span key={index} className="badge bg-primary">{hobby}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted">No hobbies listed</span>
                                                    )}
                                                </div>
                                                <h6 style={{ fontSize: '12px' }}>Meet Up Availability</h6>
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {userData.meetup_availability && userData.meetup_availability.length > 0 ? (
                                                        extractNames(userData.meetup_availability).map((availability, index) => (
                                                            <span key={index} className="badge bg-warning">{availability}</span>
                                                        ))
                                                    ) : (
                                                        <span className="text-muted">No availability set</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Type */}
                                            <div className="tablefilelist_grid">
                                                <h4>Registration Type</h4>
                                                <p>{getRegisterTypeBadge(userData.register_type)}</p>
                                            </div>

                                            {/* Status */}
                                            <div className="tablefilelist_grid">
                                                <h4>Status</h4>
                                                <p>{getStatusBadge(userData.status)}</p>
                                            </div>
                                            {/* Created Date */}
                                            <div className="tablefilelist_grid">
                                                <h4>Member Since</h4>
                                                <p>{formatDate(userData.created_at)}</p>
                                            </div>

                                            {/* Free Features (Gifted Matches) */}
                                            <div className="tablefilelist_grid">
                                                <h4>Free Matches</h4>
                                                {giftTotals ? (
                                                    <div>

                                                        {giftItems.length > 0 ? (
                                                            <div className="border rounded p-2" style={{ maxHeight: 180, overflowY: 'auto' }}>
                                                                {giftItems.map((g: any) => (
                                                                    <div key={g._id} className="d-flex justify-content-between py-1">
                                                                        <div>
                                                                            <strong>{g.amount}</strong> match(es)
                                                                        </div>
                                                                        <div className="text-muted small">
                                                                            {g.expires_at ? `Expires: ${new Date(g.expires_at).toLocaleDateString()}` : 'No expiry'}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted">No free matches gifted.</div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">No free matches gifted.</div>
                                                )}
                                            </div>

                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>

                        {/* <hr className="my-4" /> */}

                        {/* <h4>Additional Information</h4>

                        <div className="talefile_list mt-4">
                            <Row>
                                <Col md={6}>
                                    <div className="tablefilelist_grid">
                                        <h4>Email Notifications</h4>
                                        <p>{userData.email_notifications ?
                                            <span className="badge bg-success">Enabled</span> :
                                            <span className="badge bg-secondary">Disabled</span>}
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Push Notifications</h4>
                                        <p>{userData.push_notifications ?
                                            <span className="badge bg-success">Enabled</span> :
                                            <span className="badge bg-secondary">Disabled</span>}
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Profile Completed</h4>
                                        <p>{userData.submit_personal_details ?
                                            <span className="badge bg-success">Yes</span> :
                                            <span className="badge bg-warning">Incomplete</span>}
                                        </p>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="tablefilelist_grid">
                                        <h4>Registration Priority</h4>
                                        <p>
                                            <span className={`badge ${userData.registration_priority_status === 'completed' ? 'bg-success' :
                                                userData.registration_priority_status === 'selected' ? 'bg-warning' : 'bg-secondary'
                                                }`}>
                                                {userData.registration_priority_status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Terms Accepted</h4>
                                        <p>{userData.terms_and_conditions ?
                                            <span className="badge bg-success">Yes</span> :
                                            <span className="badge bg-danger">No</span>}
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Last Updated</h4>
                                        <p>{formatDate(userData.updated_at)}</p>
                                    </div>
                                </Col>
                            </Row>
                        </div> */}

                    </div>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Body>
                    <Tabs
                        id="user-details-tabs"
                        className="customtabs mb-2"
                        activeKey={key}
                        onSelect={(k: any) => setKey(k || "dogs")}
                    >

                        <Tab eventKey="dogs" title="Dogs">
                            <Row>
                                <Col md={12}>
                                    {dogsError && (
                                        <Alert variant="danger" className="mb-3">
                                            {dogsError}
                                        </Alert>
                                    )}

                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search dogs..."
                                            className="searchfield"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>

                                    <DataTable
                                        columns={dogsColumns as any}
                                        data={filteredDogsData}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        progressPending={dogsLoading}
                                        progressComponent={<AppLoader size={150} />}
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">
                                                    {dogsLoading ? 'Loading dogs...' : 'No dogs found for this user'}
                                                </p>
                                                {!dogsLoading && dogsPagination.totalRows === 0 && (
                                                    <small className="text-muted">This user hasn't added any dogs yet</small>
                                                )}
                                            </div>
                                        }
                                    />

                                    {dogsPagination.totalRows > 0 && (
                                        <div className="mt-3 text-center">
                                            <small className="text-muted">
                                                Showing {filteredDogsData.length} of {dogsPagination.totalRows} dogs
                                            </small>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="matches" title="Matches">
                            <Row>
                                <Col md={12}>
                                    <Matches />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="payments" title="Payments">
                            <Row>
                                <Col md={12}>
                                    {paymentsError && (
                                        <Alert variant="danger" className="mb-3">
                                            {paymentsError}
                                        </Alert>
                                    )}

                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search payments..."
                                            className="searchfield"
                                            value={searchText}
                                            onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>

                                    <DataTable
                                        columns={paymentsColumns as any}
                                        data={paymentsData}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        progressPending={paymentsLoading}
                                        progressComponent={<AppLoader size={150} />}
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:credit-card-off" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">
                                                    {paymentsLoading ? 'Loading payments...' : 'No payments found for this user'}
                                                </p>
                                                {!paymentsLoading && paymentsPagination.totalRows === 0 && (
                                                    <small className="text-muted">This user hasn't made any payments yet</small>
                                                )}
                                            </div>
                                        }
                                    />

                                    {paymentsPagination.totalRows > 0 && (
                                        <div className="mt-3 text-center">
                                            <small className="text-muted">
                                                Showing {paymentsData.length} of {paymentsPagination.totalRows} payments
                                            </small>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Tab>

                    </Tabs>
                </Card.Body>
            </Card>


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

export default UserView;
