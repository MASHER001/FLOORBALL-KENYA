import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Filter,
    ChevronDown,
    ArrowRight,
    MapPin,
    Users,
    Trophy,
    Shield,
    X,
    Target,
    Activity,
} from "lucide-react";

const mockTeams = [
    {
        id: 1,
        name: "DeKUT Black Talons",
        shortName: "Black Talons",
        location: "Nyeri",
        county: "Nyeri County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Active",
        founded: "2024",
        homeGround: "DeKUT Sports Ground",
        logo: "/images/teams/logos/dekut-black-talons.png",
        cover: "/images/teams/team-photos/dekut-black-talons.jpg",
        players: 18,
        matches: 14,
        wins: 10,
        draws: 2,
        losses: 2,
        goalsFor: 61,
        goalsAgainst: 31,
        points: 32,
    },
    {
        id: 2,
        name: "Karatina Blazers",
        shortName: "Blazers",
        location: "Karatina",
        county: "Nyeri County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Active",
        founded: "2024",
        homeGround: "Karatina University Ground",
        logo: "/images/teams/logos/karatina-blazers.png",
        cover: "/images/teams/team-photos/karatina-blazers.jpg",
        players: 17,
        matches: 14,
        wins: 8,
        draws: 1,
        losses: 5,
        goalsFor: 48,
        goalsAgainst: 42,
        points: 25,
    },
    {
        id: 3,
        name: "Chuka Warriors",
        shortName: "Warriors",
        location: "Chuka",
        county: "Tharaka Nithi County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Active",
        founded: "2025",
        homeGround: "Chuka University Ground",
        logo: "/images/teams/logos/chuka-warriors.png",
        cover: "/images/teams/team-photos/chuka-warriors.jpg",
        players: 16,
        matches: 13,
        wins: 6,
        draws: 2,
        losses: 5,
        goalsFor: 39,
        goalsAgainst: 37,
        points: 20,
    },
    {
        id: 4,
        name: "SEKU Eagles",
        shortName: "Eagles",
        location: "Kitui",
        county: "Kitui County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Active",
        founded: "2024",
        homeGround: "SEKU Sports Ground",
        logo: "/images/teams/logos/seku-eagles.png",
        cover: "/images/teams/team-photos/seku-eagles.jpg",
        players: 19,
        matches: 14,
        wins: 7,
        draws: 3,
        losses: 4,
        goalsFor: 51,
        goalsAgainst: 43,
        points: 24,
    },
    {
        id: 5,
        name: "Nyandarua Panthers",
        shortName: "Panthers",
        location: "Nyandarua",
        county: "Nyandarua County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Active",
        founded: "2025",
        homeGround: "Nyandarua Sports Ground",
        logo: "/images/teams/logos/nyandarua-panthers.png",
        cover: "/images/teams/team-photos/nyandarua-panthers.jpg",
        players: 15,
        matches: 13,
        wins: 5,
        draws: 2,
        losses: 6,
        goalsFor: 36,
        goalsAgainst: 44,
        points: 17,
    },
    {
        id: 6,
        name: "Michuki Lions",
        shortName: "Lions",
        location: "Murang'a",
        county: "Murang'a County",
        league: "Central Kenya Floorball League",
        leagueId: 2,
        status: "Active",
        founded: "2025",
        homeGround: "Michuki Technical Training Ground",
        logo: "/images/teams/logos/michuki-lions.png",
        cover: "/images/teams/team-photos/michuki-lions.jpg",
        players: 14,
        matches: 11,
        wins: 5,
        draws: 1,
        losses: 5,
        goalsFor: 34,
        goalsAgainst: 35,
        points: 16,
    },
    {
        id: 7,
        name: "Nairobi Floorball Club",
        shortName: "Nairobi FC",
        location: "Nairobi",
        county: "Nairobi County",
        league: "Nairobi Floorball League",
        leagueId: 4,
        status: "Active",
        founded: "2023",
        homeGround: "Nairobi Sports Club",
        logo: "/images/teams/logos/nairobi-floorball-club.png",
        cover: "/images/teams/team-photos/nairobi-floorball-club.jpg",
        players: 21,
        matches: 16,
        wins: 11,
        draws: 2,
        losses: 3,
        goalsFor: 69,
        goalsAgainst: 38,
        points: 35,
    },
    {
        id: 8,
        name: "Eldoret Strikers",
        shortName: "Strikers",
        location: "Eldoret",
        county: "Uasin Gishu County",
        league: "Western Kenya Floorball League",
        leagueId: 6,
        status: "Active",
        founded: "2024",
        homeGround: "Eldoret Sports Club",
        logo: "/images/teams/logos/eldoret-strikers.png",
        cover: "/images/teams/team-photos/eldoret-strikers.jpg",
        players: 16,
        matches: 12,
        wins: 6,
        draws: 1,
        losses: 5,
        goalsFor: 42,
        goalsAgainst: 40,
        points: 19,
    },
    {
        id: 9,
        name: "Nyeri Polytechnic Floorball",
        shortName: "Nyeri Poly",
        location: "Nyeri",
        county: "Nyeri County",
        league: "Central Kenya Floorball League",
        leagueId: 2,
        status: "Active",
        founded: "2025",
        homeGround: "Nyeri Poly Sports Ground",
        logo: "/images/teams/logos/nyeri-poly.png",
        cover: "/images/teams/team-photos/nyeri-poly.jpg",
        players: 13,
        matches: 10,
        wins: 4,
        draws: 2,
        losses: 4,
        goalsFor: 29,
        goalsAgainst: 31,
        points: 14,
    },
    {
        id: 10,
        name: "Kenyatta University Blades",
        shortName: "KU Blades",
        location: "Nairobi",
        county: "Nairobi County",
        league: "Kenya University Floorball League",
        leagueId: 1,
        status: "Pending",
        founded: "2026",
        homeGround: "KU Sports Complex",
        logo: "/images/teams/logos/ku-blades.png",
        cover: "/images/teams/team-photos/ku-blades.jpg",
        players: 12,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
    },
];

