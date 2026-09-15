import React, { useMemo, useState } from "react";

const initialVendors = [
    {
        id: 1,
        businessName: "Floorball Kenya Store",
        ownerName: "Victor Macharia",
        email: "store@example.com",
        phone: "+254 700 000 101",
        location: "Nairobi",
        category: "Floorball Equipment",
        products: 24,
        orders: 68,
        sales: 485000,
        commission: 48500,
        status: "Approved",
        joined: "2026-01-15",
        verification: "Verified",
    },
    {
        id: 2,
        businessName: "Kenya Sports Hub",
        ownerName: "Brian Otieno",
        email: "kenyasportshub@example.com",
        phone: "+254 700 000 102",
        location: "Nairobi",
        category: "Sports Equipment",
        products: 18,
        orders: 42,
        sales: 312000,
        commission: 31200,
        status: "Approved",
        joined: "2026-02-02",
        verification: "Verified",
    },
    {
        id: 3,
        businessName: "Nyeri Sports House",
        ownerName: "James Mwangi",
        email: "nyerisports@example.com",
        phone: "+254 700 000 103",
        location: "Nyeri",
        category: "Floorball Equipment",
        products: 12,
        orders: 27,
        sales: 185000,
        commission: 18500,
        status: "Approved",
        joined: "2026-02-14",
        verification: "Verified",
    },
    {
        id: 4,
        businessName: "East Africa Hockey Supplies",
        ownerName: "Daniel Mutua",
        email: "eahs@example.com",
        phone: "+254 700 000 104",
        location: "Nairobi",
        category: "Hockey & Floorball",
        products: 31,
        orders: 56,
        sales: 426000,
        commission: 42600,
        status: "Pending",
        joined: "2026-03-05",
        verification: "Pending",
    },
    {
        id: 5,
        businessName: "Karatina Sports Centre",
        ownerName: "Eric Kariuki",
        email: "karatinasports@example.com",
        phone: "+254 700 000 105",
        location: "Karatina",
        category: "Sports Equipment",
        products: 9,
        orders: 18,
        sales: 96000,
        commission: 9600,
        status: "Approved",
        joined: "2026-03-18",
        verification: "Verified",
    },
    {
        id: 6,
        businessName: "Goalie Gear Kenya",
        ownerName: "Kevin Otieno",
        email: "goaliegear@example.com",
        phone: "+254 700 000 106",
        location: "Nairobi",
        category: "Goalkeeper Equipment",
        products: 15,
        orders: 22,
        sales: 275000,
        commission: 27500,
        status: "Pending",
        joined: "2026-04-02",
        verification: "Pending",
    },
    {
        id: 7,
        businessName: "Central Sports Merchants",
        ownerName: "Peter Maina",
        email: "centralmerchants@example.com",
        phone: "+254 700 000 107",
        location: "Murang'a",
        category: "Sports Equipment",
        products: 7,
        orders: 11,
        sales: 68000,
        commission: 6800,
        status: "Suspended",
        joined: "2026-04-20",
        verification: "Verified",
    },
];

const emptyVendor = {
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    location: "",
    category: "Floorball Equipment",
    products: 0,
    orders: 0,
    sales: 0,
    commission: 0,
    status: "Pending",
    verification: "Pending",
};

const statusOptions = [
    "All",
    "Approved",
    "Pending",
    "Suspended",
];

const verificationOptions = [
    "All",
    "Verified",
    "Pending",
];

const categories = [
    "Floorball Equipment",
    "Sports Equipment",
    "Hockey & Floorball",
    "Goalkeeper Equipment",
    "Jerseys & Apparel",
    "Other",
];

