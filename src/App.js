import React, { useEffect, useState } from "react";
import Amplify, { Auth } from "aws-amplify";
import aws_exports from "./aws-exports";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import NotFound from "./pages/NotFound/NotFound";
import Home from "./pages/HomePage/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Testimonials from "./pages/TextPages/Testimonials";
import Careers from "./pages/TextPages/Careers";
import Investors from "./pages/TextPages/Investors";
import HowItWorks from "./pages/TextPages/HowItWorks";
import TermsAndConditions from "./pages/TextPages/TermsAndConditions";
import PrivacyPolicy from "./pages/TextPages/PrivacyPolicy";
import CookieConsent from "./pages/TextPages/CookieConsent";
import GettingStarted from "./pages/GettingStarted";
import ManagePoolRoute from "./pages/Pools";
import EarlyAccess from "./pages/EarlyAccess";
import AdminRoute from "./pages/Admin";
import Footer from "./pages/Footer/Footer";
import Navbar from "./pages/NavBar/Navbar";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import ResetPassword from "./pages/Auth/ResetPassword";
import ScrollToTop from "./components/ScrollToTop";

Amplify.configure(aws_exports);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState();
  const [gatherer, setGatherer] = useState();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    Auth.currentAuthenticatedUser()
      .then((val) => {
        //For testing
        //Auth.currentCredentials()
        //.then((val) => console.log(val))

        let a = (
          val.signInUserSession.accessToken.payload["cognito:groups"] ?? []
        ).includes("admin");

        let g = (
          val.signInUserSession.accessToken.payload["cognito:groups"] ?? []
        ).includes("gatherer");

        setIsAuthenticated(true);
        setAdmin(a);
        setGatherer(g);
      })
      .catch((err) => {
        console.log(err);
        setIsAuthenticated(false);
      });
  };

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        checkAuth={checkAuth}
        gatherer={gatherer}
        admin={admin}
      />
      <ScrollToTop>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/about" component={About} />
          <Route path="/how-it-works" component={HowItWorks} />
          <Route path="/testimonials" component={Testimonials} />
          <Route path="/careers" component={Careers} />
          <Route path="/investors" component={Investors} />
          <Route path="/early-access" component={EarlyAccess} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-and-conditions" component={TermsAndConditions} />
          <Route path="/cookie-consent" component={CookieConsent} />
          <Route path="/sign-up" component={SignUp} />
          <Route
            path="/sign-in"
            component={() => <SignIn checkAuth={checkAuth} />}
          />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/confirm-email/:email?" component={ConfirmEmail} />
          {isAuthenticated && (
            <Route
              path="/get-started"
              component={() => <GettingStarted gatherer={gatherer} />}
            />
          )}
          {gatherer && (
            <Route path="/Manage-pools" component={ManagePoolRoute} />
          )}
          {admin && <Route path="/admin" component={AdminRoute} />}
          <Route path="*" component={NotFound} />
        </Switch>
        <Footer />
      </ScrollToTop>
    </Router>
  );
};

export default App;
