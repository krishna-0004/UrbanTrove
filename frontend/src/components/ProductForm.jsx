import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductForm.css";

const defaultProduct = {
  title: "", description: "", price: "", sku: "", discount: 0,
  categories: [], variants: [{ size: "", color: "", stock: 0 }],
  isNewArrival: false, isFeatured: false, shippingInfo: "",
  returnPolicy: "", metaTitle: "", metaDescription: ""
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultProduct);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/admin/product/${id}`, {
        withCredentials: true,
      }).then((res) => {
        setForm({ ...res.data });
        setExistingImages(res.data.images || []);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVariantChange = (i, field, value) => {
    const variants = [...form.variants];
    variants[i][field] = value;
    setForm((prev) => ({ ...prev, variants }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 0 }]
    }));
  };

  const removeVariant = (index) => {
    const variants = form.variants.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, variants }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in form) {
      if (key === "reviews") continue;
      if (Array.isArray(form[key])) {
        data.append(key, JSON.stringify(form[key]));
      } else {
        data.append(key, form[key]);
      }
    }

    for (const img of images) {
      data.append("images", img);
    }

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/admin/product/${isEdit ? `update/${id}` : "add"}`;
      const method = isEdit ? axios.put : axios.post;
      await method(url, data, { withCredentials: true });
      navigate("/admin/products");
    } catch (err) {
      alert("Error saving product.");
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    const selected = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selected]);
  };

  return (
    <div className="form-container">
      <h2 className="form-heading">{isEdit ? "Edit" : "Add"} Product</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {/* === Basic Info === */}
        <h3 className="section-title">Basic Info</h3>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="form-input" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-textarea" />
        <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" className="form-input" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" className="form-input" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount (%)" type="number" className="form-input" />

        {/* === Variants === */}
        <h3 className="section-title">Variants</h3>
        {form.variants.map((v, i) => (
          <div key={i} className="variant-group">
            <input value={v.size} onChange={(e) => handleVariantChange(i, "size", e.target.value)} placeholder="Size" className="variant-input" />
            <input value={v.color} onChange={(e) => handleVariantChange(i, "color", e.target.value)} placeholder="Color" className="variant-input" />
            <input value={v.stock} onChange={(e) => handleVariantChange(i, "stock", e.target.value)} placeholder="Stock" type="number" className="variant-input" />
            <button type="button" className="remove-btn" onClick={() => removeVariant(i)}>Remove</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addVariant}>+ Add Variant</button>

        {/* === Categories === */}
        <h3 className="section-title">Categories</h3>
        <select name="categories" multiple value={form.categories} onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            categories: Array.from(e.target.selectedOptions, (o) => o.value),
          }))
        } className="form-select">
          {["men", "women", "home-decor", "accessories", "gifts"].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* === Image Upload === */}
        <h3 className="section-title">Product Images</h3>
        <input type="file" multiple onChange={handleImageChange} className="form-file" />
        <div className="image-preview">
          {existingImages.map((img, i) => (
            <img key={i} src={img} alt="preview" />
          ))}
          {images.map((file, i) => (
            <img key={i} src={URL.createObjectURL(file)} alt="preview" />
          ))}
        </div>

        {/* === Flags === */}
        <div className="checkbox-group">
          <label><input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} /> Featured</label>
          <label><input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} /> New Arrival</label>
        </div>

        {/* === Extra Info === */}
        <input name="shippingInfo" value={form.shippingInfo} onChange={handleChange} placeholder="Shipping Info" className="form-input" />
        <input name="returnPolicy" value={form.returnPolicy} onChange={handleChange} placeholder="Return Policy" className="form-input" />
        <input name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="Meta Title" className="form-input" />
        <input name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="Meta Description" className="form-input" />

        <button type="submit" className="form-submit">
          {isEdit ? "Update" : "Create"} Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
