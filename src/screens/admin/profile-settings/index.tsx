import React, { useState } from "react";
import { Row, Col, Tab, Tabs, Form, Card, Button } from "react-bootstrap";

const ProfileSettings: React.FC = () => {
  const [name, setName] = useState<string>("John Smith");
  const [email, setEmail] = useState<string>("johndoe@gmail.com");
  const [key, setKey] = useState<string>("basicinfo");

  return (
    <React.Fragment>
      <Card>
        <Card.Header className="py-4">
          <h5>Profile Settings</h5>
        </Card.Header>
        <Card.Body>
          <Tabs
            id="profile-settings-tabs"
            className="customtabs mb-2"
            activeKey={key}
            onSelect={(k) => setKey(k || "basicinfo")}
          >
            <Tab eventKey="basicinfo" title="Basic Info">
              <Row>
                <Col md={12}>
                  <Form>
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setName(e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setEmail(e.target.value)
                            }
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button className="btn btn-primary px-4 mt-3">Update</Button>
                  </Form>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="changepassword" title="Change Password">
              <Row>
                <Col md={12}>
                  <Form>
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Current Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Current Password"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="New Password"
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Confirm New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm New Password"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button className="btn btn-primary px-4 mt-3">Update</Button>
                  </Form>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </React.Fragment>
  );
};

export default ProfileSettings;
