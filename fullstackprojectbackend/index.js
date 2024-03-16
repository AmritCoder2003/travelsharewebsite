import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import placesRoutes from './routes/places-route.js';
import usersRoutes from './routes/users-route.js';

const app=express();
const Port=5000;
app.use(bodyParser.json()); 
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

mongoose.connect('mongodb+srv://amritchattopadhyay456:QfTdra7Fq8efN8Kh@cluster1.vdavmwa.mongodb.net/mernDB?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('Connected to Database');
}).catch((err)=>{
    console.log('Connection failed',err);
});
app.listen(Port,()=>{
    console.log(`Server is running on port ${Port}`);
});
