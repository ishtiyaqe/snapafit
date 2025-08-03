import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import SignUp from "./components/Auth/SignUp.jsx";
import Login from "./components/Auth/Login.jsx";
import Home from "./pages/HomePage.jsx";
import Blog from "./pages/BlogPage.jsx";
import Nutration from "./pages/NutrationPage.jsx";
import { GoogleOAuthProvider } from '@react-oauth/google';
import AccountPage from "../src/pages/Accounts/dashboard/Dashboard.jsx";
import RefferalPage from "./pages/Accounts/refferal/ReferralPage.jsx";
import Nutrations from "./pages/Accounts/nutration/nutrationPage.jsx";
import WorkoutPage from "./pages/Accounts/workout/workoutPage.jsx";
import PostDetail from "./pages/BlogPostPage.jsx";
import NuPostDetail from "./pages/NutrationPost.jsx";
import QuotsPage from './pages/Accounts/quotes/quotesPage.jsx'
import ChatPage from './pages/Accounts/chat/ChatPage.jsx'
import UserDetailsPage from "./pages/UserDetailsPage.jsx";
import WorkoutDetailsPage from "./pages/Accounts/workout/WorkoutDetailsPage.jsx";
import CaloryCalculatePage from './pages/Accounts/calory/CaloryCalculatePage.jsx'
import CheckoutPage from "./pages/CheckoutPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import CanceledPage from "./pages/CanceledPage.jsx";
import PakagePage from "./pages/PakagePage.jsx";
import GetMoreTokenPage from "./pages/GetMoreTokenPage.jsx";



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route pate="/" element={<App />}>
      <Route path="signup" element={<SignUp />} />
      <Route path="login" element={<Login />} />
      <Route path="account" element={<AccountPage />} />
      <Route path="blog" element={<Blog />} />
      <Route path="chat" element={<ChatPage />} />
      <Route path="nutration" element={<Nutration />} />
      <Route path="nutrations" element={<Nutrations />} />
      <Route path="refferal" element={<RefferalPage />} />
      <Route path="workout" element={<WorkoutPage />} />
      <Route path="calculate_calory" element={<CaloryCalculatePage />} />
      <Route path="workout_details/:exerciseName" element={<WorkoutDetailsPage />} />
      <Route path="quots" element={<QuotsPage />} />
      <Route path="success" element={<SuccessPage />} />
      <Route path="canceled" element={<CanceledPage />} />
      <Route path="package" element={<PakagePage />} />
      <Route path="get_more_token" element={<GetMoreTokenPage />} />
      <Route path="user_details" element={<UserDetailsPage />} />
      <Route path="post/:id" element={<PostDetail />} />
      <Route path="nutrition-post/:id" element={<NuPostDetail />} />
       <Route path="checkout/:id" element={<CheckoutPage />} />
      <Route path="/" element={<Home />} />
     
    </Route>
  )
);
const clientId = '140994517461-2n5kkr9ub64cj3b91kmtgckun4o2mdgp.apps.googleusercontent.com';
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
    clientId={clientId}
    redirectUri="http://localhost:5173/" // Ensure this matches with your Google Cloud Console settings
  >
    <RouterProvider router={router} />

    </GoogleOAuthProvider>
  </React.StrictMode>
);
