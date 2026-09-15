import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    Phone,
    User,
    Mail,
    Truck,
    ShieldCheck,
    ShoppingBag,
} from "lucide-react";

const Checkout = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        county: "Nyeri",
        town: "",
        address: "",
        deliveryNotes: "",
    });

    const [deliveryMethod, setDeliveryMethod] =
        useState("standard");

    const [error, setError] = useState("");

    const cartTotal = 10100;

    const deliveryFee =
        deliveryMethod === "pickup" ? 0 : 300;

    const total = cartTotal + deliveryFee;

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.phone ||
            !formData.town ||
            !formData.address
        ) {
            setError(
                "Please complete all required delivery details."
            );
            return;
        }

        /*
         * TODO:
         *
         * POST /api/orders
         *
         * Create order with:
         * - customer
         * - delivery address
         * - cart items
         * - delivery method
         * - total
         *
         * Then redirect to payment.
         */

        navigate("/payment", {
            state: {
                total,
                deliveryMethod,
                deliveryDetails: formData,
            },
        });
    };

    return (
        <div className="marketplace-page">

            <div className="marketplace-container">

                <div className="checkout-header">

                    <Link
                        to="/cart"
                        className="marketplace-back-link"
                    >
                        <ArrowLeft size={17} />
                        Back to Cart
                    </Link>

                    <div>
                        <span className="marketplace-eyebrow">
                            MARKETPLACE
                        </span>

                        <h1>Checkout</h1>

                        <p>
                            Enter your delivery details and
                            review your order.
                        </p>
                    </div>

                </div>

                <form
                    className="checkout-layout"
                    onSubmit={handleSubmit}
                >

                    <div className="checkout-main">

                        {error && (
                            <div className="checkout-error">
                                {error}
                            </div>
                        )}

                        {/* Contact */}
                        <section className="checkout-card">

                            <div className="checkout-section-heading">
                                <div className="checkout-step">
                                    1
                                </div>

                                <div>
                                    <h2>
                                        Contact Information
                                    </h2>

                                    <p>
                                        Where should we contact
                                        you about your order?
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-form-grid">

                                <div className="form-group">
                                    <label>
                                        First name
                                    </label>

                                    <div className="marketplace-input">
                                        <User size={17} />

                                        <input
                                            name="firstName"
                                            value={
                                                formData.firstName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="First name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Last name
                                    </label>

                                    <div className="marketplace-input">
                                        <User size={17} />

                                        <input
                                            name="lastName"
                                            value={
                                                formData.lastName
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Last name"
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="checkout-form-grid">

                                <div className="form-group">
                                    <label>
                                        Email address
                                    </label>

                                    <div className="marketplace-input">
                                        <Mail size={17} />

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
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Phone number
                                    </label>

                                    <div className="marketplace-input">
                                        <Phone size={17} />

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
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                        </section>

                        {/* Delivery */}
                        <section className="checkout-card">

                            <div className="checkout-section-heading">
                                <div className="checkout-step">
                                    2
                                </div>

                                <div>
                                    <h2>
                                        Delivery Information
                                    </h2>

                                    <p>
                                        Where should your order
                                        be delivered?
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-form-grid">

                                <div className="form-group">
                                    <label>
                                        County
                                    </label>

                                    <select
                                        name="county"
                                        value={
                                            formData.county
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        <option>
                                            Nyeri
                                        </option>
                                        <option>
                                            Nairobi
                                        </option>
                                        <option>
                                            Kiambu
                                        </option>
                                        <option>
                                            Nakuru
                                        </option>
                                        <option>
                                            Meru
                                        </option>
                                        <option>
                                            Laikipia
                                        </option>
                                        <option>
                                            Mombasa
                                        </option>
                                        <option>
                                            Kisumu
                                        </option>
                                        <option>
                                            Other
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Town / City
                                    </label>

                                    <div className="marketplace-input">
                                        <MapPin size={17} />

                                        <input
                                            name="town"
                                            value={
                                                formData.town
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Nyeri"
                                            required
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Delivery address
                                </label>

                                <textarea
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your delivery address, estate, building, landmark, etc."
                                    rows="3"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Delivery notes
                                    <span className="optional">
                                        Optional
                                    </span>
                                </label>

                                <textarea
                                    name="deliveryNotes"
                                    value={
                                        formData.deliveryNotes
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Any additional instructions for the delivery?"
                                    rows="3"
                                />

                            </div>

                        </section>

                        {/* Delivery Method */}
                        <section className="checkout-card">

                            <div className="checkout-section-heading">
                                <div className="checkout-step">
                                    3
                                </div>

                                <div>
                                    <h2>
                                        Delivery Method
                                    </h2>

                                    <p>
                                        Choose how you want to
                                        receive your order.
                                    </p>
                                </div>
                            </div>

                            <div className="delivery-methods">

                                <button
                                    type="button"
                                    className={`delivery-method ${
                                        deliveryMethod ===
                                        "standard"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setDeliveryMethod(
                                            "standard"
                                        )
                                    }
                                >
                                    <Truck size={23} />

                                    <div>
                                        <strong>
                                            Standard Delivery
                                        </strong>

                                        <span>
                                            Delivered to your
                                            address
                                        </span>
                                    </div>

                                    <b>
                                        {cartTotal >= 10000
                                            ? "FREE"
                                            : "KES 300"}
                                    </b>
                                </button>

                                <button
                                    type="button"
                                    className={`delivery-method ${
                                        deliveryMethod ===
                                        "pickup"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setDeliveryMethod(
                                            "pickup"
                                        )
                                    }
                                >
                                    <MapPin size={23} />

                                    <div>
                                        <strong>
                                            Pickup
                                        </strong>

                                        <span>
                                            Collect from selected
                                            pickup point
                                        </span>
                                    </div>

                                    <b>FREE</b>
                                </button>

                            </div>

                        </section>

                    </div>

                    {/* Summary */}
                    <aside className="checkout-summary">

                        <h2>Order Summary</h2>

                        <div className="checkout-summary-product">
                            <ShoppingBag size={19} />

                            <div>
                                <strong>
                                    Floorball equipment
                                </strong>

                                <span>
                                    3 items
                                </span>
                            </div>

                            <strong>
                                {formatKES(cartTotal)}
                            </strong>
                        </div>

                        <div className="cart-summary-row">
                            <span>Subtotal</span>

                            <strong>
                                {formatKES(cartTotal)}
                            </strong>
                        </div>

                        <div className="cart-summary-row">
                            <span>Delivery</span>

                            <strong>
                                {deliveryFee === 0
                                    ? "FREE"
                                    : formatKES(
                                          deliveryFee
                                      )}
                            </strong>
                        </div>

                        <div className="cart-summary-divider" />

                        <div className="cart-summary-total">
                            <span>Total</span>

                            <strong>
                                {formatKES(total)}
                            </strong>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary checkout-submit-btn"
                        >
                            Continue to Payment
                            <ArrowRight size={18} />
                        </button>

                        <div className="checkout-security">

                            <ShieldCheck size={18} />

                            <span>
                                Your information is protected
                                and payments are securely
                                processed.
                            </span>

                        </div>

                    </aside>

                </form>

            </div>
        </div>
    );
};

export default Checkout;