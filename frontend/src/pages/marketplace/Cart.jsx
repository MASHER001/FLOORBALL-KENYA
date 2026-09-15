import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    ShieldCheck,
    Truck,
    Tag,
} from "lucide-react";

const Cart = () => {
    const navigate = useNavigate();

    const [cartItems, setCartItems] = React.useState([
        {
            id: 1,
            name: "Floorball Pro Stick 29",
            category: "Sticks",
            price: 6500,
            quantity: 1,
            image: "/images/products/sticks/stick-1.jpg",
            vendor: "Floorball Kenya Store",
        },
        {
            id: 2,
            name: "Official Floorball Balls - Pack of 6",
            category: "Balls",
            price: 1800,
            quantity: 2,
            image: "/images/products/balls/balls-1.jpg",
            vendor: "Kenya Sports Hub",
        },
    ]);

    const updateQuantity = (id, change) => {
        setCartItems((items) =>
            items
                .map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              quantity: Math.max(
                                  1,
                                  item.quantity + change
                              ),
                          }
                        : item
                )
        );
    };

    const removeItem = (id) => {
        setCartItems((items) =>
            items.filter((item) => item.id !== id)
        );
    };

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const deliveryFee = subtotal >= 10000 ? 0 : 300;
    const total = subtotal + deliveryFee;

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    return (
        <div className="marketplace-page">

            <div className="marketplace-container">

                {/* Header */}
                <div className="marketplace-page-header">

                    <div>
                        <Link
                            to="/shop"
                            className="marketplace-back-link"
                        >
                            <ArrowLeft size={17} />
                            Continue Shopping
                        </Link>

                        <span className="marketplace-eyebrow">
                            MARKETPLACE
                        </span>

                        <h1>Your Cart</h1>

                        <p>
                            Review your items before proceeding
                            to checkout.
                        </p>
                    </div>

                    <div className="cart-count">
                        <ShoppingBag size={20} />
                        {cartItems.length}{" "}
                        {cartItems.length === 1
                            ? "item"
                            : "items"}
                    </div>

                </div>

                {cartItems.length === 0 ? (
                    <div className="marketplace-empty-state">

                        <div className="empty-state-icon">
                            <ShoppingBag size={42} />
                        </div>

                        <h2>Your cart is empty</h2>

                        <p>
                            You haven't added any floorball
                            equipment yet.
                        </p>

                        <Link
                            to="/shop"
                            className="btn btn-primary"
                        >
                            Browse Marketplace
                            <ArrowRight size={18} />
                        </Link>

                    </div>
                ) : (
                    <div className="cart-layout">

                        {/* Cart Items */}
                        <div className="cart-items-section">

                            {cartItems.map((item) => (
                                <div
                                    className="cart-item-card"
                                    key={item.id}
                                >

                                    <div className="cart-item-image">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />

                                        <ShoppingBag
                                            size={28}
                                        />
                                    </div>

                                    <div className="cart-item-info">

                                        <span className="product-category">
                                            {item.category}
                                        </span>

                                        <h3>{item.name}</h3>

                                        <p className="cart-vendor">
                                            Sold by{" "}
                                            <strong>
                                                {item.vendor}
                                            </strong>
                                        </p>

                                        <div className="cart-item-bottom">

                                            <strong className="product-price">
                                                {formatKES(
                                                    item.price
                                                )}
                                            </strong>

                                            <div className="quantity-control">

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    <Minus
                                                        size={15}
                                                    />
                                                </button>

                                                <span>
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            1
                                                        )
                                                    }
                                                >
                                                    <Plus
                                                        size={15}
                                                    />
                                                </button>

                                            </div>

                                            <button
                                                className="cart-remove-btn"
                                                onClick={() =>
                                                    removeItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                    <div className="cart-item-total">
                                        {formatKES(
                                            item.price *
                                                item.quantity
                                        )}
                                    </div>

                                </div>
                            ))}

                            {/* Delivery Info */}
                            <div className="cart-info-box">

                                <div>
                                    <Truck size={22} />

                                    <div>
                                        <strong>
                                            Delivery across Kenya
                                        </strong>

                                        <p>
                                            Delivery fees are
                                            calculated during
                                            checkout.
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <ShieldCheck size={22} />

                                    <div>
                                        <strong>
                                            Secure payments
                                        </strong>

                                        <p>
                                            Pay securely using
                                            M-Pesa.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* Summary */}
                        <aside className="cart-summary">

                            <h2>Order Summary</h2>

                            <div className="cart-summary-row">
                                <span>Subtotal</span>
                                <strong>
                                    {formatKES(subtotal)}
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

                            {subtotal < 10000 && (
                                <div className="free-delivery-note">
                                    <Truck size={16} />

                                    Add{" "}
                                    {formatKES(
                                        10000 - subtotal
                                    )}{" "}
                                    more for free delivery.
                                </div>
                            )}

                            <button
                                className="btn btn-primary cart-checkout-btn"
                                onClick={() =>
                                    navigate("/checkout")
                                }
                            >
                                Proceed to Checkout
                                <ArrowRight size={18} />
                            </button>

                            <Link
                                to="/shop"
                                className="cart-continue-link"
                            >
                                Continue Shopping
                            </Link>

                            <div className="cart-secure-note">
                                <ShieldCheck size={16} />
                                Secure checkout
                            </div>

                        </aside>

                    </div>
                )}

            </div>
        </div>
    );
};

export default Cart;