import React from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
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
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Submitted values:", values);
    navigate("/reset-password");
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Forgot" title2="Password" description="Please enter your email address to receive an otp for password reset." />
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
                  <Button type="submit" className="btn btn-primary w-100">
                    Proceed
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
