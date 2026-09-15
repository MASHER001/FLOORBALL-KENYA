// =========================================================
// FLOORBALLKENYA.COM
// ADMIN — MATCHES MANAGEMENT
// =========================================================

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Matches = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [competitionFilter, setCompetitionFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    const [editingMatch, setEditingMatch] = useState(null);
    const [resultMatch, setResultMatch] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);


    // =========================================================
    // TEMPORARY TEAMS
    // =========================================================

    const teams = [
        {
            id: 1,
            name: "DeKUT Black Talons",
            shortName: "BT",
        },
        {
            id: 2,
            name: "Karatina University",
            shortName: "KAR",
        },
        {
            id: 3,
            name: "SEKU Floorball",
            shortName: "SEKU",
        },
        {
            id: 4,
            name: "Chuka University",
            shortName: "CHU",
        },
        {
            id: 5,
            name: "Nyeri Polytechnic",
            shortName: "NYP",
        },
        {
            id: 6,
            name: "Michuki Technical",
            shortName: "MIT",
        },
    ];


    // =========================================================
    // TEMPORARY MATCH DATA
    // =========================================================
    //
    // Later:
    //
    // GET    /api/admin/matches
    // POST   /api/admin/matches
    // PUT    /api/admin/matches/{id}
    // DELETE /api/admin/matches/{id}
    //
    // Results:
    //
    // POST /api/admin/matches/{id}/result
    //
    // =========================================================

    const [matches, setMatches] = useState([

        {
            id: 1,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "DeKUT Black Talons",

            homeShortName: "BT",

            awayTeam: "Karatina University",

            awayShortName: "KAR",

            homeScore: 5,

            awayScore: 2,

            date: "13 Sep 2026",

            time: "4:00 PM",

            venue: "DeKUT Sports Ground",

            referee: "James Mwangi",

            status: "Completed",
        },

        {
            id: 2,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "SEKU Floorball",

            homeShortName: "SEKU",

            awayTeam: "Chuka University",

            awayShortName: "CHU",

            homeScore: 3,

            awayScore: 3,

            date: "12 Sep 2026",

            time: "3:30 PM",

            venue: "SEKU Sports Complex",

            referee: "Peter Kariuki",

            status: "Completed",
        },

        {
            id: 3,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "Nyeri Polytechnic",

            homeShortName: "NYP",

            awayTeam: "Michuki Technical",

            awayShortName: "MIT",

            homeScore: 2,

            awayScore: 1,

            date: "10 Sep 2026",

            time: "2:00 PM",

            venue: "Nyeri Stadium",

            referee: "David Maina",

            status: "Completed",
        },

        {
            id: 4,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "DeKUT Black Talons",

            homeShortName: "BT",

            awayTeam: "SEKU Floorball",

            awayShortName: "SEKU",

            homeScore: null,

            awayScore: null,

            date: "20 Sep 2026",

            time: "4:00 PM",

            venue: "DeKUT Sports Ground",

            referee: "TBA",

            status: "Upcoming",
        },

        {
            id: 5,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "Karatina University",

            homeShortName: "KAR",

            awayTeam: "Chuka University",

            awayShortName: "CHU",

            homeScore: null,

            awayScore: null,

            date: "21 Sep 2026",

            time: "3:00 PM",

            venue: "Karatina Sports Ground",

            referee: "TBA",

            status: "Upcoming",
        },

        {
            id: 6,

            competition:
                "Nyeri County Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "Nyeri Polytechnic",

            homeShortName: "NYP",

            awayTeam: "DeKUT Black Talons",

            awayShortName: "BT",

            homeScore: null,

            awayScore: null,

            date: "25 Sep 2026",

            time: "4:30 PM",

            venue: "Nyeri Stadium",

            referee: "TBA",

            status: "Upcoming",
        },

        {
            id: 7,

            competition:
                "Mount Kenya Floorball Championship",

            competitionType: "Tournament",

            season: "2026",

            homeTeam: "SEKU Floorball",

            homeShortName: "SEKU",

            awayTeam: "Michuki Technical",

            awayShortName: "MIT",

            homeScore: null,

            awayScore: null,

            date: "04 Oct 2026",

            time: "11:00 AM",

            venue: "Karatina University",

            referee: "TBA",

            status: "Upcoming",
        },

        {
            id: 8,

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "DeKUT Black Talons",

            homeShortName: "BT",

            awayTeam: "Chuka University",

            awayShortName: "CHU",

            homeScore: null,

            awayScore: null,

            date: "28 Sep 2026",

            time: "4:00 PM",

            venue: "DeKUT Sports Ground",

            referee: "TBA",

            status: "Cancelled",
        },

    ]);


    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({

        competition:
            "Kenya University Floorball League",

        competitionType: "League",

        season: "2026",

        homeTeam: "",

        awayTeam: "",

        date: "",

        time: "",

        venue: "",

        referee: "",

        status: "Upcoming",

    });


    // =========================================================
    // RESULT FORM
    // =========================================================

    const [resultData, setResultData] = useState({

        homeScore: "",
        awayScore: "",

        homeGoals: "",
        awayGoals: "",

        notes: "",

    });


    // =========================================================
    // FILTER MATCHES
    // =========================================================

    const filteredMatches = matches.filter((match) => {

        const search =
            searchTerm.toLowerCase();

        const matchesSearch =
            match.homeTeam
                .toLowerCase()
                .includes(search) ||

            match.awayTeam
                .toLowerCase()
                .includes(search) ||

            match.competition
                .toLowerCase()
                .includes(search);


        const matchesStatus =
            statusFilter === "All" ||
            match.status === statusFilter;


        const matchesCompetition =
            competitionFilter === "All" ||
            match.competitionType ===
                competitionFilter;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesCompetition
        );

    });


    // =========================================================
    // MATCH STATISTICS
    // =========================================================

    const totalMatches =
        matches.length;

    const completedMatches =
        matches.filter(
            (match) =>
                match.status === "Completed"
        ).length;

    const upcomingMatches =
        matches.filter(
            (match) =>
                match.status === "Upcoming"
        ).length;

    const cancelledMatches =
        matches.filter(
            (match) =>
                match.status === "Cancelled"
        ).length;


    // =========================================================
    // OPEN CREATE MODAL
    // =========================================================

    const openCreateModal = () => {

        setEditingMatch(null);

        setFormData({

            competition:
                "Kenya University Floorball League",

            competitionType: "League",

            season: "2026",

            homeTeam: "",

            awayTeam: "",

            date: "",

            time: "",

            venue: "",

            referee: "",

            status: "Upcoming",

        });

        setShowModal(true);

    };


    // =========================================================
    // OPEN EDIT MODAL
    // =========================================================

    const openEditModal = (match) => {

        setEditingMatch(match);

        setFormData({

            competition:
                match.competition,

            competitionType:
                match.competitionType,

            season:
                match.season,

            homeTeam:
                match.homeTeam,

            awayTeam:
                match.awayTeam,

            date:
                match.date,

            time:
                match.time,

            venue:
                match.venue,

            referee:
                match.referee,

            status:
                match.status,

        });

        setShowModal(true);

    };


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleInputChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // =========================================================
    // CREATE / UPDATE MATCH
    // =========================================================

    const handleSubmit = (e) => {

        e.preventDefault();


        if (
            !formData.homeTeam ||
            !formData.awayTeam
        ) {

            alert(
                "Please select both teams."
            );

            return;

        }


        if (
            formData.homeTeam ===
            formData.awayTeam
        ) {

            alert(
                "Home and away teams cannot be the same."
            );

            return;

        }


        if (editingMatch) {

            // UPDATE

            setMatches(
                (previous) =>
                    previous.map(
                        (match) => {

                            if (
                                match.id !==
                                editingMatch.id
                            ) {

                                return match;

                            }


                            const home =
                                teams.find(
                                    (team) =>
                                        team.name ===
                                        formData.homeTeam
                                );


                            const away =
                                teams.find(
                                    (team) =>
                                        team.name ===
                                        formData.awayTeam
                                );


                            return {

                                ...match,

                                ...formData,

                                homeShortName:
                                    home?.shortName ||
                                    "",

                                awayShortName:
                                    away?.shortName ||
                                    "",

                            };

                        }
                    )
            );

        } else {

            // CREATE

            const home =
                teams.find(
                    (team) =>
                        team.name ===
                        formData.homeTeam
                );


            const away =
                teams.find(
                    (team) =>
                        team.name ===
                        formData.awayTeam
                );


            const newMatch = {

                id:
                    Date.now(),

                ...formData,

                homeShortName:
                    home?.shortName ||
                    "",

                awayShortName:
                    away?.shortName ||
                    "",

                homeScore: null,

                awayScore: null,

            };


            setMatches(
                (previous) => [
                    newMatch,
                    ...previous,
                ]
            );

        }


        setShowModal(false);

        setEditingMatch(null);

    };


    // =========================================================
    // DELETE MATCH
    // =========================================================

    const handleDelete = (id) => {

        const match =
            matches.find(
                (item) =>
                    item.id === id
            );


        const confirmed =
            window.confirm(
                `Delete ${match?.homeTeam} vs ${match?.awayTeam}?`
            );


        if (!confirmed) {
            return;
        }


        setMatches(
            (previous) =>
                previous.filter(
                    (match) =>
                        match.id !== id
                )
        );

    };


    // =========================================================
    // OPEN RESULT MODAL
    // =========================================================

    const openResultModal = (match) => {

        setResultMatch(match);

        setResultData({

            homeScore:
                match.homeScore ?? "",

            awayScore:
                match.awayScore ?? "",

            homeGoals: "",

            awayGoals: "",

            notes: "",

        });

        setShowResultModal(true);

    };


    // =========================================================
    // HANDLE RESULT INPUT
    // =========================================================

    const handleResultChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setResultData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    // =========================================================
    // SAVE MATCH RESULT
    // =========================================================

    const handleResultSubmit = (e) => {

        e.preventDefault();


        if (
            resultData.homeScore === "" ||
            resultData.awayScore === ""
        ) {

            alert(
                "Please enter both scores."
            );

            return;

        }


        setMatches(
            (previous) =>
                previous.map(
                    (match) => {

                        if (
                            match.id !==
                            resultMatch.id
                        ) {

                            return match;

                        }


                        return {

                            ...match,

                            homeScore:
                                Number(
                                    resultData.homeScore
                                ),

                            awayScore:
                                Number(
                                    resultData.awayScore
                                ),

                            status:
                                "Completed",

                        };

                    }
                )
        );


        setShowResultModal(false);

        setResultMatch(null);

    };


    // =========================================================
    // PAGINATION
    // =========================================================

    const itemsPerPage = 6;

    const totalPages =
        Math.ceil(
            filteredMatches.length /
                itemsPerPage
        );


    const paginatedMatches =
        filteredMatches.slice(
            (currentPage - 1) *
                itemsPerPage,

            currentPage *
                itemsPerPage
        );


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="admin-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="admin-page-header">

                <div>

                    <div className="admin-breadcrumb">

                        <Link to="/admin">
                            Dashboard
                        </Link>

                        <i className="fa-solid fa-chevron-right"></i>

                        <span>
                            Matches
                        </span>

                    </div>


                    <span className="admin-eyebrow">
                        SPORTS MANAGEMENT
                    </span>


                    <h1>
                        Matches
                    </h1>


                    <p>
                        Schedule fixtures, manage match
                        details and record official results.
                    </p>

                </div>


                <button
                    className="admin-primary-button"
                    onClick={
                        openCreateModal
                    }
                >

                    <i className="fa-solid fa-plus"></i>

                    Create Match

                </button>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="management-stats">

                <div className="management-stat-card">

                    <div className="management-stat-icon">

                        <i className="fa-solid fa-futbol"></i>

                    </div>

                    <div>

                        <span>
                            Total Matches
                        </span>

                        <strong>
                            {totalMatches}
                        </strong>

                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon active">

                        <i className="fa-solid fa-circle-check"></i>

                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            {completedMatches}
                        </strong>

                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon upcoming">

                        <i className="fa-solid fa-calendar-days"></i>

                    </div>

                    <div>

                        <span>
                            Upcoming
                        </span>

                        <strong>
                            {upcomingMatches}
                        </strong>

                    </div>

                </div>


                <div className="management-stat-card">

                    <div className="management-stat-icon cancelled">

                        <i className="fa-solid fa-ban"></i>

                    </div>

                    <div>

                        <span>
                            Cancelled
                        </span>

                        <strong>
                            {cancelledMatches}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                MANAGEMENT CARD
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
                            placeholder="Search teams or competitions..."
                            value={
                                searchTerm
                            }
                            onChange={(e) => {

                                setSearchTerm(
                                    e.target.value
                                );

                                setCurrentPage(1);

                            }}
                        />

                    </div>


                    <div className="management-filters">


                        <div className="filter-select">

                            <i className="fa-solid fa-filter"></i>

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(e) => {

                                    setStatusFilter(
                                        e.target.value
                                    );

                                    setCurrentPage(
                                        1
                                    );

                                }}
                            >

                                <option value="All">
                                    All Status
                                </option>

                                <option value="Upcoming">
                                    Upcoming
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Cancelled">
                                    Cancelled
                                </option>

                            </select>

                        </div>


                        <select
                            className="season-select"
                            value={
                                competitionFilter
                            }
                            onChange={(e) => {

                                setCompetitionFilter(
                                    e.target.value
                                );

                                setCurrentPage(
                                    1
                                );

                            }}
                        >

                            <option value="All">
                                All Competitions
                            </option>

                            <option value="League">
                                Leagues
                            </option>

                            <option value="Tournament">
                                Tournaments
                            </option>

                        </select>


                        <button className="export-button">

                            <i className="fa-solid fa-download"></i>

                            Export

                        </button>

                    </div>

                </div>


                {/* =============================================
                    MATCH CARDS
                ============================================= */}

                <div className="matches-admin-list">

                    {paginatedMatches.length > 0 ? (

                        paginatedMatches.map(
                            (match) => (

                                <div
                                    className="admin-match-card"
                                    key={match.id}
                                >

                                    {/* MATCH DATE */}

                                    <div className="admin-match-date">

                                        <strong>
                                            {match.date.split(
                                                " "
                                            )[0]}
                                        </strong>

                                        <span>
                                            {match.date.split(
                                                " "
                                            )[1]}
                                        </span>

                                        <small>
                                            {match.time}
                                        </small>

                                    </div>


                                    {/* COMPETITION */}

                                    <div className="admin-match-competition">

                                        <span className="competition-type">

                                            {match.competitionType}

                                        </span>

                                        <strong>
                                            {match.competition}
                                        </strong>

                                        <span>
                                            {match.season} Season
                                        </span>

                                    </div>


                                    {/* TEAMS */}

                                    <div className="admin-match-teams">

                                        <div className="match-team home">

                                            <strong>
                                                {match.homeTeam}
                                            </strong>

                                            <div className="admin-team-badge">
                                                {match.homeShortName}
                                            </div>

                                        </div>


                                        <div className="admin-match-score">

                                            {match.status ===
                                            "Completed" ? (

                                                <>
                                                    <strong>
                                                        {
                                                            match.homeScore
                                                        }
                                                    </strong>

                                                    <span>
                                                        -
                                                    </span>

                                                    <strong>
                                                        {
                                                            match.awayScore
                                                        }
                                                    </strong>
                                                </>

                                            ) : (

                                                <span className="vs-text">
                                                    VS
                                                </span>

                                            )}

                                        </div>


                                        <div className="match-team away">

                                            <div className="admin-team-badge">
                                                {match.awayShortName}
                                            </div>

                                            <strong>
                                                {match.awayTeam}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* VENUE */}

                                    <div className="admin-match-venue">

                                        <span>
                                            <i className="fa-solid fa-location-dot"></i>

                                            {match.venue}
                                        </span>

                                        <span>
                                            <i className="fa-solid fa-user-shield"></i>

                                            {match.referee}
                                        </span>

                                    </div>


                                    {/* STATUS */}

                                    <div className="admin-match-status">

                                        <span
                                            className={`status-badge ${match.status.toLowerCase()}`}
                                        >

                                            <span></span>

                                            {match.status}

                                        </span>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="match-actions">

                                        {match.status !==
                                            "Completed" &&
                                            match.status !==
                                                "Cancelled" && (

                                                <button
                                                    className="match-action result"
                                                    title="Enter Result"
                                                    onClick={() =>
                                                        openResultModal(
                                                            match
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-flag-checkered"></i>

                                                </button>

                                            )}


                                        <Link
                                            to={`/matches/${match.id}`}
                                            className="match-action view"
                                            title="View Match"
                                        >

                                            <i className="fa-solid fa-eye"></i>

                                        </Link>


                                        <button
                                            className="match-action edit"
                                            title="Edit Match"
                                            onClick={() =>
                                                openEditModal(
                                                    match
                                                )
                                            }
                                        >

                                            <i className="fa-solid fa-pen"></i>

                                        </button>


                                        <button
                                            className="match-action delete"
                                            title="Delete Match"
                                            onClick={() =>
                                                handleDelete(
                                                    match.id
                                                )
                                            }
                                        >

                                            <i className="fa-solid fa-trash"></i>

                                        </button>

                                    </div>

                                </div>

                            )

                        )

                    ) : (

                        <div className="empty-table">

                            <i className="fa-solid fa-futbol"></i>

                            <h3>
                                No matches found
                            </h3>

                            <p>
                                Try changing your filters
                                or search term.
                            </p>

                        </div>

                    )}

                </div>


                {/* =============================================
                    PAGINATION
                ============================================= */}

                <div className="management-footer">

                    <span>

                        Showing{" "}

                        <strong>
                            {
                                filteredMatches
                                    .length === 0
                                    ? 0
                                    : (
                                          currentPage -
                                          1
                                      ) *
                                          itemsPerPage +
                                      1
                            }
                        </strong>

                        {" "}to{" "}

                        <strong>
                            {Math.min(
                                currentPage *
                                    itemsPerPage,

                                filteredMatches.length
                            )}
                        </strong>

                        {" "}of{" "}

                        <strong>
                            {
                                filteredMatches.length
                            }
                        </strong>

                        {" "}matches

                    </span>


                    <div className="pagination">

                        <button
                            disabled={
                                currentPage ===
                                1
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        page - 1
                                )
                            }
                        >

                            <i className="fa-solid fa-chevron-left"></i>

                        </button>


                        {Array.from(
                            {
                                length:
                                    totalPages,
                            },
                            (_, index) =>
                                index + 1
                        ).map((page) => (

                            <button
                                key={page}
                                className={
                                    currentPage ===
                                    page
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        page
                                    )
                                }
                            >
                                {page}
                            </button>

                        ))}


                        <button
                            disabled={
                                currentPage ===
                                    totalPages ||
                                totalPages ===
                                    0
                            }
                            onClick={() =>
                                setCurrentPage(
                                    (page) =>
                                        page + 1
                                )
                            }
                        >

                            <i className="fa-solid fa-chevron-right"></i>

                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                CREATE / EDIT MATCH MODAL
            ================================================= */}

            {showModal && (

                <div
                    className="admin-modal-overlay"
                    onClick={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            setShowModal(
                                false
                            );

                        }

                    }}
                >

                    <div className="admin-modal large">

                        <div className="admin-modal-header">

                            <div>

                                <span>
                                    MATCH MANAGEMENT
                                </span>

                                <h2>

                                    {editingMatch
                                        ? "Edit Match"
                                        : "Create Match"}

                                </h2>

                            </div>


                            <button
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                            >

                                <i className="fa-solid fa-xmark"></i>

                            </button>

                        </div>


                        <form
                            className="match-form"
                            onSubmit={
                                handleSubmit
                            }
                        >


                            {/* COMPETITION */}

                            <div className="form-section-title">

                                Competition

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Competition
                                    </label>

                                    <input
                                        type="text"
                                        name="competition"
                                        value={
                                            formData.competition
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Type
                                    </label>

                                    <select
                                        name="competitionType"
                                        value={
                                            formData.competitionType
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    >

                                        <option>
                                            League
                                        </option>

                                        <option>
                                            Tournament
                                        </option>

                                    </select>

                                </div>


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

                            </div>


                            {/* TEAMS */}

                            <div className="form-section-title">

                                Teams

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Home Team
                                    </label>

                                    <select
                                        name="homeTeam"
                                        value={
                                            formData.homeTeam
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select home team
                                        </option>

                                        {teams.map(
                                            (
                                                team
                                            ) => (

                                                <option
                                                    key={
                                                        team.id
                                                    }
                                                    value={
                                                        team.name
                                                    }
                                                >
                                                    {
                                                        team.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="form-vs">

                                    VS

                                </div>


                                <div className="form-group">

                                    <label>
                                        Away Team
                                    </label>

                                    <select
                                        name="awayTeam"
                                        value={
                                            formData.awayTeam
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    >

                                        <option value="">
                                            Select away team
                                        </option>

                                        {teams.map(
                                            (
                                                team
                                            ) => (

                                                <option
                                                    key={
                                                        team.id
                                                    }
                                                    value={
                                                        team.name
                                                    }
                                                >
                                                    {
                                                        team.name
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                            </div>


                            {/* DATE / TIME */}

                            <div className="form-section-title">

                                Match Details

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="date"
                                        value={
                                            formData.date
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Time
                                    </label>

                                    <input
                                        type="time"
                                        name="time"
                                        value={
                                            formData.time
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Status
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
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>


                            <div className="form-row">

                                <div className="form-group">

                                    <label>
                                        Venue
                                    </label>

                                    <input
                                        type="text"
                                        name="venue"
                                        placeholder="Match venue"
                                        value={
                                            formData.venue
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Referee
                                    </label>

                                    <input
                                        type="text"
                                        name="referee"
                                        placeholder="Referee name"
                                        value={
                                            formData.referee
                                        }
                                        onChange={
                                            handleInputChange
                                        }
                                    />

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel"
                                    onClick={() =>
                                        setShowModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="modal-submit"
                                >

                                    <i className="fa-solid fa-check"></i>

                                    {editingMatch
                                        ? "Save Changes"
                                        : "Create Match"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                RESULT MODAL
            ================================================= */}

            {showResultModal &&
                resultMatch && (

                    <div
                        className="admin-modal-overlay"
                        onClick={(e) => {

                            if (
                                e.target ===
                                e.currentTarget
                            ) {

                                setShowResultModal(
                                    false
                                );

                            }

                        }}
                    >

                        <div className="admin-modal result-modal">

                            <div className="admin-modal-header">

                                <div>

                                    <span>
                                        MATCH RESULT
                                    </span>

                                    <h2>
                                        Enter Final Result
                                    </h2>

                                </div>


                                <button
                                    onClick={() =>
                                        setShowResultModal(
                                            false
                                        )
                                    }
                                >

                                    <i className="fa-solid fa-xmark"></i>

                                </button>

                            </div>


                            {/* MATCH */}

                            <div className="result-match-preview">

                                <span>
                                    {
                                        resultMatch.competition
                                    }
                                </span>


                                <div>

                                    <div>

                                        <strong>
                                            {
                                                resultMatch.homeShortName
                                            }
                                        </strong>

                                        <small>
                                            {
                                                resultMatch.homeTeam
                                            }
                                        </small>

                                    </div>


                                    <span>
                                        VS
                                    </span>


                                    <div>

                                        <strong>
                                            {
                                                resultMatch.awayShortName
                                            }
                                        </strong>

                                        <small>
                                            {
                                                resultMatch.awayTeam
                                            }
                                        </small>

                                    </div>

                                </div>

                            </div>


                            <form
                                className="result-form"
                                onSubmit={
                                    handleResultSubmit
                                }
                            >

                                <div className="score-inputs">

                                    <div>

                                        <label>
                                            {
                                                resultMatch.homeTeam
                                            }
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name="homeScore"
                                            value={
                                                resultData.homeScore
                                            }
                                            onChange={
                                                handleResultChange
                                            }
                                            required
                                        />

                                    </div>


                                    <span>
                                        -
                                    </span>


                                    <div>

                                        <label>
                                            {
                                                resultMatch.awayTeam
                                            }
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name="awayScore"
                                            value={
                                                resultData.awayScore
                                            }
                                            onChange={
                                                handleResultChange
                                            }
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="result-info-box">

                                    <i className="fa-solid fa-circle-info"></i>

                                    <p>
                                        Saving this result will
                                        mark the match as
                                        completed. In the live
                                        system, team standings
                                        and player statistics
                                        will then be updated
                                        automatically.
                                    </p>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Match Notes
                                    </label>

                                    <textarea
                                        name="notes"
                                        rows="3"
                                        placeholder="Optional match notes..."
                                        value={
                                            resultData.notes
                                        }
                                        onChange={
                                            handleResultChange
                                        }
                                    ></textarea>

                                </div>


                                <div className="modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel"
                                        onClick={() =>
                                            setShowResultModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="submit"
                                        className="modal-submit"
                                    >

                                        <i className="fa-solid fa-flag-checkered"></i>

                                        Save Result

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

        </div>

    );

};

export default Matches;

