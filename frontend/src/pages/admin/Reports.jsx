import React, { useMemo, useState } from "react";

const monthlyData = [
    {
        month: "Apr",
        revenue: 18500,
        orders: 8,
        matches: 12,
        players: 18,
    },
    {
        month: "May",
        revenue: 26400,
        orders: 12,
        matches: 16,
        players: 24,
    },
    {
        month: "Jun",
        revenue: 38200,
        orders: 17,
        matches: 21,
        players: 31,
    },
    {
        month: "Jul",
        revenue: 44700,
        orders: 21,
        matches: 25,
        players: 39,
    },
    {
        month: "Aug",
        revenue: 59200,
        orders: 28,
        matches: 31,
        players: 47,
    },
    {
        month: "Sep",
        revenue: 73800,
        orders: 34,
        matches: 38,
        players: 56,
    },
];

const topTeams = [
    {
        name: "DeKUT Black Talons",
        matches: 12,
        wins: 9,
        draws: 2,
        losses: 1,
        points: 29,
    },
    {
        name: "Karatina University",
        matches: 12,
        wins: 8,
        draws: 1,
        losses: 3,
        points: 25,
    },
    {
        name: "Nyeri Polytechnic",
        matches: 11,
        wins: 6,
        draws: 2,
        losses: 3,
        points: 20,
    },
    {
        name: "Nyandarua Polytechnic",
        matches: 11,
        wins: 5,
        draws: 2,
        losses: 4,
        points: 17,
    },
    {
        name: "Michuki Technical",
        matches: 10,
        wins: 4,
        draws: 1,
        losses: 5,
        points: 13,
    },
];

const topPlayers = [
    {
        name: "Victor Macharia",
        team: "DeKUT Black Talons",
        matches: 12,
        goals: 18,
        assists: 11,
        points: 29,
    },
    {
        name: "Mildred Kuria",
        team: "DeKUT Black Talons Ladies",
        matches: 11,
        goals: 15,
        assists: 8,
        points: 23,
    },
    {
        name: "Jimmy Bii",
        team: "DeKUT Black Talons",
        matches: 12,
        goals: 12,
        assists: 9,
        points: 21,
    },
    {
        name: "Hillary Kiptoo",
        team: "Karatina University",
        matches: 12,
        goals: 10,
        assists: 7,
        points: 17,
    },
    {
        name: "Faith Njeri",
        team: "Karatina University Ladies",
        matches: 10,
        goals: 9,
        assists: 6,
        points: 15,
    },
];

const categoryData = [
    {
        category: "Sticks",
        sales: 21,
        revenue: 136500,
    },
    {
        category: "Jerseys",
        sales: 18,
        revenue: 57600,
    },
    {
        category: "Shoes",
        sales: 11,
        revenue: 85800,
    },
    {
        category: "Balls",
        sales: 34,
        revenue: 61200,
    },
    {
        category: "Goalkeeper Gear",
        sales: 7,
        revenue: 98000,
    },
];

const vendorData = [
    {
        vendor: "Floorball Kenya Sports",
        orders: 24,
        sales: 168500,
        commission: 16850,
    },
    {
        vendor: "Sports Hub Kenya",
        orders: 19,
        sales: 121800,
        commission: 12180,
    },
    {
        vendor: "Floorball Gear KE",
        orders: 16,
        sales: 108600,
        commission: 10860,
    },
    {
        vendor: "Black Talons Store",
        orders: 12,
        sales: 74500,
        commission: 7450,
    },
];

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        maximumFractionDigits: 0,
    }).format(amount);
};

