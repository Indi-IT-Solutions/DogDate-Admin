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
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - only accessible when NOT logged in */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Protected Routes - only accessible when logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout title={"Dashboard"}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout title={"Users"}>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/view-user"
        element={
          <ProtectedRoute>
            <Layout title={"Users"}>
              <UserView />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/edit-user"
        element={
          <ProtectedRoute>
            <Layout title={"Users"}>
              <EditUser />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription-packages"
        element={
          <ProtectedRoute>
            <Layout title={"Subscription Packages"}>
              <SubscriptionPackages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <Layout title={"Payments"}>
              <Payments />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments/view-payment"
        element={
          <ProtectedRoute>
            <Layout title={"Payment View"}>
              <ViewPayment />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Layout title={"Contact"}>
              <ContactUs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/content-management"
        element={
          <ProtectedRoute>
            <Layout title={"Pages"}>
              <Pages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile-settings"
        element={
          <ProtectedRoute>
            <Layout title={"Profile Settings"}>
              <ProfileSettings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <Layout title={"Report"}>
              <Report />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dogs"
        element={
          <ProtectedRoute>
            <Layout title={"Dogs"}>
              <Dogs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dogs/view-dog"
        element={
          <ProtectedRoute>
            <Layout title={"View Dog"}>
              <ViewDog />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faqs"
        element={
          <ProtectedRoute>
            <Layout title={"FAQs"}>
              <FAQs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/dog-breeds"
        element={
          <ProtectedRoute>
            <Layout title={"Dog Breeds"}>
              <DogBreeds />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/dog-characters"
        element={
          <ProtectedRoute>
            <Layout title={"Dog Characters"}>
              <DogCharacters />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/hobbies"
        element={
          <ProtectedRoute>
            <Layout title={"Hobbies"}>
              <Hobbies />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pages/dog-likes"
        element={
          <ProtectedRoute>
            <Layout title={"Dog Likes"}>
              <DogLikes />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;