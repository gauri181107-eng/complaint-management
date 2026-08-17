const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let complaints = [];
let nextId = 1;

// GET all complaints
app.get("/complaints", (req, res) => {
  res.status(200).json(complaints);
});

// GET one complaint
app.get("/complaints/:id", (req, res) => {
  const id = Number(req.params.id);
  const complaint = complaints.find(item => item.id === id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.status(200).json(complaint);
});

// CREATE complaint
app.post("/complaints", (req, res) => {
  const { residentName, roomNumber, contact, category, description, priority, additionalInfo } = req.body;

  if (!residentName || !roomNumber || !contact || !category || !description || !priority) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const complaint = {
    id: nextId++,
    residentName,
    roomNumber,
    contact,
    category,
    description,
    date: new Date().toISOString(), // full timestamp
    priority,
    status: "Pending",
    additionalInfo: additionalInfo || ""
  };

  complaints.push(complaint);
  res.status(201).json({ message: "Complaint submitted successfully", complaint });
});

// UPDATE complaint
app.put("/complaints/:id", (req, res) => {
  const id = Number(req.params.id);
  const complaint = complaints.find(item => item.id === id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  const { description, priority, status, additionalInfo } = req.body;
  if (description !== undefined) complaint.description = description;
  if (priority !== undefined) complaint.priority = priority;
  if (status !== undefined) complaint.status = status;
  if (additionalInfo !== undefined) complaint.additionalInfo = additionalInfo;

  res.status(200).json({ message: "Complaint updated successfully", complaint });
});

// DELETE complaint
app.delete("/complaints/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = complaints.findIndex(item => item.id === id);
  if (index === -1) return res.status(404).json({ message: "Complaint not found" });

  complaints.splice(index, 1);
  res.status(200).json({ message: "Complaint deleted successfully" });
});

// START server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
