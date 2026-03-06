const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users (Chỉ lấy người chưa bị xóa mềm)
router.get('/', async (req, res) => {
    const users = await User.find({ isDeleted: false }).populate('role');
    res.json(users);
});

// GET user by ID
router.get('/:id', async (req, res) => {
    const user = await User.findOne({ _id: req.params.id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(user);
});

// POST Create User
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DELETE (Xóa mềm)
router.delete('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Đã xóa mềm thành công" });
});

// POST /enable
router.post('/enable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username, isDeleted: false }, 
        { status: true }, { new: true }
    );
    if (!user) return res.status(404).json({ message: "Thông tin không khớp" });
    res.json({ message: "Đã kích hoạt", user });
});

// POST /disable
router.post('/disable', async (req, res) => {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
        { email, username, isDeleted: false }, 
        { status: false }, { new: true }
    );
    if (!user) return res.status(404).json({ message: "Thông tin không khớp" });
    res.json({ message: "Đã vô hiệu hóa", user });
});

module.exports = router;