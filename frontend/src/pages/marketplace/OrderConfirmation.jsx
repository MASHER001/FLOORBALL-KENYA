import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    Search,
    ArrowRight,
    ShoppingBag,
} from "lucide-react";

const MyOrders = () => {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const orders = [
        {
            id: "FK-2026-00124",
            date: "15 Sep 2026",
            status: "Delivered",
            items: 2,
            total: 8300,
            products: [
                "Floorball Pro Stick 29",
                "Official Floorball Balls",
            ],
        },
        {
            id: "FK-2026-00118",
            date: "11 Sep 2026",
            status: "In Transit",
            items: 1,
            total: 5200,
            products: ["Floorball Training Shoes"],
        },
        {
            id: "FK-2026-00097",
            date: "03 Sep 2026",
            status: "Processing",
            items: 3,
            total: 12400,
            products: [
                "Goalkeeper Helmet",
                "Goalkeeper Gloves",
                "Floorball Balls",
            ],
        },
        {
            id: "FK-2026-00074",
            date: "28 Aug 2026",
            status: "Cancelled",
            items: 1,
            total: 6500,
            products: ["Floorball Stick"],
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesFilter =
            filter === "all" ||
            order.status.toLowerCase().replace(" ", "-") ===
                filter;

        const matchesSearch =
            order.id
                .toLowerCase()
                .includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    const getStatusIcon = (status) => {
        if (status === "Delivered")
            return <CheckCircle size={17} />;

        if (status === "In Transit")
            return <Truck size={17} />;

        if (status === "Processing")
            return <Clock size={17} />;

        return <Package size={17} />;
    };

    return (
        <div className="marketplace-page">

            <div className="marketplace-container">

                <div className="marketplace-page-header">

                    <div>
                        <span className="marketplace-eyebrow">
                            MY ACCOUNT
                        </span>

                        <h1>My Orders</h1>

                        <p>
                            Track and manage your Floorball Kenya
                            marketplace orders.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="btn btn-primary"
                    >
                        <ShoppingBag size={18} />
                        Shop Now
                    </Link>

                </div>

                {/* Search / Filters */}
                <div className="orders-toolbar">

                    <div className="orders-search">
                        <Search size={18} />

                        <input
                            placeholder="Search order number..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="orders-filter-tabs">

                        {[
                            ["all", "All Orders"],
                            ["processing", "Processing"],
                            ["in-transit", "In Transit"],
                            ["delivered", "Delivered"],
                            ["cancelled", "Cancelled"],
                        ].map(([value, label]) => (
                            <button
                                key={value}
                                className={
                                    filter === value
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    setFilter(value)
                                }
                            >
                                {label}
                            </button>
                        ))}

                    </div>

                </div>

                {/* Orders */}
                <div className="orders-list">

                    {filteredOrders.length === 0 ? (
                        <div className="marketplace-empty-state">
                            <div className="empty-state-icon">
                                <Package size={40} />
                            </div>

                            <h2>No orders found</h2>

                            <p>
                                Try another search or filter.
                            </p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div
                                className="order-card"
                                key={order.id}
                            >

                                <div className="order-card-header">

                                    <div>
                                        <span>
                                            ORDER
                                        </span>

                                        <strong>
                                            {order.id}
                                        </strong>

                                        <small>
                                            {order.date}
                                        </small>
                                    </div>

                                    <span
                                        className={`order-status ${order.status
                                            .toLowerCase()
                                            .replace(
                                                " ",
                                                "-"
                                            )}`}
                                    >
                                        {getStatusIcon(
                                            order.status
                                        )}

                                        {order.status}
                                    </span>

                                </div>

                                <div className="order-card-body">

                                    <div className="order-products">

                                        {order.products.map(
                                            (product, index) => (
                                                <div
                                                    className="order-product-row"
                                                    key={index}
                                                >
                                                    <div className="order-product-icon">
                                                        <Package
                                                            size={18}
                                                        />
                                                    </div>

                                                    <span>
                                                        {
                                                            product
                                                        }
                                                    </span>
                                                </div>
                                            )
                                        )}

                                    </div>

                                    <div className="order-meta">

                                        <div>
                                            <span>
                                                Items
                                            </span>

                                            <strong>
                                                {order.items}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                {formatKES(
                                                    order.total
                                                )}
                                            </strong>
                                        </div>

                                    </div>

                                </div>

                                <div className="order-card-footer">

                                    <span>
                                        Order placed on{" "}
                                        {order.date}
                                    </span>

                                    <Link
                                        to={`/orders/${order.id}`}
                                        className="order-view-link"
                                    >
                                        View Order
                                        <ArrowRight
                                            size={16}
                                        />
                                    </Link>

                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>
        </div>
    );
};

export default MyOrders;