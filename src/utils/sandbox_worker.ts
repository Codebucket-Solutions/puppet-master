import { SandboxedJob } from 'bullmq';
import * as puppeteer from 'puppeteer'
import path from "path";
import { v4 } from "uuid";

module.exports = async (job: SandboxedJob) => {

    const payload = job.data;

    const browser = await puppeteer.launch(payload.options);
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
        for(let fn of Object.keys(payload.otherPageFunctions)) {
            // @ts-ignore
            await page[fn](...payload.otherPageFunctions[fn])
        }
    }

    await browser.close();

    return {
        path: pdfPath
    }
};