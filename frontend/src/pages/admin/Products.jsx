import React, { useMemo, useState } from "react";

const initialProducts = [
    {
        id: 1,
        name: "Professional Floorball Stick",
        category: "Sticks",
        vendor: "Floorball Kenya Sports",
        price: 6500,
        stock: 14,
        status: "Approved",
        featured: true,
        condition: "New",
        sku: "FK-STK-001",
        dateAdded: "10 Sep 2026",
    },
    {
        id: 2,
        name: "Floorball Match Ball Pack",
        category: "Balls",
        vendor: "Sports Hub Kenya",
        price: 1800,
        stock: 35,
        status: "Approved",
        featured: true,
        condition: "New",
        sku: "FK-BAL-002",
        dateAdded: "09 Sep 2026",
    },
    {
        id: 3,
        name: "Floorball Goalkeeper Helmet",
        category: "Goalkeeper Gear",
        vendor: "Floorball Gear KE",
        price: 8500,
        stock: 5,
        status: "Approved",
        featured: false,
        condition: "New",
        sku: "FK-GK-003",
        dateAdded: "08 Sep 2026",
    },
    {
        id: 4,
        name: "Floorball Jersey - Black",
        category: "Jerseys",
        vendor: "Black Talons Store",
        price: 3200,
        stock: 20,
        status: "Pending",
        featured: false,
        condition: "New",
        sku: "FK-JER-004",
        dateAdded: "07 Sep 2026",
    },
    {
        id: 5,
        name: "Floorball Shoes",
        category: "Shoes",
        vendor: "Sports Hub Kenya",
        price: 7800,
        stock: 8,
        status: "Approved",
        featured: true,
        condition: "New",
        sku: "FK-SHO-005",
        dateAdded: "06 Sep 2026",
    },
    {
        id: 6,
        name: "Floorball Replacement Blade",
        category: "Blades",
        vendor: "Floorball Gear KE",
        price: 2800,
        stock: 3,
        status: "Approved",
        featured: false,
        condition: "New",
        sku: "FK-BLD-006",
        dateAdded: "05 Sep 2026",
    },
    {
        id: 7,
        name: "Floorball Goal Net",
        category: "Goal Posts & Nets",
        vendor: "Floorball Kenya Sports",
        price: 12500,
        stock: 2,
        status: "Pending",
        featured: false,
        condition: "New",
        sku: "FK-NET-007",
        dateAdded: "04 Sep 2026",
    },
    {
        id: 8,
        name: "Used Floorball Stick",
        category: "Sticks",
        vendor: "Black Talons Store",
        price: 3500,
        stock: 6,
        status: "Approved",
        featured: false,
        condition: "Used",
        sku: "FK-STK-008",
        dateAdded: "03 Sep 2026",
    },
    {
        id: 9,
        name: "Floorball Goalie Kit",
        category: "Goalkeeper Gear",
        vendor: "Floorball Gear KE",
        price: 28500,
        stock: 1,
        status: "Pending",
        featured: false,
        condition: "New",
        sku: "FK-GK-009",
        dateAdded: "02 Sep 2026",
    },
    {
        id: 10,
        name: "Floorball Training Jersey",
        category: "Jerseys",
        vendor: "Sports Hub Kenya",
        price: 2500,
        stock: 18,
        status: "Approved",
        featured: false,
        condition: "New",
        sku: "FK-JER-010",
        dateAdded: "01 Sep 2026",
    },
];

const categories = [
    "Sticks",
    "Jerseys",
    "Shoes",
    "Balls",
    "Blades",
    "Goalkeeper Gear",
    "Goal Posts & Nets",
];

const vendors = [
    "Floorball Kenya Sports",
    "Sports Hub Kenya",
    "Floorball Gear KE",
    "Black Talons Store",
];

const conditions = [
    "New",
    "Used",
];

const getStatusClass = (status) => {
    switch (status) {
        case "Approved":
            return "status-badge status-success";

        case "Pending":
            return "status-badge status-pending";

        case "Rejected":
            return "status-badge status-danger";

        default:
            return "status-badge";
    }
};

