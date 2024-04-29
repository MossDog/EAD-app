console.log("VERY BEGGINING");
const cors = require('cors');
const path = require('path');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://mongodb:27017/catalogueDB'; // This assumes your MongoDB container is named "mongodb" and uses port 27017

let db;
console.log("APP IS RUNNING");

async function connectToDb() {
  console.log("CONNECTING TO DB");
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Connected to MongoDB');
  db = client.db('catalogueDB');
}

async function loadData() {
  console.log("LOAD DATA ENETERED");
  const productsCount = await db.collection('products').countDocuments();
  console.log(productsCount);
  if (productsCount === 0) {
    
    console.log("LOADING DATA");
    try {
      const productsData = fs.readFileSync(path.join(__dirname, 'products.json'));
      const initialData = JSON.parse(productsData);
      console.log(initialData);
      await db.collection('products').insertMany(initialData);
      console.log('Initial data loaded into the database');
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  }else{
    console.log("DATA ALREADY IN DATABASE");
  }
}

connectToDb()
  .then(loadData)
  .catch(console.error);

// Serve static files from the 'public' directory
app.use(express.static('src'));

app.get('/', (req, res) => {
  console.log("SERVING INDEX.HTML");
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Route to get all products
app.get('/products', async (req, res) => {
  try {
    const products = await db.collection('products').find().toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to create a new product
app.post('/products', async (req, res) => {
  const newProduct = req.body;
  try {
    const result = await db.collection('products').insertOne(newProduct);
    res.json(result.ops[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to update a product
app.put('/products/:id', async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  try {
    await db.collection('products').updateOne({ _id: ObjectId(productId) }, { $set: updatedProduct });
    res.send('Product updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to delete a product
app.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
    await db.collection('products').deleteOne({ _id: ObjectId(productId) });
    res.send('Product deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add other CRUD routes as needed

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on 0.0.0.0:${PORT}`);
});