const Reports = () => {
    const [period, setPeriod] = useState("6 Months");
    const [reportType, setReportType] = useState("Overview");

    const latestMonth =
        monthlyData[monthlyData.length - 1];

    const previousMonth =
        monthlyData[monthlyData.length - 2];

    const revenueGrowth =
        previousMonth.revenue > 0
            ? (
                  ((latestMonth.revenue -
                      previousMonth.revenue) /
                      previousMonth.revenue) *
                  100
              ).toFixed(1)
            : 0;

    const orderGrowth =
        previousMonth.orders > 0
            ? (
                  ((latestMonth.orders -
                      previousMonth.orders) /
                      previousMonth.orders) *
                      100
              ).toFixed(1)
            : 0;

    const totalRevenue = monthlyData.reduce(
        (total, item) => total + item.revenue,
        0
    );

    const totalOrders = monthlyData.reduce(
        (total, item) => total + item.orders,
        0
    );

    const totalMatches = monthlyData.reduce(
        (total, item) => total + item.matches,
        0
    );

    const totalRegisteredPlayers =
        latestMonth.players;

    const totalMarketplaceSales =
        vendorData.reduce(
            (total, vendor) =>
                total + vendor.sales,
            0
        );

    const totalCommission =
        vendorData.reduce(
            (total, vendor) =>
                total + vendor.commission,
            0
        );

    const totalCategorySales =
        categoryData.reduce(
            (total, category) =>
                total + category.sales,
            0
        );

    const highestRevenueCategory =
        useMemo(() => {
            return [...categoryData].sort(
                (a, b) => b.revenue - a.revenue
            )[0];
        }, []);

    const handleExport = () => {
        window.alert(
            "Report export will be connected to the backend later."
        );
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="admin-page">

            {/* =========================================================
                PAGE HEADER
            ========================================================= */}

            <div className="admin-page-header">

                <div>

                    <span className="admin-eyebrow">
                        Analytics
                    </span>

                    <h1>Reports</h1>

                    <p>
                        Monitor platform performance,
                        sports activity and marketplace
                        analytics.
                    </p>

                </div>

                <div className="admin-header-actions">

                    <select
                        className="report-period-select"
                        value={period}
                        onChange={(event) =>
                            setPeriod(
                                event.target.value
                            )
                        }
                    >
                        <option value="30 Days">
                            Last 30 Days
                        </option>

                        <option value="3 Months">
                            Last 3 Months
                        </option>

                        <option value="6 Months">
                            Last 6 Months
                        </option>

                        <option value="1 Year">
                            Last Year
                        </option>
                    </select>

                    <button
                        className="btn btn-outline"
                        onClick={handlePrint}
                    >
                        <i className="fa-solid fa-print"></i>
                        Print
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={handleExport}
                    >
                        <i className="fa-solid fa-file-export"></i>
                        Export Report
                    </button>

                </div>

            </div>

            {/* =========================================================
                REPORT TYPE TABS
            ========================================================= */}

            <div className="report-tabs">

                {[
                    "Overview",
                    "Sports",
                    "Marketplace",
                    "Users",
                ].map((type) => (
                    <button
                        key={type}
                        className={
                            reportType === type
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setReportType(type)
                        }
                    >
                        {type}
                    </button>
                ))}

            </div>

            {/* =========================================================
                OVERVIEW REPORT
            ========================================================= */}

            {reportType === "Overview" && (
                <>

                    {/* =================================================
                        MAIN STATISTICS
                    ================================================= */}

                    <div className="admin-stats-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-money-bill-wave"></i>
                            </div>

                            <div>

                                <span>
                                    Marketplace Revenue
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalRevenue
                                    )}
                                </strong>

                                <small className="stat-growth positive">
                                    <i className="fa-solid fa-arrow-up"></i>
                                    {revenueGrowth}%
                                </small>

                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </div>

                            <div>

                                <span>
                                    Marketplace Orders
                                </span>

                                <strong>
                                    {totalOrders}
                                </strong>

                                <small className="stat-growth positive">
                                    <i className="fa-solid fa-arrow-up"></i>
                                    {orderGrowth}%
                                </small>

                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-futbol"></i>
                            </div>

                            <div>

                                <span>
                                    Matches Played
                                </span>

                                <strong>
                                    {totalMatches}
                                </strong>

                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <div>

                                <span>
                                    Registered Players
                                </span>

                                <strong>
                                    {
                                        totalRegisteredPlayers
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-percent"></i>
                            </div>

                            <div>

                                <span>
                                    Platform Commission
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalCommission
                                    )}
                                </strong>

                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-box"></i>
                            </div>

                            <div>

                                <span>
                                    Products Sold
                                </span>

                                <strong>
                                    {
                                        totalCategorySales
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* =================================================
                        REVENUE CHART
                    ================================================= */}

                    <div className="admin-card">

                        <div className="admin-card-header">

                            <div>

                                <h2>
                                    Revenue Overview
                                </h2>

                                <p>
                                    Marketplace revenue
                                    performance over
                                    {period.toLowerCase()}.
                                </p>

                            </div>

                            <span className="chart-summary">
                                {formatCurrency(
                                    totalRevenue
                                )}
                            </span>

                        </div>

                        <div className="simple-chart">

                            {monthlyData.map(
                                (item) => {

                                    const maxRevenue =
                                        Math.max(
                                            ...monthlyData.map(
                                                (
                                                    month
                                                ) =>
                                                    month.revenue
                                            )
                                        );

                                    const height =
                                        (item.revenue /
                                            maxRevenue) *
                                        100;

                                    return (
                                        <div
                                            className="chart-column"
                                            key={
                                                item.month
                                            }
                                        >

                                            <div className="chart-value">
                                                {formatCurrency(
                                                    item.revenue
                                                )}
                                            </div>

                                            <div className="chart-bar-container">

                                                <div
                                                    className="chart-bar"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    item.month
                                                }
                                            </span>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        ACTIVITY SUMMARY
                    ================================================= */}

                    <div className="admin-two-column">

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>
                                    <h2>
                                        Platform Activity
                                    </h2>

                                    <p>
                                        Monthly system
                                        activity.
                                    </p>
                                </div>

                            </div>

                            <div className="activity-report-list">

                                {monthlyData.map(
                                    (item) => (
                                        <div
                                            className="activity-report-row"
                                            key={
                                                item.month
                                            }
                                        >

                                            <strong>
                                                {
                                                    item.month
                                                }
                                            </strong>

                                            <div>
                                                <span>
                                                    {
                                                        item.orders
                                                    }{" "}
                                                    orders
                                                </span>

                                                <span>
                                                    {
                                                        item.matches
                                                    }{" "}
                                                    matches
                                                </span>

                                                <span>
                                                    {
                                                        item.players
                                                    }{" "}
                                                    players
                                                </span>
                                            </div>

                                            <strong>
                                                {formatCurrency(
                                                    item.revenue
                                                )}
                                            </strong>

                                        </div>
                                    )
                                )}

                            </div>

                        </div>

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>
                                    <h2>
                                        Top Product
                                        Category
                                    </h2>

                                    <p>
                                        Highest revenue
                                        category.
                                    </p>
                                </div>

                            </div>

                            <div className="featured-report-card">

                                <div className="report-icon-large">
                                    <i className="fa-solid fa-trophy"></i>
                                </div>

                                <h3>
                                    {
                                        highestRevenueCategory.category
                                    }
                                </h3>

                                <strong>
                                    {formatCurrency(
                                        highestRevenueCategory.revenue
                                    )}
                                </strong>

                                <p>
                                    {
                                        highestRevenueCategory.sales
                                    }{" "}
                                    items sold
                                </p>

                            </div>

                        </div>

                    </div>

                </>
            )}

            {/* =========================================================
                SPORTS REPORT
            ========================================================= */}

            {reportType === "Sports" && (
                <>

                    <div className="admin-stats-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-futbol"></i>
                            </div>

                            <div>
                                <span>
                                    Matches Played
                                </span>
                                <strong>
                                    {totalMatches}
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <div>
                                <span>
                                    Registered Players
                                </span>
                                <strong>
                                    {
                                        totalRegisteredPlayers
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-ranking-star"></i>
                            </div>

                            <div>
                                <span>
                                    Teams Ranked
                                </span>
                                <strong>
                                    {
                                        topTeams.length
                                    }
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>
                                    League Performance
                                </h2>

                                <p>
                                    Current team standings
                                    and performance.
                                </p>
                            </div>

                        </div>

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>
                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Team
                                        </th>

                                        <th>
                                            Matches
                                        </th>

                                        <th>
                                            Wins
                                        </th>

                                        <th>
                                            Draws
                                        </th>

                                        <th>
                                            Losses
                                        </th>

                                        <th>
                                            Points
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {topTeams.map(
                                        (
                                            team,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    team.name
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {index +
                                                            1}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            team.name
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        team.matches
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        team.wins
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        team.draws
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        team.losses
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            team.points
                                                        }
                                                    </strong>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>
                                    Top Players
                                </h2>

                                <p>
                                    Player performance
                                    statistics.
                                </p>
                            </div>

                        </div>

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>
                                        <th>
                                            Player
                                        </th>

                                        <th>
                                            Team
                                        </th>

                                        <th>
                                            Matches
                                        </th>

                                        <th>
                                            Goals
                                        </th>

                                        <th>
                                            Assists
                                        </th>

                                        <th>
                                            Points
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {topPlayers.map(
                                        (player) => (
                                            <tr
                                                key={
                                                    player.name
                                                }
                                            >

                                                <td>

                                                    <div className="table-user">

                                                        <div className="table-avatar">
                                                            {player.name
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <strong>
                                                            {
                                                                player.name
                                                            }
                                                        </strong>

                                                    </div>

                                                </td>

                                                <td>
                                                    {
                                                        player.team
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        player.matches
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        player.goals
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        player.assists
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            player.points
                                                        }
                                                    </strong>
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </>
            )}

            {/* =========================================================
                MARKETPLACE REPORT
            ========================================================= */}

            {reportType === "Marketplace" && (
                <>

                    <div className="admin-stats-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-money-bill-wave"></i>
                            </div>

                            <div>
                                <span>
                                    Total Sales
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalMarketplaceSales
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-percent"></i>
                            </div>

                            <div>
                                <span>
                                    Commission
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totalCommission
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-cart-shopping"></i>
                            </div>

                            <div>
                                <span>
                                    Total Orders
                                </span>

                                <strong>
                                    {totalOrders}
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>
                                    Vendor Performance
                                </h2>

                                <p>
                                    Sales and commission
                                    generated by vendors.
                                </p>
                            </div>

                        </div>

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>
                                        <th>
                                            Vendor
                                        </th>

                                        <th>
                                            Orders
                                        </th>

                                        <th>
                                            Gross Sales
                                        </th>

                                        <th>
                                            Commission
                                        </th>

                                        <th>
                                            Vendor Payout
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {vendorData.map(
                                        (vendor) => (
                                            <tr
                                                key={
                                                    vendor.vendor
                                                }
                                            >

                                                <td>
                                                    <strong>
                                                        {
                                                            vendor.vendor
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        vendor.orders
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {formatCurrency(
                                                            vendor.sales
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        vendor.commission
                                                    )}
                                                </td>

                                                <td>
                                                    {formatCurrency(
                                                        vendor.sales -
                                                            vendor.commission
                                                    )}
                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="admin-card">

                        <div className="admin-card-header">

                            <div>
                                <h2>
                                    Product Category
                                    Performance
                                </h2>

                                <p>
                                    Sales by marketplace
                                    category.
                                </p>
                            </div>

                        </div>

                        <div className="admin-table-wrapper">

                            <table className="admin-table">

                                <thead>

                                    <tr>
                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Units Sold
                                        </th>

                                        <th>
                                            Revenue
                                        </th>

                                        <th>
                                            Share
                                        </th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {categoryData.map(
                                        (category) => {

                                            const share =
                                                totalMarketplaceSales >
                                                0
                                                    ? (
                                                          (category.revenue /
                                                              totalMarketplaceSales) *
                                                          100
                                                      ).toFixed(
                                                          1
                                                      )
                                                    : 0;

                                            return (
                                                <tr
                                                    key={
                                                        category.category
                                                    }
                                                >

                                                    <td>
                                                        <strong>
                                                            {
                                                                category.category
                                                            }
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {
                                                            category.sales
                                                        }
                                                    </td>

                                                    <td>
                                                        {formatCurrency(
                                                            category.revenue
                                                        )}
                                                    </td>

                                                    <td>

                                                        <div className="report-progress">

                                                            <div className="report-progress-bar">

                                                                <div
                                                                    style={{
                                                                        width: `${share}%`,
                                                                    }}
                                                                ></div>

                                                            </div>

                                                            <span>
                                                                {
                                                                    share
                                                                }%
                                                            </span>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </>
            )}

            {/* =========================================================
                USERS REPORT
            ========================================================= */}

            {reportType === "Users" && (
                <>

                    <div className="admin-stats-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <div>
                                <span>
                                    Total Users
                                </span>

                                <strong>
                                    184
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>

                            <div>
                                <span>
                                    New Users
                                </span>

                                <strong>
                                    32
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-user-group"></i>
                            </div>

                            <div>
                                <span>
                                    Players
                                </span>

                                <strong>
                                    56
                                </strong>
                            </div>

                        </div>

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon">
                                <i className="fa-solid fa-store"></i>
                            </div>

                            <div>
                                <span>
                                    Vendors
                                </span>

                                <strong>
                                    12
                                </strong>
                            </div>

                        </div>

                    </div>

                    <div className="admin-two-column">

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>
                                    <h2>
                                        User Growth
                                    </h2>

                                    <p>
                                        Registered users
                                        over time.
                                    </p>
                                </div>

                            </div>

                            <div className="simple-chart">

                                {monthlyData.map(
                                    (item) => {

                                        const maxPlayers =
                                            Math.max(
                                                ...monthlyData.map(
                                                    (
                                                        month
                                                    ) =>
                                                        month.players
                                                )
                                            );

                                        const height =
                                            (item.players /
                                                maxPlayers) *
                                            100;

                                        return (
                                            <div
                                                className="chart-column"
                                                key={
                                                    item.month
                                                }
                                            >

                                                <div className="chart-value">
                                                    {
                                                        item.players
                                                    }
                                                </div>

                                                <div className="chart-bar-container">

                                                    <div
                                                        className="chart-bar"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    ></div>

                                                </div>

                                                <span>
                                                    {
                                                        item.month
                                                    }
                                                </span>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                        <div className="admin-card">

                            <div className="admin-card-header">

                                <div>
                                    <h2>
                                        User Roles
                                    </h2>

                                    <p>
                                        Platform account
                                        distribution.
                                    </p>
                                </div>

                            </div>

                            <div className="role-report-list">

                                <div>
                                    <span>
                                        Players
                                    </span>

                                    <strong>
                                        56
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Team Managers
                                    </span>

                                    <strong>
                                        28
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Vendors
                                    </span>

                                    <strong>
                                        12
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Coaches
                                    </span>

                                    <strong>
                                        17
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        General Users
                                    </span>

                                    <strong>
                                        70
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        Administrators
                                    </span>

                                    <strong>
                                        1
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </>
            )}

            {/* =========================================================
                REPORT FOOTER
            ========================================================= */}

            <div className="report-footer">

                <div>

                    <i className="fa-solid fa-circle-info"></i>

                    <span>
                        Report period:{" "}
                        <strong>
                            {period}
                        </strong>
                    </span>

                </div>

                <span>
                    Generated from FloorballKenya
                    platform data.
                </span>

            </div>

        </div>
    );
};

export default Reports;

