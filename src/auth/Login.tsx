import React, { useState } from "react";
import { Form, Row, Col, Button, Image, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
import { AuthService, tokenManager } from "@/services";
import * as Yup from 'yup';

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (values: typeof initialValues) => {
    setIsLoading(true);
    setError("");

    try {
      console.log('Attempting login with:', { email: values.email });
      const response = await AuthService.login(values);

      console.log('Login response:', response);

      if (response.status === 1) {
        // Verify that the token was actually stored
        const storedToken = tokenManager.getToken();
        const storedUser = tokenManager.getUserData();

        console.log('Stored token:', storedToken ? 'Token exists' : 'No token found');
        console.log('Stored user:', storedUser);

        if (!storedToken) {
          console.error('Token not stored properly');
          setError("Authentication failed - token not stored");
          return;
        }

        // Verify authentication status
        const isAuthenticated = AuthService.isAuthenticated();
        console.log('Is authenticated:', isAuthenticated);

        if (!isAuthenticated) {
          console.error('Authentication verification failed');
          setError("Authentication verification failed");
          return;
        }

        console.log('Login successful, navigating to dashboard...');

        // Small delay to ensure everything is properly set
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);

      } else {
        console.error('Login failed with status:', response.status);
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle different error types
      if (err.status === 0) {
        setError(err.message || "Invalid credentials");
      } else if (err.message?.includes('Network Error')) {
        setError("Cannot connect to server.");
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Welcome To" title2="DogDate" />

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
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
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password || ""}
                    touched={touched.password || false}
                  />
                  <Form.Group className="mb-4 form-group forgotpassword text-end">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </Form.Group>
                  <Button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
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

export default Login;
