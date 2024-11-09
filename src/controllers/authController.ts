

import { AuthModel, IUser } from "../models/authModel";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidationSchema, loginValidationSchema } from "../validations/authValidations";


const generateToken = (user: IUser) => {
	const data = {
		id: user._id,
        email: user.email,
        role:user.role
	};

	const token: string = jwt.sign(data, process.env.JWT_SECRET as string, {
		expiresIn: "1d",
	});

	return token;
};


export const register = async (req: Request, res: Response): Promise<Response> => {
	try {
		
		const { error } = registerValidationSchema.validate(req.body);
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const { name, email, password, phone, address } = req.body;

		const existingUser: IUser | null = await AuthModel.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with that email already exists",
			});
		}

		
		const hashedPassword: string = await bcrypt.hash(password, 10);
		const user: IUser = await AuthModel.create({
			name,
			email,
			password: hashedPassword,
			phone,
			address,
			role: "user",
		});

		const token: string = generateToken(user);

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			token,
			user,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

export const login = async (req: Request, res: Response): Promise<Response> => {
	try {
	
		const { error } = loginValidationSchema.validate(req.body);
		if (error) {
			return res.status(400).json({
				success: false,
				message: error.details[0].message,
			});
		}

		const { email, password } = req.body;

	
		const existingUser: IUser | null = await AuthModel.findOne({ email });
		if (!existingUser) {
			return res.status(400).json({
				success: false,
				message: "User with that email id does not exist",
			});
		}

		if (!existingUser.password) {
			return res.status(400).json({
				success: false,
				message: "This user is registered with Google, please use Google login",
			});
		}

		const isMatchedPassword: boolean = await bcrypt.compare(password, existingUser.password);
		if (!isMatchedPassword) {
			return res.status(400).json({
				success: false,
				message: "Invalid credentials",
			});
		}

		const token: string = generateToken(existingUser);

		return res.status(200).json({
			success: true,
			message: "User logged in successfully",
			token,
			user: existingUser,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
