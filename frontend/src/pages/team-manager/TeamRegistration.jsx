import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    FileText,
    MapPin,
    Shield,
    Trophy,
    Users,
    AlertCircle,
} from "lucide-react";

const competitions = [
    {
        id: 1,
        name: "Kenya University Floorball League",
        type: "League",
        season: "2026/2027",
        location: "Kenya",
        registrationDeadline: "30 Sep 2026",
        startDate: "10 Oct 2026",
        teams: 16,
        description:
            "National university league featuring registered university floorball teams.",
        status: "Open",
    },
    {
        id: 2,
        name: "DeKUT Floorball Open 2026",
        type: "Tournament",
        season: "2026",
        location: "Nyeri",
        registrationDeadline: "15 Sep 2026",
        startDate: "20 Sep 2026",
        teams: 8,
        description:
            "Two-day university floorball tournament hosted at DeKUT Sports Complex.",
        status: "Open",
    },
    {
        id: 3,
        name: "Central Kenya Floorball Cup 2026",
        type: "Tournament",
        season: "2026",
        location: "Karatina",
        registrationDeadline: "05 Sep 2026",
        startDate: "12 Sep 2026",
        teams: 10,
        description:
            "Regional floorball competition for clubs and university teams.",
        status: "Closed",
    },
];

const initialForm = {
    competitionId: "",
    teamName: "DeKUT Black Talons",
    managerName: "Victor Macharia",
    managerEmail: "manager@example.com",
    managerPhone: "+254 700 000 000",
    homeGround: "DeKUT Sports Complex",
    playerCount: "18",
    notes: "",
    declaration: false,
};

