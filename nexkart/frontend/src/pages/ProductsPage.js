import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { productAPI, categoryAPI } from "../services/api";
import ProductCard from "../components/Product/ProductCard";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    categoryId: searchParams.get("categoryId") || "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortDir: "desc",
    page: 0,
    size: 12,
  });
  useEffect(() => {
    categoryAPI
      .getAll()
      .then((r) => {
        const data = r.data;
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.content) {
          setCategories(data.content);
        } else {
          setCategories([]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (!params.keyword) delete params.keyword;
      if (!params.categoryId) delete params.categoryId;
      if (!params.minPrice) delete params.minPrice;
      if (!params.maxPrice) delete params.maxPrice;
      const res = await productAPI.getAll(params);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 0 }));
  };

  return (
    <Container className="py-4">
      <Row>
        {/* Sidebar Filters */}
        <Col md={3} className="mb-4">
          <div className="filter-sidebar">
            <div className="filter-title">🔍 Filters</div>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Search
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={filters.keyword}
                onChange={(e) => updateFilter("keyword", e.target.value)}
                size="sm"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Category
              </Form.Label>
              <Form.Select
                size="sm"
                value={filters.categoryId}
                onChange={(e) => updateFilter("categoryId", e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Price Range
              </Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  size="sm"
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                />
                <Form.Control
                  size="sm"
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 600, fontSize: "0.85rem" }}>
                Sort By
              </Form.Label>
              <Form.Select
                size="sm"
                value={`${filters.sortBy}-${filters.sortDir}`}
                onChange={(e) => {
                  const [sortBy, sortDir] = e.target.value.split("-");
                  setFilters((prev) => ({ ...prev, sortBy, sortDir, page: 0 }));
                }}
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </Form.Select>
            </Form.Group>

            <button
              className="btn-nk-primary w-100"
              style={{ fontSize: "0.85rem", padding: "0.5rem" }}
              onClick={() =>
                setFilters({
                  keyword: "",
                  categoryId: "",
                  minPrice: "",
                  maxPrice: "",
                  sortBy: "createdAt",
                  sortDir: "desc",
                  page: 0,
                  size: 12,
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                marginBottom: 0,
              }}
            >
              {filters.keyword
                ? `Results for "${filters.keyword}"`
                : "All Products"}
            </h5>
            {!loading && (
              <small style={{ color: "#6c757d" }}>
                {products.length} products found
              </small>
            )}
          </div>

          {loading ? (
            <div className="nexkart-spinner">
              <Spinner animation="border" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "4rem" }}>🔍</div>
              <h5>No products found</h5>
              <p style={{ color: "#6c757d" }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <Row className="g-3">
                {products.map((product) => (
                  <Col key={product.id} xs={12} sm={6} lg={4}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      disabled={filters.page === 0}
                      onClick={() =>
                        setFilters((p) => ({ ...p, page: p.page - 1 }))
                      }
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i}
                        active={i === filters.page}
                        onClick={() => setFilters((p) => ({ ...p, page: i }))}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={filters.page === totalPages - 1}
                      onClick={() =>
                        setFilters((p) => ({ ...p, page: p.page + 1 }))
                      }
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
