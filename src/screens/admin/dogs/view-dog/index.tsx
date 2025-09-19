import { IMAGES } from "@/contants/images";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Modal, Row, Tab, Tabs, Alert, Spinner, Badge } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DogService } from "@/services";
import type { Dog } from "@/types/api.types";
import { getDogProfileImage, getProfileImageUrl } from "@/utils/imageUtils";
import AppLoader from "@/components/Apploader";

const ViewDog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dogId = searchParams.get('id'); // Changed from 'dogId' to 'id'
    const [key, setKey] = useState<string>("breedings");
    const [dogData, setDogData] = useState<Dog | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    // Breeding data state
    const [breedingData, setBreedingData] = useState<any[]>([]);
    const [breedingLoading, setBreedingLoading] = useState<boolean>(false);
    const [breedingError, setBreedingError] = useState<string>("");
    const [breedingPagination, setBreedingPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [breedingSearch, setBreedingSearch] = useState<string>("");

    // Playdate data state
    const [playdateData, setPlaydateData] = useState<any[]>([]);
    const [playdateLoading, setPlaydateLoading] = useState<boolean>(false);
    const [playdateError, setPlaydateError] = useState<string>("");
    const [playdatePagination, setPlaydatePagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [playdateSearch, setPlaydateSearch] = useState<string>("");

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

    const extractNames = (items: any[]) => {
        if (!items || !Array.isArray(items)) return [];
        return items.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object') {
                if (item.name && typeof item.name === 'string') return item.name;
                if (item.name && typeof item.name === 'object' && item.name.name) return item.name.name;
                if (item._id) return item._id.toString();
            }
            return 'Unknown';
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'danger';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            case 'submitted': return 'warning';
            default: return 'secondary';
        }
    };

    const getProfileTypeBadge = (type: string) => {
        switch (type) {
            case 'dating': return 'primary';
            case 'breeding': return 'info';
            case 'both': return 'warning';
            default: return 'secondary';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Fetch dog details
    const fetchDogDetails = async () => {
        if (!dogId) {
            setError("Dog ID is required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await DogService.getDogById(dogId);

            if (response?.status === 1 && response?.data) {
                setDogData(response.data);
            } else {
                setError(response.message || "Failed to fetch dog details");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching dog details");
        } finally {
            setLoading(false);
        }
    };

    // Fetch breeding data
    const fetchBreedingData = async (page: number = 1, limit: number = 10, search?: string) => {
        if (!dogId) return;

        try {
            setBreedingLoading(true);
            setBreedingError("");

            const filters = { page, limit, search: search || undefined };
            const response: any = await DogService.getDogBreedingData(dogId, filters);

            if (response?.status === 1) {
                setBreedingData(response.data || []);
                setBreedingPagination({
                    page: response?.meta?.page || 1,
                    limit: response?.meta?.limit || 10,
                    total: response?.meta?.total || 0,
                    totalPages: response?.meta?.total_pages || 0
                });
            } else {
                setBreedingError(response.message || "Failed to fetch breeding data");
                setBreedingData([]);
            }
        } catch (err: any) {
            setBreedingError(err.message || "An error occurred while fetching breeding data");
            setBreedingData([]);
        } finally {
            setBreedingLoading(false);
        }
    };

    // Fetch playdate data
    const fetchPlaydateData = async (page: number = 1, limit: number = 10, search?: string) => {
        if (!dogId) return;

        try {
            setPlaydateLoading(true);
            setPlaydateError("");

            const filters = { page, limit, search: search || undefined };
            const response: any = await DogService.getDogPlaydateData(dogId, filters);

            if (response?.status === 1) {
                setPlaydateData(response.data || []);
                setPlaydatePagination({
                    page: response.meta?.page || 1,
                    limit: response.meta?.limit || 10,
                    total: response.meta?.total || 0,
                    totalPages: response.meta?.totalPages || 0
                });
            } else {
                setPlaydateError(response.message || "Failed to fetch playdate data");
                setPlaydateData([]);
            }
        } catch (err: any) {
            setPlaydateError(err.message || "An error occurred while fetching playdate data");
            setPlaydateData([]);
        } finally {
            setPlaydateLoading(false);
        }
    };

    // Handle pagination for breeding
    const handleBreedingPageChange = (page: number) => {
        setBreedingPagination(prev => ({ ...prev, page }));
        fetchBreedingData(page, breedingPagination.limit, breedingSearch);
    };

    const handleBreedingPerRowsChange = (perPage: number, page: number) => {
        setBreedingPagination(prev => ({ ...prev, limit: perPage, page }));
        fetchBreedingData(page, perPage, breedingSearch);
    };

    // Handle pagination for playdates
    const handlePlaydatePageChange = (page: number) => {
        setPlaydatePagination(prev => ({ ...prev, page }));
        fetchPlaydateData(page, playdatePagination.limit, playdateSearch);
    };

    const handlePlaydatePerRowsChange = (perPage: number, page: number) => {
        setPlaydatePagination(prev => ({ ...prev, limit: perPage, page }));
        fetchPlaydateData(page, perPage, playdateSearch);
    };

    // Debounced search for breeding
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (breedingSearch !== undefined) {
                setBreedingPagination(prev => ({ ...prev, page: 1 }));
                fetchBreedingData(1, breedingPagination.limit, breedingSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [breedingSearch]);

    // Debounced search for playdates
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (playdateSearch !== undefined) {
                setPlaydatePagination(prev => ({ ...prev, page: 1 }));
                fetchPlaydateData(1, playdatePagination.limit, playdateSearch);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [playdateSearch]);

    // Tab change handler
    const handleTabChange = (selectedKey: string | null) => {
        setKey(selectedKey || "details");

        // Fetch data when switching to breeding or playdate tabs
        if (selectedKey === "breedings" && breedingData.length === 0) {
            fetchBreedingData();
        } else if (selectedKey === "playdates" && playdateData.length === 0) {
            fetchPlaydateData();
        }
    };

    // Table columns for breeding data
    const breedingColumns = [
        {
            name: "S.no.",
            cell: (_: any, index: number) => (breedingPagination.page - 1) * breedingPagination.limit + index + 1,
            width: "80px"
        },
        {
            name: "Partner Dog",
            cell: (row: any) => (
                <div className="d-flex align-items-center">
                    <div>
                        <div className="fw-bold">{row.other_dog_details?.dog_name || 'N/A'}</div>
                        <div className="text-muted small">{row.other_dog_details?.breed?.name || row.other_dog_details?.breed || 'N/A'}</div>
                    </div>
                </div>
            ),
            minWidth: "180px"
        },
        {
            name: "Partner Owner",
            cell: (row: any) => {
                // Handle both array and object structure for other_user_details
                const userDetails = Array.isArray(row.other_user_details)
                    ? row.other_user_details[0]
                    : row.other_user_details;

                return (
                    <div>
                        <div className="fw-bold">{userDetails?.name || 'N/A'}</div>
                        <div className="text-muted small">{userDetails?.email || 'N/A'}</div>
                    </div>
                );
            },
            minWidth: "180px"
        },
        {
            name: "Match Date",
            cell: (row: any) => formatDate(row.created_at),
            minWidth: "120px"
        },
        {
            name: "Status",
            cell: (row: any) => (
                <Badge bg={row.status === 'accepted' ? 'success' : 'secondary'} className="text-capitalize">
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
            ),
            minWidth: "100px"
        }
    ];

    // Table columns for playdate data
    const playdateColumns = [
        {
            name: "S.no.",
            cell: (_: any, index: number) => (playdatePagination.page - 1) * playdatePagination.limit + index + 1,
            width: "80px"
        },
        {
            name: "Playmate Dog",
            cell: (row: any) => (
                <div className="d-flex align-items-center">
                    <div>
                        <div className="fw-bold">{row.other_dog_details?.dog_name || 'N/A'}</div>
                        <div className="text-muted small">{row.other_dog_details?.breed?.name || row.other_dog_details?.breed || 'N/A'}</div>
                    </div>
                </div>
            ),
            minWidth: "180px"
        },
        {
            name: "Playmate Owner",
            cell: (row: any) => {
                // Handle both array and object structure for other_user_details
                const userDetails = Array.isArray(row.other_user_details)
                    ? row.other_user_details[0]
                    : row.other_user_details;

                return (
                    <div>
                        <div className="fw-bold">{userDetails?.name || 'N/A'}</div>
                        <div className="text-muted small">{userDetails?.email || 'N/A'}</div>
                    </div>
                );
            },
            minWidth: "180px"
        },
        {
            name: "Match Date",
            cell: (row: any) => formatDate(row.created_at),
            minWidth: "120px"
        },
        {
            name: "Status",
            cell: (row: any) => (
                <Badge bg={row.status === 'accepted' ? 'success' : 'secondary'}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
            ),
            minWidth: "100px"
        }
    ];

    useEffect(() => {
        if (dogId) {
            fetchDogDetails();
        }
    }, [dogId]);

    if (!dogId) {
        return (
            <div className="text-center p-4">
                <Alert variant="danger">
                    Dog ID is required to view details
                </Alert>
                <Link to="/dogs" className="btn btn-primary">
                    Back to Dogs
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center p-4">
                <AppLoader size={150} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4">
                <Alert variant="danger">
                    {error}
                </Alert>
                <Link to="/dogs" className="btn btn-primary">
                    Back to Dogs
                </Link>
            </div>
        );
    }

    if (!dogData) {
        return (
            <div className="text-center p-4">
                <Alert variant="warning">
                    Dog not found
                </Alert>
                <Link to="/dogs" className="btn btn-primary">
                    Back to Dogs
                </Link>
            </div>
        );
    }

    return (
        <React.Fragment>
            <Card>
                <Card.Header className="d-flex align-items-center justify-content-between flex-wrap">
                    <h5>Dog Details</h5>
                    <Button className="btn btn-primary px-4 py-2 h-auto" onClick={() => navigate(-1)}>
                        Back
                    </Button>
                </Card.Header>

                <Card.Body className="taledtl_div">
                    <div className="talefile_list mt-4">
                        <Row className="gy-3">
                            <Col xl={6} lg={6} md={6} className="order-2 order-lg-1">
                                <div className="userinfo_wrapper userinfo_wrapper_for_profile_page">
                                    <div className="userinfo_inner">
                                        <div className="tablefilelist_grid">
                                            <h4>Dog Name</h4>
                                            <p>{dogData?.dog_name}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Breed</h4>
                                            <p>{safeGetString(dogData?.breed)}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Breed Classification</h4>
                                            <p>
                                                <Badge bg={dogData?.breed_classification === 'purebred' ? 'success' : 'info'}>
                                                    {dogData?.breed_classification?.replace(/_/g, ' ').charAt(0).toUpperCase() + dogData?.breed_classification?.replace(/_/g, ' ').slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Gender</h4>
                                            <p>
                                                <Badge bg={dogData?.gender === 'male' ? 'primary' : 'danger'}>
                                                    {dogData.gender.charAt(0).toUpperCase() + dogData.gender.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Age</h4>
                                            <p>{dogData?.age} year{dogData?.age > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Color</h4>
                                            <p>{dogData?.colour}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Character</h4>
                                            <p>{extractNames(dogData?.character).join(', ')}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Personality</h4>
                                            <p>{dogData?.personality}</p>
                                        </div>

                                        <div className="tablefilelist_grid">
                                            <h4>What's Your Dog Like?</h4>
                                            <p>{extractNames(dogData?.dog_likes).join(', ')}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Profile Type</h4>
                                            <p>
                                                <Badge bg={getProfileTypeBadge(dogData?.profile_type)}>
                                                    {dogData.profile_type.charAt(0).toUpperCase() + dogData.profile_type.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>


                                    </div>
                                </div>
                            </Col>
                            <Col xl={6} lg={6} md={6} className="order-1 order-lg-2">
                                <div className="userinfo_wrapper userinfo_wrapper_for_profile_page">
                                    <div className="tablefilelist_grid">
                                        <h4>Profile Status</h4>
                                        <p>
                                            <Badge bg={getStatusBadge(dogData?.profile_status)}>
                                                {dogData.profile_status.charAt(0).toUpperCase() + dogData.profile_status.slice(1)}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Dog Date Tagline</h4>
                                        <p>"{dogData?.dog_date_tagline}"</p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Favorite Dog Treat</h4>
                                        <p>{dogData?.favorite_dog_treat}</p>
                                    </div>
                                    {/* {dogData?.gender === 'male' && dogData?.breeding_price && (
                                      
                                    )} */}
                                    <div className="tablefilelist_grid">
                                        <h4>Available for Breeding?</h4>
                                        <p>
                                            <Badge bg={dogData?.available_for_breeding ? 'success' : 'danger'}>
                                                {dogData.available_for_breeding ? 'Yes' : 'No'}
                                            </Badge>
                                        </p>

                                    </div>
                                    {dogData?.gender === 'male' && dogData?.profile_type == "breeding" && (
                                        <div className="tablefilelist_grid">
                                            <h4>Breeding Price</h4>
                                            <p>£{dogData.breeding_price}</p>
                                        </div>
                                    )}
                                    <div className="tablefilelist_grid">
                                        <h4>Status</h4>
                                        <p>
                                            <Badge bg={getStatusBadge(dogData?.status)}>
                                                {dogData.status.charAt(0).toUpperCase() + dogData.status.slice(1)}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Created At</h4>
                                        <p>{formatDate(dogData?.created_at)}</p>
                                    </div>
                                    <div className="tablefilelist_grid">
                                        <h4>Updated At</h4>
                                        <p>{formatDate(dogData?.updated_at)}</p>
                                    </div>
                                    <div className="userinfo_inner">
                                        <div className="tablefilelist_grid">
                                            <h4>Dog Owner</h4>
                                            <p>{dogData?.user_details?.name || 'N/A'}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Owner Email</h4>
                                            <p>{dogData?.user_details?.email || 'N/A'}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Owner Phone</h4>
                                            <p>{dogData?.user_details?.phone_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Dog Images Section */}
                        <Row className="mt-4">
                            <Col md={12}>
                                <h5 className="mb-3">Dog Images</h5>
                                <Row>
                                    {/* Profile Picture */}
                                    {dogData?.profile_picture && (
                                        <Col md={4} lg={3} className="mb-3">
                                            <Card>
                                                <Card.Body className="text-center p-2">
                                                    <div style={{
                                                        width: '100%',
                                                        aspectRatio: '1',
                                                        backgroundColor: '#f8f9fa',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <img
                                                            src={getDogProfileImage(dogData)}
                                                            alt="Profile Picture"
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = IMAGES.Dog; // Fallback to default dog image on error
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="mt-2 mb-0" style={{ fontSize: '12px' }}>Profile Picture</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Additional Pictures */}
                                    {dogData.pictures && dogData.pictures.map((picture, index) => (
                                        <Col md={4} lg={3} className="mb-3" key={index}>
                                            <Card>
                                                <Card.Body className="text-center p-2">
                                                    <div style={{
                                                        width: '100%',
                                                        aspectRatio: '1',
                                                        backgroundColor: '#f8f9fa',
                                                        border: '1px solid #dee2e6',
                                                        borderRadius: '8px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        overflow: 'hidden'
                                                    }}>
                                                        <img
                                                            src={getProfileImageUrl(picture)}
                                                            alt={`Picture ${index + 1}`}
                                                            style={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                objectFit: 'contain'
                                                            }}
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = IMAGES.Dog; // Fallback to default dog image on error
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="mt-2 mb-0" style={{ fontSize: '12px' }}>Picture {index + 1}</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </Col>
                        </Row>

                        {/* Documents Section */}
                        <Row className="mt-4">
                            <Col md={12}>
                                <h5 className="mb-3">Documents & Certifications</h5>
                                <Row>
                                    {/* Breed Certification */}
                                    {dogData.breed_certification && (
                                        <Col md={3} className="mb-3">
                                            <Card>
                                                <Card.Body className="text-center">
                                                    <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-primary" />
                                                    <p style={{ fontSize: '12px' }}>Breed Certification</p>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => dogData.breed_certification?.file_path && window.open(dogData.breed_certification.file_path, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        View
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Vaccination Certification */}
                                    {dogData.vaccination_certification && (
                                        <Col md={3} className="mb-3">
                                            <Card>
                                                <Card.Body className="text-center">
                                                    <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-success" />
                                                    <p style={{ fontSize: '12px' }}>Vaccination Certification</p>
                                                    <Button
                                                        variant="outline-success"
                                                        size="sm"
                                                        onClick={() => dogData.vaccination_certification?.file_path && window.open(dogData.vaccination_certification.file_path, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        View
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Flea Documents */}
                                    {dogData.flea_documents && (
                                        <Col md={3} className="mb-3">
                                            <Card>
                                                <Card.Body className="text-center">
                                                    <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-info" />
                                                    <p style={{ fontSize: '12px' }}>Flea Documents</p>
                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => dogData.flea_documents?.file_path && window.open(dogData.flea_documents.file_path, '_blank', 'noopener,noreferrer')}
                                                    >
                                                        View
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}
                                </Row>

                                {/* Health Documents */}
                                {dogData.health_document && dogData.health_document.length > 0 && (
                                    <>
                                        <h6 className="mt-3 mb-2">Health Documents</h6>
                                        <Row>
                                            {dogData.health_document.map((doc, index) => (
                                                <Col md={3} className="mb-3" key={index}>
                                                    <Card>
                                                        <Card.Body className="text-center">
                                                            <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-warning" />
                                                            <p style={{ fontSize: '12px' }}>{doc.title || `Health Document ${index + 1}`}</p>
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => window.open(doc.file_path, '_blank', 'noopener,noreferrer')}
                                                            >
                                                                View
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </>
                                )}

                                {/* Pedigree Documents */}
                                {dogData.pedigree && dogData.pedigree.length > 0 && (
                                    <>
                                        <h6 className="mt-3 mb-2">Pedigree Documents</h6>
                                        <Row>
                                            {dogData.pedigree.map((doc, index) => (
                                                <Col md={3} className="mb-3" key={index}>
                                                    <Card>
                                                        <Card.Body className="text-center">
                                                            <Icon icon="mdi:file-document-outline" width={40} className="mb-2 text-secondary" />
                                                            <p style={{ fontSize: '12px' }}>{doc.title || `Pedigree Document ${index + 1}`}</p>
                                                            <Button
                                                                variant="outline-secondary"
                                                                size="sm"
                                                                onClick={() => window.open(doc.file_path, '_blank', 'noopener,noreferrer')}
                                                            >
                                                                View
                                                            </Button>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    </>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mt-3">
                <Card.Body>
                    <Tabs
                        id="boxer-status-tabs"
                        className="customtabs mb-2"
                        activeKey={key}
                        onSelect={(k: any) => handleTabChange(k)}
                    >

                        <Tab eventKey="breedings" title="Breedings">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search breedings..."
                                            className="searchfield"
                                            value={breedingSearch}
                                            onChange={(e) => setBreedingSearch(e.target.value)}
                                        />
                                    </div>

                                    {breedingError && (
                                        <div className="alert alert-danger mb-3">
                                            {breedingError}
                                        </div>
                                    )}

                                    <DataTable
                                        columns={breedingColumns}
                                        data={breedingData}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={breedingPagination.total}
                                        onChangePage={handleBreedingPageChange}
                                        onChangeRowsPerPage={handleBreedingPerRowsChange}
                                        paginationPerPage={breedingPagination.limit}
                                        progressPending={breedingLoading}
                                        progressComponent={<AppLoader size={150} />}
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:heart-multiple" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No breeding records found for this dog</p>
                                            </div>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="playdates" title="Playdates">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search playdates..."
                                            className="searchfield"
                                            value={playdateSearch}
                                            onChange={(e) => setPlaydateSearch(e.target.value)}
                                        />
                                    </div>

                                    {playdateError && (
                                        <div className="alert alert-danger mb-3">
                                            {playdateError}
                                        </div>
                                    )}

                                    <DataTable
                                        columns={playdateColumns}
                                        data={playdateData}
                                        pagination
                                        paginationServer
                                        paginationTotalRows={playdatePagination.total}
                                        onChangePage={handlePlaydatePageChange}
                                        onChangeRowsPerPage={handlePlaydatePerRowsChange}
                                        paginationPerPage={playdatePagination.limit}
                                        progressPending={playdateLoading}
                                        progressComponent={<AppLoader size={150} />}
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog-side" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No playdate records found for this dog</p>
                                            </div>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>

            {/* Delete Modal */}
            <Modal className="modal_Delete" show={false} onHide={() => { }} centered>
                <Modal.Body>
                    <div className="modaldelete_div">
                        <Icon className="delete_icon" icon="gg:close-o" />
                        <h3>Are You Sure ?</h3>
                        <p>You will not be able to recover the deleted record!</p>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <Button
                            variant="outline-danger"
                            onClick={() => { }}
                            className="px-4"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            className="px-4 min_width110"
                            onClick={() => { }}
                        >
                            Ok
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ViewDog;
