import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    Send,
    Clock,
    ArrowRight,
} from "lucide-react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        /*
         * TODO:
         * POST /api/contact
         *
         * Store contact message in Supabase
         * and optionally send notification email.
         */

        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="public-page">

            {/* Header */}
            <section className="public-hero contact-hero">

                <div className="public-container">

                    <div className="public-hero-content">

                        <span className="public-eyebrow">
                            GET IN TOUCH
                        </span>

                        <h1>
                            Let's talk
                            <span> floorball.</span>
                        </h1>

                        <p>
                            Have a question, suggestion,
                            partnership idea or need help with
                            the platform? We'd love to hear from
                            you.
                        </p>

                    </div>

                </div>

            </section>

            <section className="public-section">

                <div className="public-container">

                    <div className="contact-layout">

                        {/* Contact Information */}
                        <div className="contact-info">

                            <span className="public-eyebrow">
                                CONTACT INFORMATION
                            </span>

                            <h2>
                                We're here to help.
                            </h2>

                            <p>
                                Whether you're a player, coach,
                                team manager, tournament
                                organizer or equipment vendor,
                                reach out to us.
                            </p>

                            <div className="contact-methods">

                                <div className="contact-method">

                                    <div className="contact-method-icon">
                                        <Mail size={21} />
                                    </div>

                                    <div>
                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            hello@floorballkenya.com
                                        </strong>
                                    </div>

                                </div>

                                <div className="contact-method">

                                    <div className="contact-method-icon">
                                        <Phone size={21} />
                                    </div>

                                    <div>
                                        <span>
                                            Phone
                                        </span>

                                        <strong>
                                            +254 700 000 000
                                        </strong>
                                    </div>

                                </div>

                                <div className="contact-method">

                                    <div className="contact-method-icon">
                                        <MessageCircle
                                            size={21}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            WhatsApp
                                        </span>

                                        <strong>
                                            Chat with Floorball
                                            Kenya
                                        </strong>
                                    </div>

                                </div>

                                <div className="contact-method">

                                    <div className="contact-method-icon">
                                        <MapPin size={21} />
                                    </div>

                                    <div>
                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            Kenya
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="contact-hours">

                                <Clock size={20} />

                                <div>
                                    <strong>
                                        Support Hours
                                    </strong>

                                    <span>
                                        Monday – Friday:
                                        8:00 AM – 5:00 PM
                                    </span>

                                    <span>
                                        Saturday:
                                        9:00 AM – 1:00 PM
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* Contact Form */}
                        <div className="contact-form-card">

                            {submitted ? (
                                <div className="contact-success">

                                    <div className="contact-success-icon">
                                        <Send size={30} />
                                    </div>

                                    <h2>
                                        Message sent!
                                    </h2>

                                    <p>
                                        Thank you for contacting
                                        Floorball Kenya. We'll get
                                        back to you as soon as
                                        possible.
                                    </p>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            setSubmitted(
                                                false
                                            )
                                        }
                                    >
                                        Send Another Message
                                    </button>

                                </div>
                            ) : (
                                <>
                                    <h2>
                                        Send us a message
                                    </h2>

                                    <p>
                                        Fill in the form below and
                                        our team will get back to
                                        you.
                                    </p>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="public-form"
                                    >

                                        <div className="public-form-grid">

                                            <div className="form-group">
                                                <label>
                                                    Name
                                                </label>

                                                <input
                                                    name="name"
                                                    value={
                                                        formData.name
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="Your name"
                                                    required
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Email
                                                </label>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={
                                                        formData.email
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>

                                        </div>

                                        <div className="public-form-grid">

                                            <div className="form-group">
                                                <label>
                                                    Phone
                                                    <span className="optional">
                                                        Optional
                                                    </span>
                                                </label>

                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={
                                                        formData.phone
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    placeholder="+254 7XX XXX XXX"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    Subject
                                                </label>

                                                <select
                                                    name="subject"
                                                    value={
                                                        formData.subject
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                    required
                                                >
                                                    <option value="">
                                                        Select a subject
                                                    </option>
                                                    <option>
                                                        General Inquiry
                                                    </option>
                                                    <option>
                                                        Marketplace
                                                    </option>
                                                    <option>
                                                        Team Registration
                                                    </option>
                                                    <option>
                                                        Tournament
                                                    </option>
                                                    <option>
                                                        Vendor Support
                                                    </option>
                                                    <option>
                                                        Partnership
                                                    </option>
                                                    <option>
                                                        Technical Support
                                                    </option>
                                                </select>
                                            </div>

                                        </div>

                                        <div className="form-group">

                                            <label>
                                                Message
                                            </label>

                                            <textarea
                                                name="message"
                                                value={
                                                    formData.message
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                rows="6"
                                                placeholder="How can we help?"
                                                required
                                            />

                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary contact-submit-btn"
                                        >
                                            Send Message
                                            <Send size={18} />
                                        </button>

                                    </form>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </section>

            {/* Quick Links */}
            <section className="public-section public-section-alt">

                <div className="public-container">

                    <div className="contact-help-heading">

                        <span className="public-eyebrow">
                            NEED SOMETHING ELSE?
                        </span>

                        <h2>
                            Explore Floorball Kenya.
                        </h2>

                    </div>

                    <div className="contact-help-grid">

                        <Link
                            to="/shop"
                            className="contact-help-card"
                        >
                            <strong>
                                Marketplace
                            </strong>

                            <span>
                                Find floorball equipment.
                            </span>

                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/tournaments"
                            className="contact-help-card"
                        >
                            <strong>
                                Tournaments
                            </strong>

                            <span>
                                Find upcoming competitions.
                            </span>

                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/register"
                            className="contact-help-card"
                        >
                            <strong>
                                Create an Account
                            </strong>

                            <span>
                                Join the community.
                            </span>

                            <ArrowRight size={18} />
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Contact;