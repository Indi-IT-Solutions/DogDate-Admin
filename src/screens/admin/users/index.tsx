import React, { useState } from "react";
import { Row, Col, OverlayTrigger, Tooltip, Modal, Form, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { IMAGES } from "@/contants/images";

interface User {
  id: number;
  name: string;
  img: string;
  email: string;
  type: "Normal" | "Google" | "Apple";
  phoneNumber: string;
  createdOn: string;
  status: "Active" | "In-active";
  location: string;
}

const Users: React.FC = () => {
  const [searchText, setSearchText] = useState("");

  const userColumns = [
    {
      name: "S.no.",
      width: "90px",
      selector: (row: User) => `${row.id}`,
      sortable: true,
    },
    {
      name: "User",
      width: "290px",
      selector: (row: User) => row.img,
      cell: (row: User) => (
        <div className="d-flex align-items-center gap-2">
          <img
            src={row.img}
            alt={row.name}
            className="rounded-circle"
            width={35}
            height={35}
            style={{ objectFit: "cover" }}
          />
          <div> <strong>{row.name}</strong><br /><small>{row.email}</small><br /><small>{row.phoneNumber}</small></div>
        </div>
      ),
    },
    {
      name: "Type",
      selector: (row: User) => row.type,
      width: "120px",
      cell: (row: User) => (
        <span className={`badge ${row.type === 'Normal' ? 'bg-secondary' : row.type === 'Google' ? 'bg-danger' : 'bg-dark'}`}>
          {row.type}
        </span>
      ),
    },
    {
      name: "Location",
      selector: (row: User) => row.location,
      wrap: true
    },
    {
      name: "Created On",
      selector: (row: User) => row.createdOn,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: User) => (
        <span className={`badge ${row.status === 'Active' ? 'bg-success' : row.status === 'In-active' ? 'bg-danger' : 'bg-warning'}`}>
          {row.status}
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
      cell: () => (
        <div className="d-flex align-items-center gap-3">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="view-tooltip">View</Tooltip>}
          >
            <Link to="/users/view-user">
              <Icon icon="ri:eye-line" width={20} height={20} className="text-primary" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="view-tooltip">Edit</Tooltip>}
          >
            <Link to="/users/edit-user">
              <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="check-tooltip">Password</Tooltip>}
          >
            <Link to="javascript:void(0)" onClick={handleShow1}>
              <Icon icon="mdi:lock" width={20} height={20} className="text-success" />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id="close-tooltip">Delete</Tooltip>}
          >
            <Link to="javascript:void(0)" onClick={handleShow}>
              <Icon icon="icon-park-outline:close-one" width={20} height={20} className="text-danger" />
            </Link>
          </OverlayTrigger>
        </div>
      ),
    },
  ];

  const [userData] = useState<User[]>([
    {
      id: 1,
      name: "Emma Thompson",
      img: IMAGES.Avatar1,
      email: "emma.thompson@example.com",

      type: "Normal",
      phoneNumber: "1234567890",
      createdOn: "Jan 10, 2024",
      status: "Active",
      location: "Chicago, SW1A",
    },
    {
      id: 2,
      name: "David Rodriguez",
      img: IMAGES.Avatar2,
      email: "david.rodriguez@example.com",

      type: "Google",
      phoneNumber: "1234567890",
      createdOn: "Feb 15, 2024",
      status: "Active",
      location: "Houston, HA30",
    },
    {
      id: 3,
      name: "Lisa Chen",
      img: IMAGES.Avatar3,
      email: "lisa.chen@example.com",

      type: "Apple",
      phoneNumber: "1234567890",
      createdOn: "Mar 22, 2024",
      status: "In-active",
      location: "Chicago, SW1A",
    },
    {
      id: 4,
      name: "James Anderson",
      img: IMAGES.Avatar1,
      email: "james.anderson@example.com",

      type: "Normal",
      phoneNumber: "1234567890",
      createdOn: "Apr 08, 2024",
      status: "Active",
      location: "Houston, HA30",
    },
    {
      id: 5,
      name: "Maria Garcia",
      img: IMAGES.Avatar2,
      email: "maria.garcia@example.com",

      type: "Google",
      phoneNumber: "1234567890",
      createdOn: "May 14, 2024",
      status: "Active",
      location: "Chicago, SW1A",
    },
    {
      id: 6,
      name: "Robert Johnson",
      img: IMAGES.Avatar3,
      email: "robert.johnson@example.com",

      type: "Normal",
      phoneNumber: "1234567890",
      createdOn: "Jun 20, 2024",
      status: "Active",
      location: "Houston, HA30",
    },
    {
      id: 7,
      name: "Jennifer Lee",
      img: IMAGES.Avatar1,
      email: "jennifer.lee@example.com",

      type: "Apple",
      phoneNumber: "1234567890",
      createdOn: "Jul 03, 2024",
      status: "In-active",
      location: "Chicago, SW1A",
    },
    {
      id: 8,
      name: "Christopher Davis",
      img: IMAGES.Avatar2,
      email: "christopher.davis@example.com",

      type: "Google",
      phoneNumber: "1234567890",
      createdOn: "Aug 12, 2024",
      status: "Active",
      location: "Houston, HA30",
    },
    {
      id: 9,
      name: "Amanda White",
      img: IMAGES.Avatar3,
      email: "amanda.white@example.com",

      type: "Normal",
      phoneNumber: "1234567890",
      createdOn: "Sep 25, 2024",
      status: "Active",
      location: "Chicago, SW1A",
    },
    {
      id: 10,
      name: "Daniel Martinez",
      img: IMAGES.Avatar1,
      email: "daniel.martinez@example.com",

      type: "Apple",
      phoneNumber: "1234567890",
      createdOn: "Oct 30, 2024",
      status: "Active",
      location: "Houston, HA30",
    },
  ]);

  const filteredData = userData.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(searchText.toLowerCase())
  );

  // Modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <div className="d-flex justify-content-between align-items-center dropSelect_option">
            <h3 className="mb-0">Users</h3>
          </div>
          <div className="text-end mb-3">
            <input
              type="text"
              placeholder="Search..."
              className="searchfield"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
          <div className="scrollable-table">
            <DataTable
              columns={userColumns as any}
              data={filteredData}
              pagination
              responsive
              className="custom-table"
            />
          </div>
        </Col>
      </Row>

      {/* Delete Modal */}
      <Modal className="modal_Delete" show={show} onHide={handleClose} centered>
        <Modal.Body>
          <div className="modaldelete_div">
            <Icon className="delete_icon" icon="gg:close-o" />
            <h3>Are You Sure ?</h3>
            <p>You will not be able to recover the deleted record!</p>
          </div>
          <Button
            variant="outline-danger"
            onClick={handleClose}
            className="px-4 me-3"
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
        </Modal.Body>
      </Modal>

      {/* Reset Password Modal */}
      <Modal show={show1} onHide={handleClose1} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="modalhead">Reset password</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modaldelete_div">
            <Form>
              <Form.Group className="mb-3 form-group">
                <Form.Label>New password</Form.Label>
                <Form.Control type="text" placeholder="Enter New password" />
              </Form.Group>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control type="text" placeholder="Enter Confirm New Password" />
              </Form.Group>
            </Form>
          </div>
          <Button onClick={handleClose1} className="btn btn-primary px-4 w-100">
            Update
          </Button>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Users;
