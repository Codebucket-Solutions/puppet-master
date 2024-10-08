import express, { Request, Response } from "express";
const router = express.Router();
import { v4 } from "uuid";
import { queue, queueEvents}from "../utils/queue-client";
import {Job} from "bullmq";


type response = {
    path: string
}

router.post("/pdf", async (req: Request, res: Response) => {
    try {
        let apiKey = req.headers["x-api-key"];
        if (apiKey != process.env.API_KEY) {
            throw new Error("Invalid Api Key");
        }
        const { task } = req.body;

        let job: Job|undefined = await queue.add(v4(),task);

        await job.waitUntilFinished(queueEvents);

        if(job && job.id) {
            job = await Job.fromId(queue, job.id);
        }

        if(job) {
            let state = await job.getState()
            let response: response = job.returnvalue;
            res.download(response.path);
        }

        throw new Error("Some Error Occurred While Queueing")

    } catch (err ) {
        res.json({
            success: false,
            message: err.message,
            error: err
        });
    }
});

export default router;