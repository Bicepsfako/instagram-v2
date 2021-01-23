const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');
var moment = require('moment');
moment.locale('tr');
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36';
(async() => {


	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-accelerated-2d-canvas', '--disable-canvas-aa', '--disable-2d-canvas-clip-aa']
	});
	const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0); 
	await page.setUserAgent(USER_AGENT);

	await page.goto('https://www.instagram.com/accounts/edit/');
        //await page.waitForNavigation({waitUntil: "domcontentloaded"});
	await page.waitForSelector('input[name="username"]');

	await page.type('input[name="username"]', process.env.USERNAME);
	await page.type('input[name="password"]', process.env.PASSWORD);

	await page.click('button[type="submit"]');
        await page.waitForNavigation({waitUntil: 'networkidle2'});
        await page.goto('https://www.instagram.com/accounts/edit/');
	const title = await page.title();
        console.log(title);
	if (title === "Edit Profile • Instagram") {
		console.log("Successfull!");
	} else {
		console.log("Login failed!");
		browser.close();
	}
        await page.waitForSelector('#react-root > section > main > div > article > div > div.LqNQc > div > div > form > input[type="file"]');
	var inputElement = await page.$('#react-root > section > main > div > article > div > div.LqNQc > div > div > form > input[type="file"]');
	setInterval(function () {
		let now = moment();
		let minute = now.get('minute');
		let filePath = `./resimler/${minute}.png`;
		Jimp.read(`./resimler/bg.png`).then(function (delimg) {
			Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(async function (font) {
				await delimg.blur(50)
				await delimg.resize(320, 320)
				await delimg.HORIZONTAL_ALIGN_CENTER;
				//80 Sağa / //20 Yukarı
				// 15 sağa / // 80 yukarı
				await delimg.print(font, 80, 20, moment().format('LT'), 80)
				await delimg.print(font, 15, 80, moment().format('l'), 40)
				await delimg.write(`./resimler/${minute}.png`);
				await inputElement.uploadFile(filePath);
				fs.unlinkSync(filePath);
				console.log("Tarih: " + moment().format('LLL'));

			});
		});
	}, 60000);
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
