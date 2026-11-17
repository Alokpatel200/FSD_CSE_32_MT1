
const express = require('express');
const { dir } = require('node:console');

const app = express();

app.use(express.json());

// Initial student records
let students = [
    {
        id: 201,
        rollNumber: "CSE2401",
        name: "Aarav Sharma",
        branch: "CSE",
        semester: 3,
        email: "aarav@example.com"
    },
    {
        id: 202,
        rollNumber: "ECE2402",
        name: "Diya Verma",
        branch: "ECE",
        semester: 3,
        email: "diya@example.com"
    },
    {
        id: 203,
        rollNumber: "CSE2403",
        name: "Kabir Singh",
        branch: "CSE",
        semester: 3,
        email: "kabir@example.com"
    }
];

// Generate unique ID
let nextId = 204;

// 1. GET all students
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// 2. FILTER students by branch
app.get('/api/students/filter', (req, res) => {
    const branch = req.query.branch;

    if (!branch || !branch.trim()) {
        return res.status(400).json({
            message: "Please provide a branch"
        });
    }

    const result = students.filter(student =>
        student.branch.toLowerCase() === branch.trim().toLowerCase()
    );

    res.status(200).json(result);
});

// 3. POST a new student
app.post('/api/students', (req, res) => {
    const { rollNumber, name, branch, semester, email } = req.body;

    if (
        typeof rollNumber !== 'string' || !rollNumber.trim() ||
        typeof name !== 'string' || !name.trim() ||
        typeof branch !== 'string' || !branch.trim() ||
        typeof semester !== 'number' || !Number.isInteger(semester) || semester <= 0 ||
        typeof email !== 'string' || !email.trim()
    ) {
        return res.status(400).json({
            message: "Invalid student data. Please provide all required fields."
        });
    }

    const newStudent = {
        id: nextId++,
        rollNumber: rollNumber.trim(),
        name: name.trim(),
        branch: branch.trim(),
        semester: semester,
        email: email.trim()
    };

    students.push(newStudent);

    res.status(201).json({
        message: "Student added successfully",
        student: newStudent
    });
});

// 4. GET student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    res.status(200).json(student);
});

// 5. PUT / Update student
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    const { rollNumber, name, branch, semester, email } = req.body;

    if (
        typeof rollNumber !== 'string' || !rollNumber.trim() ||
        typeof name !== 'string' || !name.trim() ||
        typeof branch !== 'string' || !branch.trim() ||
        typeof semester !== 'number' || !Number.isInteger(semester) || semester <= 0 ||
        typeof email !== 'string' || !email.trim()
    ) {
        return res.status(400).json({
            message: "Invalid student data"
        });
    }

    student.rollNumber = rollNumber.trim();
    student.name = name.trim();
    student.branch = branch.trim();
    student.semester = semester;
    student.email = email.trim();

    res.status(200).json({
        message: "Student updated successfully",
        student: student
    });
});

// 6. DELETE student
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Student not found"
        });
    }

    students.splice(index, 1);

    res.status(200).json({
        message: "Student deleted successfully"
    });
});

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});