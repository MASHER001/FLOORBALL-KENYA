import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    Trophy,
    Users,
    CalendarDays,
    MapPin,
    ArrowLeft,
    ArrowRight,
    BarChart3,
    Shield,
    Clock,
    ChevronRight,
    Medal,
    Target,
} from "lucide-react";

const mockLeagues = {
    1: {
        id: 1,
        name: "Kenya University Floorball League",
        shortName: "KUFL",
        season: "2026 Season",
        location: "Kenya",
        status: "Active",
        teams: 12,
        matches: 42,
        completedMatches: 30,
        startDate: "2026-08-15",
        endDate: "2026-12-10",
        description:
            "Competitive floorball league bringing together university teams from across Kenya.",
        image: "/images/tournaments/university-league.jpg",
    },

    2: {
        id: 2,
        name: "Central Kenya Floorball League",
        shortName: "CKFL",
        season: "2026 Season",
        location: "Central Kenya",
        status: "Active",
        teams: 8,
        matches: 28,
        completedMatches: 18,
        startDate: "2026-09-01",
        endDate: "2026-12-05",
        description:
            "Regional floorball competition featuring clubs and institutions from Central Kenya.",
        image: "/images/tournaments/central-league.jpg",
    },

    3: {
        id: 3,
        name: "Kenya Schools Floorball League",
        shortName: "KSFL",
        season: "2026 Season",
        location: "Kenya",
        status: "Registration Open",
        teams: 18,
        matches: 0,
        completedMatches: 0,
        startDate: "2026-10-01",
        endDate: "2027-02-20",
        description:
            "A school-level competition designed to grow youth floorball across Kenya.",
        image: "/images/tournaments/schools-league.jpg",
    },

    4: {
        id: 4,
        name: "Nairobi Floorball League",
        shortName: "NFL",
        season: "2026 Season",
        location: "Nairobi",
        status: "Upcoming",
        teams: 10,
        matches: 0,
        completedMatches: 0,
        startDate: "2026-11-05",
        endDate: "2027-02-15",
        description:
            "Competitive league for floorball clubs and recreational teams in Nairobi.",
        image: "/images/tournaments/nairobi-league.jpg",
    },
};

const mockTeams = [
    {
        id: 1,
        name: "DeKUT Black Talons",
        shortName: "DBT",
        location: "Nyeri",
        played: 8,
        wins: 6,
        draws: 1,
        losses: 1,
        goalsFor: 31,
        goalsAgainst: 14,
        points: 19,
        logo: "/images/teams/logos/dekut-black-talons.png",
    },
    {
        id: 2,
        name: "Karatina Blazers",
        shortName: "KB",
        location: "Karatina",
        played: 8,
        wins: 5,
        draws: 2,
        losses: 1,
        goalsFor: 27,
        goalsAgainst: 15,
        points: 17,
        logo: "/images/teams/logos/karatina-blazers.png",
    },
    {
        id: 3,
        name: "Chuka Warriors",
        shortName: "CW",
        location: "Chuka",
        played: 8,
        wins: 4,
        draws: 2,
        losses: 2,
        goalsFor: 24,
        goalsAgainst: 18,
        points: 14,
        logo: "/images/teams/logos/chuka-warriors.png",
    },
    {
        id: 4,
        name: "SEKU Eagles",
        shortName: "SEKU",
        location: "Kitui",
        played: 8,
        wins: 3,
        draws: 2,
        losses: 3,
        goalsFor: 20,
        goalsAgainst: 20,
        points: 11,
        logo: "/images/teams/logos/seku-eagles.png",
    },
    {
        id: 5,
        name: "Nyandarua Panthers",
        shortName: "NP",
        location: "Nyandarua",
        played: 8,
        wins: 2,
        draws: 1,
        losses: 5,
        goalsFor: 16,
        goalsAgainst: 25,
        points: 7,
        logo: "/images/teams/logos/nyandarua-panthers.png",
    },
];

