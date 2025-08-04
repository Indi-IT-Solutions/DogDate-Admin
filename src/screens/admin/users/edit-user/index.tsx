import React, { useState } from "react";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const ageRangeList = ["18-25", "26-35", "36-45", "46-55", "55+"];
const hobbiesList = [
  "Hiking", "Running", "Traveling", "Gaming", "Fitness/Gym", "Dog-Friendly Cafes", "Reading", "Cooking/Baking", "Beach Days", "Gardening", "Dog-Friendly Pub Visits", "Dog Meetups"
];
const meetUpAvailabilityList = [
  "Mornings", "Afternoons", "Evenings", "Weekdays", "Weekends"
];

const EditUser: React.FC = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [meetUpAvailability, setMeetUpAvailability] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleTagToggle = (value: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  return (
    <Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <h5>Edit User</h5>
        <Link to="/users" className="btn btn-primary px-4 py-2 h-auto">
          Back
        </Link>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Profile Image</Form.Label>
                <div className="upload_img1">
                  <label htmlFor="profileImageUpload" className="text-center cursor-pointer">
                    <Icon icon="garden:upload-fill-16" />
                    <p className="text-muted mb-0 mt-3">
                      Upload profile image or <span className="text-primary">click here</span>
                    </p>
                  </label>
                  <input type="file" id="profileImageUpload" accept="image/*" style={{ display: "none" }} />
                </div>
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Full Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter full name or nickname" />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Age Range</Form.Label>
                <Form.Select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}>
                  <option value="">Select age</option>
                  {ageRangeList.map((item, idx) => (
                    <option key={idx} value={item}>{item}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Location </Form.Label>
                <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter location" />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>About</Form.Label>
                <Form.Control as="textarea" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Enter about you" />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group lifestyle">
                <Form.Label><b>Lifestyle & Interests</b></Form.Label>
                <div className="mb-2"><small>Hobbies</small></div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {hobbiesList.map((hobby, idx) => (
                    <Button
                      key={idx}
                      variant={hobbies.includes(hobby) ? "warning" : "outline-secondary"}
                      style={{ borderRadius: 20, fontWeight: 400, padding: "4px 18px" }}
                      onClick={() => handleTagToggle(hobby, setHobbies)}
                    >
                      {hobby}
                    </Button>
                  ))}
                </div>
                <div className="mb-2"><small>Meet Up Availability</small></div>
                <div className="d-flex flex-wrap gap-2">
                  {meetUpAvailabilityList.map((slot, idx) => (
                    <Button
                      key={idx}
                      variant={meetUpAvailability.includes(slot) ? "warning" : "outline-secondary"}
                      style={{ borderRadius: 20, fontWeight: 400, padding: "4px 18px" }}
                      onClick={() => handleTagToggle(slot, setMeetUpAvailability)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="In-active">In-active</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-start">
            <Button className="btn btn-primary px-4 mt-4 min_width140">Update</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditUser;
