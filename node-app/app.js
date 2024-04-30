// Import necessary modules
const cors = require('cors');
const path = require('path');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

// Create an Express app
const app = express();
const PORT = 8080;

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(express.static('src')); // Serve static files from 'src' directory

// MongoDB connection URI
const mongoURI = 'mongodb://mongodb:27017/catalogueDB';

let db;

// Log app status
console.log("APP IS RUNNING");

// Connect to MongoDB
async function connectToDb() {

  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  db = client.db('catalogueDB');

  // Log app status
  console.log('Connected to MongoDB');

}

// Load initial data into the database if it's empty
async function loadData() {

  const productsCount = await db.collection('products').countDocuments();
  console.log(productsCount);
  if (productsCount === 0) {

    console.log("LOADING PRODUCT DATA");
    try {
      const productsData = fs.readFileSync(path.join(__dirname, 'products.json'));
      const initialData = JSON.parse(productsData);
      const formattedData = initialData.map(product => ({
        name: product.name,
        description: product.description,
        price: product.price,
        shipping: product.shipping,
        image: product.image
      }));
      await db.collection('products').insertMany(formattedData);
      console.log('PRODUCT DATA INSERTED INTO DATABASE.');
    } catch (err) {
      console.error('ERROR INSERTING PRODUCT DATA INTO DATABASE:', err);
    }

  } else {

    console.log("PRODUCT DATA ALREADY IN DATABASE");
    // Drop database and reload initial data
    // db.dropDatabase()
    // loadData()

  }

}

// Connect to MongoDB and load data
connectToDb()
  .then(loadData)
  .catch(console.error);

// Route to serve index.html
app.get('/', (req, res) => {

  console.log("SERVING INDEX.HTML");
  res.sendFile(path.join(__dirname, 'src', 'index.html'));

});
app.get('/aboutPage', (req, res) => {

  console.log("SERVING ABOUT.HTML");
  res.sendFile(path.join(__dirname, 'src', 'about.html'));

});

// Route to get all products
app.get('/browseProducts', async (req, res) => {

  console.log("GETTING ALL PRODUCTS");
  try {

    // Fetch all products from the database
    const products = await db.collection('products').find().toArray();
    res.json(products); // Send JSON response containing all products

  } catch (err) {

    console.error('Error fetching all products:', err);
    res.status(500).json({ message: 'Server Error' }); // Send error response if server encounters an error

  }

});

// Route to create a new product
app.post('/createProduct', async (req, res) => {

  console.log("CREATING PRODUCT");
  const newProduct = req.body;
  try {

    // Insert new product into the database
    await db.collection('products').insertOne(newProduct);
    res.send('Product created successfully'); // Send success message

  } catch (err) {

    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server Error' }); // Send error response if server encounters an error

  }

});

// Route to search products by name
app.get('/searchProducts/:name', async (req, res) => {

  console.log("SEARCHING PRODUCTS BY NAME");
  const productName = req.params.name;
  try {

    // Search for products with name containing the specified string
    const products = await db.collection('products').find({ name: { $regex: productName, $options: 'i' } }).toArray();
    res.json(products); // Send JSON response containing matched products

  } catch (err) {

    console.error('Error searching products by name:', err);
    res.status(500).json({ message: 'Server Error' }); // Send error response if server encounters an error

  }

});

// Route to update a product
app.put('/updateProduct/:id', async (req, res) => {

  console.log("UPDATING PRODUCT");
  const productId = req.params.id;
  const updatedProduct = req.body;
  try {

    // Update the specified product
    await db.collection('products').updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });
    res.send('Product updated successfully'); // Send success message

  } catch (err) {

    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server Error' }); // Send error response if server encounters an error

  }

});

// Route to delete a product
app.delete('/deleteProduct/:id', async (req, res) => {

  console.log("DELETING PRODUCT");
  const productId = req.params.id; // Access route parameter for product ID
  try {

    // Delete the specified product
    await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
    res.send('Product deleted successfully'); // Send success message

  } catch (err) {

    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server Error' }); // Send error response if server encounters an error

  }

});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
