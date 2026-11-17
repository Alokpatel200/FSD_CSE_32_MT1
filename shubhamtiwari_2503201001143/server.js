const express = require('express');

const app = express();
const PORT = 3000;

// ---------- Middleware ----------
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.originalUrl}`);
  next();
});

// ---------- In-memory data ----------
let students = [
  { id: 201, rollNumber: 'CSE2401', name: 'Aarav Sharma', branch: 'CSE', semester: 3, email: 'aarav@example.com' },
  { id: 202, rollNumber: 'ECE2402', name: 'Diya Verma', branch: 'ECE', semester: 3, email: 'diya@example.com' },
  { id: 203, rollNumber: 'CSE2403', name: 'Kabir Singh', branch: 'CSE', semester: 3, email: 'kabir@example.com' },
];

let nextId = 204; // application-generated unique id

// ---------- Helpers ----------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

// Returns an array of error messages (empty array = valid)
function validateStudent(body, ignoreId = null) {
  const errors = [];

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return ['Request body must be a JSON object'];
  }

  const { rollNumber, name, branch, semester, email } = body;

  if (!isNonEmptyString(rollNumber)) errors.push('rollNumber is required and must be a non-empty string');
  if (!isNonEmptyString(name)) errors.push('name is required and must be a non-empty string');
  if (!isNonEmptyString(branch)) errors.push('branch is required and must be a non-empty string');

  if (typeof semester !== 'number' || !Number.isInteger(semester) || semester < 1 || semester > 8) {
    errors.push('semester is required and must be an integer between 1 and 8');
  }

  if (!isNonEmptyString(email) || !EMAIL_REGEX.test(email.trim())) {
    errors.push('email is required and must be a valid email address');
  }

  // rollNumber must be unique
  if (isNonEmptyString(rollNumber)) {
    const duplicate = students.find(
      (s) => s.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase() && s.id !== ignoreId
    );
    if (duplicate) errors.push(`rollNumber '${rollNumber.trim()}' already exists`);
  }

  return errors;
}

function sanitize(body) {
  return {
    rollNumber: body.rollNumber.trim(),
    name: body.name.trim(),
    branch: body.branch.trim(),
    semester: body.semester,
    email: body.email.trim(),
  };
}

function findIndexById(idParam) {
  const id = Number(idParam);
  if (!Number.isInteger(id)) return -1;
  return students.findIndex((s) => s.id === id);
}

// ---------- Routes ----------

// 1. GET all students
app.get('/api/students', (req, res) => {
  res.status(200).json(students);
});

// 6. Filter by branch (must be declared BEFORE /api/students/:id)
app.get('/api/students/filter', (req, res) => {
  const { branch } = req.query;

  if (!isNonEmptyString(branch)) {
    return res.status(400).json({ error: 'Query parameter "branch" is required, e.g. /api/students/filter?branch=CSE' });
  }

  const result = students.filter((s) => s.branch.toLowerCase() === branch.trim().toLowerCase());
  res.status(200).json(result); // empty array if nothing matches
});

// 2. POST a new student
app.post('/api/students', (req, res) => {
  const errors = validateStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const student = { id: nextId++, ...sanitize(req.body) };
  students.push(student);
  res.status(201).json(student);
});

// 3. GET student by id
app.get('/api/students/:id', (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} not found` });
  }
  res.status(200).json(students[index]);
});

// 4. PUT (update) a student
app.put('/api/students/:id', (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} not found` });
  }

  const errors = validateStudent(req.body, students[index].id);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  // id stays unchanged; other fields are replaced
  students[index] = { id: students[index].id, ...sanitize(req.body) };
  res.status(200).json(students[index]);
});

// 5. DELETE a student
app.delete('/api/students/:id', (req, res) => {
  const index = findIndexById(req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: `Student with id ${req.params.id} not found` });
  }

  const [removed] = students.splice(index, 1);
  res.status(200).json({ message: 'Student deleted successfully', student: removed });
});

// ---------- Error handling ----------

// Unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Malformed JSON and other errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Student Record Management API running on http://localhost:${PORT}`);
});