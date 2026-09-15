import React from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    MapPin,
    Trophy,
    Users,
    Target,
    Shield,
    Activity,
    Award,
    BarChart3,
    UserRound,
} from "lucide-react";

const mockPlayers = {
    1: {
        id: 1,
        name: "Victor Macharia",
        position: "Forward",
        jerseyNumber: 9,
        team: {
            id: 1,
            name: "DeKUT Black Talons",
            location: "Nyeri",
            logo: "/images/teams/logos/dekut-black-talons.png",
        },
        photo: "/images/players/profile-photos/player-1.jpg",
        nationality: "Kenya",
        age: 21,
        dateOfBirth: "12 May 2005",
        height: "178 cm",
        joined: "2024",
        status: "Active",
        bio: "A versatile attacking player known for pace, movement and finishing around the goal.",
        stats: {
            appearances: 14,
            goals: 18,
            assists: 11,
            points: 29,
            penaltyMinutes: 4,
            shots: 46,
        },
        achievements: [
            "KUFL 2025/26 Champion",
            "Top 5 Scorer — KUFL 2025/26",
            "DeKUT Player of the Month — March 2026",
        ],
        recentMatches: [
            {
                id: 1,
                opponent: "Chuka Warriors",
                result: "W",
                score: "5–2",
                goals: 2,
                assists: 1,
                date: "14 Sep 2026",
            },
            {
                id: 2,
                opponent: "Karatina Blazers",
                result: "W",
                score: "4–1",
                goals: 1,
                assists: 2,
                date: "07 Sep 2026",
            },
            {
                id: 3,
                opponent: "SEKU Eagles",
                result: "D",
                score: "3–3",
                goals: 1,
                assists: 0,
                date: "31 Aug 2026",
            },
        ],
    },

    2: {
        id: 2,
        name: "Brian Kiptoo",
        position: "Defender",
        jerseyNumber: 4,
        team: {
            id: 2,
            name: "Karatina Blazers",
            location: "Karatina",
            logo: "/images/teams/logos/karatina-blazers.png",
        },
        photo: "/images/players/profile-photos/player-2.jpg",
        nationality: "Kenya",
        age: 22,
        dateOfBirth: "20 January 2004",
        height: "181 cm",
        joined: "2025",
        status: "Active",
        bio: "A composed defender who combines strong positioning with accurate passing.",
        stats: {
            appearances: 12,
            goals: 4,
            assists: 8,
            points: 12,
            penaltyMinutes: 6,
            shots: 22,
        },
        achievements: [
            "Karatina Blazers Defensive Player of the Year",
            "KUFL 2025/26 Semi-Finalist",
        ],
        recentMatches: [],
    },

    3: {
        id: 3,
        name: "Daniel Mwangi",
        position: "Goalkeeper",
        jerseyNumber: 1,
        team: {
            id: 3,
            name: "Chuka Warriors",
            location: "Chuka",
            logo: "/images/teams/logos/chuka-warriors.png",
        },
        photo: "/images/players/profile-photos/player-3.jpg",
        nationality: "Kenya",
        age: 23,
        dateOfBirth: "05 February 2003",
        height: "185 cm",
        joined: "2024",
        status: "Active",
        bio: "A reliable goalkeeper with strong reflexes and excellent communication from the back.",
        stats: {
            appearances: 13,
            goals: 0,
            assists: 2,
            points: 2,
            penaltyMinutes: 0,
            shots: 0,
        },
        achievements: [
            "Best Goalkeeper — Chuka Invitational 2025",
            "KUFL 2025/26 Goalkeeping Award Nominee",
        ],
        recentMatches: [],
    },
};

const getPlayer = (id) => {
    return mockPlayers[id] || mockPlayers[1];
};

const getInitials = (name) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

function StatCard({ icon: Icon, label, value, description }) {
    return (
        <div className="player-stat-card">
            <div className="player-stat-icon">
                <Icon size={20} />
            </div>

            <div className="player-stat-content">
                <span>{label}</span>
                <strong>{value}</strong>

                {description && (
                    <small>{description}</small>
                )}
            </div>
        </div>
    );
}

