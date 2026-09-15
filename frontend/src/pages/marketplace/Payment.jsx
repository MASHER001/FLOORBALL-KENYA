import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Smartphone,
    ShieldCheck,
    CheckCircle,
    LoaderCircle,
} from "lucide-react";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const total = location.state?.total || 10400;

    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState("");

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    const handlePayment = async (e) => {
        e.preventDefault();

        setError("");

        if (!phone.trim()) {
            setError(
                "Please enter the M-Pesa phone number."
            );
            return;
        }

        setLoading(true);

        /*
         * TODO: Connect to FastAPI Daraja service.
         *
         * POST /api/payments/mpesa/stk-push
         *
         * {
         *    phone,
         *    amount,
         *    order_id
         * }
         */

        setTimeout(() => {
            setLoading(false);
            setWaiting(true);
        }, 1500);
    };

    const simulateSuccess = () => {
        navigate("/order-confirmation", {
            state: {
                orderId: "FK-2026-00125",
                total,
            },
        });
    };

    return (
        <div className="marketplace-page">

            <div className="payment-container">

                <Link
                    to="/checkout"
                    className="marketplace-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Checkout
                </Link>

                <div className="payment-layout">

                    <div className="payment-main">

                        <div className="payment-heading">

                            <span className="marketplace-eyebrow">
                                SECURE CHECKOUT
                            </span>

                            <h1>Complete Payment</h1>

                            <p>
                                Pay securely using M-Pesa.
                            </p>

                        </div>

                        {!waiting ? (
                            <form
                                className="payment-card"
                                onSubmit={handlePayment}
                            >

                                <div className="payment-method-header">

                                    <div className="payment-method-icon">
                                        <Smartphone
                                            size={25}
                                        />
                                    </div>

                                    <div>
                                        <strong>
                                            M-Pesa
                                        </strong>

                                        <span>
                                            Pay using your
                                            mobile number
                                        </span>
                                    </div>

                                    <CheckCircle
                                        size={20}
                                    />

                                </div>

                                {error && (
                                    <div className="checkout-error">
                                        {error}
                                    </div>
                                )}

                                <div className="form-group">

                                    <label>
                                        M-Pesa phone number
                                    </label>

                                    <div className="marketplace-input payment-phone-input">

                                        <span className="phone-prefix">
                                            +254
                                        </span>

                                        <input
                                            type="tel"
                                            placeholder="7XX XXX XXX"
                                            value={phone}
                                            onChange={(e) =>
                                                setPhone(
                                                    e.target
                                                        .value
                                                )
                                            }
                                            required
                                        />

                                    </div>

                                    <small className="input-help">
                                        You will receive an
                                        M-Pesa prompt on this
                                        phone.
                                    </small>

                                </div>

                                <div className="payment-amount-box">

                                    <span>
                                        Amount to pay
                                    </span>

                                    <strong>
                                        {formatKES(total)}
                                    </strong>

                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary payment-submit-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <LoaderCircle
                                                size={18}
                                                className="spin"
                                            />
                                            Sending Prompt...
                                        </>
                                    ) : (
                                        <>
                                            Pay with M-Pesa
                                            <ArrowRight
                                                size={18}
                                            />
                                        </>
                                    )}
                                </button>

                                <div className="payment-security">

                                    <ShieldCheck
                                        size={18}
                                    />

                                    <span>
                                        Your payment is
                                        processed securely.
                                        Floorball Kenya does
                                        not store your M-Pesa
                                        PIN.
                                    </span>

                                </div>

                            </form>
                        ) : (
                            <div className="payment-card payment-waiting">

                                <div className="payment-waiting-icon">
                                    <Smartphone size={38} />
                                </div>

                                <h2>
                                    Check your phone
                                </h2>

                                <p>
                                    An M-Pesa payment prompt
                                    has been sent to{" "}
                                    <strong>
                                        +254 {phone}
                                    </strong>
                                    .
                                </p>

                                <div className="payment-waiting-steps">

                                    <div>
                                        <span>1</span>
                                        Check your phone
                                    </div>

                                    <div>
                                        <span>2</span>
                                        Enter your M-Pesa PIN
                                    </div>

                                    <div>
                                        <span>3</span>
                                        Wait for confirmation
                                    </div>

                                </div>

                                <button
                                    className="btn btn-primary payment-submit-btn"
                                    onClick={
                                        simulateSuccess
                                    }
                                >
                                    I've Completed Payment
                                    <CheckCircle
                                        size={18}
                                    />
                                </button>

                                <button
                                    className="payment-cancel-btn"
                                    onClick={() =>
                                        setWaiting(false)
                                    }
                                >
                                    Use a different number
                                </button>

                            </div>
                        )}

                    </div>

                    {/* Summary */}
                    <aside className="payment-summary">

                        <h2>Payment Summary</h2>

                        <div className="payment-summary-row">
                            <span>Order</span>
                            <strong>
                                #FK-2026-00125
                            </strong>
                        </div>

                        <div className="payment-summary-row">
                            <span>Items</span>
                            <strong>3 items</strong>
                        </div>

                        <div className="payment-summary-divider" />

                        <div className="payment-total">
                            <span>Total</span>
                            <strong>
                                {formatKES(total)}
                            </strong>
                        </div>

                        <div className="payment-mpesa-info">

                            <Smartphone size={20} />

                            <div>
                                <strong>
                                    M-Pesa
                                </strong>

                                <span>
                                    Fast, secure and
                                    convenient payment.
                                </span>
                            </div>

                        </div>

                    </aside>

                </div>

            </div>
        </div>
    );
};

export default Payment;