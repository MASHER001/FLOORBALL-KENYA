import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    ShoppingCart,
    SlidersHorizontal,
    ChevronDown,
    Star,
    Heart,
    ArrowRight,
    Package,
} from "lucide-react";

const Shop = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("featured");
    const [showFilters, setShowFilters] = useState(false);

    const products = [
        {
            id: 1,
            name: "Floorball Pro Stick 29",
            category: "Sticks",
            price: 6500,
            oldPrice: 7200,
            rating: 4.8,
            reviews: 24,
            vendor: "Floorball Kenya Store",
            image: "/images/products/sticks/stick-1.jpg",
            featured: true,
        },
        {
            id: 2,
            name: "Official Floorball Balls - Pack of 6",
            category: "Balls",
            price: 1800,
            rating: 4.9,
            reviews: 31,
            vendor: "Kenya Sports Hub",
            image: "/images/products/balls/balls-1.jpg",
            featured: true,
        },
        {
            id: 3,
            name: "Floorball Training Shoes",
            category: "Shoes",
            price: 5200,
            oldPrice: 5800,
            rating: 4.6,
            reviews: 18,
            vendor: "Nyeri Sports House",
            image: "/images/products/shoes/shoes-1.jpg",
            featured: true,
        },
        {
            id: 4,
            name: "Professional Goalkeeper Helmet",
            category: "Goalkeeper Gear",
            price: 12500,
            rating: 4.9,
            reviews: 12,
            vendor: "Goalie Gear Kenya",
            image: "/images/products/helmets/helmet-1.jpg",
            featured: true,
        },
        {
            id: 5,
            name: "Floorball Jersey - Black",
            category: "Jerseys",
            price: 2800,
            rating: 4.7,
            reviews: 29,
            vendor: "Central Sports Merchants",
            image: "/images/products/jerseys/jersey-1.jpg",
        },
        {
            id: 6,
            name: "Replacement Floorball Blade",
            category: "Blades",
            price: 2200,
            rating: 4.5,
            reviews: 15,
            vendor: "East Africa Hockey Supplies",
            image: "/images/products/blades/blade-1.jpg",
        },
        {
            id: 7,
            name: "Floorball Goal Net",
            category: "Goal Posts & Nets",
            price: 8500,
            rating: 4.8,
            reviews: 9,
            vendor: "Floorball Kenya Store",
            image: "/images/products/goal-post-nets/net-1.jpg",
        },
        {
            id: 8,
            name: "Floorball Match Stick",
            category: "Sticks",
            price: 7800,
            rating: 4.7,
            reviews: 21,
            vendor: "Kenya Sports Hub",
            image: "/images/products/sticks/stick-2.jpg",
        },
    ];

    const categories = [
        "All",
        "Sticks",
        "Jerseys",
        "Shoes",
        "Balls",
        "Blades",
        "Goalkeeper Gear",
        "Goal Posts & Nets",
    ];

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (category !== "All") {
            result = result.filter(
                (product) =>
                    product.category === category
            );
        }

        if (search.trim()) {
            const query = search.toLowerCase();

            result = result.filter(
                (product) =>
                    product.name
                        .toLowerCase()
                        .includes(query) ||
                    product.category
                        .toLowerCase()
                        .includes(query) ||
                    product.vendor
                        .toLowerCase()
                        .includes(query)
            );
        }

        if (sort === "price-low") {
            result.sort(
                (a, b) => a.price - b.price
            );
        }

        if (sort === "price-high") {
            result.sort(
                (a, b) => b.price - a.price
            );
        }

        if (sort === "rating") {
            result.sort(
                (a, b) => b.rating - a.rating
            );
        }

        if (sort === "featured") {
            result.sort(
                (a, b) =>
                    Number(b.featured) -
                    Number(a.featured)
            );
        }

        return result;
    }, [search, category, sort]);

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    return (
        <div className="marketplace-page">

            {/* Marketplace Hero */}
            <section className="shop-hero">

                <div className="marketplace-container">

                    <div className="shop-hero-content">

                        <span className="marketplace-eyebrow">
                            FLOORBALL MARKETPLACE
                        </span>

                        <h1>
                            Gear up for
                            <span> the game.</span>
                        </h1>

                        <p>
                            Discover floorball sticks, shoes,
                            jerseys, balls, goalkeeper gear and
                            more from vendors across Kenya.
                        </p>

                        <div className="shop-search-large">

                            <Search size={21} />

                            <input
                                type="search"
                                placeholder="Search sticks, shoes, balls, jerseys..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                            <button>
                                Search
                            </button>

                        </div>

                    </div>

                </div>

            </section>

            <div className="marketplace-container">

                {/* Categories */}
                <div className="shop-categories">

                    {categories.map((item) => (
                        <button
                            key={item}
                            className={
                                category === item
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setCategory(item)
                            }
                        >
                            {item}
                        </button>
                    ))}

                </div>

                {/* Toolbar */}
                <div className="shop-toolbar">

                    <div>
                        <strong>
                            {filteredProducts.length}
                        </strong>{" "}
                        products
                    </div>

                    <div className="shop-toolbar-actions">

                        <button
                            className="filter-toggle"
                            onClick={() =>
                                setShowFilters(
                                    !showFilters
                                )
                            }
                        >
                            <SlidersHorizontal
                                size={17}
                            />
                            Filters
                        </button>

                        <div className="shop-sort">

                            <span>
                                Sort by
                            </span>

                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="featured">
                                    Featured
                                </option>

                                <option value="rating">
                                    Top Rated
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>
                            </select>

                            <ChevronDown
                                size={15}
                            />

                        </div>

                    </div>

                </div>

                {showFilters && (
                    <div className="shop-filter-panel">

                        <div>
                            <strong>
                                Category
                            </strong>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >
                                {categories.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                    </div>
                )}

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <div className="marketplace-empty-state">

                        <div className="empty-state-icon">
                            <Package size={42} />
                        </div>

                        <h2>
                            No products found
                        </h2>

                        <p>
                            Try a different search or
                            category.
                        </p>

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSearch("");
                                setCategory("All");
                            }}
                        >
                            Clear Filters
                        </button>

                    </div>
                ) : (
                    <div className="product-grid">

                        {filteredProducts.map(
                            (product) => (
                                <article
                                    className="marketplace-product-card"
                                    key={product.id}
                                >

                                    <div className="product-card-image">

                                        {product.image ? (
                                            <img
                                                src={
                                                    product.image
                                                }
                                                alt={
                                                    product.name
                                                }
                                            />
                                        ) : (
                                            <ShoppingCart
                                                size={50}
                                            />
                                        )}

                                        {product.oldPrice && (
                                            <span className="sale-badge">
                                                SALE
                                            </span>
                                        )}

                                        <button className="product-wishlist">
                                            <Heart
                                                size={18}
                                            />
                                        </button>

                                    </div>

                                    <div className="product-card-content">

                                        <span className="product-category">
                                            {
                                                product.category
                                            }
                                        </span>

                                        <Link
                                            to={`/products/${product.id}`}
                                        >
                                            <h3>
                                                {
                                                    product.name
                                                }
                                            </h3>
                                        </Link>

                                        <div className="product-card-rating">

                                            <Star
                                                size={15}
                                                fill="currentColor"
                                            />

                                            <strong>
                                                {
                                                    product.rating
                                                }
                                            </strong>

                                            <span>
                                                (
                                                {
                                                    product.reviews
                                                }
                                                )
                                            </span>

                                        </div>

                                        <div className="product-card-price">

                                            <strong>
                                                {formatKES(
                                                    product.price
                                                )}
                                            </strong>

                                            {product.oldPrice && (
                                                <del>
                                                    {formatKES(
                                                        product.oldPrice
                                                    )}
                                                </del>
                                            )}

                                        </div>

                                        <div className="product-card-vendor">

                                            <span>
                                                Sold by
                                            </span>

                                            <strong>
                                                {
                                                    product.vendor
                                                }
                                            </strong>

                                        </div>

                                        <Link
                                            to={`/products/${product.id}`}
                                            className="product-card-button"
                                        >
                                            View Product
                                            <ArrowRight
                                                size={16}
                                            />
                                        </Link>

                                    </div>

                                </article>
                            )
                        )}

                    </div>
                )}

                {/* Become Vendor */}
                <section className="vendor-cta">

                    <div>
                        <span className="marketplace-eyebrow">
                            SELL ON FLOORBALL KENYA
                        </span>

                        <h2>
                            Have floorball equipment
                            to sell?
                        </h2>

                        <p>
                            Join our growing marketplace and
                            reach players, teams and schools
                            across Kenya.
                        </p>
                    </div>

                    <Link
                        to="/register"
                        className="btn btn-primary"
                    >
                        Become a Vendor
                        <ArrowRight size={18} />
                    </Link>

                </section>

            </div>
        </div>
    );
};

export default Shop;