const mockFixtures = [
    {
        id: 1,
        date: "2026-09-20",
        time: "14:00",
        home: "DeKUT Black Talons",
        away: "Chuka Warriors",
        venue: "DeKUT Sports Grounds",
        status: "Upcoming",
    },
    {
        id: 2,
        date: "2026-09-21",
        time: "16:00",
        home: "Karatina Blazers",
        away: "SEKU Eagles",
        venue: "Karatina University",
        status: "Upcoming",
    },
    {
        id: 3,
        date: "2026-09-27",
        time: "13:00",
        home: "Nyandarua Panthers",
        away: "DeKUT Black Talons",
        venue: "Nyandarua Sports Centre",
        status: "Upcoming",
    },
];

const mockResults = [
    {
        id: 101,
        date: "2026-09-13",
        home: "DeKUT Black Talons",
        away: "Karatina Blazers",
        homeScore: 5,
        awayScore: 2,
        venue: "DeKUT Sports Grounds",
    },
    {
        id: 102,
        date: "2026-09-12",
        home: "Chuka Warriors",
        away: "SEKU Eagles",
        homeScore: 3,
        awayScore: 3,
        venue: "Chuka University",
    },
    {
        id: 103,
        date: "2026-09-06",
        home: "Karatina Blazers",
        away: "Nyandarua Panthers",
        homeScore: 4,
        awayScore: 1,
        venue: "Karatina University",
    },
];

const mockTopPlayers = [
    {
        id: 1,
        name: "Victor Macharia",
        team: "DeKUT Black Talons",
        goals: 12,
        assists: 8,
        points: 20,
    },
    {
        id: 2,
        name: "Brian Kiptoo",
        team: "Karatina Blazers",
        goals: 10,
        assists: 7,
        points: 17,
    },
    {
        id: 3,
        name: "James Mwangi",
        team: "Chuka Warriors",
        goals: 8,
        assists: 6,
        points: 14,
    },
    {
        id: 4,
        name: "Daniel Kimani",
        team: "SEKU Eagles",
        goals: 7,
        assists: 5,
        points: 12,
    },
];

