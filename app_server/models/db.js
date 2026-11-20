
require('dotenv').config();

const mongoose = require('mongoose');
const readLine = require('readline');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = process.env.MONGODB_URI || `mongodb://${host}/travlr`;

// Connect to MongoDB
const connect = () => {
    mongoose.connect(dbURI).catch(err => {
        console.error('Initial MongoDB connection error:', err.message);
    });
};

// Monitor connection events
mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to database: ${mongoose.connection.name}`);
});

mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

// Windows-specific listener
if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// Graceful shutdown
const gracefulShutdown = async (msg) => {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${msg}`);
};

// Handle application shutdown
process.once('SIGUSR2', async () => {
    await gracefulShutdown('nodemon restart');
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
    await gracefulShutdown('app termination');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await gracefulShutdown('app shutdown');
    process.exit(0);
});

// Make initial connection to MongoDB
connect();

// Import trip schema
require('./travlr');

module.exports = mongoose;
