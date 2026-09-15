import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Trophy,
    CalendarDays,
    Users,
    ShoppingBag,
    Newspaper,
    MapPin,
    ChevronRight,
    Star,
} from "lucide-react";

const Home = () => {
    const leagues = [
        {
            name: "Kenya University Floorball League",
            season: "2026 Season",
            teams: 12,
            status: "Ongoing",
        },
        {
            name: "Central Kenya Floorball League",
            season: "2026 Season",
            teams: 8,
            status: "Registration Open",
        },
        {
            name: "National Floorball Championship",
            season: "2026",
            teams: 16,
            status: "Upcoming",
        },
    ];

    const tournaments = [
        {
            name: "Black Talons Invitational",
            date: "24 Oct 2026",
            location: "Nyeri",
            teams: 8,
        },
        {
            name: "Central Kenya Floorball Open",
            date: "14 Nov 2026",
            location: "Karatina",
            teams: 12,
        },
        {
            name: "Kenya University Floorball Cup",
            date: "05 Dec 2026",
            location: "Chuka",
            teams: 16,
        },
    ];

    const products = [
        {
            id: 1,
            name: "Floorball Pro Stick 29",
            category: "Sticks",
            price: 6500,
            rating: 4.8,
            image: "/images/products/sticks/stick-1.jpg",
        },
        {
            id: 2,
            name: "Official Floorball Balls",
            category: "Balls",
            price: 1800,
            rating: 4.9,
            image: "/images/products/balls/balls-1.jpg",
        },
        {
            id: 3,
            name: "Floorball Training Shoes",
            category: "Shoes",
            price: 5200,
            rating: 4.6,
            image: "/images/products/shoes/shoes-1.jpg",
        },
        {
            id: 4,
            name: "Floorball Match Jersey",
            category: "Jerseys",
            price: 2800,
            rating: 4.7,
            image: "/images/products/jerseys/jersey-1.jpg",
        },
    ];

    const news = [
        {
            id: 1,
            title: "Black Talons prepare for the new floorball season",
            category: "Teams",
            date: "12 Sep 2026",
            image: "/images/news/news-1.jpg",
        },
        {
            id: 2,
            title: "Registration opens for Central Kenya Floorball Open",
            category: "Tournaments",
            date: "09 Sep 2026",
            image: "/images/news/news-2.jpg",
        },
        {
            id: 3,
            title: "Why access to equipment matters for Kenyan floorball",
            category: "Community",
            date: "05 Sep 2026",
            image: "/images/news/news-3.jpg",
        },
    ];

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    return (
        <div className="public-page home-page">

            {/* Hero */}
            <section className="home-hero">

                <div className="public-container">

                    <div className="home-hero-content">

                        <span className="public-eyebrow">
                            KENYA'S FLOORBALL PLATFORM
                        </span>

                        <h1>
                            Everything
                            <span> Floorball</span>
                            <br />
                            in Kenya.
                        </h1>

                        <p>
                            Discover leagues, tournaments,
                            teams, players, news and floorball
                            equipment — all in one place.
                        </p>

                        <div className="home-hero-actions">

                            <Link
                                to="/tournaments"
                                className="btn btn-primary"
                            >
                                Explore Competitions
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/shop"
                                className="btn btn-outline"
                            >
                                Shop Equipment
                                <ShoppingBag size={18} />
                            </Link>

                        </div>

                        <div className="home-hero-trust">

                            <div>
                                <strong>
                                    50+
                                </strong>
                                <span>
                                    Teams
                                </span>
                            </div>

                            <div>
                                <strong>
                                    100+
                                </strong>
                                <span>
                                    Players
                                </span>
                            </div>

                            <div>
                                <strong>
                                    20+
                                </strong>
                                <span>
                                    Competitions
                                </span>
                            </div>

                        </div>

                    </div>

                    <div className="home-hero-visual">

                        <div className="hero-score-card">

                            <div className="hero-score-header">
                                <span>
                                    LIVE MATCH
                                </span>

                                <span className="live-dot">
                                    LIVE
                                </span>
                            </div>

                            <div className="hero-match-team">
                                <div className="hero-team-logo">
                                    BT
                                </div>

                                <strong>
                                    Black Talons
                                </strong>

                                <b>4</b>
                            </div>

                            <div className="hero-match-team">
                                <div className="hero-team-logo">
                                    KW
                                </div>

                                <strong>
                                    Karatina Blazers
                                </strong>

                                <b>2</b>
                            </div>

                            <div className="hero-score-footer">
                                <span>
                                    3rd Quarter
                                </span>

                                <span>
                                    Nyeri
                                </span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Quick Access */}
            <section className="home-quick-section">

                <div className="public-container">

                    <div className="home-quick-grid">

                        <Link
                            to="/leagues"
                            className="home-quick-card"
                        >
                            <Trophy size={24} />

                            <div>
                                <strong>
                                    Leagues
                                </strong>

                                <span>
                                    Standings & fixtures
                                </span>
                            </div>

                            <ChevronRight size={18} />
                        </Link>

                        <Link
                            to="/tournaments"
                            className="home-quick-card"
                        >
                            <CalendarDays size={24} />

                            <div>
                                <strong>
                                    Tournaments
                                </strong>

                                <span>
                                    Upcoming competitions
                                </span>
                            </div>

                            <ChevronRight size={18} />
                        </Link>

                        <Link
                            to="/teams"
                            className="home-quick-card"
                        >
                            <Users size={24} />

                            <div>
                                <strong>
                                    Teams
                                </strong>

                                <span>
                                    Discover teams
                                </span>
                            </div>

                            <ChevronRight size={18} />
                        </Link>

                        <Link
                            to="/players"
                            className="home-quick-card"
                        >
                            <Users size={24} />

                            <div>
                                <strong>
                                    Players
                                </strong>

                                <span>
                                    Player profiles
                                </span>
                            </div>

                            <ChevronRight size={18} />
                        </Link>

                    </div>

                </div>

            </section>

            {/* Leagues */}
            <section className="public-section">

                <div className="public-container">

                    <div className="public-section-heading-row">

                        <div>
                            <span className="public-eyebrow">
                                COMPETITIONS
                            </span>

                            <h2>
                                Follow the
                                <span> game.</span>
                            </h2>

                            <p>
                                Stay updated with leagues,
                                standings and upcoming fixtures.
                            </p>
                        </div>

                        <Link
                            to="/leagues"
                            className="section-link"
                        >
                            View All Leagues
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="home-leagues-grid">

                        {leagues.map((league) => (
                            <Link
                                to="/leagues"
                                className="home-league-card"
                                key={league.name}
                            >

                                <div className="league-card-icon">
                                    <Trophy size={24} />
                                </div>

                                <span className="competition-status">
                                    {league.status}
                                </span>

                                <h3>
                                    {league.name}
                                </h3>

                                <span>
                                    {league.season}
                                </span>

                                <div className="league-card-footer">
                                    <span>
                                        {league.teams} Teams
                                    </span>

                                    <ArrowRight
                                        size={17}
                                    />
                                </div>

                            </Link>
                        ))}

                    </div>

                </div>

            </section>

            {/* Tournaments */}
            <section className="public-section public-section-alt">

                <div className="public-container">

                    <div className="public-section-heading-row">

                        <div>
                            <span className="public-eyebrow">
                                UPCOMING EVENTS
                            </span>

                            <h2>
                                Don't miss the
                                <span> action.</span>
                            </h2>

                            <p>
                                Find tournaments happening
                                across Kenya.
                            </p>
                        </div>

                        <Link
                            to="/tournaments"
                            className="section-link"
                        >
                            View Tournaments
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="home-tournaments-grid">

                        {tournaments.map((tournament) => (
                            <Link
                                to="/tournaments"
                                className="home-tournament-card"
                                key={tournament.name}
                            >

                                <div className="tournament-date-box">
                                    <CalendarDays
                                        size={20}
                                    />

                                    <strong>
                                        {tournament.date}
                                    </strong>
                                </div>

                                <h3>
                                    {tournament.name}
                                </h3>

                                <div className="tournament-meta">

                                    <span>
                                        <MapPin size={15} />
                                        {
                                            tournament.location
                                        }
                                    </span>

                                    <span>
                                        <Users size={15} />
                                        {tournament.teams} Teams
                                    </span>

                                </div>

                                <div className="tournament-card-arrow">
                                    <ArrowRight
                                        size={17}
                                    />
                                </div>

                            </Link>
                        ))}

                    </div>

                </div>

            </section>

            {/* Marketplace */}
            <section className="public-section">

                <div className="public-container">

                    <div className="public-section-heading-row">

                        <div>
                            <span className="public-eyebrow">
                                FLOORBALL MARKETPLACE
                            </span>

                            <h2>
                                Gear up for
                                <span> the game.</span>
                            </h2>

                            <p>
                                Equipment from vendors across
                                Kenya.
                            </p>
                        </div>

                        <Link
                            to="/shop"
                            className="section-link"
                        >
                            Visit Marketplace
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="home-products-grid">

                        {products.map((product) => (
                            <article
                                className="home-product-card"
                                key={product.id}
                            >

                                <Link
                                    to={`/products/${product.id}`}
                                    className="home-product-image"
                                >
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />
                                </Link>

                                <div className="home-product-content">

                                    <span>
                                        {product.category}
                                    </span>

                                    <Link
                                        to={`/products/${product.id}`}
                                    >
                                        <h3>
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="home-product-rating">

                                        <Star
                                            size={14}
                                            fill="currentColor"
                                        />

                                        <strong>
                                            {product.rating}
                                        </strong>

                                    </div>

                                    <strong className="home-product-price">
                                        {formatKES(
                                            product.price
                                        )}
                                    </strong>

                                </div>

                            </article>
                        ))}

                    </div>

                </div>

            </section>

            {/* News */}
            <section className="public-section public-section-alt">

                <div className="public-container">

                    <div className="public-section-heading-row">

                        <div>
                            <span className="public-eyebrow">
                                LATEST NEWS
                            </span>

                            <h2>
                                What's happening in
                                <span> floorball.</span>
                            </h2>
                        </div>

                        <Link
                            to="/news"
                            className="section-link"
                        >
                            View All News
                            <ArrowRight size={17} />
                        </Link>

                    </div>

                    <div className="home-news-grid">

                        {news.map((article) => (
                            <Link
                                to={`/news/${article.id}`}
                                className="home-news-card"
                                key={article.id}
                            >

                                <div className="home-news-image">

                                    <img
                                        src={article.image}
                                        alt={article.title}
                                    />

                                </div>

                                <div className="home-news-content">

                                    <div>
                                        <span>
                                            {
                                                article.category
                                            }
                                        </span>

                                        <small>
                                            {article.date}
                                        </small>
                                    </div>

                                    <h3>
                                        {article.title}
                                    </h3>

                                    <span className="read-more">
                                        Read Article
                                        <ArrowRight
                                            size={15}
                                        />
                                    </span>

                                </div>

                            </Link>
                        ))}

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="public-cta home-final-cta">

                <div className="public-container">

                    <div className="public-cta-content">

                        <div>
                            <span className="public-eyebrow">
                                JOIN THE COMMUNITY
                            </span>

                            <h2>
                                Your game.
                                Your community.
                                Your platform.
                            </h2>

                            <p>
                                Create your Floorball Kenya
                                account and get closer to the
                                game.
                            </p>
                        </div>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Create Account
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Home;