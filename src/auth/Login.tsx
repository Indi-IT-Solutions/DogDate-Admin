import React from "react";
import { Form, Row, Col, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
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
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Submitted values:", values);
    navigate("/dashboard");
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Welcome To" title2="DogDate" />
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
                  <Button type="submit" className="btn btn-primary w-100">
                    Login
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
