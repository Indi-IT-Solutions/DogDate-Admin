import { IMAGES } from "@/contants/images";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Button, Card, Col, Modal, Row, Tab, Tabs, Alert, Spinner, Badge } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DogService } from "@/services";
import type { Dog } from "@/types/api.types";

const ViewDog: React.FC = () => {
    const [searchParams] = useSearchParams();
    const dogId = searchParams.get('id');

    const [key, setKey] = useState<string>("details");
    const [dogData, setDogData] = useState<Dog | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

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

            if (response.status === 1 && response.data) {
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
                <Spinner animation="border" role="status" />
                <p className="mt-2">Loading dog details...</p>
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
                    <Link className="btn btn-primary px-4 py-2 h-auto" to="/users">
                        Back
                    </Link>
                </Card.Header>

                <Card.Body className="taledtl_div">
                    <div className="talefile_list mt-4">
                        <Row className="gy-3">
                            <Col xl={6} lg={6} md={6} className="order-2 order-lg-1">
                                <div className="userinfo_wrapper userinfo_wrapper_for_profile_page">
                                    <div className="userinfo_inner">
                                        <div className="tablefilelist_grid">
                                            <h4>Dog Name</h4>
                                            <p>{dogData.dog_name}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Breed</h4>
                                            <p>{safeGetString(dogData.breed)}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Breed Classification</h4>
                                            <p>
                                                <Badge bg={dogData.breed_classification === 'purebred' ? 'success' : 'info'}>
                                                    {dogData.breed_classification.charAt(0).toUpperCase() + dogData.breed_classification.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Gender</h4>
                                            <p>
                                                <Badge bg={dogData.gender === 'male' ? 'primary' : 'danger'}>
                                                    {dogData.gender.charAt(0).toUpperCase() + dogData.gender.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Age</h4>
                                            <p>{dogData.age} year{dogData.age > 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Color</h4>
                                            <p>{dogData.colour}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Character</h4>
                                            <p>{extractNames(dogData.character).join(', ')}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Personality</h4>
                                            <p>{dogData.personality}</p>
                                        </div>

                                        <div className="tablefilelist_grid">
                                            <h4>What's Your Dog Like?</h4>
                                            <p>{extractNames(dogData.dog_likes).join(', ')}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Profile Type</h4>
                                            <p>
                                                <Badge bg={getProfileTypeBadge(dogData.profile_type)}>
                                                    {dogData.profile_type.charAt(0).toUpperCase() + dogData.profile_type.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>

                                        <div className="tablefilelist_grid">
                                            <h4>Profile Status</h4>
                                            <p>
                                                <Badge bg={getStatusBadge(dogData.profile_status)}>
                                                    {dogData.profile_status.charAt(0).toUpperCase() + dogData.profile_status.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Dog Date Tagline</h4>
                                            <p>"{dogData.dog_date_tagline}"</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Favorite Dog Treat</h4>
                                            <p>{dogData.favorite_dog_treat}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Breeding Price</h4>
                                            <p>${dogData.breeding_price}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Available for Breeding?</h4>
                                            <p>
                                                <Badge bg={dogData.available_for_breeding ? 'success' : 'danger'}>
                                                    {dogData.available_for_breeding ? 'Yes' : 'No'}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Status</h4>
                                            <p>
                                                <Badge bg={getStatusBadge(dogData.status)}>
                                                    {dogData.status.charAt(0).toUpperCase() + dogData.status.slice(1)}
                                                </Badge>
                                            </p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Created At</h4>
                                            <p>{formatDate(dogData.created_at)}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Updated At</h4>
                                            <p>{formatDate(dogData.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6} lg={6} md={6} className="order-1 order-lg-2">
                                <div className="userinfo_wrapper userinfo_wrapper_for_profile_page">
                                    <div className="userinfo_inner">
                                        <div className="tablefilelist_grid">
                                            <h4>Dog Owner</h4>
                                            <p>{dogData.user_details?.name || 'N/A'}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Owner Email</h4>
                                            <p>{dogData.user_details?.email || 'N/A'}</p>
                                        </div>
                                        <div className="tablefilelist_grid">
                                            <h4>Owner Phone</h4>
                                            <p>{dogData.user_details?.phone_number || 'N/A'}</p>
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
                                    {dogData.profile_picture && (
                                        <Col md={3} className="mb-3">
                                            <Card>
                                                <Card.Body className="text-center p-2">
                                                    <img
                                                        src={dogData.profile_picture.file_path}
                                                        alt="Profile Picture"
                                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                        className="rounded"
                                                    />
                                                    <p className="mt-2 mb-0" style={{ fontSize: '12px' }}>Profile Picture</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )}

                                    {/* Additional Pictures */}
                                    {dogData.pictures && dogData.pictures.map((picture, index) => (
                                        <Col md={3} className="mb-3" key={index}>
                                            <Card>
                                                <Card.Body className="text-center p-2">
                                                    <img
                                                        src={picture.file_path}
                                                        alt={`Picture ${index + 1}`}
                                                        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                                        className="rounded"
                                                    />
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
                                                    <Button variant="outline-primary" size="sm">
                                                        <a href={dogData.breed_certification.file_path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                            View
                                                        </a>
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
                                                    <Button variant="outline-success" size="sm">
                                                        <a href={dogData.vaccination_certification.file_path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                            View
                                                        </a>
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
                                                    <Button variant="outline-info" size="sm">
                                                        <a href={dogData.flea_documents.file_path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                            View
                                                        </a>
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
                                                            <Button variant="outline-warning" size="sm">
                                                                <a href={doc.file_path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                    View
                                                                </a>
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
                                                            <Button variant="outline-secondary" size="sm">
                                                                <a href={doc.file_path} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                    View
                                                                </a>
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
                        onSelect={(k: any) => setKey(k || "details")}
                    >
                        <Tab eventKey="details" title="Details">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search details..."
                                            className="searchfield"
                                            value={""}
                                            onChange={(e) => { }}
                                        />
                                    </div>
                                    <DataTable
                                        columns={[]}
                                        data={[]}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No details found for this user</p>
                                            </div>
                                        }
                                    />
                                </Col>
                            </Row>
                        </Tab>

                        <Tab eventKey="breedings" title="Breedings">
                            <Row>
                                <Col md={12}>
                                    <div className="text-end mb-3">
                                        <input
                                            type="text"
                                            placeholder="Search breedings..."
                                            className="searchfield"
                                            value={""}
                                            onChange={(e) => { }}
                                        />
                                    </div>
                                    <DataTable
                                        columns={[]}
                                        data={[]}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No breedings found for this user</p>
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
                                            value={""}
                                            onChange={(e) => { }}
                                        />
                                    </div>
                                    <DataTable
                                        columns={[]}
                                        data={[]}
                                        pagination
                                        responsive
                                        className="custom-table"
                                        noDataComponent={
                                            <div className="text-center py-4">
                                                <Icon icon="mdi:dog" width={48} height={48} className="text-muted mb-2" />
                                                <p className="text-muted">No playdates found for this user</p>
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
                    <Button
                        variant="outline-danger"
                        onClick={() => { }}
                        className="px-4 me-3"
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
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default ViewDog;
