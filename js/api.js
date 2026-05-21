const API_URL = "https://6a0d89b5769682b8ee7663ee.mockapi.io/product";
const CATEGORY_URL = "https://6a0d89b5769682b8ee7663ee.mockapi.io/category";

// ================= GET ALL PRODUCTS =================
export function getProductsAPI() {
    return fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            return data.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );
        });
}

// ================= GET CATEGORIES =================
export function getCategoriesAPI() {
    return fetch(CATEGORY_URL).then(res => res.json());
}

// ================= GET BY PAGE (FIX 100%) =================
export function getProductsByPageAPI(page = 1, limit = 5) {

    return fetch(API_URL)
        .then(res => res.json())
        .then(all => {

            // SẮP XẾP MỚI NHẤT LÊN ĐẦU
            all.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            const total = all.length;

            const start = (page - 1) * limit;
            const end = start + limit;

            return {
                data: all.slice(start, end),
                total
            };
        });
}

// ================= CREATE =================
export function createProductAPI(data) {
    return fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

// ================= UPDATE =================
export function updateProductAPI(id, data) {
    return fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(res => res.json());
}

// ================= DELETE =================
export function deleteProductAPI(id) {
    return fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    }).then(res => res.json());
}