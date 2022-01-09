require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./src/middlewares/error.middleware');
const routes = require('./src/routes/');
const db = require('./src/db/connection');

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api', routes);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

try {
    db.sequelize.authenticate();
    db.sequelize.sync({ alter: true });
    console.log('Connection has been established successfully.');
} catch (e) {
    console.log(e);
}
