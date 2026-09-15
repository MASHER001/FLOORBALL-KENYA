import React, { useMemo, useState } from "react";

const initialOrders = [
    {
        id: "ORD-1001",
        customer: "Victor Macharia",
        email: "victor@example.com",
        vendor: "Floorball Kenya Sports",
        items: 2,
        amount: 8500,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        date: "14 Sep 2026",
        delivery: "Nairobi",
    },
    {
        id: "ORD-1002",
        customer: "Mildred Kuria",
        email: "mildred@example.com",
        vendor: "Black Talons Store",
        items: 1,
        amount: 4200,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Shipped",
        date: "13 Sep 2026",
        delivery: "Nyeri",
    },
    {
        id: "ORD-1003",
        customer: "Jimmy Bii",
        email: "jimmy@example.com",
        vendor: "Floorball Gear KE",
        items: 3,
        amount: 12600,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        date: "12 Sep 2026",
        delivery: "Eldoret",
    },
    {
        id: "ORD-1004",
        customer: "Hillary Kiptoo",
        email: "hillary@example.com",
        vendor: "Floorball Gear KE",
        items: 1,
        amount: 7800,
        paymentMethod: "M-Pesa",
        paymentStatus: "Pending",
        orderStatus: "Pending",
        date: "12 Sep 2026",
        delivery: "Kisumu",
    },
    {
        id: "ORD-1005",
        customer: "Faith Njeri",
        email: "faith@example.com",
        vendor: "Sports Hub Kenya",
        items: 2,
        amount: 5600,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        date: "11 Sep 2026",
        delivery: "Nakuru",
    },
    {
        id: "ORD-1006",
        customer: "Brian Otieno",
        email: "brian@example.com",
        vendor: "Floorball Kenya Sports",
        items: 4,
        amount: 15400,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Cancelled",
        date: "10 Sep 2026",
        delivery: "Mombasa",
    },
    {
        id: "ORD-1007",
        customer: "Sharnie Coder",
        email: "sharnie@example.com",
        vendor: "Sports Hub Kenya",
        items: 2,
        amount: 6900,
        paymentMethod: "M-Pesa",
        paymentStatus: "Paid",
        orderStatus: "Delivered",
        date: "09 Sep 2026",
        delivery: "Nyeri",
    },
    {
        id: "ORD-1008",
        customer: "Zanzi Bobo",
        email: "zanzi@example.com",
        vendor: "Black Talons Store",
        items: 1,
        amount: 3500,
        paymentMethod: "M-Pesa",
        paymentStatus: "Failed",
        orderStatus: "Pending",
        date: "08 Sep 2026",
        delivery: "Nairobi",
    },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(amount);
};

const getStatusClass = (status) => {
    switch (status) {
        case "Paid":
        case "Delivered":
            return "status-badge status-success";

        case "Processing":
        case "Shipped":
            return "status-badge status-warning";

        case "Pending":
            return "status-badge status-pending";

        case "Cancelled":
        case "Failed":
            return "status-badge status-danger";

        default:
            return "status-badge";
    }
};

