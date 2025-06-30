import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./ProductTable.css";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(delay);
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/product/all?search=${debouncedSearch}&page=${page}&limit=10`,
        { withCredentials: true }
      );
      setProducts(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, page]);

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/api/admin/product/delete/${id}`, {
        withCredentials: true,
      });
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="product-container">
      <h2 className="product-header">Product Management</h2>

      <div className="product-controls">
        <input
          className="product-search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link to="/admin/products/new" className="add-button">
          + Add Product
        </Link>
      </div>

      <div className="product-table-wrapper">
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="loading">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.images?.[0] || "/placeholder.png"}
                      alt="product"
                      className="product-image"
                    />
                  </td>
                  <td>{p.title}</td>
                  <td>₹{p.finalPrice?.toFixed(2)}</td>
                  <td>{p.variants?.[0]?.stock || "N/A"}</td>
                  <td>
                    <div className="actions">
                      <Link to={`/admin/products/edit/${p._id}`}>Edit</Link>
                      <button onClick={() => deleteProduct(p._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductTable;
