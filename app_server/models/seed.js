
require('dotenv').config();

const mongoose = require('mongoose');
const path = require('path');

const Trip = require('./travlr');
const trips = require(path.join(__dirname, '../../data/trips.json'));

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = process.env.MONGODB_URI || `mongodb://${host}/travlr`;

async function seedDatabase() {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');

        // Validate trip data before changing the database
        for (const trip of trips) {
            await new Trip(trip).validate();
        }

        // Replace existing sample trips
        await Trip.deleteMany({});
        await Trip.insertMany(trips);

        // Retrieve and verify inserted trips
        const savedTrips = await Trip.find({}).lean();

        console.log(`Successfully seeded ${savedTrips.length} trips`);
        console.log(JSON.stringify(savedTrips, null, 2));

    } catch (error) {
        console.error('Database seeding failed:', error);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
    }
}

seedDatabase();
