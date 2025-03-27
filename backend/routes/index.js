import express from "express";
import login from "./login.js";
import users from "./users.js";
import ongs from "./ongs.js";
import projects from "./projects.js";

const routes = (app) => {
    app.use(express.json());
    app.route('/').get((req, res) => res.status(200).send('API de apoio a ONGs'));
    app.use("/api/v1/login", login);
    app.use("/api/v1/users", users);
    app.use("/api/v1/ongs", ongs);
    app.use("/api/v1/projects", projects);
};

export default routes;
