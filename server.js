
const express = require('express');

const app = express();

app.use(express.json());

let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Validation function
function validateBook(data) {
    return (
        typeof data.title === "string" && data.title.trim() !== "" &&
        typeof data.author === "string" && data.author.trim() !== "" &&
        typeof data.genre === "string" && data.genre.trim() !== "" &&
        typeof data.publishedYear === "number" &&
        Number.isInteger(data.publishedYear) &&
        typeof data.available === "boolean"
    );
}

// 1. GET all books
app.get('/api/books', (req, res) => {
    res.status(200).json(books);
});

// 2. POST a new book
app.post('/api/books', (req, res) => {
    const data = req.body;

    if (!validateBook(data)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    const newBook = {
        id: Math.max(...books.map(book => book.id), 100) + 1,
        ...data
    };

    books.push(newBook);

    res.status(201).json(newBook);
});

// 3. Filter books by author
app.get('/api/books/filter', (req, res) => {
    const author = req.query.author;

    if (!author || !author.trim()) {
        return res.status(400).json({
            message: "Author is required"
        });
    }

    const result = books.filter(book =>
        book.author.toLowerCase() === author.trim().toLowerCase()
    );

    res.status(200).json(result);
});

// 4. GET book by ID
app.get('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 5. PUT update book
app.put('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (!validateBook(req.body)) {
        return res.status(400).json({
            message: "Invalid book data"
        });
    }

    books[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(books[index]);
});

// 6. DELETE book
app.delete('/api/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
