const statusEl = document.getElementById("status");
const result = document.getElementById("result");
const productInfo = document.getElementById("productInfo");

const app = document.getElementById("app");
const closeResultBtn = document.getElementById("closeResult");
const homeScreen = document.getElementById("homeScreen");
const scannerScreen = document.getElementById("scannerScreen");
const startScanningBtn = document.getElementById("startScanningBtn");
const navHome = document.getElementById("navHome");
const navScan = document.getElementById("navScan");
const manualBarcode = document.getElementById("manualBarcode");
const searchBtn = document.getElementById("searchBtn");

const uploadArea = document.getElementById("uploadArea");
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const removeImage = document.getElementById("removeImage");

// Initialize app
window.addEventListener("load", () => {
  app.classList.remove("hidden");
});

// Navigation
function showHome() {
  homeScreen.classList.remove("hidden");
  scannerScreen.classList.add("hidden");
  navHome.classList.add("active");
  navScan.classList.remove("active");
  resetUpload();
}

function showScanner() {
  homeScreen.classList.add("hidden");
  scannerScreen.classList.remove("hidden");
  navHome.classList.remove("active");
  navScan.classList.add("active");
}

// Event listeners
startScanningBtn.addEventListener("click", () => {
  showScanner();
});

navHome.addEventListener("click", showHome);
navScan.addEventListener("click", showScanner);

// Upload functionality
uploadBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  imageInput.click();
});

const cameraBtn = document.getElementById("cameraBtn");
const cameraInput = document.getElementById("cameraInput");

cameraBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  cameraInput.click();
});

cameraInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

uploadArea.addEventListener("click", (e) => {
  // Only trigger if clicking the upload area itself, not the button
  if (e.target === uploadArea || uploadArea.contains(e.target)) {
    imageInput.click();
  }
});

uploadArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadArea.classList.add("drag-over");
});

uploadArea.addEventListener("dragleave", () => {
  uploadArea.classList.remove("drag-over");
});

uploadArea.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");

  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    handleImageUpload(files[0]);
  }
});

imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImageUpload(file);
  }
});

removeImage.addEventListener("click", (e) => {
  e.stopPropagation();
  resetUpload();
  result.classList.add("hidden");
});

// Manual barcode search
searchBtn.addEventListener("click", () => {
  const barcode = manualBarcode.value.trim();
  if (barcode) {
    statusEl.textContent = `Searching for barcode: ${barcode}`;
    statusEl.className = "status-message scanning";
    handleBarcodeDetected(barcode);
    manualBarcode.value = "";
  } else {
    statusEl.textContent = "Please enter a barcode number";
    statusEl.className = "status-message error";
  }
});

// Allow Enter key to search
manualBarcode.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Close result
closeResultBtn.addEventListener("click", () => {
  result.classList.add("hidden");
});

// Handle image upload
function handleImageUpload(file) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    statusEl.textContent = "Please upload a valid image file";
    statusEl.className = "status-message error";
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    previewImg.src = e.target.result;
    uploadArea.classList.add("hidden");
    imagePreview.classList.remove("hidden");

    statusEl.textContent = "Processing image...";
    statusEl.className = "status-message scanning";

    // Small delay to ensure UI updates before processing
    setTimeout(() => {
      decodeBarcode(e.target.result);
    }, 100);
  };

  reader.onerror = () => {
    statusEl.textContent = "Error reading image file";
    statusEl.className = "status-message error";
    resetUpload();
  };

  reader.readAsDataURL(file);
}

// Decode barcode from image
function decodeBarcode(imageSrc) {
  Quagga.decodeSingle(
    {
      src: imageSrc,
      numOfWorkers: 0,
      decoder: {
        readers: [
          "ean_reader",
          "ean_8_reader",
          "code_128_reader",
          "code_39_reader",
          "upc_reader",
          "upc_e_reader",
        ],
      },
      locate: true,
    },
    function (result) {
      if (result && result.codeResult && result.codeResult.code) {
        const code = result.codeResult.code;
        handleBarcodeDetected(code);
      } else {
        statusEl.textContent =
          "No barcode detected. Try another image, adjust the angle, or enter manually.";
        statusEl.className = "status-message error";
        
        // Keep the preview visible so user can see what was uploaded
        // They can click remove to try again
      }
    }
  );
}

// Reset upload area
function resetUpload() {
  imageInput.value = "";
  previewImg.src = "";
  uploadArea.classList.remove("hidden");
  imagePreview.classList.add("hidden");
  statusEl.textContent = "";
  statusEl.className = "status-message";
  result.classList.add("hidden");
}

