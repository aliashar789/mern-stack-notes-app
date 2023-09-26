const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const User = require("../models/User");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ali789";

router.use(express.json());
//ROUTE 1: create a user using post "/api/auth/createuser" no login required
router.post(
	"/createuser",
	[
		body("name", "enter a valid name").isLength({ min: 3 }),
		body("email", "enter a valid email").notEmpty(),
		body("password", "password length should bi greator then 5").isLength({
			min: 5,
		}),
	],
	async (req, res) => {
		let success = false;
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({success, errors: result.array() });
		}
		try {
			const salt = bcrypt.genSaltSync(10);
			const securePass = await bcrypt.hash(req.body.password, salt);
			// create a new user
			const user = await User.create({
				name: req.body.name,
				email: req.body.email,
				password: securePass,
			});
			const data = {
				user: {
					id: user.id,
				},
			};
			var token = jwt.sign(data, JWT_SECRET);
			success = true;
			res.json({success, token });
		} catch (error) {
			console.error(error.message);
			res.status(500).send("internal server error");
		}
	}
);

//ROUTE 2: authenticate a user using post "/api/auth/login" no login required
router.post(
	"/login",
	[
		body("email", "enter a valid email").notEmpty(),
		body("password", "password cannot be blank").exists(),
	],
	async (req, res) => {
		let success = false;
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).json({success, errors: result.array() });
		}

		const { email, password } = req.body;
		try {
			let user = await User.findOne({ email });
			if (!user) {
				return res
					.status(400)
					.json({success, error: "please login with correct credentials" });
			}

			const passwordCompare = await bcrypt.compare(password, user.password);
			if (!passwordCompare) {
				return res
					.status(400)
					.json({success, error: "please login with correct credentials" });
			}

			const data = {
				user: {
					id: user.id,
				},
			};
			var token = jwt.sign(data, JWT_SECRET);
			success = true;
			res.json({success, token });
		} catch (error) {
			console.error(error.message);
			res.status(500).send("internal server error");
		}
	}
);

//ROUTE 3: get loggedin user details using post "/api/auth/getuser" login required

router.post("/getuser", fetchuser, async (req, res) => {
	try {
        userId = req.user.id;
const user = await User.findById(userId).select("-password")
res.send(user)
	} catch (error) {
		console.error(error.message);
		res.status(500).send("internal server error");
	}
});

// ROUTE 4: update logged-in user details using put "/api/auth/updateuser" login required
router.put("/updateuser", fetchuser, async (req, res) => {
	try {
		const { name, avatar } = req.body;
		const userId = req.user.id;

		// Find the user by their ID
		let user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Update the user's name, avatar
		user.name = name;
		user.avatar = avatar;

		// Save the updated user to the database
		user = await user.save();

		// Return the updated user (excluding the password)
		res.json('user updated');
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Internal server error");
	}
});

module.exports = router;
