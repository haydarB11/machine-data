const express = require('express');

const router = express.Router();

const NoteController = require('../../controllers/manager/NoteController');

const ManagerNoteValidation = require('../../validation/ManagerNoteValidation');

router.get('/', NoteController.index);

router.get('/:id', NoteController.view);

router.post('/', ManagerNoteValidation.createNote, NoteController.create);

router.put('/:id', ManagerNoteValidation.updateNote, NoteController.update);

router.delete('/:id', NoteController.delete);

module.exports = router;