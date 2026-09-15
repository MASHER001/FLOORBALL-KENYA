import React from "react";
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
    CircleDot,
    Flag,
    UserRound,
    Activity,
} from "lucide-react";

const mockMatches = {
    1: {
        id: 1,
        competition: "Kenya University Floorball League",
        competitionShort: "KUFL",
        competitionType: "League",

        date: "2026-09-20",
        time: "14:00",
        status: "Upcoming",

        venue: "DeKUT Sports Grounds",
        city: "Nyeri",
        referee: "Peter Mwangi",

        homeTeam: {
            id: 1,
            name: "DeKUT Black Talons",
            shortName: "DBT",
            location: "Nyeri",
            logo: "/images/teams/logos/dekut-black-talons.png",
            score: null,
        },

        awayTeam: {
            id: 3,
            name: "Chuka Warriors",
            shortName: "CW",
            location: "Chuka",
            logo: "/images/teams/logos/chuka-warriors.png",
            score: null,
        },

        events: [],

        statistics: {
            possession: [52, 48],
            shots: [21, 17],
            shotsOnTarget: [14, 11],
            penalties: [2, 3],
            powerPlays: [3, 2],
        },
    },

    2: {
        id: 2,
        competition: "Kenya University Floorball League",
        competitionShort: "KUFL",
        competitionType: "League",

        date: "2026-09-13",
        time: "15:00",
        status: "Completed",

        venue: "DeKUT Sports Grounds",
        city: "Nyeri",
        referee: "James Njoroge",

        homeTeam: {
            id: 1,
            name: "DeKUT Black Talons",
            shortName: "DBT",
            location: "Nyeri",
            logo: "/images/teams/logos/dekut-black-talons.png",
            score: 5,
        },

        awayTeam: {
            id: 2,
            name: "Karatina Blazers",
            shortName: "KB",
            location: "Karatina",
            logo: "/images/teams/logos/karatina-blazers.png",
            score: 2,
        },

        events: [
            {
                id: 1,
                minute: "04:20",
                type: "goal",
                team: "DeKUT Black Talons",
                player: "Victor Macharia",
                description: "Goal",
            },
            {
                id: 2,
                minute: "11:45",
                type: "goal",
                team: "Karatina Blazers",
                player: "Brian Kiptoo",
                description: "Goal",
            },
            {
                id: 3,
                minute: "18:10",
                type: "goal",
                team: "DeKUT Black Talons",
                player: "Kevin Maina",
                description: "Goal",
            },
            {
                id: 4,
                minute: "27:32",
                type: "penalty",
                team: "Karatina Blazers",
                player: "Daniel Kimani",
                description: "2-minute penalty",
            },
            {
                id: 5,
                minute: "31:20",
                type: "goal",
                team: "DeKUT Black Talons",
                player: "Victor Macharia",
                description: "Goal",
            },
            {
                id: 6,
                minute: "38:05",
                type: "goal",
                team: "DeKUT Black Talons",
                player: "Brian Otieno",
                description: "Goal",
            },
            {
                id: 7,
                minute: "44:15",
                type: "goal",
                team: "Karatina Blazers",
                player: "Brian Kiptoo",
                description: "Goal",
            },
            {
                id: 8,
                minute: "55:40",
                type: "goal",
                team: "DeKUT Black Talons",
                player: "Victor Macharia",
                description: "Goal",
            },
        ],

        statistics: {
            possession: [55, 45],
            shots: [29, 21],
            shotsOnTarget: [19, 13],
            penalties: [1, 3],
            powerPlays: [4, 2],
        },
    },

    3: {
        id: 3,
        competition: "Central Kenya Floorball League",
        competitionShort: "CKFL",
        competitionType: "League",

        date: "2026-09-12",
        time: "16:00",
        status: "Completed",

        venue: "Chuka University",
        city: "Chuka",
        referee: "David Kamau",

        homeTeam: {
            id: 3,
            name: "Chuka Warriors",
            shortName: "CW",
            location: "Chuka",
            logo: "/images/teams/logos/chuka-warriors.png",
            score: 3,
        },

        awayTeam: {
            id: 4,
            name: "SEKU Eagles",
            shortName: "SEKU",
            location: "Kitui",
            logo: "/images/teams/logos/seku-eagles.png",
            score: 3,
        },

        events: [
            {
                id: 1,
                minute: "07:20",
                type: "goal",
                team: "Chuka Warriors",
                player: "James Mwangi",
                description: "Goal",
            },
            {
                id: 2,
                minute: "19:42",
                type: "goal",
                team: "SEKU Eagles",
                player: "Daniel Kimani",
                description: "Goal",
            },
            {
                id: 3,
                minute: "31:10",
                type: "goal",
                team: "Chuka Warriors",
                player: "Samuel Kariuki",
                description: "Goal",
            },
            {
                id: 4,
                minute: "40:15",
                type: "goal",
                team: "SEKU Eagles",
                player: "David Mutua",
                description: "Goal",
            },
            {
                id: 5,
                minute: "48:22",
                type: "goal",
                team: "Chuka Warriors",
                player: "James Mwangi",
                description: "Goal",
            },
            {
                id: 6,
                minute: "56:30",
                type: "goal",
                team: "SEKU Eagles",
                player: "Daniel Kimani",
                description: "Goal",
            },
        ],

        statistics: {
            possession: [50, 50],
            shots: [22, 22],
            shotsOnTarget: [14, 14],
            penalties: [2, 2],
            powerPlays: [2, 2],
        },
    },
};

