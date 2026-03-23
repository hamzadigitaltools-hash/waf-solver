const express = require('express');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const app = express();
const port = process.env.PORT || 3000;

app.get('/get-cookie', async (req, res) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080']
        });
        const page = await browser.newPage();
        
        // Asal insan (Real Human) wala browser banne ke liye User-Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
        
        // Stealthwriter par jana
        await page.goto('https://app.stealthwriter.ai', { waitUntil: 'domcontentloaded', timeout: 60000 });
        
        // WAF ko bypass hone ke liye zabardasti 12 seconds ka intezar (Taake cookie ban jaye)
        await new Promise(r => setTimeout(r, 12000));

        // Cookies nikalna
        const cookies = await page.cookies();
        const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
        
        // Yeh humein batayega ke bot kis page par khara hai (Debugging ke liye best)
        const pageTitle = await page.title();
        const currentUrl = page.url();
        
        res.json({ success: true, cookie: cookieString, title: pageTitle, url: currentUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(port, () => console.log(`Solver running on port ${port}`));
