
const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();
const PORT = 3000;

// Configure Handlebars
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'hbs');

// Register header and footer partials
hbs.registerPartials(
    path.join(__dirname, 'app_server', 'views', 'partials')
);

// Serve static files (CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Import MVC routes
const indexRouter = require('./app_server/routes/index');
const travelRouter = require('./app_server/routes/travel');

// Register routes
app.use('/', indexRouter);
app.use('/travel', travelRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Travlr Getaways running at http://localhost:${PORT}`);
});
