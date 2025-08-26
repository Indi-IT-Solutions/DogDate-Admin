import React, { useState, useEffect } from "react";
import { Row, Col, Button, Image, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
import { AuthService } from "@/services";
import * as Yup from 'yup';

const initialValues = {
  otp: "",
  newpassword: "",
  confirmpassword: "",
};

const validationSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, 'OTP must be exactly 6 characters')
    .required('OTP is required'),
  newpassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('newpassword')], 'Passwords do not match')
    .required('Confirm Password is required'),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [adminEmail, setAdminEmail] = useState<string>("");

  // Check if admin email exists in localStorage
  useEffect(() => {
    const email = localStorage.getItem('adminResetEmail');
    if (!email) {
      // If no email found, redirect to forgot password
      navigate("/forgot-password");
      return;
    }
    setAdminEmail(email);
  }, [navigate]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!adminEmail) {
        setError("Admin email not found. Please try again from forgot password page.");
        return;
      }

      console.log("🔍 Verifying OTP and resetting password for:", adminEmail);
      const response = await AuthService.verifyOtpAndResetPassword({
        email: adminEmail,
        otp: values.otp,
        new_password: values.newpassword
      });

      if (response.status === 1) {
        setSuccess("Password reset successfully! Redirecting to login...");
        // Clear stored email
        localStorage.removeItem('adminResetEmail');

        // Redirect to login after a short delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("❌ Error resetting password:", err);
      setError(err.message || "An error occurred while resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Reset" title2="Password" description="Please enter the OTP sent to your email and your new password below." />

            {adminEmail && (
              <Alert variant="info" className="mb-3">
                <strong>OTP sent to:</strong> {adminEmail}
              </Alert>
            )}

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            {success && (
              <Alert variant="success" className="mb-3">
                {success}
              </Alert>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <FormikForm onSubmit={handleSubmit}>
                  <TextField
                    id="otp"
                    label="OTP"
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={values.otp}
                    onChange={(e) => {
                      // Only allow numbers and limit to 6 characters
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleChange(e);
                      e.target.value = value;
                    }}
                    onBlur={handleBlur}
                    error={errors.otp || ""}
                    touched={touched.otp || false}
                  />
                  <TextField
                    id="newpassword"
                    label="New Password"
                    type="password"
                    name="newpassword"
                    placeholder="Enter new password"
                    value={values.newpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.newpassword || ""}
                    touched={touched.newpassword || false}
                  />
                  <TextField
                    id="confirmpassword"
                    label="Confirm Password"
                    type="password"
                    name="confirmpassword"
                    placeholder="Enter confirm password"
                    value={values.confirmpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirmpassword || ""}
                    touched={touched.confirmpassword || false}
                  />
                  <Button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                  <p className="formfooter text-center mt-3">
                    Back To <Link to="/">Login</Link>
                  </p>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Col>
        <Col lg={6} className="loginmb_none">
          <div className="loginlogo_div" style={{ backgroundImage: `url(${IMAGES.LogoBg})` }}>
            <Image src={IMAGES.Logo} alt="Logo" />
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ResetPassword;
