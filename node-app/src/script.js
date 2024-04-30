let currentIndex = 0;
let products = [];

function browseProductsClickHandler() {
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

            const updateButton = document.getElementById('updateProduct');
            updateButton.classList.replace('btn-disabled', 'btn-warning');

            const deleteButton = document.getElementById('deleteProduct');
            deleteButton.classList.replace('btn-disabled', 'btn-error');
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function displayCreateProductForm() {
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

    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-primary', 'btn-disabled');

    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-primary', 'btn-disabled');

    document.getElementById('createProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productShipping = document.getElementById('productShipping').value;
        const productImage = document.getElementById('productImage').value;
    
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
            alert(result);
            // Refresh the products after deletion
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error deleting product:', error));
    });
}

function displaySearchProductsForm(){
    document.getElementById('functionPanel').innerHTML = `
    <div class="card p-4 flex justify-center">
        <form class="card-body" id="searchProductsForm">
            <label for="productName">Search Products:</label>
            <input type="text" id="productName" name="productName" required><br>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
    `;

    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-disabled', 'btn-warning');

    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-disabled', 'btn-error');

    document.getElementById('searchProductsForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const productName = document.getElementById('productName').value;

    
        fetch(`/searchProducts/${productName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            products = data; // Assign fetched products to the global variable
            displayProducts(); // Display products

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

function displayUpdateProductForm() {
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

    const deleteButton = document.getElementById('deleteProduct');
    deleteButton.classList.replace('btn-primary', 'btn-disabled')

    const updateButton = document.getElementById('updateProduct');
    updateButton.classList.replace('btn-primary', 'btn-disabled')

    document.getElementById('updateProductForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productShipping = document.getElementById('productShipping').value;
        const productImage = document.getElementById('productImage').value;


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
            alert(result);
            // Refresh the products after deletion
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error deleting product:', error));
    });
}

function deleteProductClickHandler() {
    const confirmDelete = confirm('Are you sure you want to delete this product?');
    if (confirmDelete) {
        fetch(`/deleteProduct/${products[currentIndex]._id}`, {
            method: 'DELETE'
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
            // Refresh the products after deletion
            document.getElementById('browseProducts').click();
        })
        .catch(error => console.error('Error deleting product:', error));
    }
}

function displayProducts() {
    if (currentIndex > (products.length-1)){
        currentIndex--
    }

    const product = products[currentIndex];
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

    document.getElementById('firstButton').removeEventListener('click', firstButtonClickHandler);
    document.getElementById('prevButton').removeEventListener('click', prevButtonClickHandler);
    document.getElementById('nextButton').removeEventListener('click', nextButtonClickHandler);
    document.getElementById('lastButton').removeEventListener('click', lastButtonClickHandler);
    

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

function formatToTwoDecimals(number) {
    return parseFloat(number).toFixed(2);
}

document.getElementById('browseProducts').addEventListener('click', browseProductsClickHandler);
document.getElementById('createProduct').addEventListener('click', displayCreateProductForm);
document.getElementById('searchProducts').addEventListener('click', displaySearchProductsForm);
document.getElementById('updateProduct').addEventListener('click', displayUpdateProductForm);
document.getElementById('deleteProduct').addEventListener('click', deleteProductClickHandler);