function formatDate(dateString) {
    if (!dateString) return "TBA";

    return new Date(dateString).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getStatusClass(status) {
    switch (status) {
        case "Active":
            return "sports-status active";

        case "Registration Open":
            return "sports-status registration";

        case "Upcoming":
            return "sports-status upcoming";

        case "Completed":
            return "sports-status completed";

        default:
            return "sports-status";
    }
}

export default function LeagueDetails() {
    const { id } = useParams();

    const league =
        mockLeagues[id] || mockLeagues[1];

    const [activeTab, setActiveTab] = useState("overview");

    const sortedTeams = useMemo(() => {
        return [...mockTeams].sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            const goalDifferenceA =
                a.goalsFor - a.goalsAgainst;

            const goalDifferenceB =
                b.goalsFor - b.goalsAgainst;

            return goalDifferenceB - goalDifferenceA;
        });
    }, []);

    return (
        <main className="sports-page league-details-page">

            {/* HERO */}
            <section className="sports-detail-hero">

                <div className="public-container">

                    <Link
                        to="/leagues"
                        className="sports-back-link"
                    >
                        <ArrowLeft size={16} />
                        Back to Leagues
                    </Link>

                    <div className="sports-detail-hero-content">

                        <div className="sports-detail-image">
                            <img
                                src={league.image}
                                alt={league.name}
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";
                                }}
                            />

                            <div className="sports-detail-image-fallback">
                                <Trophy size={60} />
                            </div>
                        </div>

                        <div className="sports-detail-info">

                            <span
                                className={getStatusClass(
                                    league.status
                                )}
                            >
                                {league.status}
                            </span>

                            <div className="sports-card-kicker">
                                {league.shortName} · {league.season}
                            </div>

                            <h1>{league.name}</h1>

                            <p>
                                {league.description}
                            </p>

                            <div className="sports-detail-meta">

                                <span>
                                    <MapPin size={16} />
                                    {league.location}
                                </span>

                                <span>
                                    <CalendarDays size={16} />
                                    {formatDate(
                                        league.startDate
                                    )}
                                    {" – "}
                                    {formatDate(
                                        league.endDate
                                    )}
                                </span>

                            </div>

                        </div>

                    </div>
                </div>
            </section>

            {/* QUICK STATS */}
            <section className="sports-detail-stats-section">
                <div className="public-container">

                    <div className="sports-detail-stats">

                        <div className="sports-detail-stat">
                            <div className="sports-detail-stat-icon">
                                <Users size={21} />
                            </div>

                            <div>
                                <strong>{league.teams}</strong>
                                <span>Teams</span>
                            </div>
                        </div>

                        <div className="sports-detail-stat">
                            <div className="sports-detail-stat-icon">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <strong>{league.matches}</strong>
                                <span>Total Matches</span>
                            </div>
                        </div>

                        <div className="sports-detail-stat">
                            <div className="sports-detail-stat-icon">
                                <Trophy size={21} />
                            </div>

                            <div>
                                <strong>
                                    {league.completedMatches}
                                </strong>
                                <span>Completed</span>
                            </div>
                        </div>

                        <div className="sports-detail-stat">
                            <div className="sports-detail-stat-icon">
                                <BarChart3 size={21} />
                            </div>

                            <div>
                                <strong>
                                    {league.matches -
                                        league.completedMatches}
                                </strong>
                                <span>Remaining</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* NAVIGATION */}
            <section className="sports-tabs-section">
                <div className="public-container">

                    <div className="sports-tabs">

                        <button
                            type="button"
                            className={
                                activeTab === "overview"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("overview")
                            }
                        >
                            Overview
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "teams"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("teams")
                            }
                        >
                            Teams
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "standings"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("standings")
                            }
                        >
                            Standings
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "fixtures"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("fixtures")
                            }
                        >
                            Fixtures
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "results"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("results")
                            }
                        >
                            Results
                        </button>

                        <button
                            type="button"
                            className={
                                activeTab === "statistics"
                                    ? "sports-tab active"
                                    : "sports-tab"
                            }
                            onClick={() =>
                                setActiveTab("statistics")
                            }
                        >
                            Statistics
                        </button>

                    </div>

                </div>
            </section>

            {/* CONTENT */}
            <section className="public-section">
                <div className="public-container">

                    {/* OVERVIEW */}
                    {activeTab === "overview" && (
                        <div className="sports-overview-layout">

                            <div>

                                <div className="sports-content-card">

                                    <div className="sports-content-card-header">
                                        <div>
                                            <span className="public-eyebrow">
                                                League Overview
                                            </span>

                                            <h2>
                                                About the Competition
                                            </h2>
                                        </div>
                                    </div>

                                    <p>
                                        {league.description}
                                    </p>

                                    <p>
                                        Follow the latest fixtures,
                                        results, league standings,
                                        team performances and player
                                        statistics throughout the
                                        {` ${league.season}`}.
                                    </p>

                                </div>

                                <div className="sports-content-card">

                                    <div className="sports-content-card-header">

                                        <div>
                                            <span className="public-eyebrow">
                                                Recent Action
                                            </span>

                                            <h2>
                                                Latest Results
                                            </h2>
                                        </div>

                                        <button
                                            type="button"
                                            className="sports-inline-button"
                                            onClick={() =>
                                                setActiveTab("results")
                                            }
                                        >
                                            View All
                                            <ArrowRight size={15} />
                                        </button>

                                    </div>

                                    <div className="sports-results-list">

                                        {mockResults
                                            .slice(0, 3)
                                            .map((result) => (
                                                <Link
                                                    key={result.id}
                                                    to={`/matches/${result.id}`}
                                                    className="sports-result-row"
                                                >
                                                    <div className="sports-result-date">
                                                        {formatDate(
                                                            result.date
                                                        )}
                                                    </div>

                                                    <div className="sports-result-team home">
                                                        {result.home}
                                                    </div>

                                                    <div className="sports-result-score">
                                                        <strong>
                                                            {
                                                                result.homeScore
                                                            }
                                                        </strong>

                                                        <span>–</span>

                                                        <strong>
                                                            {
                                                                result.awayScore
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div className="sports-result-team">
                                                        {result.away}
                                                    </div>

                                                    <ChevronRight
                                                        size={17}
                                                        className="sports-result-arrow"
                                                    />
                                                </Link>
                                            ))}

                                    </div>

                                </div>

                            </div>

                            <aside>

                                <div className="sports-sidebar-card">

                                    <h3>League Information</h3>

                                    <div className="sports-info-list">

                                        <div>
                                            <CalendarDays size={17} />
                                            <span>
                                                <small>Season</small>
                                                {league.season}
                                            </span>
                                        </div>

                                        <div>
                                            <MapPin size={17} />
                                            <span>
                                                <small>Location</small>
                                                {league.location}
                                            </span>
                                        </div>

                                        <div>
                                            <Users size={17} />
                                            <span>
                                                <small>Teams</small>
                                                {league.teams}
                                            </span>
                                        </div>

                                        <div>
                                            <Trophy size={17} />
                                            <span>
                                                <small>Status</small>
                                                {league.status}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                <div className="sports-sidebar-card">

                                    <h3>Upcoming Fixtures</h3>

                                    {mockFixtures
                                        .slice(0, 2)
                                        .map((fixture) => (
                                            <Link
                                                key={fixture.id}
                                                to={`/matches/${fixture.id}`}
                                                className="sports-sidebar-fixture"
                                            >
                                                <div>
                                                    <strong>
                                                        {fixture.home}
                                                    </strong>

                                                    <span>vs</span>

                                                    <strong>
                                                        {fixture.away}
                                                    </strong>
                                                </div>

                                                <small>
                                                    {formatDate(
                                                        fixture.date
                                                    )}{" "}
                                                    · {fixture.time}
                                                </small>
                                            </Link>
                                        ))}

                                </div>

                            </aside>

                        </div>
                    )}

                    {/* TEAMS */}
                    {activeTab === "teams" && (
                        <div>

                            <div className="sports-section-heading">
                                <div>
                                    <span className="public-eyebrow">
                                        Participating Teams
                                    </span>

                                    <h2>
                                        Teams in {league.shortName}
                                    </h2>

                                    <p>
                                        Explore the teams competing in
                                        this league.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-team-grid">

                                {mockTeams.map((team) => (
                                    <Link
                                        key={team.id}
                                        to={`/teams/${team.id}`}
                                        className="sports-team-card"
                                    >

                                        <div className="sports-team-logo">

                                            <img
                                                src={team.logo}
                                                alt={team.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />

                                            <Shield size={30} />
                                        </div>

                                        <div>
                                            <h3>{team.name}</h3>

                                            <span>
                                                {team.location}
                                            </span>
                                        </div>

                                        <ArrowRight size={17} />

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* STANDINGS */}
                    {activeTab === "standings" && (
                        <div>

                            <div className="sports-section-heading">
                                <div>
                                    <span className="public-eyebrow">
                                        League Table
                                    </span>

                                    <h2>
                                        {league.shortName} Standings
                                    </h2>

                                    <p>
                                        Current standings based on
                                        recorded match results.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-table-card">

                                <div className="sports-table-wrapper">

                                    <table className="sports-table">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Team</th>
                                                <th>P</th>
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

                                            {sortedTeams.map(
                                                (team, index) => (
                                                    <tr key={team.id}>

                                                        <td>
                                                            <span
                                                                className={
                                                                    index <
                                                                    3
                                                                        ? "sports-position top"
                                                                        : "sports-position"
                                                                }
                                                            >
                                                                {index + 1}
                                                            </span>
                                                        </td>

                                                        <td>
                                                            <Link
                                                                to={`/teams/${team.id}`}
                                                                className="sports-table-team"
                                                            >
                                                                <span className="sports-mini-logo">
                                                                    {team.shortName.charAt(
                                                                        0
                                                                    )}
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        team.name
                                                                    }
                                                                </strong>
                                                            </Link>
                                                        </td>

                                                        <td>
                                                            {
                                                                team.played
                                                            }
                                                        </td>

                                                        <td>
                                                            {team.wins}
                                                        </td>

                                                        <td>
                                                            {team.draws}
                                                        </td>

                                                        <td>
                                                            {team.losses}
                                                        </td>

                                                        <td>
                                                            {
                                                                team.goalsFor
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                team.goalsAgainst
                                                            }
                                                        </td>

                                                        <td>
                                                            {team.goalsFor -
                                                                team.goalsAgainst >
                                                            0
                                                                ? `+${team.goalsFor -
                                                                    team.goalsAgainst}`
                                                                : team.goalsFor -
                                                                  team.goalsAgainst}
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {
                                                                    team.points
                                                                }
                                                            </strong>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* FIXTURES */}
                    {activeTab === "fixtures" && (
                        <div>

                            <div className="sports-section-heading">
                                <div>
                                    <span className="public-eyebrow">
                                        Upcoming Matches
                                    </span>

                                    <h2>
                                        League Fixtures
                                    </h2>

                                    <p>
                                        Upcoming matches scheduled for
                                        the competition.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-fixtures-list">

                                {mockFixtures.map((fixture) => (
                                    <Link
                                        key={fixture.id}
                                        to={`/matches/${fixture.id}`}
                                        className="sports-fixture-card"
                                    >

                                        <div className="sports-fixture-date">
                                            <strong>
                                                {new Date(
                                                    fixture.date
                                                ).getDate()}
                                            </strong>

                                            <span>
                                                {new Date(
                                                    fixture.date
                                                ).toLocaleDateString(
                                                    "en-KE",
                                                    {
                                                        month: "short",
                                                    }
                                                )}
                                            </span>
                                        </div>

                                        <div className="sports-fixture-teams">

                                            <div>
                                                <strong>
                                                    {fixture.home}
                                                </strong>

                                                <span>Home</span>
                                            </div>

                                            <span className="sports-vs">
                                                VS
                                            </span>

                                            <div>
                                                <strong>
                                                    {fixture.away}
                                                </strong>

                                                <span>Away</span>
                                            </div>

                                        </div>

                                        <div className="sports-fixture-info">

                                            <span>
                                                <Clock size={15} />
                                                {fixture.time}
                                            </span>

                                            <span>
                                                <MapPin size={15} />
                                                {fixture.venue}
                                            </span>

                                        </div>

                                        <ArrowRight size={18} />

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* RESULTS */}
                    {activeTab === "results" && (
                        <div>

                            <div className="sports-section-heading">
                                <div>
                                    <span className="public-eyebrow">
                                        Completed Matches
                                    </span>

                                    <h2>
                                        League Results
                                    </h2>

                                    <p>
                                        Recent completed matches and
                                        final scores.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-results-full">

                                {mockResults.map((result) => (
                                    <Link
                                        key={result.id}
                                        to={`/matches/${result.id}`}
                                        className="sports-full-result"
                                    >

                                        <div className="sports-full-result-date">
                                            <CalendarDays size={16} />
                                            {formatDate(result.date)}
                                        </div>

                                        <div className="sports-full-result-team">
                                            <strong>
                                                {result.home}
                                            </strong>
                                        </div>

                                        <div className="sports-full-result-score">
                                            <span>
                                                {result.homeScore}
                                            </span>

                                            <small>FT</small>

                                            <span>
                                                {result.awayScore}
                                            </span>
                                        </div>

                                        <div className="sports-full-result-team away">
                                            <strong>
                                                {result.away}
                                            </strong>
                                        </div>

                                        <div className="sports-full-result-venue">
                                            <MapPin size={14} />
                                            {result.venue}
                                        </div>

                                        <ChevronRight size={18} />

                                    </Link>
                                ))}

                            </div>

                        </div>
                    )}

                    {/* STATISTICS */}
                    {activeTab === "statistics" && (
                        <div>

                            <div className="sports-section-heading">
                                <div>
                                    <span className="public-eyebrow">
                                        Competition Statistics
                                    </span>

                                    <h2>
                                        League Statistics
                                    </h2>

                                    <p>
                                        Top performers and key competition
                                        statistics.
                                    </p>
                                </div>
                            </div>

                            <div className="sports-stat-grid">

                                <div className="sports-stat-card">

                                    <div className="sports-stat-card-header">
                                        <div className="sports-stat-icon">
                                            <Target size={20} />
                                        </div>

                                        <span>Top Scorer</span>
                                    </div>

                                    <strong>
                                        {mockTopPlayers[0].name}
                                    </strong>

                                    <small>
                                        {mockTopPlayers[0].goals} goals
                                    </small>

                                </div>

                                <div className="sports-stat-card">

                                    <div className="sports-stat-card-header">
                                        <div className="sports-stat-icon">
                                            <Medal size={20} />
                                        </div>

                                        <span>Top Player</span>
                                    </div>

                                    <strong>
                                        {mockTopPlayers[0].name}
                                    </strong>

                                    <small>
                                        {mockTopPlayers[0].points} points
                                    </small>

                                </div>

                                <div className="sports-stat-card">

                                    <div className="sports-stat-card-header">
                                        <div className="sports-stat-icon">
                                            <Trophy size={20} />
                                        </div>

                                        <span>Leading Team</span>
                                    </div>

                                    <strong>
                                        {sortedTeams[0].name}
                                    </strong>

                                    <small>
                                        {sortedTeams[0].points} points
                                    </small>

                                </div>

                            </div>

                            <div className="sports-content-card sports-player-stats-card">

                                <div className="sports-content-card-header">
                                    <div>
                                        <span className="public-eyebrow">
                                            Player Performance
                                        </span>

                                        <h2>
                                            Top Players
                                        </h2>
                                    </div>
                                </div>

                                <div className="sports-table-wrapper">

                                    <table className="sports-table">

                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Player</th>
                                                <th>Team</th>
                                                <th>Goals</th>
                                                <th>Assists</th>
                                                <th>Points</th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {mockTopPlayers.map(
                                                (player, index) => (
                                                    <tr
                                                        key={player.id}
                                                    >

                                                        <td>
                                                            {index + 1}
                                                        </td>

                                                        <td>
                                                            <Link
                                                                to={`/players/${player.id}`}
                                                                className="sports-table-player"
                                                            >
                                                                <span className="sports-player-avatar">
                                                                    {player.name
                                                                        .split(
                                                                            " "
                                                                        )
                                                                        .map(
                                                                            (
                                                                                word
                                                                            ) =>
                                                                                word.charAt(
                                                                                    0
                                                                                )
                                                                        )
                                                                        .join(
                                                                            ""
                                                                        )}
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        player.name
                                                                    }
                                                                </strong>
                                                            </Link>
                                                        </td>

                                                        <td>
                                                            {
                                                                player.team
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                player.goals
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                player.assists
                                                            }
                                                        </td>

                                                        <td>
                                                            <strong>
                                                                {
                                                                    player.points
                                                                }
                                                            </strong>
                                                        </td>

                                                    </tr>
                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>
                    )}

                </div>
            </section>

        </main>
    );
}
