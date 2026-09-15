import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Trophy,
    Users,
    CalendarDays,
    Search,
    MapPin,
    ArrowRight,
    Filter,
    ChevronDown,
} from "lucide-react";

const mockLeagues = [
    {
        id: 1,
        name: "Kenya University Floorball League",
        shortName: "KUFL",
        season: "2026 Season",
        location: "Kenya",
        status: "Active",
        teams: 12,
        matches: 42,
        startDate: "2026-08-15",
        endDate: "2026-12-10",
        description:
            "Competitive floorball league bringing together university teams from across Kenya.",
        image: "/images/tournaments/university-league.jpg",
    },
    {
        id: 2,
        name: "Central Kenya Floorball League",
        shortName: "CKFL",
        season: "2026 Season",
        location: "Central Kenya",
        status: "Active",
        teams: 8,
        matches: 28,
        startDate: "2026-09-01",
        endDate: "2026-12-05",
        description:
            "Regional floorball competition featuring clubs and institutions from Central Kenya.",
        image: "/images/tournaments/central-league.jpg",
    },
    {
        id: 3,
        name: "Kenya Schools Floorball League",
        shortName: "KSFL",
        season: "2026 Season",
        location: "Kenya",
        status: "Registration Open",
        teams: 18,
        matches: 0,
        startDate: "2026-10-01",
        endDate: "2027-02-20",
        description:
            "A school-level competition designed to grow youth floorball across Kenya.",
        image: "/images/tournaments/schools-league.jpg",
    },
    {
        id: 4,
        name: "Nairobi Floorball League",
        shortName: "NFL",
        season: "2026 Season",
        location: "Nairobi",
        status: "Upcoming",
        teams: 10,
        matches: 0,
        startDate: "2026-11-05",
        endDate: "2027-02-15",
        description:
            "Competitive league for floorball clubs and recreational teams in Nairobi.",
        image: "/images/tournaments/nairobi-league.jpg",
    },
    {
        id: 5,
        name: "Women’s University Floorball League",
        shortName: "WUFL",
        season: "2026 Season",
        location: "Kenya",
        status: "Active",
        teams: 9,
        matches: 24,
        startDate: "2026-08-20",
        endDate: "2026-12-12",
        description:
            "A university competition focused on developing women's floorball in Kenya.",
        image: "/images/tournaments/womens-league.jpg",
    },
    {
        id: 6,
        name: "Western Kenya Floorball League",
        shortName: "WKFL",
        season: "2026 Season",
        location: "Western Kenya",
        status: "Completed",
        teams: 7,
        matches: 21,
        startDate: "2026-02-10",
        endDate: "2026-06-20",
        description:
            "Regional competition connecting floorball clubs and institutions in Western Kenya.",
        image: "/images/tournaments/western-league.jpg",
    },
];

const statusOptions = [
    "All",
    "Active",
    "Registration Open",
    "Upcoming",
    "Completed",
];

