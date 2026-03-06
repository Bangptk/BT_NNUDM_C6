const express = require('express');
const router = express.Router();
const Role = require('../models/Role'); // Đảm bảo bạn đã tạo file models/Role.js

// 1. GET ALL ROLES
// URL: GET http://localhost:3000/api/v1/roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET ROLE BY ID
// URL: GET http://localhost:3000/api/v1/roles/:id
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ message: "Không tìm thấy Role" });
        res.json(role);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. CREATE ROLE (Để bạn có dữ liệu test)
// URL: POST http://localhost:3000/api/v1/roles
router.post('/', async (req, res) => {
    try {
        const newRole = new Role({
            name: req.body.name,
            description: req.body.description
        });
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. UPDATE ROLE
// URL: PUT http://localhost:3000/api/v1/roles/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.json(updatedRole);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 5. DELETE ROLE (Xóa thật hoặc xóa mềm tùy bạn, ở đây tui làm xóa thật cho Role)
// URL: DELETE http://localhost:3000/api/v1/roles/:id
router.delete('/:id', async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa Role thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;