import React, { useMemo, useState } from "react";
import {
    Search,
    ShoppingBag,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    Eye,
    Package,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Phone,
    User,
} from "lucide-react";

const mockOrders = [
    {
        id: "FK-1048",
        customer: "Kevin Mwangi",
        phone: "0712 345 678",
        product: "Oxdog Hyperlight Floorball Stick",
        quantity: 1,
        amount: 8500,
        payment: "Paid",
        status: "Processing",
        date: "14 Sep 2026",
        location: "Nyeri, Kenya",
    },
    {
        id: "FK-1044",
        customer: "Brian Kiptoo",
        phone: "0722 456 789",
        product: "Floorball Match Ball Pack",
        quantity: 2,
        amount: 3600,
        payment: "Paid",
        status: "Shipped",
        date: "13 Sep 2026",
        location: "Nakuru, Kenya",
    },
    {
        id: "FK-1039",
        customer: "Samuel Kariuki",
        phone: "0701 222 333",
        product: "Kenya Floorball Training Jersey",
        quantity: 1,
        amount: 3200,
        payment: "Paid",
        status: "Delivered",
        date: "11 Sep 2026",
        location: "Nairobi, Kenya",
    },
    {
        id: "FK-1035",
        customer: "Ian Njoroge",
        phone: "0790 333 444",
        product: "Floorball Speed Shoes",
        quantity: 1,
        amount: 7200,
        payment: "Paid",
        status: "Processing",
        date: "10 Sep 2026",
        location: "Eldoret, Kenya",
    },
    {
        id: "FK-1028",
        customer: "David Mutua",
        phone: "0710 777 888",
        product: "Floorball Goalkeeper Helmet",
        quantity: 1,
        amount: 9500,
        payment: "Paid",
        status: "Cancelled",
        date: "8 Sep 2026",
        location: "Thika, Kenya",
    },
];

const formatKES = (value) =>
    new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(value);

