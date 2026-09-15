import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Eye,
    EyeOff,
    Lock,
    Mail,
    ShieldCheck,
    ArrowRight,
} from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
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

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        // TODO:
        // Connect to Supabase Auth / FastAPI authentication
        //
        // Example future flow:
        // POST /api/auth/login
        // Receive access token
        // Store session
        // Redirect according to user role

        setTimeout(() => {
            setLoading(false);

            // Temporary frontend demonstration
            navigate("/");
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

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
                            <small>Everything Floorball in Kenya</small>
                        </div>
                    </Link>

                    <div className="auth-brand-content">
                        <span className="auth-eyebrow">
                            WELCOME BACK
                        </span>

                        <h1>
                            Your floorball
                            <span> journey continues.</span>
                        </h1>

                        <p>
                            Sign in to manage your team, follow competitions,
                            track your performance and shop floorball
                            equipment.
                        </p>

                        <div className="auth-feature-list">
                            <div>
                                <span className="auth-feature-dot"></span>
                                Manage your player profile
                            </div>

                            <div>
                                <span className="auth-feature-dot"></span>
                                Follow leagues & tournaments
                            </div>

                            <div>
                                <span className="auth-feature-dot"></span>
                                Access the floorball marketplace
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-footer">
                        <span>Floorball Kenya</span>
                        <span>•</span>
                        <span>Sports & Marketplace Platform</span>
                    </div>
                </div>

                {/* Login Form */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">

                        <div className="auth-heading">
                            <div className="auth-mobile-logo">
                                <ShieldCheck size={24} />
                            </div>

                            <h2>Welcome back</h2>

                            <p>
                                Sign in to your Floorball Kenya account.
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

                            {/* Password */}
                            <div className="form-group">
                                <div className="auth-label-row">
                                    <label htmlFor="password">
                                        Password
                                    </label>

                                    <Link to="/forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>

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
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
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
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
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

                            {/* Remember */}
                            <div className="auth-checkbox-row">
                                <label className="auth-checkbox">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={formData.remember}
                                        onChange={handleChange}
                                    />

                                    <span>
                                        Remember me
                                    </span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="btn btn-primary auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    "Signing in..."
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={18} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>OR</span>
                        </div>

                        <div className="auth-register-box">
                            <p>
                                Don't have an account?
                            </p>

                            <Link
                                to="/register"
                                className="btn btn-outline auth-register-btn"
                            >
                                Create an Account
                            </Link>
                        </div>

                        <div className="auth-terms">
                            By continuing, you agree to Floorball Kenya's
                            Terms of Service and Privacy Policy.
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;