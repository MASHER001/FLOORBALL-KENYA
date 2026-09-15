import React, { useMemo, useState } from "react";

const initialUsers = [
    {
        id: 1,
        name: "Victor Macharia",
        email: "victor@example.com",
        phone: "+254 700 000 001",
        role: "Player",
        team: "DeKUT Black Talons",
        status: "Active",
        joined: "2026-01-10",
        lastLogin: "2026-09-14",
    },
    {
        id: 2,
        name: "Jimmy Bii",
        email: "jimmy@example.com",
        phone: "+254 700 000 002",
        role: "Team Manager",
        team: "DeKUT Black Talons",
        status: "Active",
        joined: "2026-01-12",
        lastLogin: "2026-09-14",
    },
    {
        id: 3,
        name: "James Mwangi",
        email: "james@example.com",
        phone: "+254 700 000 003",
        role: "Team Manager",
        team: "Karatina Blazers",
        status: "Active",
        joined: "2026-01-18",
        lastLogin: "2026-09-12",
    },
    {
        id: 4,
        name: "Floorball Kenya Store",
        email: "store@example.com",
        phone: "+254 700 000 004",
        role: "Vendor",
        team: "-",
        status: "Active",
        joined: "2026-02-02",
        lastLogin: "2026-09-14",
    },
    {
        id: 5,
        name: "Brian Kimathi",
        email: "brian@example.com",
        phone: "+254 700 000 005",
        role: "Player",
        team: "Chuka Warriors",
        status: "Active",
        joined: "2026-02-05",
        lastLogin: "2026-09-10",
    },
    {
        id: 6,
        name: "Daniel Mutua",
        email: "daniel@example.com",
        phone: "+254 700 000 006",
        role: "Team Manager",
        team: "SEKU Eagles",
        status: "Pending",
        joined: "2026-02-12",
        lastLogin: "-",
    },
    {
        id: 7,
        name: "Eric Kariuki",
        email: "eric@example.com",
        phone: "+254 700 000 007",
        role: "Player",
        team: "Nyandarua Panthers",
        status: "Active",
        joined: "2026-02-20",
        lastLogin: "2026-09-09",
    },
    {
        id: 8,
        name: "Kevin Otieno",
        email: "kevin@example.com",
        phone: "+254 700 000 008",
        role: "Vendor",
        team: "-",
        status: "Pending",
        joined: "2026-03-01",
        lastLogin: "-",
    },
    {
        id: 9,
        name: "System Administrator",
        email: "admin@floorballkenya.com",
        phone: "+254 700 000 009",
        role: "Admin",
        team: "-",
        status: "Active",
        joined: "2026-01-01",
        lastLogin: "2026-09-15",
    },
    {
        id: 10,
        name: "Collins Kiptoo",
        email: "collins@example.com",
        phone: "+254 700 000 010",
        role: "Player",
        team: "Eldoret Strikers",
        status: "Suspended",
        joined: "2026-03-10",
        lastLogin: "2026-08-20",
    },
    {
        id: 11,
        name: "Mildred Kuria",
        email: "mildred@example.com",
        phone: "+254 700 000 011",
        role: "Player",
        team: "DeKUT Black Talons",
        status: "Active",
        joined: "2026-03-14",
        lastLogin: "2026-09-13",
    },
    {
        id: 12,
        name: "Sharnie Coder",
        email: "sharnie@example.com",
        phone: "+254 700 000 012",
        role: "Player",
        team: "Nairobi Floorball Club",
        status: "Active",
        joined: "2026-04-01",
        lastLogin: "2026-09-11",
    },
];

const emptyUser = {
    name: "",
    email: "",
    phone: "",
    role: "Player",
    team: "",
    status: "Active",
};

const roleOptions = [
    "Player",
    "Team Manager",
    "Vendor",
    "Admin",
];

const statusOptions = [
    "All",
    "Active",
    "Pending",
    "Suspended",
];

