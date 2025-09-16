import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use('/contacts', contactRoutes);

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  })
  .catch(err => console.error("❌ MongoDB Error:", err));
