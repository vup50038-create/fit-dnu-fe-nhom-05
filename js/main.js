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

const productList =
    document.getElementById("productList");

const pagination =
    document.getElementById("pagination");

const categoryList =
    document.getElementById("categoryList");

const searchInput =
    document.getElementById("searchInput");

// ================= STATE =================

let allProducts = [];

let currentPage = 1;

let currentCategory = "All";

let searchText = "";

let selectedSize = "M";

const ITEMS_PER_PAGE = 9;

// ================= INIT =================

getProducts();

// ================= LOAD PRODUCTS =================

async function getProducts() {

    try {

        const products =
            await getProductsAPI();

        const categories =
            await getCategoriesAPI();

        allProducts = products;

        updateCartCount();

        renderCategories(categories);

        renderProducts();

        renderPagination();

    } catch (err) {

        console.log(err);

    }

}

// ================= SEARCH =================

searchInput.addEventListener("input", (e) => {

    searchText =
        e.target.value.toLowerCase();

    currentPage = 1;

    renderProducts();

    renderPagination();

});

// ================= CATEGORY =================

window.filterCategory = function (
    category,
    event
) {

    currentCategory = category;

    currentPage = 1;

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    event.target.classList.add("active");

    renderProducts();

    renderPagination();

};

// ================= FILTER =================

function getFilteredProducts() {

    let result = allProducts;

    result = filterByCategory(
        result,
        currentCategory
    );

    result = searchProducts(
        result,
        searchText
    );

    return result;

}

// ================= RENDER PRODUCTS =================

function renderProducts() {

    const filtered =
        getFilteredProducts();

    const productsToShow = paginate(
        filtered,
        currentPage,
        ITEMS_PER_PAGE
    );

    let html = "";

    productsToShow.forEach(product => {

        html += `
        <div class="col-12 col-sm-6 col-lg-4">

            <div class="card product-card shadow-sm h-100">

                <img
                    src="${product.image}"
                    class="card-img-top"
                >

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

                    

                    <div class="d-flex justify-content-between align-items-center mt-3">

                        <div class="price">

                            $${product.price}

                        </div>

                        <div class="d-flex gap-2">

                            <!-- ADD TO CART -->

                            <button
                                class="add-cart-btn"
                                onclick='quickAddToCart(${JSON.stringify(product)})'>

                                <i class="fa-solid fa-cart-plus"></i>

                            </button>

                            <!-- VIEW -->

                            <button
                                class="btn-dark-custom"
                                onclick='showProductDetail(${JSON.stringify(product)})'>

                                View

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
        `;

    });

    productList.innerHTML = html;

}

// ================= RENDER CATEGORIES =================

function renderCategories(categories) {

    let html = `
        <button
            class="filter-btn active"
            onclick="filterCategory('All', event)">

            All

        </button>
    `;

    categories.forEach(category => {

        html += `
        <button
            class="filter-btn"
            onclick="filterCategory('${category.name}', event)">

            ${category.name}

        </button>
        `;

    });

    categoryList.innerHTML = html;

}

// ================= PAGINATION =================

function renderPagination() {

    const filtered =
        getFilteredProducts();

    const totalPages = Math.ceil(
        filtered.length / ITEMS_PER_PAGE
    );

    let html = "";

    for (let i = 1; i <= totalPages; i++) {

        html += `
        <li class="page-item ${currentPage === i ? "active" : ""}">

            <button
                class="page-link"
                onclick="changePage(${i})">

                ${i}

            </button>

        </li>
        `;

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

// ================= PRODUCT DETAIL =================

window.showProductDetail = function (
    product
) {

    document.getElementById(
        "modalImage"
    ).src = product.image;

    document.getElementById(
        "modalCategory"
    ).innerText = product.category;

    document.getElementById(
        "modalName"
    ).innerText = product.name;

    document.getElementById(
        "modalPrice"
    ).innerText = "$" + product.price;
document.getElementById(
        "modalDescription"
    ).innerText = product.description;

    // DEFAULT SIZE

    selectedSize = "M";

    // RESET ACTIVE SIZE

    document
        .querySelectorAll(".size-badge")
        .forEach(btn => {

            btn.classList.remove("active-size");

            if (
                btn.dataset.size === "M"
            ) {

                btn.classList.add("active-size");

            }

        });

    // CLICK SIZE

    document
        .querySelectorAll(".size-badge")
        .forEach(btn => {

            btn.onclick = function () {

                document
                    .querySelectorAll(".size-badge")
                    .forEach(item =>
                        item.classList.remove("active-size")
                    );

                this.classList.add("active-size");

                selectedSize =
                    this.dataset.size;

            };

        });

    // ADD TO CART BUTTON

    document.getElementById(
        "modalAddCartBtn"
    ).onclick = function () {

        const productWithSize = {
            ...product,
            size: selectedSize
        };

        addToCart(productWithSize);

    };

    new bootstrap.Modal(
        document.getElementById("productModal")
    ).show();

};

// ================= QUICK ADD TO CART =================

window.quickAddToCart = function (
    product
) {

    let size = prompt(
        "Choose size: S / M / L",
        "M"
    );

    if (!size) return;

    size = size.toUpperCase();

    if (
        size !== "S"
        && size !== "M"
        && size !== "L"
    ) {

        alert("Invalid size!");

        return;

    }

    const productWithSize = {
        ...product,
        size: size
    };

    addToCart(productWithSize);

};

// ================= ADD TO CART =================

window.addToCart = function (
    product
) {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart.push(product);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(
        product.name +
        " added to cart! Size: " +
        product.size
    );

};

// ================= UPDATE CART COUNT =================

function updateCartCount() {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    document.getElementById(
        "cartCount"
    ).innerText = cart.length;

}

// ================= OPEN CART =================

window.openCart = function () {

    renderCart();

    new bootstrap.Modal(
        document.getElementById("cartModal")
    ).show();

};

// ================= RENDER CART =================

function renderCart() {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const cartItems =
        document.getElementById("cartItems");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartTotal =
document.getElementById("cartTotal");

    // EMPTY CART

    if (cart.length === 0) {

        cartItems.innerHTML = "";

        emptyCart.classList.remove("d-none");

        cartTotal.innerText = "$0";

        return;

    }

    emptyCart.classList.add("d-none");

    let html = "";

    let total = 0;

    cart.forEach((product, index) => {

        total += Number(product.price);

        html += `
        <div class="cart-item d-flex gap-3 align-items-center mb-4 pb-3 border-bottom">

            <img
                src="${product.image}"
                class="cart-image"
            >

            <div class="flex-grow-1">

                <h5 class="fw-bold mb-2">

                    ${product.name}

                </h5>

                <p class="text-muted mb-1">

                    ${product.category}

                </p>

                <p class="mb-2">

                    Size:
                    <strong>
                        ${product.size}
                    </strong>

                </p>

                <div class="price">

                    $${product.price}

                </div>

            </div>

            <button
                class="btn btn-danger"
                onclick="removeCartItem(${index})"
            >

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>
        `;

    });

    cartItems.innerHTML = html;

    cartTotal.innerText = "$" + total;

}

// ================= REMOVE CART ITEM =================

window.removeCartItem = function (
    index
) {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const deletedProduct =
        cart[index];

    cart.splice(index, 1);

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    renderCart();

    alert(
        deletedProduct.name +
        " removed successfully!"
    );

};

// ================= CHECKOUT =================

window.checkout = function () {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    if (cart.length === 0) {

        alert("Cart is empty!");

        return;

    }

    alert("Payment successful!");

    localStorage.removeItem("cart");

    updateCartCount();

    renderCart();

};