import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Tooltip, OverlayTrigger, Alert, Spinner, Row, Col } from "react-bootstrap";
import { Icon } from "@iconify/react";
import DataTable, { TableColumn } from "react-data-table-component";
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { PageService, Page } from "@/services";
import { Link } from "react-router-dom";

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const convertDescriptionToEditorState = (description: string | any): EditorState => {
  try {
    if (typeof description === 'string') {
      return EditorState.createWithContent(
        ContentState.createFromText(description)
      );
    } else if (description && typeof description === 'object') {
      // Handle Draft.js content state
      return EditorState.createWithContent(convertFromRaw(description));
    } else {
      return EditorState.createWithContent(
        ContentState.createFromText('Enter content here...')
      );
    }
  } catch (error) {
    console.error('Error converting description to editor state:', error);
    return EditorState.createWithContent(
      ContentState.createFromText('Enter content here...')
    );
  }
};

const convertEditorStateToDescription = (editorState: EditorState): any => {
  const contentState = editorState.getCurrentContent();
  const rawContent = convertToRaw(contentState);
  return rawContent;
};

const Pages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPage(null);
    setEditorState(EditorState.createEmpty());
  };

  const handleShowModal = async (page: Page) => {
    try {
      setSelectedPage(page);
      setShowModal(true);

      // Convert the page description to editor state
      const newEditorState = convertDescriptionToEditorState(page.description);
      setEditorState(newEditorState);
    } catch (err: any) {
      console.error('❌ Error loading page details:', err);
      setError('Failed to load page details');
    }
  };

  const fetchPages = async () => {
    try {

      setError("");

      const response = await PageService.getPages();
      setPages(response || []);

      // Debug: Log the first page to see the data structure
      if (response && response.length > 0) {
        console.log('🔍 First page data:', JSON.stringify(response[0], null, 2));
      }
    } catch (err: any) {
      console.error('❌ Error fetching pages:', err);
      setError(err.message || 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleSave = async () => {
    if (!selectedPage) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      // Convert editor state to description
      const description = convertEditorStateToDescription(editorState);

      await PageService.updatePage(selectedPage._id, { description });
      setSuccess('Page updated successfully');

      // Refresh the data
      await fetchPages();
      handleCloseModal();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err: any) {
      console.error('❌ Error saving page:', err);
      setError(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const filteredPages = pages.filter(
    (page) => page.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumn<Page>[] = [
    {
      name: "Sr. No.",
      cell: (_row: Page, index: number) => (index || 0) + 1,
      width: "90px",
      sortable: false,
    },
    {
      name: "Page Title",
      selector: (row: Page) => row.title,
      sortable: true,
      wrap: true,
      width: "250px",
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row: Page) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id={`edit-tooltip-${row._id}`}>Edit</Tooltip>}
        >

          <Link to="javascript:void(0)" onClick={() => handleShowModal(row)}>
            <Icon icon="tabler:edit" width={20} height={20} className=" text-warning" />
          </Link>
        </OverlayTrigger>
      ),
      center: true,
    },
  ];

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>



          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-dark">Content Management</h5>
            <div className="d-flex gap-2">
              <input
                type="text"
                placeholder="Search pages..."
                className="searchfield"
                value={searchText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
                disabled={loading}
                style={{ minWidth: '250px' }}
              />
            </div>
          </div>

          <div className="scrollable-table">
            <DataTable
              columns={columns}
              data={filteredPages}
              pagination={false}
              responsive
              className="custom-table"
              progressPending={loading}
              progressComponent={
                <div className="text-center p-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              }
              noDataComponent={
                <div className="text-center p-4">
                  <p className="text-muted">No pages found</p>
                </div>
              }
              striped
              highlightOnHover
            />
          </div>

          {/* {filteredPages.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <small className="text-muted">
                Showing {filteredPages.length} of {pages.length} pages
              </small>
            </div>
          )} */}
        </Col>
      </Row>

      <Modal size="lg" show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="modalhead">Edit {selectedPage?.title}</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Page Title"
                value={selectedPage?.title || ""}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Page titles cannot be edited
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3 form-group">
              <Form.Label>Content</Form.Label>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={setEditorState}
                editorStyle={{
                  minHeight: '300px',
                  fontSize: '14px',
                  border: '1px solid #ced4da',
                  borderRadius: '0.375rem',
                  padding: '10px'
                }}
                toolbar={{
                  options: ['inline', 'list', 'textAlign', 'link', 'history'],
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
              <Form.Text className="text-muted">
                Use the toolbar above to format your content
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={handleCloseModal}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Updating...
              </>
            ) : (
              'Update Page'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default Pages;

