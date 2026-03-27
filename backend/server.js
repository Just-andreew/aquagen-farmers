const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to read JSON data sent from the frontend

// --- REST API ENDPOINTS ---

// The "Hero" Onboarding Endpoint
app.post('/api/onboard', (req, res) => {
    const { phoneNumber, name, tankCount } = req.body;
    
    console.log(`New Farmer Onboarded: ${name}, Tanks: ${tankCount}`);
    
    // In the future, we will save this to a central database for credit scoring.
    // For now, we just send a success response back to the PWA.
    res.json({ 
        success: true, 
        message: "Welcome to Aquagen Farm OS!",
        projectedFamiliesFed: tankCount * 50 // Simple placeholder math 
    });
});

app.get('/', (req, res) => {
    res.send('Aquagen Farm OS Backend is running perfectly!');
});

// --- MQTT IOT INGESTION ---

// Connecting to a public test broker for local development
const mqttClient = mqtt.connect('mqtt://test.mosquitto.org');

mqttClient.on('connect', () => {
    console.log('Connected to MQTT Test Broker');
    
    // Subscribe to a specific topic for our RAS Box
    const telemetryTopic = 'aquagen/machakos/farm001/telemetry';
    mqttClient.subscribe(telemetryTopic, (err) => {
        if (!err) {
            console.log(`Listening for ESP32 sensor data on: ${telemetryTopic}`);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    // When the ESP32 sends a message, it arrives here
    console.log(`[${topic}] Sensor Data: ${message.toString()}`);
    
    // Later, we will use WebSockets to push this data instantly to the React frontend
});

// Start the backend server
app.listen(PORT, () => {
    console.log(`Aquagen Backend running on http://localhost:${PORT}`);
});
