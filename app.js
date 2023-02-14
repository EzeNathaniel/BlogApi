require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const notFound = require('./middleware/notFound')
const authRouter = require('./routes/authrouter');
const journalRouter = require('./routes/jounalRouter')
const auth = require('./middleware/authen');
mongoose.set('strictQuery', true);
// app.set('view engine', 'ejs');
const cors = require("cors")

//middleware
app.use(cors());
app.use(express.json());    

app.use('/api/v1', authRouter);
app.use('/api/v1/journal', auth, journalRouter)



//error handlers
app.use(notFound)

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        app.listen(PORT, () => {
            console.log(`srver running on port ${PORT}....`);
        });
    } catch (error) {
        console.log(error)
    };
};

start();
