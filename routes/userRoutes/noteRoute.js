const express = require('express');

const router = express.Router();

const NoteController = require('../../controllers/user/NoteController');

const NoteValidation = require('../../validation/NoteValidation');

router.get('/', NoteController.index);

router.get('/:id', NoteController.view);

router.post('/', NoteValidation.createNote, NoteController.create);

module.exports = router;