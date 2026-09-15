import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {

    const sportsLinks = [
        {
            name: "Dashboard",
            path: "/admin",
            icon: "fa-chart-pie",
        },
        {
            name: "Users",
            path: "/admin/users",
            icon: "fa-users",
        },
        {
            name: "Teams",
            path: "/admin/teams",
            icon: "fa-people-group",
        },
        {
            name: "Players",
            path: "/admin/players",
            icon: "fa-person-running",
        },
        {
            name: "Leagues",
            path: "/admin/leagues",
            icon: "fa-trophy",
        },
        {
            name: "Tournaments",
            path: "/admin/tournaments",
            icon: "fa-calendar-days",
        },
        {
            name: "Matches",
            path: "/admin/matches",
            icon: "fa-futbol",
        },
    ];

    const marketplaceLinks = [
        {
            name: "Vendors",
            path: "/admin/vendors",
            icon: "fa-store",
        },
        {
            name: "Products",
            path: "/admin/products",
            icon: "fa-box",
        },
        {
            name: "Orders",
            path: "/admin/orders",
            icon: "fa-cart-shopping",
        },
        {
            name: "Reports",
            path: "/admin/reports",
            icon: "fa-chart-line",
        },
    ];

    return (
        <aside className="admin-sidebar">

            {/* LOGO */}

            <div className="admin-sidebar-logo">

                <div className="admin-logo-mark">
                    FK
                </div>

                <div>
                    <strong>Floorball</strong>
                    <span>Kenya</span>
                </div>

            </div>


            {/* PLATFORM */}

            <div className="sidebar-group">

                <span className="sidebar-label">
                    PLATFORM
                </span>

                <nav>

                    {sportsLinks.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/admin"}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <i className={`fa-solid ${item.icon}`}></i>

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </nav>

            </div>


            {/* MARKETPLACE */}

            <div className="sidebar-group">

                <span className="sidebar-label">
                    MARKETPLACE
                </span>

                <nav>

                    {marketplaceLinks.map((item) => (

                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <i className={`fa-solid ${item.icon}`}></i>

                            <span>
                                {item.name}
                            </span>

                        </NavLink>

                    ))}

                </nav>

            </div>


            {/* BOTTOM */}

            <div className="sidebar-bottom">

                <NavLink
                    to="/"
                    className="sidebar-link"
                >
                    <i className="fa-solid fa-globe"></i>
                    <span>View Website</span>
                </NavLink>

                <button className="sidebar-link logout-link">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
};

export default AdminSidebar;

