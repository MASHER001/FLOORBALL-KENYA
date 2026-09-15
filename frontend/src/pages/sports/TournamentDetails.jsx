// frontend/src/pages/sports/TournamentDetails.jsx

import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    Clock,
    MapPin,
    Trophy,
    Users,
    Shield,
    Target,
    Medal,
    BarChart3,
    CheckCircle2,
    CircleDot,
    Flag,
    UserRound,
} from "lucide-react";

/* =========================================================
   MOCK TOURNAMENT DATA
   Replace with API data later
========================================================= */

const mockTournaments = {
    1: {
        id: 1,
        name: "DeKUT Floorball Open 2026",
        shortName: "DeKUT Open",
        type: "University Tournament",
        status: "Upcoming",
        date: "20 Sep 2026",
        endDate: "21 Sep 2026",
        venue: "DeKUT Sports Complex",
        location: "Nyeri, Kenya",
        organizer: "Dedan Kimathi University of Technology",
        description:
            "A university floorball tournament bringing together leading men's and women's teams from across Central Kenya for two days of competitive floorball.",
        teams: 8,
        matches: 15,
        completed: 0,
        remaining: 15,
        image: "/images/tournaments/tournament-1.jpg",
        registrationStatus: "Registration Closed",
        prize: "KES 50,000",
        edition: "3rd Edition",
    },

    2: {
        id: 2,
        name: "Central Kenya Floorball Cup 2026",
        shortName: "Central Kenya Cup",
        type: "Regional Tournament",
        status: "Ongoing",
        date: "12 Sep 2026",
        endDate: "13 Sep 2026",
        venue: "Karatina University Sports Grounds",
        location: "Karatina, Kenya",
        organizer: "Central Kenya Floorball Association",
        description:
            "A regional floorball competition featuring clubs and university teams from Central Kenya.",
        teams: 10,
        matches: 18,
        completed: 12,
        remaining: 6,
        image: "/images/tournaments/tournament-2.jpg",
        registrationStatus: "Registration Closed",
        prize: "KES 75,000",
        edition: "2nd Edition",
    },

    3: {
        id: 3,
        name: "Kenya University Floorball Championship 2026",
        shortName: "KUFC 2026",
        type: "National University Tournament",
        status: "Completed",
        date: "22 Aug 2026",
        endDate: "23 Aug 2026",
        venue: "Chuka University",
        location: "Chuka, Kenya",
        organizer: "Kenya University Floorball Federation",
        description:
            "The annual university floorball championship bringing together university teams from across Kenya.",
        teams: 12,
        matches: 23,
        completed: 23,
        remaining: 0,
        image: "/images/tournaments/tournament-3.jpg",
        registrationStatus: "Closed",
        prize: "KES 100,000",
        edition: "5th Edition",
    },
};

/* =========================================================
   MOCK PARTICIPATING TEAMS
========================================================= */

