// frontend/src/pages/sports/Tournaments.jsx

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CalendarDays,
    ChevronDown,
    Filter,
    MapPin,
    Search,
    Trophy,
    Users,
    X,
} from "lucide-react";

/* =========================================================
   MOCK TOURNAMENT DATA
   Replace with API data later
========================================================= */

const mockTournaments = [
    {
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
            "A university floorball tournament bringing together leading men's and women's teams from across Central Kenya.",
        teams: 8,
        matches: 15,
        completed: 0,
        remaining: 15,
        image: "/images/tournaments/tournament-1.jpg",
        prize: "KES 50,000",
        edition: "3rd Edition",
        registrationStatus: "Registration Closed",
    },

    {
        id: 2,
        name: "Central Kenya Floorball Cup 2026",
        shortName: "Central Kenya Cup",
        type: "Regional Tournament",
        status: "Upcoming",
        date: "4 Oct 2026",
        endDate: "5 Oct 2026",
        venue: "Karatina Sports Grounds",
        location: "Karatina, Kenya",
        organizer: "Central Kenya Floorball Association",
        description:
            "A regional floorball competition bringing together teams from universities, colleges and community clubs.",
        teams: 12,
        matches: 23,
        completed: 0,
        remaining: 23,
        image: "/images/tournaments/tournament-2.jpg",
        prize: "KES 75,000",
        edition: "2nd Edition",
        registrationStatus: "Open",
    },

    {
        id: 3,
        name: "Kenya National Floorball Championship 2026",
        shortName: "National Championship",
        type: "National Tournament",
        status: "Upcoming",
        date: "14 Nov 2026",
        endDate: "15 Nov 2026",
        venue: "Moi International Sports Centre",
        location: "Kasaranі, Kenya",
        organizer: "Kenya Floorball Federation",
        description:
            "The national championship featuring top floorball teams from across Kenya.",
        teams: 16,
        matches: 31,
        completed: 0,
        remaining: 31,
        image: "/images/tournaments/tournament-3.jpg",
        prize: "KES 150,000",
        edition: "5th Edition",
        registrationStatus: "Coming Soon",
    },

    {
        id: 4,
        name: "Nyeri Community Floorball Challenge",
        shortName: "Nyeri Community Challenge",
        type: "Community Tournament",
        status: "Completed",
        date: "15 Aug 2026",
        endDate: "16 Aug 2026",
        venue: "Nyeri County Stadium",
        location: "Nyeri, Kenya",
        organizer: "Nyeri Floorball Community",
        description:
            "A community tournament designed to promote grassroots participation and youth development in floorball.",
        teams: 10,
        matches: 19,
        completed: 19,
        remaining: 0,
        image: "/images/tournaments/tournament-4.jpg",
        prize: "KES 30,000",
        edition: "1st Edition",
        registrationStatus: "Completed",
    },

    {
        id: 5,
        name: "Karatina University Floorball Tournament",
        shortName: "Karatina University Cup",
        type: "University Tournament",
        status: "Ongoing",
        date: "12 Sep 2026",
        endDate: "13 Sep 2026",
        venue: "Karatina University Grounds",
        location: "Karatina, Kenya",
        organizer: "Karatina University",
        description:
            "An inter-university tournament showcasing emerging floorball talent from Kenyan institutions.",
        teams: 8,
        matches: 15,
        completed: 9,
        remaining: 6,
        image: "/images/tournaments/tournament-5.jpg",
        prize: "KES 40,000",
        edition: "4th Edition",
        registrationStatus: "In Progress",
    },

    {
        id: 6,
        name: "Kenya Schools Floorball Challenge",
        shortName: "Schools Challenge",
        type: "National Tournament",
        status: "Upcoming",
        date: "28 Nov 2026",
        endDate: "29 Nov 2026",
        venue: "Nyeri Sports Club",
        location: "Nyeri, Kenya",
        organizer: "Kenya Schools Floorball Program",
        description:
            "A national youth tournament aimed at developing floorball among secondary schools and young players.",
        teams: 20,
        matches: 39,
        completed: 0,
        remaining: 39,
        image: "/images/tournaments/tournament-6.jpg",
        prize: "KES 60,000",
        edition: "2nd Edition",
        registrationStatus: "Open",
    },
];

/* =========================================================
   TOURNAMENT TYPES
========================================================= */

const tournamentTypes = [
    "All Types",
    "University Tournament",
    "Regional Tournament",
    "National Tournament",
    "Community Tournament",
];

const tournamentStatuses = [
    "All Statuses",
    "Upcoming",
    "Ongoing",
    "Completed",
];

/* =========================================================
   TOURNAMENT CARD
========================================================= */

