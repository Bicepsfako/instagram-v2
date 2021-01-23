const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');
var moment = require('moment');
moment.locale('tr');
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
(async() => {


		const browser = await puppeteer.launch({
			headless: true,
                        args: ['--no-sandbox','--disable-setuid-sandbox', '--disable-accelerated-2d-canvas','--disable-canvas-aa', '--disable-2d-canvas-clip-aa']
		});
	        const page = await browser.newPage();
		await page.setUserAgent(USER_AGENT);
		await page.goto('https://www.instagram.com/accounts/edit/');
                await page.waitForSelector('input[name="username"]');

		await page.type('input[name="username"]', process.env.USERNAME);
		await page.type('input[name="password"]', process.env.PASSWORD);

		await page.click('button[type="submit"]');
		blockingWait(10);
                await page.close();

		const sekme2 = await browser.newPage();
                await sekme2.setUserAgent(USER_AGENT);
                await sekme2.goto('https://www.instagram.com/accounts/edit/');
                const title = await sekme2.title();
                console.log("Trying to login Instagram...");
                if(title === "Edit Profile • Instagram") {
                console.log("Successfull!");
                } else {
                console.log("Login failed!");
                sekme2.close();
                }

		var inputElement = await sekme2.$('#react-root > section > main > div > article > div > div.LqNQc > div > div > form > input[type="file"]');
		setInterval(function () {
                        let now = moment();
                        let minute = now.get('minute');
                        var filePath = `./resimler/${minute}.png`;
                        Jimp.read("https://img.pngio.com/dark-forest-4k-ultra-hd-wallpapers-top-free-dark-forest-4k-ultra-dark-forest-hd-png-3840_2160.png").then(function (delimg) {
				Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(async function (font) {
					await delimg.blur(20)
					//await delimg.resize(320, 320)
					await delimg.HORIZONTAL_ALIGN_CENTER;
					//80 Sağa / //20 Yukarı
					// 15 sağa / // 80 yukarı
					await delimg.print(font, 80, 20, moment().format('LT'), 80)
					await delimg.print(font, 15, 80, moment().format('L'), 40)
					await delimg.write(`./resimler/${minute}.png`);
					await inputElement.uploadFile(filePath);
                                        if (fs.existsSync(filePath)) {
                                        fs.unlinkSync(filePath);
                                        }
					console.log("Tarih: " + moment().format('LLL'));

				});
			});
		}, 60000);
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