const seasonOptions = [
    "All Seasons",
    "2026 Season",
    "2025 Season",
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

export default function Leagues() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [seasonFilter, setSeasonFilter] = useState("All Seasons");
    const [showFilters, setShowFilters] = useState(false);

    const filteredLeagues = useMemo(() => {
        return mockLeagues.filter((league) => {
            const search = searchTerm.toLowerCase().trim();

            const matchesSearch =
                !search ||
                league.name.toLowerCase().includes(search) ||
                league.shortName.toLowerCase().includes(search) ||
                league.location.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                league.status === statusFilter;

            const matchesSeason =
                seasonFilter === "All Seasons" ||
                league.season === seasonFilter;

            return matchesSearch && matchesStatus && matchesSeason;
        });
    }, [searchTerm, statusFilter, seasonFilter]);

    return (
        <main className="sports-page leagues-page">

            {/* HERO */}
            <section className="sports-hero">
                <div className="public-container">
                    <div className="sports-hero-content">
                        <span className="public-eyebrow">
                            <Trophy size={15} />
                            Floorball Competitions
                        </span>

                        <h1>Floorball Leagues in Kenya</h1>

                        <p>
                            Discover leagues, follow teams, check standings,
                            explore fixtures and keep up with competitive
                            floorball across Kenya.
                        </p>
                    </div>
                </div>
            </section>

            {/* LEAGUE CONTENT */}
            <section className="public-section">
                <div className="public-container">

                    {/* HEADER */}
                    <div className="sports-page-header">
                        <div>
                            <span className="public-eyebrow">
                                Competitions
                            </span>

                            <h2>Explore Leagues</h2>

                            <p>
                                Browse current, upcoming and completed
                                floorball leagues.
                            </p>
                        </div>

                        <div className="sports-result-count">
                            <strong>{filteredLeagues.length}</strong>
                            <span>
                                {filteredLeagues.length === 1
                                    ? "League"
                                    : "Leagues"}
                            </span>
                        </div>
                    </div>

                    {/* SEARCH / FILTER BAR */}
                    <div className="sports-toolbar">

                        <div className="sports-search">
                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search leagues, locations..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />
                        </div>

                        <button
                            type="button"
                            className="sports-filter-toggle"
                            onClick={() =>
                                setShowFilters(!showFilters)
                            }
                        >
                            <Filter size={17} />
                            Filters
                            <ChevronDown
                                size={16}
                                className={
                                    showFilters
                                        ? "rotate-icon"
                                        : ""
                                }
                            />
                        </button>

                    </div>

                    {/* FILTERS */}
                    {showFilters && (
                        <div className="sports-filter-panel">

                            <div className="sports-filter-group">
                                <label>Status</label>

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(event.target.value)
                                    }
                                >
                                    {statusOptions.map((status) => (
                                        <option
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="sports-filter-group">
                                <label>Season</label>

                                <select
                                    value={seasonFilter}
                                    onChange={(event) =>
                                        setSeasonFilter(event.target.value)
                                    }
                                >
                                    {seasonOptions.map((season) => (
                                        <option
                                            key={season}
                                            value={season}
                                        >
                                            {season}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                className="sports-clear-filters"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                    setSeasonFilter("All Seasons");
                                }}
                            >
                                Clear Filters
                            </button>

                        </div>
                    )}

                    {/* LEAGUES */}
                    {filteredLeagues.length > 0 ? (
                        <div className="sports-league-grid">

                            {filteredLeagues.map((league) => (
                                <article
                                    className="sports-league-card"
                                    key={league.id}
                                >

                                    {/* IMAGE */}
                                    <div className="sports-card-image">
                                        <img
                                            src={league.image}
                                            alt={league.name}
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                        <span
                                            className={getStatusClass(
                                                league.status
                                            )}
                                        >
                                            {league.status}
                                        </span>
                                    </div>

                                    {/* CONTENT */}
                                    <div className="sports-card-body">

                                        <div className="sports-card-kicker">
                                            {league.shortName}
                                        </div>

                                        <h3>{league.name}</h3>

                                        <p className="sports-card-description">
                                            {league.description}
                                        </p>

                                        <div className="sports-card-meta">

                                            <span>
                                                <CalendarDays
                                                    size={15}
                                                />
                                                {league.season}
                                            </span>

                                            <span>
                                                <MapPin size={15} />
                                                {league.location}
                                            </span>

                                        </div>

                                        <div className="sports-card-stats">

                                            <div>
                                                <strong>
                                                    {league.teams}
                                                </strong>

                                                <span>Teams</span>
                                            </div>

                                            <div>
                                                <strong>
                                                    {league.matches}
                                                </strong>

                                                <span>Matches</span>
                                            </div>

                                            <div>
                                                <strong>
                                                    {formatDate(
                                                        league.startDate
                                                    )}
                                                </strong>

                                                <span>Start</span>
                                            </div>

                                        </div>

                                        <Link
                                            to={`/leagues/${league.id}`}
                                            className="sports-card-link"
                                        >
                                            View League
                                            <ArrowRight size={16} />
                                        </Link>

                                    </div>
                                </article>
                            ))}

                        </div>
                    ) : (
                        <div className="public-empty-state sports-empty-state">

                            <Trophy size={42} />

                            <h3>No leagues found</h3>

                            <p>
                                Try changing your search or filters to
                                find another league.
                            </p>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("All");
                                    setSeasonFilter("All Seasons");
                                }}
                            >
                                Reset Filters
                            </button>

                        </div>
                    )}

                </div>
            </section>

            {/* CTA */}
            <section className="public-cta">
                <div className="public-container">
                    <div className="public-cta-card">

                        <Trophy
                            size={38}
                            style={{ marginBottom: "15px" }}
                        />

                        <h2>Run your competition with FloorballKenya</h2>

                        <p>
                            Register your league, manage teams, publish
                            fixtures and keep your standings up to date
                            from one platform.
                        </p>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Register Your Team
                            <ArrowRight size={17} />
                        </Link>

                    </div>
                </div>
            </section>

        </main>
    );
}