function formatDate(dateString) {
    if (!dateString) return "TBA";

    return new Date(dateString).toLocaleDateString("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function getEventIcon(type) {
    switch (type) {
        case "goal":
            return <Target size={17} />;

        case "penalty":
            return <Flag size={17} />;

        default:
            return <CircleDot size={17} />;
    }
}

export default function MatchDetails() {
    const { id } = useParams();

    const match =
        mockMatches[id] || mockMatches[2];

    const isCompleted = match.status === "Completed";

    return (
        <main className="sports-page match-details-page">

            {/* HERO / SCOREBOARD */}
            <section className="match-hero">

                <div className="public-container">

                    <Link
                        to={
                            match.competitionType === "Tournament"
                                ? "/tournaments"
                                : "/leagues"
                        }
                        className="sports-back-link"
                    >
                        <ArrowLeft size={16} />
                        Back to Competition
                    </Link>

                    <div className="match-competition">

                        <Trophy size={17} />

                        <Link
                            to={
                                match.competitionType === "Tournament"
                                    ? `/tournaments/${match.competitionShort}`
                                    : `/leagues/${match.competitionShort}`
                            }
                        >
                            {match.competition}
                        </Link>

                    </div>

                    <div className="match-scoreboard">

                        {/* HOME TEAM */}
                        <div className="match-team match-home-team">

                            <div className="match-team-logo">

                                <img
                                    src={match.homeTeam.logo}
                                    alt={match.homeTeam.name}
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                                <Shield size={42} />
                            </div>

                            <Link
                                to={`/teams/${match.homeTeam.id}`}
                                className="match-team-name"
                            >
                                {match.homeTeam.name}
                            </Link>

                            <span className="match-team-location">
                                {match.homeTeam.location}
                            </span>

                        </div>

                        {/* SCORE */}
                        <div className="match-score-center">

                            <span
                                className={
                                    isCompleted
                                        ? "match-status completed"
                                        : "match-status upcoming"
                                }
                            >
                                {match.status}
                            </span>

                            <div className="match-score">

                                <strong>
                                    {match.homeTeam.score ?? "-"}
                                </strong>

                                <span>:</span>

                                <strong>
                                    {match.awayTeam.score ?? "-"}
                                </strong>

                            </div>

                            <div className="match-date-time">

                                <span>
                                    <CalendarDays size={15} />
                                    {formatDate(match.date)}
                                </span>

                                <span>
                                    <Clock size={15} />
                                    {match.time}
                                </span>

                            </div>

                        </div>

                        {/* AWAY TEAM */}
                        <div className="match-team match-away-team">

                            <div className="match-team-logo">

                                <img
                                    src={match.awayTeam.logo}
                                    alt={match.awayTeam.name}
                                    onError={(event) => {
                                        event.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                                <Shield size={42} />
                            </div>

                            <Link
                                to={`/teams/${match.awayTeam.id}`}
                                className="match-team-name"
                            >
                                {match.awayTeam.name}
                            </Link>

                            <span className="match-team-location">
                                {match.awayTeam.location}
                            </span>

                        </div>

                    </div>

                </div>
            </section>

            {/* MATCH INFORMATION */}
            <section className="match-info-section">

                <div className="public-container">

                    <div className="match-info-grid">

                        <div className="match-info-item">
                            <MapPin size={19} />

                            <div>
                                <small>Venue</small>
                                <strong>
                                    {match.venue}
                                </strong>
                                <span>
                                    {match.city}
                                </span>
                            </div>
                        </div>

                        <div className="match-info-item">
                            <CalendarDays size={19} />

                            <div>
                                <small>Date</small>
                                <strong>
                                    {formatDate(match.date)}
                                </strong>
                            </div>
                        </div>

                        <div className="match-info-item">
                            <Clock size={19} />

                            <div>
                                <small>Kick-off</small>
                                <strong>
                                    {match.time}
                                </strong>
                            </div>
                        </div>

                        <div className="match-info-item">
                            <UserRound size={19} />

                            <div>
                                <small>Referee</small>
                                <strong>
                                    {match.referee}
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* MAIN CONTENT */}
            <section className="public-section">

                <div className="public-container">

                    <div className="match-content-layout">

                        {/* LEFT */}
                        <div>

                            {/* MATCH EVENTS */}
                            <div className="sports-content-card">

                                <div className="sports-content-card-header">

                                    <div>
                                        <span className="public-eyebrow">
                                            {isCompleted
                                                ? "Match Timeline"
                                                : "Match Information"}
                                        </span>

                                        <h2>
                                            {isCompleted
                                                ? "Match Events"
                                                : "Match Preview"}
                                        </h2>
                                    </div>

                                </div>

                                {isCompleted ? (

                                    match.events.length > 0 ? (
                                        <div className="match-events">

                                            {match.events.map(
                                                (event) => (
                                                    <div
                                                        className="match-event"
                                                        key={event.id}
                                                    >

                                                        <div className="match-event-time">
                                                            {event.minute}
                                                        </div>

                                                        <div
                                                            className={
                                                                event.type ===
                                                                "goal"
                                                                    ? "match-event-icon goal"
                                                                    : "match-event-icon penalty"
                                                            }
                                                        >
                                                            {getEventIcon(
                                                                event.type
                                                            )}
                                                        </div>

                                                        <div className="match-event-content">

                                                            <strong>
                                                                {
                                                                    event.description
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    event.player
                                                                }
                                                            </span>

                                                            <small>
                                                                {
                                                                    event.team
                                                                }
                                                            </small>

                                                        </div>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    ) : (
                                        <div className="public-empty-state">
                                            <Activity size={36} />
                                            <h3>
                                                No events recorded
                                            </h3>
                                            <p>
                                                Match events have not
                                                been added yet.
                                            </p>
                                        </div>
                                    )

                                ) : (

                                    <div className="match-preview">

                                        <div className="match-preview-icon">
                                            <Clock size={30} />
                                        </div>

                                        <h3>
                                            Match scheduled
                                        </h3>

                                        <p>
                                            {match.homeTeam.name} will
                                            face {match.awayTeam.name}
                                            on {formatDate(match.date)}
                                            at {match.time}.
                                        </p>

                                        <span>
                                            <MapPin size={15} />
                                            {match.venue}
                                        </span>

                                    </div>

                                )}

                            </div>

                            {/* MATCH STATISTICS */}
                            <div className="sports-content-card">

                                <div className="sports-content-card-header">

                                    <div>
                                        <span className="public-eyebrow">
                                            Match Performance
                                        </span>

                                        <h2>
                                            Match Statistics
                                        </h2>
                                    </div>

                                </div>

                                <div className="match-statistics">

                                    {/* POSSESSION */}
                                    <div className="match-stat-row">

                                        <div className="match-stat-values">
                                            <strong>
                                                {
                                                    match.statistics
                                                        .possession[0]
                                                }
                                                %
                                            </strong>

                                            <span>
                                                Possession
                                            </span>

                                            <strong>
                                                {
                                                    match.statistics
                                                        .possession[1]
                                                }
                                                %
                                            </strong>
                                        </div>

                                        <div className="match-stat-bar">

                                            <div
                                                style={{
                                                    width: `${match.statistics.possession[0]}%`,
                                                }}
                                            />

                                        </div>

                                        <div className="match-stat-labels">
                                            <span>
                                                {match.homeTeam.shortName}
                                            </span>

                                            <span>
                                                {match.awayTeam.shortName}
                                            </span>
                                        </div>

                                    </div>

                                    {/* SHOTS */}
                                    <div className="match-stat-row">

                                        <div className="match-stat-values">
                                            <strong>
                                                {
                                                    match.statistics
                                                        .shots[0]
                                                }
                                            </strong>

                                            <span>
                                                Shots
                                            </span>

                                            <strong>
                                                {
                                                    match.statistics
                                                        .shots[1]
                                                }
                                            </strong>
                                        </div>

                                        <div className="match-stat-bar">

                                            <div
                                                style={{
                                                    width: `${
                                                        (match.statistics
                                                            .shots[0] /
                                                            (match.statistics
                                                                .shots[0] +
                                                                match.statistics
                                                                    .shots[1])) *
                                                        100
                                                    }%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* SHOTS ON TARGET */}
                                    <div className="match-stat-row">

                                        <div className="match-stat-values">
                                            <strong>
                                                {
                                                    match.statistics
                                                        .shotsOnTarget[0]
                                                }
                                            </strong>

                                            <span>
                                                Shots on Target
                                            </span>

                                            <strong>
                                                {
                                                    match.statistics
                                                        .shotsOnTarget[1]
                                                }
                                            </strong>
                                        </div>

                                        <div className="match-stat-bar">

                                            <div
                                                style={{
                                                    width: `${
                                                        (match.statistics
                                                            .shotsOnTarget[0] /
                                                            (match.statistics
                                                                .shotsOnTarget[0] +
                                                                match.statistics
                                                                    .shotsOnTarget[1])) *
                                                        100
                                                    }%`,
                                                }}
                                            />

                                        </div>

                                    </div>

                                    {/* PENALTIES */}
                                    <div className="match-stat-row">

                                        <div className="match-stat-values">
                                            <strong>
                                                {
                                                    match.statistics
                                                        .penalties[0]
                                                }
                                            </strong>

                                            <span>
                                                Penalties
                                            </span>

                                            <strong>
                                                {
                                                    match.statistics
                                                        .penalties[1]
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                    {/* POWER PLAYS */}
                                    <div className="match-stat-row">

                                        <div className="match-stat-values">
                                            <strong>
                                                {
                                                    match.statistics
                                                        .powerPlays[0]
                                                }
                                            </strong>

                                            <span>
                                                Power Plays
                                            </span>

                                            <strong>
                                                {
                                                    match.statistics
                                                        .powerPlays[1]
                                                }
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDEBAR */}
                        <aside>

                            {/* COMPETITION */}
                            <div className="sports-sidebar-card">

                                <h3>Competition</h3>

                                <Link
                                    to="/leagues/1"
                                    className="match-competition-card"
                                >

                                    <div className="match-competition-icon">
                                        <Trophy size={21} />
                                    </div>

                                    <div>
                                        <strong>
                                            {match.competition}
                                        </strong>

                                        <span>
                                            {match.competitionType}
                                        </span>
                                    </div>

                                    <ArrowRight size={17} />

                                </Link>

                            </div>

                            {/* TEAM LINKS */}
                            <div className="sports-sidebar-card">

                                <h3>Teams</h3>

                                <Link
                                    to={`/teams/${match.homeTeam.id}`}
                                    className="match-team-sidebar"
                                >

                                    <div className="match-sidebar-team-logo">
                                        <Shield size={19} />
                                    </div>

                                    <div>
                                        <strong>
                                            {match.homeTeam.name}
                                        </strong>

                                        <span>
                                            {match.homeTeam.location}
                                        </span>
                                    </div>

                                    <ArrowRight size={16} />

                                </Link>

                                <Link
                                    to={`/teams/${match.awayTeam.id}`}
                                    className="match-team-sidebar"
                                >

                                    <div className="match-sidebar-team-logo">
                                        <Shield size={19} />
                                    </div>

                                    <div>
                                        <strong>
                                            {match.awayTeam.name}
                                        </strong>

                                        <span>
                                            {match.awayTeam.location}
                                        </span>
                                    </div>

                                    <ArrowRight size={16} />

                                </Link>

                            </div>

                            {/* MATCH STATUS */}
                            <div className="sports-sidebar-card">

                                <h3>Match Status</h3>

                                <div className="match-status-card">

                                    <div
                                        className={
                                            isCompleted
                                                ? "match-status-dot completed"
                                                : "match-status-dot upcoming"
                                        }
                                    />

                                    <div>
                                        <strong>
                                            {match.status}
                                        </strong>

                                        <span>
                                            {isCompleted
                                                ? "Final result recorded"
                                                : "Awaiting kick-off"}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </section>

            {/* FOOTER CTA */}
            <section className="public-cta">

                <div className="public-container">

                    <div className="public-cta-card">

                        <Users
                            size={38}
                            style={{
                                marginBottom: "15px",
                            }}
                        />

                        <h2>
                            Follow the competition
                        </h2>

                        <p>
                            Explore league standings, teams, players,
                            fixtures and results on FloorballKenya.
                        </p>

                        <div className="sports-cta-actions">

                            <Link
                                to="/leagues"
                                className="btn btn-primary"
                            >
                                View Leagues
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/teams"
                                className="btn btn-secondary"
                            >
                                Explore Teams
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}

