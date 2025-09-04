import React, { useState, useEffect } from "react";
import { Row, Col, Tab, Tabs, Form, Card, Button, Alert, Spinner } from "react-bootstrap";
import { ProfileService, AdminProfile } from "@/services";

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [changingPassword, setChangingPassword] = useState<boolean>(false);
  const [key, setKey] = useState<string>("basicinfo");

  // Profile form states
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  // Password form states
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const fetchProfile = async () => {
    try {

      setError("");

      const profileData = await ProfileService.getProfile();
      setProfile(profileData);
      setName(profileData.name);
      setEmail(profileData.email);

      console.log('✅ Profile fetched:', profileData);
    } catch (err: any) {
      console.error('❌ Error fetching profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setError('Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await ProfileService.updateProfile({
        name: name.trim(),
        email: email.trim()
      });

      setSuccess('Profile updated successfully');

      // Refresh profile data
      await fetchProfile();

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err: any) {
      console.error('❌ Error updating profile:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset password error
    setPasswordError("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all password fields');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be the same as current password');
      return;
    }

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");
      setPasswordError("");

      await ProfileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      setSuccess('Password changed successfully');

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err: any) {
      console.error('❌ Error changing password:', err);
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading profile...</p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <Card>
        <Card.Header className="py-4">
          <h5>Profile Settings</h5>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Tabs
            id="profile-settings-tabs"
            className="customtabs mb-2"
            activeKey={key}
            onSelect={(k) => setKey(k || "basicinfo")}
          >
            <Tab eventKey="basicinfo" title="Basic Info">
              <Row>
                <Col md={12}>
                  <Form onSubmit={handleProfileUpdate}>
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Name *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setName(e.target.value)
                            }
                            disabled={saving}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Email Address *</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setEmail(e.target.value)
                            }
                            disabled={saving}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      className="btn btn-primary px-4 mt-3"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Updating...
                        </>
                      ) : (
                        'Update Profile'
                      )}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="changepassword" title="Change Password">
              <Row>
                <Col md={12}>
                  {passwordError && <Alert variant="danger">{passwordError}</Alert>}

                  <Form onSubmit={handlePasswordChange}>
                    <Row>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Current Password *</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setCurrentPassword(e.target.value)
                            }
                            disabled={changingPassword}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>New Password *</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setNewPassword(e.target.value)
                            }
                            disabled={changingPassword}
                            required
                          />
                          <Form.Text className="text-muted">
                            Password must be at least 6 characters long
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      <Col lg={6}>
                        <Form.Group className="form-group mb-3">
                          <Form.Label>Confirm New Password *</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              setConfirmPassword(e.target.value)
                            }
                            disabled={changingPassword}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      className="btn btn-primary px-4 mt-3"
                      type="submit"
                      disabled={changingPassword}
                    >
                      {changingPassword ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Changing Password...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </Button>
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
