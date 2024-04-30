// Global variables
let currentIndex = 0; // Index of the currently displayed product
let products = []; // Array to store fetched products

// Function to handle click event for browsing products
function browseProductsClickHandler() {

    // Fetch all products from the server
    fetch('/browseProducts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data; // Assign fetched products to the global variable
            displayProducts(); // Display products

            // Enable update and delete buttons
            const updateButton = document.getElementById('updateProduct');
            updateButton.classList.replace('btn-disabled', 'btn-warning');

            const deleteButton = document.getElementById('deleteProduct');
            deleteButton.classList.replace('btn-disabled', 'btn-error');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

}

// Function to display the form for creating a new product
function displayCreateProductForm() {

    // Dynamically generate HTML for the create product form
    document.getElementById('functionPanel').innerHTML = `
    <div class="card p-4 flex justify-center">
        <form class="card-body" id="createProductForm">
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" required><br>

            <label for="productDescription">Description:</label>
            <textarea id="productDescription" name="productDescription" required></textarea><br>

            <label for="productPrice">Price:</label>
            <input type="number" id="productPrice" name="productPrice" step="0.01" required><br>

            <label for="productShipping">Shipping:</label>
            <input type="number" id="productShipping" name="productShipping" step="0.01" required><br>

            <label for="productImage">Image Link:</label>
            <input type="url" id="productImage" name="productImage" required>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    `;

    // Disable update and delete buttons
    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-primary', 'btn-disabled');

    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-primary', 'btn-disabled');

    // Event listener for form submission
    document.getElementById('createProductForm').addEventListener('submit', async (event) => {

        event.preventDefault();
        // Retrieve form data
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productShipping = document.getElementById('productShipping').value;
        const productImage = document.getElementById('productImage').value;
    
        // Send POST request to create a new product
        fetch(`/createProduct`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: productName,
                description: productDescription,
                price: parseFloat(productPrice),
                shipping: parseFloat(productShipping),
                image: productImage
            })
        })
        .then(response => response.text())
        .then(result => {
            alert(result); // Display success message
            // Refresh the products after creation
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error creating product:', error));

    });

}

// Function to display the form for searching products by name
function displaySearchProductsForm(){

    // Dynamically generate HTML for the search products form
    document.getElementById('functionPanel').innerHTML = `
    <div class="card p-4 flex justify-center">
        <form class="card-body" id="searchProductsForm">
            <label for="productName">Search Products:</label>
            <input type="text" id="productName" name="productName" required><br>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    `;

    // Enable update and delete buttons
    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-disabled', 'btn-warning');

    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-disabled', 'btn-error');

    // Event listener for form submission
    document.getElementById('searchProductsForm').addEventListener('submit', async (event) => {

        event.preventDefault();
        // Retrieve search query
        const productName = document.getElementById('productName').value;

        // Send GET request to search products by name
        fetch(`/searchProducts/${productName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data; // Assign fetched products to the global variable
            currentIndex = 0
            displayProducts(); // Display products

            // Enable update and delete buttons
            const deleteButton = document.getElementById('deleteProduct');
            deleteButton.classList.replace('btn-disabled', 'btn-error');

            const updateButton = document.getElementById('updateProduct');
            updateButton.classList.replace('btn-disabled', 'btn-accent');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    });

}

// Function to display the form for updating a product
function displayUpdateProductForm() {

    // Dynamically generate HTML for the update product form
    document.getElementById('functionPanel').innerHTML = `
    <div class="card p-4 flex justify-center">
        <form class="card-body" id="updateProductForm">
            <label for="productName">Product Name:</label>
            <input type="text" id="productName" name="productName" required><br>

            <label for="productDescription">Description:</label>
            <textarea id="productDescription" name="productDescription" required></textarea><br>

            <label for="productPrice">Price:</label>
            <input type="number" id="productPrice" name="productPrice" step="0.01" required><br>

            <label for="productShipping">Shipping:</label>
            <input type="number" id="productShipping" name="productShipping" step="0.01" required><br>

            <label for="productImage">Image Link:</label>
            <input type="url" id="productImage" name="productImage" required>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    `;

    // Disable delete button
    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-primary', 'btn-disabled')

    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-primary', 'btn-disabled')

    // Event listener for form submission
    document.getElementById('updateProductForm').addEventListener('submit', async (event) => {

        event.preventDefault();
        // Retrieve form data
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productShipping = document.getElementById('productShipping').value;
        const productImage = document.getElementById('productImage').value;

        // Send PUT request to update the product
        fetch(`/updateProduct/${products[currentIndex]._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: productName,
                description: productDescription,
                price: parseFloat(productPrice),
                shipping: parseFloat(productShipping),
                image: productImage
            })
        })
        .then(response => response.text())
        .then(result => {
            alert(result); // Display success message
            // Refresh the products after update
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error deleting product:', error));

    });

}

