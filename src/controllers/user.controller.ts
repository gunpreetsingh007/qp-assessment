import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../database/connection';

export class UserController {

    static registerUser = async (req: express.Request, res: express.Response) => {
        try {
            const existingUser = await db.dbInterface.models.User.findOne({ where: { username: req.body.username } });
            if (existingUser) {
                return res.status(400).send({ message: 'User already exists' });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.dbInterface.models.User.create({
                username: req.body.username,
                password: hashedPassword,
                role: 'user'
            });
            return res.status(200).send({ message: 'User registered successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error registering user' });
        }
    }

    static registerAdmin = async (req: express.Request, res: express.Response) => {
        try {
            const existingAdmin = await db.dbInterface.models.User.findOne({ where: { username: req.body.username } });
            if (existingAdmin) {
                return res.status(400).send({ message: 'Admin already exists' });
            }
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.dbInterface.models.User.create({
                username: req.body.username,
                password: hashedPassword,
                role: 'admin'
            });
            return res.status(200).send({ message: 'Admin registered successfully' });
        } catch (error) {
            return res.status(500).send({ message: 'Error registering admin' });
        }
    }

    static login = async (req: express.Request, res: express.Response) => {
        try {
            const user = await db.dbInterface.models.User.findOne({ where: { username: req.body.username } });
            if (user && await bcrypt.compare(req.body.password, user.password)) {
                const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET as string);
                return res.status(200).send({ message: 'User logged in successfully', token });
            } else {
                return res.status(401).send({ message: 'Invalid username or password' });
            }
        } catch (error) {
            return res.status(500).send({ message: 'Error logging in' });
        }
    }
}