const leagueOptions = [
    "All Leagues",
    "Kenya University Floorball League",
    "Central Kenya Floorball League",
    "Nairobi Floorball League",
    "Western Kenya Floorball League",
];

const statusOptions = [
    "All Status",
    "Active",
    "Pending",
];

const locationOptions = [
    "All Locations",
    "Nyeri",
    "Karatina",
    "Chuka",
    "Kitui",
    "Nyandarua",
    "Murang'a",
    "Nairobi",
    "Eldoret",
];

const getInitials = (name) => {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

function TeamLogo({ team }) {
    return (
        <div className="sports-team-card-logo">

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

            <span
                style={{
                    display: team.logo ? "none" : "flex",
                }}
            >
                {getInitials(team.name)}
            </span>

        </div>
    );
}

function TeamCard({ team }) {
    const goalDifference =
        team.goalsFor - team.goalsAgainst;

    return (
        <article className="sports-team-card">

            {/* Team Cover */}
            <div className="sports-team-card-cover">

                {team.cover ? (
                    <img
                        src={team.cover}
                        alt=""
                        onError={(event) => {
                            event.currentTarget.style.display = "none";
                        }}
                    />
                ) : null}

                <div className="sports-team-card-cover-overlay" />

                <span
                    className={`sports-status ${team.status.toLowerCase()}`}
                >
                    {team.status}
                </span>

                <TeamLogo team={team} />

            </div>

            {/* Body */}
            <div className="sports-team-card-body">

                <div className="sports-team-card-kicker">
                    {team.league}
                </div>

                <h3>
                    <Link to={`/teams/${team.id}`}>
                        {team.name}
                    </Link>
                </h3>

                <div className="sports-team-card-location">
                    <MapPin size={14} />
                    {team.location}, {team.county}
                </div>

                {/* Team Stats */}
                <div className="sports-team-card-stats">

                    <div>
                        <strong>{team.players}</strong>
                        <span>Players</span>
                    </div>

                    <div>
                        <strong>{team.matches}</strong>
                        <span>Matches</span>
                    </div>

                    <div>
                        <strong>{team.wins}</strong>
                        <span>Wins</span>
                    </div>

                    <div>
                        <strong>{team.points}</strong>
                        <span>Points</span>
                    </div>

                </div>

                {/* Record */}
                <div className="sports-team-card-record">

                    <div className="team-record-mini">
                        <span className="win">
                            {team.wins}W
                        </span>

                        <span className="draw">
                            {team.draws}D
                        </span>

                        <span className="loss">
                            {team.losses}L
                        </span>
                    </div>

                    <span
                        className={
                            goalDifference >= 0
                                ? "goal-difference positive"
                                : "goal-difference negative"
                        }
                    >
                        GD{" "}
                        {goalDifference > 0
                            ? `+${goalDifference}`
                            : goalDifference}
                    </span>

                </div>

                <Link
                    to={`/teams/${team.id}`}
                    className="sports-team-card-link"
                >
                    View Team Profile
                    <ArrowRight size={16} />
                </Link>

            </div>
        </article>
    );
}

export default function Teams() {
    const [search, setSearch] = useState("");
    const [league, setLeague] = useState("All Leagues");
    const [status, setStatus] = useState("All Status");
    const [location, setLocation] = useState("All Locations");
    const [showFilters, setShowFilters] = useState(false);

    const filteredTeams = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        return mockTeams.filter((team) => {

            const matchesSearch =
                !searchTerm ||
                team.name.toLowerCase().includes(searchTerm) ||
                team.shortName.toLowerCase().includes(searchTerm) ||
                team.location.toLowerCase().includes(searchTerm) ||
                team.county.toLowerCase().includes(searchTerm);

            const matchesLeague =
                league === "All Leagues" ||
                team.league === league;

            const matchesStatus =
                status === "All Status" ||
                team.status === status;

            const matchesLocation =
                location === "All Locations" ||
                team.location === location;

            return (
                matchesSearch &&
                matchesLeague &&
                matchesStatus &&
                matchesLocation
            );
        });
    }, [search, league, status, location]);

    const activeTeams = mockTeams.filter(
        (team) => team.status === "Active"
    );

    const totalPlayers = mockTeams.reduce(
        (total, team) => total + team.players,
        0
    );

    const totalMatches = mockTeams.reduce(
        (total, team) => total + team.matches,
        0
    );

    const highestScoringTeam = [...mockTeams]
        .filter((team) => team.matches > 0)
        .sort((a, b) => b.goalsFor - a.goalsFor)[0];

    const clearFilters = () => {
        setSearch("");
        setLeague("All Leagues");
        setStatus("All Status");
        setLocation("All Locations");
    };

    const hasActiveFilters =
        search ||
        league !== "All Leagues" ||
        status !== "All Status" ||
        location !== "All Locations";

    return (
        <main className="sports-page teams-page">

            {/* Hero */}
            <section className="sports-hero teams-hero">

                <div className="sports-container">

                    <div className="sports-hero-content">

                        <span className="sports-eyebrow">
                            Team Directory
                        </span>

                        <h1>
                            Meet the Teams
                            <span> of Kenyan Floorball.</span>
                        </h1>

                        <p>
                            Explore registered clubs, university teams
                            and floorball organizations competing across
                            Kenya.
                        </p>

                    </div>

                </div>

            </section>

            {/* Main Directory */}
            <section className="sports-section">

                <div className="sports-container">

                    {/* Header */}
                    <div className="sports-page-header">

                        <div>
                            <span className="sports-eyebrow">
                                Teams
                            </span>

                            <h2>
                                Kenyan Floorball Teams
                            </h2>

                            <p>
                                Find teams by league, location and
                                registration status.
                            </p>
                        </div>

                        <div className="sports-result-count">

                            <Shield size={18} />

                            <strong>
                                {filteredTeams.length}
                            </strong>

                            <span>
                                teams found
                            </span>

                        </div>

                    </div>

                    {/* Highlights */}
                    <div className="teams-highlight-grid">

                        <div className="teams-highlight-card">

                            <div className="teams-highlight-icon">
                                <Shield size={21} />
                            </div>

                            <div>
                                <span>Registered Teams</span>
                                <strong>
                                    {mockTeams.length}
                                </strong>
                            </div>

                        </div>

                        <div className="teams-highlight-card">

                            <div className="teams-highlight-icon">
                                <Activity size={21} />
                            </div>

                            <div>
                                <span>Active Teams</span>
                                <strong>
                                    {activeTeams.length}
                                </strong>
                            </div>

                        </div>

                        <div className="teams-highlight-card">

                            <div className="teams-highlight-icon">
                                <Users size={21} />
                            </div>

                            <div>
                                <span>Registered Players</span>
                                <strong>
                                    {totalPlayers}
                                </strong>
                            </div>

                        </div>

                        <div className="teams-highlight-card">

                            <div className="teams-highlight-icon">
                                <Trophy size={21} />
                            </div>

                            <div>
                                <span>Matches Played</span>
                                <strong>
                                    {totalMatches}
                                </strong>
                            </div>

                        </div>

                    </div>

                    {/* Search */}
                    <div className="sports-toolbar">

                        <div className="sports-search">

                            <Search size={19} />

                            <input
                                type="text"
                                placeholder="Search teams, locations or counties..."
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

                    {/* Filters */}
                    {showFilters && (
                        <div className="sports-filter-panel">

                            <div className="sports-filter-group">

                                <label htmlFor="team-league">
                                    League
                                </label>

                                <select
                                    id="team-league"
                                    value={league}
                                    onChange={(event) =>
                                        setLeague(event.target.value)
                                    }
                                >
                                    {leagueOptions.map((item) => (
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

                                <label htmlFor="team-location">
                                    Location
                                </label>

                                <select
                                    id="team-location"
                                    value={location}
                                    onChange={(event) =>
                                        setLocation(event.target.value)
                                    }
                                >
                                    {locationOptions.map((item) => (
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

                                <label htmlFor="team-status">
                                    Status
                                </label>

                                <select
                                    id="team-status"
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(event.target.value)
                                    }
                                >
                                    {statusOptions.map((item) => (
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

                    {/* Active Filters */}
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

                            {league !== "All Leagues" && (
                                <span>
                                    {league}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLeague("All Leagues")
                                        }
                                    >
                                        <X size={13} />
                                    </button>
                                </span>
                            )}

                            {location !== "All Locations" && (
                                <span>
                                    {location}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setLocation("All Locations")
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

                    {/* Team Grid */}
                    {filteredTeams.length > 0 ? (
                        <div className="sports-team-grid">

                            {filteredTeams.map((team) => (
                                <TeamCard
                                    team={team}
                                    key={team.id}
                                />
                            ))}

                        </div>
                    ) : (
                        <div className="sports-empty-state">

                            <Shield size={36} />

                            <h3>
                                No teams found
                            </h3>

                            <p>
                                No teams match your current search or
                                filters.
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

            {/* Featured Team */}
            {highestScoringTeam && (
                <section className="sports-section teams-featured-section">

                    <div className="sports-container">

                        <div className="sports-section-header">

                            <div>
                                <span className="sports-eyebrow">
                                    Team Spotlight
                                </span>

                                <h2>
                                    Featured Team
                                </h2>

                                <p>
                                    A closer look at one of the
                                    highest-scoring teams in the current
                                    directory.
                                </p>
                            </div>

                        </div>

                        <div className="teams-featured-card">

                            <div className="teams-featured-visual">

                                {highestScoringTeam.cover ? (
                                    <img
                                        src={
                                            highestScoringTeam.cover
                                        }
                                        alt=""
                                        onError={(event) => {
                                            event.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                ) : null}

                                <div className="teams-featured-overlay" />

                                <TeamLogo
                                    team={highestScoringTeam}
                                />

                            </div>

                            <div className="teams-featured-content">

                                <span className="sports-eyebrow">
                                    {highestScoringTeam.league}
                                </span>

                                <h3>
                                    {highestScoringTeam.name}
                                </h3>

                                <p>
                                    Based in{" "}
                                    <strong>
                                        {highestScoringTeam.location}
                                    </strong>
                                    , the team currently has{" "}
                                    <strong>
                                        {highestScoringTeam.points}
                                    </strong>{" "}
                                    league points from{" "}
                                    <strong>
                                        {highestScoringTeam.matches}
                                    </strong>{" "}
                                    matches.
                                </p>

                                <div className="teams-featured-stats">

                                    <div>
                                        <Target size={17} />
                                        <span>
                                            <strong>
                                                {
                                                    highestScoringTeam.goalsFor
                                                }
                                            </strong>
                                            Goals
                                        </span>
                                    </div>

                                    <div>
                                        <Trophy size={17} />
                                        <span>
                                            <strong>
                                                {
                                                    highestScoringTeam.wins
                                                }
                                            </strong>
                                            Wins
                                        </span>
                                    </div>

                                    <div>
                                        <Users size={17} />
                                        <span>
                                            <strong>
                                                {
                                                    highestScoringTeam.players
                                                }
                                            </strong>
                                            Players
                                        </span>
                                    </div>

                                </div>

                                <Link
                                    to={`/teams/${highestScoringTeam.id}`}
                                    className="btn btn-primary"
                                >
                                    View Team Profile
                                    <ArrowRight size={17} />
                                </Link>

                            </div>

                        </div>

                    </div>

                </section>
            )}

            {/* CTA */}
            <section className="sports-cta">

                <div className="sports-container">

                    <div className="sports-cta-content">

                        <div>
                            <span className="sports-eyebrow">
                                Grow Floorball in Kenya
                            </span>

                            <h2>
                                Is your team missing?
                            </h2>

                            <p>
                                Register your team and help build the
                                most complete floorball directory in
                                Kenya.
                            </p>
                        </div>

                        <div className="sports-cta-actions">

                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Register Your Team
                                <ArrowRight size={17} />
                            </Link>

                            <Link
                                to="/leagues"
                                className="btn btn-secondary"
                            >
                                Explore Leagues
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}