function TournamentCard({ tournament }) {
    return (
        <article className="tournament-card">
            <div className="tournament-card-image">
                <img
                    src={tournament.image}
                    alt={tournament.name}
                    onError={(event) => {
                        event.currentTarget.style.display = "none";
                    }}
                />

                <span
                    className={`status-badge status-${tournament.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                >
                    {tournament.status}
                </span>
            </div>

            <div className="tournament-card-content">
                <div className="tournament-card-top">
                    <span className="tournament-type">
                        {tournament.type}
                    </span>

                    <span className="tournament-edition">
                        {tournament.edition}
                    </span>
                </div>

                <h3>{tournament.name}</h3>

                <p className="tournament-description">
                    {tournament.description}
                </p>

                <div className="tournament-meta">
                    <div>
                        <CalendarDays size={16} />
                        <span>
                            {tournament.date} - {tournament.endDate}
                        </span>
                    </div>

                    <div>
                        <MapPin size={16} />
                        <span>{tournament.location}</span>
                    </div>

                    <div>
                        <Users size={16} />
                        <span>{tournament.teams} Teams</span>
                    </div>
                </div>

                <div className="tournament-card-footer">
                    <div>
                        <small>Prize Pool</small>
                        <strong>{tournament.prize}</strong>
                    </div>

                    <Link
                        to={`/tournaments/${tournament.id}`}
                        className="btn btn-primary"
                    >
                        View Tournament
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </article>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function Tournaments() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [showFilters, setShowFilters] = useState(false);

    const filteredTournaments = useMemo(() => {
        return mockTournaments.filter((tournament) => {
            const matchesSearch =
                tournament.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tournament.shortName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                tournament.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesType =
                selectedType === "All Types" ||
                tournament.type === selectedType;

            const matchesStatus =
                selectedStatus === "All Statuses" ||
                tournament.status === selectedStatus;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchTerm, selectedType, selectedStatus]);

    const clearFilters = () => {
        setSearchTerm("");
        setSelectedType("All Types");
        setSelectedStatus("All Statuses");
    };

    const hasActiveFilters =
        searchTerm ||
        selectedType !== "All Types" ||
        selectedStatus !== "All Statuses";

    return (
        <main className="page tournaments-page">
            {/* HERO */}
            <section className="page-hero">
                <div className="container">
                    <div className="page-hero-content">
                        <span className="eyebrow">
                            <Trophy size={16} />
                            FLOORBALL TOURNAMENTS
                        </span>

                        <h1>
                            Discover Floorball
                            <span> Tournaments</span>
                        </h1>

                        <p>
                            Find upcoming, ongoing and completed floorball
                            tournaments across Kenya.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <section className="section">
                <div className="container">
                    {/* SEARCH / FILTER BAR */}
                    <div className="sports-filter-card">
                        <div className="search-box">
                            <Search size={20} />

                            <input
                                type="text"
                                placeholder="Search tournaments..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    className="search-clear"
                                    onClick={() => setSearchTerm("")}
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            className="btn btn-outline filter-toggle"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter size={17} />
                            Filters
                            <ChevronDown
                                size={16}
                                className={
                                    showFilters ? "rotate-180" : ""
                                }
                            />
                        </button>
                    </div>

                    {/* FILTERS */}
                    {showFilters && (
                        <div className="sports-filter-options">
                            <div className="filter-group">
                                <label>Tournament Type</label>

                                <select
                                    value={selectedType}
                                    onChange={(event) =>
                                        setSelectedType(event.target.value)
                                    }
                                >
                                    {tournamentTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Status</label>

                                <select
                                    value={selectedStatus}
                                    onChange={(event) =>
                                        setSelectedStatus(event.target.value)
                                    }
                                >
                                    {tournamentStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={clearFilters}
                                >
                                    <X size={16} />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* RESULTS HEADER */}
                    <div className="section-heading-row">
                        <div>
                            <span className="section-eyebrow">
                                TOURNAMENT DIRECTORY
                            </span>

                            <h2>
                                {filteredTournaments.length}{" "}
                                {filteredTournaments.length === 1
                                    ? "Tournament"
                                    : "Tournaments"}
                            </h2>
                        </div>
                    </div>

                    {/* TOURNAMENT GRID */}
                    {filteredTournaments.length > 0 ? (
                        <div className="tournaments-grid">
                            {filteredTournaments.map((tournament) => (
                                <TournamentCard
                                    key={tournament.id}
                                    tournament={tournament}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Trophy size={48} />

                            <h3>No tournaments found</h3>

                            <p>
                                Try changing your search or filter options.
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
        </main>
    );
}

export default Tournaments;