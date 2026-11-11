import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./routePaths";
import PublicLayout from "../layouts/PublicLayout";
import AuthLayout from "../layouts/AuthLayout";
import SellerLayout from "../layouts/SellerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import RoleRoute from "../components/layout/RoleRoute";
import Spinner from "../components/ui/Spinner";

// public
const Home = lazy(() => import("../pages/public/Home"));
const Search = lazy(() => import("../pages/public/Search"));
const Category = lazy(() => import("../pages/public/Category"));
const ListingDetail = lazy(() => import("../pages/public/ListingDetail"));
const SellerProfile = lazy(() => import("../pages/public/SellerProfile"));
const NotFound = lazy(() => import("../pages/public/NotFound"));
// auth
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));
// buyer
const Cart = lazy(() => import("../pages/buyer/Cart"));
const Checkout = lazy(() => import("../pages/buyer/Checkout"));
const OrderConfirmation = lazy(() => import("../pages/buyer/OrderConfirmation"));
const Orders = lazy(() => import("../pages/buyer/Orders"));
const OrderDetail = lazy(() => import("../pages/buyer/OrderDetail"));
const Wishlist = lazy(() => import("../pages/buyer/Wishlist"));
const Account = lazy(() => import("../pages/buyer/Account"));
const BecomeSeller = lazy(() => import("../pages/buyer/BecomeSeller"));
const Notifications = lazy(() => import("../pages/buyer/Notifications"));
// seller
const CreateListing = lazy(() => import("../pages/seller/CreateListing"));
const EditListing = lazy(() => import("../pages/seller/EditListing"));
const SellerDashboard = lazy(() => import("../pages/seller/SellerDashboard"));
const SellerListings = lazy(() => import("../pages/seller/SellerListings"));
const SellerOrders = lazy(() => import("../pages/seller/SellerOrders"));
const SellerOrderDetail = lazy(() => import("../pages/seller/SellerOrderDetail"));
const SellerSettings = lazy(() => import("../pages/seller/SellerSettings"));
// admin
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminListings = lazy(() => import("../pages/admin/AdminListings"));
const AdminCategories = lazy(() => import("../pages/admin/AdminCategories"));

const wrap = (el) => (
  <Suspense fallback={<div className="flex justify-center p-16 text-stone-500"><Spinner size={28} /></div>}>
    {el}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.login, element: wrap(<Login />) },
      { path: PATHS.register, element: wrap(<Register />) },
      { path: PATHS.forgotPassword, element: wrap(<ForgotPassword />) },
      { path: PATHS.resetPassword, element: wrap(<ResetPassword />) },
    ],
  },

  {
    element: <RoleRoute roles={["seller", "admin"]} />,
    children: [
      {
        element: <SellerLayout />,
        children: [
          { path: PATHS.sellerDashboard, element: wrap(<SellerDashboard />) },
          { path: PATHS.sellerListings, element: wrap(<SellerListings />) },
          { path: PATHS.sellerOrders, element: wrap(<SellerOrders />) },
          { path: PATHS.sellerOrderDetail(), element: wrap(<SellerOrderDetail />) },
          { path: PATHS.sellerSettings, element: wrap(<SellerSettings />) },
        ],
      },
    ],
  },

  {
    element: <RoleRoute roles={["admin"]} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: PATHS.admin, element: wrap(<AdminDashboard />) },
          { path: PATHS.adminUsers, element: wrap(<AdminUsers />) },
          { path: PATHS.adminListings, element: wrap(<AdminListings />) },
          { path: PATHS.adminCategories, element: wrap(<AdminCategories />) },
        ],
      },
    ],
  },

  {
    element: <PublicLayout />,
    children: [
      { path: PATHS.home, element: wrap(<Home />) },
      { path: PATHS.search, element: wrap(<Search />) },
      { path: PATHS.category(), element: wrap(<Category />) },
      { path: PATHS.listing(), element: wrap(<ListingDetail />) },
      { path: PATHS.seller(), element: wrap(<SellerProfile />) },

      {
        element: <ProtectedRoute />,
        children: [
          { path: PATHS.cart, element: wrap(<Cart />) },
          { path: PATHS.checkout, element: wrap(<Checkout />) },
          { path: PATHS.orderConfirmation(), element: wrap(<OrderConfirmation />) },
          { path: PATHS.orders, element: wrap(<Orders />) },
          { path: PATHS.order(), element: wrap(<OrderDetail />) },
          { path: PATHS.wishlist, element: wrap(<Wishlist />) },
          { path: PATHS.account, element: wrap(<Account />) },
          { path: PATHS.becomeSeller, element: wrap(<BecomeSeller />) },
          { path: PATHS.notifications, element: wrap(<Notifications />) },
        ],
      },

      {
        element: <RoleRoute roles={["seller", "admin"]} />,
        children: [
          { path: PATHS.sellNew, element: wrap(<CreateListing />) },
          { path: PATHS.sellEdit(), element: wrap(<EditListing />) },
        ],
      },

      { path: "*", element: wrap(<NotFound />) },
    ],
  },
]);