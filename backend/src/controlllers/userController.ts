import { Request, Response } from 'express';
import { getAllUsersFromDB, getUserByIdFromDB, createUser } from '../models/userModel';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsersFromDB();
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ error: "Error fetching users" });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = Number(req.params.id);
    try {
        const user = await getUserByIdFromDB(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

export const createUserController = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, birth_date } = req.body;

    if (!name || !email || !password || !birth_date) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const newUser = await createUser(name, email, password, birth_date);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' + error });
    }
};
