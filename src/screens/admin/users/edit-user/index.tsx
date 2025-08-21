import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Card, Button, Alert, Spinner, Badge } from "react-bootstrap";
import { Icon } from "@iconify/react";
import { Link, useSearchParams } from "react-router-dom";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { UserService, type User } from "@/services";
import { HobbyService, type Hobby } from "@/services";
import { ContentService } from "@/services";
import { AWSService } from "@/services";
import type { MeetupAvailability } from "@/types/api.types";
import { showError, showSuccess, handleApiError } from "@/utils/sweetAlert";
import { getUserProfileImage } from "@/utils/imageUtils";
import { IMAGES } from "@/contants/images";

const ageRangeList = ["18 yrs+", "30 yrs+", "40 yrs+", "50 yrs+"];

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

  // Profile picture upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAgeRange(user.age || "");
        setLocation(user.address?.city || user.address?.full_address || "");
        setAbout(user.about || "");
        setStatus(user.status || "");
        setPhoneNumber(user.phone_number?.toString() || "");
        setCountryCode(user.country_code || "");

        // Set hobbies and meetup availability
        if (user.hobbies && Array.isArray(user.hobbies)) {
          const hobbyIds = user.hobbies.map((hobby: any) =>
            typeof hobby === 'string' ? hobby : hobby._id
          );
          setHobbies(hobbyIds);
        }

        if (user.meetup_availability && Array.isArray(user.meetup_availability)) {
          const availabilityIds = user.meetup_availability.map((availability: any) =>
            typeof availability === 'string' ? availability : availability._id
          );
          setMeetUpAvailability(availabilityIds);
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
      console.log('🔍 Fetching hobbies and meetup availability options...');

      // Fetch hobbies
      let hobbiesResponse: any = [];
      try {
        console.log('🔍 Calling HobbyService.getHobbies...');
        console.log('🔍 API URL being called:', '/admin/hobbie_v1/get_list');
        hobbiesResponse = await HobbyService.getHobbies({ limit: 100 });
        console.log('✅ Hobbies response:', hobbiesResponse);
      } catch (hobbyError: any) {
        console.error('❌ Error fetching hobbies:', hobbyError);
        console.error('❌ Error details:', {
          message: hobbyError.message,
          response: hobbyError.response,
          status: hobbyError.response?.status,
          data: hobbyError.response?.data
        });
      }

      // Fetch meetup availability
      let availabilityResponse: any = { data: [] };
      try {
        console.log('🔍 Calling ContentService.getMeetupAvailability...');
        console.log('🔍 API URL being called:', '/admin/meet_up_availability_v1/get_list');
        availabilityResponse = await ContentService.getMeetupAvailability({ limit: 100 });
        console.log('✅ Availability response:', availabilityResponse);
      } catch (availabilityError: any) {
        console.error('❌ Error fetching meetup availability:', availabilityError);
        console.error('❌ Error details:', {
          message: availabilityError.message,
          response: availabilityError.response,
          status: availabilityError.response?.status,
          data: availabilityError.response?.data
        });
      }

      // Set the data
      setHobbiesList(hobbiesResponse || []);
      setMeetUpAvailabilityList(availabilityResponse.data || []);

      console.log('✅ Final state set:', {
        hobbiesCount: (hobbiesResponse || []).length,
        availabilityCount: (availabilityResponse.data || []).length,
        hobbiesList: hobbiesResponse,
        availabilityList: availabilityResponse.data
      });
    } catch (err: any) {
      console.error("❌ General error fetching options:", err);
    }
  };

  // Load user data and options on component mount
  useEffect(() => {
    fetchUserData();
    fetchOptions();
  }, [userId]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError("Error", "Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError("Error", "File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle file upload
  const handleFileUpload = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      // Generate presigned URL
      const fileName = `user_profile_${Date.now()}_${selectedFile.name}`;
      const presignedResponse = await AWSService.generatePresignedUrl({
        file_name: fileName,
        file_type: selectedFile.type
      });

      if (presignedResponse.status === 1 && presignedResponse.data) {
        // Upload to S3
        await AWSService.uploadFileToS3(
          presignedResponse.data.presignedUrl,
          selectedFile
        );

        return presignedResponse.data.fileUrl;
      } else {
        throw new Error(presignedResponse.message || "Failed to generate upload URL");
      }
    } catch (err: any) {
      console.error("Error uploading file:", err);
      throw new Error("Failed to upload image");
    }
  };

  // Handle Google Places selection
  const handlePlaceSelect = (place: any) => {
    if (place && place.value) {
      // Parse the place details and update location
      const addressComponents = place.value.description.split(', ');
      const fullAddress = place.value.description;
      const city = addressComponents[1] || "";
      const country = addressComponents[addressComponents.length - 1] || "";

      setLocation(fullAddress);
    }
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

      let profilePictureData = undefined;

      // Handle profile picture upload
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload();
        if (uploadedUrl) {
          profilePictureData = {
            file_path: uploadedUrl,
            file_type: selectedFile.type,
            file_hash: ""
          };
        }
      } else if (previewUrl === "") {
        // User wants to remove profile picture
        profilePictureData = null;
      }

      // Prepare update data
      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
        age: ageRange,
        address: {
          full_address: location,
          city: location.split(', ')[1] || "",
          country: location.split(', ').pop() || ""
        },
        about,
        hobbies,
        meetup_availability: meetUpAvailability,
        status,
        phone_number: phoneNumber ? parseInt(phoneNumber) : undefined,
        country_code: countryCode,
        profile_picture: profilePictureData
      };

      console.log('🔍 Updating user with data:', updateData);

      const response = await UserService.updateUser(userId, updateData);

      console.log('📋 Update response:', response);

      if (response.status === 1) {
        showSuccess("Success", "User updated successfully!");
        // Clear file state
        setSelectedFile(null);
        setPreviewUrl("");
        // Refresh user data
        await fetchUserData();
      } else {
        setError(response.message || "Failed to update user");
      }

    } catch (err: any) {
      console.error("Error updating user:", err);
      handleApiError(err, "Failed to update user");
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
                <div className="text-center">
                  <div className="position-relative mb-3">
                    <img
                      src={previewUrl || getUserProfileImage(userData)}
                      alt="Profile"
                      className="rounded-circle"
                      width={120}
                      height={120}
                      style={{ objectFit: "cover", border: "3px solid #eee" }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = IMAGES.Avatar1;
                      }}
                    />
                    <div className="position-absolute top-0 end-0">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSubmitting}
                      >
                        <Icon icon="mdi:camera" />
                      </Button>
                      {/* {(previewUrl || userData?.profile_picture) && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="ms-1"
                          onClick={handleRemoveProfilePicture}
                          disabled={isSubmitting}
                        >
                          <Icon icon="mdi:delete" />
                        </Button>
                      )} */}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
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
                <Form.Control type="text" value={email} disabled={true} placeholder="Enter email" />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>Phone number</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    disabled
                    value={countryCode}
                    // onChange={(e) => setCountryCode(e.target.value)}
                    placeholder="+1"
                    style={{ width: '80px', marginRight: '8px' }}
                  />
                  <Form.Control
                    type="text"
                    value={phoneNumber}
                    disabled={true}
                    // onChange={(e) => setPhoneNumber(e.target.value)}
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
                <Form.Label>Location</Form.Label>
                {import.meta.env.VITE_GOOGLE_PLACES_API_KEY ? (
                  <GooglePlacesAutocomplete
                    apiKey={import.meta.env.VITE_GOOGLE_PLACES_API_KEY}
                    selectProps={{
                      value: location ? {
                        label: location,
                        value: location
                      } : null,
                      onChange: handlePlaceSelect,
                      placeholder: "Search for a location...",
                      isDisabled: isSubmitting
                    }}
                  />
                ) : (
                  <Form.Control
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location manually..."
                    disabled={isSubmitting}
                  />
                )}
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label>About</Form.Label>
                <Form.Control as="textarea" rows={3} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Enter about you" />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="mb-3 form-group">
                <Form.Label><b>Lifestyle & Interests</b></Form.Label>


                <div className="mb-2"><small>Hobbies</small></div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {hobbiesList.length === 0 ? (
                    <div className="text-muted">Loading hobbies...</div>
                  ) : (
                    hobbiesList.map((hobby) => (
                      <Form.Check
                        key={hobby._id}
                        type="checkbox"
                        id={`hobby-${hobby._id}`}
                        label={hobby.name}
                        checked={hobbies.includes(hobby._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHobbies([...hobbies, hobby._id]);
                          } else {
                            setHobbies(hobbies.filter(id => id !== hobby._id));
                          }
                        }}
                        disabled={isSubmitting}
                      />
                    ))
                  )}
                </div>
                <div className="mb-2"><small>Meet Up Availability</small></div>
                <div className="d-flex flex-wrap gap-2">
                  {meetUpAvailabilityList.length === 0 ? (
                    <div className="text-muted">Loading meetup availability...</div>
                  ) : (
                    meetUpAvailabilityList.map((slot) => (
                      <Form.Check
                        key={slot._id}
                        type="checkbox"
                        id={`availability-${slot._id}`}
                        label={slot.name}
                        checked={meetUpAvailability.includes(slot._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMeetUpAvailability([...meetUpAvailability, slot._id]);
                          } else {
                            setMeetUpAvailability(meetUpAvailability.filter(id => id !== slot._id));
                          }
                        }}
                        disabled={isSubmitting}
                      />
                    ))
                  )}
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
