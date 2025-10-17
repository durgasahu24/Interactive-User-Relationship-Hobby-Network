import express from "express";
import { getUsers, createUser, updateUser, deleteUser, linkUser, unlinkUser, getGraph,} from "../controller/user.controller.js";

const router = express.Router();

router.get("/users", getUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/users/:id/link", linkUser);
router.delete("/users/:id/unlink", unlinkUser);
router.get("/graph", getGraph);

export default router;
