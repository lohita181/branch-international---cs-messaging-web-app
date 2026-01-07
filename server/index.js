// import modules
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config'
import messageRoutes from "./routes/messageRoutes.js"

// app
const app = express();
app.use(morgan("dev"));
app.use(cors({origin: true, credentials: true}));


// db
mongoose.connect(process.env.MONGO_URI, {
    USEnEWuRLpARSER: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB CONNECTED")).catch((err) => console.log("DB connection error", err))


//  middleware
app.use(express.json());


//  routes
app.use("/api/messages", messageRoutes);



// port

const port = process.env.PORT || 8080;

const server = app.listen(port, () => 
    console.log("Server is running on port: " + port)
)