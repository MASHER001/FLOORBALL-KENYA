import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ShoppingCart,
    Minus,
    Plus,
    Heart,
    Share2,
    ShieldCheck,
    Truck,
    Store,
    Star,
    CheckCircle,
} from "lucide-react";

const ProductDetails = () => {
    const { id } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [added, setAdded] = useState(false);

    const product = {
        id,
        name: "Floorball Pro Stick 29",
        category: "Sticks",
        price: 6500,
        oldPrice: 7200,
        rating: 4.8,
        reviews: 24,
        stock: 12,
        condition: "New",
        vendor: "Floorball Kenya Store",
        vendorLocation: "Nairobi, Kenya",
        description:
            "A lightweight professional floorball stick designed for players looking for excellent control, speed and shooting performance.",
        images: [
            "/images/products/sticks/stick-1.jpg",
            "/images/products/sticks/stick-2.jpg",
            "/images/products/sticks/stick-3.jpg",
        ],
        specifications: [
            ["Brand", "Floorball Kenya"],
            ["Length", "96 cm"],
            ["Flex", "29 mm"],
            ["Blade", "Medium"],
            ["Grip", "Premium Grip"],
            ["Condition", "New"],
        ],
    };

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString()}`;

    const handleAddToCart = () => {
        /*
         * TODO:
         * Add product to CartContext / Supabase cart.
         */

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 2500);
    };

    return (
        <div className="marketplace-page">

            <div className="marketplace-container">

                <Link
                    to="/shop"
                    className="marketplace-back-link"
                >
                    <ArrowLeft size={17} />
                    Back to Marketplace
                </Link>

                <div className="product-details-layout">

                    {/* Images */}
                    <div className="product-gallery">

                        <div className="product-main-image">

                            {product.images[selectedImage] ? (
                                <img
                                    src={
                                        product.images[
                                            selectedImage
                                        ]
                                    }
                                    alt={product.name}
                                />
                            ) : (
                                <ShoppingCart size={70} />
                            )}

                            <span className="product-condition-badge">
                                {product.condition}
                            </span>

                        </div>

                        <div className="product-thumbnails">

                            {product.images.map(
                                (image, index) => (
                                    <button
                                        key={index}
                                        className={
                                            selectedImage ===
                                            index
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setSelectedImage(
                                                index
                                            )
                                        }
                                    >
                                        <img
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                        />
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                    {/* Details */}
                    <div className="product-details-content">

                        <span className="product-category">
                            {product.category}
                        </span>

                        <h1>{product.name}</h1>

                        <div className="product-rating">

                            <div className="stars">
                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <Star
                                            key={star}
                                            size={17}
                                            fill="currentColor"
                                        />
                                    )
                                )}
                            </div>

                            <strong>
                                {product.rating}
                            </strong>

                            <span>
                                ({product.reviews} reviews)
                            </span>

                        </div>

                        <div className="product-price-details">

                            <strong>
                                {formatKES(
                                    product.price
                                )}
                            </strong>

                            {product.oldPrice && (
                                <del>
                                    {formatKES(
                                        product.oldPrice
                                    )}
                                </del>
                            )}

                            <span className="product-sale-badge">
                                SALE
                            </span>

                        </div>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-stock">

                            <CheckCircle size={17} />

                            <strong>
                                {product.stock} available
                            </strong>

                        </div>

                        {/* Quantity */}
                        <div className="product-purchase-row">

                            <div className="product-quantity">

                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.max(
                                                1,
                                                quantity - 1
                                            )
                                        )
                                    }
                                >
                                    <Minus size={16} />
                                </button>

                                <span>
                                    {quantity}
                                </span>

                                <button
                                    onClick={() =>
                                        setQuantity(
                                            Math.min(
                                                product.stock,
                                                quantity + 1
                                            )
                                        )
                                    }
                                >
                                    <Plus size={16} />
                                </button>

                            </div>

                            <button
                                className="btn btn-primary product-add-btn"
                                onClick={
                                    handleAddToCart
                                }
                            >
                                {added ? (
                                    <>
                                        <CheckCircle
                                            size={19}
                                        />
                                        Added to Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart
                                            size={19}
                                        />
                                        Add to Cart
                                    </>
                                )}
                            </button>

                            <button className="product-icon-btn">
                                <Heart size={19} />
                            </button>

                            <button className="product-icon-btn">
                                <Share2 size={19} />
                            </button>

                        </div>

                        {/* Seller */}
                        <div className="product-seller-card">

                            <div className="product-seller-icon">
                                <Store size={22} />
                            </div>

                            <div>
                                <span>
                                    Sold by
                                </span>

                                <strong>
                                    {product.vendor}
                                </strong>

                                <small>
                                    {product.vendorLocation}
                                </small>
                            </div>

                            <Link to="/shop">
                                Visit Store
                            </Link>

                        </div>

                        {/* Benefits */}
                        <div className="product-benefits">

                            <div>
                                <Truck size={21} />

                                <div>
                                    <strong>
                                        Delivery Available
                                    </strong>

                                    <span>
                                        Across Kenya
                                    </span>
                                </div>
                            </div>

                            <div>
                                <ShieldCheck size={21} />

                                <div>
                                    <strong>
                                        Secure Payment
                                    </strong>

                                    <span>
                                        M-Pesa supported
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Lower Information */}
                <div className="product-information-grid">

                    <section className="product-information-card">

                        <h2>
                            Product Description
                        </h2>

                        <p>
                            {product.description}
                        </p>

                        <p>
                            This product is listed by a verified
                            marketplace vendor. Product
                            availability, delivery and pricing
                            may change based on vendor stock.
                        </p>

                    </section>

                    <section className="product-information-card">

                        <h2>
                            Specifications
                        </h2>

                        <div className="product-specifications">

                            {product.specifications.map(
                                ([label, value]) => (
                                    <div key={label}>
                                        <span>
                                            {label}
                                        </span>

                                        <strong>
                                            {value}
                                        </strong>
                                    </div>
                                )
                            )}

                        </div>

                    </section>

                </div>

            </div>
        </div>
    );
};

export default ProductDetails;