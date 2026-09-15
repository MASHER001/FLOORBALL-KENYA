import React from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Trophy,
    Users,
    ShoppingBag,
    CalendarDays,
    Database,
    Target,
    Eye,
    Heart,
    ShieldCheck,
} from "lucide-react";

const About = () => {
    const stats = [
        {
            value: "50+",
            label: "Teams",
        },
        {
            value: "100+",
            label: "Players",
        },
        {
            value: "20+",
            label: "Competitions",
        },
        {
            value: "100+",
            label: "Products",
        },
    ];

    const features = [
        {
            icon: Trophy,
            title: "Floorball Competitions",
            description:
                "Follow leagues, tournaments, fixtures, results, standings and player statistics in one place.",
        },
        {
            icon: Users,
            title: "Teams & Players",
            description:
                "Discover Kenyan floorball teams, player profiles, team rosters and performance information.",
        },
        {
            icon: ShoppingBag,
            title: "Equipment Marketplace",
            description:
                "Find sticks, balls, shoes, jerseys, goalkeeper gear and other floorball equipment.",
        },
        {
            icon: CalendarDays,
            title: "Events & Tournaments",
            description:
                "Stay informed about upcoming floorball tournaments, registrations and match schedules.",
        },
    ];

    return (
        <div className="public-page">

            {/* Hero */}
            <section className="public-hero about-hero">

                <div className="public-container">

                    <div className="public-hero-content">

                        <span className="public-eyebrow">
                            ABOUT FLOORBALL KENYA
                        </span>

                        <h1>
                            Building the digital home of
                            <span> Kenyan floorball.</span>
                        </h1>

                        <p>
                            Floorball Kenya is a digital platform
                            designed to connect players, teams,
                            competitions, coaches, schools and
                            equipment vendors across Kenya.
                        </p>

                        <div className="public-hero-actions">

                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Join the Community
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/shop"
                                className="btn btn-outline"
                            >
                                Visit Marketplace
                                <ShoppingBag size={18} />
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* Stats */}
            <section className="public-stats-section">

                <div className="public-container">

                    <div className="public-stats-grid">

                        {stats.map((stat) => (
                            <div
                                className="public-stat"
                                key={stat.label}
                            >
                                <strong>
                                    {stat.value}
                                </strong>

                                <span>
                                    {stat.label}
                                </span>
                            </div>
                        ))}

                    </div>

                </div>

            </section>

            {/* Story */}
            <section className="public-section">

                <div className="public-container">

                    <div className="about-story-grid">

                        <div className="about-story-content">

                            <span className="public-eyebrow">
                                OUR STORY
                            </span>

                            <h2>
                                More than a website.
                                <span> A floorball ecosystem.</span>
                            </h2>

                            <p>
                                Floorball in Kenya continues to
                                grow through schools, universities,
                                clubs and community teams. But
                                information about competitions,
                                teams, players and equipment is
                                often scattered across different
                                platforms and communication
                                channels.
                            </p>

                            <p>
                                Floorball Kenya aims to bring these
                                pieces together into one accessible
                                digital platform.
                            </p>

                            <p>
                                From checking league standings to
                                finding a floorball stick, the goal
                                is to make participating in the sport
                                easier.
                            </p>

                        </div>

                        <div className="about-story-visual">

                            <div className="about-visual-card">

                                <div className="about-visual-icon">
                                    <Database size={34} />
                                </div>

                                <span>
                                    One Platform
                                </span>

                                <strong>
                                    Everything Floorball
                                </strong>

                                <div className="about-visual-lines">
                                    <span />
                                    <span />
                                    <span />
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* What We Do */}
            <section className="public-section public-section-alt">

                <div className="public-container">

                    <div className="public-section-heading">

                        <span className="public-eyebrow">
                            WHAT WE DO
                        </span>

                        <h2>
                            Connecting every part of the
                            <span> game.</span>
                        </h2>

                        <p>
                            Floorball Kenya combines sports
                            information and equipment access in
                            one platform.
                        </p>

                    </div>

                    <div className="about-features-grid">

                        {features.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    className="about-feature-card"
                                    key={feature.title}
                                >

                                    <div className="about-feature-icon">
                                        <Icon size={25} />
                                    </div>

                                    <h3>
                                        {feature.title}
                                    </h3>

                                    <p>
                                        {
                                            feature.description
                                        }
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* Mission / Vision */}
            <section className="public-section">

                <div className="public-container">

                    <div className="mission-grid">

                        <div className="mission-card">

                            <div className="mission-icon">
                                <Target size={27} />
                            </div>

                            <span className="public-eyebrow">
                                OUR MISSION
                            </span>

                            <h2>
                                Make floorball easier
                                to discover and play.
                            </h2>

                            <p>
                                We want players, teams, coaches,
                                schools and organizers to have
                                better access to the information
                                and resources they need.
                            </p>

                        </div>

                        <div className="mission-card">

                            <div className="mission-icon">
                                <Eye size={27} />
                            </div>

                            <span className="public-eyebrow">
                                OUR VISION
                            </span>

                            <h2>
                                A connected floorball
                                community across Africa.
                            </h2>

                            <p>
                                Our long-term vision is to create
                                digital infrastructure that helps
                                floorball grow in Kenya and
                                eventually across East Africa.
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* Values */}
            <section className="public-section public-section-alt">

                <div className="public-container">

                    <div className="public-section-heading">

                        <span className="public-eyebrow">
                            OUR VALUES
                        </span>

                        <h2>
                            Built around the
                            <span> community.</span>
                        </h2>

                    </div>

                    <div className="about-values-grid">

                        <div className="about-value-card">
                            <Heart size={24} />
                            <h3>Community</h3>
                            <p>
                                Supporting players, teams and
                                organizers at every level.
                            </p>
                        </div>

                        <div className="about-value-card">
                            <ShieldCheck size={24} />
                            <h3>Trust</h3>
                            <p>
                                Building reliable and transparent
                                sports and marketplace information.
                            </p>
                        </div>

                        <div className="about-value-card">
                            <Trophy size={24} />
                            <h3>Growth</h3>
                            <p>
                                Helping Kenyan floorball become
                                more visible and accessible.
                            </p>
                        </div>

                    </div>

                </div>

            </section>

            {/* CTA */}
            <section className="public-cta">

                <div className="public-container">

                    <div className="public-cta-content">

                        <div>
                            <span className="public-eyebrow">
                                BE PART OF THE GAME
                            </span>

                            <h2>
                                Let's grow floorball
                                together.
                            </h2>

                            <p>
                                Create your account and become
                                part of the Floorball Kenya
                                community.
                            </p>
                        </div>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default About;