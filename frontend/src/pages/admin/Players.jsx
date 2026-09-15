import React, { useMemo, useState } from "react";

const initialPlayers = [
    {
        id: 1,
        name: "Victor Macharia",
        email: "victor@example.com",
        team: "DeKUT Black Talons",
        position: "Forward",
        jerseyNumber: 10,
        age: 21,
        gender: "Male",
        status: "Active",
        joined: "12 Jan 2025",
    },
    {
        id: 2,
        name: "Jimmy Bii",
        email: "jimmy@example.com",
        team: "DeKUT Black Talons",
        position: "Defender",
        jerseyNumber: 4,
        age: 22,
        gender: "Male",
        status: "Active",
        joined: "15 Jan 2025",
    },
    {
        id: 3,
        name: "Mildred Kuria",
        email: "mildred@example.com",
        team: "DeKUT Black Talons Ladies",
        position: "Forward",
        jerseyNumber: 7,
        age: 21,
        gender: "Female",
        status: "Active",
        joined: "20 Jan 2025",
    },
    {
        id: 4,
        name: "Hillary Kiptoo",
        email: "hillary@example.com",
        team: "Karatina University",
        position: "Goalkeeper",
        jerseyNumber: 1,
        age: 23,
        gender: "Male",
        status: "Active",
        joined: "03 Feb 2025",
    },
    {
        id: 5,
        name: "Brian Otieno",
        email: "brian@example.com",
        team: "Nyeri Polytechnic",
        position: "Midfielder",
        jerseyNumber: 8,
        age: 20,
        gender: "Male",
        status: "Inactive",
        joined: "18 Feb 2025",
    },
    {
        id: 6,
        name: "Faith Njeri",
        email: "faith@example.com",
        team: "Karatina University Ladies",
        position: "Defender",
        jerseyNumber: 5,
        age: 20,
        gender: "Female",
        status: "Active",
        joined: "25 Feb 2025",
    },
    {
        id: 7,
        name: "Sharnie Coder",
        email: "sharnie@example.com",
        team: "Nyandarua Polytechnic",
        position: "Forward",
        jerseyNumber: 11,
        age: 22,
        gender: "Female",
        status: "Suspended",
        joined: "01 Mar 2025",
    },
    {
        id: 8,
        name: "Zanzi Bobo",
        email: "zanzi@example.com",
        team: "Michuki Technical",
        position: "Midfielder",
        jerseyNumber: 6,
        age: 21,
        gender: "Female",
        status: "Active",
        joined: "05 Mar 2025",
    },
];

const teams = [
    "DeKUT Black Talons",
    "DeKUT Black Talons Ladies",
    "Karatina University",
    "Karatina University Ladies",
    "Nyeri Polytechnic",
    "Nyandarua Polytechnic",
    "Michuki Technical",
    "Unassigned",
];

const positions = [
    "Forward",
    "Defender",
    "Midfielder",
    "Goalkeeper",
];

const formatDate = (date) => {
    return date;
};

const getStatusClass = (status) => {
    switch (status) {
        case "Active":
            return "status-badge status-success";

        case "Inactive":
            return "status-badge status-pending";

        case "Suspended":
            return "status-badge status-danger";

        default:
            return "status-badge";
    }
};

