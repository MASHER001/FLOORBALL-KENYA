// =========================================================
// FLOORBALLKENYA.COM
// ADMIN DASHBOARD
// =========================================================

import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {

    // ---------------------------------------------------------
    // TEMPORARY DASHBOARD DATA
    // ---------------------------------------------------------
    // This will later come from FastAPI + Supabase.

    const overviewStats = [
        {
            title: "Total Users",
            value: "1,248",
            change: "+12.5%",
            icon: "fa-users",
            type: "users",
            link: "/admin/users",
        },
        {
            title: "Teams",
            value: "86",
            change: "+8.2%",
            icon: "fa-people-group",
            type: "teams",
            link: "/admin/teams",
        },
        {
            title: "Players",
            value: "742",
            change: "+15.4%",
            icon: "fa-person-running",
            type: "players",
            link: "/admin/players",
        },
        {
            title: "Active Leagues",
            value: "14",
            change: "+2",
            icon: "fa-trophy",
            type: "leagues",
            link: "/admin/leagues",
        },
    ];

    const marketplaceStats = [
        {
            title: "Vendors",
            value: "34",
            icon: "fa-store",
            link: "/admin/vendors",
        },
        {
            title: "Products",
            value: "328",
            icon: "fa-box",
            link: "/admin/products",
        },
        {
            title: "Orders",
            value: "1,092",
            icon: "fa-cart-shopping",
            link: "/admin/orders",
        },
        {
            title: "Revenue",
            value: "KES 842K",
            icon: "fa-money-bill-wave",
            link: "/admin/reports",
        },
    ];

    const recentMatches = [
        {
            id: 1,
            home: "DeKUT Black Talons",
            away: "Karatina University",
            score: "5 - 2",
            status: "Completed",
            date: "13 Sep 2026",
        },
        {
            id: 2,
            home: "SEKU Floorball",
            away: "Chuka University",
            score: "3 - 3",
            status: "Completed",
            date: "12 Sep 2026",
        },
        {
            id: 3,
            home: "Nyeri Polytechnic",
            away: "Michuki Technical",
            score: "2 - 1",
            status: "Completed",
            date: "10 Sep 2026",
        },
        {
            id: 4,
            home: "DeKUT Black Talons",
            away: "SEKU Floorball",
            score: "-",
            status: "Upcoming",
            date: "20 Sep 2026",
        },
    ];

    const pendingActions = [
        {
            id: 1,
            type: "Vendor",
            title: "3 vendor applications awaiting approval",
            action: "Review Vendors",
            link: "/admin/vendors",
            icon: "fa-store",
        },
        {
            id: 2,
            type: "Team",
            title: "5 teams waiting for verification",
            action: "Review Teams",
            link: "/admin/teams",
            icon: "fa-people-group",
        },
        {
            id: 3,
            type: "Player",
            title: "12 player registrations need review",
            action: "Review Players",
            link: "/admin/players",
            icon: "fa-person",
        },
        {
            id: 4,
            type: "Product",
            title: "8 products waiting for approval",
            action: "Review Products",
            link: "/admin/products",
            icon: "fa-box",
        },
    ];

    const recentActivity = [
        {
            id: 1,
            icon: "fa-user-plus",
            title: "New player registered",
            description: "Brian Mwangi joined FloorballKenya",
            time: "10 minutes ago",
        },
        {
            id: 2,
            icon: "fa-store",
            title: "New vendor application",
            description: "Floorball Sports KE submitted an application",
            time: "35 minutes ago",
        },
        {
            id: 3,
            icon: "fa-trophy",
            title: "Tournament created",
            description: "Nyeri Floorball Open 2026 was created",
            time: "1 hour ago",
        },
        {
            id: 4,
            icon: "fa-chart-line",
            title: "Match result submitted",
            description: "DeKUT Black Talons 5 - 2 Karatina University",
            time: "2 hours ago",
        },
        {
            id: 5,
            icon: "fa-box",
            title: "New product listed",
            description: "Floorball stick added to marketplace",
            time: "3 hours ago",
        },
    ];

    return (
        <div className="admin-dashboard">

            {/* =====================================================
                ADMIN HEADER
            ===================================================== */}

            <section className="admin-header">

                <div className="admin-header-content">

                    <div>
                        <span className="admin-eyebrow">
                            ADMINISTRATION
                        </span>

                        <h1>
                            Platform Overview
                        </h1>

                        <p>
                            Manage FloorballKenya sports, marketplace,
                            users and platform activity.
                        </p>
                    </div>

                    <div className="admin-header-actions">

                        <button className="admin-icon-button">
                            <i className="fa-regular fa-bell"></i>

                            <span className="notification-dot"></span>
                        </button>

                        <div className="admin-user">

                            <div className="admin-user-avatar">
                                A
                            </div>

                            <div>
                                <strong>Administrator</strong>
                                <span>Super Admin</span>
                            </div>

                            <i className="fa-solid fa-chevron-down"></i>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                ADMIN CONTENT
            ===================================================== */}

            <main className="admin-container">


                {/* =================================================
                    OVERVIEW STATISTICS
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <span>PLATFORM</span>
                            <h2>Overview</h2>
                        </div>

                        <button className="date-filter">
                            <i className="fa-regular fa-calendar"></i>
                            This Month
                            <i className="fa-solid fa-chevron-down"></i>
                        </button>

                    </div>


                    <div className="admin-stats-grid">

                        {overviewStats.map((stat) => (

                            <Link
                                to={stat.link}
                                className={`admin-stat-card ${stat.type}`}
                                key={stat.title}
                            >

                                <div className="admin-stat-top">

                                    <div className="admin-stat-icon">
                                        <i className={`fa-solid ${stat.icon}`}></i>
                                    </div>

                                    <span className="stat-change">
                                        {stat.change}
                                    </span>

                                </div>

                                <div className="admin-stat-bottom">

                                    <span>
                                        {stat.title}
                                    </span>

                                    <strong>
                                        {stat.value}
                                    </strong>

                                </div>

                                <div className="stat-link">
                                    View Details
                                    <i className="fa-solid fa-arrow-right"></i>
                                </div>

                            </Link>

                        ))}

                    </div>

                </section>


                {/* =================================================
                    MARKETPLACE OVERVIEW
                ================================================= */}

                <section className="admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <span>MARKETPLACE</span>
                            <h2>Marketplace Overview</h2>
                        </div>

                        <Link to="/admin/reports">
                            View Reports
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>

                    </div>


                    <div className="marketplace-admin-grid">

                        {marketplaceStats.map((stat) => (

                            <Link
                                to={stat.link}
                                className="marketplace-admin-card"
                                key={stat.title}
                            >

                                <div className="marketplace-icon">
                                    <i className={`fa-solid ${stat.icon}`}></i>
                                </div>

                                <div>
                                    <span>{stat.title}</span>
                                    <strong>{stat.value}</strong>
                                </div>

                                <i className="fa-solid fa-arrow-up-right-from-square"></i>

                            </Link>

                        ))}

                    </div>

                </section>


                {/* =================================================
                    MAIN ADMIN GRID
                ================================================= */}

                <div className="admin-main-grid">


                    {/* =============================================
                        RECENT MATCHES
                    ============================================= */}

                    <section className="admin-panel">

                        <div className="admin-panel-header">

                            <div>
                                <span>SPORTS</span>
                                <h2>Recent Matches</h2>
                            </div>

                            <Link to="/admin/matches">
                                Manage Matches
                            </Link>

                        </div>


                        <div className="admin-match-table">

                            <div className="admin-table-header">
                                <span>Match</span>
                                <span>Score</span>
                                <span>Status</span>
                                <span>Date</span>
                            </div>


                            {recentMatches.map((match) => (

                                <div
                                    className="admin-table-row"
                                    key={match.id}
                                >

                                    <div className="match-teams">

                                        <strong>
                                            {match.home}
                                        </strong>

                                        <span>vs</span>

                                        <strong>
                                            {match.away}
                                        </strong>

                                    </div>

                                    <strong className="match-score">
                                        {match.score}
                                    </strong>

                                    <span
                                        className={`match-status ${
                                            match.status === "Completed"
                                                ? "completed"
                                                : "upcoming"
                                        }`}
                                    >
                                        {match.status}
                                    </span>

                                    <span className="match-date">
                                        {match.date}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </section>


                    {/* =============================================
                        PENDING ACTIONS
                    ============================================= */}

                    <section className="admin-panel">

                        <div className="admin-panel-header">

                            <div>
                                <span>ACTION REQUIRED</span>
                                <h2>Pending Actions</h2>
                            </div>

                            <span className="pending-count">
                                28
                            </span>

                        </div>


                        <div className="pending-actions">

                            {pendingActions.map((item) => (

                                <div
                                    className="pending-action"
                                    key={item.id}
                                >

                                    <div className="pending-icon">
                                        <i className={`fa-solid ${item.icon}`}></i>
                                    </div>

                                    <div className="pending-content">

                                        <span>
                                            {item.type}
                                        </span>

                                        <p>
                                            {item.title}
                                        </p>

                                        <Link to={item.link}>
                                            {item.action}
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </Link>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    RECENT ACTIVITY
                ================================================= */}

                <section className="admin-panel activity-panel">

                    <div className="admin-panel-header">

                        <div>
                            <span>PLATFORM ACTIVITY</span>
                            <h2>Recent Activity</h2>
                        </div>

                        <Link to="/admin/reports">
                            View Activity Log
                        </Link>

                    </div>


                    <div className="activity-list">

                        {recentActivity.map((activity) => (

                            <div
                                className="activity-item"
                                key={activity.id}
                            >

                                <div className="activity-icon">
                                    <i className={`fa-solid ${activity.icon}`}></i>
                                </div>

                                <div className="activity-details">

                                    <strong>
                                        {activity.title}
                                    </strong>

                                    <p>
                                        {activity.description}
                                    </p>

                                </div>

                                <span className="activity-time">
                                    {activity.time}
                                </span>

                            </div>

                        ))}

                    </div>

                </section>


                {/* =================================================
                    QUICK ADMIN ACTIONS
                ================================================= */}

                <section className="admin-section quick-admin-section">

                    <div className="admin-section-heading">

                        <div>
                            <span>MANAGEMENT</span>
                            <h2>Quick Actions</h2>
                        </div>

                    </div>


                    <div className="quick-admin-grid">

                        <Link
                            to="/admin/matches"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-plus"></i>

                            <div>
                                <strong>Create Match</strong>
                                <span>Schedule a new fixture</span>
                            </div>
                        </Link>


                        <Link
                            to="/admin/leagues"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-trophy"></i>

                            <div>
                                <strong>Create League</strong>
                                <span>Set up a new competition</span>
                            </div>
                        </Link>


                        <Link
                            to="/admin/tournaments"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-calendar-plus"></i>

                            <div>
                                <strong>Create Tournament</strong>
                                <span>Organize a tournament</span>
                            </div>
                        </Link>


                        <Link
                            to="/admin/products"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-box-open"></i>

                            <div>
                                <strong>Add Product</strong>
                                <span>List marketplace equipment</span>
                            </div>
                        </Link>


                        <Link
                            to="/admin/users"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-user-plus"></i>

                            <div>
                                <strong>Manage Users</strong>
                                <span>View platform users</span>
                            </div>
                        </Link>


                        <Link
                            to="/admin/reports"
                            className="quick-admin-card"
                        >
                            <i className="fa-solid fa-chart-pie"></i>

                            <div>
                                <strong>View Reports</strong>
                                <span>Analyze platform data</span>
                            </div>
                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;

