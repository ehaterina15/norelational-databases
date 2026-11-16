// ------------------------------------------------------------
// Lab 01 - From the terminal to Node.js
// ------------------------------------------------------------
// In session 1 you typed MongoDB commands directly in mongosh:
//
//   db.books.insertOne({ title: "Dune", author: "Frank Herbert" })
//   db.books.find()
//
// Here you will write the exact same operations, but as a Node.js
// script. The MongoDB driver translates your JavaScript calls into
// the same commands mongosh sends to the database.
// ------------------------------------------------------------

const { MongoClient } = require("mongodb");

// The connection string tells the driver where MongoDB is running.
// "mongodb://localhost:27017" is the default for a local installation.
const URI = "mongodb://localhost:27017";

// MongoClient is the entry point to the driver.
// You create one client per application.
const client = new MongoClient(URI);

// ------------------------------------------------------------
// Everything that talks to the database must happen inside an
// async function, because network calls take time.
// "await" pauses execution until the operation completes.
// ------------------------------------------------------------
async function main() {
  // Open the connection to MongoDB.
  await client.connect();

  // Select the database and collection to work with.
  // If they do not exist yet, MongoDB creates them on first write.
  const books = client.db("book_db").collection("books");

  // Start fresh on every run.
  await books.deleteMany({});

  // ----------------------------------------------------------
  // TODO 1 - insertOne with an embedded object
  // ----------------------------------------------------------
  await books.insertOne({
    title: "Les Misérables",
    author: "Victor Hugo",
    publisher: { name: "Gallimard", country: "France" }
  });
  // ----------------------------------------------------------
  // TODO 2 - insertOne with an array
  await books.insertOne({
  title: "Guerre et Paix",
  genres: ["roman-épopée ", "roman historique"]
});

  // ----------------------------------------------------------
  // TODO 3 - insertMany
  // ----------------------------------------------------------
  await books.insertMany([
    {
      title: "Crime et Châtiment",
      author: "Fiodor Dostoïevski",
      publisher: { name: "Folio", country: "France" },
      tags: ["roman psychologique", "classique", "russe"]
    },
    {
      title: "Dune",
      author: "Frank Herbert",
      publisher: { name: "Chilton Books", country: "USA" },
      tags: ["sci-fi", "aventure", "classique"]
    },
    {
      title: "1984",
      author: "George Orwell",
      publisher: { name: "Secker & Warburg", country: "UK" }
    },
    {
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      tags: ["conte", "philosophie", "jeunesse"]
    },
    {
      title: "Anonymous Notebook",
      author: "Unknown"
    }
  ]);
  // ----------------------------------------------------------
  // TODO 4 - find all documents
  // ----------------------------------------------------------
  const all = await books.find().toArray();
for (const m of all) {
  console.log(m.title);
}
  // ----------------------------------------------------------
  // TODO 5 - findOne with dot notation
  // ----------------------------------------------------------
const one = await books.findOne({ "publisher.country": "France" });
console.log(one.title);

  // ----------------------------------------------------------
  // TODO 6 - find with a filter
  // ----------------------------------------------------------
const frenchBooks  = await books.find({ "publisher.country": "France" }).toArray();
console.log(frenchBooks.length); 
for (const b of frenchBooks) {
    console.log(b.title);
  } // ----------------------------------------------------------
  // TODO 7 - find with $exists
  // ----------------------------------------------------------
 const withTags = await books.find({ genres: { $exists: true } }).toArray();
for (const m of withTags) {
  console.log(m.title, m.tags);
}
  // Always close the connection when you are done.
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
