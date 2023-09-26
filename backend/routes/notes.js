const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: get all notes using get "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
	try {
		const notes = await Note.find({ user: req.user.id });
		res.json(notes);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("internal server error");
	}
});

//ROUTE 2: add a new note using post "/api/notes/addnote" login required
router.post(
	"/addnote",
	fetchuser,
	[
		body("title", "enter a valid title").isLength({ min: 3 }),
		body("description", "enter a valid description").isLength({ min: 5 }),
	],
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({ errors: result.array() });
		}

		try {
			const { title, description, tag } = req.body;

			const note = new Note({
				title,
				description,
				tag,
				user: req.user.id,
			});

			const savedNote = await note.save();
			res.json(savedNote);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("internal server error");
		}
	}
);

//ROUTE 3: update a note using put "/api/notes/updatenote" login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
	const { title, description, tag } = req.body;
    try {

	// create a new note object
	const newNote = {};
	if (title) {
		newNote.title = title;
	}
	if (description) {
		newNote.description = description;
	}
	if (tag) {
		newNote.tag = tag;
	}

	// find the note to be updated and update it
	let note = await Note.findById(req.params.id);
	if (!note) {
		return res.status(404).send("not found");
	}
	// allow to update if user owns this note
	if (note.user.toString() !== req.user.id) {
		return res.status(401).send("not allowed");
	}

	note = await Note.findByIdAndUpdate(
		req.params.id,
		{ $set: newNote },
		{ new: true }
	);
	res.json({ note });

            
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
}
});

//ROUTE 4: delete a note using delete "/api/notes/deletenote" login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
try {
	// find the note to be deleted and delete it
	let note = await Note.findById(req.params.id);
	if (!note) {
		return res.status(404).send("not found");
	}
	// allow to delete if user owns this note
	if (note.user.toString() !== req.user.id) {
		return res.status(401).send("not allowed");
	}

	note = await Note.findByIdAndDelete(req.params.id);
	res.json({ success: "note has been deleted", note: note });

} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
}
});

module.exports = router;
