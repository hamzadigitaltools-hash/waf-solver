const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 3000;

app.get('/get-cookie', async (req, res) => {
    let browser;
    try {
        // Headless browser launch karna (Linux server ke liye arguments zaroori hain)
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const page = await browser.newPage();
        
        // Stealthwriter par jana
        await page.goto('https://app.stealthwriter.ai', { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Vercel ke "Verifying your browser" hatne ka intezar karna (Max 45 seconds)
        await page.waitForFunction(
            () => !document.body.innerText.includes("We're verifying your browser") && !document.body.innerText.includes("Vercel Security Checkpoint"), 
            { timeout: 45000 }
        ).catch(() => {}); // Agar seedha khul jaye toh timeout catch kar lo

        // Cookies nikalna
        const cookies = await page.cookies();
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        // JSON format mein Hostinger ko wapis bhejna
        res.json({ success: true, cookie: cookieString });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(port, () => console.log(`Solver running on port ${port}`));
