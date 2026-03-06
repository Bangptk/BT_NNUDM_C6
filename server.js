const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // Để đọc dữ liệu JSON từ request body

// 1. KẾT NỐI DATABASE (Thay đổi URL nếu dùng MongoDB Atlas)
mongoose.connect('mongodb://localhost:27017/AssignmentDB')
    .then(() => console.log("✅ Đã kết nối MongoDB"))
    .catch(err => console.error("❌ Lỗi kết nối:", err));

// 2. ĐỊNH NGHĨA SCHEMAS
const RoleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String, default: "" }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: "https://i.sstatic.net/l60Hf.png" },
    status: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    loginCount: { type: Number, default: 0, min: 0 },
    isDeleted: { type: Boolean, default: false } // Phục vụ xóa mềm
}, { timestamps: true });

const Role = mongoose.model('Role', RoleSchema);
const User = mongoose.model('User', UserSchema);

// --- 3. CÁC API CHO ROLE ---

// Create Role
app.post('/roles', async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get all Roles
app.get('/roles', async (req, res) => {
    const roles = await Role.find();
    res.json(roles);
});

// --- 4. CÁC API CHO USER (CRUD + Soft Delete) ---

// Create User
app.post('/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Get all Users (Chỉ lấy user chưa bị xóa mềm)
app.get('/users', async (req, res) => {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
});

// Get User by ID
app.get('/users/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
    if (!user) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(user);
});

// Update User
app.put('/users/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
});

// Soft Delete User
app.delete('/users/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Đã xóa mềm thành công!" });
});

// --- 5. LOGIC ENABLE / DISABLE (Câu 2 & 3) ---

// POST /enable
app.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username, isDeleted: false }, 
        { status: true },
        { new: true }
    );
    if (!user) return res.status(404).json({ message: "Thông tin sai hoặc User không tồn tại" });
    res.json({ message: "Status -> TRUE", user });
});

// POST /disable
app.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username, isDeleted: false }, 
        { status: false },
        { new: true }
    );
    if (!user) return res.status(404).json({ message: "Thông tin sai hoặc User không tồn tại" });
    res.json({ message: "Status -> FALSE", user });
});

// START SERVER
app.listen(3000, () => console.log("🚀 Server chạy tại http://localhost:3000"));