import React, { useState } from "react";
import { Row, Col, Button, Image, Alert, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
import { AuthService } from "@/services";
import * as Yup from 'yup';

const initialValues = {
  email: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("🔍 Checking admin email:", values.email);
      const response = await AuthService.forgotPassword({ email: values.email });

      if (response.status === 1) {
        setSuccess("OTP has been sent to your email address. Please check your inbox.");
        // Store email in localStorage for the next step
        localStorage.setItem('adminResetEmail', values.email);

        // Navigate to reset password page after a short delay
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err: any) {
      console.error("❌ Error sending OTP:", err);
      setError(err.message || "An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Forgot" title2="Password" description="Please enter your email address to receive an otp for password reset." />

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
                    id="email"
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email || ""}
                    touched={touched.email || false}
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
                        Sending OTP...
                      </>
                    ) : (
                      "Proceed"
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

export default ForgotPassword;
