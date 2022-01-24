import tasksDAO from "../dao/tasksDAO.js"

export default class TasksController {

    static async apiPostTask(req, res, next) {
        try {
            const taskResponse = await tasksDAO.addTask(req);
            res.json({ status: "success" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiUpdateTask(req, res, next) {
        try {
            console.log("updating...") // log
            const taskResponse = await tasksDAO.updateTask(req);
            console.log(taskResponse); // log
            var { error } = taskResponse;
            if (error) { res.status(400).json({ error }); }
            if (taskResponse.modifiedCount === 0) { throw new Error("unable to update task - user may not be original poster"); }
            res.json({ status: "success" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteTask(req, res, next) {
        try {
            const taskResponse = await tasksDAO.deleteTask(req)
            res.json({ status: "success" });
        }
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}
