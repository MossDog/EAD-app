// Import required modules
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');

// Function to connect to an in-memory MongoDB server
async function connectToDb() {
  const mongoServer = await MongoMemoryServer.create(); // Use create to create an instance of an in-memory MongoDB server
  const uri = await mongoServer.getUri(); // Get the connection URI for the in-memory MongoDB server
  const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Connect to the MongoDB server using MongoClient
  console.log("Connected to MongoDB in memory!");
  return client; // Return the MongoDB client instance
}

// Function to create a "books" collection in the database
async function createBookCollection(client) {
  const db = client.db("myDatabase"); // Access the database named "myDatabase"
  await db.createCollection("books"); // Create a collection named "books"
  console.log("Created collection 'books'");
}

// Function to insert a book document into the "books" collection
async function insertBook(client, title, author) {
  const db = client.db("myDatabase"); // Access the database named "myDatabase"
  const book = { title, author }; // Create a book document with the provided title and author
  await db.collection("books").insertOne(book); // Insert the book document into the "books" collection
  console.log(`Inserted book: ${title} by ${author}`);
}

// Function to read all books from the "books" collection
async function readBooks(client) {
  const db = client.db("myDatabase"); // Access the database named "myDatabase"
  const books = await db.collection("books").find().toArray(); // Retrieve all books from the "books" collection
  console.log("Listing all books:");
  books.forEach(book => console.log(book)); // Log each book to the console
}

// Function to update the title of a book in the "books" collection by ID
async function updateBookTitle(client, id, newTitle) {
  const db = client.db("myDatabase"); // Access the database named "myDatabase"
  const filter = { _id: id }; // Define a filter based on the book's ID
  const update = { $set: { title: newTitle } }; // Define an update to set the new title
  await db.collection("books").updateOne(filter, update); // Update the book's title in the "books" collection
  console.log(`Updated book title for ID: ${id}`);
}

// Function to delete a book from the "books" collection by ID
async function deleteBook(client, id) {
  const db = client.db("myDatabase"); // Access the database named "myDatabase"
  const filter = { _id: id }; // Define a filter based on the book's ID
  await db.collection("books").deleteOne(filter); // Delete the book from the "books" collection
  console.log(`Deleted book with ID: ${id}`);
}

// Self-invoking async function to demonstrate and test the defined functions
(async () => {
  const client = await connectToDb(); // Connect to the in-memory MongoDB server
  await createBookCollection(client); // Create the "books" collection
  await insertBook(client, "The Lord of the Rings", "J.R.R. Tolkien"); // Insert the first book
  await insertBook(client, "Pride and Prejudice", "Jane Austen"); // Insert the second book
  await readBooks(client); // Read and display all books
  await updateBookTitle(client, 1, "The Fellowship of the Ring"); // Update the title of the first book
  await readBooks(client); // Read and display all books after the update
  await deleteBook(client, 2); // Delete the second book
  await readBooks(client); // Read and display all books after the deletion
  await client.close(); // Close the connection to the in-memory MongoDB server
  console.log("Closed connection to MongoDB in memory.");
})();