// Function to handle click event for deleting a product
function deleteProductClickHandler() {

    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {

        // Send DELETE request to delete the product
        fetch(`/deleteProduct/${products[currentIndex]._id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(result => {
            alert(result); // Display success message
            // Refresh the products after deletion
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error deleting product:', error));

    }

}

// Function to display the currently selected product
function displayProducts() {
    
    // Ensure currentIndex is within bounds
    if (currentIndex > (products.length-1)){
        currentIndex--
    }

    const product = products[currentIndex];
    // Dynamically generate HTML to display product details
    document.getElementById('functionPanel').innerHTML = `
    <div class="p-4 flex justify-center">
        <div class="flex justify-center" id="navigationButtons">
            <button class="btn btn-secondary btn-circle btn-outline ${currentIndex === 0 ? 'btn-disabled' : ''} mx-5" id="firstButton">|<<</button>
            <button class="btn btn-accent btn-circle btn-outline ${currentIndex === 0 ? 'btn-disabled' : ''} mx-5" id="prevButton" ><</button>
            <button class="btn btn-accent btn-circle btn-outline ${currentIndex === products.length - 1 ? 'btn-disabled' : ''} mx-5" id="nextButton" >></button>
            <button class="btn btn-secondary btn-circle btn-outline ${currentIndex === products.length - 1 ? 'btn-disabled' : ''} mx-5" id="lastButton" >>>|</button>
        </div>
    </div>

    <div class="flex justify-center" id="productDisplay">
        <div class="card shadow-2xl glass w-80 h-100">
            <figure class="w-fit">
                <img src="${product.image}" alt="${product.description}" class="w-auto h-auto object-contain">
            </figure>
            <div class="card-body">
                <h2 class="card-title">${product.name}</h2>
                <p>Price: ${product.price === 0 ? 'Free' : `€${formatToTwoDecimals(product.price)}`}</p>
                <p>Shipping: ${product.shipping === 0 ? 'Free' : `€${formatToTwoDecimals(product.shipping)}`}</p>
                <p>Total Price: ${product.price + product.shipping === 0 ? 'Free' : `€${formatToTwoDecimals(product.price + product.shipping)}`}</p>
            </div>
        </div>
    </div>
    `;

    // Event listener functions for navigation buttons

    // Define event listener functions
    function firstButtonClickHandler() {
        if (currentIndex > 0) {
            currentIndex = 0;
            displayProducts();
        }
    }

    function prevButtonClickHandler() {
        if (currentIndex > 0) {
            currentIndex--;
            displayProducts();
        }
    }

    function nextButtonClickHandler() {
        if (currentIndex < products.length - 1) {
            currentIndex++;
            displayProducts();
        }
    }

    function lastButtonClickHandler() {
        if (currentIndex < products.length - 1) {
            currentIndex = products.length - 1;
            displayProducts();
        }
    }

    // Add event listeners using the defined functions
    document.getElementById('firstButton').addEventListener('click', firstButtonClickHandler);
    document.getElementById('prevButton').addEventListener('click', prevButtonClickHandler);
    document.getElementById('nextButton').addEventListener('click', nextButtonClickHandler);
    document.getElementById('lastButton').addEventListener('click', lastButtonClickHandler);
}

// Function to format a number to two decimal places
function formatToTwoDecimals(number) {
    return parseFloat(number).toFixed(2);
}

// Event listeners for various actions
document.getElementById('browseProducts').addEventListener('click', browseProductsClickHandler);
document.getElementById('createProduct').addEventListener('click', displayCreateProductForm);
document.getElementById('searchProducts').addEventListener('click', displaySearchProductsForm);
document.getElementById('updateProduct').addEventListener('click', displayUpdateProductForm);
document.getElementById('deleteProduct').addEventListener('click', deleteProductClickHandler);