const mockTeams = [
    {
        id: 1,
        name: "DeKUT Black Talons",
        shortName: "DKT",
        location: "Nyeri",
        logo: "/images/teams/logos/dekut-black-talons.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 2,
        name: "Karatina Blazers",
        shortName: "KBU",
        location: "Karatina",
        logo: "/images/teams/logos/karatina-blazers.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 3,
        name: "Chuka Warriors",
        shortName: "CUW",
        location: "Chuka",
        logo: "/images/teams/logos/chuka-warriors.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 4,
        name: "SEKU Eagles",
        shortName: "SEKU",
        location: "Kitui",
        logo: "/images/teams/logos/seku-eagles.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 5,
        name: "Nyandarua Panthers",
        shortName: "NYP",
        location: "Nyandarua",
        logo: "/images/teams/logos/nyandarua-panthers.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 6,
        name: "Michuki Lions",
        shortName: "MICH",
        location: "Murang'a",
        logo: "/images/teams/logos/michuki-lions.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 7,
        name: "Nairobi Floorball Club",
        shortName: "NFC",
        location: "Nairobi",
        logo: "/images/teams/logos/nairobi-floorball.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
    {
        id: 8,
        name: "Eldoret Strikers",
        shortName: "ELS",
        location: "Eldoret",
        logo: "/images/teams/logos/eldoret-strikers.png",
        status: "Qualified",
        matches: 0,
        wins: 0,
        points: 0,
    },
];

/* =========================================================
   MOCK FIXTURES
========================================================= */

const mockFixtures = [
    {
        id: 101,
        date: "20 Sep 2026",
        time: "09:00 AM",
        venue: "DeKUT Sports Complex",
        homeTeam: {
            id: 1,
            name: "DeKUT Black Talons",
            logo: "/images/teams/logos/dekut-black-talons.png",
        },
        awayTeam: {
            id: 2,
            name: "Karatina Blazers",
            logo: "/images/teams/logos/karatina-blazers.png",
        },
        status: "Upcoming",
    },
    {
        id: 102,
        date: "20 Sep 2026",
        time: "10:30 AM",
        venue: "DeKUT Sports Complex",
        homeTeam: {
            id: 3,
            name: "Chuka Warriors",
            logo: "/images/teams/logos/chuka-warriors.png",
        },
        awayTeam: {
            id: 4,
            name: "SEKU Eagles",
            logo: "/images/teams/logos/seku-eagles.png",
        },
        status: "Upcoming",
    },
    {
        id: 103,
        date: "20 Sep 2026",
        time: "12:00 PM",
        venue: "DeKUT Sports Complex",
        homeTeam: {
            id: 5,
            name: "Nyandarua Panthers",
            logo: "/images/teams/logos/nyandarua-panthers.png",
        },
        awayTeam: {
            id: 6,
            name: "Michuki Lions",
            logo: "/images/teams/logos/michuki-lions.png",
        },
        status: "Upcoming",
    },
    {
        id: 104,
        date: "20 Sep 2026",
        time: "01:30 PM",
        venue: "DeKUT Sports Complex",
        homeTeam: {
            id: 7,
            name: "Nairobi Floorball Club",
            logo: "/images/teams/logos/nairobi-floorball.png",
        },
        awayTeam: {
            id: 8,
            name: "Eldoret Strikers",
            logo: "/images/teams/logos/eldoret-strikers.png",
        },
        status: "Upcoming",
    },
];

/* =========================================================
   MOCK RESULTS
========================================================= */

const mockResults = [
    {
        id: 201,
        date: "13 Sep 2026",
        time: "03:00 PM",
        homeTeam: {
            id: 1,
            name: "DeKUT Black Talons",
            logo: "/images/teams/logos/dekut-black-talons.png",
        },
        awayTeam: {
            id: 2,
            name: "Karatina Blazers",
            logo: "/images/teams/logos/karatina-blazers.png",
        },
        homeScore: 5,
        awayScore: 2,
        status: "Completed",
    },
    {
        id: 202,
        date: "13 Sep 2026",
        time: "01:30 PM",
        homeTeam: {
            id: 3,
            name: "Chuka Warriors",
            logo: "/images/teams/logos/chuka-warriors.png",
        },
        awayTeam: {
            id: 4,
            name: "SEKU Eagles",
            logo: "/images/teams/logos/seku-eagles.png",
        },
        homeScore: 3,
        awayScore: 3,
        status: "Completed",
    },
    {
        id: 203,
        date: "12 Sep 2026",
        time: "11:00 AM",
        homeTeam: {
            id: 5,
            name: "Nyandarua Panthers",
            logo: "/images/teams/logos/nyandarua-panthers.png",
        },
        awayTeam: {
            id: 6,
            name: "Michuki Lions",
            logo: "/images/teams/logos/michuki-lions.png",
        },
        homeScore: 4,
        awayScore: 1,
        status: "Completed",
    },
];

/* =========================================================
   MOCK STANDINGS
========================================================= */

const mockStandings = [
    {
        position: 1,
        teamId: 1,
        team: "DeKUT Black Talons",
        logo: "/images/teams/logos/dekut-black-talons.png",
        played: 3,
        won: 3,
        drawn: 0,
        lost: 0,
        gf: 15,
        ga: 5,
        gd: 10,
        points: 9,
    },
    {
        position: 2,
        teamId: 2,
        team: "Karatina Blazers",
        logo: "/images/teams/logos/karatina-blazers.png",
        played: 3,
        won: 2,
        drawn: 0,
        lost: 1,
        gf: 11,
        ga: 7,
        gd: 4,
        points: 6,
    },
    {
        position: 3,
        teamId: 3,
        team: "Chuka Warriors",
        logo: "/images/teams/logos/chuka-warriors.png",
        played: 3,
        won: 1,
        drawn: 1,
        lost: 1,
        gf: 8,
        ga: 9,
        gd: -1,
        points: 4,
    },
    {
        position: 4,
        teamId: 4,
        team: "SEKU Eagles",
        logo: "/images/teams/logos/seku-eagles.png",
        played: 3,
        won: 0,
        drawn: 1,
        lost: 2,
        gf: 6,
        ga: 10,
        gd: -4,
        points: 1,
    },
];

/* =========================================================
   MOCK TOP PLAYERS
========================================================= */

const mockPlayers = [
    {
        id: 1,
        name: "Victor Macharia",
        team: "DeKUT Black Talons",
        position: "Forward",
        goals: 6,
        assists: 4,
        points: 10,
        photo: "/images/players/profile-photos/victor-macharia.jpg",
    },
    {
        id: 2,
        name: "Brian Kiptoo",
        team: "Karatina Blazers",
        position: "Forward",
        goals: 5,
        assists: 2,
        points: 7,
        photo: "/images/players/profile-photos/brian-kiptoo.jpg",
    },
    {
        id: 3,
        name: "Kevin Maina",
        team: "Chuka Warriors",
        position: "Forward",
        goals: 4,
        assists: 3,
        points: 7,
        photo: "/images/players/profile-photos/kevin-maina.jpg",
    },
];

/* =========================================================
   TEAM LOGO HELPER
========================================================= */

function TeamLogo({ team, className = "" }) {
    return (
        <div className={`tournament-team-logo ${className}`}>
            <img
                src={team.logo}
                alt={team.name}
                onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.nextSibling.style.display = "flex";
                }}
            />

            <div className="sports-logo-fallback">
                {team.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")}
            </div>
        </div>
    );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function TournamentDetails() {
    const { id } = useParams();

    const [activeTab, setActiveTab] = useState("overview");

    const tournament = mockTournaments[id] || mockTournaments[1];

    const topScorer = useMemo(() => {
        return [...mockPlayers].sort((a, b) => b.goals - a.goals)[0];
    }, []);

    const topTeam = useMemo(() => {
        return [...mockStandings].sort((a, b) => b.points - a.points)[0];
    }, []);

    const tabs = [
        {
            id: "overview",
            label: "Overview",
            icon: Trophy,
        },
        {
            id: "teams",
            label: "Participating Teams",
            icon: Users,
        },
        {
            id: "fixtures",
            label: "Fixtures",
            icon: CalendarDays,
        },
        {
            id: "results",
            label: "Results",
            icon: CheckCircle2,
        },
        {
            id: "standings",
            label: "Standings",
            icon: BarChart3,
        },
        {
            id: "statistics",
            label: "Statistics",
            icon: Target,
        },
    ];

    return (
        <div className="sports-page tournament-details-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="tournament-details-hero">
                <div className="tournament-details-cover">
                    <img
                        src={tournament.image}
                        alt={tournament.name}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />

                    <div className="tournament-details-cover-overlay"></div>
                </div>

                <div className="public-container tournament-details-hero-content">

                    <Link
                        to="/tournaments"
                        className="sports-back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Tournaments
                    </Link>

                    <div className="tournament-details-main">

                        <div className="tournament-details-icon">
                            <Trophy size={42} />
                        </div>

                        <div className="tournament-details-info">

                            <div className="tournament-details-badges">
                                <span className={`sports-status ${tournament.status.toLowerCase()}`}>
                                    <CircleDot size={13} />
                                    {tournament.status}
                                </span>

                                <span className="tournament-type-badge">
                                    {tournament.type}
                                </span>
                            </div>

                            <h1>{tournament.name}</h1>

                            <p className="tournament-details-description">
                                {tournament.description}
                            </p>

                            <div className="tournament-details-meta">

                                <span>
                                    <CalendarDays size={17} />
                                    {tournament.date} – {tournament.endDate}
                                </span>

                                <span>
                                    <MapPin size={17} />
                                    {tournament.venue}, {tournament.location}
                                </span>

                                <span>
                                    <Flag size={17} />
                                    {tournament.edition}
                                </span>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* =================================================
                QUICK STATS
            ================================================= */}

            <section className="tournament-stats-section">
                <div className="public-container">

                    <div className="tournament-stats-grid">

                        <div className="tournament-stat-card">
                            <div className="tournament-stat-icon">
                                <Users size={22} />
                            </div>

                            <div>
                                <strong>{tournament.teams}</strong>
                                <span>Participating Teams</span>
                            </div>
                        </div>

                        <div className="tournament-stat-card">
                            <div className="tournament-stat-icon">
                                <CalendarDays size={22} />
                            </div>

                            <div>
                                <strong>{tournament.matches}</strong>
                                <span>Total Matches</span>
                            </div>
                        </div>

                        <div className="tournament-stat-card">
                            <div className="tournament-stat-icon">
                                <CheckCircle2 size={22} />
                            </div>

                            <div>
                                <strong>{tournament.completed}</strong>
                                <span>Matches Completed</span>
                            </div>
                        </div>

                        <div className="tournament-stat-card">
                            <div className="tournament-stat-icon">
                                <Clock size={22} />
                            </div>

                            <div>
                                <strong>{tournament.remaining}</strong>
                                <span>Matches Remaining</span>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* =================================================
                TABS
            ================================================= */}

            <section className="tournament-tabs-section">
                <div className="public-container">

                    <div className="tournament-tabs">

                        {tabs.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`tournament-tab ${
                                        activeTab === tab.id ? "active" : ""
                                    }`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <Icon size={17} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}

                    </div>

                </div>
            </section>

            {/* =================================================
                CONTENT
            ================================================= */}

            <section className="public-section tournament-content-section">
                <div className="public-container">

                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    {activeTab === "overview" && (
                        <div className="tournament-content-layout">

                            <main className="tournament-content-main">

                                <div className="sports-card tournament-content-card">

                                    <div className="sports-card-header">
                                        <div>
                                            <span className="public-eyebrow">
                                                Tournament Overview
                                            </span>

                                            <h2>About the Tournament</h2>
                                        </div>

                                        <Trophy size={22} />
                                    </div>

                                    <p className="tournament-description">
                                        {tournament.description}
                                    </p>

                                    <div className="tournament-information-grid">

                                        <div className="tournament-information-item">
                                            <CalendarDays size={20} />
                                            <div>
                                                <span>Date</span>
                                                <strong>
                                                    {tournament.date} – {tournament.endDate}
                                                </strong>
                                            </div>
                                        </div>

                                        <div className="tournament-information-item">
                                            <MapPin size={20} />
                                            <div>
                                                <span>Venue</span>
                                                <strong>{tournament.venue}</strong>
                                            </div>
                                        </div>

                                        <div className="tournament-information-item">
                                            <Users size={20} />
                                            <div>
                                                <span>Teams</span>
                                                <strong>{tournament.teams} Teams</strong>
                                            </div>
                                        </div>

                                        <div className="tournament-information-item">
                                            <Medal size={20} />
                                            <div>
                                                <span>Prize Pool</span>
                                                <strong>{tournament.prize}</strong>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                {/* Recent results */}

                                <div className="sports-card tournament-content-card">

                                    <div className="sports-card-header">
                                        <div>
                                            <span className="public-eyebrow">
                                                Latest Action
                                            </span>

                                            <h2>Recent Results</h2>
                                        </div>

                                        <button
                                            type="button"
                                            className="public-link"
                                            onClick={() => setActiveTab("results")}
                                        >
                                            View All
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>

                                    <div className="tournament-results-list">

                                        {mockResults.map((result) => (
                                            <Link
                                                to={`/matches/${result.id}`}
                                                className="tournament-result-row"
                                                key={result.id}
                                            >

                                                <div className="tournament-result-date">
                                                    <strong>{result.date}</strong>
                                                    <span>{result.time}</span>
                                                </div>

                                                <div className="tournament-result-team">
                                                    <TeamLogo team={result.homeTeam} />
                                                    <span>{result.homeTeam.name}</span>
                                                </div>

                                                <div className="tournament-result-score">
                                                    <strong>
                                                        {result.homeScore} – {result.awayScore}
                                                    </strong>

                                                    <span>FT</span>
                                                </div>

                                                <div className="tournament-result-team away">
                                                    <span>{result.awayTeam.name}</span>
                                                    <TeamLogo team={result.awayTeam} />
                                                </div>

                                                <ArrowRight size={17} />

                                            </Link>
                                        ))}

                                    </div>

                                </div>

                            </main>

                            {/* Sidebar */}

                            <aside className="tournament-content-sidebar">

                                <div className="sports-card tournament-sidebar-card">

                                    <div className="tournament-sidebar-card-header">
                                        <Trophy size={20} />
                                        <h3>Tournament Information</h3>
                                    </div>

                                    <div className="tournament-sidebar-list">

                                        <div>
                                            <span>Organizer</span>
                                            <strong>{tournament.organizer}</strong>
                                        </div>

                                        <div>
                                            <span>Venue</span>
                                            <strong>{tournament.venue}</strong>
                                        </div>

                                        <div>
                                            <span>Location</span>
                                            <strong>{tournament.location}</strong>
                                        </div>

                                        <div>
                                            <span>Edition</span>
                                            <strong>{tournament.edition}</strong>
                                        </div>

                                        <div>
                                            <span>Prize Pool</span>
                                            <strong>{tournament.prize}</strong>
                                        </div>

                                        <div>
                                            <span>Registration</span>
                                            <strong>{tournament.registrationStatus}</strong>
                                        </div>

                                    </div>

                                </div>

                                <div className="sports-card tournament-sidebar-card">

                                    <div className="tournament-sidebar-card-header">
                                        <BarChart3 size={20} />
                                        <h3>Tournament Leader</h3>
                                    </div>

                                    <div className="tournament-leader">

                                        <div className="tournament-leader-avatar">
                                            <img
                                                src={topScorer.photo}
                                                alt={topScorer.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display = "none";
                                                    event.currentTarget.nextSibling.style.display = "flex";
                                                }}
                                            />

                                            <div className="sports-logo-fallback">
                                                {topScorer.name
                                                    .split(" ")
                                                    .map((word) => word[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </div>
                                        </div>

                                        <div>
                                            <span>Top Scorer</span>
                                            <strong>{topScorer.name}</strong>
                                            <small>
                                                {topScorer.goals} Goals · {topScorer.points} Points
                                            </small>
                                        </div>

                                    </div>

                                    <Link
                                        to={`/players/${topScorer.id}`}
                                        className="tournament-sidebar-link"
                                    >
                                        View Player Profile
                                        <ArrowRight size={15} />
                                    </Link>

                                </div>

                            </aside>

                        </div>
                    )}

                    {/* =================================================
                        TEAMS
                    ================================================= */}

                    {activeTab === "teams" && (
                        <div className="tournament-tab-content">

                            <div className="sports-page-header">
                                <div>
                                    <span className="public-eyebrow">
                                        Competition Teams
                                    </span>

                                    <h2>Participating Teams</h2>

                                    <p>
                                        Teams competing in {tournament.name}.
                                    </p>
                                </div>

                                <div className="sports-result-count">
                                    {mockTeams.length} Teams
                                </div>
                            </div>

                            <div className="tournament-team-grid">

                                {mockTeams.slice(0, tournament.teams).map((team) => (
                                    <Link
                                        to={`/teams/${team.id}`}
                                        className="tournament-team-card"
                                        key={team.id}
                                    >

                                        <div className="tournament-team-card-top">
                                            <TeamLogo team={team} />

                                            <span className="sports-status active">
                                                {team.status}
                                            </span>
                                        </div>

                                        <div className="tournament-team-card-body">

                                            <span className="tournament-team-location">
                                                {team.location}
                                            </span>

                                            <h3>{team.name}</h3>

                                            <div className="tournament-team-stats">

                                                <span>
                                                    <strong>{team.matches}</strong>
                                                    Matches
                                                </span>

                                                <span>
                                                    <strong>{team.wins}</strong>
                                                    Wins
                                                </span>

                                                <span>
                                                    <strong>{team.points}</strong>
                                                    Points
                                                </span>

                                            </div>

                                            <div className="tournament-team-card-link">
                                                View Team
                                                <ArrowRight size={15} />
                                            </div>

                                        </div>

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* =================================================
                        FIXTURES
                    ================================================= */}

                    {activeTab === "fixtures" && (
                        <div className="tournament-tab-content">

                            <div className="sports-page-header">
                                <div>
                                    <span className="public-eyebrow">
                                        Upcoming Matches
                                    </span>

                                    <h2>Tournament Fixtures</h2>

                                    <p>
                                        Upcoming matches scheduled for this tournament.
                                    </p>
                                </div>
                            </div>

                            <div className="tournament-fixtures-list">

                                {mockFixtures.map((fixture) => (
                                    <Link
                                        to={`/matches/${fixture.id}`}
                                        className="tournament-fixture-row"
                                        key={fixture.id}
                                    >

                                        <div className="tournament-fixture-date">
                                            <CalendarDays size={18} />
                                            <div>
                                                <strong>{fixture.date}</strong>
                                                <span>{fixture.time}</span>
                                            </div>
                                        </div>

                                        <div className="tournament-fixture-team home">
                                            <span>{fixture.homeTeam.name}</span>
                                            <TeamLogo team={fixture.homeTeam} />
                                        </div>

                                        <div className="tournament-fixture-vs">
                                            <span>VS</span>
                                        </div>

                                        <div className="tournament-fixture-team">
                                            <TeamLogo team={fixture.awayTeam} />
                                            <span>{fixture.awayTeam.name}</span>
                                        </div>

                                        <div className="tournament-fixture-venue">
                                            <MapPin size={15} />
                                            {fixture.venue}
                                        </div>

                                        <ArrowRight size={17} />

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* =================================================
                        RESULTS
                    ================================================= */}

                    {activeTab === "results" && (
                        <div className="tournament-tab-content">

                            <div className="sports-page-header">
                                <div>
                                    <span className="public-eyebrow">
                                        Completed Matches
                                    </span>

                                    <h2>Tournament Results</h2>

                                    <p>
                                        Results from completed tournament matches.
                                    </p>
                                </div>
                            </div>

                            <div className="tournament-results-list full">

                                {mockResults.map((result) => (
                                    <Link
                                        to={`/matches/${result.id}`}
                                        className="tournament-result-row"
                                        key={result.id}
                                    >

                                        <div className="tournament-result-date">
                                            <strong>{result.date}</strong>
                                            <span>{result.time}</span>
                                        </div>

                                        <div className="tournament-result-team">
                                            <TeamLogo team={result.homeTeam} />
                                            <span>{result.homeTeam.name}</span>
                                        </div>

                                        <div className="tournament-result-score">
                                            <strong>
                                                {result.homeScore} – {result.awayScore}
                                            </strong>

                                            <span>Full Time</span>
                                        </div>

                                        <div className="tournament-result-team away">
                                            <span>{result.awayTeam.name}</span>
                                            <TeamLogo team={result.awayTeam} />
                                        </div>

                                        <ArrowRight size={17} />

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* =================================================
                        STANDINGS
                    ================================================= */}

                    {activeTab === "standings" && (
                        <div className="tournament-tab-content">

                            <div className="sports-page-header">
                                <div>
                                    <span className="public-eyebrow">
                                        Tournament Table
                                    </span>

                                    <h2>Standings</h2>

                                    <p>
                                        Current tournament standings based on completed matches.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-card tournament-standings-card">

                                <div className="sports-table-wrapper">

                                    <table className="sports-table">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Team</th>
                                                <th>MP</th>
                                                <th>W</th>
                                                <th>D</th>
                                                <th>L</th>
                                                <th>GF</th>
                                                <th>GA</th>
                                                <th>GD</th>
                                                <th>Pts</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {mockStandings.map((team) => (
                                                <tr key={team.teamId}>

                                                    <td>
                                                        <strong>{team.position}</strong>
                                                    </td>

                                                    <td>
                                                        <Link
                                                            to={`/teams/${team.teamId}`}
                                                            className="sports-table-team"
                                                        >
                                                            <TeamLogo team={team} />
                                                            <span>{team.team}</span>
                                                        </Link>
                                                    </td>

                                                    <td>{team.played}</td>
                                                    <td>{team.won}</td>
                                                    <td>{team.drawn}</td>
                                                    <td>{team.lost}</td>
                                                    <td>{team.gf}</td>
                                                    <td>{team.ga}</td>

                                                    <td>
                                                        <strong className={
                                                            team.gd >= 0
                                                                ? "positive-stat"
                                                                : "negative-stat"
                                                        }>
                                                            {team.gd > 0 ? "+" : ""}
                                                            {team.gd}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        <strong>{team.points}</strong>
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    {activeTab === "statistics" && (
                        <div className="tournament-tab-content">

                            <div className="sports-page-header">
                                <div>
                                    <span className="public-eyebrow">
                                        Tournament Analytics
                                    </span>

                                    <h2>Statistics</h2>

                                    <p>
                                        Performance statistics from {tournament.name}.
                                    </p>
                                </div>
                            </div>

                            <div className="tournament-statistics-grid">

                                <div className="tournament-statistics-card">
                                    <div className="tournament-statistics-icon">
                                        <Target size={21} />
                                    </div>

                                    <span>Total Goals</span>
                                    <strong>40</strong>
                                    <small>Across completed matches</small>
                                </div>

                                <div className="tournament-statistics-card">
                                    <div className="tournament-statistics-icon">
                                        <Users size={21} />
                                    </div>

                                    <span>Average Goals / Match</span>
                                    <strong>3.3</strong>
                                    <small>Competition average</small>
                                </div>

                                <div className="tournament-statistics-card">
                                    <div className="tournament-statistics-icon">
                                        <Trophy size={21} />
                                    </div>

                                    <span>Top Team</span>
                                    <strong>{topTeam.team}</strong>
                                    <small>{topTeam.points} points</small>
                                </div>

                                <div className="tournament-statistics-card">
                                    <div className="tournament-statistics-icon">
                                        <Medal size={21} />
                                    </div>

                                    <span>Top Scorer</span>
                                    <strong>{topScorer.name}</strong>
                                    <small>{topScorer.goals} goals</small>
                                </div>

                            </div>

                            {/* Top Players */}

                            <div className="sports-card tournament-content-card">

                                <div className="sports-card-header">
                                    <div>
                                        <span className="public-eyebrow">
                                            Player Performance
                                        </span>

                                        <h2>Top Players</h2>
                                    </div>

                                    <UserRound size={22} />
                                </div>

                                <div className="tournament-player-stat-list">

                                    {mockPlayers.map((player, index) => (
                                        <Link
                                            to={`/players/${player.id}`}
                                            className="tournament-player-stat-row"
                                            key={player.id}
                                        >

                                            <div className="tournament-player-rank">
                                                #{index + 1}
                                            </div>

                                            <div className="tournament-player-avatar">
                                                <img
                                                    src={player.photo}
                                                    alt={player.name}
                                                    onError={(event) => {
                                                        event.currentTarget.style.display = "none";
                                                        event.currentTarget.nextSibling.style.display = "flex";
                                                    }}
                                                />

                                                <div className="sports-logo-fallback">
                                                    {player.name
                                                        .split(" ")
                                                        .map((word) => word[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>
                                            </div>

                                            <div className="tournament-player-info">
                                                <strong>{player.name}</strong>
                                                <span>
                                                    {player.team} · {player.position}
                                                </span>
                                            </div>

                                            <div className="tournament-player-stat">
                                                <strong>{player.goals}</strong>
                                                <span>Goals</span>
                                            </div>

                                            <div className="tournament-player-stat">
                                                <strong>{player.assists}</strong>
                                                <span>Assists</span>
                                            </div>

                                            <div className="tournament-player-stat points">
                                                <strong>{player.points}</strong>
                                                <span>Points</span>
                                            </div>

                                            <ArrowRight size={17} />

                                        </Link>
                                    ))}

                                </div>

                            </div>

                        </div>
                    )}

                </div>
            </section>

            {/* =================================================
                CTA
            ================================================= */}

            <section className="public-section public-cta">

                <div className="public-container">

                    <div className="public-cta-inner">

                        <div>
                            <span className="public-eyebrow">
                                Floorball Kenya
                            </span>

                            <h2>
                                Follow the tournament as it happens.
                            </h2>

                            <p>
                                Stay updated with fixtures, results, standings,
                                teams and player performances.
                            </p>
                        </div>

                        <div className="sports-cta-actions">

                            <Link
                                to="/tournaments"
                                className="btn btn-primary"
                            >
                                All Tournaments
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/teams"
                                className="btn btn-outline"
                            >
                                Explore Teams
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}