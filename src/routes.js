import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null
      );
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const task = {
        id: randomUUID(),
        title: title,
        description: description,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectById("tasks", id);
      if (!task) {
        return res.writeHead(401).end();
      }
      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      const task = database.selectById("tasks", id);

      if (!task) {
        return res.writeHead(401).end("Registro não encontrado");
      }

      if (title) {
        database.update("tasks", id, {
          ...task,
          title,
          updated_at: new Date().getTime(),
        });
        return res.writeHead(201).end();
      } else if (description) {
        database.update("tasks", id, {
          ...task,
          description,
          updated_at: new Date().getTime(),
        });
        return res.writeHead(201).end();
      }

      return res.writeHead(204).end();
    },
  },

  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const task = database.selectById("tasks", id);

      if (!task) {
        return res.writeHead(401).end();
      }

      if (!task.completed_at) {
        database.update("tasks", id, {
          ...task,
          completed_at: new Date().getTime(),
        });
      } else {
        if (task.completed_at) {
          database.update("tasks", id, {
            ...task,
            completed_at: null,
          });
        }
      }

      return res.writeHead(201).end();
    },
  },
];
