import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Form, InputGroup, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { SubAdminService } from '@/services';
import AppLoader from '@/components/Apploader';

const SubAdmins: React.FC = () => {
    const [search, setSearch] = useState('');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Using server pagination state only
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const navigate = useNavigate();

    const fetchAdmins = async (p = 1, l = 10, s?: string) => {
        try {
            const res = await SubAdminService.list({ page: p, limit: l, search: s });
            if (res.status === 1) {
                setData(res.data.admins || []);
                setTotal(res.data.pagination?.total_admins || 0);
                setPerPage(res.data.pagination?.per_page || 10);
            } else {
                setData([]);
                setTotal(0);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins(1, 10);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchAdmins(1, perPage, search.trim() || undefined), 400);
        return () => clearTimeout(t);
    }, [search]);

    const columns = [
        { name: 'Name', selector: (row: any) => row.name, sortable: true },
        { name: 'Email', selector: (row: any) => row.email, sortable: true },
        {
            name: 'Status', selector: (row: any) => row.status, width: '120px',
            cell: (row: any) => <span className={`badge ${row.status === 'active' ? 'bg-success' : 'bg-danger'}`}>{row.status}</span>
        },
        {
            name: 'Allowed Routes',
            cell: (row: any) => {
                const list: string[] = row.allowed_routes || [];
                const labelFor = (r: string) => r === '/pages' ? 'CMS' : r;
                return (
                    <div className="d-flex gap-1 flex-wrap">
                        {list.slice(0, 4).map((r: string, i: number) => (
                            <span className="badge bg-secondary" key={i}>
                                {labelFor(r)}
                            </span>
                        ))}
                        {list.length > 4 && (
                            <span className="text-muted small">+{list.length - 4}</span>
                        )}
                    </div>
                )
            }
        },
        {
            name: 'Action',
            width: '160px',
            cell: (row: any) => (
                <div className="d-flex align-items-center gap-3">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                    >
                        <Link to={`/sub-admins/add?id=${row._id}`}>
                            <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
                        </Link>
                    </OverlayTrigger>
                    {row.status === 'active' ? (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="ban-tooltip">Ban Admin</Tooltip>}
                        >
                            <Link to="javascript:void(0)" onClick={async () => {
                                const { showConfirmation, showSuccess } = await import('@/utils/sweetAlert');
                                const { isConfirmed } = await showConfirmation(
                                    'Ban Sub Admin',
                                    'Are you sure you want to ban this sub-admin? They will be unable to login until unbanned.',
                                    'Yes, Ban',
                                    'Cancel'
                                );
                                if (!isConfirmed) return;
                                const res = await SubAdminService.updateStatus(row._id, 'inactive');
                                if (res.status === 1) {
                                    await showSuccess('Banned', 'The sub-admin has been banned successfully.');
                                    fetchAdmins(1, perPage, search.trim() || undefined);
                                }
                            }}>
                                <Icon icon="mdi:account-off" width={20} height={20} className="text-danger" />
                            </Link>
                        </OverlayTrigger>
                    ) : (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="unban-tooltip">Unban Admin</Tooltip>}
                        >
                            <Link to="javascript:void(0)" onClick={async () => {
                                const { showConfirmation, showSuccess } = await import('@/utils/sweetAlert');
                                const { isConfirmed } = await showConfirmation(
                                    'Unban Sub Admin',
                                    'Are you sure you want to unban this sub-admin? They will be able to login again.',
                                    'Yes, Unban',
                                    'Cancel'
                                );
                                if (!isConfirmed) return;
                                const res = await SubAdminService.updateStatus(row._id, 'active');
                                if (res.status === 1) {
                                    await showSuccess('Unbanned', 'The sub-admin has been unbanned successfully.');
                                    fetchAdmins(1, perPage, search.trim() || undefined);
                                }
                            }}>
                                <Icon icon="mdi:account-check" width={20} height={20} className="text-success" />
                            </Link>
                        </OverlayTrigger>
                    )}
                </div>
            )
        }
    ];

    return (
        <React.Fragment>
            <Card>
                <Card.Body>
                    <Row className="align-items-center mb-3">
                        <Col md={6}><h5 className="mb-0">Sub Admins</h5></Col>
                        <Col md={6} className="text-end">
                            <InputGroup className="mb-2 justify-content-end">
                                <Form.Control style={{ maxWidth: 260 }} placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
                                <Button variant="primary" onClick={() => navigate('/sub-admins/add')}>
                                    <Icon icon="mdi:plus" className="me-1" /> Add Admin
                                </Button>
                            </InputGroup>
                        </Col>
                    </Row>
                    <DataTable
                        columns={columns as any}
                        data={data}
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                        paginationPerPage={perPage}
                        onChangePage={(p) => fetchAdmins(p, perPage, search.trim() || undefined)}
                        onChangeRowsPerPage={(n, p) => fetchAdmins(p, n, search.trim() || undefined)}
                        progressPending={loading}
                        progressComponent={<AppLoader size={150} />}
                        className="custom-table"
                    />
                </Card.Body>
            </Card>
        </React.Fragment>
    );
};

export default SubAdmins;


