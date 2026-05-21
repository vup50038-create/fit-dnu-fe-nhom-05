import {
    getProductsByPageAPI,
    createProductAPI,
    updateProductAPI,
    deleteProductAPI,
    getCategoriesAPI
} from "./api.js";

import { validateProduct } from "./utils.js";

let products = [];
let categories = [];
let editId = null;

let currentPage = 1;

const limit = 5;

let totalPages = 1;

// ================= INIT =================

$(document).ready(function () {

    loadCategories();

    loadProducts(1);

    // ================= jQuery AJAX =================

    $.ajax({

        url: "https://6a0d89b5769682b8ee7663ee.mockapi.io/product",

        method: "GET",

        success: function (data) {

            console.log("jQuery AJAX OK:", data);

        },

        error: function () {

            alert("jQuery AJAX failed");

        }

    });

});

// ================= TOAST =================

function showToast(message) {

    $("#successToast .toast-body").text(message);

    const toast = new bootstrap.Toast(
        document.getElementById("successToast")
    );

    toast.show();

}

// ================= LOAD CATEGORIES =================

function loadCategories() {

    getCategoriesAPI().then(data => {

        categories = data;

        let html = `
        
            <option value="">
                Select category
            </option>
        
        `;

        data.forEach(c => {

            html += `
            
                <option value="${c.name}">
                    ${c.name}
                </option>
            
            `;

        });

        $("#categoryInput").html(html);

    });

}

// ================= LOAD PRODUCTS =================

function loadProducts(page = 1) {

    currentPage = page;

    $("#loading").removeClass("d-none");

    getProductsByPageAPI(page, limit)

        .then(res => {

            products = res.data;

            render();

            totalPages = Math.ceil(res.total / limit);

            renderPagination();

        })

        .catch(() => alert("Load API failed"))

        .finally(() => $("#loading").addClass("d-none"));

}

// ================= RENDER TABLE =================

function render() {

    let html = "";

    products.forEach(p => {

        html += `
        
        <tr>

            <td>
                <img src="${p.image}"
                    width="60"
                    height="60"
                    class="rounded object-fit-cover">
            </td>

            <td class="fw-semibold">
                ${p.name}
            </td>

            <td>
                ${p.price}$
            </td>

            <td>
                <span class="badge bg-dark-subtle text-dark rounded-pill px-3 py-2">
                    ${p.category}
                </span>
            </td>

            <td>
                ${p.stock || 0}
            </td>

            <td>
                ${p.createdAt
                    ? new Date(p.createdAt).toLocaleString()
                    : ""}
            </td>

            <td>

                <button class="btn btn-warning btn-sm editBtn"
                    data-id="${p.id}">

                    <i class="fa fa-pen"></i>

                </button>

                <button class="btn btn-danger btn-sm deleteBtn"
                    data-id="${p.id}">

                    <i class="fa fa-trash"></i>

                </button>

            </td>

        </tr>
        
        `;

    });

    $("#productList").html(html);

}

// ================= PAGINATION =================

function renderPagination() {

    let html = "";

    for (let i = 1; i <= totalPages; i++) {

        html += `
        
        <li class="page-item ${i === currentPage ? "active" : ""}">
        
            <a class="page-link pageBtn"
                data-page="${i}">
                
                ${i}
                
            </a>
            
        </li>
        
        `;

    }

    $("#pagination").html(html);

}

// ================= CHANGE PAGE =================

$(document).on("click", ".pageBtn", function () {

    loadProducts(Number($(this).data("page")));

});

// ================= SAVE =================

$("#saveBtn").on("click", function () {

    const data = {

        name: $("#nameInput").val(),

        price: Number($("#priceInput").val()),

        category: $("#categoryInput").val(),

        image: $("#imageInput").val(),

        stock: Number($("#stockInput").val()),

        description: $("#descriptionInput").val(),

        createdAt: new Date().toISOString()

    };

    // ================= VALIDATION =================

    const errors = validateProduct(data);

    $("#nameError").text(errors.name || "");

    $("#priceError").text(errors.price || "");

    $("#categoryError").text(errors.category || "");

    $("#imageError").text(errors.image || "");

    $("#stockError").text(errors.stock || "");

    $("#descriptionError").text(errors.description || "");

    if (Object.keys(errors).length > 0) return;

    // ================= CREATE / UPDATE =================

    const action = editId
        ? updateProductAPI(editId, data)
        : createProductAPI(data);

    action.then(() => {

        $("#productModal").modal("hide");

        resetForm();

        loadProducts(currentPage);

        showToast(
            editId
                ? "Updated successfully!"
                : "Created successfully!"
        );

    });

});

// ================= EDIT =================

$(document).on("click", ".editBtn", function () {

    const id = $(this).data("id");

    const p = products.find(x => x.id == id);

    editId = id;

    $("#nameInput").val(p.name);

    $("#priceInput").val(p.price);

    $("#categoryInput").val(p.category);

    $("#imageInput").val(p.image);

    $("#stockInput").val(p.stock);

    $("#descriptionInput").val(p.description);

    $("#modalTitle").text("Edit Product");

    $("#productModal").modal("show");

});

// ================= DELETE =================

$(document).on("click", ".deleteBtn", function () {

    const id = $(this).data("id");

    if (confirm("Delete this product?")) {

        deleteProductAPI(id).then(() => {

            loadProducts(currentPage);

            showToast("Deleted successfully!");

        });

    }

});

// ================= RESET FORM =================

function resetForm() {

    editId = null;

    $("#nameInput").val("");

    $("#priceInput").val("");

    $("#categoryInput").val("");

    $("#imageInput").val("");

    $("#stockInput").val("");

    $("#descriptionInput").val("");

    $("#modalTitle").text("Add Product");

    $(".text-danger").text("");

}