export default function PlayerProfile() {
    const { id } = useParams();

    const player = getPlayer(id);

    const goalsPerGame =
        player.stats.appearances > 0
            ? (player.stats.goals / player.stats.appearances).toFixed(2)
            : "0.00";

    const pointsPerGame =
        player.stats.appearances > 0
            ? (player.stats.points / player.stats.appearances).toFixed(2)
            : "0.00";

    return (
        <main className="sports-page player-profile-page">

            {/* Back Navigation */}
            <div className="sports-container">
                <Link to="/players" className="sports-back-link">
                    <ArrowLeft size={17} />
                    Back to Players
                </Link>
            </div>

            {/* Player Hero */}
            <section className="player-profile-hero">
                <div className="sports-container">

                    <div className="player-profile-hero-content">

                        <div className="player-profile-photo-wrapper">
                            {player.photo ? (
                                <img
                                    src={player.photo}
                                    alt={player.name}
                                    className="player-profile-photo"
                                    onError={(event) => {
                                        event.currentTarget.style.display = "none";
                                        event.currentTarget.nextElementSibling.style.display = "flex";
                                    }}
                                />
                            ) : null}

                            <div
                                className="player-profile-photo-fallback"
                                style={{
                                    display: player.photo ? "none" : "flex",
                                }}
                            >
                                {getInitials(player.name)}
                            </div>

                            <span className="player-profile-number">
                                #{player.jerseyNumber}
                            </span>
                        </div>

                        <div className="player-profile-hero-info">

                            <div className="player-profile-status">
                                <span className="sports-status active">
                                    {player.status}
                                </span>

                                <span className="player-profile-position">
                                    {player.position}
                                </span>
                            </div>

                            <h1>{player.name}</h1>

                            <Link
                                to={`/teams/${player.team.id}`}
                                className="player-profile-team"
                            >
                                <span className="player-team-logo">
                                    {player.team.logo ? (
                                        <img
                                            src={player.team.logo}
                                            alt={player.team.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <Shield size={18} />
                                    )}
                                </span>

                                <span>
                                    <small>Plays for</small>
                                    <strong>{player.team.name}</strong>
                                </span>

                                <ArrowRight size={17} />
                            </Link>

                            <div className="player-profile-location">
                                <MapPin size={16} />
                                {player.team.location}, {player.nationality}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Quick Statistics */}
            <section className="player-profile-stats-section">
                <div className="sports-container">

                    <div className="sports-section-header">
                        <div>
                            <span className="sports-eyebrow">
                                Season Performance
                            </span>

                            <h2>Player Statistics</h2>
                        </div>
                    </div>

                    <div className="player-stats-grid">

                        <StatCard
                            icon={Activity}
                            label="Appearances"
                            value={player.stats.appearances}
                            description="Matches played"
                        />

                        <StatCard
                            icon={Target}
                            label="Goals"
                            value={player.stats.goals}
                            description={`${goalsPerGame} per game`}
                        />

                        <StatCard
                            icon={Users}
                            label="Assists"
                            value={player.stats.assists}
                            description="Goal assists"
                        />

                        <StatCard
                            icon={Award}
                            label="Points"
                            value={player.stats.points}
                            description={`${pointsPerGame} per game`}
                        />

                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="player-profile-content-section">
                <div className="sports-container">

                    <div className="player-profile-layout">

                        {/* Main Column */}
                        <div className="player-profile-main">

                            {/* About */}
                            <section className="player-profile-card">

                                <div className="player-profile-card-header">
                                    <div>
                                        <span className="sports-eyebrow">
                                            Player Profile
                                        </span>
                                        <h2>About {player.name}</h2>
                                    </div>

                                    <UserRound size={22} />
                                </div>

                                <p className="player-profile-bio">
                                    {player.bio}
                                </p>

                                <div className="player-information-grid">

                                    <div className="player-information-item">
                                        <span>Position</span>
                                        <strong>{player.position}</strong>
                                    </div>

                                    <div className="player-information-item">
                                        <span>Jersey Number</span>
                                        <strong>#{player.jerseyNumber}</strong>
                                    </div>

                                    <div className="player-information-item">
                                        <span>Date of Birth</span>
                                        <strong>{player.dateOfBirth}</strong>
                                    </div>

                                    <div className="player-information-item">
                                        <span>Age</span>
                                        <strong>{player.age} years</strong>
                                    </div>

                                    <div className="player-information-item">
                                        <span>Height</span>
                                        <strong>{player.height}</strong>
                                    </div>

                                    <div className="player-information-item">
                                        <span>Joined Team</span>
                                        <strong>{player.joined}</strong>
                                    </div>

                                </div>

                            </section>

                            {/* Performance */}
                            <section className="player-profile-card">

                                <div className="player-profile-card-header">
                                    <div>
                                        <span className="sports-eyebrow">
                                            Performance
                                        </span>
                                        <h2>Season Breakdown</h2>
                                    </div>

                                    <BarChart3 size={22} />
                                </div>

                                <div className="player-performance-list">

                                    <div className="player-performance-row">
                                        <div>
                                            <span>Goals</span>
                                            <strong>{player.stats.goals}</strong>
                                        </div>

                                        <div className="player-performance-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        player.stats.goals * 4,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="player-performance-row">
                                        <div>
                                            <span>Assists</span>
                                            <strong>{player.stats.assists}</strong>
                                        </div>

                                        <div className="player-performance-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        player.stats.assists * 5,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="player-performance-row">
                                        <div>
                                            <span>Points</span>
                                            <strong>{player.stats.points}</strong>
                                        </div>

                                        <div className="player-performance-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        player.stats.points * 3,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="player-performance-row">
                                        <div>
                                            <span>Shots</span>
                                            <strong>{player.stats.shots}</strong>
                                        </div>

                                        <div className="player-performance-bar">
                                            <span
                                                style={{
                                                    width: `${Math.min(
                                                        player.stats.shots * 2,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                </div>

                            </section>

                            {/* Recent Matches */}
                            <section className="player-profile-card">

                                <div className="player-profile-card-header">
                                    <div>
                                        <span className="sports-eyebrow">
                                            Match History
                                        </span>
                                        <h2>Recent Matches</h2>
                                    </div>

                                    <CalendarDays size={22} />
                                </div>

                                {player.recentMatches.length > 0 ? (
                                    <div className="player-recent-matches">

                                        {player.recentMatches.map((match) => (
                                            <div
                                                className="player-recent-match"
                                                key={match.id}
                                            >
                                                <div className="player-match-date">
                                                    <CalendarDays size={15} />
                                                    {match.date}
                                                </div>

                                                <div className="player-match-opponent">
                                                    <span>vs</span>
                                                    <strong>
                                                        {match.opponent}
                                                    </strong>
                                                </div>

                                                <div className="player-match-result">
                                                    <span
                                                        className={`player-result-badge ${match.result.toLowerCase()}`}
                                                    >
                                                        {match.result}
                                                    </span>

                                                    <strong>{match.score}</strong>
                                                </div>

                                                <div className="player-match-contribution">
                                                    <span>
                                                        <Target size={14} />
                                                        {match.goals} Goals
                                                    </span>

                                                    <span>
                                                        <Users size={14} />
                                                        {match.assists} Assists
                                                    </span>
                                                </div>

                                                <Link
                                                    to={`/matches/${match.id}`}
                                                    className="icon-btn"
                                                    aria-label="View match"
                                                >
                                                    <ArrowRight size={17} />
                                                </Link>
                                            </div>
                                        ))}

                                    </div>
                                ) : (
                                    <div className="sports-empty-state">
                                        <CalendarDays size={28} />
                                        <h3>No recent matches</h3>
                                        <p>
                                            Match performance will appear here
                                            when this player has recorded
                                            appearances.
                                        </p>
                                    </div>
                                )}

                            </section>

                            {/* Achievements */}
                            <section className="player-profile-card">

                                <div className="player-profile-card-header">
                                    <div>
                                        <span className="sports-eyebrow">
                                            Highlights
                                        </span>
                                        <h2>Achievements</h2>
                                    </div>

                                    <Trophy size={22} />
                                </div>

                                <div className="player-achievements">

                                    {player.achievements.map(
                                        (achievement, index) => (
                                            <div
                                                className="player-achievement"
                                                key={index}
                                            >
                                                <div className="player-achievement-icon">
                                                    <Trophy size={18} />
                                                </div>

                                                <span>{achievement}</span>
                                            </div>
                                        )
                                    )}

                                </div>

                            </section>

                        </div>

                        {/* Sidebar */}
                        <aside className="player-profile-sidebar">

                            {/* Team */}
                            <div className="player-sidebar-card">

                                <div className="player-sidebar-card-header">
                                    <span>Current Team</span>
                                    <Users size={18} />
                                </div>

                                <Link
                                    to={`/teams/${player.team.id}`}
                                    className="player-current-team"
                                >
                                    <div className="player-current-team-logo">
                                        {player.team.logo ? (
                                            <img
                                                src={player.team.logo}
                                                alt={player.team.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <Shield size={28} />
                                        )}
                                    </div>

                                    <strong>{player.team.name}</strong>

                                    <span>
                                        {player.team.location}
                                    </span>

                                    <div className="player-team-link">
                                        View Team
                                        <ArrowRight size={15} />
                                    </div>
                                </Link>

                            </div>

                            {/* Additional Stats */}
                            <div className="player-sidebar-card">

                                <div className="player-sidebar-card-header">
                                    <span>Additional Stats</span>
                                    <Activity size={18} />
                                </div>

                                <div className="player-sidebar-stat-list">

                                    <div>
                                        <span>Shots</span>
                                        <strong>
                                            {player.stats.shots}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Penalty Minutes</span>
                                        <strong>
                                            {player.stats.penaltyMinutes}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Goals / Game</span>
                                        <strong>
                                            {goalsPerGame}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Points / Game</span>
                                        <strong>
                                            {pointsPerGame}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            {/* Competition */}
                            <div className="player-sidebar-card">

                                <div className="player-sidebar-card-header">
                                    <span>Competition</span>
                                    <Trophy size={18} />
                                </div>

                                <div className="player-competition">

                                    <div className="player-competition-icon">
                                        <Trophy size={22} />
                                    </div>

                                    <div>
                                        <strong>
                                            Kenya University Floorball League
                                        </strong>

                                        <span>
                                            2025/26 Season
                                        </span>
                                    </div>

                                </div>

                                <Link
                                    to="/leagues/1"
                                    className="player-sidebar-link"
                                >
                                    View Competition
                                    <ArrowRight size={15} />
                                </Link>

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
                                Follow the competition
                            </span>

                            <h2>
                                Explore more players and teams.
                            </h2>

                            <p>
                                Discover Kenyan floorball talent, teams,
                                competitions and match results.
                            </p>
                        </div>

                        <div className="sports-cta-actions">
                            <Link
                                to="/players"
                                className="btn btn-primary"
                            >
                                Browse Players
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