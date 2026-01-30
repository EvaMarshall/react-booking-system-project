require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express(); //  Initialize Express FIRST
app.use(cors()); //  Apply CORS AFTER app initialization
app.use(express.json()); //  Allow JSON request bodies

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database!");
    }
});

app.get('/db-test', (req, res) => {
    db.query("SELECT 1 + 1 AS result", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Database connection successful!", result: results[0] });
    });
});

//  Get bookings for a specific guest - uses and inner join 
//app.get('/bookings/:guestId', (req, res) => {
//   const { guestId } = req.params;
// const sql = `
//   SELECT b.pk_booking_id, g.name, g.email, b.fk_cottage_name, 
//        b.check_in_date, b.check_out_date, b.total_price, b.status 
//       FROM booking b 
//     INNER JOIN guest g ON b.fk_guest_id = g.pk_guest_id
//   WHERE g.pk_guest_id = ?
//  `;

app.get('/bookings/:guestId', (req, res) => {
    const { guestId } = req.params;
    const sql = `SELECT * FROM booking WHERE fk_guest_id = ?`;

    db.query(sql, [guestId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Create a new booking
app.post('/bookings', (req, res) => {
    const { fk_guest_id, fk_cottage_name, check_in_date, check_out_date, total_price } = req.body;
    const sql = `
        INSERT INTO booking (fk_guest_id, fk_cottage_name, check_in_date, check_out_date, total_price) 
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [fk_guest_id, fk_cottage_name, check_in_date, check_out_date, total_price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Booking created successfully", bookingId: result.insertId });
    });
});

// Cancel a booking & update availability
app.put('/bookings/:bookingId/cancel', (req, res) => {
    const { bookingId } = req.params;
    const { cottageName, checkInDate, checkOutDate } = req.body;

    const sqlCancel = `UPDATE booking SET status = 'cancelled' WHERE pk_booking_id = ?`;
    const sqlUpdateAvailability = `
        UPDATE availability SET is_available = TRUE 
        WHERE fk_cottage_name = ? AND pk_available_date BETWEEN ? AND ?
    `;

    db.query(sqlCancel, [bookingId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(sqlUpdateAvailability, [cottageName, checkInDate, checkOutDate], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Booking canceled & availability updated" });
        });
    });
});

//  Modify an existing booking
app.put('/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    const { check_in_date, check_out_date } = req.body;

    const sql = `UPDATE booking SET check_in_date = ?, check_out_date = ? WHERE pk_booking_id = ?`;

    db.query(sql, [check_in_date, check_out_date, bookingId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Booking updated successfully" });
    });
});

// ✅ Delete a booking
app.delete('/bookings/:bookingId', (req, res) => {
    const { bookingId } = req.params;

    const sql = `DELETE FROM booking WHERE pk_booking_id = ?`;

    db.query(sql, [bookingId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking ID not found" });
        }

        res.json({ message: "Booking deleted successfully" });
    });
});

//check availability 
//app.get("/availability", (req, res) => {
//  const { start_date, end_date } = req.query;
//  const sql = "SELECT pk_available_date, fk_cottage_name, price, is_available FROM availability WHERE pk_available_date BETWEEN ? AND ? AND is_available = 1";

// db.query(sql, [start_date, end_date], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });

// ✅ Keep dates exactly as retrieved, with no adjustments
//    const formattedResults = results.map(row => ({
//       ...row,
//       pk_available_date: new Date(row.pk_available_date).toISOString().slice(0, 10) // Ensure proper format without shifting dates
//   }));

//   res.json(formattedResults);
//  });
//});
app.get("/availability", (req, res) => {
    const { start_date, end_date } = req.query;
    const sql = "SELECT DATE_FORMAT(pk_available_date, '%Y-%m-%d') AS pk_available_date, fk_cottage_name, price, is_available FROM availability WHERE pk_available_date BETWEEN ? AND ? AND is_available = 1";

    db.query(sql, [start_date, end_date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json(results); // ✅ No additional processing, ensuring MySQL delivers correct data
    });
});



//  Server Start (Keep this at the end)
app.listen(5001, () => {
    console.log("Server running on port 5001");
});
