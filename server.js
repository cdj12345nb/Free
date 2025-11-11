const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
app.use(express.json());

const dbFile = "backend/db.json";
let orders = [];

// โหลด DB
if(fs.existsSync(dbFile)){
    orders = JSON.parse(fs.readFileSync(dbFile));
}

// ฟังก์ชันบันทึก DB
function saveDB(){
    fs.writeFileSync(dbFile, JSON.stringify(orders, null, 2));
}

// สร้างคำสั่งเติมเกม (ลูกค้า)
app.post("/api/orders", (req, res) => {
    const { uid, game, amount } = req.body;
    const order = { id: orders.length+1, uid, game, amount, status: "pending" };
    orders.push(order);
    saveDB();
    res.json({ message: "สร้างคำสั่งสำเร็จ", order });
});

// ดึงคำสั่งทั้งหมด (Admin)
app.get("/api/orders", (req, res) => {
    res.json(orders);
});

// ยืนยันเติมเกม (Admin)
app.post("/api/orders/confirm", (req, res) => {
    const { id } = req.body;
    const order = orders.find(o => o.id === id);
    if(order){
        order.status = "completed";
        saveDB();
        res.json({ message: "เติมเกมสำเร็จ", order });
    } else {
        res.status(404).json({ message: "ไม่พบคำสั่ง" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));