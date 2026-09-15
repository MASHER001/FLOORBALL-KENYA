// =========================================================
// FLOORBALLKENYA.COM
// ADMIN — LEAGUES MANAGEMENT
// =========================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Leagues = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showModal, setShowModal] = useState(false);
    const [editingLeague, setEditingLeague] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // =========================================================
    // TEMPORARY LEAGUE DATA
    // =========================================================
    // This will later come from:
    //
    // GET /api/admin/leagues
    //
    // FastAPI → Supabase PostgreSQL

    const [leagues, setLeagues] = useState([
        {
            id: 1,
            name: "Kenya University Floorball League",
            shortName: "KUFL",
            season: "2026",
            teams: 18,
            matches: 54,
            completedMatches: 42,
            status: "Active",
            registration: "Open",
            startDate: "01 Aug 2026",
            endDate: "30 Nov 2026",
        },
        {
            id: 2,
            name: "Central Kenya Floorball League",
            shortName: "CKFL",
            season: "2026",
            teams: 12,
            matches: 36,
            completedMatches: 36,
            status: "Completed",
            registration: "Closed",
            startDate: "10 May 2026",
            endDate: "28 Jul 2026",
        },
        {
            id: 3,
            name: "Nyeri County Floorball League",
            shortName: "NCFL",
            season: "2026",
            teams: 10,
            matches: 30,
            completedMatches: 12,
            status: "Active",
            registration: "Open",
            startDate: "15 Aug 2026",
            endDate: "15 Dec 2026",
        },
        {
            id: 4,
            name: "Kenya Schools Floorball League",
            shortName: "KSFL",
            season: "2026",
            teams: 24,
            matches: 72,
            completedMatches: 0,
            status: "Upcoming",
            registration: "Open",
            startDate: "01 Oct 2026",
            endDate: "15 Dec 2026",
        },
        {
            id: 5,
            name: "Mount Kenya Floorball Championship",
            shortName: "MKFC",
            season: "2025",
            teams: 16,
            matches: 48,
            completedMatches: 48,
            status: "Completed",
            registration: "Closed",
            startDate: "05 Jun 2025",
            endDate: "25 Aug 2025",
        },
        {
            id: 6,
            name: "Kenya Corporate Floorball League",
            shortName: "KCFL",
            season: "2026",
            teams: 8,
            matches: 28,
            completedMatches: 8,
            status: "Active",
            registration: "Open",
            startDate: "20 Aug 2026",
            endDate: "20 Nov 2026",
        },
    ]);

    // =========================================================
    // FORM STATE
    // =========================================================

    const [formData, setFormData] = useState({
        name: "",
        shortName: "",
        season: "2026",
        startDate: "",
        endDate: "",
        registration: "Open",
        status: "Upcoming",
    });

    // =========================================================
    // FILTER LEAGUES
    // =========================================================

    const filteredLeagues = leagues.filter((league) => {

        const matchesSearch =
            league.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            league.shortName
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            league.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // =========================================================
    // STATISTICS
    // =========================================================

    const totalLeagues = leagues.length;

    const activeLeagues = leagues.filter(
        (league) => league.status === "Active"
    ).length;

    const upcomingLeagues = leagues.filter(
        (league) => league.status === "Upcoming"
    ).length;

    const totalTeams = leagues.reduce(
        (total, league) => total + league.teams,
        0
    );

    // =========================================================
    // OPEN CREATE MODAL
    // =========================================================

    const openCreateModal = () => {

        setEditingLeague(null);

        setFormData({
            name: "",
            shortName: "",
            season: "2026",
            startDate: "",
            endDate: "",
            registration: "Open",
            status: "Upcoming",
        });

        setShowModal(true);
    };

    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (league) => {

        setEditingLeague(league);

        setFormData({
            name: league.name,
            shortName: league.shortName,
            season: league.season,
            startDate: league.startDate,
            endDate: league.endDate,
            registration: league.registration,
            status: league.status,
        });

        setShowModal(true);
    };

    // =========================================================
    // FORM INPUT
    // =========================================================

    const handleInputChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // =========================================================
    // SAVE LEAGUE
    // =========================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Please enter a league name.");
            return;
        }

        if (editingLeague) {

            // UPDATE EXISTING LEAGUE

            setLeagues((previous) =>
                previous.map((league) =>
                    league.id === editingLeague.id
                        ? {
                              ...league,
                              ...formData,
                          }
                        : league
                )
            );

        } else {

            // CREATE NEW LEAGUE

            const newLeague = {
                id: Date.now(),
                name: formData.name,
                shortName: formData.shortName,
                season: formData.season,
                teams: 0,
                matches: 0,
                completedMatches: 0,
                status: formData.status,
                registration: formData.registration,
                startDate: formData.startDate,
                endDate: formData.endDate,
            };

            setLeagues((previous) => [
                newLeague,
                ...previous,
            ]);
        }

        setShowModal(false);
        setEditingLeague(null);
    };

    // =========================================================
    // DELETE LEAGUE
    // =========================================================

    const handleDelete = (id) => {

        const league = leagues.find(
            (item) => item.id === id
        );

        const confirmed = window.confirm(
            `Are you sure you want to delete "${league?.name}"?`
        );

        if (!confirmed) {
            return;
        }

        setLeagues((previous) =>
            previous.filter(
                (league) => league.id !== id
            )
        );
    };

    // =========================================================
    // TOGGLE STATUS
    // =========================================================

    const toggleStatus = (id) => {

        setLeagues((previous) =>
            previous.map((league) => {

                if (league.id !== id) {
                    return league;
                }

                return {
                    ...league,
                    status:
                        league.status === "Active"
                            ? "Upcoming"
                            : "Active",
                };
            })
        );
    };

    // =========================================================
    // PAGINATION
    // =========================================================

    const itemsPerPage = 5;

    const totalPages = Math.ceil(
        filteredLeagues.length / itemsPerPage
    );

    const paginatedLeagues = filteredLeagues.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // =========================================================
    // RESET PAGE WHEN SEARCHING
    // =========================================================

    const handleSearch = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="admin-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="admin-page-header">

                <div>

                    <div className="admin-breadcrumb">

                        <Link to="/admin">
                            Dashboard
                        </Link>

                        <i className="fa-solid fa-chevron-right"></i>

                        <span>
                            Leagues
                        </span>

                    </div>

                    <span className="admin-eyebrow">
                        SPORTS MANAGEMENT
                    </span>

                    <h1>
                        Leagues
                    </h1>

                    <p>
                        Create, manage and monitor floorball
                        leagues across Kenya.
                    </p>

                </div>


                <button
                    className="admin-primary-button"
                    onClick={openCreateModal}
                >
                    <i className="fa-solid fa-plus"></i>
                    Create League
                </button>

            </div>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <div className="management-stats">

                <div className="management-stat-card">

                    <div className="management-stat-icon">
                        <i className="fa-solid fa-trophy"></i>
                    </div>

                    <div>
                        <span>Total Leagues</span>
                        <strong>{totalLeagues}</strong>
                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon active">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Active Leagues</span>
                        <strong>{activeLeagues}</strong>
                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon upcoming">
                        <i className="fa-solid fa-calendar-days"></i>
                    </div>

                    <div>
                        <span>Upcoming</span>
                        <strong>{upcomingLeagues}</strong>
                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon teams">
                        <i className="fa-solid fa-people-group"></i>
                    </div>

                    <div>
                        <span>Registered Teams</span>
                        <strong>{totalTeams}</strong>
                    </div>

                </div>

            </div>


            {/* =================================================
                MAIN MANAGEMENT CARD
            ================================================= */}

            <section className="management-card">

                {/* =============================================
                    TOOLBAR
                ============================================= */}

                <div className="management-toolbar">

                    <div className="management-search">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search leagues..."
                            value={searchTerm}
                            onChange={(e) =>
                                handleSearch(e.target.value)
                            }
                        />

                    </div>


                    <div className="management-filters">

                        <div className="filter-select">

                            <i className="fa-solid fa-filter"></i>

                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="All">
                                    All Status
                                </option>

                                <option value="Active">
                                    Active
                                </option>

                                <option value="Upcoming">
                                    Upcoming
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>
                            </select>

                        </div>


                        <select className="season-select">

                            <option>
                                2026 Season
                            </option>

                            <option>
                                2025 Season
                            </option>

                            <option>
                                2024 Season
                            </option>

                        </select>


                        <button className="export-button">
                            <i className="fa-solid fa-download"></i>
                            Export
                        </button>

                    </div>

                </div>


                {/* =============================================
                    TABLE
                ============================================= */}

                <div className="management-table-wrapper">

                    <table className="management-table">

                        <thead>

                            <tr>

                                <th>
                                    League
                                </th>

                                <th>
                                    Season
                                </th>

                                <th>
                                    Teams
                                </th>

                                <th>
                                    Matches
                                </th>

                                <th>
                                    Registration
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Dates
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {paginatedLeagues.length > 0 ? (

                                paginatedLeagues.map((league) => (

                                    <tr key={league.id}>

                                        {/* LEAGUE */}

                                        <td>

                                            <div className="league-table-name">

                                                <div className="league-logo">
                                                    {league.shortName.substring(
                                                        0,
                                                        2
                                                    )}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {league.name}
                                                    </strong>

                                                    <span>
                                                        {league.shortName}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* SEASON */}

                                        <td>

                                            <span className="season-tag">
                                                {league.season}
                                            </span>

                                        </td>


                                        {/* TEAMS */}

                                        <td>

                                            <strong>
                                                {league.teams}
                                            </strong>

                                            <span className="table-muted">
                                                teams
                                            </span>

                                        </td>


                                        {/* MATCHES */}

                                        <td>

                                            <div className="match-progress">

                                                <strong>
                                                    {
                                                        league.completedMatches
                                                    }
                                                    /
                                                    {
                                                        league.matches
                                                    }
                                                </strong>

                                                <div className="progress-bar">

                                                    <span
                                                        style={{
                                                            width:
                                                                league.matches
                                                                    ? `${(
                                                                          league.completedMatches /
                                                                          league.matches
                                                                      ) *
                                                                      100
                                                                    }%`
                                                                    : "0%",
                                                        }}
                                                    ></span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* REGISTRATION */}

                                        <td>

                                            <span
                                                className={`registration-badge ${
                                                    league.registration
                                                        .toLowerCase()
                                                }`}
                                            >

                                                <i
                                                    className={`fa-solid ${
                                                        league.registration ===
                                                        "Open"
                                                            ? "fa-lock-open"
                                                            : "fa-lock"
                                                    }`}
                                                ></i>

                                                {league.registration}

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`status-badge ${league.status.toLowerCase()}`}
                                            >

                                                <span></span>

                                                {league.status}

                                            </span>

                                        </td>


                                        {/* DATES */}

                                        <td>

                                            <div className="league-dates">

                                                <span>
                                                    {league.startDate}
                                                </span>

                                                <span>
                                                    →
                                                </span>

                                                <span>
                                                    {league.endDate}
                                                </span>

                                            </div>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="table-actions">

                                                <Link
                                                    to={`/leagues/${league.id}`}
                                                    className="table-action view"
                                                    title="View League"
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </Link>


                                                <button
                                                    className="table-action edit"
                                                    title="Edit League"
                                                    onClick={() =>
                                                        openEditModal(
                                                            league
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>


                                                <button
                                                    className="table-action toggle"
                                                    title="Change Status"
                                                    onClick={() =>
                                                        toggleStatus(
                                                            league.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-power-off"></i>
                                                </button>


                                                <button
                                                    className="table-action delete"
                                                    title="Delete League"
                                                    onClick={() =>
                                                        handleDelete(
                                                            league.id
                                                        )
                                                    }
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="empty-table"
                                    >

                                        <div>

                                            <i className="fa-solid fa-trophy"></i>

                                            <h3>
                                                No leagues found
                                            </h3>

                                            <p>
                                                Try changing your search
                                                or filter.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =============================================
                    TABLE FOOTER
                ============================================= */}

                <div className="management-footer">

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredLeagues.length === 0
                                ? 0
                                : (currentPage - 1) *
                                      itemsPerPage +
                                  1}
                        </strong>
                        {" "}to{" "}
                        <strong>
                            {Math.min(
                                currentPage * itemsPerPage,
                                filteredLeagues.length
                            )}
                        </strong>
                        {" "}of{" "}
                        <strong>
                            {filteredLeagues.length}
                        </strong>
                        {" "}leagues
                    </span>


                    <div className="pagination">

                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page - 1
                                )
                            }
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>


                        {Array.from(
                            {
                                length: totalPages,
                            },
                            (_, index) => index + 1
                        ).map((page) => (

                            <button
                                key={page}
                                className={
                                    currentPage === page
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentPage(page)
                                }
                            >
                                {page}
                            </button>

                        ))}


                        <button
                            disabled={
                                currentPage === totalPages ||
                                totalPages === 0
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) => page + 1
                                )
                            }
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                CREATE / EDIT MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="admin-modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {
                            setShowModal(false);
                        }

                    }}
                >

                    <div className="admin-modal">

                        {/* MODAL HEADER */}

                        <div className="admin-modal-header">

                            <div>

                                <span>
                                    LEAGUE MANAGEMENT
                                </span>

                                <h2>
                                    {editingLeague
                                        ? "Edit League"
                                        : "Create League"}
                                </h2>

                            </div>

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="league-form"
                        >

                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        League Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Kenya University Floorball League"
                                        value={formData.name}
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Short Name
                                    </label>

                                    <input
                                        type="text"
                                        name="shortName"
                                        placeholder="e.g. KUFL"
                                        value={
                                            formData.shortName
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Season
                                    </label>

                                    <select
                                        name="season"
                                        value={
                                            formData.season
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >

                                        <option>
                                            2026
                                        </option>

                                        <option>
                                            2027
                                        </option>

                                        <option>
                                            2028
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Registration
                                    </label>

                                    <select
                                        name="registration"
                                        value={
                                            formData.registration
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >

                                        <option>
                                            Open
                                        </option>

                                        <option>
                                            Closed
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Start Date
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={
                                            formData.startDate
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        End Date
                                    </label>

                                    <input
                                        type="date"
                                        name="endDate"
                                        value={
                                            formData.endDate
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    League Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                >

                                    <option>
                                        Upcoming
                                    </option>

                                    <option>
                                        Active
                                    </option>

                                    <option>
                                        Completed
                                    </option>

                                </select>

                            </div>


                            {/* FORM ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="modal-submit"
                                >

                                    <i className="fa-solid fa-check"></i>

                                    {editingLeague
                                        ? "Save Changes"
                                        : "Create League"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Leagues;

