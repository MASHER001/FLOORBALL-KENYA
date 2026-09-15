import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Mail,
    CheckCircle,
    ShieldCheck,
} from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email.trim()) return;

        setLoading(true);

        // TODO: Connect to FastAPI/Supabase password reset API
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1000);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">

                {/* Left / Branding Section */}
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
                            ACCOUNT RECOVERY
                        </span>

                        <h1>
                            Get back into
                            <span> your account.</span>
                        </h1>

                        <p>
                            Enter your email address and we'll help you
                            reset your password securely.
                        </p>
                    </div>

                    <div className="auth-brand-footer">
                        <span>Floorball Kenya</span>
                        <span>•</span>
                        <span>Sports & Marketplace Platform</span>
                    </div>
                </div>

                {/* Form Section */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">

                        <Link to="/login" className="auth-back-link">
                            <ArrowLeft size={17} />
                            Back to login
                        </Link>

                        {!submitted ? (
                            <>
                                <div className="auth-heading">
                                    <div className="auth-mobile-logo">
                                        <ShieldCheck size={24} />
                                    </div>

                                    <h2>Forgot your password?</h2>

                                    <p>
                                        No worries. Enter the email associated
                                        with your account and we'll send you
                                        a password reset link.
                                    </p>
                                </div>

                                <form
                                    className="auth-form"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="form-group">
                                        <label htmlFor="email">
                                            Email address
                                        </label>

                                        <div className="auth-input-wrapper">
                                            <Mail size={18} />

                                            <input
                                                type="email"
                                                id="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary auth-submit-btn"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "Sending..."
                                            : "Send Reset Link"}
                                    </button>
                                </form>

                                <div className="auth-footer-text">
                                    Remember your password?{" "}
                                    <Link to="/login">
                                        Sign in
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="auth-success">

                                <div className="auth-success-icon">
                                    <CheckCircle size={42} />
                                </div>

                                <h2>Check your email</h2>

                                <p>
                                    If an account exists for{" "}
                                    <strong>{email}</strong>, we've sent
                                    instructions for resetting your password.
                                </p>

                                <p className="auth-success-note">
                                    Didn't receive the email? Check your
                                    spam folder or try again.
                                </p>

                                <button
                                    className="btn btn-outline auth-resend-btn"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Try another email
                                </button>

                                <Link
                                    to="/login"
                                    className="btn btn-primary auth-submit-btn"
                                >
                                    Back to Login
                                </Link>
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default ForgotPassword;