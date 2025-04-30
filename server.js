const express = require('express');
const connection = require('./db'); // Import MySQL connection
// const bcrypt = require("bcrypt"); // ✅ Password hashing
const cors = require('cors');  // Enable CORS middleware

const app = express();
app.use(express.json()); // Enables JSON request handling
app.use(cors()); // Allow cross-origin requests

// ✅ Test Route
app.get('/', (req, res) => {
    res.send("Hello, World! Your Node.js server is running!");
});


app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ?";

    connection.query(sql, [username], (err, results) => {
        if (err) return res.status(500).send("Internal Server Error");
        if (results.length === 0) return res.status(401).json({ success: false });

        const user = results[0];
        if (password === user.password) {
            res.json({ success: true, userId: user.id });
        } else {
            res.status(401).json({ success: false, message: "❌ Invalid credentials" });
        }
    });
});

app.post("/teams", (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        console.log("❌ Missing team name!");
        return res.status(400).json({ success: false, message: "Team name is required!" });
    }

    const sql = "INSERT INTO teams (name, description) VALUES (?, ?)";
    connection.query(sql, [name, description], (err, result) => {
        if (err) {
            console.error("❌ Error inserting team:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        console.log("✅ Team Added to Database:", result);
        res.json({ success: true, teamId: result.insertId });
    });
});

app.get("/teams", (req, res) => {
    const sql = "SELECT * FROM teams ORDER BY created_at DESC";

    connection.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Error fetching teams:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        res.json({ success: true, teams: results }); // ✅ Ensure the response includes the teams array
    });
});


// ✅ Fetch All Users
app.get('/users', (req, res) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) {
            console.error("❌ Error fetching users:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.json(results);
    });
});

// ✅ Fetch Messages for a Specific User
app.get('/users/:username/messages', (req, res) => {
    const username = req.params.username;
    const sql = "SELECT * FROM messages WHERE username = ?";
    
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error("❌ Error fetching messages:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.json(results);
    });
});

// // ✅ Send a Message (Now Includes Username)
// app.post('/users/:username/messages', (req, res) => {
//     console.log("📥 Received message request:", req.body); // ✅ Debugging

//     const { username, message } = req.body;
//     if (!username || !message) {
//         console.log("❌ Missing fields!");
//         return res.status(400).json({ success: false, message: "Username and message required!" });
//     }

//     const sql = "INSERT INTO messages (username, message) VALUES (?, ?)";
//     connection.query(sql, [username, message], (err, result) => {
//         if (err) {
//             console.error("❌ Error inserting message:", err);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//         console.log("✅ Message stored in DB:", result);
//         res.json({ success: true, message: "Message sent!", messageId: result.insertId });
//     });
// });

app.post("/messages_teams", (req, res) => {
    console.log("📥 Checking for duplicate message storage...");

    const { username, teamname, message } = req.body;

    // ✅ Prevent duplicate entries in the database
    const sqlCheck = "SELECT COUNT(*) AS count FROM messages_teams WHERE username = ? AND teamname = ? AND message = ?";
    connection.query(sqlCheck, [username, teamname, message], (err, result) => {
        if (err) {
            console.error("❌ Error checking duplicates:", err);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }

        if (result[0].count > 0) {
            console.warn("⚠ Duplicate message detected, skipping insert.");
            return res.json({ success: false, message: "Duplicate message detected!" });
        }

        // Proceed to insert only if it's not a duplicate
        const sqlInsert = "INSERT INTO messages_teams (username, teamname, message) VALUES (?, ?, ?)";
        connection.query(sqlInsert, [username, teamname, message], (err, insertResult) => {
            if (err) {
                console.error("❌ Error inserting message:", err);
                return res.status(500).json({ success: false, message: "Internal Server Error" });
            }
            console.log("✅ Message stored in DB:", insertResult.insertId);
            res.json({ success: true, message: "Message sent!", messageId: insertResult.insertId });
        });
    });
});



// // ✅ Fetch All Messages (Now Includes Usernames)
// app.get("/messages", (req, res) => {
//     const sql = "SELECT username, message, timestamp FROM messages ORDER BY timestamp ASC";

//     connection.query(sql, (err, results) => {
//         if (err) {
//             console.error("❌ Database Error:", err);
//             return res.status(500).json({ success: false, message: "Internal Server Error" }); // ✅ Respond with valid JSON
//         }
//         res.json({ success: true, messages: results }); // ✅ Ensure response is valid JSON
//     });
// });

app.get("/messages_teams", (req, res) => {
    const sql = "SELECT username, teamname, message, created_at FROM messages_teams ORDER BY created_at ASC";

    connection.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
        console.log("✅ Retrieved Messages:", results); // ✅ Debugging step
        res.json({ success: true, messages: results });
    });
});


// ✅ Delete All Messages & Reset IDs
app.delete('/messages', (req, res) => {
    const sql = "TRUNCATE TABLE messages"; // ✅ Fully resets auto-increment ID

    connection.query(sql, (err) => {
        if (err) {
            console.error("❌ Error deleting messages:", err);
            return res.status(500).send("Internal Server Error");
        }
        res.json({ message: "✅ All messages deleted!" });
    });
});

// ✅ Start the Server
app.listen(3000, () => {
    console.log("🚀 Server is live at http://localhost:3000");
});

const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("✅ New client connected!");

    ws.on("message", (message) => {
        console.log("📩 Received:", message);

        // ✅ Ensure message is not re-sent by the client
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.sender === localStorage.getItem("currentUser")) {
                console.log("⚠ Ignoring self-sent message");
                return;
            }
        } catch (error) {
            console.error("❌ Error parsing message:", error);
        }

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log("📤 Broadcasting:", message);
                client.send(message);
            }
        });
    });

    ws.on("close", () => console.log("❌ Client disconnected"));
});

