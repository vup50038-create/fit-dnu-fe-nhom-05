import {
    getProductsAPI,
    getCategoriesAPI
} from "./api.js";

import {
    filterByCategory,
    searchProducts,
    paginate
} from "./utils.js";

// ================= ELEMENTS =================
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const categoryList = document.getElementById("categoryList");
const searchInput = document.getElementById("searchInput");

// ================= STATE =================
let allProducts = [];
let currentPage = 1;
let currentCategory = "All";
let searchText = "";

const ITEMS_PER_PAGE = 9;

// ================= INIT =================
getProducts();

// ================= LOAD DATA =================
async function getProducts() {
    try {
        const products = await getProductsAPI();
        const categories = await getCategoriesAPI();

        allProducts = products;

        renderCategories(categories);
        renderProducts();
        renderPagination();

    } catch (err) {
        console.log(err);
    }
}

// ================= SEARCH =================
searchInput.addEventListener("input", (e) => {
    searchText = e.target.value.toLowerCase();
    currentPage = 1;

    renderProducts();
    renderPagination();
});

// ================= CATEGORY CLICK =================
window.filterCategory = function (category, event) {

    currentCategory = category;
    currentPage = 1;

    document.querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    event.target.classList.add("active");

    renderProducts();
    renderPagination();
};

// ================= FILTER PIPELINE =================
function getFilteredProducts() {

    let result = allProducts;

    result = filterByCategory(result, currentCategory);
    result = searchProducts(result, searchText);

    return result;
}

// ================= RENDER PRODUCTS =================
function renderProducts() {

    const filtered = getFilteredProducts();
    const productsToShow = paginate(filtered, currentPage, ITEMS_PER_PAGE);

    let html = "";

    productsToShow.forEach(product => {

        html += `
        <div class="col-12 col-sm-6 col-lg-4">

            <div class="card product-card shadow-sm h-100">

                <img src="${product.image}" class="card-img-top">

                <div class="card-body d-flex flex-column">

                    <span class="badge-category">
                        ${product.category}
                    </span>

                    <h4 class="fw-bold mt-4">
                        ${product.name}
                    </h4>

                    <p class="text-muted mt-3 flex-grow-1">
                        ${product.description}
                    </p>

                    <div class="d-flex justify-content-between align-items-center mt-4">

                        <div class="price">
                            ${product.price}$
                        </div>

                        <button class="btn-dark-custom"
                            onclick='showProductDetail(${JSON.stringify(product)})'>
                            View
                        </button>

                    </div>

                </div>

            </div>

        </div>`;
    });

    productList.innerHTML = html;
}

// ================= CATEGORIES =================
function renderCategories(categories) {

    let html = `
        <button class="filter-btn active"
            onclick="filterCategory('All', event)">
            All
        </button>
    `;

    categories.forEach(category => {

        html += `
        <button class="filter-btn"
            onclick="filterCategory('${category.name}', event)">
            ${category.name}
        </button>`;
    });

    categoryList.innerHTML = html;
}

// ================= PAGINATION =================
function renderPagination() {

    const filtered = getFilteredProducts();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    let html = "";

    for (let i = 1; i <= totalPages; i++) {

        html += `
        <li class="page-item ${currentPage === i ? "active" : ""}">
            <button class="page-link" onclick="changePage(${i})">
                ${i}
            </button>
        </li>`;
    }

    pagination.innerHTML = html;
}

// ================= CHANGE PAGE =================
window.changePage = function (page) {

    currentPage = page;

    renderProducts();
    renderPagination();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

// ================= MODAL =================
window.showProductDetail = function (product) {

    document.getElementById("modalImage").src = product.image;
    document.getElementById("modalCategory").innerText = product.category;
    document.getElementById("modalName").innerText = product.name;
    document.getElementById("modalPrice").innerText = product.price + "$";
    document.getElementById("modalDescription").innerText = product.description;

    new bootstrap.Modal(
        document.getElementById("productModal")
    ).show();
};