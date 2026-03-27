const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', () => {
    console.log('Hardware Simulator Connected.');
    
    // The exact topic our backend is listening to
    const topic = 'aquagen/machakos/farm001/telemetry';
    
    // Fake sensor data payload
    const sensorData = JSON.stringify({
        pH: 7.2,
        temperature: 24.5,
        dissolvedOxygen: 6.8
    });

    // Send the message
    client.publish(topic, sensorData, () => {
        console.log(`Sent fake sensor data: ${sensorData}`);
        client.end(); // Close the simulator
    });
});