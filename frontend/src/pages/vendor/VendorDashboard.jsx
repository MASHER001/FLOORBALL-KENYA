import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Package,
    Edit3,
    Trash2,
    Eye,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

const mockProducts = [
    {
        id: 1,
        name: "Oxdog Hyperlight Floorball Stick",
        category: "Sticks",
        price: 8500,
        stock: 12,
        status: "Approved",
        condition: "New",
        sku: "OXD-HL-001",
        sales: 18,
        image: "/images/products/sticks/stick-1.jpg",
        featured: true,
    },
    {
        id: 2,
        name: "Floorball Match Ball Pack",
        category: "Balls",
        price: 1800,
        stock: 35,
        status: "Approved",
        condition: "New",
        sku: "BALL-001",
        sales: 42,
        image: "/images/products/balls/balls-1.jpg",
        featured: false,
    },
    {
        id: 3,
        name: "Kenya Floorball Training Jersey",
        category: "Jerseys",
        price: 3200,
        stock: 7,
        status: "Pending",
        condition: "New",
        sku: "JER-KEN-001",
        sales: 0,
        image: "/images/products/jerseys/jersey-1.jpg",
        featured: false,
    },
    {
        id: 4,
        name: "Floorball Speed Shoes",
        category: "Shoes",
        price: 7200,
        stock: 3,
        status: "Approved",
        condition: "New",
        sku: "SHOE-001",
        sales: 11,
        image: "/images/products/shoes/shoes-1.jpg",
        featured: true,
    },
    {
        id: 5,
        name: "Goalkeeper Helmet",
        category: "Goalkeeper Gear",
        price: 9500,
        stock: 0,
        status: "Rejected",
        condition: "New",
        sku: "GK-HELM-001",
        sales: 0,
        image: "/images/products/helmets/helmet-1.jpg",
        featured: false,
    },
];

const formatKES = (value) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(value);

