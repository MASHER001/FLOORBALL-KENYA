import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    Search,
    Users,
    Edit3,
    Trash2,
    Eye,
    X,
    Save,
    Shield,
    UserRound,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

const initialPlayers = [
    {
        id: 1,
        name: "Victor Macharia",
        jerseyNumber: 10,
        position: "Forward",
        email: "victor@example.com",
        phone: "+254 700 111 111",
        status: "Active",
        joined: "2025",
        photo: "/images/players/profile-photos/victor-macharia.jpg",
    },
    {
        id: 2,
        name: "Brian Kiptoo",
        jerseyNumber: 7,
        position: "Forward",
        email: "brian@example.com",
        phone: "+254 700 222 222",
        status: "Active",
        joined: "2025",
        photo: "/images/players/profile-photos/brian-kiptoo.jpg",
    },
    {
        id: 3,
        name: "Daniel Mwangi",
        jerseyNumber: 1,
        position: "Goalkeeper",
        email: "daniel@example.com",
        phone: "+254 700 333 333",
        status: "Active",
        joined: "2024",
        photo: "/images/players/profile-photos/daniel-mwangi.jpg",
    },
    {
        id: 4,
        name: "Kevin Maina",
        jerseyNumber: 14,
        position: "Forward",
        email: "kevin@example.com",
        phone: "+254 700 444 444",
        status: "Active",
        joined: "2026",
        photo: "/images/players/profile-photos/kevin-maina.jpg",
    },
    {
        id: 5,
        name: "Samuel Kariuki",
        jerseyNumber: 4,
        position: "Defender",
        email: "samuel@example.com",
        phone: "+254 700 555 555",
        status: "Inactive",
        joined: "2025",
        photo: "/images/players/profile-photos/samuel-kariuki.jpg",
    },
    {
        id: 6,
        name: "Ian Njoroge",
        jerseyNumber: 18,
        position: "Defender",
        email: "ian@example.com",
        phone: "+254 700 666 666",
        status: "Active",
        joined: "2026",
        photo: "/images/players/profile-photos/ian-njoroge.jpg",
    },
];

const emptyPlayer = {
    name: "",
    jerseyNumber: "",
    position: "Forward",
    email: "",
    phone: "",
    status: "Active",
    joined: new Date().getFullYear().toString(),
    photo: "",
};

