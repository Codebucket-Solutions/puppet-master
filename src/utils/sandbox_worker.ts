import { SandboxedJob } from 'bullmq';
import * as puppeteer from 'puppeteer'
import path from "path";
import { v4 } from "uuid";

module.exports = async (job: SandboxedJob) => {
    console.log("Sandboxed Worker Started", job.id);
    const payload = job.data;

    const browser = await puppeteer.launch(payload.launchOptions);
    const page = await browser.newPage();
    if(payload.content)
        await page.setContent(payload.content, payload.pageOptions);

    const pdfPath = path.join(__dirname,`${v4()}.pdf`);
    await page.pdf(
        {
            ...payload.pdfOptions,
            path: pdfPath
        }
    );

    if(payload.otherPageFunctions) {
        for(let fn of payload.otherPageFunctions) {

            if(fn.length>1) {
                // @ts-ignore
                await page[fn[0]](...fn[1])
            } else {
                // @ts-ignore
                await page[fn[0]]()
            }

        }
    }

    await browser.close();

    return {
        path: pdfPath
    }
};