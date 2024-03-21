const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port if available

// Create SQLite database connection
const db = new sqlite3.Database('shopping_list.db'); // Using a persistent SQLite database file

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create table for shopping list items if not exists
db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT)');
});

// Endpoint to get all items from the list
app.get('/items', (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Endpoint to add item to the list
app.post('/addItem', (req, res) => {
    const itemName = req.body.name;

    db.run('INSERT INTO items (name) VALUES (?)', itemName, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item added successfully', id: this.lastID });
    });
});

// Endpoint to remove item from the list
app.delete('/removeItem/:id', (req, res) => {
    const itemId = req.params.id;

    db.run('DELETE FROM items WHERE id = ?', itemId, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Item removed successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