export default function ManagePlayers() {
    const [players, setPlayers] = useState(initialPlayers);
    const [searchQuery, setSearchQuery] = useState("");
    const [positionFilter, setPositionFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [formData, setFormData] = useState(emptyPlayer);

    const filteredPlayers = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return players.filter((player) => {
            const matchesSearch =
                !query ||
                player.name.toLowerCase().includes(query) ||
                player.email.toLowerCase().includes(query);

            const matchesPosition =
                positionFilter === "All" ||
                player.position === positionFilter;

            const matchesStatus =
                statusFilter === "All" ||
                player.status === statusFilter;

            return (
                matchesSearch &&
                matchesPosition &&
                matchesStatus
            );
        });
    }, [
        players,
        searchQuery,
        positionFilter,
        statusFilter,
    ]);

    const activePlayers = players.filter(
        (player) => player.status === "Active"
    ).length;

    const goalkeepers = players.filter(
        (player) => player.position === "Goalkeeper"
    ).length;

    const forwards = players.filter(
        (player) => player.position === "Forward"
    ).length;

    const defenders = players.filter(
        (player) => player.position === "Defender"
    ).length;

    const openAddModal = () => {
        setEditingPlayer(null);
        setFormData(emptyPlayer);
        setShowModal(true);
    };

    const openEditModal = (player) => {
        setEditingPlayer(player);
        setFormData({
            ...player,
            jerseyNumber: player.jerseyNumber.toString(),
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPlayer(null);
        setFormData(emptyPlayer);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editingPlayer) {
            setPlayers((current) =>
                current.map((player) =>
                    player.id === editingPlayer.id
                        ? {
                              ...player,
                              ...formData,
                              jerseyNumber: Number(
                                  formData.jerseyNumber
                              ),
                          }
                        : player
                )
            );
        } else {
            const newPlayer = {
                ...formData,
                id: Date.now(),
                jerseyNumber: Number(formData.jerseyNumber),
            };

            setPlayers((current) => [
                ...current,
                newPlayer,
            ]);
        }

        // TODO:
        // POST /api/team-manager/players
        // PUT /api/team-manager/players/{id}

        closeModal();
    };

    const removePlayer = (player) => {
        const confirmed = window.confirm(
            `Remove ${player.name} from your squad?`
        );

        if (!confirmed) return;

        setPlayers((current) =>
            current.filter(
                (item) => item.id !== player.id
            )
        );

        // TODO:
        // DELETE /api/team-manager/players/{id}
    };

    return (
        <div className="team-manager-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="team-manager-page-header">

                <div>

                    <Link
                        to="/team-manager"
                        className="team-manager-back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <span className="team-manager-eyebrow">
                        Squad Management
                    </span>

                    <h1>Manage Players</h1>

                    <p>
                        Manage the players registered under your team.
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openAddModal}
                >
                    <Plus size={17} />
                    Add Player
                </button>

            </div>

            {/* =================================================
                STATS
            ================================================= */}

            <div className="team-manager-player-stats">

                <div className="team-manager-player-stat">

                    <div className="team-manager-player-stat-icon">
                        <Users size={20} />
                    </div>

                    <div>
                        <strong>{players.length}</strong>
                        <span>Total Players</span>
                    </div>

                </div>

                <div className="team-manager-player-stat">

                    <div className="team-manager-player-stat-icon">
                        <CheckCircle2 size={20} />
                    </div>

                    <div>
                        <strong>{activePlayers}</strong>
                        <span>Active Players</span>
                    </div>

                </div>

                <div className="team-manager-player-stat">

                    <div className="team-manager-player-stat-icon">
                        <UserRound size={20} />
                    </div>

                    <div>
                        <strong>{forwards}</strong>
                        <span>Forwards</span>
                    </div>

                </div>

                <div className="team-manager-player-stat">

                    <div className="team-manager-player-stat-icon">
                        <Shield size={20} />
                    </div>

                    <div>
                        <strong>
                            {defenders + goalkeepers}
                        </strong>
                        <span>Defenders / Goalkeepers</span>
                    </div>

                </div>

            </div>

            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="team-manager-alert info">

                <AlertCircle size={19} />

                <div>
                    <strong>Player registration</strong>

                    <span>
                        Only add players who have agreed to represent
                        this team. Player registration and eligibility
                        can be verified by league administrators.
                    </span>
                </div>

            </div>

            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="team-manager-filter-card">

                <div className="team-manager-search">

                    <Search size={18} />

                    <input
                        type="search"
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                    />

                </div>

                <select
                    value={positionFilter}
                    onChange={(event) =>
                        setPositionFilter(event.target.value)
                    }
                >
                    <option value="All">All Positions</option>
                    <option value="Forward">Forward</option>
                    <option value="Defender">Defender</option>
                    <option value="Goalkeeper">
                        Goalkeeper
                    </option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>

            </div>

            {/* =================================================
                PLAYER TABLE
            ================================================= */}

            <div className="team-manager-card">

                <div className="team-manager-card-header">

                    <div>
                        <span className="team-manager-section-label">
                            Current Squad
                        </span>

                        <h2>Team Players</h2>

                        <p>
                            {filteredPlayers.length} players shown.
                        </p>
                    </div>

                    <Users size={23} />

                </div>

                {filteredPlayers.length > 0 ? (

                    <div className="team-manager-player-table-wrapper">

                        <table className="team-manager-player-table">

                            <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Number</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredPlayers.map((player) => (

                                    <tr key={player.id}>

                                        <td>

                                            <div className="team-manager-player-cell">

                                                <div className="team-manager-player-avatar">

                                                    <img
                                                        src={player.photo}
                                                        alt={player.name}
                                                        onError={(event) => {
                                                            event.currentTarget.style.display =
                                                                "none";
                                                            event.currentTarget.nextSibling.style.display =
                                                                "flex";
                                                        }}
                                                    />

                                                    <div className="team-manager-avatar-fallback">
                                                        {player.name
                                                            .split(" ")
                                                            .map(
                                                                (word) =>
                                                                    word[0]
                                                            )
                                                            .join("")
                                                            .slice(0, 2)}
                                                    </div>

                                                </div>

                                                <div>

                                                    <strong>
                                                        {player.name}
                                                    </strong>

                                                    <span>
                                                        {player.email}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>

                                            <span className="player-number-badge">
                                                #{player.jerseyNumber}
                                            </span>

                                        </td>

                                        <td>
                                            {player.position}
                                        </td>

                                        <td>

                                            <span
                                                className={`team-manager-status ${
                                                    player.status.toLowerCase()
                                                }`}
                                            >
                                                {player.status}
                                            </span>

                                        </td>

                                        <td>
                                            {player.joined}
                                        </td>

                                        <td>

                                            <div className="team-manager-action-buttons">

                                                <Link
                                                    to={`/players/${player.id}`}
                                                    className="team-manager-icon-btn"
                                                    title="View Player"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="team-manager-icon-btn"
                                                    onClick={() =>
                                                        openEditModal(
                                                            player
                                                        )
                                                    }
                                                    title="Edit Player"
                                                >
                                                    <Edit3 size={16} />
                                                </button>

                                                <button
                                                    type="button"
                                                    className="team-manager-icon-btn danger"
                                                    onClick={() =>
                                                        removePlayer(
                                                            player
                                                        )
                                                    }
                                                    title="Remove Player"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="team-manager-empty-state">

                        <Users size={32} />

                        <h3>No players found</h3>

                        <p>
                            Try changing your filters or add a new
                            player to the squad.
                        </p>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={openAddModal}
                        >
                            <Plus size={16} />
                            Add Player
                        </button>

                    </div>

                )}

            </div>

            {/* =================================================
                MODAL
            ================================================= */}

            {showModal && (

                <div className="team-manager-modal-overlay">

                    <div className="team-manager-modal">

                        <div className="team-manager-modal-header">

                            <div>

                                <span className="team-manager-section-label">
                                    {editingPlayer
                                        ? "Update Squad Member"
                                        : "New Squad Member"}
                                </span>

                                <h2>
                                    {editingPlayer
                                        ? "Edit Player"
                                        : "Add Player"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="team-manager-modal-close"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="team-manager-modal-body">

                                <div className="team-manager-form-grid">

                                    <div className="form-group">

                                        <label htmlFor="player-name">
                                            Full Name *
                                        </label>

                                        <input
                                            id="player-name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="form-group">

                                        <label htmlFor="jerseyNumber">
                                            Jersey Number *
                                        </label>

                                        <input
                                            id="jerseyNumber"
                                            name="jerseyNumber"
                                            type="number"
                                            min="0"
                                            max="99"
                                            value={
                                                formData.jerseyNumber
                                            }
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                    <div className="form-group">

                                        <label htmlFor="position">
                                            Position *
                                        </label>

                                        <select
                                            id="position"
                                            name="position"
                                            value={formData.position}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Forward">
                                                Forward
                                            </option>

                                            <option value="Defender">
                                                Defender
                                            </option>

                                            <option value="Goalkeeper">
                                                Goalkeeper
                                            </option>
                                        </select>

                                    </div>

                                    <div className="form-group">

                                        <label htmlFor="player-status">
                                            Status
                                        </label>

                                        <select
                                            id="player-status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>
                                        </select>

                                    </div>

                                    <div className="form-group">

                                        <label htmlFor="player-email">
                                            Email
                                        </label>

                                        <input
                                            id="player-email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    <div className="form-group">

                                        <label htmlFor="player-phone">
                                            Phone
                                        </label>

                                        <input
                                            id="player-phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>

                                <div className="team-manager-player-note">

                                    <AlertCircle size={17} />

                                    <span>
                                        In the production system, players
                                        should have their own accounts and
                                        can accept or decline a team
                                        invitation.
                                    </span>

                                </div>

                            </div>

                            <div className="team-manager-modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    <Save size={16} />

                                    {editingPlayer
                                        ? "Save Changes"
                                        : "Add Player"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

