import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock,
    Edit3,
    Eye,
    MapPin,
    Plus,
    Shield,
    Trophy,
    UserPlus,
    Users,
    AlertCircle,
    Activity,
    Target,
} from "lucide-react";

/* =========================================================
   MOCK TEAM DATA
   Replace with API data later
========================================================= */

const team = {
    id: 1,
    name: "DeKUT Black Talons",
    shortName: "DKT",
    league: "Kenya University Floorball League",
    location: "Nyeri, Kenya",
    homeGround: "DeKUT Sports Complex",
    status: "Active",
    logo: "/images/teams/logos/dekut-black-talons.png",
};

/* =========================================================
   MOCK UPCOMING FIXTURES
========================================================= */

const upcomingFixtures = [
    {
        id: 1,
        date: "20 Sep 2026",
        time: "09:00 AM",
        competition: "DeKUT Floorball Open 2026",
        venue: "DeKUT Sports Complex",
        opponent: "Karatina Blazers",
        opponentLogo:
            "/images/teams/logos/karatina-blazers.png",
    },
    {
        id: 2,
        date: "26 Sep 2026",
        time: "03:00 PM",
        competition: "Kenya University Floorball League",
        venue: "DeKUT Sports Complex",
        opponent: "Chuka Warriors",
        opponentLogo:
            "/images/teams/logos/chuka-warriors.png",
    },
    {
        id: 3,
        date: "03 Oct 2026",
        time: "11:00 AM",
        competition: "Kenya University Floorball League",
        venue: "Chuka University",
        opponent: "SEKU Eagles",
        opponentLogo:
            "/images/teams/logos/seku-eagles.png",
    },
];

/* =========================================================
   MOCK RECENT RESULTS
========================================================= */

const recentResults = [
    {
        id: 101,
        date: "13 Sep 2026",
        competition: "Central Kenya Floorball Cup",
        opponent: "Karatina Blazers",
        score: "5 - 2",
        result: "W",
    },
    {
        id: 102,
        date: "06 Sep 2026",
        competition: "Kenya University Floorball League",
        opponent: "Chuka Warriors",
        score: "4 - 1",
        result: "W",
    },
    {
        id: 103,
        date: "30 Aug 2026",
        competition: "Kenya University Floorball League",
        opponent: "SEKU Eagles",
        score: "3 - 3",
        result: "D",
    },
];

/* =========================================================
   MOCK PLAYERS
========================================================= */

const players = [
    {
        id: 1,
        name: "Victor Macharia",
        position: "Forward",
        number: 10,
        goals: 12,
        assists: 8,
        photo:
            "/images/players/profile-photos/victor-macharia.jpg",
    },
    {
        id: 2,
        name: "Brian Kiptoo",
        position: "Forward",
        number: 7,
        goals: 9,
        assists: 6,
        photo:
            "/images/players/profile-photos/brian-kiptoo.jpg",
    },
    {
        id: 3,
        name: "Daniel Mwangi",
        position: "Goalkeeper",
        number: 1,
        goals: 0,
        assists: 2,
        photo:
            "/images/players/profile-photos/daniel-mwangi.jpg",
    },
    {
        id: 4,
        name: "Kevin Maina",
        position: "Forward",
        number: 14,
        goals: 7,
        assists: 5,
        photo:
            "/images/players/profile-photos/kevin-maina.jpg",
    },
];

/* =========================================================
   MOCK REGISTRATIONS
========================================================= */

