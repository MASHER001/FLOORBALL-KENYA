import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    User,
    Phone,
    ShieldCheck,
    Store,
    Users,
    UserRound,
} from "lucide-react";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "player",
        agree: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError("");
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            role,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (!formData.agree) {
            setError(
                "You must agree to the Terms of Service and Privacy Policy."
            );
            return;
        }

        setLoading(true);

        // TODO:
        // Connect to Supabase Auth / FastAPI registration API.
        //
        // Future flow:
        //
        // 1. Create Supabase Auth user
        // 2. Create user profile
        // 3. Assign role
        // 4. Create role-specific profile
        // 5. Send verification email
        //
        // POST /api/auth/register

        setTimeout(() => {
            setLoading(false);
            navigate("/login");
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-container auth-register-container">

                {/* Branding */}
                <div className="auth-brand">
                    <Link to="/" className="auth-logo">
                        <div className="auth-logo-icon">
                            <ShieldCheck size={26} />
                        </div>

                        <div>
                            <span className="auth-logo-title">
                                Floorball<span>Kenya</span>
                            </span>

                            <small>
                                Everything Floorball in Kenya
                            </small>
                        </div>
                    </Link>

                    <div className="auth-brand-content">
                        <span className="auth-eyebrow">
                            JOIN THE COMMUNITY
                        </span>

                        <h1>
                            Be part of
                            <span> Kenya's floorball future.</span>
                        </h1>

                        <p>
                            Create your account and connect with
                            players, teams, competitions and the
                            floorball marketplace.
                        </p>

                        <div className="auth-register-benefits">

                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <UserRound size={19} />
                                </div>

                                <div>
                                    <strong>Players</strong>
                                    <span>
                                        Build your profile and track
                                        your statistics.
                                    </span>
                                </div>
                            </div>

                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <Users size={19} />
                                </div>

                                <div>
                                    <strong>Team Managers</strong>
                                    <span>
                                        Manage teams, players and
                                        competitions.
                                    </span>
                                </div>
                            </div>

                            <div className="auth-benefit">
                                <div className="auth-benefit-icon">
                                    <Store size={19} />
                                </div>

                                <div>
                                    <strong>Vendors</strong>
                                    <span>
                                        Sell floorball equipment
                                        through the marketplace.
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="auth-brand-footer">
                        <span>Floorball Kenya</span>
                        <span>•</span>
                        <span>Sports & Marketplace Platform</span>
                    </div>
                </div>

                {/* Register Form */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper auth-register-wrapper">

                        <div className="auth-heading">
                            <div className="auth-mobile-logo">
                                <ShieldCheck size={24} />
                            </div>

                            <h2>Create your account</h2>

                            <p>
                                Join the Floorball Kenya community.
                            </p>
                        </div>

                        {error && (
                            <div className="auth-error">
                                {error}
                            </div>
                        )}

                        <form
                            className="auth-form"
                            onSubmit={handleSubmit}
                        >

                            {/* Name */}
                            <div className="auth-form-grid">

                                <div className="form-group">
                                    <label htmlFor="firstName">
                                        First name
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <User size={18} />

                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            placeholder="First name"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">
                                        Last name
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <User size={18} />

                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Last name"
                                            value={
                                                formData.lastName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="auth-input-wrapper">
                                    <Mail size={18} />

                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="form-group">
                                <label htmlFor="phone">
                                    Phone number
                                </label>

                                <div className="auth-input-wrapper">
                                    <Phone size={18} />

                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="+254 7XX XXX XXX"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="form-group">
                                <label>
                                    Account type
                                </label>

                                <div className="auth-role-grid">

                                    <button
                                        type="button"
                                        className={`auth-role-card ${
                                            formData.role ===
                                            "player"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleRoleChange(
                                                "player"
                                            )
                                        }
                                    >
                                        <UserRound size={21} />

                                        <span>
                                            Player
                                        </span>

                                        <small>
                                            Personal account
                                        </small>
                                    </button>

                                    <button
                                        type="button"
                                        className={`auth-role-card ${
                                            formData.role ===
                                            "team_manager"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleRoleChange(
                                                "team_manager"
                                            )
                                        }
                                    >
                                        <Users size={21} />

                                        <span>
                                            Team Manager
                                        </span>

                                        <small>
                                            Manage a team
                                        </small>
                                    </button>

                                    <button
                                        type="button"
                                        className={`auth-role-card ${
                                            formData.role ===
                                            "vendor"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleRoleChange(
                                                "vendor"
                                            )
                                        }
                                    >
                                        <Store size={21} />

                                        <span>
                                            Vendor
                                        </span>

                                        <small>
                                            Sell equipment
                                        </small>
                                    </button>

                                </div>
                            </div>

                            {/* Password */}
                            <div className="auth-form-grid">

                                <div className="form-group">
                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <Lock size={18} />

                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="password"
                                            name="password"
                                            placeholder="Minimum 8 characters"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowPassword(
                                                    !showPassword
                                                )
                                            }
                                        >
                                            {showPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword">
                                        Confirm password
                                    </label>

                                    <div className="auth-input-wrapper">
                                        <Lock size={18} />

                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Repeat password"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Terms */}
                            <label className="auth-checkbox auth-terms-checkbox">
                                <input
                                    type="checkbox"
                                    name="agree"
                                    checked={formData.agree}
                                    onChange={handleChange}
                                />

                                <span>
                                    I agree to the{" "}
                                    <Link to="/terms">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy">
                                        Privacy Policy
                                    </Link>
                                    .
                                </span>
                            </label>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary auth-submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>

                        </form>

                        <div className="auth-footer-text">
                            Already have an account?{" "}
                            <Link to="/login">
                                Sign in
                            </Link>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;