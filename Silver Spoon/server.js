const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3019;
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/reserve', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB connection successful");
});

const reservationSchema = new mongoose.Schema({
    name: String,
    phoneNo: String,
    noOfPerson: Number,
    date: Date,
    time: String,
    message: String
});

const Reservation = mongoose.model('Reservation', reservationSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

app.post('/', async (req, res) => {
    try {
        const newReservation = new Reservation({
            name: req.body.name,
            phoneNo: req.body.phoneNo,
            noOfPerson: req.body.noOfPerson,
            date: req.body.date,
            time: req.body.time,
            message: req.body.message
        });

        await newReservation.save();
        res.sendFile(path.join(__dirname, 'thankyou.html'));
    } catch (err) {
        res.status(500).send("Error saving reservation: " + err.message);
    }
});

app.listen(port, () => {
    console.log("Server started on port " + port);
});

