import ProductData from "./ProductData.mjs";
import { updateCartCount } from "./cart.js";


export default class ProductDetails {
    constructor(productId, category) {
        this.productId = productId;
        this.category = category;
        this.dataSource = new ProductData(category);
    }

    async init() {
        console.log(`🔎 Looking for product ID: ${this.productId} in ${this.category}`);

        const product = await this.dataSource.findProductById(this.productId);

        if (!product) {
            console.warn(`⚠️ Product ID ${this.productId} not found in ${this.category}`);
            document.querySelector("main").innerHTML = `<p>⚠️ Product not found.</p>`;
            return;
        }

        this.renderProductDetails(product);
    }

    renderProductDetails(product) {
        const element = document.querySelector("main");

// <div class="product-detail">
//     <div class="product-image">
//       <img src="path/to/tent-image.jpg" alt="Ajax Tent - 3-Person, 3-Season">
//     </div>
//     <div class="product-info">
//       <h3 class="product-brand">Marmot</h3>
//       <h1 class="product-title">Ajax Tent - 3-Person, 3-Season</h1>
      
//       <div class="price-container">
//         <div class="discount-flag">SAVE 20%</div>
//         <p class="final-price">Final Price: $199.99</p>
//         <p class="list-price">List Price: $249.99</p>
//         <p class="savings-amount">You save: $50.00</p>
//       </div>
      
//       <p class="product-description">
//         A spacious three-person, three-season tent, the Ajax has a simple design that's easy to set up, 
//         even when you're on your own. The unique pole configuration creates a strong, stable shelter 
//         that stands up to the elements.
//       </p>
//     </div>
//   </div>


        element.innerHTML = `
           <div class="product-detail">
    <div class="product-image">
        <img src="${product.Images?.PrimaryLarge || product.Image}" alt="${product.NameWithoutBrand}">
    </div>
    <div class="product-info">
        <h3 class="product-brand">${product.Brand?.Name || "Unknown Brand"}</h3>
        <h1 class="product-title">${product.NameWithoutBrand}</h1>
        
        <div class="price-container">
            <div class="discount-flag">SAVE ${Math.floor((1 - (product.FinalPrice / product.SuggestedRetailPrice))* 100)}%</div>
            <p class="final-price">Final Price: $${product.FinalPrice}</p>
            <p class="list-price">Original Price: $${product.SuggestedRetailPrice}</p>
            <p class="savings-amount">You save: $${(product.SuggestedRetailPrice - product.FinalPrice).toPrecision(4)}</p>
        </div>
        
        <p class="product-color">Color: ${product.Colors?.[0]?.ColorName || "No Color"}</p>
        <p class="product-description">${product.DescriptionHtmlSimple || "No description available."}</p>
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
    </div>
</div>

        `;

        document.getElementById("addToCart").addEventListener("click", () => {
            let cart = JSON.parse(localStorage.getItem("so-cart")) || [];
            const existingItem = cart.find(item => item.Id === product.Id);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            localStorage.setItem("so-cart", JSON.stringify(cart));
            updateCartCount(); // ✅ increasing cart counter
            alert(`${product.NameWithoutBrand} added to cart!`);


        });
    }
}
