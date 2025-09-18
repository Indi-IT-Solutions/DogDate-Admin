import React from 'react';
import { Card, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { RedeemableCoinService, UserService } from '@/services';
import { showError, showSuccess, handleApiError } from '@/utils/sweetAlert';
import AppLoader from '@/components/Apploader';
import AppLoaderbtn from '@/components/Apploaderbtn';

const Gifting: React.FC = () => {
    const [search, setSearch] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [data, setData] = React.useState<any[]>([]);
    const [userSearch, setUserSearch] = React.useState('');
    const [userResults, setUserResults] = React.useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = React.useState<any[]>([]);
    const [giftAmount, setGiftAmount] = React.useState<number | ''>('');
    const [submitting, setSubmitting] = React.useState(false);

    const fetchList = async (p = 1, l = 10, s?: string) => {
        try {
            const res = await RedeemableCoinService.list({ page: p, limit: l, search: s });
            if (res.status === 1) {
                setData(res.data.items || []);
                setPage(res.data.pagination?.current_page || 1);
                setPerPage(res.data.pagination?.per_page || 10);
                setTotal(res.data.pagination?.total_items || 0);
            } else {
                setData([]);
                setTotal(0);
            }
        } catch (err: any) {
            handleApiError(err, 'Failed to load gifting records');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchList(1, 10);
    }, []);

    React.useEffect(() => {
        const t = setTimeout(() => fetchList(1, perPage, search.trim() || undefined), 400);
        return () => clearTimeout(t);
    }, [search]);

    React.useEffect(() => {
        const t = setTimeout(async () => {
            const s = userSearch.trim();
            if (!s) { setUserResults([]); return; }
            try {
                const res: any = await UserService.getUsers({ page: 1, limit: 10, search: s });
                if (res?.status === 1) setUserResults(res?.data || []);
                else setUserResults([]);
            } catch {
                setUserResults([]);
            }
        }, 400);
        return () => clearTimeout(t);
    }, [userSearch]);

    const addUser = (u: any) => {
        if (selectedUsers.find(x => x._id === u._id)) return;
        setSelectedUsers(prev => [...prev, u]);
    };
    const removeUser = (id: string) => setSelectedUsers(prev => prev.filter(x => x._id !== id));

    const columns = [
        { name: 'User', selector: (row: any) => row.user?.name || '-', sortable: true },
        { name: 'Email', selector: (row: any) => row.user?.email || '-', sortable: true },
        { name: 'Amount', selector: (row: any) => row.amount, width: '120px' },
        { name: 'Status', selector: (row: any) => row.status, width: '140px', cell: (r: any) => <span className={`badge ${r.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>{r.status}</span> },
        { name: 'Created', selector: (row: any) => new Date(row.created_at).toLocaleString() },
        { name: 'Expires', selector: (row: any) => row.expires_at ? new Date(row.expires_at).toLocaleString() : '—' },
    ];

    return (
        <React.Fragment>
            <Row className="mb-3">
                <Col><h5 className="mb-0">Free Matches</h5></Col>
            </Row>

            <form>
                <Card className="mb-3">
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Group className='mb-3 form-group'>
                                    <Form.Label>Add users to gift</Form.Label>
                                    <Form.Control placeholder="Search users by name or email" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
                                    {!!userResults.length && (
                                        <div className="border rounded p-2 mt-2" style={{ maxHeight: 220, overflowY: 'auto' }}>
                                            {userResults.map((u: any) => (
                                                <div key={u._id} className="d-flex justify-content-between align-items-center py-1">
                                                    <div>
                                                        <strong>{u.name}</strong>
                                                        <div className="text-muted small">{u.email}</div>
                                                    </div>
                                                    <Button size="sm" variant="outline-primary" onClick={() => addUser(u)}>Add</Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Group className='mb-3 form-group'>
                                    <Form.Label>Selected users</Form.Label>
                                    <div className="border rounded p-2" style={{ minHeight: 100, maxHeight: 280, overflowY: 'auto' }}>
                                        {selectedUsers.length === 0 && <div className="text-muted">No users selected</div>}
                                        {selectedUsers.map(u => (
                                            <div key={u._id} className="d-flex justify-content-between align-items-center py-1">
                                                <div>
                                                    <strong>{u.name}</strong>
                                                    <div className="text-muted small">{u.email}</div>
                                                </div>
                                                <Button size="sm" variant="outline-danger" onClick={() => removeUser(u._id)}>Remove</Button>
                                            </div>
                                        ))}
                                    </div>
                                </Form.Group>
                                <div className="d-flex align-items-end gap-2 mt-3">
                                    <Form.Group className='mb-0 form-group'>
                                        <Form.Label>Gift amount</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Matches to gift"
                                            value={giftAmount}
                                            min={1}
                                            onChange={(e) => {
                                                const v = e.target.value;
                                                const n = Number(v);
                                                if (v === '') setGiftAmount('');
                                                else if (!Number.isNaN(n)) setGiftAmount(Math.max(1, Math.floor(n)));
                                            }}
                                        />
                                    </Form.Group>
                                    <Button
                                        disabled={submitting || selectedUsers.length === 0 || !giftAmount || Number(giftAmount) <= 0}
                                        className="py-0"
                                        onClick={async () => {
                                            try {
                                                setSubmitting(true);
                                                const ids = selectedUsers.map(u => u._id);
                                                const res = await RedeemableCoinService.bulkAdd({ user_ids: ids, amount: Number(giftAmount) });
                                                if (res.status === 1) {
                                                    showSuccess('Success', `Gifted ${giftAmount} matches to ${selectedUsers.length} user(s).`);
                                                    setSelectedUsers([]);
                                                    setGiftAmount('');
                                                    fetchList(page, perPage, search.trim() || undefined);
                                                } else {
                                                    showError('Error', res.message || 'Failed to gift matches');
                                                }
                                            } catch (err: any) {
                                                handleApiError(err, 'Failed to gift matches');
                                            } finally {
                                                setSubmitting(false);
                                            }
                                        }}
                                    >
                                        {submitting ? <AppLoaderbtn size={70} /> : 'Gift Matches'}
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                <Row className="mt-3 mb-3">
                    <Col className="text-end">
                        <InputGroup className="justify-content-end">
                            <Form.Group className='mb-0 form-group'>
                                <Form.Control
                                    style={{ minWidth: 300 }}
                                    placeholder="Search gifted users by name/email"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </Form.Group>
                        </InputGroup>
                    </Col>
                </Row>
            </form>
            <Card>
                <Card.Body>
                    <DataTable
                        columns={columns as any}
                        data={data}
                        pagination
                        paginationServer
                        paginationTotalRows={total}
                        paginationPerPage={perPage}
                        onChangePage={(p) => fetchList(p, perPage, search.trim() || undefined)}
                        onChangeRowsPerPage={(n, p) => fetchList(p, n, search.trim() || undefined)}
                        progressPending={loading}
                        className="custom-table"
                        progressComponent={<AppLoader size={150} />}
                    />
                </Card.Body>
            </Card>


        </React.Fragment>
    );
};

export default Gifting;


