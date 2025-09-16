import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js'

dotenv.config();
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
const port =process.env.PORT || 5000;
app.use('/contacts',contactRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB Connected");
    app.listen(port,()=>console.log("Server running on port 5000"));
})
.catch((err)=>{
    console.log(err);
})