// src/database.js
import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

// 1. Define the Schema for our Logs
// This enforces strict rules on what data can be saved.
const logSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 100 },
        actionType: { type: 'string' }, // e.g., 'FEED', 'WATER_CHECK'
        amount: { type: 'number' },     // e.g., 5 (kg)
        timestamp: { type: 'string' },  // When it happened
        isSynced: { type: 'boolean' }   // Has it been sent to Node.js yet?
    },
    required: ['id', 'actionType', 'amount', 'timestamp', 'isSynced']
};

// 2. Function to Initialize the Database
let dbPromise = null;

export const getDatabase = async () => {
    // If the database is already running, just return it
    if (dbPromise) return dbPromise;

    // Otherwise, create it
    const createDB = async () => {
        console.log("Initializing RxDB...");
        const db = await createRxDatabase({
            name: 'aquagen_farm_db', 
            storage: getRxStorageDexie() // Uses the browser's local storage
        });

        // Add our Log collection to the database
        await db.addCollections({
            logs: {
                schema: logSchema
            }
        });

        console.log("Database initialized successfully!");
        return db;
    };

    dbPromise = createDB();
    return dbPromise;
};