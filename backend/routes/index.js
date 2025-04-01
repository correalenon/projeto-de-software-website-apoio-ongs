import express from "express";
import login from "./login.js";
import users from "./users.js";
import ongs from "./ongs.js";
import projects from "./projects.js";
import activities from "./activities.js";
import posts from "./posts.js";

const routes = (app) => {
    app.use(express.json());
    app.route('/').get((req, res) => res.status(200).send('API de apoio a ONGs'));
    app.use("/api/v1/login", login);
    app.use("/api/v1/users", users);
    app.use("/api/v1/ongs", ongs);
    app.use("/api/v1/projects", projects);
    app.use("/api/v1/activities", activities);
    app.use("/api/v1/posts", posts);
};

export default routes;