export default function TeamRegistration() {
    const [formData, setFormData] = useState(initialForm);
    const [submitted, setSubmitted] = useState(false);

    const selectedCompetition = competitions.find(
        (competition) =>
            competition.id.toString() ===
            formData.competitionId
    );

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.competitionId) {
            alert("Please select a competition.");
            return;
        }

        if (!formData.declaration) {
            alert(
                "Please confirm the registration declaration."
            );
            return;
        }

        // TODO:
        // POST /api/team-manager/registrations

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="team-manager-page">

                <div className="team-manager-success-page">

                    <div className="team-manager-success-icon">
                        <CheckCircle2 size={42} />
                    </div>

                    <span className="team-manager-eyebrow">
                        Registration Submitted
                    </span>

                    <h1>
                        Team registration received.
                    </h1>

                    <p>
                        Your registration for{" "}
                        <strong>
                            {selectedCompetition?.name}
                        </strong>{" "}
                        has been submitted successfully.
                    </p>

                    <div className="team-manager-registration-reference">

                        <span>Registration Reference</span>

                        <strong>
                            REG-DKT-{Date.now().toString().slice(-6)}
                        </strong>

                    </div>

                    <div className="team-manager-success-note">

                        <AlertCircle size={18} />

                        <span>
                            An administrator will review your registration.
                            You can track its status from your team manager
                            dashboard.
                        </span>

                    </div>

                    <div className="team-manager-success-actions">

                        <Link
                            to="/team-manager"
                            className="btn btn-primary"
                        >
                            Back to Dashboard
                            <ArrowRight size={17} />
                        </Link>

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() => {
                                setSubmitted(false);
                                setFormData(initialForm);
                            }}
                        >
                            Register for Another Competition
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="team-manager-page">

            {/* =================================================
                HEADER
            ================================================= */}

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
                        Competition Registration
                    </span>

                    <h1>Register Your Team</h1>

                    <p>
                        Submit your team for an upcoming league or
                        tournament.
                    </p>

                </div>

            </div>

            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="team-manager-registration-steps">

                <div className="team-manager-registration-step active">

                    <div className="team-manager-step-number">
                        1
                    </div>

                    <div>
                        <strong>Competition</strong>
                        <span>Select competition</span>
                    </div>

                </div>

                <ChevronRight size={18} />

                <div className="team-manager-registration-step">

                    <div className="team-manager-step-number">
                        2
                    </div>

                    <div>
                        <strong>Team Details</strong>
                        <span>Confirm information</span>
                    </div>

                </div>

                <ChevronRight size={18} />

                <div className="team-manager-registration-step">

                    <div className="team-manager-step-number">
                        3
                    </div>

                    <div>
                        <strong>Submit</strong>
                        <span>Send for review</span>
                    </div>

                </div>

            </div>

            <form onSubmit={handleSubmit}>

                {/* =================================================
                    COMPETITION
                ================================================= */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>
                            <span className="team-manager-section-label">
                                Step 1
                            </span>

                            <h2>Select Competition</h2>

                            <p>
                                Choose the league or tournament you want
                                your team to enter.
                            </p>
                        </div>

                        <Trophy size={23} />

                    </div>

                    <div className="team-manager-competition-list">

                        {competitions.map((competition) => {

                            const selected =
                                formData.competitionId ===
                                competition.id.toString();

                            const closed =
                                competition.status === "Closed";

                            return (
                                <label
                                    key={competition.id}
                                    className={`team-manager-competition-option ${
                                        selected
                                            ? "selected"
                                            : ""
                                    } ${
                                        closed
                                            ? "disabled"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="competitionId"
                                        value={competition.id}
                                        checked={selected}
                                        disabled={closed}
                                        onChange={handleChange}
                                    />

                                    <div className="team-manager-competition-icon">
                                        {competition.type ===
                                        "League" ? (
                                            <Trophy size={22} />
                                        ) : (
                                            <CalendarDays size={22} />
                                        )}
                                    </div>

                                    <div className="team-manager-competition-info">

                                        <div className="team-manager-competition-title">

                                            <h3>
                                                {competition.name}
                                            </h3>

                                            <span
                                                className={
                                                    closed
                                                        ? "closed"
                                                        : "open"
                                                }
                                            >
                                                {competition.status}
                                            </span>

                                        </div>

                                        <p>
                                            {competition.description}
                                        </p>

                                        <div className="team-manager-competition-meta">

                                            <span>
                                                <CalendarDays size={14} />
                                                Starts{" "}
                                                {competition.startDate}
                                            </span>

                                            <span>
                                                <MapPin size={14} />
                                                {competition.location}
                                            </span>

                                            <span>
                                                <Users size={14} />
                                                {competition.teams} Teams
                                            </span>

                                        </div>

                                    </div>

                                </label>
                            );
                        })}

                    </div>

                </section>

                {/* =================================================
                    TEAM DETAILS
                ================================================= */}

                <section className="team-manager-card">

                    <div className="team-manager-card-header">

                        <div>
                            <span className="team-manager-section-label">
                                Step 2
                            </span>

                            <h2>Confirm Team Details</h2>

                            <p>
                                Confirm the information that will be
                                submitted to the competition organiser.
                            </p>
                        </div>

                        <Shield size={23} />

                    </div>

                    <div className="team-manager-form-grid">

                        <div className="form-group">

                            <label htmlFor="teamName">
                                Team Name
                            </label>

                            <input
                                id="teamName"
                                name="teamName"
                                type="text"
                                value={formData.teamName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="playerCount">
                                Registered Players
                            </label>

                            <div className="input-with-icon">

                                <Users size={17} />

                                <input
                                    id="playerCount"
                                    name="playerCount"
                                    type="number"
                                    min="1"
                                    value={
                                        formData.playerCount
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label htmlFor="managerName">
                                Team Manager
                            </label>

                            <input
                                id="managerName"
                                name="managerName"
                                type="text"
                                value={formData.managerName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="managerEmail">
                                Manager Email
                            </label>

                            <input
                                id="managerEmail"
                                name="managerEmail"
                                type="email"
                                value={formData.managerEmail}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="managerPhone">
                                Manager Phone
                            </label>

                            <input
                                id="managerPhone"
                                name="managerPhone"
                                type="tel"
                                value={formData.managerPhone}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label htmlFor="homeGround">
                                Home Ground
                            </label>

                            <div className="input-with-icon">

                                <MapPin size={17} />

                                <input
                                    id="homeGround"
                                    name="homeGround"
                                    type="text"
                                    value={
                                        formData.homeGround
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    <div className="form-group">

                        <label htmlFor="notes">
                            Additional Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            rows="5"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any information the competition organiser should know..."
                        />

                    </div>

                </section>

                {/* =================================================
                    SELECTED COMPETITION SUMMARY
                ================================================= */}

                {selectedCompetition && (

                    <section className="team-manager-card">

                        <div className="team-manager-card-header">

                            <div>
                                <span className="team-manager-section-label">
                                    Registration Summary
                                </span>

                                <h2>
                                    {selectedCompetition.name}
                                </h2>
                            </div>

                            <FileText size={23} />

                        </div>

                        <div className="team-manager-registration-summary">

                            <div>
                                <span>Competition</span>
                                <strong>
                                    {selectedCompetition.name}
                                </strong>
                            </div>

                            <div>
                                <span>Type</span>
                                <strong>
                                    {selectedCompetition.type}
                                </strong>
                            </div>

                            <div>
                                <span>Season</span>
                                <strong>
                                    {selectedCompetition.season}
                                </strong>
                            </div>

                            <div>
                                <span>Registration Deadline</span>
                                <strong>
                                    {
                                        selectedCompetition.registrationDeadline
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>Start Date</span>
                                <strong>
                                    {selectedCompetition.startDate}
                                </strong>
                            </div>

                            <div>
                                <span>Team</span>
                                <strong>
                                    {formData.teamName}
                                </strong>
                            </div>

                        </div>

                    </section>
                )}

                {/* =================================================
                    DECLARATION
                ================================================= */}

                <section className="team-manager-card">

                    <div className="team-manager-declaration">

                        <input
                            id="declaration"
                            name="declaration"
                            type="checkbox"
                            checked={formData.declaration}
                            onChange={handleChange}
                        />

                        <label htmlFor="declaration">

                            I confirm that the information provided
                            is accurate and that I am authorised to
                            register this team for the selected
                            competition. I understand that the
                            registration may be reviewed and approved
                            by a competition administrator.

                        </label>

                    </div>

                </section>

                {/* =================================================
                    ACTIONS
                ================================================= */}

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
                        Submit Registration
                        <ArrowRight size={17} />
                    </button>

                </div>

            </form>

        </div>
    );
}
