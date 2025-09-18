import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubAdminService } from '@/services';
import AppLoaderbtn from '@/components/Apploaderbtn';
import { showError } from '@/utils/sweetAlert';

const ALL_ROUTE_OPTIONS: { label: string; value: string }[] = [
    { label: 'Dashboard', value: '/dashboard' },
    { label: 'Users', value: '/users' },
    { label: 'Dogs', value: '/dogs' },
    { label: 'Payments', value: '/payments' },
    // { label: 'Subscription Packages', value: '/subscription-packages' },
    { label: 'Contact', value: '/contact' },
    { label: 'Report', value: '/report' },
    { label: 'FAQs', value: '/faqs' },
    // Single CMS option grants all /pages/* access by writing '/pages'
    { label: 'CMS', value: '/pages' },
    { label: 'Free Matches', value: '/gifting' },
    // { label: 'Sub Admins', value: '/sub-admins' },
];

const AddSubAdmin: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('id');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [permissionError, setPermissionError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password: string): string => {
        if (!password) return '';

        const errors: string[] = [];

        // Check for at least one capital letter
        if (!/[A-Z]/.test(password)) {
            errors.push('one uppercase letter');
        }

        // Check for at least one number
        if (!/[0-9]/.test(password)) {
            errors.push('one number');
        }

        // Check for at least one special character
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('one special character');
        }

        // Check minimum length
        if (password.length < 6) {
            errors.push('at least 6 characters');
        }

        if (errors.length > 0) {
            return `Password must contain ${errors.join(', ')}.`;
        }

        return '';
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Only validate if password is not empty and we're not in edit mode
        if (newPassword && !editId) {
            const error = validatePassword(newPassword);
            setPasswordError(error);
        } else {
            setPasswordError('');
        }
    };

    const toggleRoute = (route: string) => {
        setAllowedRoutes(prev => {
            const newRoutes = prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route];
            // Clear permission error when at least one permission is selected
            if (newRoutes.length > 0) {
                setPermissionError('');
            }
            return newRoutes;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate that at least one permission is selected
        if (allowedRoutes.length === 0) {
            setPermissionError('Please select at least one permission for the sub-admin.');
            return;
        }

        // Validate password for new sub-admins or when password is provided in edit mode
        if (!editId || (editId && password)) {
            const passwordValidationError = validatePassword(password);
            if (passwordValidationError) {
                setPasswordError(passwordValidationError);
                return;
            }
        }

        try {
            setSubmitting(true);
            const payload = { name, email, password, allowed_routes: allowedRoutes } as any;
            const res = editId
                ? await SubAdminService.update(editId, payload)
                : await SubAdminService.create(payload);
            if (res.status === 1) {
                navigate('/sub-admins');
            } else {
                showError(res.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    React.useEffect(() => {
        const loadIfEdit = async () => {
            if (!editId) return;
            const res = await SubAdminService.getById(editId);
            if (res.status === 1) {
                const a = res.data;
                setName(a.name || '');
                setEmail(a.email || '');
                setAllowedRoutes(Array.isArray(a.allowed_routes) ? a.allowed_routes : []);
            }
        };
        loadIfEdit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId]);

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3 form-group">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder={editId ? "Leave blank to keep unchanged" : "Enter password"}
                                        required={!editId}
                                        minLength={editId ? undefined as any : 6 as any}
                                        className={passwordError ? 'is-invalid' : ''}
                                    />
                                    {passwordError && (
                                        <div className="text-danger small mt-1">
                                            {passwordError}
                                        </div>
                                    )}
                                    {!editId && (
                                        <div className="text-muted small mt-1">
                                            Password must contain at least one uppercase letter, one number, and one special character.
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label>Allowed Permissions</Form.Label>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {ALL_ROUTE_OPTIONS.map(opt => (
                                            <Badge key={opt.value} bg={allowedRoutes.includes(opt.value) ? 'primary' : 'secondary'} style={{ cursor: 'pointer', padding: '13px', fontSize: '13px' }} onClick={() => toggleRoute(opt.value)}>
                                                {opt.label}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-muted small mt-2">Click to toggle access.</div>
                                    {permissionError && (
                                        <div className="text-danger small mt-2">
                                            {permissionError}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <Button
                                className="py-0"
                                type="submit"
                                disabled={submitting || passwordError !== '' || permissionError !== ''}
                            >
                                {submitting ? <AppLoaderbtn size={70} /> : (editId ? 'Save Changes' : 'Create Sub Admin')}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default AddSubAdmin;


