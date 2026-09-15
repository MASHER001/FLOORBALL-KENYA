// =========================================================
// FLOORBALLKENYA.COM
// PLAYER DASHBOARD
// =========================================================

import React from "react";
import { Link } from "react-router-dom";

const PlayerDashboard = () => {
    // ---------------------------------------------------------
    // TEMPORARY PLAYER DATA
    // ---------------------------------------------------------
    // This will later come from FastAPI + Supabase.

    const player = {
        name: "Victor Macharia",
        username: "@victormacharia",
        position: "Forward",
        jerseyNumber: 10,
        team: "DeKUT Black Talons",
        league: "Kenya University Floorball League",
        avatar: "/images/players/profile-photos/default-player.png",
    };

    // ---------------------------------------------------------
    // PLAYER STATISTICS
    // ---------------------------------------------------------

    const stats = [
        {
            icon: "⚽",
            value: "12",
            label: "Goals",
            className: "stat-goals",
        },
        {
            icon: "🎯",
            value: "8",
            label: "Assists",
            className: "stat-assists",
        },
        {
            icon: "🏑",
            value: "20",
            label: "Points",
            className: "stat-points",
        },
        {
            icon: "🎮",
            value: "9",
            label: "Matches",
            className: "stat-matches",
        },
    ];

    // ---------------------------------------------------------
    // UPCOMING FIXTURES
    // ---------------------------------------------------------

    const upcomingFixtures = [
        {
            id: 1,
            date: "20 Sep",
            time: "4:00 PM",
            opponent: "Karatina University",
            venue: "DeKUT Sports Ground",
            competition: "University League",
            status: "Upcoming",
        },
        {
            id: 2,
            date: "27 Sep",
            time: "3:30 PM",
            opponent: "Chuka University",
            venue: "Chuka Sports Complex",
            competition: "University League",
            status: "Upcoming",
        },
        {
            id: 3,
            date: "04 Oct",
            time: "2:00 PM",
            opponent: "SEKU Floorball",
            venue: "DeKUT Sports Ground",
            competition: "University League",
            status: "Upcoming",
        },
    ];

    // ---------------------------------------------------------
    // RECENT RESULTS
    // ---------------------------------------------------------

    const recentResults = [
        {
            id: 1,
            opponent: "Karatina University",
            score: "5 - 2",
            result: "W",
            date: "13 Sep 2026",
        },
        {
            id: 2,
            opponent: "SEKU Floorball",
            score: "3 - 3",
            result: "D",
            date: "06 Sep 2026",
        },
        {
            id: 3,
            opponent: "Chuka University",
            score: "2 - 4",
            result: "L",
            date: "30 Aug 2026",
        },
    ];

    // ---------------------------------------------------------
    // NOTIFICATIONS
    // ---------------------------------------------------------

    const notifications = [
        {
            id: 1,
            icon: "📅",
            title: "Upcoming Match",
            message: "Your team plays Karatina University on 20 Sep.",
            time: "2 hours ago",
        },
        {
            id: 2,
            icon: "📊",
            title: "Statistics Updated",
            message: "Your player statistics have been updated.",
            time: "Yesterday",
        },
        {
            id: 3,
            icon: "🏆",
            title: "Tournament Registration",
            message: "Black Talons have registered for the upcoming tournament.",
            time: "2 days ago",
        },
    ];

    return (
        <div className="player-dashboard">

            {/* =================================================
                DASHBOARD HEADER
            ================================================= */}

            <section className="dashboard-header">

                <div className="dashboard-header-content">

                    <div className="welcome-section">

                        <div className="player-avatar">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = "👤";
                                }}
                            />
                        </div>

                        <div>
                            <span className="dashboard-label">
                                PLAYER DASHBOARD
                            </span>

                            <h1>
                                Welcome back,{" "}
                                <span>{player.name.split(" ")[0]}</span>
                            </h1>

                            <p>
                                Track your performance, fixtures and
                                floorball journey.
                            </p>
                        </div>

                    </div>

                    <div className="dashboard-actions">

                        <Link
                            to="/player/profile"
                            className="dashboard-outline-btn"
                        >
                            <i className="fa-solid fa-user"></i>
                            My Profile
                        </Link>

                        <Link
                            to="/player/statistics"
                            className="dashboard-primary-btn"
                        >
                            <i className="fa-solid fa-chart-line"></i>
                            View Statistics
                        </Link>

                    </div>

                </div>

            </section>


            {/* =================================================
                MAIN DASHBOARD
            ================================================= */}

            <main className="dashboard-container">

                {/* =================================================
                    PLAYER OVERVIEW CARD
                ================================================= */}

                <section className="player-overview-card">

                    <div className="player-overview-left">

                        <div className="large-player-avatar">
                            <img
                                src={player.avatar}
                                alt={player.name}
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = "👤";
                                }}
                            />
                        </div>

                        <div className="player-information">

                            <div className="player-name-row">

                                <h2>{player.name}</h2>

                                <span className="verified-badge">
                                    <i className="fa-solid fa-check"></i>
                                    Verified
                                </span>

                            </div>

                            <p className="player-username">
                                {player.username}
                            </p>

                            <div className="player-meta">

                                <span>
                                    <i className="fa-solid fa-shirt"></i>
                                    #{player.jerseyNumber}
                                </span>

                                <span>
                                    <i className="fa-solid fa-location-dot"></i>
                                    {player.position}
                                </span>

                                <span>
                                    <i className="fa-solid fa-people-group"></i>
                                    {player.team}
                                </span>

                            </div>

                        </div>

                    </div>


                    <div className="player-team-card">

                        <span>MY TEAM</span>

                        <div className="team-mini">

                            <div className="team-logo-placeholder">
                                BT
                            </div>

                            <div>
                                <h3>{player.team}</h3>
                                <p>{player.league}</p>
                            </div>

                        </div>

                        <Link to="/teams/dekut-black-talons">
                            View Team
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>

                    </div>

                </section>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-eyebrow">
                                SEASON PERFORMANCE
                            </span>

                            <h2>My Statistics</h2>
                        </div>

                        <Link to="/player/statistics">
                            View Full Statistics
                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>

                    </div>


                    <div className="player-stat-grid">

                        {stats.map((stat) => (
                            <div
                                className={`player-stat-card ${stat.className}`}
                                key={stat.label}
                            >

                                <div className="stat-icon">
                                    {stat.icon}
                                </div>

                                <div className="stat-content">

                                    <strong>{stat.value}</strong>

                                    <span>{stat.label}</span>

                                </div>

                            </div>
                        ))}

                    </div>

                </section>


                {/* =================================================
                    TWO COLUMN CONTENT
                ================================================= */}

                <div className="dashboard-grid">


                    {/* =================================================
                        UPCOMING FIXTURES
                    ================================================= */}

                    <section className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    MATCHES
                                </span>

                                <h2>Upcoming Fixtures</h2>
                            </div>

                            <Link to="/fixtures">
                                View All
                            </Link>

                        </div>


                        <div className="fixtures-list">

                            {upcomingFixtures.map((fixture) => (

                                <div
                                    className="fixture-item"
                                    key={fixture.id}
                                >

                                    <div className="fixture-date">

                                        <strong>
                                            {fixture.date.split(" ")[0]}
                                        </strong>

                                        <span>
                                            {fixture.date.split(" ")[1]}
                                        </span>

                                    </div>


                                    <div className="fixture-details">

                                        <span className="fixture-competition">
                                            {fixture.competition}
                                        </span>

                                        <h3>
                                            {player.team}
                                            <span>vs</span>
                                            {fixture.opponent}
                                        </h3>

                                        <p>
                                            <i className="fa-regular fa-clock"></i>
                                            {fixture.time}

                                            <span className="fixture-separator">
                                                •
                                            </span>

                                            <i className="fa-solid fa-location-dot"></i>
                                            {fixture.venue}
                                        </p>

                                    </div>


                                    <Link
                                        to={`/matches/${fixture.id}`}
                                        className="fixture-arrow"
                                    >
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </Link>

                                </div>

                            ))}

                        </div>

                    </section>


                    {/* =================================================
                        RECENT RESULTS
                    ================================================= */}

                    <section className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    PERFORMANCE
                                </span>

                                <h2>Recent Results</h2>
                            </div>

                            <Link to="/results">
                                View All
                            </Link>

                        </div>


                        <div className="results-list">

                            {recentResults.map((match) => (

                                <div
                                    className="result-item"
                                    key={match.id}
                                >

                                    <div
                                        className={`result-badge result-${match.result.toLowerCase()}`}
                                    >
                                        {match.result}
                                    </div>


                                    <div className="result-details">

                                        <h3>
                                            {player.team}
                                            <span>vs</span>
                                            {match.opponent}
                                        </h3>

                                        <p>
                                            {match.date}
                                        </p>

                                    </div>


                                    <strong className="result-score">
                                        {match.score}
                                    </strong>

                                </div>

                            ))}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    LOWER DASHBOARD
                ================================================= */}

                <div className="dashboard-grid lower-grid">


                    {/* =================================================
                        PERFORMANCE OVERVIEW
                    ================================================= */}

                    <section className="dashboard-panel performance-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    SEASON
                                </span>

                                <h2>Performance Overview</h2>
                            </div>

                            <span className="season-badge">
                                2026 Season
                            </span>

                        </div>


                        <div className="performance-content">

                            <div className="performance-circle">

                                <div>
                                    <strong>78%</strong>
                                    <span>Performance</span>
                                </div>

                            </div>


                            <div className="performance-stats">

                                <div>
                                    <span>Matches Played</span>
                                    <strong>9</strong>
                                </div>

                                <div>
                                    <span>Goals / Match</span>
                                    <strong>1.3</strong>
                                </div>

                                <div>
                                    <span>Assists / Match</span>
                                    <strong>0.9</strong>
                                </div>

                                <div>
                                    <span>Team Win Rate</span>
                                    <strong>67%</strong>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <section className="dashboard-panel">

                        <div className="panel-header">

                            <div>
                                <span className="panel-eyebrow">
                                    UPDATES
                                </span>

                                <h2>Notifications</h2>
                            </div>

                            <button className="mark-read-btn">
                                Mark all read
                            </button>

                        </div>


                        <div className="notifications-list">

                            {notifications.map((notification) => (

                                <div
                                    className="notification-item"
                                    key={notification.id}
                                >

                                    <div className="notification-icon">
                                        {notification.icon}
                                    </div>

                                    <div className="notification-content">

                                        <h3>
                                            {notification.title}
                                        </h3>

                                        <p>
                                            {notification.message}
                                        </p>

                                        <span>
                                            {notification.time}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <section className="quick-actions-section">

                    <div className="section-heading">

                        <div>
                            <span className="section-eyebrow">
                                SHORTCUTS
                            </span>

                            <h2>Quick Actions</h2>
                        </div>

                    </div>


                    <div className="quick-actions-grid">

                        <Link
                            to="/player/profile"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="fa-solid fa-user"></i>
                            </div>

                            <div>
                                <h3>Update Profile</h3>
                                <p>Manage your player information</p>
                            </div>

                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>


                        <Link
                            to="/player/team"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="fa-solid fa-people-group"></i>
                            </div>

                            <div>
                                <h3>My Team</h3>
                                <p>View your team and teammates</p>
                            </div>

                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>


                        <Link
                            to="/player/fixtures"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="fa-solid fa-calendar-days"></i>
                            </div>

                            <div>
                                <h3>My Fixtures</h3>
                                <p>See upcoming and past matches</p>
                            </div>

                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>


                        <Link
                            to="/player/statistics"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                <i className="fa-solid fa-chart-simple"></i>
                            </div>

                            <div>
                                <h3>My Statistics</h3>
                                <p>Track your season performance</p>
                            </div>

                            <i className="fa-solid fa-arrow-right"></i>
                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
};

export default PlayerDashboard;