import React from "react";
import { Routes, Route } from "react-router-dom";

// ==============================
// PUBLIC PAGES
// ==============================
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import News from "../pages/public/News";
import NewsDetails from "../pages/public/NewsDetails";

// ==============================
// SPORTS PAGES
// ==============================
import Leagues from "../pages/sports/Leagues";
import LeagueDetails from "../pages/sports/LeagueDetails";

import Teams from "../pages/sports/Teams";
import TeamProfile from "../pages/sports/TeamProfile";

import Players from "../pages/sports/Players";
import PlayerProfile from "../pages/sports/PlayerProfile";

import Tournaments from "../pages/sports/Tournaments";
import TournamentDetails from "../pages/sports/TournamentDetails";

import MatchDetails from "../pages/sports/MatchDetails";

// ==============================
// MARKETPLACE PAGES
// ==============================
import Shop from "../pages/marketplace/Shop";
import ProductDetails from "../pages/marketplace/ProductDetails";
import Cart from "../pages/marketplace/Cart";
import Checkout from "../pages/marketplace/Checkout";
import Payment from "../pages/marketplace/Payment";
import OrderConfirmation from "../pages/marketplace/OrderConfirmation";
import MyOrders from "../pages/marketplace/MyOrders";

// ==============================
// AUTH PAGES
// ==============================
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";

// ==============================
// TEAM MANAGER PAGES
// ==============================
import TeamDashboard from "../pages/team-manager/TeamDashboard";
import ManageTeam from "../pages/team-manager/ManageTeam";
import ManagePlayers from "../pages/team-manager/ManagePlayers";
import TeamRegistration from "../pages/team-manager/TeamRegistration";

// ==============================
// VENDOR PAGES
// ==============================
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorStore from "../pages/vendor/VendorStore";
import AddProduct from "../pages/vendor/AddProduct";
import ManageProducts from "../pages/vendor/ManageProducts";
import VendorOrders from "../pages/vendor/VendorOrders";


// ======================================================
// APP ROUTES
// ======================================================

export default function AppRoutes() {
    return (
        <Routes>

            {/* ==================================================
                PUBLIC
            ================================================== */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/about"
                element={<About />}
            />

            <Route
                path="/contact"
                element={<Contact />}
            />

            <Route
                path="/news"
                element={<News />}
            />

            <Route
                path="/news/:id"
                element={<NewsDetails />}
            />


            {/* ==================================================
                SPORTS — LEAGUES
            ================================================== */}

            <Route
                path="/leagues"
                element={<Leagues />}
            />

            <Route
                path="/leagues/:id"
                element={<LeagueDetails />}
            />


            {/* ==================================================
                SPORTS — TEAMS
            ================================================== */}

            <Route
                path="/teams"
                element={<Teams />}
            />

            <Route
                path="/teams/:id"
                element={<TeamProfile />}
            />


            {/* ==================================================
                SPORTS — PLAYERS
            ================================================== */}

            <Route
                path="/players"
                element={<Players />}
            />

            <Route
                path="/players/:id"
                element={<PlayerProfile />}
            />


            {/* ==================================================
                SPORTS — TOURNAMENTS
            ================================================== */}

            <Route
                path="/tournaments"
                element={<Tournaments />}
            />

            <Route
                path="/tournaments/:id"
                element={<TournamentDetails />}
            />


            {/* ==================================================
                SPORTS — MATCHES
            ================================================== */}

            <Route
                path="/matches/:id"
                element={<MatchDetails />}
            />


            {/* ==================================================
                MARKETPLACE
            ================================================== */}

            <Route
                path="/shop"
                element={<Shop />}
            />

            <Route
                path="/products/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/cart"
                element={<Cart />}
            />

            <Route
                path="/checkout"
                element={<Checkout />}
            />

            <Route
                path="/payment"
                element={<Payment />}
            />

            <Route
                path="/order-confirmation"
                element={<OrderConfirmation />}
            />

            <Route
                path="/orders"
                element={<MyOrders />}
            />


            {/* ==================================================
                AUTHENTICATION
            ================================================== */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />


            {/* ==================================================
                TEAM MANAGER
            ================================================== */}

            <Route
                path="/team-manager"
                element={<TeamDashboard />}
            />

            <Route
                path="/team-manager/team"
                element={<ManageTeam />}
            />

            <Route
                path="/team-manager/players"
                element={<ManagePlayers />}
            />

            <Route
                path="/team-manager/register"
                element={<TeamRegistration />}
            />


            {/* ==================================================
                VENDOR
            ================================================== */}

            <Route
                path="/vendor"
                element={<VendorDashboard />}
            />

            <Route
                path="/vendor/store"
                element={<VendorStore />}
            />

            <Route
                path="/vendor/products"
                element={<ManageProducts />}
            />

            <Route
                path="/vendor/products/add"
                element={<AddProduct />}
            />

            <Route
                path="/vendor/orders"
                element={<VendorOrders />}
            />

        </Routes>
    );
}