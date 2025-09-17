import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubAdminService } from '@/services';
import AppLoaderbtn from '@/components/Apploaderbtn';

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
    { label: 'Sub Admins', value: '/sub-admins' },
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

    const toggleRoute = (route: string) => {
        setAllowedRoutes(prev => prev.includes(route) ? prev.filter(r => r !== route) : [...prev, route]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = { name, email, password, allowed_routes: allowedRoutes } as any;
            const res = editId
                ? await SubAdminService.update(editId, payload)
                : await SubAdminService.create(payload);
            if (res.status === 1) {
                navigate('/sub-admins');
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
                                    <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={editId ? "Leave blank to keep unchanged" : "Enter password"} required={!editId} minLength={editId ? undefined as any : 6 as any} />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-2 form-group">
                                    <Form.Label>Allowed Tabs</Form.Label>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {ALL_ROUTE_OPTIONS.map(opt => (
                                            <Badge key={opt.value} bg={allowedRoutes.includes(opt.value) ? 'primary' : 'secondary'} style={{ cursor: 'pointer', padding: '13px', fontSize: '13px' }} onClick={() => toggleRoute(opt.value)}>
                                                {opt.label}
                                            </Badge>
                                        ))}
                                    </div>
                                    <div className="text-muted small mt-2">Click to toggle access.</div>
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end">
                            <Button className="py-0" type="submit" disabled={submitting}>{submitting ? <AppLoaderbtn size={70} /> : (editId ? 'Save Changes' : 'Create Sub Admin')}</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default AddSubAdmin;


