const Contact = require('../models/contacts');

// Create a new ticket
const sendTicket = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Please fill all the fields" });
    }

    const contact = await Contact.create({ name, email, message });

    return res.status(201).json({ success: true, message: "Contact created successfully", contact });
  } catch (error) {
    console.error('Send Ticket Error:', error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get all tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Contact.find();
    return res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error('Get All Tickets Error:', error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get a single ticket by ID
const getTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Contact.findById(id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    return res.status(200).json({ success: true, ticket });
  } catch (error) {
    console.error('Get Ticket Error:', error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Delete a ticket by ID
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Contact.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    return res.status(200).json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error('Delete Ticket Error:', error.message);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

module.exports = {
  sendTicket,
  getAllTickets,
  getTicket,
  deleteTicket
};
