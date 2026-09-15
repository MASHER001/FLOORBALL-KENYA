import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Upload,
    Shield,
    MapPin,
    Mail,
    Phone,
    CalendarDays,
    Users,
    CheckCircle2,
    AlertCircle,
    Eye,
} from "lucide-react";

const initialTeam = {
    name: "DeKUT Black Talons",
    shortName: "DKT",
    location: "Nyeri, Kenya",
    county: "Nyeri",
    league: "Kenya University Floorball League",
    founded: "2024",
    homeGround: "DeKUT Sports Complex",
    email: "blacktalons@floorballkenya.com",
    phone: "+254 700 000 000",
    description:
        "DeKUT Black Talons is the official floorball team representing Dedan Kimathi University of Technology.",
    logo: "/images/teams/logos/dekut-black-talons.png",
    cover: "/images/teams/team-photos/dekut-black-talons.jpg",
};

export default function ManageTeam() {
    const [team, setTeam] = useState(initialTeam);
    const [saved, setSaved] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setTeam((current) => ({
            ...current,
            [name]: value,
        }));

        setSaved(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // TODO:
        // PUT /api/team-manager/team

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div className="team-manager-page">

            {/* Header */}

            <div className="team-manager-page-header">

                <div>
                    <Link
                        to="/team-manager"
                        className="team-manager-back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Dashboard
                    </Link>

                    <span className="team-manager-eyebrow">
                        Team Management
                    </span>

                    <h1>Manage Team</h1>

                    <p>
                        Update your team's information, identity and contact
                        details.
                    </p>
                </div>

                <Link
                    to="/teams/1"
                    className="btn btn-outline"
                >
                    <Eye size={17} />
                    View Public Profile
                </Link>

            </div>

            {/* Success message */}

            {saved && (
                <div className="team-manager-alert success">
                    <CheckCircle2 size={19} />

                    <div>
                        <strong>Team updated successfully</strong>
                        <span>
                            Your team information has been saved.
                        </span>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* Team identity */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">
                        <div>
                            <span className="team-manager-section-label">
                                Team Identity
                            </span>

                            <h2>Team Profile</h2>

                            <p>
                                Information displayed on your public team
                                profile.
                            </p>
                        </div>

                        <Shield size={23} />
                    </div>

                    <div className="team-manager-profile-preview">

                        <div className="team-manager-logo-wrapper">

                            <img
                                src={team.logo}
                                alt={team.name}
                                onError={(event) => {
                                    event.currentTarget.style.display =
                                        "none";
                                    event.currentTarget.nextSibling.style.display =
                                        "flex";
                                }}
                            />

                            <div className="team-manager-logo-fallback">
                                DKT
                            </div>

                            <button
                                type="button"
                                className="team-manager-upload-button"
                            >
                                <Upload size={14} />
                                Change Logo
                            </button>

                        </div>

                        <div className="team-manager-profile-summary">
                            <span>Current Team</span>

                            <h3>{team.name}</h3>

                            <p>
                                {team.league}
                            </p>

                            <div className="team-manager-status-badge">
                                <CheckCircle2 size={14} />
                                Active
                            </div>
                        </div>

                    </div>

                    <div className="team-manager-form-grid">

                        <div className="form-group">
                            <label htmlFor="name">
                                Team Name <span>*</span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={team.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="shortName">
                                Short Name <span>*</span>
                            </label>

                            <input
                                id="shortName"
                                name="shortName"
                                type="text"
                                value={team.shortName}
                                onChange={handleChange}
                                maxLength={10}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">
                                Location <span>*</span>
                            </label>

                            <div className="input-with-icon">
                                <MapPin size={17} />

                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={team.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="county">
                                County <span>*</span>
                            </label>

                            <select
                                id="county"
                                name="county"
                                value={team.county}
                                onChange={handleChange}
                                required
                            >
                                <option value="Nyeri">Nyeri</option>
                                <option value="Karatina">
                                    Nyeri / Karatina
                                </option>
                                <option value="Kiambu">Kiambu</option>
                                <option value="Murang'a">Murang'a</option>
                                <option value="Laikipia">Laikipia</option>
                                <option value="Nairobi">Nairobi</option>
                                <option value="Machakos">Machakos</option>
                                <option value="Kitui">Kitui</option>
                                <option value="Uasin Gishu">
                                    Uasin Gishu
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="founded">
                                Year Founded
                            </label>

                            <div className="input-with-icon">
                                <CalendarDays size={17} />

                                <input
                                    id="founded"
                                    name="founded"
                                    type="text"
                                    value={team.founded}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="league">
                                Primary League
                            </label>

                            <select
                                id="league"
                                name="league"
                                value={team.league}
                                onChange={handleChange}
                            >
                                <option>
                                    Kenya University Floorball League
                                </option>

                                <option>
                                    Central Kenya Floorball League
                                </option>

                                <option>
                                    Nairobi Floorball League
                                </option>

                                <option>
                                    Women's University Floorball League
                                </option>
                            </select>
                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="description">
                            Team Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="5"
                            value={team.description}
                            onChange={handleChange}
                            placeholder="Tell people about your team..."
                        />

                    </div>

                </section>

                {/* Home ground */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>
                            <span className="team-manager-section-label">
                                Venue
                            </span>

                            <h2>Home Ground</h2>

                            <p>
                                The venue where your team normally hosts
                                matches.
                            </p>
                        </div>

                        <MapPin size={23} />

                    </div>

                    <div className="team-manager-form-grid">

                        <div className="form-group">

                            <label htmlFor="homeGround">
                                Home Ground <span>*</span>
                            </label>

                            <input
                                id="homeGround"
                                name="homeGround"
                                type="text"
                                value={team.homeGround}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="team-manager-venue-note">

                            <AlertCircle size={18} />

                            <span>
                                Make sure the venue information is accurate
                                so organisers can use it when scheduling
                                fixtures.
                            </span>

                        </div>

                    </div>

                </section>

                {/* Contact */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>
                            <span className="team-manager-section-label">
                                Contact
                            </span>

                            <h2>Team Contact Information</h2>

                            <p>
                                Contact details used by tournament and league
                                organisers.
                            </p>
                        </div>

                        <Mail size={23} />

                    </div>

                    <div className="team-manager-form-grid">

                        <div className="form-group">

                            <label htmlFor="email">
                                Team Email
                            </label>

                            <div className="input-with-icon">
                                <Mail size={17} />

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={team.email}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="phone">
                                Team Phone
                            </label>

                            <div className="input-with-icon">
                                <Phone size={17} />

                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={team.phone}
                                    onChange={handleChange}
                                />
                            </div>

                        </div>

                    </div>

                </section>

                {/* Team overview */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>
                            <span className="team-manager-section-label">
                                Squad Overview
                            </span>

                            <h2>Team Summary</h2>
                        </div>

                        <Users size={23} />

                    </div>

                    <div className="team-manager-summary-grid">

                        <div>
                            <strong>18</strong>
                            <span>Registered Players</span>
                        </div>

                        <div>
                            <strong>12</strong>
                            <span>Active Players</span>
                        </div>

                        <div>
                            <strong>24</strong>
                            <span>Matches Played</span>
                        </div>

                        <div>
                            <strong>16</strong>
                            <span>Matches Won</span>
                        </div>

                    </div>

                    <Link
                        to="/team-manager/players"
                        className="team-manager-inline-link"
                    >
                        Manage Squad
                        <ArrowRight size={16} />
                    </Link>

                </section>

                {/* Actions */}

                <div className="team-manager-form-actions">

                    <Link
                        to="/team-manager"
                        className="btn btn-outline"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        <Save size={17} />
                        Save Team Changes
                    </button>

                </div>

            </form>

        </div>
    );
}

