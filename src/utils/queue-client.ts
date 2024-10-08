import { Queue, QueueEvents, Worker, Job } from "bullmq";
import path from "path";

const {NO_OF_WORKERS:numberOfWorkers="1",
    WORKER_CONCURRENCY:workerConcurrency="1",
    QUEUE_NAME:queueName="pdfQueue"
} = process.env;

const bullConnection = {
    connection: {
        host: process.env.REDIS_HOST,
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
        db: process.env.REDIS_DB_INDEX
            ? parseInt(process.env.REDIS_DB_INDEX)
            : undefined,
    },
    prefix: process.env.QUEUE_PREFIX,
}

const queue = new Queue(queueName, bullConnection);

const queueEvents = new QueueEvents(queueName, bullConnection);

async function checkQueueHealth(queue: Queue) {
    return await queue.getJobCounts();
}

checkQueueHealth(queue).then(jobCounts => {
    console.log("Connection Established With Redis Queue", jobCounts);
}).catch(reason => {
    console.log("Connection Failed With Redis Queue", reason);
});


const processorFile = path.join(__dirname, 'sandbox_worker.js');

function createSandboxedWorker() {
    return new Worker('pdfQueue', processorFile,{...bullConnection,concurrency:parseInt(workerConcurrency)});
}

// Start multiple sandboxed workers
for (let i = 0; i < parseInt(numberOfWorkers); i++) {
    createSandboxedWorker();
    console.log(`Started worker ${i + 1}`);
}



export {queue,queueEvents};