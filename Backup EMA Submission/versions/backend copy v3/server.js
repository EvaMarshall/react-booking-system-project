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



// // GET request to fetch availability between two dates, filtered by cottage name
// app.get("/availability", (req, res) => {
//     // Extract query parameters from the URL
//     const { start_date, end_date, cottage_name } = req.query;

//     // SQL query to retrieve available dates along with cottage details
//     const sql = `
//         SELECT 
//             DATE_FORMAT(a.pk_available_date, '%Y-%m-%d') AS available_date,  -- Format date to standard string to avoid timezone drift
//             a.fk_cottage_name,           -- Cottage name associated with the availability entry
//             c.location,                  -- Cottage location (from joined table)
//             c.capacity,                  -- Maximum guest capacity
//             a.price,                     -- Nightly price for the date
//             a.is_available               -- Flag indicating if date is bookable
//         FROM availability a
//         JOIN cottage c 
//             ON a.fk_cottage_name = c.pk_cottage_name  -- Join to include cottage details
//         WHERE a.pk_available_date BETWEEN ? AND ?     -- Filter dates based on range
//           AND a.is_available = TRUE                   -- Only return dates that are available
//           ${cottage_name ? "AND a.fk_cottage_name = ?" : ""} -- Apply cottage filter if provided
//         ORDER BY a.pk_available_date ASC, a.fk_cottage_name ASC  -- Sort results by date then cottage
//     `;

//     // Prepare parameters for the query, including cottage filter if present
//     const params = cottage_name
//         ? [start_date, end_date, cottage_name]
//         : [start_date, end_date];

//     // Execute database query and return response
//     db.query(sql, params, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });  // Handle SQL errors
//         res.json(results);  // Return results as JSON to the client
//     });
// });

// //POST a new guest into the db. validate to reinforce frontend validation and use prepared statements for input fields. 
// app.post('/guest', (req, res) => {
//     // 1. Extract input fields from request body
//     const { name, email, phone_number, address, isAdmin } = req.body;

    // // 2. Basic validation — make sure all required fields are present
    // if (!name || !email || !phone_number || !address || isAdmin === undefined) {
    //     return res.status(400).json({ error: 'Missing required guest fields' });
    // }

    // // 3. Optional: backend sanity checks to reinforce frontend validation
    // const isValidEmail = /^[^\s]+@[^\s]+$/.test(email);
    // const isValidPhone = /^\+?\d{10,15}$/.test(phone_number);
    // const isValidName = /^[a-zA-Z\s'-]{2,50}$/.test(name);
    // const isValidAddress = /^[a-zA-Z0-9\s,'-]{5,100}$/.test(address.trim());

    // if (!isValidEmail || !isValidPhone || !isValidName || !isValidAddress) {
    //     return res.status(422).json({ error: 'One or more fields failed validation.' });
    // }

//     // 4. Prepared statement — protects against SQL injection
//     const sql = `
//         INSERT INTO guest (name, email, phone_number, address, isAdmin)
//         VALUES (?, ?, ?, ?, ?)
//     `;
//     const params = [name.trim(), email.trim(), phone_number.trim(), address.trim(), isAdmin];

//     // 5. Execute query safely
//     db.query(sql, params, (err, result) => {
//         if (err) return res.status(500).json({ error: err.message });

//         // 6. Return success response with new guest ID
//         return res.status(201).json({
//             message: 'Guest created successfully',
//             guestId: result.insertId
//         });
//     });
// });

/* //update exisiting guest and validate user input. 
app.put('/guest/:id', (req, res) => {
    const guestId = req.params.id;
    const { name, email, phone_number, address, isAdmin } = req.body;

    // Required fields check
    if (!name || !email || !phone_number || !address || isAdmin === undefined) {
        return res.status(400).json({ error: 'Missing required guest fields.' });
    }

    // Regex format checks (mirrors frontend & POST flow)
    const isValidName = /^[a-zA-Z\s'-]{2,50}$/.test(name.trim());
    const isValidEmail = /^[^\s]+@[^\s]+$/.test(email.trim());
    const isValidPhone = /^\+?\d{10,15}$/.test(phone_number.trim());
    const isValidAddress = /^[a-zA-Z0-9\s,'-]{5,100}$/.test(address.trim());

    if (!isValidName || !isValidEmail || !isValidPhone || !isValidAddress) {
        return res.status(422).json({ error: 'One or more fields failed format validation.' });
    }

    // Lookup existing guest
    const lookupSql = 'SELECT * FROM guest WHERE pk_guest_id = ?';
    db.query(lookupSql, [guestId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Guest not found. Cannot update.' });
        }

        // Safe, trimmed update using prepared statement
        const updateSql = `
            UPDATE guest
            SET name = ?, email = ?, phone_number = ?, address = ?, isAdmin = ?
            WHERE pk_guest_id = ?
        `;
        const params = [
            name.trim(),
            email.trim(),
            phone_number.trim(),
            address.trim(),
            isAdmin,
            guestId
        ];

        db.query(updateSql, params, (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            return res.status(200).json({ message: 'Guest details updated successfully.' });
        });
    });
}); */

