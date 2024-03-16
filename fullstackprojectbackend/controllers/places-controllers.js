import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import { validationResult } from 'express-validator';
import Place from '../models/place.js';
import User from '../models/user.js';
import mongoose from "mongoose";

export const getPlaceById=async(req, res, next) => {
    const placeId = req.params.pid; // { pid: 'p1' }
    let place;
    try{
      place =await  Place.findById(placeId);
    }  
    catch(err){
        console.error("Error getting place by id:", err);
        return res.status(500).send("Error getting place by id");
    } 
    if(!place){
        return res.status(404).json({ message: 'Could not find a place for the provided id.' });
    
    }
    return res.json({ place:place.toObject({getters:true})}); // => { place } => { place: place }
}

export const getPlacesByUserId=async(req, res, next) => {
    const userId = req.params.uid;
    let places;
    try{
        places=await Place.find({creator:userId});
    }
    catch(err){
        console.error("Error getting places by user id:", err);
        return res.status(500).send(err);
    }
    if(!places || places.length === 0){
        return res.status(404).json({ message: 'Could not find places for the provided user id.' });
    }
    return res.json({
      places: places.map((place) => place.toObject({ getters: true })),
    });
    
}

export const createPlace=async(req, res, next) => {
    const errors = validationResult(req);
    if (!req.file) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
      return res.status(422).json({ message: "Image not found" });
    }
    if (!errors.isEmpty()) {
         
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const { title, description, coordinates, address, creator } = req.body;
     // const title = req.body.title;
    const createdPlace = new Place({
      id: uuidv4(),
      title,
      description,
      address,
      location: {
        lat: 28.5534671,
        lng: 77.1764258
      },
      image:req.file.path,
        
      creator,
    });
    let user;
    console.log(user);
    try{
        user=await User.findById(creator);
    }
    catch(err){
         if (!req.file) {
           fs.unlink(req.file.path, (err) => {
             console.log(err);
           });
           return res.status(422).json({ message: "Image not found" });
         }
        console.error("Error getting user by id:", err);
        return res.status(500).send("Error getting user by id");
    }
    console.log(user,"place-controller");
    if(!user){
        return res.status(404).json({ message: 'Could not find user for provided id' });
    }
    
    try{
        const sess = await mongoose.startSession(); // start a session to make sure that all operations are done or none of them are done
        sess.startTransaction(); // start a transaction to make sure that all operations are done or none of them are done 
        await createdPlace.save({ session: sess }); // auto add place to user also id creation of place is done
        user.places.push(createdPlace); // push() is a mongoose method to add an object id to an array also add the place id only
        await user.save({ session: sess }); // save the user with the place id
        await sess.commitTransaction(); // commit the transaction
        
    }

    catch(err){
         if (!req.file) {
           fs.unlink(req.file.path, (err) => {
             console.log(err);
           });
           return res.status(422).json({ message: "Image not found" });
         }
        return res.status(500).send(err);
    }

     // unshift(createdPlace) to add to the beginning of the array
     return res
       .status(201)
       .json({ place: createdPlace });
    
}

export const updatePlace=async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }
    const placeId = req.params.pid;
    const { title, description } = req.body;
    
    let updatePlace;
    try{
        updatePlace=await Place.findById(placeId);
    }
    catch(err){
        console.error("Error getting place by id:", err);
        return res.status(500).send("Error getting place by id");
    }
    updatePlace.title = title;
    updatePlace.description = description;
    try{
        await updatePlace.save();
    }
    catch(err){
        console.error("Error updating place:", err);
        return res.status(500).send("Error updating place");
    }
   res.status(200).json({ place: updatePlace.toObject({ getters: true }) });

}

export const deletePlace=async(req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try{
        place=await Place.findById(placeId).populate('creator');
        
    }
    catch(err){
        console.error("Error getting place by id:", err);   
        return res.status(500).send("Error getting place by id");
    }
    if(!place){
        return res.status(404).json({ message: 'Could not find place for this id.' });
    }
    console.log(place);
    const imagePath = place.image;
    
    try{
        const sess = await mongoose.startSession(); // start a session to make sure that all operations are done or none of them are done
        sess.startTransaction(); // start a transaction to make sure that all operations are done or none of them are done
        await place.deleteOne({ session: sess});
        place.creator.places.pull(place); // remove the place id from the user
        await place.creator.save({ session: sess }); // save the user without the place id
        await sess.commitTransaction(); // commit the transaction
    }catch(err){
        console.error("Error deleting place:", err);
        return res.status(500).send("Error deleting place");
    }
    fs.unlink(imagePath, (err) => {
        console.log(err);
    });
    return res.status(200).json({ message: 'Deleted place.' });
}