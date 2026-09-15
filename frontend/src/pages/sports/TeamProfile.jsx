import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Trophy,
    Users,
    CalendarDays,
    MapPin,
    Target,
    Shield,
    Activity,
    BarChart3,
    Award,
    Clock,
    ChevronRight,
} from "lucide-react";

const mockTeams = {
    1: {
        id: 1,
        name: "DeKUT Black Talons",
        shortName: "Black Talons",
        location: "Nyeri, Kenya",
        homeGround: "DeKUT Sports Ground",
        founded: "2024",
        status: "Active",
        league: "Kenya University Floorball League",
        leagueId: 1,
        logo: "/images/teams/logos/dekut-black-talons.png",
        cover: "/images/teams/team-photos/dekut-black-talons.jpg",
        description:
            "DeKUT Black Talons is the official floorball team representing Dedan Kimathi University of Technology. The club competes in university and national floorball competitions.",
        manager: "Black Talons Coaching Staff",
        contact: "blacktalons@floorballkenya.com",
        stats: {
            played: 14,
            wins: 10,
            draws: 2,
            losses: 2,
            goalsFor: 61,
            goalsAgainst: 31,
            points: 32,
        },
        players: [
            {
                id: 1,
                name: "Victor Macharia",
                position: "Forward",
                number: 9,
                goals: 18,
                assists: 11,
                photo: "/images/players/profile-photos/player-1.jpg",
            },
            {
                id: 10,
                name: "Allan Kimani",
                position: "Defender",
                number: 8,
                goals: 5,
                assists: 10,
                photo: "/images/players/profile-photos/player-10.jpg",
            },
            {
                id: 13,
                name: "Peter Mwangi",
                position: "Forward",
                number: 12,
                goals: 9,
                assists: 7,
                photo: "/images/players/profile-photos/player-13.jpg",
            },
            {
                id: 14,
                name: "John Kariuki",
                position: "Defender",
                number: 6,
                goals: 3,
                assists: 6,
                photo: "/images/players/profile-photos/player-14.jpg",
            },
            {
                id: 15,
                name: "Eric Maina",
                position: "Goalkeeper",
                number: 30,
                goals: 0,
                assists: 1,
                photo: "/images/players/profile-photos/player-15.jpg",
            },
        ],
        fixtures: [
            {
                id: 1,
                opponent: "Chuka Warriors",
                opponentId: 3,
                home: true,
                date: "21 Sep 2026",
                time: "16:00",
                venue: "DeKUT Sports Ground",
                status: "Upcoming",
            },
            {
                id: 4,
                opponent: "SEKU Eagles",
                opponentId: 4,
                home: false,
                date: "28 Sep 2026",
                time: "15:00",
                venue: "SEKU Sports Ground",
                status: "Upcoming",
            },
            {
                id: 5,
                opponent: "Nairobi Floorball Club",
                opponentId: 7,
                home: true,
                date: "05 Oct 2026",
                time: "14:00",
                venue: "DeKUT Sports Ground",
                status: "Upcoming",
            },
        ],
        results: [
            {
                id: 6,
                opponent: "Karatina Blazers",
                opponentId: 2,
                home: true,
                score: "5–2",
                result: "W",
                date: "14 Sep 2026",
            },
            {
                id: 7,
                opponent: "SEKU Eagles",
                opponentId: 4,
                home: false,
                score: "3–3",
                result: "D",
                date: "07 Sep 2026",
            },
            {
                id: 8,
                opponent: "Nyandarua Panthers",
                opponentId: 5,
                home: true,
                score: "6–1",
                result: "W",
                date: "31 Aug 2026",
            },
            {
                id: 9,
                opponent: "Chuka Warriors",
                opponentId: 3,
                home: false,
                score: "4–2",
                result: "W",
                date: "24 Aug 2026",
            },
        ],
    },

    2: {
        id: 2,
        name: "Karatina Blazers",
        shortName: "Blazers",
        location: "Karatina, Kenya",
        homeGround: "Karatina University Ground",
        founded: "2024",
        status: "Active",
        league: "Kenya University Floorball League",
        leagueId: 1,
        logo: "/images/teams/logos/karatina-blazers.png",
        cover: "/images/teams/team-photos/karatina-blazers.jpg",
        description:
            "Karatina Blazers are a competitive university floorball team based in Karatina and regular participants in regional competitions.",
        manager: "Karatina Blazers Coaching Staff",
        contact: "karatinablazers@floorballkenya.com",
        stats: {
            played: 14,
            wins: 8,
            draws: 1,
            losses: 5,
            goalsFor: 48,
            goalsAgainst: 42,
            points: 25,
        },
        players: [
            {
                id: 2,
                name: "Brian Kiptoo",
                position: "Defender",
                number: 4,
                goals: 4,
                assists: 8,
                photo: "/images/players/profile-photos/player-2.jpg",
            },
            {
                id: 11,
                name: "David Mutua",
                position: "Forward",
                number: 13,
                goals: 8,
                assists: 5,
                photo: "/images/players/profile-photos/player-11.jpg",
            },
        ],
        fixtures: [],
        results: [],
    },

    3: {
        id: 3,
        name: "Chuka Warriors",
        shortName: "Warriors",
        location: "Chuka, Kenya",
        homeGround: "Chuka University Ground",
        founded: "2025",
        status: "Active",
        league: "Kenya University Floorball League",
        leagueId: 1,
        logo: "/images/teams/logos/chuka-warriors.png",
        cover: "/images/teams/team-photos/chuka-warriors.jpg",
        description:
            "Chuka Warriors represent Chuka University and are part of the growing university floorball competition in Kenya.",
        manager: "Chuka Warriors Coaching Staff",
        contact: "chukawarriors@floorballkenya.com",
        stats: {
            played: 13,
            wins: 6,
            draws: 2,
            losses: 5,
            goalsFor: 39,
            goalsAgainst: 37,
            points: 20,
        },
        players: [
            {
                id: 3,
                name: "Daniel Mwangi",
                position: "Goalkeeper",
                number: 1,
                goals: 0,
                assists: 2,
                photo: "/images/players/profile-photos/player-3.jpg",
            },
        ],
        fixtures: [],
        results: [],
    },
};

