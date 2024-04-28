const express = require('express');
const fs = require('fs').promises;
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();
const port = 3000;

// Connect to MongoDB memory server
async function connectToDb() {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB in memory!");
    return client;
}

// Load data from products.json and store it in the MongoDB memory server
async function loadAndStoreData(client) {
    const db = client.db("catalogueDB");
    const productsData = await fs.readFile('products.json', 'utf8');
    const products = JSON.parse(productsData);
    await db.collection("products").insertMany(products);
    console.log("Data loaded and stored successfully!");
}

// Middleware to parse JSON bodies
app.use(express.json());

// Route to get all products
app.get('/products', async (req, res) => {
    const client = await connectToDb();
    const db = client.db("catalogueDB");
    const products = await db.collection("products").find().toArray();
    res.json(products);
});

// Route to get a single product by ID
app.get('/products/:id', async (req, res) => {
    const client = await connectToDb();
    const db = client.db("catalogueDB");
    const product = await db.collection("products").findOne({ _id: req.params.id });
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

// Route to create a new product
app.post('/products', async (req, res) => {
    const client = await connectToDb();
    const db = client.db("catalogueDB");
    const result = await db.collection("products").insertOne(req.body);
    res.status(201).json({ id: result.insertedId });
});

// Route to update a product by ID
app.put('/products/:id', async (req, res) => {
    const client = await connectToDb();
    const db = client.db("catalogueDB");
    const result = await db.collection("products").updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.modifiedCount === 1) {
        res.status(200).send('Product updated successfully');
    } else {
        res.status(404).send('Product not found');
    }
});

// Route to delete a product by ID
app.delete('/products/:id', async (req, res) => {
    const client = await connectToDb();
    const db = client.db("catalogueDB");
    const result = await db.collection("products").deleteOne({ _id: req.params.id });
    if (result.deletedCount === 1) {
        res.status(200).send('Product deleted successfully');
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(port, async () => {
    const client = await connectToDb();
    await loadAndStoreData(client);
    console.log(`Server running at http://localhost:${port}`);
});
