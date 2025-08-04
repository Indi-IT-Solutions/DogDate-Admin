import React from "react";
import { Row, Col, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form as FormikForm } from "formik";
import { IMAGES } from "@/contants/images";
import LoginHeader from "@/components/LoginHeader";
import TextField from "@/components/TextField";
import * as Yup from 'yup';

const initialValues = {
  newpassword: "",
  confirmpassword: "",
};

const validationSchema = Yup.object().shape({
  newpassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('newpassword')], 'Passwords do not match')
    .required('Confirm Password is required'),
});

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (values: typeof initialValues) => {
    console.log("Submitted values:", values);
    navigate("/");
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={6} className="loginform">
          <div className="loginmain_div maxwidth500 mx-auto">
            <LoginHeader title="Reset" title2="Password" description="Please enter the details below to reset your password.

" />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                <FormikForm onSubmit={handleSubmit}>
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
                  <Button type="submit" className="btn btn-primary w-100">
                    Reset Password
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
