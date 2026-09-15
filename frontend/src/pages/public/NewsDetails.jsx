import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    ArrowRight,
    CalendarDays,
    Clock,
    Newspaper,
} from "lucide-react";

const News = () => {
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");

    const categories = [
        "All",
        "Teams",
        "Tournaments",
        "Community",
        "Marketplace",
        "Announcements",
    ];

    const articles = [
        {
            id: 1,
            title: "Black Talons prepare for the new floorball season",
            excerpt:
                "The DeKUT Black Talons are preparing for another competitive floorball season with renewed focus on team development.",
            category: "Teams",
            date: "12 Sep 2026",
            readTime: "4 min read",
            image: "/images/news/news-1.jpg",
            featured: true,
        },
        {
            id: 2,
            title: "Registration opens for Central Kenya Floorball Open",
            excerpt:
                "Teams across Central Kenya can now register for the upcoming floorball tournament.",
            category: "Tournaments",
            date: "09 Sep 2026",
            readTime: "3 min read",
            image: "/images/news/news-2.jpg",
        },
        {
            id: 3,
            title: "Why access to equipment matters for Kenyan floorball",
            excerpt:
                "Affordable and accessible equipment remains an important part of growing floorball participation.",
            category: "Community",
            date: "05 Sep 2026",
            readTime: "5 min read",
            image: "/images/news/news-3.jpg",
        },
        {
            id: 4,
            title: "New vendors join the Floorball Kenya marketplace",
            excerpt:
                "More sports equipment vendors are joining the platform to make floorball equipment easier to find.",
            category: "Marketplace",
            date: "01 Sep 2026",
            readTime: "3 min read",
            image: "/images/news/news-4.jpg",
        },
        {
            id: 5,
            title: "Floorball Kenya launches new digital platform",
            excerpt:
                "A new digital platform brings Kenyan floorball competitions, teams, players and equipment together.",
            category: "Announcements",
            date: "28 Aug 2026",
            readTime: "4 min read",
            image: "/images/news/news-5.jpg",
        },
        {
            id: 6,
            title: "Five things every new floorball player should know",
            excerpt:
                "Starting floorball? Here are five practical things every new player should understand.",
            category: "Community",
            date: "22 Aug 2026",
            readTime: "6 min read",
            image: "/images/news/news-6.jpg",
        },
    ];

    const filteredArticles = useMemo(() => {
        return articles.filter((article) => {

            const matchesCategory =
                category === "All" ||
                article.category === category;

            const query = search.toLowerCase();

            const matchesSearch =
                !query ||
                article.title
                    .toLowerCase()
                    .includes(query) ||
                article.excerpt
                    .toLowerCase()
                    .includes(query);

            return (
                matchesCategory &&
                matchesSearch
            );
        });
    }, [category, search]);

    return (
        <div className="public-page">

            {/* Header */}
            <section className="public-hero news-hero">

                <div className="public-container">

                    <div className="public-hero-content">

                        <span className="public-eyebrow">
                            FLOORBALL KENYA NEWS
                        </span>

                        <h1>
                            Stay in the
                            <span> game.</span>
                        </h1>

                        <p>
                            News, stories, tournament updates,
                            team announcements and everything
                            happening around Kenyan floorball.
                        </p>

                        <div className="news-search">

                            <Search size={19} />

                            <input
                                type="search"
                                placeholder="Search news..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

            </section>

            <section className="public-section">

                <div className="public-container">

                    {/* Category tabs */}
                    <div className="news-category-tabs">

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

                    {/* Featured */}
                    {category === "All" &&
                        !search && (
                            <div className="featured-news-card">

                                <div className="featured-news-image">

                                    <img
                                        src={
                                            articles[0]
                                                .image
                                        }
                                        alt={
                                            articles[0]
                                                .title
                                        }
                                    />

                                </div>

                                <div className="featured-news-content">

                                    <span className="public-eyebrow">
                                        FEATURED STORY
                                    </span>

                                    <span className="news-category">
                                        {
                                            articles[0]
                                                .category
                                        }
                                    </span>

                                    <h2>
                                        {
                                            articles[0]
                                                .title
                                        }
                                    </h2>

                                    <p>
                                        {
                                            articles[0]
                                                .excerpt
                                        }
                                    </p>

                                    <div className="news-meta">

                                        <span>
                                            <CalendarDays
                                                size={15}
                                            />
                                            {
                                                articles[0]
                                                    .date
                                            }
                                        </span>

                                        <span>
                                            <Clock
                                                size={15}
                                            />
                                            {
                                                articles[0]
                                                    .readTime
                                            }
                                        </span>

                                    </div>

                                    <Link
                                        to={`/news/${articles[0].id}`}
                                        className="btn btn-primary"
                                    >
                                        Read Story
                                        <ArrowRight
                                            size={17}
                                        />
                                    </Link>

                                </div>

                            </div>
                        )}

                    {/* Results */}
                    <div className="news-results-header">

                        <div>
                            <span className="public-eyebrow">
                                LATEST STORIES
                            </span>

                            <h2>
                                Floorball news
                            </h2>
                        </div>

                        <span>
                            {filteredArticles.length}{" "}
                            stories
                        </span>

                    </div>

                    <div className="news-grid">

                        {filteredArticles.map(
                            (article) => (
                                <article
                                    className="news-card"
                                    key={article.id}
                                >

                                    <Link
                                        to={`/news/${article.id}`}
                                        className="news-card-image"
                                    >
                                        <img
                                            src={
                                                article.image
                                            }
                                            alt={
                                                article.title
                                            }
                                        />

                                        <span>
                                            {
                                                article.category
                                            }
                                        </span>
                                    </Link>

                                    <div className="news-card-content">

                                        <div className="news-meta">

                                            <span>
                                                <CalendarDays
                                                    size={14}
                                                />
                                                {
                                                    article.date
                                                }
                                            </span>

                                            <span>
                                                <Clock
                                                    size={14}
                                                />
                                                {
                                                    article.readTime
                                                }
                                            </span>

                                        </div>

                                        <Link
                                            to={`/news/${article.id}`}
                                        >
                                            <h3>
                                                {
                                                    article.title
                                                }
                                            </h3>
                                        </Link>

                                        <p>
                                            {
                                                article.excerpt
                                            }
                                        </p>

                                        <Link
                                            to={`/news/${article.id}`}
                                            className="read-more"
                                        >
                                            Read Article
                                            <ArrowRight
                                                size={15}
                                            />
                                        </Link>

                                    </div>

                                </article>
                            )
                        )}

                    </div>

                    {filteredArticles.length === 0 && (
                        <div className="marketplace-empty-state">

                            <div className="empty-state-icon">
                                <Newspaper size={40} />
                            </div>

                            <h2>
                                No stories found
                            </h2>

                            <p>
                                Try another search or category.
                            </p>

                        </div>
                    )}

                </div>

            </section>

        </div>
    );
};

export default News;