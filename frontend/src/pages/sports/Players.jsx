import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    ArrowRight,
    MapPin,
    Shield,
    Target,
    Users,
    Trophy,
    X,
} from "lucide-react";

const mockPlayers = [
    {
        id: 1,
        name: "Victor Macharia",
        position: "Forward",
        jerseyNumber: 9,
        team: "DeKUT Black Talons",
        teamId: 1,
        location: "Nyeri",
        nationality: "Kenya",
        status: "Active",
        appearances: 14,
        goals: 18,
        assists: 11,
        points: 29,
        photo: "/images/players/profile-photos/player-1.jpg",
    },
    {
        id: 2,
        name: "Brian Kiptoo",
        position: "Defender",
        jerseyNumber: 4,
        team: "Karatina Blazers",
        teamId: 2,
        location: "Karatina",
        nationality: "Kenya",
        status: "Active",
        appearances: 12,
        goals: 4,
        assists: 8,
        points: 12,
        photo: "/images/players/profile-photos/player-2.jpg",
    },
    {
        id: 3,
        name: "Daniel Mwangi",
        position: "Goalkeeper",
        jerseyNumber: 1,
        team: "Chuka Warriors",
        teamId: 3,
        location: "Chuka",
        nationality: "Kenya",
        status: "Active",
        appearances: 13,
        goals: 0,
        assists: 2,
        points: 2,
        photo: "/images/players/profile-photos/player-3.jpg",
    },
    {
        id: 4,
        name: "Kevin Maina",
        position: "Forward",
        jerseyNumber: 11,
        team: "SEKU Eagles",
        teamId: 4,
        location: "Kitui",
        nationality: "Kenya",
        status: "Active",
        appearances: 15,
        goals: 15,
        assists: 9,
        points: 24,
        photo: "/images/players/profile-photos/player-4.jpg",
    },
    {
        id: 5,
        name: "Samuel Kariuki",
        position: "Defender",
        jerseyNumber: 6,
        team: "Nyandarua Panthers",
        teamId: 5,
        location: "Nyandarua",
        nationality: "Kenya",
        status: "Active",
        appearances: 11,
        goals: 3,
        assists: 6,
        points: 9,
        photo: "/images/players/profile-photos/player-5.jpg",
    },
    {
        id: 6,
        name: "Ian Njoroge",
        position: "Forward",
        jerseyNumber: 10,
        team: "Michuki Lions",
        teamId: 6,
        location: "Murang'a",
        nationality: "Kenya",
        status: "Active",
        appearances: 10,
        goals: 12,
        assists: 7,
        points: 19,
        photo: "/images/players/profile-photos/player-6.jpg",
    },
    {
        id: 7,
        name: "Collins Otieno",
        position: "Goalkeeper",
        jerseyNumber: 30,
        team: "Nairobi Floorball Club",
        teamId: 7,
        location: "Nairobi",
        nationality: "Kenya",
        status: "Active",
        appearances: 16,
        goals: 0,
        assists: 1,
        points: 1,
        photo: "/images/players/profile-photos/player-7.jpg",
    },
    {
        id: 8,
        name: "Mark Kiplangat",
        position: "Defender",
        jerseyNumber: 5,
        team: "Eldoret Strikers",
        teamId: 8,
        location: "Eldoret",
        nationality: "Kenya",
        status: "Inactive",
        appearances: 8,
        goals: 2,
        assists: 3,
        points: 5,
        photo: "/images/players/profile-photos/player-8.jpg",
    },
    {
        id: 9,
        name: "James Wambua",
        position: "Forward",
        jerseyNumber: 7,
        team: "Nairobi Floorball Club",
        teamId: 7,
        location: "Nairobi",
        nationality: "Kenya",
        status: "Active",
        appearances: 13,
        goals: 10,
        assists: 12,
        points: 22,
        photo: "/images/players/profile-photos/player-9.jpg",
    },
    {
        id: 10,
        name: "Allan Kimani",
        position: "Defender",
        jerseyNumber: 8,
        team: "DeKUT Black Talons",
        teamId: 1,
        location: "Nyeri",
        nationality: "Kenya",
        status: "Active",
        appearances: 14,
        goals: 5,
        assists: 10,
        points: 15,
        photo: "/images/players/profile-photos/player-10.jpg",
    },
    {
        id: 11,
        name: "David Mutua",
        position: "Forward",
        jerseyNumber: 13,
        team: "Karatina Blazers",
        teamId: 2,
        location: "Karatina",
        nationality: "Kenya",
        status: "Active",
        appearances: 9,
        goals: 8,
        assists: 5,
        points: 13,
        photo: "/images/players/profile-photos/player-11.jpg",
    },
    {
        id: 12,
        name: "Eric Kamau",
        position: "Goalkeeper",
        jerseyNumber: 31,
        team: "Nyandarua Panthers",
        teamId: 5,
        location: "Nyandarua",
        nationality: "Kenya",
        status: "Active",
        appearances: 12,
        goals: 0,
        assists: 1,
        points: 1,
        photo: "/images/players/profile-photos/player-12.jpg",
    },
];

