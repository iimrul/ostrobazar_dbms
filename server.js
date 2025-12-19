const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files (images) from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- DATABASE CONFIGURATION (XAMPP) ---
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ostro_bazar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Connection Check
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ DATABASE CONNECTION FAILED:', err.code);
    } else {
        console.log('✅ CONNECTED TO MYSQL (XAMPP)');
        connection.release();
    }
});

// --- FILE UPLOAD CONFIGURATION ---
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'img-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed!'), false);
    }
});

// --- API ROUTER ---
const apiRouter = express.Router();

// ==========================================
// NEW ROUTE: ADMIN LOGIN
// ==========================================
apiRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }

    try {
        // Query the 'admins' table
        const [rows] = await promisePool.execute(
            'SELECT * FROM admins WHERE email = ? AND password = ?', 
            [email, password]
        );

        if (rows.length > 0) {
            // Success
            res.json({ 
                success: true, 
                message: 'Login successful', 
                admin: { email: rows[0].email, role: rows[0].role } 
            });
        } else {
            // Failure
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 0. POST /api/upload
apiRouter.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const relativePath = `/public/uploads/${req.file.filename}`;
    res.json({ message: 'File uploaded successfully', filePath: relativePath });
});

// 1. GET /api/products
apiRouter.get('/products', async (req, res) => {
    try {
        const { category } = req.query;
        let query = `
            SELECT p.*, c.name AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
        `;
        
        const params = [];
        if (category && category.toLowerCase() !== 'all') {
            query += ` WHERE LOWER(c.name) = LOWER(?)`;
            params.push(category);
        }
        query += ` ORDER BY p.id ASC`;
        
        const [rows] = await promisePool.execute(query, params);
        
        const formatted = rows.map(row => ({
            ...row,
            price: parseFloat(row.price),
            original_price: row.original_price ? parseFloat(row.original_price) : null,
            rating: parseFloat(row.rating)
        }));

        res.json(formatted);
    } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 2. GET /api/products/:id
apiRouter.get('/products/:id', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name AS category
            FROM products p
            JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `;
        const [rows] = await promisePool.execute(query, [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Not found' });

        const product = {
            ...rows[0],
            price: parseFloat(rows[0].price),
            original_price: rows[0].original_price ? parseFloat(rows[0].original_price) : null,
            rating: parseFloat(rows[0].rating)
        };
        res.json(product);
    } catch (error) {
        console.error('GET ID Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 3. POST /api/products
apiRouter.post('/products', async (req, res) => {
    const { title, price, original_price, category_id, thumbnail, stock, rating, description, clearance_id } = req.body;

    if (!title || !price || !category_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO products (title, price, original_price, category_id, thumbnail, stock, rating, description, clearance_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const [result] = await promisePool.execute(query, [
            title, price, original_price || null, category_id, thumbnail || '/public/placeholder.jpg', 
            stock || 0, rating || 5.0, description || '', clearance_id || 1
        ]);

        res.status(201).json({ message: 'Created', productId: result.insertId });
    } catch (error) {
        console.error('POST Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 4. PUT /api/products/:id
apiRouter.put('/products/:id', async (req, res) => {
    const productId = req.params.id;
    const { title, price, original_price, category_id, thumbnail, stock, description, clearance_id } = req.body;

    try {
        const query = `
            UPDATE products 
            SET title = ?, price = ?, original_price = ?, category_id = ?, thumbnail = ?, stock = ?, description = ?, clearance_id = ?
            WHERE id = ?
        `;
        
        const [result] = await promisePool.execute(query, [
            title, price, original_price || null, category_id, thumbnail, 
            stock, description || '', clearance_id || 1, productId
        ]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Updated' });
    } catch (error) {
        console.error('PUT Error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 5. PUT Stock Only
apiRouter.put('/products/:id/stock', async (req, res) => {
    const { quantity } = req.body;
    if (quantity === undefined) return res.status(400).json({ error: 'Quantity required' });

    try {
        await promisePool.execute('UPDATE products SET stock = ? WHERE id = ?', [quantity, req.params.id]);
        res.json({ message: 'Stock updated' });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// 6. DELETE Product
apiRouter.delete('/products/:id', async (req, res) => {
    try {
        const [result] = await promisePool.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (error) {
        console.error('DELETE Error:', error);
        res.status(500).json({ error: 'Delete failed. Item might be in use.' });
    }
});

// 7. GET Categories
apiRouter.get('/categories', async (req, res) => {
    const [rows] = await promisePool.execute('SELECT * FROM categories');
    res.json(rows);
});

app.use('/api', apiRouter);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on http://127.0.0.1:${PORT}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, 'public')}`);
});