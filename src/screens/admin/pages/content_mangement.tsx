import React, { useState } from "react";
import { Modal, Form, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface PageData {
  id: number;
  name: string;
  date: string;
}

interface Column {
  name: string;
  selector?: (row: PageData) => string;
  sortable?: boolean;
  cell?: (row: PageData) => React.ReactElement;
}

const Pages: React.FC = () => {
  const [show2, setShow2] = useState<boolean>(false);
  const handleClose2 = (): void => setShow2(false);
  const handleShow2 = (): void => setShow2(true);
  const [categoryname, setCategoryname] = useState<string>("Privacy Policy");
  const [searchText, setSearchText] = useState<string>("");

  const columns: Column[] = [
    {
      name: "Name",
      selector: (row: PageData) => row.name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row: PageData) => row.date,
      sortable: true,
    },
    {
      name: "Actions",
      sortable: false,
      cell: () => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="view-tooltip">View</Tooltip>}
        >
          <Link to="javascript:void(0)" onClick={handleShow2}>
            <Icon icon="tabler:edit" width={20} height={20} className="text-warning" />
          </Link>
        </OverlayTrigger>
      ),
    },
  ];

  const data: PageData[] = [
    {
      id: 1,
      name: "Privacy Policy",
      date: "10 January 2025",
    },
    {
      id: 2,
      name: "Terms & Conditions",
      date: "10 January 2025",
    },
    {
      id: 3,
      name: "About Us",
      date: "10 January 2025",
    },
  ];

  const filteredData = data.filter(
    (item) =>
      JSON.stringify(item).toLowerCase().indexOf(searchText.toLowerCase()) !== -1
  );

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
    )
  );

  return (
    <React.Fragment>
      <h5>All Pages</h5>
      <div className="text-end mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="searchfield"
          value={searchText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        />
      </div>
      <div className="scrollable-table">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          responsive
          className="custom-table"
        />
      </div>

      <Modal size="lg" show={show2} onHide={handleClose2} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="modalhead">Edit Page</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Title"
                value={categoryname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryname(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Description</Form.Label>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}
                editorStyle={{
                  minHeight: '200px',
                  fontSize: '14px'
                }}
                toolbar={{
                  options: ['inline', 'list', 'textAlign', 'link', 'history'], // removed 'blockType', 'fontSize', 'fontFamily'
                  inline: {
                    inDropdown: false,
                    options: ['bold', 'italic', 'underline', 'strikethrough'],
                  },
                  list: { inDropdown: false },
                  textAlign: { inDropdown: false },
                  link: { inDropdown: false },
                  history: { inDropdown: false },
                }}
              />
            </Form.Group>
          </Form>
          <Button className="btn btn-primary px-4 w-100">Update</Button>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Pages;

