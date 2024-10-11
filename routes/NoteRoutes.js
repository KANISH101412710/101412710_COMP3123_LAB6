const express = require('express');
const noteModel = require('../models/NotesModel'); 
const router = express.Router();

// Create a new Note
router.post('/notes', (req, res) => {
    const note = new noteModel({
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority
    });

    note.save()
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the note."
            });
        });
});

// Retrieve all Notes
router.get('/notes', (req, res) => {
    noteModel.find()
        .then(notes => {
            res.send(notes);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
});

// Retrieve a single Note with noteId
router.get('/notes/:noteId', (req, res) => {
    noteModel.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        })
        .catch(err => {
            return res.status(500).send({
                message: err.message || "Error retrieving note with id " + req.params.noteId
            });
        });
});

// Update a Note with noteId
router.put('/notes/:noteId', (req, res) => {
    noteModel.findByIdAndUpdate(req.params.noteId, {
        noteTitle: req.body.noteTitle,
        noteDescription: req.body.noteDescription,
        priority: req.body.priority,
        dateUpdated: Date.now()
    }, { new: true })
    .then(note => {
        if (!note) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(note);
    })
    .catch(err => {
        return res.status(500).send({
            message: err.message || "Error updating note with id " + req.params.noteId
        });
    });
});

// Delete a Note with noteId
router.delete('/notes/:noteId', (req, res) => {
    if (!req.params.noteId) {
        return res.status(400).send({
            message: "Note ID cannot be empty."
        });
    }

    noteModel.findByIdAndDelete(req.params.noteId) 
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            return res.status(500).send({
                message: "Could not delete note with id " + req.params.noteId
            });
        });
});


module.exports = router;