// app.get('/booking/details', (req, res) => {
//     const { cottage_id, guest_id } = req.query;

//     let sql = `
//         SELECT 
//             b.pk_booking_id AS booking_id,
//             DATE_FORMAT(b.check_in_date, '%Y-%m-%d') AS check_in_date,
//             DATE_FORMAT(b.check_out_date, '%Y-%m-%d') AS check_out_date,
//             b.total_price,
//             b.status,
//             b.guest_count,
//             b.special_requests,
//             g.pk_guest_id AS guest_id,
//             g.name AS guest_name,
//             g.email,
//             g.phone_number,
//             g.address,
//             c.pk_cottage_name AS cottage_id,
//             c.location,
//             c.capacity 
//         FROM booking b
//         JOIN guest g ON b.fk_guest_id = g.pk_guest_id
//         JOIN cottage c ON b.fk_cottage_name = c.pk_cottage_name
//     `;

//     const filters = [];
//     const params = [];

//     if (cottage_id) {
//         filters.push('c.pk_cottage_name = ?');
//         params.push(cottage_id);
//     }

//     if (guest_id) {
//         filters.push('g.pk_guest_id = ?');
//         params.push(guest_id);
//     }

//     if (filters.length > 0) {
//         sql += ' WHERE ' + filters.join(' AND ');
//     }

//     sql += ' ORDER BY b.check_in_date ASC';

//     db.query(sql, params, (err, results) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.status(200).json(results);
//     });
// });

app.post('/booking', (req, res) => {
    const {
        guest_id,
        cottage_id,
        check_in_date,
        check_out_date,
        total_price,
        status,
        guest_count,
        special_requests
    } = req.body;

    // Basic validations
    if (!Number.isInteger(guest_count) || guest_count < 1) {
        return res.status(400).json({ error: 'Invalid guest count.' });
    }

    if (special_requests && special_requests.length > 250) {
        return res.status(400).json({ error: 'Special requests too long.' });
    }

    // 🛑 Check for booking conflicts before proceeding
    const conflictSql = `
        SELECT * FROM booking
        WHERE fk_cottage_name = ?
          AND NOT (
            check_out_date <= ? OR
            check_in_date >= ?
          )
    `;

    db.query(conflictSql, [cottage_id, check_in_date, check_out_date], (conflictErr, conflicts) => {
        if (conflictErr) return res.status(500).json({ error: conflictErr.message });

        if (conflicts.length > 0) {
            return res.status(409).json({ error: 'Booking conflict detected. Cottage already booked for these dates.' });
        }

        // ✅ Safe to proceed — no conflicts found
        const bookingSql = `
            INSERT INTO booking (
                fk_guest_id, fk_cottage_name, check_in_date, check_out_date,
                total_price, status, guest_count, special_requests
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            guest_id,
            cottage_id,
            check_in_date,
            check_out_date,
            total_price,
            status,
            guest_count,
            special_requests || null
        ];

        db.query(bookingSql, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const bookingId = result.insertId;

            const blockDatesSql = `
                UPDATE availability
                SET is_available = FALSE
                WHERE fk_cottage_name = ?
                  AND pk_available_date >= ?
                  AND pk_available_date < ?
            `;
            db.query(blockDatesSql, [cottage_id, check_in_date, check_out_date], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });

                return res.status(201).json({
                    message: 'Booking confirmed and dates blocked.',
                    booking_id: bookingId,
                    blocked_dates: { cottage_id, from: check_in_date, to: check_out_date }
                });
            });
        });
    });
});



//  Server Start (Keep this at the end)
app.listen(5001, () => {
    console.log("Server running on port 5001");
});
