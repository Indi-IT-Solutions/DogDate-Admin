import { Routes, Route } from "react-router-dom";
import Layout from "../Layout";
import Login from "../auth/Login";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Dashboard from "../screens/admin/dashboard";
import Pages from "../screens/admin/pages/content_mangement";
import ProfileSettings from "../screens/admin/profile-settings";
import Users from "../screens/admin/users";
import EditUser from "../screens/admin/users/edit-user";
import Payments from "../screens/admin/payments";
import ContactUs from "../screens/admin/contact";
import SubscriptionPackages from "@/screens/admin/subscription-packages";
import ViewPayment from "@/screens/admin/payments/view-payment";
import UserView from "@/screens/admin/users/view-user";
import Report from "@/screens/admin/report";
import Dogs from "@/screens/admin/dogs";
import ViewDog from "@/screens/admin/dogs/view-dog";
import FAQs from "@/screens/admin/faqs";
import DogBreeds from "@/screens/admin/pages/dog-breeds";
import DogCharacters from "@/screens/admin/pages/dog-characters";
import Hobbies from "@/screens/admin/pages/hobbies";
import DogLikes from "@/screens/admin/pages/dog-likes";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <Layout title={"Dashboard"}>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/users"
        element={
          <Layout title={"Users"}>
            <Users />
          </Layout>
        }
      />
      <Route
        path="/users/view-user"
        element={
          <Layout title={"Users"}>
            <UserView />
          </Layout>
        }
      />
      <Route
        path="/users/edit-user"
        element={
          <Layout title={"Users"}>
            <EditUser />
          </Layout>
        }
      />
      <Route
        path="/subscription-packages"
        element={
          <Layout title={"Subscription Packages"}>
            <SubscriptionPackages />
          </Layout>
        }
      />
      <Route
        path="/payments"
        element={
          <Layout title={"Payments"}>
            <Payments />
          </Layout>
        }
      />
      <Route
        path="/payments/view-payment"
        element={
          <Layout title={"Payment View"}>
            <ViewPayment />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout title={"Contact"}>
            <ContactUs />
          </Layout>
        }
      />
      <Route
        path="/pages/content-management"
        element={
          <Layout title={"Pages"}>
            <Pages />
          </Layout>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <Layout title={"Profile Settings"}>
            <ProfileSettings />
          </Layout>
        }
      />
      <Route
        path="/report"
        element={
          <Layout title={"Report"}>
            <Report />
          </Layout>
        }
      />
      <Route
        path="/dogs"
        element={
          <Layout title={"Dogs"}>
            <Dogs />
          </Layout>
        }
      />
      <Route
        path="/dogs/view-dog"
        element={
          <Layout title={"View Dog"}>
            <ViewDog />
          </Layout>
        }
      />
      <Route
        path="/faqs"
        element={
          <Layout title={"FAQs"}>
            <FAQs />
          </Layout>
        }
      />
      <Route
        path="/pages/dog-breeds"
        element={
          <Layout title={"Dog Breeds"}>
            <DogBreeds />
          </Layout>
        }
      />
      <Route
        path="/pages/dog-characters"
        element={
          <Layout title={"Dog Characters"}>
            <DogCharacters />
          </Layout>
        }
      />
      <Route
        path="/pages/hobbies"
        element={
          <Layout title={"Hobbies"}>
            <Hobbies />
          </Layout>
        }
      />
      <Route
        path="/pages/dog-likes"
        element={
          <Layout title={"Dog Likes"}>
            <DogLikes />
          </Layout>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;