export default function VendorOrders() {
    const [orders, setOrders] = useState(mockOrders);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [page, setPage] = useState(1);

    const perPage = 5;

    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchesSearch =
                order.id
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                order.customer
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                order.product
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =
                statusFilter === "All" ||
                order.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [orders, search, statusFilter]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrders.length / perPage)
    );

    const visibleOrders = filteredOrders.slice(
        (page - 1) * perPage,
        page * perPage
    );

    const updateStatus = (id, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === id
                    ? { ...order, status: newStatus }
                    : order
            )
        );

        setSelectedOrder((prev) =>
            prev && prev.id === id
                ? { ...prev, status: newStatus }
                : prev
        );

        // TODO:
        // PATCH /api/vendor/orders/{id}/status
    };

    const processing = orders.filter(
        (order) => order.status === "Processing"
    ).length;

    const shipped = orders.filter(
        (order) => order.status === "Shipped"
    ).length;

    const delivered = orders.filter(
        (order) => order.status === "Delivered"
    ).length;

    const cancelled = orders.filter(
        (order) => order.status === "Cancelled"
    ).length;

    const getStatusIcon = (status) => {
        switch (status) {
            case "Processing":
                return <Clock size={14} />;
            case "Shipped":
                return <Truck size={14} />;
            case "Delivered":
                return <CheckCircle size={14} />;
            case "Cancelled":
                return <XCircle size={14} />;
            default:
                return <Package size={14} />;
        }
    };

    return (
        <main className="vendor-page">
            <div className="vendor-container">

                <div className="vendor-page-header">
                    <div>
                        <span className="vendor-eyebrow">
                            Sales
                        </span>

                        <h1>Orders</h1>

                        <p>
                            Manage customer orders and fulfillment.
                        </p>
                    </div>
                </div>

                {/* STATS */}
                <section className="vendor-order-stats">

                    <div className="vendor-order-stat">
                        <div>
                            <span>Total Orders</span>
                            <strong>{orders.length}</strong>
                        </div>

                        <ShoppingBag size={22} />
                    </div>

                    <div className="vendor-order-stat processing">
                        <div>
                            <span>Processing</span>
                            <strong>{processing}</strong>
                        </div>

                        <Clock size={22} />
                    </div>

                    <div className="vendor-order-stat shipped">
                        <div>
                            <span>Shipped</span>
                            <strong>{shipped}</strong>
                        </div>

                        <Truck size={22} />
                    </div>

                    <div className="vendor-order-stat delivered">
                        <div>
                            <span>Delivered</span>
                            <strong>{delivered}</strong>
                        </div>

                        <CheckCircle size={22} />
                    </div>

                    <div className="vendor-order-stat cancelled">
                        <div>
                            <span>Cancelled</span>
                            <strong>{cancelled}</strong>
                        </div>

                        <XCircle size={22} />
                    </div>

                </section>

                {/* FILTERS */}
                <section className="vendor-filter-card">

                    <div className="vendor-search">
                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search order, customer or product..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option>All</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                    </select>

                </section>

                {/* ORDERS */}
                <section className="vendor-table-card">

                    <div className="vendor-table-header">
                        <div>
                            <span className="vendor-section-label">
                                Customer Orders
                            </span>

                            <h2>
                                {filteredOrders.length} Orders
                            </h2>
                        </div>
                    </div>

                    <div className="vendor-table-wrapper">

                        <table className="vendor-table vendor-orders-table">

                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Product</th>
                                    <th>Amount</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {visibleOrders.map((order) => (
                                    <tr key={order.id}>

                                        <td>
                                            <strong>
                                                #{order.id}
                                            </strong>
                                        </td>

                                        <td>
                                            <div className="vendor-customer-cell">
                                                <div className="vendor-customer-avatar">
                                                    {order.customer
                                                        .split(" ")
                                                        .map((name) => name[0])
                                                        .join("")
                                                        .slice(0, 2)}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {order.customer}
                                                    </strong>

                                                    <span>
                                                        {order.phone}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div className="vendor-order-product">
                                                <strong>
                                                    {order.product}
                                                </strong>

                                                <span>
                                                    Qty: {order.quantity}
                                                </span>
                                            </div>
                                        </td>

                                        <td>
                                            <strong>
                                                {formatKES(order.amount)}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="payment-paid">
                                                <CheckCircle size={13} />
                                                {order.payment}
                                            </span>
                                        </td>

                                        <td>
                                            <span
                                                className={`vendor-status ${order.status.toLowerCase()}`}
                                            >
                                                {getStatusIcon(
                                                    order.status
                                                )}

                                                {order.status}
                                            </span>
                                        </td>

                                        <td>{order.date}</td>

                                        <td>
                                            <button
                                                className="vendor-icon-btn"
                                                onClick={() =>
                                                    setSelectedOrder(order)
                                                }
                                                title="View Order"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>

                    {visibleOrders.length === 0 && (
                        <div className="vendor-empty-state">
                            <ShoppingBag size={42} />

                            <h3>No orders found</h3>

                            <p>
                                There are no orders matching your
                                current filters.
                            </p>
                        </div>
                    )}

                    {filteredOrders.length > 0 && (
                        <div className="vendor-pagination">

                            <span>
                                Page {page} of {totalPages}
                            </span>

                            <div>
                                <button
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.max(1, p - 1)
                                        )
                                    }
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <button
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(
                                                totalPages,
                                                p + 1
                                            )
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

            {/* ORDER MODAL */}
            {selectedOrder && (
                <div
                    className="vendor-modal-overlay"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="vendor-modal vendor-order-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="vendor-modal-header">
                            <div>
                                <span className="vendor-section-label">
                                    Order Details
                                </span>

                                <h2>
                                    #{selectedOrder.id}
                                </h2>
                            </div>

                            <button
                                className="vendor-modal-close"
                                onClick={() =>
                                    setSelectedOrder(null)
                                }
                            >
                                <XCircle size={21} />
                            </button>
                        </div>

                        <div className="vendor-modal-body">

                            <div className="vendor-order-detail-product">
                                <div className="vendor-order-detail-icon">
                                    <Package size={25} />
                                </div>

                                <div>
                                    <strong>
                                        {selectedOrder.product}
                                    </strong>

                                    <span>
                                        Quantity: {selectedOrder.quantity}
                                    </span>
                                </div>
                            </div>

                            <div className="vendor-order-detail-grid">

                                <div>
                                    <span>
                                        <User size={15} />
                                        Customer
                                    </span>

                                    <strong>
                                        {selectedOrder.customer}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        <Phone size={15} />
                                        Phone
                                    </span>

                                    <strong>
                                        {selectedOrder.phone}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        <MapPin size={15} />
                                        Delivery Location
                                    </span>

                                    <strong>
                                        {selectedOrder.location}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Amount
                                    </span>

                                    <strong>
                                        {formatKES(
                                            selectedOrder.amount
                                        )}
                                    </strong>
                                </div>

                            </div>

                            <div className="vendor-order-status-actions">

                                <span className="vendor-section-label">
                                    Update Order Status
                                </span>

                                <div>
                                    {[
                                        "Processing",
                                        "Shipped",
                                        "Delivered",
                                        "Cancelled",
                                    ].map((status) => (
                                        <button
                                            key={status}
                                            className={
                                                selectedOrder.status ===
                                                status
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                updateStatus(
                                                    selectedOrder.id,
                                                    status
                                                )
                                            }
                                        >
                                            {getStatusIcon(status)}
                                            {status}
                                        </button>
                                    ))}
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            )}
        </main>
    );
}