function Vendors() {
    const [vendors, setVendors] = useState(initialVendors);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [verificationFilter, setVerificationFilter] =
        useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const [editingVendor, setEditingVendor] = useState(null);
    const [selectedVendor, setSelectedVendor] =
        useState(null);

    const [formData, setFormData] = useState(emptyVendor);

    const [currentPage, setCurrentPage] = useState(1);

    const vendorsPerPage = 6;

    const filteredVendors = useMemo(() => {
        return vendors.filter((vendor) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                vendor.businessName
                    .toLowerCase()
                    .includes(search) ||
                vendor.ownerName
                    .toLowerCase()
                    .includes(search) ||
                vendor.email
                    .toLowerCase()
                    .includes(search) ||
                vendor.location
                    .toLowerCase()
                    .includes(search) ||
                vendor.category
                    .toLowerCase()
                    .includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                vendor.status === statusFilter;

            const matchesVerification =
                verificationFilter === "All" ||
                vendor.verification ===
                    verificationFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesVerification
            );
        });
    }, [
        vendors,
        searchTerm,
        statusFilter,
        verificationFilter,
    ]);

    const totalPages = Math.ceil(
        filteredVendors.length / vendorsPerPage
    );

    const paginatedVendors = filteredVendors.slice(
        (currentPage - 1) * vendorsPerPage,
        currentPage * vendorsPerPage
    );

    const stats = {
        total: vendors.length,

        approved: vendors.filter(
            (vendor) => vendor.status === "Approved"
        ).length,

        pending: vendors.filter(
            (vendor) => vendor.status === "Pending"
        ).length,

        suspended: vendors.filter(
            (vendor) => vendor.status === "Suspended"
        ).length,

        verified: vendors.filter(
            (vendor) =>
                vendor.verification === "Verified"
        ).length,

        products: vendors.reduce(
            (total, vendor) =>
                total + Number(vendor.products),
            0
        ),

        sales: vendors.reduce(
            (total, vendor) =>
                total + Number(vendor.sales),
            0
        ),

        commission: vendors.reduce(
            (total, vendor) =>
                total + Number(vendor.commission),
            0
        ),
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "-";

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
        if (!name) return "V";

        const words = name.trim().split(" ");

        if (words.length === 1) {
            return words[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Approved":
                return "status-badge success";

            case "Pending":
                return "status-badge warning";

            case "Suspended":
                return "status-badge danger";

            default:
                return "status-badge";
        }
    };

    const getVerificationClass = (status) => {
        switch (status) {
            case "Verified":
                return "status-badge success";

            case "Pending":
                return "status-badge warning";

            default:
                return "status-badge";
        }
    };

    const openCreateModal = () => {
        setEditingVendor(null);
        setFormData(emptyVendor);
        setShowModal(true);
    };

    const openEditModal = (vendor) => {
        setEditingVendor(vendor);

        setFormData({
            businessName: vendor.businessName,
            ownerName: vendor.ownerName,
            email: vendor.email,
            phone: vendor.phone,
            location: vendor.location,
            category: vendor.category,
            products: vendor.products,
            orders: vendor.orders,
            sales: vendor.sales,
            commission: vendor.commission,
            status: vendor.status,
            verification: vendor.verification,
        });

        setShowModal(true);
    };

    const openDetailsModal = (vendor) => {
        setSelectedVendor(vendor);
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
            !formData.businessName ||
            !formData.ownerName ||
            !formData.email
        ) {
            alert(
                "Please fill in the required vendor information."
            );

            return;
        }

        if (editingVendor) {
            setVendors((previousVendors) =>
                previousVendors.map((vendor) =>
                    vendor.id === editingVendor.id
                        ? {
                              ...vendor,
                              ...formData,
                              products: Number(
                                  formData.products
                              ),
                              orders: Number(
                                  formData.orders
                              ),
                              sales: Number(
                                  formData.sales
                              ),
                              commission: Number(
                                  formData.commission
                              ),
                          }
                        : vendor
                )
            );
        } else {
            const newVendor = {
                id: Date.now(),
                ...formData,
                products: Number(
                    formData.products
                ),
                orders: Number(formData.orders),
                sales: Number(formData.sales),
                commission: Number(
                    formData.commission
                ),
                joined: new Date()
                    .toISOString()
                    .split("T")[0],
            };

            setVendors((previousVendors) => [
                newVendor,
                ...previousVendors,
            ]);
        }

        setShowModal(false);
        setEditingVendor(null);
        setFormData(emptyVendor);
    };

    const handleDelete = (vendorId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this vendor?"
        );

        if (!confirmed) return;

        setVendors((previousVendors) =>
            previousVendors.filter(
                (vendor) =>
                    vendor.id !== vendorId
            )
        );
    };

    const updateVendor = (vendorId, updates) => {
        setVendors((previousVendors) =>
            previousVendors.map((vendor) =>
                vendor.id === vendorId
                    ? {
                          ...vendor,
                          ...updates,
                      }
                    : vendor
            )
        );
    };

    const approveVendor = (vendorId) => {
        updateVendor(vendorId, {
            status: "Approved",
            verification: "Verified",
        });
    };

    const suspendVendor = (vendorId) => {
        updateVendor(vendorId, {
            status: "Suspended",
        });
    };

    const activateVendor = (vendorId) => {
        updateVendor(vendorId, {
            status: "Approved",
        });
    };

    const verifyVendor = (vendorId) => {
        updateVendor(vendorId, {
            verification: "Verified",
            status: "Approved",
        });
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
                        MARKETPLACE MANAGEMENT
                    </span>

                    <h1>Vendors</h1>

                    <p>
                        Manage marketplace sellers,
                        vendor verification, products,
                        sales and platform commissions.
                    </p>

                </div>

                <button
                    className="btn btn-primary"
                    onClick={openCreateModal}
                >
                    <i className="fa-solid fa-store"></i>
                    Add Vendor
                </button>

            </div>

            {/* STATISTICS */}
            <div className="admin-stats-grid">

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-store"></i>
                    </div>

                    <div>
                        <span>Total Vendors</span>
                        <strong>{stats.total}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon success">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Approved</span>
                        <strong>{stats.approved}</strong>
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
                        <i className="fa-solid fa-ban"></i>
                    </div>

                    <div>
                        <span>Suspended</span>
                        <strong>{stats.suspended}</strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-box"></i>
                    </div>

                    <div>
                        <span>Vendor Products</span>
                        <strong>{stats.products}</strong>
                    </div>

                </div>

            </div>

            {/* MARKETPLACE SUMMARY */}
            <div className="vendor-financial-summary">

                <div className="vendor-financial-card">

                    <div className="vendor-financial-icon">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <div>
                        <span>Total Vendor Sales</span>

                        <strong>
                            {formatCurrency(
                                stats.sales
                            )}
                        </strong>
                    </div>

                </div>

                <div className="vendor-financial-card">

                    <div className="vendor-financial-icon">
                        <i className="fa-solid fa-percent"></i>
                    </div>

                    <div>
                        <span>Platform Commission</span>

                        <strong>
                            {formatCurrency(
                                stats.commission
                            )}
                        </strong>
                    </div>

                </div>

                <div className="vendor-financial-card">

                    <div className="vendor-financial-icon">
                        <i className="fa-solid fa-shield-check"></i>
                    </div>

                    <div>
                        <span>Verified Vendors</span>

                        <strong>
                            {stats.verified}
                        </strong>
                    </div>

                </div>

            </div>

            {/* FILTERS */}
            <div className="admin-filter-card">

                <div className="admin-search">

                    <i className="fa-solid fa-magnifying-glass"></i>

                    <input
                        type="text"
                        placeholder="Search vendor, owner, email or location..."
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

                <select
                    value={verificationFilter}
                    onChange={(event) => {
                        setVerificationFilter(
                            event.target.value
                        );

                        setCurrentPage(1);
                    }}
                >

                    {verificationOptions.map(
                        (status) => (

                            <option
                                key={status}
                                value={status}
                            >
                                {status === "All"
                                    ? "All Verification"
                                    : status}
                            </option>

                        )
                    )}

                </select>

                <button
                    className="btn btn-secondary"
                    onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                        setVerificationFilter(
                            "All"
                        );
                        setCurrentPage(1);
                    }}
                >
                    <i className="fa-solid fa-rotate-left"></i>
                    Reset
                </button>

            </div>

            {/* VENDOR TABLE */}
            <div className="admin-table-card">

                <div className="admin-table-header">

                    <div>

                        <h2>
                            Marketplace Vendors
                        </h2>

                        <p>
                            Showing{" "}
                            {filteredVendors.length}{" "}
                            vendor
                            {filteredVendors.length !==
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
                                <th>Vendor</th>
                                <th>Category</th>
                                <th>Location</th>
                                <th>Products</th>
                                <th>Sales</th>
                                <th>Status</th>
                                <th>Verification</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {paginatedVendors.length >
                            0 ? (

                                paginatedVendors.map(
                                    (vendor) => (

                                        <tr
                                            key={
                                                vendor.id
                                            }
                                        >

                                            {/* VENDOR */}
                                            <td>

                                                <div className="admin-person-profile">

                                                    <div className="user-avatar vendor-avatar">
                                                        {getInitials(
                                                            vendor.businessName
                                                        )}
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                vendor.businessName
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                vendor.ownerName
                                                            }
                                                        </span>

                                                        <small>
                                                            {
                                                                vendor.email
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* CATEGORY */}
                                            <td>

                                                <span className="competition-name">
                                                    {
                                                        vendor.category
                                                    }
                                                </span>

                                            </td>

                                            {/* LOCATION */}
                                            <td>

                                                <span>
                                                    <i className="fa-solid fa-location-dot"></i>{" "}
                                                    {
                                                        vendor.location
                                                    }
                                                </span>

                                            </td>

                                            {/* PRODUCTS */}
                                            <td>

                                                <strong>
                                                    {
                                                        vendor.products
                                                    }
                                                </strong>

                                            </td>

                                            {/* SALES */}
                                            <td>

                                                <div className="admin-person-cell">

                                                    <strong>
                                                        {formatCurrency(
                                                            vendor.sales
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {
                                                            vendor.orders
                                                        }{" "}
                                                        orders
                                                    </span>

                                                </div>

                                            </td>

                                            {/* STATUS */}
                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        vendor.status
                                                    )}
                                                >
                                                    {
                                                        vendor.status
                                                    }
                                                </span>

                                            </td>

                                            {/* VERIFICATION */}
                                            <td>

                                                <span
                                                    className={getVerificationClass(
                                                        vendor.verification
                                                    )}
                                                >
                                                    {
                                                        vendor.verification
                                                    }
                                                </span>

                                            </td>

                                            {/* ACTIONS */}
                                            <td>

                                                <div className="admin-action-buttons">

                                                    <button
                                                        className="icon-btn"
                                                        title="View Vendor"
                                                        onClick={() =>
                                                            openDetailsModal(
                                                                vendor
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn"
                                                        title="Edit Vendor"
                                                        onClick={() =>
                                                            openEditModal(
                                                                vendor
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    {vendor.status ===
                                                        "Pending" && (
                                                        <button
                                                            className="icon-btn success"
                                                            title="Approve Vendor"
                                                            onClick={() =>
                                                                approveVendor(
                                                                    vendor.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                    )}

                                                    {vendor.verification ===
                                                        "Pending" && (
                                                        <button
                                                            className="icon-btn success"
                                                            title="Verify Vendor"
                                                            onClick={() =>
                                                                verifyVendor(
                                                                    vendor.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-shield-check"></i>
                                                        </button>
                                                    )}

                                                    {vendor.status ===
                                                        "Approved" && (
                                                        <button
                                                            className="icon-btn warning"
                                                            title="Suspend Vendor"
                                                            onClick={() =>
                                                                suspendVendor(
                                                                    vendor.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-ban"></i>
                                                        </button>
                                                    )}

                                                    {vendor.status ===
                                                        "Suspended" && (
                                                        <button
                                                            className="icon-btn success"
                                                            title="Activate Vendor"
                                                            onClick={() =>
                                                                activateVendor(
                                                                    vendor.id
                                                                )
                                                            }
                                                        >
                                                            <i className="fa-solid fa-power-off"></i>
                                                        </button>
                                                    )}

                                                    <button
                                                        className="icon-btn danger"
                                                        title="Delete Vendor"
                                                        onClick={() =>
                                                            handleDelete(
                                                                vendor.id
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
                                        colSpan="8"
                                        className="admin-empty-state"
                                    >

                                        <i className="fa-solid fa-store"></i>

                                        <h3>
                                            No vendors found
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

            {/* CREATE / EDIT MODAL */}
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
                                    VENDOR MANAGEMENT
                                </span>

                                <h2>
                                    {editingVendor
                                        ? "Edit Vendor"
                                        : "Add Vendor"}
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
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="admin-form-grid">

                                <div className="form-group">

                                    <label>
                                        Business Name{" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="businessName"
                                        value={
                                            formData.businessName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Floorball Kenya Store"
                                        required
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Owner Name{" "}
                                        <span className="required">
                                            *
                                        </span>
                                    </label>

                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={
                                            formData.ownerName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Business owner"
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
                                        placeholder="vendor@example.com"
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
                                        Location
                                    </label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            formData.location
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Nairobi"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Vendor Category
                                    </label>

                                    <select
                                        name="category"
                                        value={
                                            formData.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        {categories.map(
                                            (
                                                category
                                            ) => (

                                                <option
                                                    key={
                                                        category
                                                    }
                                                    value={
                                                        category
                                                    }
                                                >
                                                    {
                                                        category
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Products
                                    </label>

                                    <input
                                        type="number"
                                        name="products"
                                        value={
                                            formData.products
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Orders
                                    </label>

                                    <input
                                        type="number"
                                        name="orders"
                                        value={
                                            formData.orders
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Total Sales
                                    </label>

                                    <input
                                        type="number"
                                        name="sales"
                                        value={
                                            formData.sales
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Platform Commission
                                    </label>

                                    <input
                                        type="number"
                                        name="commission"
                                        value={
                                            formData.commission
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
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
                                            handleChange
                                        }
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Approved">
                                            Approved
                                        </option>

                                        <option value="Suspended">
                                            Suspended
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Verification
                                    </label>

                                    <select
                                        name="verification"
                                        value={
                                            formData.verification
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Verified">
                                            Verified
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

                                    {editingVendor
                                        ? "Save Changes"
                                        : "Create Vendor"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* DETAILS MODAL */}
            {showDetails &&
                selectedVendor && (

                    <div
                        className="admin-modal-overlay"
                        onClick={() =>
                            setShowDetails(
                                false
                            )
                        }
                    >

                        <div
                            className="admin-modal vendor-details-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="admin-modal-header">

                                <div>

                                    <span className="admin-eyebrow">
                                        VENDOR PROFILE
                                    </span>

                                    <h2>
                                        Vendor Details
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

                            <div className="vendor-details-hero">

                                <div className="vendor-large-avatar">
                                    {getInitials(
                                        selectedVendor.businessName
                                    )}
                                </div>

                                <div>

                                    <h3>
                                        {
                                            selectedVendor.businessName
                                        }
                                    </h3>

                                    <p>
                                        Owner:{" "}
                                        {
                                            selectedVendor.ownerName
                                        }
                                    </p>

                                    <div className="vendor-hero-badges">

                                        <span
                                            className={getStatusClass(
                                                selectedVendor.status
                                            )}
                                        >
                                            {
                                                selectedVendor.status
                                            }
                                        </span>

                                        <span
                                            className={getVerificationClass(
                                                selectedVendor.verification
                                            )}
                                        >
                                            {
                                                selectedVendor.verification
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* FINANCIAL CARDS */}
                            <div className="vendor-detail-financial">

                                <div>

                                    <span>
                                        Products
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.products
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Orders
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.orders
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Total Sales
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedVendor.sales
                                        )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Commission
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            selectedVendor.commission
                                        )}
                                    </strong>

                                </div>

                            </div>

                            <div className="vendor-detail-grid">

                                <div className="detail-item">

                                    <span>
                                        Business Name
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.businessName
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Owner
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.ownerName
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.email
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.phone
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.location
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Category
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.category
                                        }
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Joined
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedVendor.joined
                                        )}
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Verification
                                    </span>

                                    <strong>
                                        {
                                            selectedVendor.verification
                                        }
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
                                            selectedVendor
                                        );
                                    }}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit Vendor
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

export default Vendors;

