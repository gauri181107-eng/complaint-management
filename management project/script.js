const API_URL = "http://localhost:3000/complaints";
let complaints = [];

const form = document.getElementById("complaintForm");
const complaintsContainer = document.getElementById("complaintsContainer");
const searchInput = document.getElementById("searchInput");

// Load complaints
async function loadComplaints() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not load complaints");
    complaints = await response.json();
    displayComplaints(complaints);
  } catch (error) {
    complaintsContainer.innerHTML = `<p class="error-message">Cannot connect to the server. Please start api.js.</p>`;
  }
}

// Display complaints
function displayComplaints(data) {
  complaintsContainer.innerHTML = "";
  if (data.length === 0) {
    complaintsContainer.innerHTML = `<p>No complaints submitted yet.</p>`;
    return;
  }

  data.forEach(complaint => {
    const card = document.createElement("div");
    card.className = "complaint-card";
    card.innerHTML = `
      <h3>Complaint #${complaint.id}</h3>
      <p><strong>Resident:</strong> ${complaint.residentName}</p>
      <p><strong>Room:</strong> ${complaint.roomNumber}</p>
      <p><strong>Contact:</strong> ${complaint.contact}</p>
      <p><strong>Category:</strong> ${complaint.category}</p>
      <p><strong>Description:</strong> ${complaint.description}</p>
      <p><strong>Priority:</strong> ${complaint.priority}</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Date:</strong> ${complaint.date}</p>
      <p><strong>Additional Info:</strong> ${complaint.additionalInfo || "None"}</p>
      <button type="button" onclick="editComplaint(${complaint.id})">Edit</button>
      <button type="button" onclick="deleteComplaint(${complaint.id})">Delete</button>
    `;
    complaintsContainer.appendChild(card);
  });
}

// Submit complaint
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const residentName = document.getElementById("residentName").value.trim();
  const roomNumber = document.getElementById("roomNumber").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  const priority = document.getElementById("priority").value.trim();
  const additionalInfo = document.getElementById("additionalInfo").value.trim();

  if (!residentName || !roomNumber || !/^[0-9]{10}$/.test(contact) || !category || !description || !priority) {
    alert("Please fill all required fields correctly");
    return;
  }

  const complaint = { residentName, roomNumber, contact, category, description, priority, additionalInfo };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(complaint)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to submit complaint");
    alert("Complaint submitted successfully!");
    form.reset();
    await loadComplaints();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

// Edit complaint
async function editComplaint(id) {
  const complaint = complaints.find(item => item.id === id);
  if (!complaint) return alert("Complaint not found");

  const newDescription = prompt("Enter new description:", complaint.description);
  if (newDescription === null || newDescription.trim() === "") return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newDescription.trim() })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    alert("Complaint updated successfully!");
    await loadComplaints();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Delete complaint
async function deleteComplaint(id) {
  if (!confirm("Are you sure you want to delete this complaint?")) return;
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    alert("Complaint deleted successfully!");
    await loadComplaints();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Search complaints
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const search = searchInput.value.toLowerCase().trim();
    const filtered = complaints.filter(c =>
      c.residentName.toLowerCase().includes(search) ||
      c.roomNumber.toLowerCase().includes(search) ||
      c.category.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
    displayComplaints(filtered);
  });
}

// Start app
loadComplaints();
