import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Package,
    Upload,
    Image as ImageIcon,
    Save,
    X,
    CheckCircle,
    Info,
} from "lucide-react";

const categories = [
    "Sticks",
    "Jerseys",
    "Shoes",
    "Balls",
    "Blades",
    "Goalkeeper Gear",
    "Goal Posts",
    "Goal Post Nets",
    "Accessories",
];

const conditions = ["New", "Used", "Refurbished"];

const initialForm = {
    name: "",
    category: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    condition: "New",
    sku: "",
    brand: "",
    weight: "",
    featured: false,
};

export default function AddProduct() {
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [images, setImages] = useState([]);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);

        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);

        // TODO:
        // POST /api/vendor/products
        // Upload product images to Supabase Storage

        setTimeout(() => {
            setSaving(false);
            setSuccess(true);
        }, 700);
    };

    if (success) {
        return (
            <main className="vendor-page">
                <div className="vendor-success-page">
                    <div className="vendor-success-icon">
                        <CheckCircle size={52} />
                    </div>

                    <h1>Product Submitted</h1>

                    <p>
                        Your product has been submitted successfully and is
                        waiting for admin approval before appearing in the
                        marketplace.
                    </p>

                    <div className="vendor-success-actions">
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setForm(initialForm);
                                setImages([]);
                                setSuccess(false);
                            }}
                        >
                            Add Another Product
                        </button>

                        <Link
                            to="/vendor/products"
                            className="btn btn-secondary"
                        >
                            Manage Products
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="vendor-page vendor-add-product-page">
            <div className="vendor-container">

                <div className="vendor-page-header">
                    <div>
                        <Link to="/vendor" className="vendor-back-link">
                            <ArrowLeft size={17} />
                            Back to Dashboard
                        </Link>

                        <span className="vendor-eyebrow">
                            Marketplace
                        </span>

                        <h1>Add Product</h1>

                        <p>
                            Add a new floorball product to your store.
                        </p>
                    </div>
                </div>

                <form
                    className="vendor-product-form"
                    onSubmit={handleSubmit}
                >
                    <div className="vendor-form-main">

                        {/* BASIC INFORMATION */}
                        <section className="vendor-form-card">
                            <div className="vendor-form-card-header">
                                <div>
                                    <span className="vendor-section-label">
                                        Product Information
                                    </span>

                                    <h2>Basic Details</h2>
                                </div>

                                <Package size={22} />
                            </div>

                            <div className="vendor-form-grid">

                                <div className="form-group full-width">
                                    <label>
                                        Product Name
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Oxdog Hyperlight Floorball Stick"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Category
                                        <span className="required">*</span>
                                    </label>

                                    <select
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            Select category
                                        </option>

                                        {categories.map((category) => (
                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Condition</label>

                                    <select
                                        name="condition"
                                        value={form.condition}
                                        onChange={handleChange}
                                    >
                                        {conditions.map((condition) => (
                                            <option
                                                key={condition}
                                                value={condition}
                                            >
                                                {condition}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Brand</label>

                                    <input
                                        type="text"
                                        name="brand"
                                        value={form.brand}
                                        onChange={handleChange}
                                        placeholder="e.g. Oxdog"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>SKU</label>

                                    <input
                                        type="text"
                                        name="sku"
                                        value={form.sku}
                                        onChange={handleChange}
                                        placeholder="e.g. OXD-HL-001"
                                    />
                                </div>

                                <div className="form-group full-width">
                                    <label>
                                        Description
                                        <span className="required">*</span>
                                    </label>

                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Describe the product, specifications, size, material, usage and other important information..."
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* PRICING */}
                        <section className="vendor-form-card">
                            <div className="vendor-form-card-header">
                                <div>
                                    <span className="vendor-section-label">
                                        Pricing & Inventory
                                    </span>

                                    <h2>Product Pricing</h2>
                                </div>
                            </div>

                            <div className="vendor-form-grid">

                                <div className="form-group">
                                    <label>
                                        Selling Price (KES)
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="8500"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Compare-at Price (KES)</label>

                                    <input
                                        type="number"
                                        name="comparePrice"
                                        value={form.comparePrice}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="9500"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Stock Quantity
                                        <span className="required">*</span>
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="10"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Weight (kg)</label>

                                    <input
                                        type="number"
                                        name="weight"
                                        value={form.weight}
                                        onChange={handleChange}
                                        min="0"
                                        step="0.01"
                                        placeholder="0.25"
                                    />
                                </div>

                            </div>

                            <div className="vendor-info-box">
                                <Info size={18} />

                                <p>
                                    Products are reviewed by the Floorball
                                    Kenya admin team before they become
                                    publicly available.
                                </p>
                            </div>
                        </section>

                        {/* IMAGES */}
                        <section className="vendor-form-card">
                            <div className="vendor-form-card-header">
                                <div>
                                    <span className="vendor-section-label">
                                        Product Media
                                    </span>

                                    <h2>Product Images</h2>
                                </div>

                                <ImageIcon size={22} />
                            </div>

                            <label className="vendor-image-upload">
                                <Upload size={30} />

                                <strong>
                                    Upload Product Images
                                </strong>

                                <span>
                                    PNG, JPG or WEBP. Add multiple images
                                    for better product visibility.
                                </span>

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    multiple
                                    onChange={handleImageChange}
                                />
                            </label>

                            {images.length > 0 && (
                                <div className="vendor-image-preview-grid">
                                    {images.map((image, index) => (
                                        <div
                                            className="vendor-image-preview"
                                            key={`${image.name}-${index}`}
                                        >
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={image.name}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                                className="vendor-image-remove"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>

                    {/* SIDEBAR */}
                    <aside className="vendor-form-sidebar">

                        <section className="vendor-form-card">
                            <span className="vendor-section-label">
                                Marketplace
                            </span>

                            <h2>Publishing</h2>

                            <label className="vendor-checkbox">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={form.featured}
                                    onChange={handleChange}
                                />

                                <span>
                                    <strong>Request Featured Listing</strong>

                                    <small>
                                        Featured products may receive
                                        additional marketplace visibility.
                                    </small>
                                </span>
                            </label>
                        </section>

                        <section className="vendor-form-card">
                            <span className="vendor-section-label">
                                Submission
                            </span>

                            <h2>Ready to Submit?</h2>

                            <p className="vendor-form-help">
                                Make sure your product details, price,
                                stock and images are correct before
                                submitting.
                            </p>

                            <div className="vendor-form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={saving}
                                >
                                    <Save size={17} />

                                    {saving
                                        ? "Submitting..."
                                        : "Submit Product"}
                                </button>

                                <Link
                                    to="/vendor/products"
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </section>

                    </aside>
                </form>
            </div>
        </main>
    );
}