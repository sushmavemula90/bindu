const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
const PORT = 5200;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Paths to JSON files
const userFilePath = path.join(__dirname, 'users.json');
const accommodationFilePath = path.join(__dirname, 'accommodation.json');

// Helper functions for reading and writing JSON data
function readFile(filePath, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.log(`${path.basename(filePath)} does not exist, initializing with an empty array.`);
                return callback(null, []);
            }
            return callback(err);
        }
        const parsedData = data ? JSON.parse(data) : [];
        callback(null, parsedData);
    });
}

function writeFile(filePath, data, callback) {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error(`Error writing to ${path.basename(filePath)} file:`, err);
            return callback(err);
        }
        console.log(`${path.basename(filePath)} data successfully saved.`);
        callback(null);
    });
}

// Route for user registration
app.post('/api/register', (req, res) => {
    const { username, fullName, phone, email, password } = req.body;

    if (!username || !fullName || !phone || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    readFile(userFilePath, (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }

        if (users.some(user => user.username === username)) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const newUser = { username, fullName, phone, email, password };
        users.push(newUser);

        writeFile(userFilePath, users, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving user data' });
            }
            res.status(201).json({ message: `${username} registered successfully!` });
        });
    });
});

// Route for user login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    readFile(userFilePath, (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }

        const user = users.find(user => user.username === username && user.password === password);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        res.status(200).json({ message: 'Login successful!' });
    });
});

// Route for submitting accommodation form
app.post('/api/accommodation', (req, res) => {
    const accommodationData = req.body;
    const requiredFields = [
        'fullName', 'email', 'phone', 'address', 'location', 'place',
        'accommodationType', 'priceRange', 'checkin', 'checkout', 'persons', 
        'roomType', 'payment'
    ];

    for (const field of requiredFields) {
        if (!accommodationData[field]) {
            return res.status(400).json({ message: `Field ${field} is required` });
        }
    }

    readFile(accommodationFilePath, (err, accommodations) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading accommodation data' });
        }

        // Check if the same user already registered with the same check-in and check-out dates
        const isDuplicate = accommodations.some(
            (accom) =>
                accom.fullName === accommodationData.fullName &&
                accom.email === accommodationData.email &&
                accom.checkin === accommodationData.checkin &&
                accom.checkout === accommodationData.checkout
        );

        if (isDuplicate) {
            return res.status(400).json({ message: 'Accommodation for the same dates already exists for this user.' });
        }

        // Add new accommodation entry
        accommodations.push(accommodationData);

        writeFile(accommodationFilePath, accommodations, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving accommodation data' });
            }
            res.status(201).json({ message: 'Accommodation data saved successfully!' });
        });
    });
});


// Route to get all accommodation entries
app.get('/api/accommodations', (req, res) => {
    readFile(accommodationFilePath, (err, accommodations) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading accommodation data' });
        }
        res.status(200).json(accommodations);
    });
});

// Route to get all registered users
app.get('/api/users', (req, res) => {
    readFile(userFilePath, (err, users) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading user data' });
        }
        res.status(200).json(users);
    });
});

app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Feedback POST route
const feedbackFilePath = path.join(__dirname, 'feedback.json');

// Endpoint to submit feedback
app.post('/api/feedback', (req, res) => {
    const newFeedback = req.body;

    // Check if feedback.json exists, and create it if not
    fs.readFile(feedbackFilePath, 'utf8', (err, data) => {
        let feedbackData = [];
        if (!err && data) {
            feedbackData = JSON.parse(data);
        }

        // Append the new feedback entry
        feedbackData.push(newFeedback);

        // Write updated feedback data to feedback.json
        fs.writeFile(feedbackFilePath, JSON.stringify(feedbackData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing to feedback file:', writeErr);
                return res.status(500).json({ message: 'Failed to save feedback.' });
            }
            res.status(201).json({ message: 'Feedback submitted successfully!' });
        });
    });
});

// Endpoint to retrieve all feedback entries
app.get('/api/feedbacks', (req, res) => {
    fs.readFile(feedbackFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading feedback file:', err);
            return res.status(500).json({ message: 'Failed to load feedback data.' });
        }

        try {
            const feedbackData = JSON.parse(data);
            res.status(200).json(feedbackData);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            return res.status(500).json({ message: 'Error parsing feedback data.' });
        }
    });
});

// Path for agent registration JSON file
const agentRegFilePath = path.join(__dirname, 'agent-reg.json');

// Ensure JSON file exists
if (!fs.existsSync(agentRegFilePath)) {
    fs.writeFileSync(agentRegFilePath, JSON.stringify([]));
}

// Read and write data functions
const readAgentData = () => JSON.parse(fs.readFileSync(agentRegFilePath, 'utf-8'));
const writeAgentData = (data) => fs.writeFileSync(agentRegFilePath, JSON.stringify(data, null, 2));

// API endpoint to save agent registration data
app.post('/api/agent-register', (req, res) => {
    const { name, email, address, education, referenceName, comments, confirmation } = req.body;

    // Save data to JSON
    const agentData = { name, email, address, education, referenceName, comments, confirmation };
    const existingData = readAgentData();
    existingData.push(agentData);
    writeAgentData(existingData);

    res.status(201).json({ message: 'Agent registered successfully.' });
});

// Endpoint to retrieve all agent registration data
app.get('/api/agent-registers', (req, res) => {
    const agentData = readAgentData();
    res.json(agentData);
});

//Path for Admin login
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});