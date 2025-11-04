require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const DB_FILE = path.join(__dirname, 'db', 'topup.db');
const db = new sqlite3.Database(DB_FILE);

// Init DB if needed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS topups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref TEXT,
    game TEXT,
    uid TEXT,
    phone TEXT,
    package_name TEXT,
    amount INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Create default admin/owner if not exists (passwords: admin: adminpass, owner: ownerpass)
const createDefaultUsers = async () => {
  const saltRounds = 10;
  const adminPass = process.env.ADMIN_PASS || 'adminpass';
  const ownerPass = process.env.OWNER_PASS || 'ownerpass';
  db.get("SELECT id FROM users WHERE username='admin'", (err, row) => {
    if (!row){
      bcrypt.hash(adminPass, saltRounds).then(hash => {
        db.run("INSERT INTO users (username,password,role) VALUES (?,?,?)", ['admin', hash, 'admin']);
        console.log('Default admin created: admin / (use env ADMIN_PASS to change)');
      });
    }
  });
  db.get("SELECT id FROM users WHERE username='owner'", (err, row) => {
    if (!row){
      bcrypt.hash(ownerPass, saltRounds).then(hash => {
        db.run("INSERT INTO users (username,password,role) VALUES (?,?,?)", ['owner', hash, 'owner']);
        console.log('Default owner created: owner / (use env OWNER_PASS to change)');
      });
    }
  });
};
createDefaultUsers();

// APIs
app.post('/api/topup', (req, res) => {
  const { game, uid, phone, package_name, amount } = req.body;
  if(!game || !uid || !package_name) return res.status(400).json({error:'Missing fields'});
  const order_ref = 'ORD-' + nanoid(8).toUpperCase();
  db.run("INSERT INTO topups (order_ref, game, uid, phone, package_name, amount, status) VALUES (?,?,?,?,?,?,?)",
    [order_ref, game, uid, phone || '', package_name, amount || 0, 'pending'], function(err){
      if(err) return res.status(500).json({error:'db error'});
      res.json({ok:true, order_ref, id: this.lastID});
    });
});

app.get('/api/topups', (req, res) => {
  // simple pagination
  const limit = parseInt(req.query.limit) || 100;
  db.all("SELECT * FROM topups ORDER BY id DESC LIMIT ?", [limit], (err, rows) => {
    if(err) return res.status(500).json({error:'db error'});
    res.json(rows);
  });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({error:'Missing'});
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if(err || !user) return res.status(401).json({error:'Invalid'});
    bcrypt.compare(password, user.password).then(match => {
      if(!match) return res.status(401).json({error:'Invalid'});
      // return a simple session token (not production safe)
      const token = nanoid(24);
      // In-memory session store (not persistent)
      sessions[token] = { userId: user.id, username: user.username, role: user.role };
      res.json({ok:true, token, role: user.role});
    });
  });
});

const sessions = {};

// middleware
function auth(req,res,next){
  const token = req.headers['x-auth-token'] || req.query.token;
  if(!token || !sessions[token]) return res.status(401).json({error:'Unauthorized'});
  req.user = sessions[token];
  next();
}

app.post('/api/topups/:id/complete', auth, (req,res) => {
  const id = req.params.id;
  db.run("UPDATE topups SET status='completed' WHERE id = ?", [id], function(err){
    if(err) return res.status(500).json({error:'db error'});
    res.json({ok:true});
  });
});

app.post('/api/topups/:id/cancel', auth, (req,res) => {
  const id = req.params.id;
  db.run("UPDATE topups SET status='cancelled' WHERE id = ?", [id], function(err){
    if(err) return res.status(500).json({error:'db error'});
    res.json({ok:true});
  });
});

// Serve index as fallback
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public','index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