const Orders = () => {
    const [orders, setOrders] = useState(initialOrders);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentFilter, setPaymentFilter] = useState("All");

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const [newStatus, setNewStatus] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 6;

    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const totalOrders = orders.length;

    const totalRevenue = orders
        .filter((order) => order.paymentStatus === "Paid")
        .reduce((total, order) => total + order.amount, 0);

    const pendingOrders = orders.filter(
        (order) => order.orderStatus === "Pending"
    ).length;

    const processingOrders = orders.filter(
        (order) => order.orderStatus === "Processing"
    ).length;

    const deliveredOrders = orders.filter(
        (order) => order.orderStatus === "Delivered"
    ).length;

    const cancelledOrders = orders.filter(
        (order) => order.orderStatus === "Cancelled"
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Filtering
    |--------------------------------------------------------------------------
    */

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                order.id.toLowerCase().includes(search) ||
                order.customer.toLowerCase().includes(search) ||
                order.email.toLowerCase().includes(search) ||
                order.vendor.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                order.orderStatus === statusFilter;

            const matchesPayment =
                paymentFilter === "All" ||
                order.paymentStatus === paymentFilter;

            return matchesSearch && matchesStatus && matchesPayment;
        });
    }, [orders, searchTerm, statusFilter, paymentFilter]);

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const totalPages = Math.ceil(
        filteredOrders.length / ordersPerPage
    );

    const startIndex = (currentPage - 1) * ordersPerPage;

    const currentOrders = filteredOrders.slice(
        startIndex,
        startIndex + ordersPerPage
    );

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    /*
    |--------------------------------------------------------------------------
    | View Order
    |--------------------------------------------------------------------------
    */

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    /*
    |--------------------------------------------------------------------------
    | Update Order Status
    |--------------------------------------------------------------------------
    */

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.orderStatus);
        setShowStatusModal(true);
    };

    const handleStatusUpdate = () => {
        if (!selectedOrder || !newStatus) return;

        setOrders((currentOrders) =>
            currentOrders.map((order) =>
                order.id === selectedOrder.id
                    ? {
                          ...order,
                          orderStatus: newStatus,
                      }
                    : order
            )
        );

        setShowStatusModal(false);
        setSelectedOrder(null);
    };

    /*
    |--------------------------------------------------------------------------
    | Delete Order
    |--------------------------------------------------------------------------
    */

    const handleDelete = (orderId) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this order?"
        );

        if (!confirmed) return;

        setOrders((currentOrders) =>
            currentOrders.filter((order) => order.id !== orderId)
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Reset Filters
    |--------------------------------------------------------------------------
    */

    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setPaymentFilter("All");
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

                    <h1>Orders</h1>

                    <p>
                        Manage customer orders, payments, deliveries
                        and marketplace transactions.
                    </p>
                </div>

                <div className="admin-header-actions">

                    <button
                        className="btn btn-outline"
                        onClick={() => window.print()}
                    >
                        <i className="fa-solid fa-print"></i>
                        Print Report
                    </button>

                </div>

            </div>

            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <div className="admin-stats-grid">

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-cart-shopping"></i>
                    </div>

                    <div>
                        <span>Total Orders</span>
                        <strong>{totalOrders}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-money-bill-wave"></i>
                    </div>

                    <div>
                        <span>Total Revenue</span>
                        <strong>{formatCurrency(totalRevenue)}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-clock"></i>
                    </div>

                    <div>
                        <span>Pending</span>
                        <strong>{pendingOrders}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-truck"></i>
                    </div>

                    <div>
                        <span>Processing</span>
                        <strong>{processingOrders}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-circle-check"></i>
                    </div>

                    <div>
                        <span>Delivered</span>
                        <strong>{deliveredOrders}</strong>
                    </div>
                </div>

                <div className="admin-stat-card">
                    <div className="admin-stat-icon">
                        <i className="fa-solid fa-circle-xmark"></i>
                    </div>

                    <div>
                        <span>Cancelled</span>
                        <strong>{cancelledOrders}</strong>
                    </div>
                </div>

            </div>

            {/* =========================================================
                FILTERS
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-card-header">

                    <div>
                        <h2>Order Management</h2>

                        <p>
                            {filteredOrders.length} order
                            {filteredOrders.length !== 1 ? "s" : ""} found
                        </p>
                    </div>

                </div>

                <div className="admin-filters">

                    <div className="admin-search">

                        <i className="fa-solid fa-magnifying-glass"></i>

                        <input
                            type="text"
                            placeholder="Search orders, customers or vendors..."
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setCurrentPage(1);
                            }}
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) => {
                            setStatusFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Order Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(event) => {
                            setPaymentFilter(event.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="All">All Payment Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
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
                ORDERS TABLE
            ========================================================= */}

            <div className="admin-card">

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Vendor</th>
                                <th>Items</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <tr key={order.id}>

                                        <td>
                                            <strong>
                                                {order.id}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="table-user">

                                                <div className="table-avatar">
                                                    {order.customer
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {order.customer}
                                                    </strong>

                                                    <small>
                                                        {order.email}
                                                    </small>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            {order.vendor}
                                        </td>

                                        <td>
                                            {order.items}
                                        </td>

                                        <td>
                                            <strong>
                                                {formatCurrency(
                                                    order.amount
                                                )}
                                            </strong>
                                        </td>

                                        <td>

                                            <div className="table-status">

                                                <span
                                                    className={getStatusClass(
                                                        order.paymentStatus
                                                    )}
                                                >
                                                    {order.paymentStatus}
                                                </span>

                                                <small>
                                                    {order.paymentMethod}
                                                </small>

                                            </div>

                                        </td>

                                        <td>

                                            <span
                                                className={getStatusClass(
                                                    order.orderStatus
                                                )}
                                            >
                                                {order.orderStatus}
                                            </span>

                                        </td>

                                        <td>
                                            {order.date}
                                        </td>

                                        <td>

                                            <div className="admin-table-actions">

                                                <button
                                                    className="icon-btn"
                                                    title="View Order"
                                                    onClick={() =>
                                                        handleViewOrder(order)
                                                    }
                                                >
                                                    <i className="fa-solid fa-eye"></i>
                                                </button>

                                                <button
                                                    className="icon-btn"
                                                    title="Update Status"
                                                    onClick={() =>
                                                        openStatusModal(order)
                                                    }
                                                >
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>

                                                <button
                                                    className="icon-btn danger"
                                                    title="Delete Order"
                                                    onClick={() =>
                                                        handleDelete(order.id)
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
                                        colSpan="9"
                                        className="empty-table"
                                    >

                                        <i className="fa-solid fa-box-open"></i>

                                        <h3>
                                            No orders found
                                        </h3>

                                        <p>
                                            Try changing your search or filters.
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
                            disabled={currentPage === 1}
                            onClick={() =>
                                changePage(currentPage - 1)
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
                                    currentPage === page
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
                                currentPage === totalPages
                            }
                            onClick={() =>
                                changePage(currentPage + 1)
                            }
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>

                    </div>
                )}

            </div>

            {/* =========================================================
                ORDER DETAILS MODAL
            ========================================================= */}

            {showDetailsModal && selectedOrder && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal">

                        <div className="admin-modal-header">

                            <div>
                                <span className="admin-eyebrow">
                                    Order Details
                                </span>

                                <h2>
                                    {selectedOrder.id}
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowDetailsModal(false)
                                }
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                        <div className="admin-modal-body">

                            <div className="order-detail-grid">

                                <div className="detail-item">
                                    <span>Customer</span>
                                    <strong>
                                        {selectedOrder.customer}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Email</span>
                                    <strong>
                                        {selectedOrder.email}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Vendor</span>
                                    <strong>
                                        {selectedOrder.vendor}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Items</span>
                                    <strong>
                                        {selectedOrder.items}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Total Amount</span>
                                    <strong>
                                        {formatCurrency(
                                            selectedOrder.amount
                                        )}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Payment Method</span>
                                    <strong>
                                        {selectedOrder.paymentMethod}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Payment Status</span>

                                    <span
                                        className={getStatusClass(
                                            selectedOrder.paymentStatus
                                        )}
                                    >
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span>Order Status</span>

                                    <span
                                        className={getStatusClass(
                                            selectedOrder.orderStatus
                                        )}
                                    >
                                        {selectedOrder.orderStatus}
                                    </span>
                                </div>

                                <div className="detail-item">
                                    <span>Delivery Location</span>
                                    <strong>
                                        {selectedOrder.delivery}
                                    </strong>
                                </div>

                                <div className="detail-item">
                                    <span>Order Date</span>
                                    <strong>
                                        {selectedOrder.date}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div className="admin-modal-footer">

                            <button
                                className="btn btn-light"
                                onClick={() =>
                                    setShowDetailsModal(false)
                                }
                            >
                                Close
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    openStatusModal(selectedOrder);
                                }}
                            >
                                <i className="fa-solid fa-pen"></i>
                                Update Status
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =========================================================
                STATUS UPDATE MODAL
            ========================================================= */}

            {showStatusModal && selectedOrder && (

                <div className="admin-modal-overlay">

                    <div className="admin-modal admin-modal-small">

                        <div className="admin-modal-header">

                            <div>
                                <span className="admin-eyebrow">
                                    Update Order
                                </span>

                                <h2>
                                    {selectedOrder.id}
                                </h2>
                            </div>

                            <button
                                className="modal-close"
                                onClick={() =>
                                    setShowStatusModal(false)
                                }
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>

                        </div>

                        <div className="admin-modal-body">

                            <div className="form-group">

                                <label>
                                    Order Status
                                </label>

                                <select
                                    value={newStatus}
                                    onChange={(event) =>
                                        setNewStatus(
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Processing">
                                        Processing
                                    </option>

                                    <option value="Shipped">
                                        Shipped
                                    </option>

                                    <option value="Delivered">
                                        Delivered
                                    </option>

                                    <option value="Cancelled">
                                        Cancelled
                                    </option>
                                </select>

                            </div>

                            <div className="status-update-note">

                                <i className="fa-solid fa-circle-info"></i>

                                <p>
                                    Updating the order status will
                                    eventually notify the customer and
                                    vendor through the backend.
                                </p>

                            </div>

                        </div>

                        <div className="admin-modal-footer">

                            <button
                                className="btn btn-light"
                                onClick={() =>
                                    setShowStatusModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="btn btn-primary"
                                onClick={handleStatusUpdate}
                            >
                                <i className="fa-solid fa-check"></i>
                                Save Status
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Orders;
