// ================= VALIDATE PRODUCT =================

export function validateProduct(data) {

    const err = {};

    // ===== NAME =====

    if (!data.name || !data.name.trim()) {

        err.name = "Name is required";

    }

    // ===== PRICE =====

    if (
        data.price === ""
        || data.price === null
        || isNaN(data.price)
    ) {

        err.price = "Price is required";

    }
    else if (data.price <= 0) {

        err.price = "Price must be greater than 0";

    }

    // ===== CATEGORY =====

    if (!data.category) {

        err.category = "Category is required";

    }

    // ===== IMAGE =====

    if (
        !data.image
        || !data.image.startsWith("http")
    ) {

        err.image = "Image must be a valid URL";

    }

    // ===== STOCK =====

    if (
        data.stock === ""
        || data.stock === null
        || isNaN(data.stock)
    ) {

        err.stock = "Stock is required";

    }
    else if (data.stock < 0) {

        err.stock = "Stock must be greater than 0";

    }

    // ===== DESCRIPTION =====

    if (
        !data.description
        || !data.description.trim()
    ) {

        err.description = "Description is required";

    }

    return err;

}

// ================= FILTER BY CATEGORY =================

export function filterByCategory(products, category) {

    if (category === "All") return products;

    return products.filter(
        p => p.category === category
    );

}

// ================= SEARCH PRODUCTS =================

export function searchProducts(products, keyword) {

    if (!keyword || !keyword.trim()) {

        return products;

    }

    return products.filter(p =>
        p.name
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

}

// ================= PAGINATION =================

export function paginate(products, page, limit) {

    const start = (page - 1) * limit;

    const end = start + limit;

    return products.slice(start, end);

}

// ================= FORMAT PRICE =================

export function formatPrice(price) {

    return new Intl.NumberFormat("vi-VN")
        .format(price) + " đ";

}

// ================= FORMAT DATE =================

export function formatDate(date) {

    if (!date) return "";

    return new Date(date)
        .toLocaleDateString("vi-VN");

}

// ================= WHILE + IF DEMO =================

export function countStock(products) {

    let i = 0;

    let totalStock = 0;

    while (i < products.length) {

        if (products[i].stock) {

            totalStock += Number(products[i].stock);

        }
        else {

            totalStock += 0;

        }

        i++;

    }

    return totalStock;

}

// ================= GET PRODUCT BY ID =================

export function getProductById(products, id) {

    for (let i = 0; i < products.length; i++) {

        if (products[i].id == id) {

            return products[i];

        }

    }

    return null;

}