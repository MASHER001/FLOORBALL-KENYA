import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialTeams = [
    {
        id: 1,
        name: "DeKUT Black Talons",
        shortName: "BKT",
        location: "Nyeri",
        manager: "Victor Macharia",
        email: "blacktalons@example.com",
        phone: "+254 700 000 001",
        players: 18,
        league: "Kenya University Floorball League",
        status: "Active",
        founded: 2024,
        dateRegistered: "2026-01-15",
    },
    {
        id: 2,
        name: "Karatina Blazers",
        shortName: "KBL",
        location: "Karatina",
        manager: "James Mwangi",
        email: "karatinablazers@example.com",
        phone: "+254 700 000 002",
        players: 16,
        league: "Central Kenya Floorball League",
        status: "Active",
        founded: 2023,
        dateRegistered: "2026-01-18",
    },
    {
        id: 3,
        name: "Chuka Warriors",
        shortName: "CWR",
        location: "Chuka",
        manager: "Brian Kimathi",
        email: "chukawarriors@example.com",
        phone: "+254 700 000 003",
        players: 17,
        league: "Kenya University Floorball League",
        status: "Active",
        founded: 2022,
        dateRegistered: "2026-02-02",
    },
    {
        id: 4,
        name: "SEKU Eagles",
        shortName: "SEK",
        location: "Kitui",
        manager: "Daniel Mutua",
        email: "sekueagles@example.com",
        phone: "+254 700 000 004",
        players: 15,
        league: "Kenya University Floorball League",
        status: "Pending",
        founded: 2025,
        dateRegistered: "2026-02-12",
    },
    {
        id: 5,
        name: "Nyandarua Panthers",
        shortName: "NYP",
        location: "Nyandarua",
        manager: "Eric Kariuki",
        email: "nyandaruapanthers@example.com",
        phone: "+254 700 000 005",
        players: 14,
        league: "Central Kenya Floorball League",
        status: "Active",
        founded: 2024,
        dateRegistered: "2026-02-20",
    },
    {
        id: 6,
        name: "Michuki Lions",
        shortName: "MCL",
        location: "Murang'a",
        manager: "Peter Maina",
        email: "michukilions@example.com",
        phone: "+254 700 000 006",
        players: 12,
        league: "Central Kenya Floorball League",
        status: "Suspended",
        founded: 2023,
        dateRegistered: "2026-03-01",
    },
    {
        id: 7,
        name: "Nairobi Floorball Club",
        shortName: "NFC",
        location: "Nairobi",
        manager: "Kevin Otieno",
        email: "nairobi@example.com",
        phone: "+254 700 000 007",
        players: 20,
        league: "Kenya National Floorball League",
        status: "Active",
        founded: 2021,
        dateRegistered: "2026-03-05",
    },
    {
        id: 8,
        name: "Eldoret Strikers",
        shortName: "EDS",
        location: "Eldoret",
        manager: "Collins Kiptoo",
        email: "eldoret@example.com",
        phone: "+254 700 000 008",
        players: 13,
        league: "Kenya National Floorball League",
        status: "Pending",
        founded: 2025,
        dateRegistered: "2026-03-10",
    },
];

const emptyTeam = {
    name: "",
    shortName: "",
    location: "",
    manager: "",
    email: "",
    phone: "",
    players: 0,
    league: "",
    status: "Pending",
    founded: "",
};

const statusOptions = ["All", "Active", "Pending", "Suspended"];

