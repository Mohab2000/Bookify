import express, { Request, Response } from "express";
import { User, Users } from "../models/user";
import jwt from "jsonwebtoken";
import config from "../bcrypt";
const user = new Users();

const getAllUsers = async (req: Request, res: Response) => {
  const users = await user.index();
  try {
    jwt.verify(req.headers.authorization?.split(" ")[1], process.env.JWT!);
  } catch (err) {
    res.status(401);
    res.json({ message: "Invalid token" });
    return;
  }
  res.json(users);
};
const updateUserById = async (req: Request, res: Response) => {
  try {
    const updateUser: User = {
      ...req.body,
    };
    try {
      jwt.verify(req.headers.authorization?.split(" ")[1], process.env.JWT!);
    } catch (err) {
      res.status(401);
      res.json({ message: "Invalid token" });
      return;
    }

    const updatedUser = await user.updateUserById(updateUser, req.params.id);
    res.json(updatedUser);
  } catch (err) {
    res.json({ message: `Could not update user ${err} ` });
  }
};

const showUserById = async (req: Request, res: Response) => {
  try {
    jwt.verify(req.headers.authorization?.split(" ")[1], process.env.JWT!);
  } catch (err) {
    res.status(401);
    res.json({ message: "Invalid token" });
    return;
  }
  const userById = await user.showUserById(req.params.id);
  res.json(userById);
};

const createUser = async (req: Request, res: Response) => {
  try {
    const newUser: User = {
      ...req.body,
    };

    const createdUser = await user.createUser(newUser);
    var token = jwt.sign({ newUser: createdUser }, process.env.JWT!);
    res.json({ token: token });
  } catch (err) {
    res.json({ message: `Could not create user ${err}` });
  }
};
const deleteUserById = async (req: Request, res: Response) => {
  try {
    // Call the delete method from the model and store the result
    const deleted = await user.deleteUserById(req.params.id);

    // Check if the deletion was successful
    if (deleted) {
      res.json({
        message: `User with ID ${req.params.id} has been deleted successfully.`,
      });
    } else {
      // If the deletion wasn't successful (e.g., role not found)
      res.status(404).json({
        message: `User with ID ${req.params.id} not found.`,
      });
    }
  } catch (err) {
    // Catch any errors and return a 500 error with the message
    res.status(500).json({
      message: `Could not delete User: ${err}`,
    });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const password = req.body.password;
    const authenticatedUser = await user.authenticateUser(id, password);
    const webToken = jwt.sign(
      { authenticatedUser },
      config.jsonWebToken as unknown as string
    );
    if (!authenticatedUser) {
      res.json("Unauthenticated user");
    }
    res.json({ ...authenticatedUser, webToken });
  } catch (err) {
    res.json(` ${err} `);
  }
};

const userRoutes = (app: express.Application) => {
  app.get("/users", getAllUsers);
  app.get("/users/:id", showUserById);
  app.post("/users", createUser);
  app.put("/users/:id", updateUserById);
  app.delete("/users/:id", deleteUserById);
  app.post("/users/authenticate", authenticateUser);
};
export default userRoutes;