const getStockClass = (stock) => {
    if (stock === 0) {
        return "stock-badge stock-out";
    }

    if (stock <= 5) {
        return "stock-badge stock-low";
    }

    return "stock-badge stock-good";
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(amount);
};

const Products = () => {
    const [products, setProducts] = useState(initialProducts);

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [vendorFilter, setVendorFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");

    const [showModal, setShowModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);

    const productsPerPage = 6;

    const emptyForm = {
        name: "",
        category: "Sticks",
        vendor: "Floorball Kenya Sports",
        price: "",
        stock: "",
        status: "Pending",
        featured: false,
        condition: "New",
        sku: "",
        dateAdded: "",
    };

    const [formData, setFormData] = useState(emptyForm);

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalProducts = products.length;

    const approvedProducts = products.filter(
        (product) => product.status === "Approved"
    ).length;

    const pendingProducts = products.filter(
        (product) => product.status === "Pending"
    ).length;

    const outOfStockProducts = products.filter(
        (product) => product.stock === 0
    ).length;

    const lowStockProducts = products.filter(
        (product) =>
            product.stock > 0 &&
            product.stock <= 5
    ).length;

    const featuredProducts = products.filter(
        (product) => product.featured
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Filtering
    |--------------------------------------------------------------------------
    */

    const filteredProducts = useMemo(() => {
        const search = searchTerm.toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(search) ||
                product.sku.toLowerCase().includes(search) ||
                product.vendor.toLowerCase().includes(search) ||
                product.category.toLowerCase().includes(search);

            const matchesCategory =
                categoryFilter === "All" ||
                product.category === categoryFilter;

            const matchesVendor =
                vendorFilter === "All" ||
                product.vendor === vendorFilter;

            const matchesStatus =
                statusFilter === "All" ||
                product.status === statusFilter;

            let matchesStock = true;

            if (stockFilter === "In Stock") {
                matchesStock = product.stock > 5;
            }

            if (stockFilter === "Low Stock") {
                matchesStock =
                    product.stock > 0 &&
                    product.stock <= 5;
            }

            if (stockFilter === "Out of Stock") {
                matchesStock = product.stock === 0;
            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesVendor &&
                matchesStatus &&
                matchesStock
            );
        });
    }, [
        products,
        searchTerm,
        categoryFilter,
        vendorFilter,
        statusFilter,
        stockFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );

    const startIndex =
        (currentPage - 1) * productsPerPage;

    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
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
        const { name, value, type, checked } =
            event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);

        setFormData({
            name: product.name,
            category: product.category,
            vendor: product.vendor,
            price: product.price,
            stock: product.stock,
            status: product.status,
            featured: product.featured,
            condition: product.condition,
            sku: product.sku,
            dateAdded: product.dateAdded,
        });

        setShowModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Save Product
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.name.trim()) {
            window.alert(
                "Please enter a product name."
            );
            return;
        }

        if (!formData.price) {
            window.alert(
                "Please enter a product price."
            );
            return;
        }

        if (!formData.stock && formData.stock !== 0) {
            window.alert(
                "Please enter the available stock."
            );
            return;
        }

        if (editingProduct) {
            setProducts((currentProducts) =>
                currentProducts.map((product) =>
                    product.id === editingProduct.id
                        ? {
                              ...product,
                              ...formData,
                              price: Number(
                                  formData.price
                              ),
                              stock: Number(
                                  formData.stock
                              ),
                          }
                        : product
                )
            );
        } else {
            const newProduct = {
                id: Date.now(),
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                dateAdded:
                    formData.dateAdded ||
                    new Date().toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    ),
            };

            setProducts((currentProducts) => [
                newProduct,
                ...currentProducts,
            ]);
        }

        setShowModal(false);
        setEditingProduct(null);
        setFormData(emptyForm);
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Product
    |--------------------------------------------------------------------------
    */

    const handleDelete = (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        setProducts((currentProducts) =>
            currentProducts.filter(
                (product) => product.id !== productId
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | View Product
    |--------------------------------------------------------------------------
    */

    const handleView = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Approve / Reject
    |--------------------------------------------------------------------------
    */

    const updateProductStatus = (
        productId,
        status
    ) => {
        setProducts((currentProducts) =>
            currentProducts.map((product) =>
                product.id === productId
                    ? {
                          ...product,
                          status,
                      }
                    : product
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Featured Product
    |--------------------------------------------------------------------------
    */

    const toggleFeatured = (productId) => {
        setProducts((currentProducts) =>
            currentProducts.map((product) =>
                product.id === productId
                    ? {
                          ...product,
                          featured: !product.featured,
                      }
                    : product
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
        setCategoryFilter("All");
        setVendorFilter("All");
        setStatusFilter("All");
        setStockFilter("All");
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
                        Marketplace
                    </span>

                    <h1>Products</h1>

                    <p>
                        Manage marketplace products,
                        vendors, prices, stock and approvals.
                    </p>

                </div>

                <div className="admin-header-actions">

                    <button
                        className="btn btn-primary"
                        onClick={openCreateModal}
                    >
                        <i className="fa-solid fa-plus"></i>
                        Add Product
                    </button>

                </div>

            </div>

            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <div className="admin-stats-grid">

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-box"></i>
                    </div>

                    <div>
                        <span>Total Products</span>
                        <strong>
                            {totalProducts}
                        </strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Approved</span>
                        <strong>
                            {approvedProducts}
                        </strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <span>Pending Approval</span>
                        <strong>
                            {pendingProducts}
                        </strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>

                    <div>
                        <span>Low Stock</span>
                        <strong>
                            {lowStockProducts}
                        </strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-box-open"></i>
                    </div>

                    <div>
                        <span>Out of Stock</span>
                        <strong>
                            {outOfStockProducts}
                        </strong>
                    </div>

                </div>

                <div className="admin-stat-card">

                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-star"></i>
                    </div>

                    <div>
                        <span>Featured</span>
                        <strong>
                            {featuredProducts}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =========================================================
                FILTERS
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-card-header">

                    <div>

                        <h2>
                            Product Management
                        </h2>

                        <p>
                            {filteredProducts.length} product
                            {filteredProducts.length !== 1
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
                            placeholder="Search products, SKU or vendors..."
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
                        value={categoryFilter}
                        onChange={(event) => {
                            setCategoryFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >

                        <option value="All">
                            All Categories
                        </option>

                        {categories.map(
                            (category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        )}

                    </select>

                    <select
                        value={vendorFilter}
                        onChange={(event) => {
                            setVendorFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >

                        <option value="All">
                            All Vendors
                        </option>

                        {vendors.map((vendor) => (
                            <option
                                key={vendor}
                                value={vendor}
                            >
                                {vendor}
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

                        <option value="Approved">
                            Approved
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Rejected">
                            Rejected
                        </option>

                    </select>

                    <select
                        value={stockFilter}
                        onChange={(event) => {
                            setStockFilter(
                                event.target.value
                            );
                            setCurrentPage(1);
                        }}
                    >

                        <option value="All">
                            All Stock
                        </option>

                        <option value="In Stock">
                            In Stock
                        </option>

                        <option value="Low Stock">
                            Low Stock
                        </option>

                        <option value="Out of Stock">
                            Out of Stock
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
                PRODUCTS TABLE
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>

                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Vendor</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Added</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {currentProducts.length > 0 ? (
                                currentProducts.map(
                                    (product) => (
                                        <tr
                                            key={
                                                product.id
                                            }
                                        >

                                            {/* PRODUCT */}

                                            <td>

                                                <div className="table-product">

                                                    <div className="product-placeholder">

                                                        <i className="fa-solid fa-box"></i>

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>

                                                        <small>
                                                            SKU:{" "}
                                                            {
                                                                product.sku
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>

                                            {/* CATEGORY */}

                                            <td>
                                                {
                                                    product.category
                                                }
                                            </td>

                                            {/* VENDOR */}

                                            <td>
                                                {
                                                    product.vendor
                                                }
                                            </td>

                                            {/* PRICE */}

                                            <td>

                                                <strong>
                                                    {formatCurrency(
                                                        product.price
                                                    )}
                                                </strong>

                                                <small className="table-muted">
                                                    {
                                                        product.condition
                                                    }
                                                </small>

                                            </td>

                                            {/* STOCK */}

                                            <td>

                                                <span
                                                    className={getStockClass(
                                                        product.stock
                                                    )}
                                                >
                                                    {
                                                        product.stock
                                                    }{" "}
                                                    units
                                                </span>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        product.status
                                                    )}
                                                >
                                                    {
                                                        product.status
                                                    }
                                                </span>

                                            </td>

                                            {/* FEATURED */}

                                            <td>

                                                <button
                                                    className={
                                                        product.featured
                                                            ? "featured-toggle active"
                                                            : "featured-toggle"
                                                    }
                                                    title={
                                                        product.featured
                                                            ? "Remove from featured"
                                                            : "Add to featured"
                                                    }
                                                    onClick={() =>
                                                        toggleFeatured(
                                                            product.id
                                                        )
                                                    }
                                                >

                                                    <i className="fa-solid fa-star"></i>

                                                </button>

                                            </td>

                                            {/* DATE */}

                                            <td>
                                                {
                                                    product.dateAdded
                                                }
                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="admin-table-actions">

                                                    <button
                                                        className="icon-btn"
                                                        title="View Product"
                                                        onClick={() =>
                                                            handleView(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>

                                                    <button
                                                        className="icon-btn"
                                                        title="Edit Product"
                                                        onClick={() =>
                                                            openEditModal(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    {product.status ===
                                                        "Pending" && (
                                                        <>
                                                            <button
                                                                className="icon-btn"
                                                                title="Approve Product"
                                                                onClick={() =>
                                                                    updateProductStatus(
                                                                        product.id,
                                                                        "Approved"
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa-solid fa-check"></i>
                                                            </button>

                                                            <button
                                                                className="icon-btn danger"
                                                                title="Reject Product"
                                                                onClick={() =>
                                                                    updateProductStatus(
                                                                        product.id,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa-solid fa-xmark"></i>
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        className="icon-btn danger"
                                                        title="Delete Product"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.id
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

                                        <i className="fa-solid fa-box-open"></i>

                                        <h3>
                                            No products found
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
                CREATE / EDIT PRODUCT MODAL
            ========================================================= */}

            {showModal && (
                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <div className="admin-modal-header">

                            <div>

                                <span className="admin-eyebrow">
                                    Marketplace
                                </span>

                                <h2>
                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}
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
                                            Product Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Floorball Stick"
                                            value={
                                                formData.name
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* SKU */}

                                    <div className="form-group">

                                        <label>
                                            SKU
                                        </label>

                                        <input
                                            type="text"
                                            name="sku"
                                            placeholder="e.g. FK-STK-001"
                                            value={
                                                formData.sku
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                    </div>

                                    {/* CATEGORY */}

                                    <div className="form-group">

                                        <label>
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={
                                                formData.category
                                            }
                                            onChange={
                                                handleInputChange
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

                                    {/* VENDOR */}

                                    <div className="form-group">

                                        <label>
                                            Vendor
                                        </label>

                                        <select
                                            name="vendor"
                                            value={
                                                formData.vendor
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        >

                                            {vendors.map(
                                                (
                                                    vendor
                                                ) => (
                                                    <option
                                                        key={
                                                            vendor
                                                        }
                                                        value={
                                                            vendor
                                                        }
                                                    >
                                                        {
                                                            vendor
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    {/* PRICE */}

                                    <div className="form-group">

                                        <label>
                                            Price (KES)
                                        </label>

                                        <input
                                            type="number"
                                            name="price"
                                            min="0"
                                            placeholder="Enter price"
                                            value={
                                                formData.price
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* STOCK */}

                                    <div className="form-group">

                                        <label>
                                            Stock Quantity
                                        </label>

                                        <input
                                            type="number"
                                            name="stock"
                                            min="0"
                                            placeholder="Available quantity"
                                            value={
                                                formData.stock
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                            required
                                        />

                                    </div>

                                    {/* CONDITION */}

                                    <div className="form-group">

                                        <label>
                                            Condition
                                        </label>

                                        <select
                                            name="condition"
                                            value={
                                                formData.condition
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        >

                                            {conditions.map(
                                                (
                                                    condition
                                                ) => (
                                                    <option
                                                        key={
                                                            condition
                                                        }
                                                        value={
                                                            condition
                                                        }
                                                    >
                                                        {
                                                            condition
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Approval Status
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

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Approved">
                                                Approved
                                            </option>

                                            <option value="Rejected">
                                                Rejected
                                            </option>

                                        </select>

                                    </div>

                                    {/* DATE */}

                                    <div className="form-group">

                                        <label>
                                            Date Added
                                        </label>

                                        <input
                                            type="text"
                                            name="dateAdded"
                                            placeholder="e.g. 15 Sep 2026"
                                            value={
                                                formData.dateAdded
                                            }
                                            onChange={
                                                handleInputChange
                                            }
                                        />

                                    </div>

                                    {/* FEATURED */}

                                    <div className="form-group checkbox-group">

                                        <label>

                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={
                                                    formData.featured
                                                }
                                                onChange={
                                                    handleInputChange
                                                }
                                            />

                                            <span>
                                                Feature this
                                                product in
                                                the marketplace
                                            </span>

                                        </label>

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

                                    {editingProduct
                                        ? "Save Changes"
                                        : "Add Product"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            {/* =========================================================
                PRODUCT DETAILS MODAL
            ========================================================= */}

            {showDetailsModal &&
                selectedProduct && (
                    <div className="admin-modal-overlay">

                        <div className="admin-modal">

                            <div className="admin-modal-header">

                                <div>

                                    <span className="admin-eyebrow">
                                        Product Details
                                    </span>

                                    <h2>
                                        {
                                            selectedProduct.name
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

                                <div className="product-detail-preview">

                                    <div className="product-detail-image">

                                        <i className="fa-solid fa-box-open"></i>

                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                selectedProduct.name
                                            }
                                        </h3>

                                        <p>
                                            SKU:{" "}
                                            {
                                                selectedProduct.sku
                                            }
                                        </p>

                                        <span
                                            className={getStatusClass(
                                                selectedProduct.status
                                            )}
                                        >
                                            {
                                                selectedProduct.status
                                            }
                                        </span>

                                    </div>

                                </div>

                                <div className="order-detail-grid">

                                    <div className="detail-item">

                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {
                                                selectedProduct.category
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Vendor
                                        </span>

                                        <strong>
                                            {
                                                selectedProduct.vendor
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Price
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                selectedProduct.price
                                            )}
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Stock
                                        </span>

                                        <strong>
                                            {
                                                selectedProduct.stock
                                            }{" "}
                                            units
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Condition
                                        </span>

                                        <strong>
                                            {
                                                selectedProduct.condition
                                            }
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Featured
                                        </span>

                                        <strong>
                                            {selectedProduct.featured
                                                ? "Yes"
                                                : "No"}
                                        </strong>

                                    </div>

                                    <div className="detail-item">

                                        <span>
                                            Date Added
                                        </span>

                                        <strong>
                                            {
                                                selectedProduct.dateAdded
                                            }
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

                                {selectedProduct.status ===
                                    "Pending" && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            updateProductStatus(
                                                selectedProduct.id,
                                                "Approved"
                                            );

                                            setSelectedProduct(
                                                {
                                                    ...selectedProduct,
                                                    status: "Approved",
                                                }
                                            );
                                        }}
                                    >
                                        <i className="fa-solid fa-check"></i>
                                        Approve Product
                                    </button>
                                )}

                                <button
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setShowDetailsModal(
                                            false
                                        );
                                        openEditModal(
                                            selectedProduct
                                        );
                                    }}
                                >
                                    <i className="fa-solid fa-pen"></i>
                                    Edit Product
                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
};

export default Products;