function Teams() {
    const [teams, setTeams] = useState(initialTeams);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [leagueFilter, setLeagueFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingTeam, setEditingTeam] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [formData, setFormData] = useState(emptyTeam);

    const [currentPage, setCurrentPage] = useState(1);

    const teamsPerPage = 6;

    const leagues = [
        "Kenya University Floorball League",
        "Central Kenya Floorball League",
        "Kenya National Floorball League",
    ];

    const filteredTeams = useMemo(() => {
        return teams.filter((team) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                team.name.toLowerCase().includes(search) ||
                team.shortName.toLowerCase().includes(search) ||
                team.location.toLowerCase().includes(search) ||
                team.manager.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" || team.status === statusFilter;

            const matchesLeague =
                leagueFilter === "All" || team.league === leagueFilter;

            return matchesSearch && matchesStatus && matchesLeague;
        });
    }, [teams, searchTerm, statusFilter, leagueFilter]);

    const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

    const paginatedTeams = filteredTeams.slice(
        (currentPage - 1) * teamsPerPage,
        currentPage * teamsPerPage
    );

    const stats = {
        total: teams.length,
        active: teams.filter((team) => team.status === "Active").length,
        pending: teams.filter((team) => team.status === "Pending").length,
        suspended: teams.filter((team) => team.status === "Suspended").length,
        players: teams.reduce((total, team) => total + Number(team.players), 0),
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-KE", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Active":
                return "status-badge success";
            case "Pending":
                return "status-badge warning";
            case "Suspended":
                return "status-badge danger";
            default:
                return "status-badge";
        }
    };

    const openCreateModal = () => {
        setEditingTeam(null);
        setFormData(emptyTeam);
        setShowModal(true);
    };

    const openEditModal = (team) => {
        setEditingTeam(team);
        setFormData({
            name: team.name,
            shortName: team.shortName,
            location: team.location,
            manager: team.manager,
            email: team.email,
            phone: team.phone,
            players: team.players,
            league: team.league,
            status: team.status,
            founded: team.founded,
        });
        setShowModal(true);
    };

    const openDetailsModal = (team) => {
        setSelectedTeam(team);
        setShowDetails(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.name || !formData.shortName || !formData.location) {
            alert("Please fill in the required team information.");
            return;
        }

        if (editingTeam) {
            setTeams((previousTeams) =>
                previousTeams.map((team) =>
                    team.id === editingTeam.id
                        ? {
                              ...team,
                              ...formData,
                              players: Number(formData.players),
                              founded: Number(formData.founded),
                          }
                        : team
                )
            );
        } else {
            const newTeam = {
                id: Date.now(),
                ...formData,
                players: Number(formData.players),
                founded: Number(formData.founded),
                dateRegistered: new Date().toISOString().split("T")[0],
            };

            setTeams((previousTeams) => [newTeam, ...previousTeams]);
        }

        setShowModal(false);
        setEditingTeam(null);
        setFormData(emptyTeam);
    };

    const handleDelete = (teamId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this team?"
        );

        if (!confirmed) return;

        setTeams((previousTeams) =>
            previousTeams.filter((team) => team.id !== teamId)
        );
    };

    const updateStatus = (teamId, status) => {
        setTeams((previousTeams) =>
            previousTeams.map((team) =>
                team.id === teamId ? { ...team, status } : team
            )
        );
    };

    const approveTeam = (teamId) => {
        updateStatus(teamId, "Active");
    };

    const suspendTeam = (teamId) => {
        updateStatus(teamId, "Suspended");
    };

    const activateTeam = (teamId) => {
        updateStatus(teamId, "Active");
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="admin-page">
            {/* PAGE HEADER */}
            <div className="admin-page-header">
                <div>
                    <span className="admin-eyebrow">TEAM MANAGEMENT</span>

                    <h1>Teams</h1>

                    <p>
                        Manage registered floorball teams, managers,
                        competitions and team status.
                    </p>
                </div>

                <button className="btn btn-primary" onClick={openCreateModal}>
                    <i className="fa-solid fa-plus"></i>
                    Add Team
                </button>
            </div>

            {/* STATISTICS */}
            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>

                    <div>
                        <span>Total Teams</span>
                        <strong>{stats.total}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon success">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Active Teams</span>
                        <strong>{stats.active}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon warning">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <span>Pending Approval</span>
                        <strong>{stats.pending}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon danger">
                        <i className="fa-solid fa-ban"></i>
                    </div>

                    <div>
                        <span>Suspended</span>
                        <strong>{stats.suspended}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div>
                        <span>Registered Players</span>
                        <strong>{stats.players}</strong>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="admin-filter-card">
                <div className="admin-search">
                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search team, manager or location..."
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <select
                    value={leagueFilter}
                    onChange={(event) => {
                        setLeagueFilter(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="All">All Leagues</option>

                    {leagues.map((league) => (
                        <option key={league} value={league}>
                            {league}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(event) => {
                        setStatusFilter(event.target.value);
                        setCurrentPage(1);
                    }}
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>
                            {status === "All" ? "All Statuses" : status}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                        setLeagueFilter("All");
                        setCurrentPage(1);
                    }}
                >
                    <i className="fa-solid fa-rotate-left"></i>
                    Reset
                </button>
            </div>

            {/* TEAM TABLE */}
            <div className="admin-table-card">
                <div className="admin-table-header">
                    <div>
                        <h2>Registered Teams</h2>

                        <p>
                            Showing {filteredTeams.length} team
                            {filteredTeams.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>

                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Team</th>
                                <th>Manager</th>
                                <th>Location</th>
                                <th>League</th>
                                <th>Players</th>
                                <th>Status</th>
                                <th>Registered</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedTeams.length > 0 ? (
                                paginatedTeams.map((team) => (
                                    <tr key={team.id}>
                                        <td>
                                            <div className="admin-team-cell">
                                                <div className="team-logo-placeholder">
                                                    {team.shortName.substring(
                                                        0,
                                                        3
                                                    )}
                                                </div>

                                                <div>
                                                    <strong>{team.name}</strong>

                                                    <span>
                                                        {team.shortName}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="admin-person-cell">
                                                <strong>
                                                    {team.manager}
                                                </strong>

                                                <span>{team.email}</span>
                                            </div>
                                        </td>

                                        <td>
                                            <span>
                                                <i className="fa-solid fa-location-dot"></i>{" "}
                                                {team.location}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="competition-name">
                                                {team.league}
                                            </span>
                                        </td>

                                        <td>
                                            <strong>{team.players}</strong>
                                        </td>

                                        <td>
                                            <span
                                                className={getStatusClass(
                                                    team.status
                                                )}
                                            >
                                                {team.status}
                                            </span>
                                        </td>

                                        <td>
                                            {formatDate(team.dateRegistered)}
                                        </td>

                                        <td>
                                            <div className="admin-action-buttons">
                                                <button
                                                    className="icon-btn"
                                                    title="View Team"
                                                    onClick={() =>
                                                        openDetailsModal(team)
                                                    }
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>

                                                <Link
                                                    to={`/teams/${team.id}`}
                                                    className="icon-btn"
                                                    title="Public Team Profile"
                                                >
                                                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                </Link>

                                                <button
                                                    className="icon-btn"
                                                    title="Edit Team"
                                                    onClick={() =>
                                                        openEditModal(team)
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>

                                                {team.status === "Pending" && (
                                                    <button
                                                        className="icon-btn success"
                                                        title="Approve Team"
                                                        onClick={() =>
                                                            approveTeam(
                                                                team.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-check"></i>
                                                    </button>
                                                )}

                                                {team.status === "Active" && (
                                                    <button
                                                        className="icon-btn warning"
                                                        title="Suspend Team"
                                                        onClick={() =>
                                                            suspendTeam(
                                                                team.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-ban"></i>
                                                    </button>
                                                )}

                                                {team.status === "Suspended" && (
                                                    <button
                                                        className="icon-btn success"
                                                        title="Activate Team"
                                                        onClick={() =>
                                                            activateTeam(
                                                                team.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-power-off"></i>
                                                    </button>
                                                )}

                                                <button
                                                    className="icon-btn danger"
                                                    title="Delete Team"
                                                    onClick={() =>
                                                        handleDelete(team.id)
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
                                        className="admin-empty-state"
                                    >
                                        <i className="fa-solid fa-shield-halved"></i>

                                        <h3>No teams found</h3>

                                        <p>
                                            Try changing your filters or search
                                            terms.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="admin-pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() =>
                                handlePageChange(currentPage - 1)
                            }
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        {Array.from(
                            { length: totalPages },
                            (_, index) => index + 1
                        ).map((page) => (
                            <button
                                key={page}
                                className={
                                    currentPage === page ? "active" : ""
                                }
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                handlePageChange(currentPage + 1)
                            }
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="admin-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <div>
                                <span className="admin-eyebrow">
                                    TEAM MANAGEMENT
                                </span>

                                <h2>
                                    {editingTeam
                                        ? "Edit Team"
                                        : "Add New Team"}
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-form-grid">
                                <div className="form-group">
                                    <label>
                                        Team Name{" "}
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. DeKUT Black Talons"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Short Name{" "}
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="shortName"
                                        value={formData.shortName}
                                        onChange={handleChange}
                                        placeholder="e.g. BKT"
                                        maxLength="5"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Location{" "}
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Nyeri"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Year Founded</label>

                                    <input
                                        type="number"
                                        name="founded"
                                        value={formData.founded}
                                        onChange={handleChange}
                                        placeholder="2026"
                                        min="1900"
                                        max="2100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Team Manager</label>

                                    <input
                                        type="text"
                                        name="manager"
                                        value={formData.manager}
                                        onChange={handleChange}
                                        placeholder="Manager name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Number of Players</label>

                                    <input
                                        type="number"
                                        name="players"
                                        value={formData.players}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Manager Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="manager@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Manager Phone</label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+254..."
                                    />
                                </div>

                                <div className="form-group form-group-full">
                                    <label>League</label>

                                    <select
                                        name="league"
                                        value={formData.league}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select league
                                        </option>

                                        {leagues.map((league) => (
                                            <option
                                                key={league}
                                                value={league}
                                            >
                                                {league}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Suspended">
                                            Suspended
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <i className="fa-solid fa-check"></i>

                                    {editingTeam
                                        ? "Save Changes"
                                        : "Create Team"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TEAM DETAILS MODAL */}
            {showDetails && selectedTeam && (
                <div
                    className="admin-modal-overlay"
                    onClick={() => setShowDetails(false)}
                >
                    <div
                        className="admin-modal team-details-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-modal-header">
                            <div>
                                <span className="admin-eyebrow">
                                    TEAM PROFILE
                                </span>

                                <h2>{selectedTeam.name}</h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() => setShowDetails(false)}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <div className="team-details-hero">
                            <div className="team-large-logo">
                                {selectedTeam.shortName}
                            </div>

                            <div>
                                <h3>{selectedTeam.name}</h3>

                                <p>
                                    {selectedTeam.location} · Founded{" "}
                                    {selectedTeam.founded}
                                </p>

                                <span
                                    className={getStatusClass(
                                        selectedTeam.status
                                    )}
                                >
                                    {selectedTeam.status}
                                </span>
                            </div>
                        </div>

                        <div className="team-detail-grid">
                            <div className="detail-item">
                                <span>Short Name</span>
                                <strong>{selectedTeam.shortName}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Players</span>
                                <strong>{selectedTeam.players}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Manager</span>
                                <strong>{selectedTeam.manager}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Phone</span>
                                <strong>{selectedTeam.phone}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Email</span>
                                <strong>{selectedTeam.email}</strong>
                            </div>

                            <div className="detail-item">
                                <span>League</span>
                                <strong>{selectedTeam.league}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Founded</span>
                                <strong>{selectedTeam.founded}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Registered</span>
                                <strong>
                                    {formatDate(
                                        selectedTeam.dateRegistered
                                    )}
                                </strong>
                            </div>
                        </div>

                        <div className="admin-modal-footer">
                            <Link
                                to={`/teams/${selectedTeam.id}`}
                                className="btn btn-secondary"
                            >
                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                View Public Profile
                            </Link>

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowDetails(false);
                                    openEditModal(selectedTeam);
                                }}
                            >
                                <i className="fa-solid fa-pen"></i>
                                Edit Team
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Teams;