const fallbackTeam = mockTeams[1];

const getInitials = (name) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

function TeamLogo({ team, className = "" }) {
    return (
        <div className={`team-profile-logo ${className}`}>
            {team.logo ? (
                <img
                    src={team.logo}
                    alt={team.name}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling.style.display =
                            "flex";
                    }}
                />
            ) : null}

            <span style={{ display: team.logo ? "none" : "flex" }}>
                {getInitials(team.name)}
            </span>
        </div>
    );
}

function PlayerMiniCard({ player }) {
    return (
        <Link
            to={`/players/${player.id}`}
            className="team-player-card"
        >
            <div className="team-player-photo">
                {player.photo ? (
                    <img
                        src={player.photo}
                        alt={player.name}
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                            event.currentTarget.nextElementSibling.style.display =
                                "flex";
                        }}
                    />
                ) : null}

                <span
                    style={{
                        display: player.photo ? "none" : "flex",
                    }}
                >
                    {getInitials(player.name)}
                </span>

                <b>#{player.number}</b>
            </div>

            <div className="team-player-info">
                <strong>{player.name}</strong>
                <span>{player.position}</span>
            </div>

            <div className="team-player-stats">
                <span>
                    <strong>{player.goals}</strong>
                    Goals
                </span>

                <span>
                    <strong>{player.assists}</strong>
                    Assists
                </span>
            </div>

            <ArrowRight size={17} />
        </Link>
    );
}

