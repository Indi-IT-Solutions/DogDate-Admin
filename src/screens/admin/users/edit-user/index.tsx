import React, { useState, useEffect } from "react";
import { Row, Col, Form, Card, Button, Alert, Spinner } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useSearchParams } from "react-router-dom";
import { UserService, type User } from "@/services";
import { HobbyService, type Hobby } from "@/services";
import { ContentService, type MeetupAvailability } from "@/services";

const ageRangeList = ["18-25", "26-35", "36-45", "46-55", "55+"];

const EditUser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('id');

  // State for user data
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [location, setLocation] = useState("");
  const [about, setAbout] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [meetUpAvailability, setMeetUpAvailability] = useState<string[]>([]);
  const [status, setStatus] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");

  // State for hobbies and meetup availability options
  const [hobbiesList, setHobbiesList] = useState<Hobby[]>([]);
  const [meetUpAvailabilityList, setMeetUpAvailabilityList] = useState<MeetupAvailability[]>([]);

  // Fetch user data
  const fetchUserData = async () => {
    if (!userId) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log('🔍 Fetching user data for ID:', userId);
      const response = await UserService.getUserById(userId);

      console.log('📋 User response:', response);

      if (response.status === 1 && response.data) {
        const user = response.data;
        setUserData(user);

        // Pre-fill form with user data
        setName(user.name || "");
        setEmail(user.email || "");
        setAgeRange(user.age_range || "");
        setLocation(user.address?.city || user.address?.full_address || "");
        setAbout(user.about || "");
        setStatus(user.status || "");
        setPhoneNumber(user.phone_number || "");
        setCountryCode(user.country_code || "");

        // Set hobbies and meetup availability
        if (user.hobbies && Array.isArray(user.hobbies)) {
          const hobbyNames = user.hobbies.map((hobby: any) =>
            typeof hobby === 'string' ? hobby : hobby.name
          );
          setHobbies(hobbyNames);
        }

        if (user.meetup_availability && Array.isArray(user.meetup_availability)) {
          const availabilityNames = user.meetup_availability.map((availability: any) =>
            typeof availability === 'string' ? availability : availability.name
          );
          setMeetUpAvailability(availabilityNames);
        }
      } else {
        setError(response.message || "Failed to fetch user data");
      }
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      setError(err.message || "An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch hobbies and meetup availability options
  const fetchOptions = async () => {
    try {
      const [hobbiesResponse, availabilityResponse] = await Promise.all([
        HobbyService.getHobbies({ limit: 100 }),
        ContentService.getMeetupAvailability({ limit: 100 })
      ]);

      if (hobbiesResponse.status === 1) {
        setHobbiesList(hobbiesResponse.data || []);
      }

      if (availabilityResponse.status === 1) {
        setMeetUpAvailabilityList(availabilityResponse.data || []);
      }
    } catch (err: any) {
      console.error("Error fetching options:", err);
    }
  };

  // Load user data and options on component mount
  useEffect(() => {
    fetchUserData();
    fetchOptions();
  }, [userId]);

  const handleTagToggle = (value: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      // Validate required fields
      if (!name.trim() || !email.trim()) {
        setError("Name and email are required");
        return;
      }

      if (!userId) {
        setError("User ID is required");
        return;
      }

      // Prepare update data
      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
        age_range: ageRange,
        address: { city: location },
        about,
        hobbies,
        meetup_availability: meetUpAvailability,
        status,
        phone_number: phoneNumber,
        country_code: countryCode,
      };

      console.log('🔍 Updating user with data:', updateData);

      const response = await UserService.updateUser(userId, updateData);

      console.log('📋 Update response:', response);

      if (response.status === 1) {
        setSuccess("User updated successfully!");
        // Refresh user data
        await fetchUserData();
      } else {
        setError(response.message || "Failed to update user");
      }

    } catch (err: any) {
      console.error("Error updating user:", err);
      setError(err.message || "An error occurred while updating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <span className="ms-2">Loading user data...</span>
      </div>
    );
  }

  // Show error state
  if (error && !userData) {
    return (
      <Card>
        <Card.Body>
          <Alert variant="danger">
            <Icon icon="mdi:alert-circle" className="me-2" />
            {error}
          </Alert>
          <Link to="/users" className="btn btn-primary px-4 py-2 h-auto">
            Back to Users
          </Link>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header className="d-flex align-items-center justify-content-between">
        <h5>Edit User: {userData?.name || 'Loading...'}</h5>
        <Link to="/users" className="btn btn-primary px-4 py-2 h-auto">
          Back
        </Link>
      </Card.Header>
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <Icon icon="mdi:alert-circle" className="me-2" />
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" className="mb-3" onClose={() => setSuccess('')} dismissible>
            <Icon icon="mdi:check-circle" className="me-2" />
            {success}
          </Alert>
        )}
        <Form>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Profile Image</Form.Label>
                <div className="upload_img1">
                  {userData?.profile_picture ? (
                    <div className="text-center">
                      <img
                        src={userData.profile_picture.file_path}
                        alt="Profile"
                        className="rounded-circle mb-3"
                        width={100}
                        height={100}
                        style={{ objectFit: "cover" }}
                      />
                      <p className="text-muted mb-0">
                        Current profile image
                      </p>
                    </div>
                  ) : (
                    <label htmlFor="profileImageUpload" className="text-center cursor-pointer">
                      <Icon icon="garden:upload-fill-16" />
                      <p className="text-muted mb-0 mt-3">
                        No profile image uploaded
                      </p>
                    </label>
                  )}
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
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    placeholder="+1"
                    style={{ width: '80px', marginRight: '8px' }}
                  />
                  <Form.Control
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
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
                      key={hobby._id}
                      variant={hobbies.includes(hobby.name) ? "warning" : "outline-secondary"}
                      style={{ borderRadius: 20, fontWeight: 400, padding: "4px 18px" }}
                      onClick={() => handleTagToggle(hobby.name, setHobbies)}
                    >
                      {hobby.name}
                    </Button>
                  ))}
                </div>
                <div className="mb-2"><small>Meet Up Availability</small></div>
                <div className="d-flex flex-wrap gap-2">
                  {meetUpAvailabilityList.map((slot, idx) => (
                    <Button
                      key={slot._id}
                      variant={meetUpAvailability.includes(slot.name) ? "warning" : "outline-secondary"}
                      style={{ borderRadius: 20, fontWeight: 400, padding: "4px 18px" }}
                      onClick={() => handleTagToggle(slot.name, setMeetUpAvailability)}
                    >
                      {slot.name}
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blocked">Blocked</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-start">
            <Button
              className="btn btn-primary px-4 mt-4 min_width140"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update User"}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditUser;