const Players = () => {
    const [players, setPlayers] = useState(initialPlayers);

    const [searchTerm, setSearchTerm] = useState("");
    const [teamFilter, setTeamFilter] = useState("All");
    const [positionFilter, setPositionFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [genderFilter, setGenderFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [editingPlayer, setEditingPlayer] = useState(null);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const playersPerPage = 6;

    const emptyForm = {
        name: "",
        email: "",
        team: "Unassigned",
        position: "Forward",
        jerseyNumber: "",
        age: "",
        gender: "Male",
        status: "Active",
        joined: "",
    };

    const [formData, setFormData] = useState(emptyForm);

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalPlayers = players.length;

    const activePlayers = players.filter(
        (player) => player.status === "Active"
    ).length;

    const inactivePlayers = players.filter(
        (player) => player.status === "Inactive"
    ).length;

    const suspendedPlayers = players.filter(
        (player) => player.status === "Suspended"
    ).length;

    const malePlayers = players.filter(
        (player) => player.gender === "Male"
    ).length;

    const femalePlayers = players.filter(
        (player) => player.gender === "Female"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Filtering
    |--------------------------------------------------------------------------
    */

    const filteredPlayers = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return players.filter((player) => {
            const matchesSearch =
                player.name.toLowerCase().includes(search) ||
                player.email.toLowerCase().includes(search) ||
                player.team.toLowerCase().includes(search) ||
                String(player.jerseyNumber).includes(search);

            const matchesTeam =
                teamFilter === "All" ||
                player.team === teamFilter;

            const matchesPosition =
                positionFilter === "All" ||
                player.position === positionFilter;

            const matchesStatus =
                statusFilter === "All" ||
                player.status === statusFilter;

            const matchesGender =
                genderFilter === "All" ||
                player.gender === genderFilter;

            return (
                matchesSearch &&
                matchesTeam &&
                matchesPosition &&
                matchesStatus &&
                matchesGender
            );
        });
    }, [
        players,
        searchTerm,
        teamFilter,
        positionFilter,
        statusFilter,
        genderFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const totalPages = Math.ceil(
        filteredPlayers.length / playersPerPage
    );

    const startIndex = (currentPage - 1) * playersPerPage;

    const currentPlayers = filteredPlayers.slice(
        startIndex,
        startIndex + playersPerPage
    );

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Form Handling
    |--------------------------------------------------------------------------
    */

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const openCreateModal = () => {
        setEditingPlayer(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (player) => {
        setEditingPlayer(player);

        setFormData({
            name: player.name,
            email: player.email,
            team: player.team,
            position: player.position,
            jerseyNumber: player.jerseyNumber,
            age: player.age,
            gender: player.gender,
            status: player.status,
            joined: player.joined,
        });

        setShowModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Save Player
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            window.alert("Please enter the player's name.");
            return;
        }

        if (!formData.email.trim()) {
            window.alert("Please enter the player's email.");
            return;
        }

        if (!formData.jerseyNumber) {
            window.alert("Please enter a jersey number.");
            return;
        }

        if (editingPlayer) {
            setPlayers((currentPlayers) =>
                currentPlayers.map((player) =>
                    player.id === editingPlayer.id
                        ? {
                              ...player,
                              ...formData,
                              jerseyNumber: Number(
                                  formData.jerseyNumber
                              ),
                              age: Number(formData.age),
                          }
                        : player
                )
            );
        } else {
            const newPlayer = {
                id: Date.now(),
                ...formData,
                jerseyNumber: Number(formData.jerseyNumber),
                age: Number(formData.age),
                joined:
                    formData.joined ||
                    new Date().toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
            };

            setPlayers((currentPlayers) => [
                newPlayer,
                ...currentPlayers,
            ]);
        }

        setShowModal(false);
        setEditingPlayer(null);
        setFormData(emptyForm);
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Player
    |--------------------------------------------------------------------------
    */

    const handleDelete = (playerId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this player?"
        );

        if (!confirmed) return;

        setPlayers((currentPlayers) =>
            currentPlayers.filter(
                (player) => player.id !== playerId
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | View Player
    |--------------------------------------------------------------------------
    */

    const handleView = (player) => {
        setSelectedPlayer(player);
        setShowDetailsModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Toggle Player Status
    |--------------------------------------------------------------------------
    */

    const togglePlayerStatus = (player) => {
        const nextStatus =
            player.status === "Active"
                ? "Inactive"
                : "Active";

        setPlayers((currentPlayers) =>
            currentPlayers.map((item) =>
                item.id === player.id
                    ? {
                          ...item,
                          status: nextStatus,
                      }
                    : item
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Filters
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {
        setSearchTerm("");
        setTeamFilter("All");
        setPositionFilter("All");
        setStatusFilter("All");
        setGenderFilter("All");
        setCurrentPage(1);
    };

    return (
        <div className="admin-page">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

            <div className="admin-page-header">

                <div>
                    <span className="admin-eyebrow">
                        Sports Management
                    </span>

                    <h1>Players</h1>

                    <p>
                        Manage registered floorball players,
                        teams, positions and player statuses.
                    </p>
                </div>

                <div className="admin-header-actions">

                    <button
                        className="btn btn-primary"
                        onClick={openCreateModal}
                    >
                        <i className="fa-solid fa-user-plus"></i>
                        Add Player
                    </button>

                </div>

            </div>

            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <div className="admin-stats-grid">

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div>
                        <span>Total Players</span>
                        <strong>{totalPlayers}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-user-check"></i>
                    </div>

                    <div>
                        <span>Active</span>
                        <strong>{activePlayers}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-user-clock"></i>
                    </div>

                    <div>
                        <span>Inactive</span>
                        <strong>{inactivePlayers}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-user-slash"></i>
                    </div>

                    <div>
                        <span>Suspended</span>
                        <strong>{suspendedPlayers}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-mars"></i>
                    </div>

                    <div>
                        <span>Male</span>
                        <strong>{malePlayers}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-venus"></i>
                    </div>

                    <div>
                        <span>Female</span>
                        <strong>{femalePlayers}</strong>
                    </div>

                </div>

            </div>

            {/* =========================================================
                FILTERS
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-card-header">

                    <div>
                        <h2>Player Management</h2>

                        <p>
                            {filteredPlayers.length} player
                            {filteredPlayers.length !== 1
                                ? "s"
                                : ""}{" "}
                            found
                        </p>
                    </div>

                </div>

                <div className="admin-filters">

                    <div className="admin-search">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search players, teams or jersey numbers..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(
                                    event.target.value
                                );
                                setCurrentPage(1);
                            }}
                        />

                    </div>

                    <select
                        value={teamFilter}
                        onChange={(event) => {
                            setTeamFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">
                            All Teams
                        </option>

                        {teams.map((team) => (
                            <option
                                key={team}
                                value={team}
                            >
                                {team}
                            </option>
                        ))}
                    </select>

                    <select
                        value={positionFilter}
                        onChange={(event) => {
                            setPositionFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">
                            All Positions
                        </option>

                        {positions.map((position) => (
                            <option
                                key={position}
                                value={position}
                            >
                                {position}
                            </option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(event) => {
                            setStatusFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">
                            All Status
                        </option>

                        <option value="Active">
                            Active
                        </option>

                        <option value="Inactive">
                            Inactive
                        </option>

                        <option value="Suspended">
                            Suspended
                        </option>
                    </select>

                    <select
                        value={genderFilter}
                        onChange={(event) => {
                            setGenderFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">
                            All Gender
                        </option>

                        <option value="Male">
                            Male
                        </option>

                        <option value="Female">
                            Female
                        </option>
                    </select>

                    <button
                        className="btn btn-light"
                        onClick={resetFilters}
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                        Reset
                    </button>

                </div>

            </div>

            {/* =========================================================
                PLAYERS TABLE
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>

                            <tr>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Position</th>
                                <th>Jersey</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {currentPlayers.length > 0 ? (
                                currentPlayers.map(
                                    (player) => (
                                        <tr
                                            key={
                                                player.id
                                            }
                                        >

                                            {/* PLAYER */}

                                            <td>

                                                <div className="table-user">

                                                    <div className="table-avatar">
                                                        {player.name
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                player.name
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                player.email
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* TEAM */}

                                            <td>
                                                <strong>
                                                    {
                                                        player.team
                                                    }
                                                </strong>
                                            </td>

                                            {/* POSITION */}

                                            <td>
                                                <span className="position-badge">
                                                    {
                                                        player.position
                                                    }
                                                </span>
                                            </td>

                                            {/* JERSEY */}

                                            <td>

                                                <span className="jersey-number">
                                                    #
                                                    {
                                                        player.jerseyNumber
                                                    }
                                                </span>

                                            </td>

                                            {/* AGE */}

                                            <td>
                                                {
                                                    player.age
                                                }
                                            </td>

                                            {/* GENDER */}

                                            <td>
                                                {
                                                    player.gender
                                                }
                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        player.status
                                                    )}
                                                >
                                                    {
                                                        player.status
                                                    }
                                                </span>

                                            </td>

                                            {/* JOINED */}

                                            <td>
                                                {formatDate(
                                                    player.joined
                                                )}
                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="admin-table-actions">

                                                    <button
                                                        className="icon-btn"
                                                        title="View Player"
                                                        onClick={() =>
                                                            handleView(
                                                                player
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn"
                                                        title="Edit Player"
                                                        onClick={() =>
                                                            openEditModal(
                                                                player
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn"
                                                        title={
                                                            player.status ===
                                                            "Active"
                                                                ? "Deactivate"
                                                                : "Activate"
                                                        }
                                                        onClick={() =>
                                                            togglePlayerStatus(
                                                                player
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                player.status ===
                                                                "Active"
                                                                    ? "fa-solid fa-user-slash"
                                                                    : "fa-solid fa-user-check"
                                                            }
                                                        ></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn danger"
                                                        title="Delete Player"
                                                        onClick={() =>
                                                            handleDelete(
                                                                player.id
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>

                                    <td
                                        colSpan="9"
                                        className="empty-table"
                                    >

                                        <i className="fa-solid fa-user-slash"></i>

                                        <h3>
                                            No players found
                                        </h3>

                                        <p>
                                            Try changing your
                                            search or filters.
                                        </p>

                                    </td>

                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                {/* =====================================================
                    PAGINATION
                ===================================================== */}

                {totalPages > 1 && (
                    <div className="admin-pagination">

                        <button
                            disabled={
                                currentPage === 1
                            }
                            onClick={() =>
                                changePage(
                                    currentPage - 1
                                )
                            }
                        >
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>

                        {Array.from(
                            {
                                length: totalPages,
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
                                    changePage(page)
                                }
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() =>
                                changePage(
                                    currentPage + 1
                                )
                            }
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                    </div>
                )}

            </div>

            {/* =========================================================
                CREATE / EDIT PLAYER MODAL
            ========================================================= */}

            {showModal && (
                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <div className="admin-modal-header">

                            <div>

                                <span className="admin-eyebrow">
                                    Player Management
                                </span>

                                <h2>
                                    {editingPlayer
                                        ? "Edit Player"
                                        : "Add Player"}
                                </h2>

                            </div>

                            <button
                                className="modal-close"
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
                            onSubmit={handleSubmit}
                        >

                            <div className="admin-modal-body">

                                <div className="form-grid">

                                    {/* NAME */}

                                    <div className="form-group">

                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter player's full name"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* EMAIL */}

                                    <div className="form-group">

                                        <label>
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="player@example.com"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* TEAM */}

                                    <div className="form-group">

                                        <label>
                                            Team
                                        </label>

                                        <select
                                            name="team"
                                            value={
                                                formData.team
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        >

                                            {teams.map(
                                                (
                                                    team
                                                ) => (
                                                    <option
                                                        key={
                                                            team
                                                        }
                                                        value={
                                                            team
                                                        }
                                                    >
                                                        {
                                                            team
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    {/* POSITION */}

                                    <div className="form-group">

                                        <label>
                                            Position
                                        </label>

                                        <select
                                            name="position"
                                            value={
                                                formData.position
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        >

                                            {positions.map(
                                                (
                                                    position
                                                ) => (
                                                    <option
                                                        key={
                                                            position
                                                        }
                                                        value={
                                                            position
                                                        }
                                                    >
                                                        {
                                                            position
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    {/* JERSEY NUMBER */}

                                    <div className="form-group">

                                        <label>
                                            Jersey Number
                                        </label>

                                        <input
                                            type="number"
                                            name="jerseyNumber"
                                            min="0"
                                            max="99"
                                            placeholder="e.g. 10"
                                            value={
                                                formData.jerseyNumber
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* AGE */}

                                    <div className="form-group">

                                        <label>
                                            Age
                                        </label>

                                        <input
                                            type="number"
                                            name="age"
                                            min="10"
                                            max="70"
                                            placeholder="Player age"
                                            value={
                                                formData.age
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                    </div>

                                    {/* GENDER */}

                                    <div className="form-group">

                                        <label>
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            value={
                                                formData.gender
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        >

                                            <option value="Male">
                                                Male
                                            </option>

                                            <option value="Female">
                                                Female
                                            </option>

                                        </select>

                                    </div>

                                    {/* STATUS */}

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

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>

                                            <option value="Suspended">
                                                Suspended
                                            </option>

                                        </select>

                                    </div>

                                    {/* JOINED */}

                                    <div className="form-group">

                                        <label>
                                            Joined
                                        </label>

                                        <input
                                            type="text"
                                            name="joined"
                                            placeholder="e.g. 15 Sep 2026"
                                            value={
                                                formData.joined
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                            <div className="admin-modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-light"
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
                                    className="btn btn-primary"
                                >

                                    <i className="fa-solid fa-check"></i>

                                    {editingPlayer
                                        ? "Save Changes"
                                        : "Add Player"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =========================================================
                PLAYER DETAILS MODAL
            ========================================================= */}

            {showDetailsModal &&
                selectedPlayer && (
                    <div className="admin-modal-overlay">

                        <div className="admin-modal">

                            <div className="admin-modal-header">

                                <div>

                                    <span className="admin-eyebrow">
                                        Player Profile
                                    </span>

                                    <h2>
                                        {
                                            selectedPlayer.name
                                        }
                                    </h2>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowDetailsModal(
                                            false
                                        )
                                    }
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            </div>

                            <div className="admin-modal-body">

                                {/* PROFILE */}

                                <div className="player-profile-preview">

                                    <div className="player-large-avatar">

                                        {selectedPlayer.name
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                selectedPlayer.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                selectedPlayer.email
                                            }
                                        </p>

                                        <span
                                            className={getStatusClass(
                                                selectedPlayer.status
                                            )}
                                        >
                                            {
                                                selectedPlayer.status
                                            }
                                        </span>

                                    </div>

                                </div>

                                {/* DETAILS */}

                                <div className="order-detail-grid">

                                    <div className="detail-item">

                                        <span>
                                            Team
                                        </span>

                                        <strong>
                                            {
                                                selectedPlayer.team
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Position
                                        </span>

                                        <strong>
                                            {
                                                selectedPlayer.position
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Jersey Number
                                        </span>

                                        <strong>
                                            #
                                            {
                                                selectedPlayer.jerseyNumber
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Age
                                        </span>

                                        <strong>
                                            {
                                                selectedPlayer.age
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Gender
                                        </span>

                                        <strong>
                                            {
                                                selectedPlayer.gender
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Joined
                                        </span>

                                        <strong>
                                            {
                                                selectedPlayer.joined
                                            }
                                        </strong>

                                    </div>

                                </div>

                                {/* FUTURE STATISTICS */}

                                <div className="player-stat-placeholder">

                                    <div>
                                        <span>
                                            Matches
                                        </span>
                                        <strong>
                                            0
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Goals
                                        </span>
                                        <strong>
                                            0
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Assists
                                        </span>
                                        <strong>
                                            0
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Points
                                        </span>
                                        <strong>
                                            0
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-modal-footer">

                                <button
                                    className="btn btn-light"
                                    onClick={() =>
                                        setShowDetailsModal(
                                            false
                                        )
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowDetailsModal(
                                            false
                                        );
                                        openEditModal(
                                            selectedPlayer
                                        );
                                    }}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit Player
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
};

export default Players;

