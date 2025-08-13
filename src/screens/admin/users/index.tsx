import React, { useState, useEffect } from "react";
import { Row, Col, OverlayTrigger, Tooltip, Modal, Form, Button, Alert } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { IMAGES } from "@/contants/images";
import { UserService, type User, type UserFilters } from "@/services";

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);

  // Modal states
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
  };

  const handleShow = (user: User) => {
    setSelectedUser(user);
    setShow(true);
  };

  const handleClose1 = () => {
    setShow1(false);
    setSelectedUser(null);
    setNewPassword("");
  };

  const handleShow1 = (user: User) => {
    setSelectedUser(user);
    setShow1(true);
  };

  // Fetch users data
  const fetchUsers = async (page: number = 1, limit: number = 10, search?: string) => {
    try {
      setLoading(true);
      setError("");

      const filters: UserFilters = {
        page,
        limit,
        search: search || undefined,
      };

      console.log('🔍 Fetching users with filters:', filters);

      const response: any = await UserService.getUsers(filters);

      console.log('📋 Users response:', response);

      if (response?.status === 1) {
        setUserData(response?.data || []);
        setTotalRows(response?.meta?.total || 0);
        setCurrentPage(response?.meta?.page || 1);
        setPerPage(response?.meta?.limit || 10);
      } else {
        setError(response?.message || "Failed to fetch users");
        setUserData([]);
        setTotalRows(0);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "An error occurred while fetching users");
      setUserData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsSubmitting(true);
      const response = await UserService.deleteUser(selectedUser._id);

      if (response.status === 1) {
        // Refresh users list
        await fetchUsers(currentPage, perPage, searchText);
        handleClose();
      } else {
        setError(response.message || "Failed to delete user");
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.message || "An error occurred while deleting user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset user password
  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;

    try {
      setIsSubmitting(true);
      const response = await UserService.resetUserPassword(selectedUser._id, newPassword);

      if (response.status === 1) {
        handleClose1();
        // You could show a success message here
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("Error resetting password:", err);
      setError(err.message || "An error occurred while resetting password");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, perPage, searchText);
  };

  // Handle per page change
  const handlePerRowsChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
    fetchUsers(page, newPerPage, searchText);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers(1, 10);
  }, []);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchText !== undefined) {
        setCurrentPage(1); // Reset to first page when searching
        fetchUsers(1, perPage, searchText);
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchText, perPage]);

  const userColumns = [
    {
      name: "S.no.",
      width: "90px",
      selector: (row: User, index: number) => `${(currentPage - 1) * perPage + index + 1}`,
      sortable: true,
    },
    {
      name: "User",
      width: "290px",
      selector: (row: User) => row.name,
      cell: (row: User) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={IMAGES.Avatar1} // You might want to use row.profile_image if available
            alt={row.name}
            className="rounded-circle"
            width={35}
            height={35}
            style={{ objectFit: "cover" }}
          />
          <div>
            <strong>{row.name}</strong><br />
            <small>{row.email}</small><br />
            <small>{row.phone_number ? `+${row.country_code} ${row.phone_number}` : 'N/A'}</small>
          </div>
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row: User) => row.register_type,
      width: "120px",
      cell: (row: User) => (
        <span className={`badge ${row.register_type === 'normal' ? 'bg-secondary' : row.register_type === 'google' ? 'bg-danger' : 'bg-dark'}`}>
          {row.register_type.charAt(0).toUpperCase() + row.register_type.slice(1)}
        </span>
      ),
    },
    {
      name: "Location",
      selector: (row: User) => row.address.city,
      cell: (row: User) => (
        <span>{row.address.city || row.address.full_address || 'N/A'}</span>
      ),
      wrap: true
    },
    {
      name: "Created On",
      selector: (row: User) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: User) => (
        <span className={`badge ${row.status === 'active' ? 'bg-success' : row.status === 'inactive' ? 'bg-warning' : 'bg-danger'}`}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: "Actions",
      center: true,
      sortable: false,
      fixed: "right",
      cell: (row: User) => (
        <div className="d-flex align-items-center gap-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="view-tooltip">View</Tooltip>}
          >
            <Link to={`/users/view-user?id=${row._id}`}>
              <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
          >
            <Link to={`/users/edit-user?id=${row._id}`}>
              <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="password-tooltip">Reset Password</Tooltip>}
          >
            <Link to="javascript:void(0)" onClick={() => handleShow1(row)}>
              <Icon icon="mdi:lock" width={20} height={20} className="text-success" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="delete-tooltip">Delete</Tooltip>}
          >
            <Link to="javascript:void(0)" onClick={() => handleShow(row)}>
              <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
            </Link>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center dropSelect_option">
            <h3 className="mb-0">Users ({totalRows})</h3>
          </div>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <div className="text-end mb-3">
            <input
              type="text"
              placeholder="Search users..."
              className="searchfield"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="scrollable-table">
            <DataTable
              columns={userColumns as any}
              data={userData}
              pagination
              paginationServer
              paginationTotalRows={totalRows}
              paginationDefaultPage={currentPage}
              paginationPerPage={perPage}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              responsive
              className="custom-table"
              progressPending={loading}
              progressComponent={<div>Loading users...</div>}
              noDataComponent={<div className="text-center py-4">No users found</div>}
            />
          </div>
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className="modaldelete_div">
            <Icon className="delete_icon" icon="gg:close-o" />
            <h3>Are You Sure?</h3>
            <p>You will not be able to recover this user: <strong>{selectedUser?.name}</strong></p>
          </div>
          <Button
            variant="outline-danger"
            onClick={handleClose}
            className="px-4 me-3"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            className="px-4 min_width110"
            onClick={handleDeleteUser}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={show1} onHide={handleClose1} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="modalhead">Reset Password for {selectedUser?.name}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modaldelete_div">
            <Form>
              <Form.Group className="mb-3 form-group">
                <Form.Label>New password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                />
              </Form.Group>
            </Form>
          </div>
          <Button
            onClick={handleResetPassword}
            className="btn btn-primary px-4 w-100"
            disabled={isSubmitting || !newPassword}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Users;