const registrations = [
    {
        id: 1,
        competition: "DeKUT Floorball Open 2026",
        type: "Tournament",
        date: "08 Sep 2026",
        status: "Approved",
    },
    {
        id: 2,
        competition: "Kenya University Floorball League",
        type: "League",
        date: "04 Sep 2026",
        status: "Pending",
    },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function TeamDashboard() {
    return (
        <div className="team-manager-page team-dashboard-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <section className="team-dashboard-header">

                <div className="team-dashboard-header-content">

                    <div className="team-dashboard-team-info">

                        <div className="team-dashboard-logo">

                            <img
                                src={team.logo}
                                alt={team.name}
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";

                                    event.currentTarget.nextSibling.style.display =
                                        "flex";
                                }}
                            />

                            <div className="team-dashboard-logo-fallback">
                                DKT
                            </div>

                        </div>

                        <div>

                            <div className="team-dashboard-title-row">

                                <span className="team-manager-eyebrow">
                                    Team Manager Dashboard
                                </span>

                                <span className="team-manager-status-badge">
                                    <CheckCircle2 size={13} />
                                    {team.status}
                                </span>

                            </div>

                            <h1>{team.name}</h1>

                            <div className="team-dashboard-meta">

                                <span>
                                    <Shield size={15} />
                                    {team.league}
                                </span>

                                <span>
                                    <MapPin size={15} />
                                    {team.location}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="team-dashboard-header-actions">

                        <Link
                            to="/teams/1"
                            className="btn btn-outline"
                        >
                            <Eye size={17} />
                            Public Profile
                        </Link>

                        <Link
                            to="/team-manager/team"
                            className="btn btn-primary"
                        >
                            <Edit3 size={17} />
                            Manage Team
                        </Link>

                    </div>

                </div>

            </section>

            {/* =================================================
                QUICK STATS
            ================================================= */}

            <section className="team-dashboard-stats-section">

                <div className="team-dashboard-stats-grid">

                    <div className="team-dashboard-stat-card">

                        <div className="team-dashboard-stat-icon">
                            <Users size={21} />
                        </div>

                        <div>
                            <strong>18</strong>
                            <span>Squad Players</span>
                        </div>

                        <Link to="/team-manager/players">
                            Manage
                        </Link>

                    </div>

                    <div className="team-dashboard-stat-card">

                        <div className="team-dashboard-stat-icon">
                            <Trophy size={21} />
                        </div>

                        <div>
                            <strong>24</strong>
                            <span>Matches Played</span>
                        </div>

                        <span className="team-dashboard-stat-positive">
                            +16 Wins
                        </span>

                    </div>

                    <div className="team-dashboard-stat-card">

                        <div className="team-dashboard-stat-icon">
                            <Target size={21} />
                        </div>

                        <div>
                            <strong>68</strong>
                            <span>Goals Scored</span>
                        </div>

                        <span>
                            32 Conceded
                        </span>

                    </div>

                    <div className="team-dashboard-stat-card">

                        <div className="team-dashboard-stat-icon">
                            <Activity size={21} />
                        </div>

                        <div>
                            <strong>52</strong>
                            <span>League Points</span>
                        </div>

                        <span className="team-dashboard-stat-positive">
                            1st Position
                        </span>

                    </div>

                </div>

            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="team-dashboard-actions-section">

                <div className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>

                            <span className="team-manager-section-label">
                                Team Management
                            </span>

                            <h2>Quick Actions</h2>

                            <p>
                                Manage your team and keep your
                                competition information up to date.
                            </p>

                        </div>

                    </div>

                    <div className="team-dashboard-actions-grid">

                        <Link
                            to="/team-manager/team"
                            className="team-dashboard-action-card"
                        >

                            <div className="team-dashboard-action-icon">
                                <Shield size={22} />
                            </div>

                            <div>

                                <h3>Manage Team</h3>

                                <p>
                                    Update your team profile,
                                    home ground and contact details.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>

                        <Link
                            to="/team-manager/players"
                            className="team-dashboard-action-card"
                        >

                            <div className="team-dashboard-action-icon">
                                <Users size={22} />
                            </div>

                            <div>

                                <h3>Manage Players</h3>

                                <p>
                                    Add, edit and manage players
                                    in your current squad.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>

                        <Link
                            to="/team-manager/register"
                            className="team-dashboard-action-card"
                        >

                            <div className="team-dashboard-action-icon">
                                <Trophy size={22} />
                            </div>

                            <div>

                                <h3>Register for Competition</h3>

                                <p>
                                    Enter your team into an upcoming
                                    league or tournament.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>

                        <Link
                            to="/team-manager/players"
                            className="team-dashboard-action-card"
                        >

                            <div className="team-dashboard-action-icon">
                                <UserPlus size={22} />
                            </div>

                            <div>

                                <h3>Add Player</h3>

                                <p>
                                    Register a new player into your
                                    team squad.
                                </p>

                            </div>

                            <ArrowRight size={18} />

                        </Link>

                    </div>

                </div>

            </section>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <section className="team-dashboard-content-section">

                <div className="team-dashboard-content-grid">

                    {/* =================================================
                        LEFT COLUMN
                    ================================================= */}

                    <div className="team-dashboard-main-column">

                        {/* Upcoming fixtures */}

                        <div className="team-manager-card">

                            <div className="team-manager-card-header">

                                <div>

                                    <span className="team-manager-section-label">
                                        Match Schedule
                                    </span>

                                    <h2>Upcoming Fixtures</h2>

                                    <p>
                                        Your team's next scheduled
                                        matches.
                                    </p>

                                </div>

                                <Link
                                    to="/team-manager/fixtures"
                                    className="team-manager-inline-link"
                                >
                                    View All
                                    <ArrowRight size={15} />
                                </Link>

                            </div>

                            <div className="team-dashboard-fixtures">

                                {upcomingFixtures.map((fixture) => (

                                    <div
                                        className="team-dashboard-fixture"
                                        key={fixture.id}
                                    >

                                        <div className="team-dashboard-fixture-date">

                                            <strong>
                                                {fixture.date.split(" ")[0]}
                                            </strong>

                                            <span>
                                                {fixture.date.split(" ").slice(1).join(" ")}
                                            </span>

                                        </div>

                                        <div className="team-dashboard-fixture-details">

                                            <span>
                                                {fixture.competition}
                                            </span>

                                            <strong>
                                                vs {fixture.opponent}
                                            </strong>

                                            <small>
                                                <Clock size={13} />
                                                {fixture.time}
                                                <MapPin size={13} />
                                                {fixture.venue}
                                            </small>

                                        </div>

                                        <div className="team-dashboard-fixture-opponent">

                                            <img
                                                src={fixture.opponentLogo}
                                                alt={fixture.opponent}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                    event.currentTarget.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />

                                            <div className="team-dashboard-mini-fallback">
                                                {fixture.opponent
                                                    .split(" ")
                                                    .map(
                                                        (word) =>
                                                            word[0]
                                                    )
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* Recent results */}

                        <div className="team-manager-card">

                            <div className="team-manager-card-header">

                                <div>

                                    <span className="team-manager-section-label">
                                        Match History
                                    </span>

                                    <h2>Recent Results</h2>

                                </div>

                                <Trophy size={22} />

                            </div>

                            <div className="team-dashboard-results">

                                {recentResults.map((result) => (

                                    <Link
                                        to={`/matches/${result.id}`}
                                        className="team-dashboard-result"
                                        key={result.id}
                                    >

                                        <div className="team-dashboard-result-date">
                                            {result.date}
                                        </div>

                                        <div className="team-dashboard-result-info">

                                            <span>
                                                {result.competition}
                                            </span>

                                            <strong>
                                                vs {result.opponent}
                                            </strong>

                                        </div>

                                        <div className="team-dashboard-result-score">

                                            <strong>
                                                {result.score}
                                            </strong>

                                            <span
                                                className={`team-dashboard-result-badge ${result.result.toLowerCase()}`}
                                            >
                                                {result.result}
                                            </span>

                                        </div>

                                        <ChevronRight size={17} />

                                    </Link>

                                ))}

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        RIGHT COLUMN
                    ================================================= */}

                    <aside className="team-dashboard-sidebar">

                        {/* Squad */}

                        <div className="team-manager-card">

                            <div className="team-manager-card-header">

                                <div>

                                    <span className="team-manager-section-label">
                                        Squad
                                    </span>

                                    <h2>Key Players</h2>

                                </div>

                                <Link
                                    to="/team-manager/players"
                                    className="team-manager-inline-icon"
                                >
                                    <ArrowRight size={17} />
                                </Link>

                            </div>

                            <div className="team-dashboard-player-list">

                                {players.map((player) => (

                                    <Link
                                        to={`/players/${player.id}`}
                                        className="team-dashboard-player"
                                        key={player.id}
                                    >

                                        <div className="team-dashboard-player-avatar">

                                            <img
                                                src={player.photo}
                                                alt={player.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";

                                                    event.currentTarget.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />

                                            <div className="team-dashboard-avatar-fallback">
                                                {player.name
                                                    .split(" ")
                                                    .map(
                                                        (word) =>
                                                            word[0]
                                                    )
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>

                                        </div>

                                        <div className="team-dashboard-player-info">

                                            <strong>
                                                {player.name}
                                            </strong>

                                            <span>
                                                #{player.number} ·{" "}
                                                {player.position}
                                            </span>

                                        </div>

                                        <div className="team-dashboard-player-points">

                                            <strong>
                                                {player.goals}
                                            </strong>

                                            <span>
                                                Goals
                                            </span>

                                        </div>

                                    </Link>

                                ))}

                            </div>

                            <Link
                                to="/team-manager/players"
                                className="team-dashboard-view-all"
                            >
                                Manage Full Squad
                                <ArrowRight size={15} />
                            </Link>

                        </div>

                        {/* Registrations */}

                        <div className="team-manager-card">

                            <div className="team-manager-card-header">

                                <div>

                                    <span className="team-manager-section-label">
                                        Competitions
                                    </span>

                                    <h2>Registrations</h2>

                                </div>

                                <Link
                                    to="/team-manager/register"
                                    className="team-manager-inline-icon"
                                >
                                    <Plus size={17} />
                                </Link>

                            </div>

                            <div className="team-dashboard-registration-list">

                                {registrations.map((registration) => (

                                    <div
                                        className="team-dashboard-registration"
                                        key={registration.id}
                                    >

                                        <div className="team-dashboard-registration-icon">

                                            <Trophy size={17} />

                                        </div>

                                        <div>

                                            <strong>
                                                {registration.competition}
                                            </strong>

                                            <span>
                                                {registration.type} ·{" "}
                                                {registration.date}
                                            </span>

                                        </div>

                                        <span
                                            className={`team-dashboard-registration-status ${registration.status.toLowerCase()}`}
                                        >
                                            {registration.status}
                                        </span>

                                    </div>

                                ))}

                            </div>

                            <Link
                                to="/team-manager/register"
                                className="team-dashboard-register-link"
                            >
                                Register for Competition
                                <ArrowRight size={15} />
                            </Link>

                        </div>

                    </aside>

                </div>

            </section>

            {/* =================================================
                TEAM STATUS
            ================================================= */}

            <section className="team-dashboard-status-section">

                <div className="team-manager-card">

                    <div className="team-dashboard-status-content">

                        <div className="team-dashboard-status-icon">
                            <CheckCircle2 size={24} />
                        </div>

                        <div>

                            <span className="team-manager-section-label">
                                Team Status
                            </span>

                            <h3>
                                Your team is active and in good standing.
                            </h3>

                            <p>
                                Your team profile, player registration and
                                competition participation are currently
                                active.
                            </p>

                        </div>

                        <Link
                            to="/team-manager/team"
                            className="btn btn-outline"
                        >
                            Manage Team
                            <ArrowRight size={16} />
                        </Link>

                    </div>

                </div>

            </section>

            {/* =================================================
                FOOTER CTA
            ================================================= */}

            <section className="public-section public-cta">

                <div className="public-container">

                    <div className="public-cta-inner">

                        <div>

                            <span className="public-eyebrow">
                                Floorball Kenya
                            </span>

                            <h2>
                                Keep your team ready for the next match.
                            </h2>

                            <p>
                                Keep your squad updated, register for
                                competitions and follow your team's
                                performance.
                            </p>

                        </div>

                        <div className="sports-cta-actions">

                            <Link
                                to="/team-manager/players"
                                className="btn btn-primary"
                            >
                                Manage Squad
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/team-manager/register"
                                className="btn btn-outline"
                            >
                                Register Team
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}

