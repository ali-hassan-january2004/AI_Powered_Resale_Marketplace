import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { initAuth } from "./features/auth/authSlice";
import { selectUser } from "./features/auth/authSelectors";
import { fetchCart } from "./features/cart/cartSlice";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
import { ToastContainer } from "./components/ui";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  // Restore the session from the stored token on first load
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  // Navbar cart badge and wishlist hearts need data once someone is logged in
  const userId = user?._id;
  useEffect(() => {
    if (userId) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch, userId]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}