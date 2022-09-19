const express = require('express');
const fetchUser = require('../middleware/fetchUser-middleware');
const { body, validationResult } = require('express-validator');
const Note = require('../models/note.model');
const router = express.Router();

router.get('/', fetchUser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id });

        res.status(200).json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

//2] Add notes
router.post('/', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be at least 5 characters').isLength({ min: 5 }),
], fetchUser, async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { title, description, tag } = req.body;
    try {

        const note = Note({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();

        res.status(200).json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});



//3] Update notes
router.put('/:id', [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'description must be at least 5 characters').isLength({ min: 5 }),
], fetchUser, async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, tag } = req.body;
    const id = req.params.id;
    try {


        // Create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { 
            return res.status(404).send("Not Found") 
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});


// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/". Login required
router.delete('/:id', fetchUser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;