export default function ManageProducts() {
    const [products, setProducts] = useState(mockProducts);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [status, setStatus] = useState("All");
    const [stockFilter, setStockFilter] = useState("All");
    const [page, setPage] = useState(1);

    const perPage = 5;

    const categories = [
        "All",
        ...new Set(mockProducts.map((product) => product.category)),
    ];

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                product.sku
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesCategory =
                category === "All" ||
                product.category === category;

            const matchesStatus =
                status === "All" ||
                product.status === status;

            const matchesStock =
                stockFilter === "All" ||
                (stockFilter === "In Stock" && product.stock > 0) ||
                (stockFilter === "Low Stock" &&
                    product.stock > 0 &&
                    product.stock <= 5) ||
                (stockFilter === "Out of Stock" &&
                    product.stock === 0);

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus &&
                matchesStock
            );
        });
    }, [products, search, category, status, stockFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / perPage)
    );

    const paginatedProducts = filteredProducts.slice(
        (page - 1) * perPage,
        page * perPage
    );

    const deleteProduct = (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this product?"
            )
        ) {
            setProducts((prev) =>
                prev.filter((product) => product.id !== id)
            );
        }
    };

    const getStatusIcon = (productStatus) => {
        if (productStatus === "Approved") {
            return <CheckCircle size={14} />;
        }

        if (productStatus === "Pending") {
            return <Clock size={14} />;
        }

        return <XCircle size={14} />;
    };

    const totalProducts = products.length;
    const approved = products.filter(
        (p) => p.status === "Approved"
    ).length;
    const pending = products.filter(
        (p) => p.status === "Pending"
    ).length;
    const lowStock = products.filter(
        (p) => p.stock > 0 && p.stock <= 5
    ).length;
    const outOfStock = products.filter(
        (p) => p.stock === 0
    ).length;

    return (
        <main className="vendor-page">
            <div className="vendor-container">

                <div className="vendor-page-header vendor-products-header">
                    <div>
                        <span className="vendor-eyebrow">
                            Marketplace
                        </span>

                        <h1>Manage Products</h1>

                        <p>
                            Add, update and monitor products in your store.
                        </p>
                    </div>

                    <Link
                        to="/vendor/products/add"
                        className="btn btn-primary"
                    >
                        <Plus size={18} />
                        Add Product
                    </Link>
                </div>

                {/* STATS */}
                <section className="vendor-product-stats">

                    <div className="vendor-product-stat">
                        <div className="vendor-product-stat-icon">
                            <Package size={20} />
                        </div>

                        <div>
                            <span>Total Products</span>
                            <strong>{totalProducts}</strong>
                        </div>
                    </div>

                    <div className="vendor-product-stat">
                        <div className="vendor-product-stat-icon approved">
                            <CheckCircle size={20} />
                        </div>

                        <div>
                            <span>Approved</span>
                            <strong>{approved}</strong>
                        </div>
                    </div>

                    <div className="vendor-product-stat">
                        <div className="vendor-product-stat-icon pending">
                            <Clock size={20} />
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>{pending}</strong>
                        </div>
                    </div>

                    <div className="vendor-product-stat">
                        <div className="vendor-product-stat-icon warning">
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <span>Low Stock</span>
                            <strong>{lowStock}</strong>
                        </div>
                    </div>

                    <div className="vendor-product-stat">
                        <div className="vendor-product-stat-icon danger">
                            <XCircle size={20} />
                        </div>

                        <div>
                            <span>Out of Stock</span>
                            <strong>{outOfStock}</strong>
                        </div>
                    </div>

                </section>

                {/* FILTERS */}
                <section className="vendor-filter-card">

                    <div className="vendor-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search products or SKU..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            setPage(1);
                        }}
                    >
                        {categories.map((item) => (
                            <option key={item}>{item}</option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option>All</option>
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                    </select>

                    <select
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option>All</option>
                        <option>In Stock</option>
                        <option>Low Stock</option>
                        <option>Out of Stock</option>
                    </select>

                </section>

                {/* TABLE */}
                <section className="vendor-table-card">

                    <div className="vendor-table-header">
                        <div>
                            <span className="vendor-section-label">
                                Inventory
                            </span>

                            <h2>
                                {filteredProducts.length} Products
                            </h2>
                        </div>
                    </div>

                    <div className="vendor-table-wrapper">
                        <table className="vendor-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Sales</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedProducts.map((product) => (
                                    <tr key={product.id}>

                                        <td>
                                            <div className="vendor-product-cell">
                                                <div className="vendor-product-image">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        onError={(e) => {
                                                            e.currentTarget.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {product.name}
                                                    </strong>

                                                    <span>
                                                        SKU: {product.sku}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>{product.category}</td>

                                        <td>
                                            <strong>
                                                {formatKES(product.price)}
                                            </strong>
                                        </td>

                                        <td>
                                            <span
                                                className={
                                                    product.stock === 0
                                                        ? "stock-danger"
                                                        : product.stock <= 5
                                                        ? "stock-warning"
                                                        : "stock-good"
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </td>

                                        <td>{product.sales}</td>

                                        <td>
                                            <span
                                                className={`vendor-status ${product.status.toLowerCase()}`}
                                            >
                                                {getStatusIcon(
                                                    product.status
                                                )}
                                                {product.status}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="vendor-action-buttons">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="vendor-icon-btn"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                <button
                                                    className="vendor-icon-btn"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </button>

                                                <button
                                                    className="vendor-icon-btn danger"
                                                    title="Delete"
                                                    onClick={() =>
                                                        deleteProduct(
                                                            product.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                                <button
                                                    className="vendor-icon-btn"
                                                    title="More"
                                                >
                                                    <MoreVertical
                                                        size={16}
                                                    />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {paginatedProducts.length === 0 && (
                        <div className="vendor-empty-state">
                            <Package size={42} />

                            <h3>No products found</h3>

                            <p>
                                Try changing your filters or add a new
                                product.
                            </p>

                            <Link
                                to="/vendor/products/add"
                                className="btn btn-primary"
                            >
                                Add Product
                            </Link>
                        </div>
                    )}

                    {filteredProducts.length > 0 && (
                        <div className="vendor-pagination">

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <div>
                                <button
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <button
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1)
                                        )
                                    }
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </div>

                        </div>
                    )}
                </section>

            </div>
        </main>
    );
}