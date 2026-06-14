const hamburger = document.querySelector(".ri-menu-3-line");
const menu = document.querySelector(".menu");
const loginAdminBtn = document.querySelector("#login-admin-btn");
const adminModal = document.querySelector("#adminModal");
const closeAdminModal = document.querySelector("#closeAdminModal");
const adminLoginForm = document.querySelector("#adminLoginForm");
const adminMessage = document.querySelector("#adminMessage");
const adminPanel = document.querySelector("#adminPanel");
const adminLogoutBtn = document.querySelector("#adminLogoutBtn");
const adminName = document.querySelector("#adminName");
const addProductForm = document.querySelector("#addProductForm");
const productNameInput = document.querySelector("#productName");
const productCategorySelect = document.querySelector("#productCategory");
const productImageInput = document.querySelector("#productImage");
const addMessage = document.querySelector("#addMessage");
const productList = document.querySelector(".produk-list");

const btnfilter = document.querySelectorAll(".produk-box ul li");
const itemList = document.querySelectorAll(".produk-list .produk-item");

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "Admin123!"
};

function createDeleteButton(productItem) {
  if (productItem.querySelector(".delete-product-btn")) {
    return;
  }

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-product-btn";
  deleteButton.textContent = "×";
  deleteButton.title = "Hapus produk";
  deleteButton.style.display = isAdminLoggedIn() ? "flex" : "none";
  productItem.appendChild(deleteButton);
}

function renderDeleteButtons() {
  const productItems = document.querySelectorAll(".produk-list .produk-item");
  productItems.forEach(item => createDeleteButton(item));
}

function setDeleteButtonsVisible(visible) {
  const deleteButtons = document.querySelectorAll(".delete-product-btn");
  deleteButtons.forEach(btn => {
    btn.style.display = visible ? "flex" : "none";
  });
}


function setAdminLoggedIn(value) {
  localStorage.setItem("adminLoggedIn", value ? "1" : "0");
}

function isAdminLoggedIn() {
  return localStorage.getItem("adminLoggedIn") === "1";
}

function openAdminModal() {
  adminModal.style.display = "flex";
  adminModal.setAttribute("aria-hidden", "false");
  adminMessage.textContent = "";
}

function closeAdminModalWindow() {
  adminModal.style.display = "none";
  adminModal.setAttribute("aria-hidden", "true");
}

function showAdminPanel() {
  adminPanel.hidden = false;
  adminName.textContent = ADMIN_CREDENTIALS.username;
  loginAdminBtn.textContent = "Admin (Online)";
  setDeleteButtonsVisible(true);
}

function hideAdminPanel() {
  adminPanel.hidden = true;
  loginAdminBtn.textContent = "Admin";
  setDeleteButtonsVisible(false);
}

function logoutAdmin() {
  setAdminLoggedIn(false);
  hideAdminPanel();
  closeAdminModalWindow();
}

function updateAdminState() {
  if (isAdminLoggedIn()) {
    showAdminPanel();
  } else {
    hideAdminPanel();
  }
}

hamburger.addEventListener("click", () => {
  menu.classList.toggle("menu-active");
});

window.onscroll = () => {
  menu.classList.remove("menu-active");
};

loginAdminBtn.addEventListener("click", openAdminModal);
closeAdminModal.addEventListener("click", closeAdminModalWindow);
adminModal.addEventListener("click", event => {
  if (event.target === adminModal) {
    closeAdminModalWindow();
  }
});

adminLoginForm.addEventListener("submit", event => {
  event.preventDefault();

  const username = document.querySelector("#adminUsername").value.trim();
  const password = document.querySelector("#adminPassword").value.trim();

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    setAdminLoggedIn(true);
    showAdminPanel();
    closeAdminModalWindow();
  } else {
    adminMessage.textContent = "Username atau password salah.";
  }
});

adminLogoutBtn.addEventListener("click", () => {
  logoutAdmin();
});

productList.addEventListener("click", event => {
  const deleteButton = event.target.closest(".delete-product-btn");
  if (!deleteButton) {
    return;
  }

  const itemToRemove = deleteButton.closest(".produk-item");
  if (itemToRemove) {
    itemToRemove.remove();
  }
});

addProductForm.addEventListener("submit", event => {
  event.preventDefault();

  const productName = productNameInput.value.trim();
  const productCategory = productCategorySelect.value;
  const productImage = productImageInput.value.trim();

  if (!productName || !productImage) {
    addMessage.textContent = "Isi semua field sebelum menambahkan produk.";
    return;
  }

  const newProduct = document.createElement("div");
  newProduct.className = "produk-item";
  newProduct.setAttribute("data-filter", productCategory);
  newProduct.innerHTML = `
    <img src="${productImage}" alt="${productName}" />
    <p>${productName}</p>
  `;
  createDeleteButton(newProduct);

  productList.appendChild(newProduct);
  addMessage.textContent = "Produk berhasil ditambahkan.";
  productNameInput.value = "";
  productImageInput.value = "";
});

renderDeleteButtons();

btnfilter.forEach(data => {
  data.onclick = () => {
    btnfilter.forEach(data => {
      data.className = "";
    });

    data.className = "active";

    const btnText = data.textContent;
    const currentItems = document.querySelectorAll(".produk-list .produk-item");
    currentItems.forEach(item => {
      item.style.display = "none";
      if (item.getAttribute("data-filter") === btnText.toLowerCase() || btnText === "All Produk") {
        item.style.display = "flex";
      }
    });
  };
});

updateAdminState();