const positions = [
    "All Positions",
    "Forward",
    "Defender",
    "Goalkeeper",
];

const teams = [
    "All Teams",
    "DeKUT Black Talons",
    "Karatina Blazers",
    "Chuka Warriors",
    "SEKU Eagles",
    "Nyandarua Panthers",
    "Michuki Lions",
    "Nairobi Floorball Club",
    "Eldoret Strikers",
];

const statuses = [
    "All Status",
    "Active",
    "Inactive",
];

const getInitials = (name) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

function PlayerCard({ player }) {
    return (
        <article className="sports-player-card">

            {/* Player Image */}
            <div className="sports-player-card-image">

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

                <div
                    className="sports-player-card-fallback"
                    style={{
                        display: player.photo ? "none" : "flex",
                    }}
                >
                    {getInitials(player.name)}
                </div>

                <span className="sports-player-number">
                    #{player.jerseyNumber}
                </span>

                <span
                    className={`sports-status ${
                        player.status.toLowerCase()
                    }`}
                >
                    {player.status}
                </span>

            </div>

            {/* Card Body */}
            <div className="sports-player-card-body">

                <div className="sports-player-position">
                    {player.position}
                </div>

                <h3>
                    <Link to={`/players/${player.id}`}>
                        {player.name}
                    </Link>
                </h3>

                <Link
                    to={`/teams/${player.teamId}`}
                    className="sports-player-team"
                >
                    <Shield size={15} />
                    {player.team}
                </Link>

                <div className="sports-player-location">
                    <MapPin size={14} />
                    {player.location}, {player.nationality}
                </div>

                {/* Player Stats */}
                <div className="sports-player-stats">

                    <div>
                        <strong>{player.appearances}</strong>
                        <span>Apps</span>
                    </div>

                    <div>
                        <strong>{player.goals}</strong>
                        <span>Goals</span>
                    </div>

                    <div>
                        <strong>{player.assists}</strong>
                        <span>Assists</span>
                    </div>

                    <div>
                        <strong>{player.points}</strong>
                        <span>Points</span>
                    </div>

                </div>

                <Link
                    to={`/players/${player.id}`}
                    className="sports-player-card-link"
                >
                    View Profile
                    <ArrowRight size={16} />
                </Link>

            </div>
        </article>
    );
}