export default function TeamProfile() {
    const { id } = useParams();

    const team = mockTeams[id] || fallbackTeam;

    const [activeTab, setActiveTab] = useState("overview");

    const goalDifference =
        team.stats.goalsFor - team.stats.goalsAgainst;

    const winPercentage =
        team.stats.played > 0
            ? Math.round(
                  (team.stats.wins / team.stats.played) * 100
              )
            : 0;

    const sortedPlayers = useMemo(() => {
        return [...team.players].sort(
            (a, b) => b.goals - a.goals
        );
    }, [team.players]);

    const tabs = [
        {
            id: "overview",
            label: "Overview",
        },
        {
            id: "squad",
            label: "Squad",
        },
        {
            id: "fixtures",
            label: "Fixtures",
        },
        {
            id: "results",
            label: "Results",
        },
        {
            id: "statistics",
            label: "Statistics",
        },
    ];

    return (
        <main className="sports-page team-profile-page">

            {/* Back */}
            <div className="sports-container">
                <Link
                    to="/teams"
                    className="sports-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Teams
                </Link>
            </div>

            {/* Team Hero */}
            <section className="team-profile-hero">

                <div className="team-profile-cover">
                    {team.cover ? (
                        <img
                            src={team.cover}
                            alt=""
                            onError={(event) => {
                                event.currentTarget.style.display =
                                    "none";
                            }}
                        />
                    ) : null}

                    <div className="team-profile-cover-overlay" />
                </div>

                <div className="sports-container">

                    <div className="team-profile-hero-content">

                        <TeamLogo team={team} className="large" />

                        <div className="team-profile-main-info">

                            <div className="team-profile-badges">
                                <span className="sports-status active">
                                    {team.status}
                                </span>

                                <span className="team-profile-competition">
                                    {team.league}
                                </span>
                            </div>

                            <h1>{team.name}</h1>

                            <p>
                                {team.description}
                            </p>

                            <div className="team-profile-meta">

                                <span>
                                    <MapPin size={16} />
                                    {team.location}
                                </span>

                                <span>
                                    <Shield size={16} />
                                    Founded {team.founded}
                                </span>

                                <span>
                                    <Users size={16} />
                                    {team.stats.played} matches
                                </span>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Team Quick Stats */}
            <section className="team-profile-stats-section">

                <div className="sports-container">

                    <div className="team-profile-stat-grid">

                        <div className="team-profile-stat">
                            <div className="team-profile-stat-icon">
                                <Trophy size={20} />
                            </div>

                            <div>
                                <span>League Points</span>
                                <strong>{team.stats.points}</strong>
                            </div>
                        </div>

                        <div className="team-profile-stat">
                            <div className="team-profile-stat-icon">
                                <Award size={20} />
                            </div>

                            <div>
                                <span>Wins</span>
                                <strong>{team.stats.wins}</strong>
                            </div>
                        </div>

                        <div className="team-profile-stat">
                            <div className="team-profile-stat-icon">
                                <Target size={20} />
                            </div>

                            <div>
                                <span>Goals Scored</span>
                                <strong>{team.stats.goalsFor}</strong>
                            </div>
                        </div>

                        <div className="team-profile-stat">
                            <div className="team-profile-stat-icon">
                                <Activity size={20} />
                            </div>

                            <div>
                                <span>Goal Difference</span>
                                <strong>
                                    {goalDifference > 0
                                        ? `+${goalDifference}`
                                        : goalDifference}
                                </strong>
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* Tabs */}
            <section className="team-profile-tabs-section">

                <div className="sports-container">

                    <nav className="team-profile-tabs">

                        {tabs.map((tab) => (
                            <button
                                type="button"
                                key={tab.id}
                                className={
                                    activeTab === tab.id
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setActiveTab(tab.id)
                                }
                            >
                                {tab.label}
                            </button>
                        ))}

                    </nav>

                </div>

            </section>

            {/* Content */}
            <section className="team-profile-content-section">

                <div className="sports-container">

                    <div className="team-profile-layout">

                        {/* Main */}
                        <div className="team-profile-main">

                            {/* Overview */}
                            {activeTab === "overview" && (
                                <>
                                    <section className="team-profile-card">

                                        <div className="team-profile-card-header">
                                            <div>
                                                <span className="sports-eyebrow">
                                                    Team Overview
                                                </span>
                                                <h2>
                                                    {team.name}
                                                </h2>
                                            </div>

                                            <Shield size={22} />
                                        </div>

                                        <p className="team-profile-description">
                                            {team.description}
                                        </p>

                                        <div className="team-information-grid">

                                            <div>
                                                <span>Home Ground</span>
                                                <strong>
                                                    {team.homeGround}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Location</span>
                                                <strong>
                                                    {team.location}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Founded</span>
                                                <strong>
                                                    {team.founded}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Competition</span>
                                                <strong>
                                                    {team.league}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Team Manager</span>
                                                <strong>
                                                    {team.manager}
                                                </strong>
                                            </div>

                                            <div>
                                                <span>Status</span>
                                                <strong>
                                                    {team.status}
                                                </strong>
                                            </div>

                                        </div>

                                    </section>

                                    {/* Recent Results */}
                                    <section className="team-profile-card">

                                        <div className="team-profile-card-header">

                                            <div>
                                                <span className="sports-eyebrow">
                                                    Match History
                                                </span>

                                                <h2>
                                                    Recent Results
                                                </h2>
                                            </div>

                                            <Link
                                                to={`/leagues/${team.leagueId}`}
                                                className="sports-card-link"
                                            >
                                                View League
                                                <ArrowRight size={15} />
                                            </Link>

                                        </div>

                                        <div className="team-results-list">

                                            {team.results
                                                .slice(0, 4)
                                                .map((result) => (
                                                    <Link
                                                        to={`/matches/${result.id}`}
                                                        className="team-result-row"
                                                        key={result.id}
                                                    >
                                                        <div className="team-result-date">
                                                            <CalendarDays
                                                                size={15}
                                                            />
                                                            {result.date}
                                                        </div>

                                                        <div className="team-result-opponent">
                                                            <span>
                                                                {result.home
                                                                    ? "vs"
                                                                    : "at"}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    result.opponent
                                                                }
                                                            </strong>
                                                        </div>

                                                        <strong className="team-result-score">
                                                            {result.score}
                                                        </strong>

                                                        <span
                                                            className={`team-result-badge ${result.result.toLowerCase()}`}
                                                        >
                                                            {result.result}
                                                        </span>

                                                        <ChevronRight
                                                            size={17}
                                                        />
                                                    </Link>
                                                ))}

                                        </div>

                                    </section>

                                    {/* Top Players */}
                                    <section className="team-profile-card">

                                        <div className="team-profile-card-header">

                                            <div>
                                                <span className="sports-eyebrow">
                                                    Team Leaders
                                                </span>

                                                <h2>
                                                    Top Players
                                                </h2>
                                            </div>

                                            <Users size={22} />

                                        </div>

                                        <div className="team-player-list">

                                            {sortedPlayers
                                                .slice(0, 4)
                                                .map((player) => (
                                                    <PlayerMiniCard
                                                        player={player}
                                                        key={player.id}
                                                    />
                                                ))}

                                        </div>

                                    </section>
                                </>
                            )}

                            {/* Squad */}
                            {activeTab === "squad" && (
                                <section className="team-profile-card">

                                    <div className="team-profile-card-header">

                                        <div>
                                            <span className="sports-eyebrow">
                                                Team Squad
                                            </span>

                                            <h2>
                                                Players
                                            </h2>
                                        </div>

                                        <Users size={22} />

                                    </div>

                                    <div className="team-player-list">

                                        {sortedPlayers.map(
                                            (player) => (
                                                <PlayerMiniCard
                                                    player={player}
                                                    key={player.id}
                                                />
                                            )
                                        )}

                                    </div>

                                </section>
                            )}

                            {/* Fixtures */}
                            {activeTab === "fixtures" && (
                                <section className="team-profile-card">

                                    <div className="team-profile-card-header">

                                        <div>
                                            <span className="sports-eyebrow">
                                                Upcoming Matches
                                            </span>

                                            <h2>
                                                Fixtures
                                            </h2>
                                        </div>

                                        <CalendarDays size={22} />

                                    </div>

                                    {team.fixtures.length > 0 ? (
                                        <div className="team-fixtures-list">

                                            {team.fixtures.map(
                                                (fixture) => (
                                                    <div
                                                        className="team-fixture-row"
                                                        key={fixture.id}
                                                    >

                                                        <div className="team-fixture-date">
                                                            <CalendarDays
                                                                size={16}
                                                            />

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        fixture.date
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        fixture.time
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="team-fixture-opponent">

                                                            <span>
                                                                {fixture.home
                                                                    ? "HOME"
                                                                    : "AWAY"}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    fixture.opponent
                                                                }
                                                            </strong>

                                                        </div>

                                                        <div className="team-fixture-venue">
                                                            <MapPin
                                                                size={15}
                                                            />

                                                            {
                                                                fixture.venue
                                                            }
                                                        </div>

                                                        <Link
                                                            to={`/matches/${fixture.id}`}
                                                            className="icon-btn"
                                                        >
                                                            <ArrowRight
                                                                size={17}
                                                            />
                                                        </Link>

                                                    </div>
                                                )
                                            )}

                                        </div>
                                    ) : (
                                        <div className="sports-empty-state">
                                            <CalendarDays size={32} />
                                            <h3>
                                                No upcoming fixtures
                                            </h3>
                                            <p>
                                                New fixtures will appear
                                                here once they are
                                                published.
                                            </p>
                                        </div>
                                    )}

                                </section>
                            )}

                            {/* Results */}
                            {activeTab === "results" && (
                                <section className="team-profile-card">

                                    <div className="team-profile-card-header">

                                        <div>
                                            <span className="sports-eyebrow">
                                                Match History
                                            </span>

                                            <h2>
                                                Results
                                            </h2>
                                        </div>

                                        <Trophy size={22} />

                                    </div>

                                    {team.results.length > 0 ? (
                                        <div className="team-results-list">

                                            {team.results.map(
                                                (result) => (
                                                    <Link
                                                        to={`/matches/${result.id}`}
                                                        className="team-result-row"
                                                        key={result.id}
                                                    >

                                                        <div className="team-result-date">
                                                            <CalendarDays
                                                                size={15}
                                                            />
                                                            {
                                                                result.date
                                                            }
                                                        </div>

                                                        <div className="team-result-opponent">
                                                            <span>
                                                                {result.home
                                                                    ? "vs"
                                                                    : "at"}
                                                            </span>

                                                            <strong>
                                                                {
                                                                    result.opponent
                                                                }
                                                            </strong>
                                                        </div>

                                                        <strong className="team-result-score">
                                                            {
                                                                result.score
                                                            }
                                                        </strong>

                                                        <span
                                                            className={`team-result-badge ${result.result.toLowerCase()}`}
                                                        >
                                                            {
                                                                result.result
                                                            }
                                                        </span>

                                                        <ChevronRight
                                                            size={17}
                                                        />

                                                    </Link>
                                                )
                                            )}

                                        </div>
                                    ) : (
                                        <div className="sports-empty-state">
                                            <Trophy size={32} />
                                            <h3>
                                                No results available
                                            </h3>
                                            <p>
                                                Completed matches will
                                                appear here.
                                            </p>
                                        </div>
                                    )}

                                </section>
                            )}

                            {/* Statistics */}
                            {activeTab === "statistics" && (
                                <section className="team-profile-card">

                                    <div className="team-profile-card-header">

                                        <div>
                                            <span className="sports-eyebrow">
                                                Season Performance
                                            </span>

                                            <h2>
                                                Team Statistics
                                            </h2>
                                        </div>

                                        <BarChart3 size={22} />

                                    </div>

                                    <div className="team-statistics-grid">

                                        <div className="team-statistics-item">
                                            <span>
                                                Matches Played
                                            </span>
                                            <strong>
                                                {team.stats.played}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>Wins</span>
                                            <strong>
                                                {team.stats.wins}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>Draws</span>
                                            <strong>
                                                {team.stats.draws}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>Losses</span>
                                            <strong>
                                                {team.stats.losses}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>
                                                Goals For
                                            </span>
                                            <strong>
                                                {team.stats.goalsFor}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>
                                                Goals Against
                                            </span>
                                            <strong>
                                                {team.stats.goalsAgainst}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>
                                                Goal Difference
                                            </span>
                                            <strong>
                                                {goalDifference > 0
                                                    ? `+${goalDifference}`
                                                    : goalDifference}
                                            </strong>
                                        </div>

                                        <div className="team-statistics-item">
                                            <span>
                                                Win Percentage
                                            </span>
                                            <strong>
                                                {winPercentage}%
                                            </strong>
                                        </div>

                                    </div>

                                    {/* Performance Bars */}
                                    <div className="team-performance-section">

                                        <h3>
                                            Performance Overview
                                        </h3>

                                        <div className="team-performance-row">

                                            <div>
                                                <span>
                                                    Wins
                                                </span>

                                                <strong>
                                                    {team.stats.wins}
                                                </strong>
                                            </div>

                                            <div className="team-performance-bar">
                                                <span
                                                    style={{
                                                        width: `${Math.min(
                                                            winPercentage,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>

                                        <div className="team-performance-row">

                                            <div>
                                                <span>
                                                    Goals Scored
                                                </span>

                                                <strong>
                                                    {team.stats.goalsFor}
                                                </strong>
                                            </div>

                                            <div className="team-performance-bar">
                                                <span
                                                    style={{
                                                        width: `${Math.min(
                                                            team.stats
                                                                .goalsFor /
                                                                0.8,
                                                            100
                                                        )}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>

                                    </div>

                                </section>
                            )}

                        </div>

                        {/* Sidebar */}
                        <aside className="team-profile-sidebar">

                            {/* Team Card */}
                            <div className="team-sidebar-card">

                                <div className="team-sidebar-logo-wrapper">
                                    <TeamLogo team={team} />
                                </div>

                                <h3>{team.name}</h3>

                                <span className="team-sidebar-location">
                                    <MapPin size={14} />
                                    {team.location}
                                </span>

                                <Link
                                    to={`/leagues/${team.leagueId}`}
                                    className="team-sidebar-competition"
                                >
                                    <Trophy size={17} />

                                    <div>
                                        <span>Competition</span>
                                        <strong>
                                            {team.league}
                                        </strong>
                                    </div>

                                    <ArrowRight size={16} />
                                </Link>

                            </div>

                            {/* Season Record */}
                            <div className="team-sidebar-card">

                                <div className="team-sidebar-card-header">
                                    <span>Season Record</span>
                                    <Activity size={18} />
                                </div>

                                <div className="team-record">

                                    <div>
                                        <strong>
                                            {team.stats.wins}
                                        </strong>
                                        <span>Wins</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {team.stats.draws}
                                        </strong>
                                        <span>Draws</span>
                                    </div>

                                    <div>
                                        <strong>
                                            {team.stats.losses}
                                        </strong>
                                        <span>Losses</span>
                                    </div>

                                </div>

                            </div>

                            {/* Team Information */}
                            <div className="team-sidebar-card">

                                <div className="team-sidebar-card-header">
                                    <span>Team Information</span>
                                    <Shield size={18} />
                                </div>

                                <div className="team-sidebar-information">

                                    <div>
                                        <span>Home Ground</span>
                                        <strong>
                                            {team.homeGround}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Founded</span>
                                        <strong>
                                            {team.founded}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Manager</span>
                                        <strong>
                                            {team.manager}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* Quick Links */}
                            <div className="team-sidebar-card">

                                <div className="team-sidebar-card-header">
                                    <span>Quick Links</span>
                                    <ChevronRight size={18} />
                                </div>

                                <div className="team-sidebar-links">

                                    <Link to="/players">
                                        <Users size={16} />
                                        All Players
                                        <ArrowRight size={14} />
                                    </Link>

                                    <Link to="/teams">
                                        <Shield size={16} />
                                        All Teams
                                        <ArrowRight size={14} />
                                    </Link>

                                    <Link
                                        to={`/leagues/${team.leagueId}`}
                                    >
                                        <Trophy size={16} />
                                        League
                                        <ArrowRight size={14} />
                                    </Link>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="sports-cta">

                <div className="sports-container">

                    <div className="sports-cta-content">

                        <div>
                            <span className="sports-eyebrow">
                                Kenyan Floorball
                            </span>

                            <h2>
                                Follow {team.name}.
                            </h2>

                            <p>
                                Stay updated with fixtures, results,
                                players and performances throughout the
                                season.
                            </p>
                        </div>

                        <div className="sports-cta-actions">

                            <Link
                                to={`/leagues/${team.leagueId}`}
                                className="btn btn-primary"
                            >
                                View League
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/teams"
                                className="btn btn-secondary"
                            >
                                Browse Teams
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}