// Handle detected barcode
async function handleBarcodeDetected(barcode) {
  statusEl.textContent = `Barcode detected: ${barcode}`;
  statusEl.className = "status-message success";

  // Show success modal
  showSuccessModal(barcode);

  // Fetch product info from Open Food Facts API
  await fetchProductInfo(barcode);
}

// Show success modal
function showSuccessModal(barcode) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "success-modal";
  modal.innerHTML = `
    <div class="success-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
    <h3 class="modal-title">Barcode Scanned!</h3>
    <p class="modal-barcode">${barcode}</p>
    <button class="modal-button" onclick="closeSuccessModal()">View Product Details</button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(modal);

  // Auto close after 3 seconds
  setTimeout(() => {
    closeSuccessModal();
  }, 3000);
}

// Close success modal
window.closeSuccessModal = function () {
  const overlay = document.querySelector(".modal-overlay");
  const modal = document.querySelector(".success-modal");

  if (overlay && modal) {
    overlay.classList.add("hide");
    modal.classList.add("hide");

    setTimeout(() => {
      overlay.remove();
      modal.remove();
    }, 300);
  }
};

// Fetch product information
async function fetchProductInfo(barcode) {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    const data = await response.json();

    if (data.product && Object.keys(data.product).length > 0) {
      displayProductInfo(data.product);
    } else {
      productInfo.innerHTML = `
                <div class="product-field">
                    <strong>Barcode:</strong> ${barcode}
                </div>
                <div class="product-field">
                    <p>Product not found in database.</p>
                </div>
            `;
      result.classList.remove("hidden");
    }
  } catch (err) {
    productInfo.innerHTML = `
            <div class="product-field">
                <p style="color: #e53e3e;">Error fetching product info: ${err.message}</p>
            </div>
        `;
    result.classList.remove("hidden");
  }
}

// Display product information
async function displayProductInfo(product) {
  let html = "";

  if (product.image_url) {
    html += `<img src="${product.image_url}" alt="${
      product.product_name || "Product"
    }" class="product-image">`;
  }

  if (product.product_name) {
    html += `<div class="product-field"><strong>Product Name</strong><div>${product.product_name}</div></div>`;
  }

  if (product.brands) {
    html += `<div class="product-field"><strong>Brand</strong><div>${product.brands}</div></div>`;
  }

  if (product.quantity) {
    html += `<div class="product-field"><strong>Quantity</strong><div>${product.quantity}</div></div>`;
  }

  if (product.categories) {
    html += `<div class="product-field"><strong>Categories</strong><div>${product.categories}</div></div>`;
  }

  if (product.ingredients_text) {
    html += `<div class="product-field"><strong>Ingredients</strong><div>${product.ingredients_text}</div></div>`;
  }

  if (product.nutriments) {
    let nutritionHtml =
      '<div class="product-field"><strong>Nutrition Facts (per 100g)</strong><div>';
    if (product.nutriments.energy_value)
      nutritionHtml += `🔥 Energy: ${product.nutriments.energy_value} ${
        product.nutriments.energy_unit || "kcal"
      }<br>`;
    if (product.nutriments.fat)
      nutritionHtml += `🥑 Fat: ${product.nutriments.fat}g<br>`;
    if (product.nutriments.carbohydrates)
      nutritionHtml += `🍞 Carbs: ${product.nutriments.carbohydrates}g<br>`;
    if (product.nutriments.proteins)
      nutritionHtml += `🥩 Protein: ${product.nutriments.proteins}g<br>`;
    if (product.nutriments.salt)
      nutritionHtml += `🧂 Salt: ${product.nutriments.salt}g<br>`;
    nutritionHtml += "</div></div>";
    html += nutritionHtml;
  }

  // AI-Powered Features Section
  html += `
    <div class="ai-features-section">
      <h3 class="ai-section-title">🧠 AI Insights</h3>
      
      <button class="ai-button" onclick="getHealthierAlternatives('${
        product.code || product.barcode
      }')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        Find Healthier Alternatives
      </button>
      
      <button class="ai-button" onclick="showMoodSelector('${
        product.code || product.barcode
      }')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        Mood-Based Recommendations
      </button>
      
      <button class="ai-button" onclick="checkDietCompatibility('${
        product.code || product.barcode
      }')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"></path>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        Check Diet Compatibility
      </button>
      
      <button class="ai-button" onclick="analyzeEcoScore('${
        product.code || product.barcode
      }')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        Eco & Sustainability Score
      </button>
    </div>
  `;

  if (!html) {
    html =
      '<div class="product-field"><strong>No Information Available</strong><div>Product data is limited in the database.</div></div>';
  }

  productInfo.innerHTML = html;

  // Store current product globally for AI features
  window.currentProduct = product;

  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