export default function Players() {
    const [search, setSearch] = useState("");
    const [position, setPosition] = useState("All Positions");
    const [team, setTeam] = useState("All Teams");
    const [status, setStatus] = useState("All Status");
    const [showFilters, setShowFilters] = useState(false);

    const filteredPlayers = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return mockPlayers.filter((player) => {

            const matchesSearch =
                !searchTerm ||
                player.name.toLowerCase().includes(searchTerm) ||
                player.team.toLowerCase().includes(searchTerm) ||
                player.position.toLowerCase().includes(searchTerm);

            const matchesPosition =
                position === "All Positions" ||
                player.position === position;

            const matchesTeam =
                team === "All Teams" ||
                player.team === team;

            const matchesStatus =
                status === "All Status" ||
                player.status === status;

            return (
                matchesSearch &&
                matchesPosition &&
                matchesTeam &&
                matchesStatus
            );
        });
    }, [search, position, team, status]);

    const totalGoals = mockPlayers.reduce(
        (total, player) => total + player.goals,
        0
    );

    const totalAssists = mockPlayers.reduce(
        (total, player) => total + player.assists,
        0
    );

    const topScorer = [...mockPlayers].sort(
        (a, b) => b.goals - a.goals
    )[0];

    const topPlaymaker = [...mockPlayers].sort(
        (a, b) => b.assists - a.assists
    )[0];

    const clearFilters = () => {
        setSearch("");
        setPosition("All Positions");
        setTeam("All Teams");
        setStatus("All Status");
    };

    const hasActiveFilters =
        search ||
        position !== "All Positions" ||
        team !== "All Teams" ||
        status !== "All Status";

    return (
        <main className="sports-page players-page">

            {/* Hero */}
            <section className="sports-hero players-hero">
                <div className="sports-container">

                    <div className="sports-hero-content">

                        <span className="sports-eyebrow">
                            Player Directory
                        </span>

                        <h1>
                            Discover Kenyan
                            <span> Floorball Talent.</span>
                        </h1>

                        <p>
                            Explore player profiles, positions, teams,
                            statistics and performances from across the
                            Kenyan floorball community.
                        </p>

                    </div>

                </div>
            </section>

            {/* Main */}
            <section className="sports-section">

                <div className="sports-container">

                    {/* Page Header */}
                    <div className="sports-page-header">

                        <div>
                            <span className="sports-eyebrow">
                                Players
                            </span>

                            <h2>Player Directory</h2>

                            <p>
                                Browse registered floorball players and
                                discover their latest statistics.
                            </p>
                        </div>

                        <div className="sports-result-count">
                            <Users size={18} />
                            <strong>{filteredPlayers.length}</strong>
                            <span>players found</span>
                        </div>

                    </div>

                    {/* Player Highlights */}
                    <div className="players-highlight-grid">

                        <div className="players-highlight-card">
                            <div className="players-highlight-icon">
                                <Users size={21} />
                            </div>

                            <div>
                                <span>Registered Players</span>
                                <strong>{mockPlayers.length}</strong>
                            </div>
                        </div>

                        <div className="players-highlight-card">
                            <div className="players-highlight-icon">
                                <Target size={21} />
                            </div>

                            <div>
                                <span>Total Goals</span>
                                <strong>{totalGoals}</strong>
                            </div>
                        </div>

                        <div className="players-highlight-card">
                            <div className="players-highlight-icon">
                                <Users size={21} />
                            </div>

                            <div>
                                <span>Total Assists</span>
                                <strong>{totalAssists}</strong>
                            </div>
                        </div>

                        <div className="players-highlight-card">
                            <div className="players-highlight-icon">
                                <Trophy size={21} />
                            </div>

                            <div>
                                <span>Top Scorer</span>
                                <strong>{topScorer.name}</strong>
                                <small>
                                    {topScorer.goals} goals
                                </small>
                            </div>
                        </div>

                    </div>

                    {/* Search + Filters */}
                    <div className="sports-toolbar">

                        <div className="sports-search">

                            <Search size={19} />

                            <input
                                type="text"
                                placeholder="Search players, teams or positions..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="sports-search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>

                        <button
                            type="button"
                            className={`sports-filter-toggle ${
                                showFilters ? "active" : ""
                            }`}
                            onClick={() =>
                                setShowFilters(!showFilters)
                            }
                        >
                            <Filter size={17} />
                            Filters
                            <ChevronDown
                                size={16}
                                className={
                                    showFilters ? "rotate" : ""
                                }
                            />
                        </button>

                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="sports-filter-panel">

                            <div className="sports-filter-group">

                                <label htmlFor="player-position">
                                    Position
                                </label>

                                <select
                                    id="player-position"
                                    value={position}
                                    onChange={(event) =>
                                        setPosition(event.target.value)
                                    }
                                >
                                    {positions.map((item) => (
                                        <option
                                            value={item}
                                            key={item}
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="sports-filter-group">

                                <label htmlFor="player-team">
                                    Team
                                </label>

                                <select
                                    id="player-team"
                                    value={team}
                                    onChange={(event) =>
                                        setTeam(event.target.value)
                                    }
                                >
                                    {teams.map((item) => (
                                        <option
                                            value={item}
                                            key={item}
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="sports-filter-group">

                                <label htmlFor="player-status">
                                    Status
                                </label>

                                <select
                                    id="player-status"
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                >
                                    {statuses.map((item) => (
                                        <option
                                            value={item}
                                            key={item}
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="sports-clear-filters"
                                    onClick={clearFilters}
                                >
                                    <X size={15} />
                                    Clear Filters
                                </button>
                            )}

                        </div>
                    )}

                    {/* Active Filter Tags */}
                    {hasActiveFilters && (
                        <div className="sports-active-filters">

                            {search && (
                                <span>
                                    Search: "{search}"
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {position !== "All Positions" && (
                                <span>
                                    {position}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPosition("All Positions")
                                        }
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {team !== "All Teams" && (
                                <span>
                                    {team}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setTeam("All Teams")
                                        }
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {status !== "All Status" && (
                                <span>
                                    {status}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setStatus("All Status")
                                        }
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                        </div>
                    )}

                    {/* Players */}
                    {filteredPlayers.length > 0 ? (
                        <div className="sports-player-grid">

                            {filteredPlayers.map((player) => (
                                <PlayerCard
                                    player={player}
                                    key={player.id}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="sports-empty-state">

                            <Users size={36} />

                            <h3>No players found</h3>

                            <p>
                                We couldn't find any players matching
                                your current search or filters.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                </div>

            </section>

            {/* Top Players */}
            <section className="sports-section players-top-section">

                <div className="sports-container">

                    <div className="sports-section-header">

                        <div>
                            <span className="sports-eyebrow">
                                Season Leaders
                            </span>

                            <h2>Standout Players</h2>

                            <p>
                                Players currently leading the directory
                                in key attacking statistics.
                            </p>
                        </div>

                    </div>

                    <div className="players-leaders-grid">

                        {/* Top Scorer */}
                        <div className="player-leader-card">

                            <div className="player-leader-header">
                                <span>Top Scorer</span>
                                <Target size={20} />
                            </div>

                            <div className="player-leader-profile">

                                <div className="player-leader-avatar">
                                    {topScorer.photo ? (
                                        <img
                                            src={topScorer.photo}
                                            alt={topScorer.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                                event.currentTarget.nextElementSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}

                                    <span
                                        style={{
                                            display: topScorer.photo
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        {getInitials(topScorer.name)}
                                    </span>
                                </div>

                                <div>
                                    <Link
                                        to={`/players/${topScorer.id}`}
                                    >
                                        {topScorer.name}
                                    </Link>

                                    <span>
                                        {topScorer.team}
                                    </span>
                                </div>

                            </div>

                            <div className="player-leader-value">
                                <strong>{topScorer.goals}</strong>
                                <span>Goals</span>
                            </div>

                            <Link
                                to={`/players/${topScorer.id}`}
                                className="player-leader-link"
                            >
                                View Profile
                                <ArrowRight size={15} />
                            </Link>

                        </div>

                        {/* Top Playmaker */}
                        <div className="player-leader-card">

                            <div className="player-leader-header">
                                <span>Top Playmaker</span>
                                <Users size={20} />
                            </div>

                            <div className="player-leader-profile">

                                <div className="player-leader-avatar">
                                    {topPlaymaker.photo ? (
                                        <img
                                            src={topPlaymaker.photo}
                                            alt={topPlaymaker.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                                event.currentTarget.nextElementSibling.style.display =
                                                    "flex";
                                            }}
                                        />
                                    ) : null}

                                    <span
                                        style={{
                                            display: topPlaymaker.photo
                                                ? "none"
                                                : "flex",
                                        }}
                                    >
                                        {getInitials(
                                            topPlaymaker.name
                                        )}
                                    </span>
                                </div>

                                <div>
                                    <Link
                                        to={`/players/${topPlaymaker.id}`}
                                    >
                                        {topPlaymaker.name}
                                    </Link>

                                    <span>
                                        {topPlaymaker.team}
                                    </span>
                                </div>

                            </div>

                            <div className="player-leader-value">
                                <strong>{topPlaymaker.assists}</strong>
                                <span>Assists</span>
                            </div>

                            <Link
                                to={`/players/${topPlaymaker.id}`}
                                className="player-leader-link"
                            >
                                View Profile
                                <ArrowRight size={15} />
                            </Link>

                        </div>

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
                                Find your team. Follow your players.
                            </h2>

                            <p>
                                Explore teams, competitions and the
                                growing floorball community across Kenya.
                            </p>
                        </div>

                        <div className="sports-cta-actions">

                            <Link
                                to="/teams"
                                className="btn btn-primary"
                            >
                                Explore Teams
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/leagues"
                                className="btn btn-secondary"
                            >
                                View Leagues
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}