function Users() {
    const [users, setUsers] = useState(initialUsers);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingUser, setEditingUser] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const [formData, setFormData] = useState(emptyUser);

    const [currentPage, setCurrentPage] = useState(1);

    const usersPerPage = 7;

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                user.name.toLowerCase().includes(search) ||
                user.email.toLowerCase().includes(search) ||
                user.phone.toLowerCase().includes(search) ||
                user.team.toLowerCase().includes(search);

            const matchesRole =
                roleFilter === "All" || user.role === roleFilter;

            const matchesStatus =
                statusFilter === "All" ||
                user.status === statusFilter;

            return (
                matchesSearch &&
                matchesRole &&
                matchesStatus
            );
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    const totalPages = Math.ceil(
        filteredUsers.length / usersPerPage
    );

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * usersPerPage,
        currentPage * usersPerPage
    );

    const stats = {
        total: users.length,

        active: users.filter(
            (user) => user.status === "Active"
        ).length,

        pending: users.filter(
            (user) => user.status === "Pending"
        ).length,

        suspended: users.filter(
            (user) => user.status === "Suspended"
        ).length,

        players: users.filter(
            (user) => user.role === "Player"
        ).length,

        vendors: users.filter(
            (user) => user.role === "Vendor"
        ).length,

        managers: users.filter(
            (user) => user.role === "Team Manager"
        ).length,

        admins: users.filter(
            (user) => user.role === "Admin"
        ).length,
    };

    const formatDate = (date) => {
        if (!date || date === "-") {
            return "-";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-KE",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const getInitials = (name) => {
        if (!name) return "U";

        const words = name.trim().split(" ");

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    };

    const getRoleClass = (role) => {
        switch (role) {
            case "Admin":
                return "role-badge admin";

            case "Vendor":
                return "role-badge vendor";

            case "Team Manager":
                return "role-badge manager";

            case "Player":
                return "role-badge player";

            default:
                return "role-badge";
        }
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
        setEditingUser(null);
        setFormData(emptyUser);
        setShowModal(true);
    };

    const openEditModal = (user) => {
        setEditingUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            team: user.team === "-" ? "" : user.team,
            status: user.status,
        });

        setShowModal(true);
    };

    const openDetailsModal = (user) => {
        setSelectedUser(user);
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

        if (
            !formData.name ||
            !formData.email ||
            !formData.role
        ) {
            alert(
                "Please fill in the required user information."
            );

            return;
        }

        if (editingUser) {
            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === editingUser.id
                        ? {
                              ...user,
                              ...formData,
                              team:
                                  formData.team ||
                                  "-",
                          }
                        : user
                )
            );
        } else {
            const newUser = {
                id: Date.now(),
                ...formData,
                team:
                    formData.team ||
                    "-",
                joined:
                    new Date()
                        .toISOString()
                        .split("T")[0],
                lastLogin: "-",
            };

            setUsers((previousUsers) => [
                newUser,
                ...previousUsers,
            ]);
        }

        setShowModal(false);
        setEditingUser(null);
        setFormData(emptyUser);
    };

    const handleDelete = (userId) => {
        const user = users.find(
            (item) => item.id === userId
        );

        if (user?.role === "Admin") {
            alert(
                "Admin accounts should not be deleted from this interface."
            );

            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) return;

        setUsers((previousUsers) =>
            previousUsers.filter(
                (user) => user.id !== userId
            )
        );
    };

    const updateStatus = (userId, status) => {
        const user = users.find(
            (item) => item.id === userId
        );

        if (user?.role === "Admin") {
            alert(
                "The primary administrator account cannot be suspended."
            );

            return;
        }

        setUsers((previousUsers) =>
            previousUsers.map((user) =>
                user.id === userId
                    ? {
                          ...user,
                          status,
                      }
                    : user
            )
        );
    };

    const approveUser = (userId) => {
        updateStatus(userId, "Active");
    };

    const suspendUser = (userId) => {
        updateStatus(userId, "Suspended");
    };

    const activateUser = (userId) => {
        updateStatus(userId, "Active");
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="admin-page">

            {/* PAGE HEADER */}
            <div className="admin-page-header">

                <div>
                    <span className="admin-eyebrow">
                        USER MANAGEMENT
                    </span>

                    <h1>Users</h1>

                    <p>
                        Manage FloorballKenya.com accounts,
                        roles, permissions and account status.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={openCreateModal}
                >
                    <i className="fa-solid fa-user-plus"></i>
                    Add User
                </button>

            </div>

            {/* STATISTICS */}
            <div className="admin-stats-grid">

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div>
                        <span>Total Users</span>
                        <strong>{stats.total}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon success">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Active</span>
                        <strong>{stats.active}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon warning">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>{stats.pending}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon danger">
                        <i className="fa-solid fa-user-slash"></i>
                    </div>

                    <div>
                        <span>Suspended</span>
                        <strong>{stats.suspended}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-person-running"></i>
                    </div>

                    <div>
                        <span>Players</span>
                        <strong>{stats.players}</strong>
                    </div>

                </div>

            </div>

            {/* ROLE SUMMARY */}
            <div className="admin-role-summary">

                <div className="role-summary-item">
                    <span className="role-summary-icon player">
                        <i className="fa-solid fa-person-running"></i>
                    </span>

                    <div>
                        <strong>{stats.players}</strong>
                        <span>Players</span>
                    </div>
                </div>

                <div className="role-summary-item">
                    <span className="role-summary-icon manager">
                        <i className="fa-solid fa-people-group"></i>
                    </span>

                    <div>
                        <strong>{stats.managers}</strong>
                        <span>Team Managers</span>
                    </div>
                </div>

                <div className="role-summary-item">
                    <span className="role-summary-icon vendor">
                        <i className="fa-solid fa-store"></i>
                    </span>

                    <div>
                        <strong>{stats.vendors}</strong>
                        <span>Vendors</span>
                    </div>
                </div>

                <div className="role-summary-item">
                    <span className="role-summary-icon admin">
                        <i className="fa-solid fa-user-shield"></i>
                    </span>

                    <div>
                        <strong>{stats.admins}</strong>
                        <span>Administrators</span>
                    </div>
                </div>

            </div>

            {/* FILTERS */}
            <div className="admin-filter-card">

                <div className="admin-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search name, email, phone or team..."
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
                    value={roleFilter}
                    onChange={(event) => {
                        setRoleFilter(
                            event.target.value
                        );

                        setCurrentPage(1);
                    }}
                >
                    <option value="All">
                        All Roles
                    </option>

                    {roleOptions.map((role) => (
                        <option
                            key={role}
                            value={role}
                        >
                            {role}
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
                    {statusOptions.map(
                        (status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status === "All"
                                    ? "All Statuses"
                                    : status}
                            </option>
                        )
                    )}
                </select>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setSearchTerm("");
                        setRoleFilter("All");
                        setStatusFilter("All");
                        setCurrentPage(1);
                    }}
                >
                    <i className="fa-solid fa-rotate-left"></i>
                    Reset
                </button>

            </div>

            {/* USERS TABLE */}
            <div className="admin-table-card">

                <div className="admin-table-header">

                    <div>
                        <h2>
                            Registered Users
                        </h2>

                        <p>
                            Showing{" "}
                            {filteredUsers.length}{" "}
                            user
                            {filteredUsers.length !==
                            1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                </div>

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Team</th>
                                <th>Status</th>
                                <th>Joined</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {paginatedUsers.length >
                            0 ? (

                                paginatedUsers.map(
                                    (user) => (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >

                                            {/* USER */}
                                            <td>

                                                <div className="admin-person-profile">

                                                    <div className="user-avatar">
                                                        {getInitials(
                                                            user.name
                                                        )}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                user.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                user.email
                                                            }
                                                        </span>

                                                        <small>
                                                            {
                                                                user.phone
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* ROLE */}
                                            <td>

                                                <span
                                                    className={getRoleClass(
                                                        user.role
                                                    )}
                                                >
                                                    {
                                                        user.role
                                                    }
                                                </span>

                                            </td>

                                            {/* TEAM */}
                                            <td>

                                                {user.team ===
                                                "-" ? (
                                                    <span className="muted">
                                                        No team
                                                    </span>
                                                ) : (
                                                    <span className="competition-name">
                                                        {
                                                            user.team
                                                        }
                                                    </span>
                                                )}

                                            </td>

                                            {/* STATUS */}
                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        user.status
                                                    )}
                                                >
                                                    {
                                                        user.status
                                                    }
                                                </span>

                                            </td>

                                            {/* JOINED */}
                                            <td>
                                                {formatDate(
                                                    user.joined
                                                )}
                                            </td>

                                            {/* LAST LOGIN */}
                                            <td>
                                                {formatDate(
                                                    user.lastLogin
                                                )}
                                            </td>

                                            {/* ACTIONS */}
                                            <td>

                                                <div className="admin-action-buttons">

                                                    <button
                                                        className="icon-btn"
                                                        title="View User"
                                                        onClick={() =>
                                                            openDetailsModal(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn"
                                                        title="Edit User"
                                                        onClick={() =>
                                                            openEditModal(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    {user.status ===
                                                        "Pending" && (
                                                        <button
                                                            className="icon-btn success"
                                                            title="Approve User"
                                                            onClick={() =>
                                                                approveUser(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                    )}

                                                    {user.status ===
                                                        "Active" &&
                                                        user.role !==
                                                            "Admin" && (
                                                            <button
                                                                className="icon-btn warning"
                                                                title="Suspend User"
                                                                onClick={() =>
                                                                    suspendUser(
                                                                        user.id
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa-solid fa-ban"></i>
                                                            </button>
                                                        )}

                                                    {user.status ===
                                                        "Suspended" && (
                                                        <button
                                                            className="icon-btn success"
                                                            title="Activate User"
                                                            onClick={() =>
                                                                activateUser(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-power-off"></i>
                                                        </button>
                                                    )}

                                                    {user.role !==
                                                        "Admin" && (
                                                        <button
                                                            className="icon-btn danger"
                                                            title="Delete User"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="admin-empty-state"
                                    >

                                        <i className="fa-solid fa-users"></i>

                                        <h3>
                                            No users found
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

                {/* PAGINATION */}
                {totalPages > 1 && (

                    <div className="admin-pagination">

                        <button
                            disabled={
                                currentPage ===
                                1
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage -
                                        1
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
                                    handlePageChange(
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
                                totalPages
                            }
                            onClick={() =>
                                handlePageChange(
                                    currentPage +
                                        1
                                )
                            }
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                    </div>

                )}

            </div>

            {/* CREATE / EDIT USER MODAL */}
            {showModal && (

                <div
                    className="admin-modal-overlay"
                    onClick={() =>
                        setShowModal(false)
                    }
                >

                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <div>

                                <span className="admin-eyebrow">
                                    USER MANAGEMENT
                                </span>

                                <h2>
                                    {editingUser
                                        ? "Edit User"
                                        : "Create User"}
                                </h2>

                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="admin-form-grid">

                                <div className="form-group">
                                    <label>
                                        Full Name{" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={
                                            formData.name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Email{" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            formData.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="user@example.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Phone
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={
                                            formData.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="+254..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Role{" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            formData.role
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >
                                        {roleOptions.map(
                                            (
                                                role
                                            ) => (
                                                <option
                                                    key={
                                                        role
                                                    }
                                                    value={
                                                        role
                                                    }
                                                >
                                                    {
                                                        role
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="form-group form-group-full">
                                    <label>
                                        Team
                                    </label>

                                    <input
                                        type="text"
                                        name="team"
                                        value={
                                            formData.team
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. DeKUT Black Talons"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Account Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            formData.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        <option value="Active">
                                            Active
                                        </option>

                                        <option value="Pending">
                                            Pending
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

                                    {editingUser
                                        ? "Save Changes"
                                        : "Create User"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* USER DETAILS MODAL */}
            {showDetails &&
                selectedUser && (

                    <div
                        className="admin-modal-overlay"
                        onClick={() =>
                            setShowDetails(false)
                        }
                    >

                        <div
                            className="admin-modal user-details-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="admin-modal-header">

                                <div>

                                    <span className="admin-eyebrow">
                                        USER PROFILE
                                    </span>

                                    <h2>
                                        User Details
                                    </h2>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>

                            </div>

                            <div className="user-details-hero">

                                <div className="user-large-avatar">
                                    {getInitials(
                                        selectedUser.name
                                    )}
                                </div>

                                <div>

                                    <h3>
                                        {
                                            selectedUser.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            selectedUser.email
                                        }
                                    </p>

                                    <div className="user-hero-badges">

                                        <span
                                            className={getRoleClass(
                                                selectedUser.role
                                            )}
                                        >
                                            {
                                                selectedUser.role
                                            }
                                        </span>

                                        <span
                                            className={getStatusClass(
                                                selectedUser.status
                                            )}
                                        >
                                            {
                                                selectedUser.status
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <div className="user-detail-grid">

                                <div className="detail-item">
                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.name
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.email
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.phone
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Role
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.role
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Team
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.team
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Account Status
                                    </span>

                                    <strong>
                                        {
                                            selectedUser.status
                                        }
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Joined
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedUser.joined
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>
                                        Last Login
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedUser.lastLogin
                                        )}
                                    </strong>
                                </div>

                            </div>

                            <div className="admin-modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowDetails(
                                            false
                                        );

                                        openEditModal(
                                            selectedUser
                                        );
                                    }}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit User
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        setShowDetails(
                                            false
                                        )
                                    }
                                >
                                    Done
                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}

export default Users;

