const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');
const dayjs = require('dayjs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
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
		blockingWait(4);
		await page.close();
		const sekme2 = await browser.newPage();
		await sekme2.setUserAgent(USER_AGENT);
		await sekme2.goto('https://www.instagram.com/accounts/edit/');
		const pageTitle = await sekme2.title();
		var inputElement = await sekme2.$('#react-root > section > main > div > article > div > div.LqNQc > div > div > form > input[type="file"]');
		setInterval(function () {

                        let now = dayjs();

			let year = now.year();

			let month = now.month();

			let date = now.date();

			let hour = now.hour();

			let minute = now.minute();

			let second = now.second();

			let milli = now.millisecond();
                        var filePath = './resimler/'+minute+'.png';
                        if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                        }
			Jimp.read("https://wallpaperaccess.com/full/4080004.jpg").then(function (delimg) {
				Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(async function (font) {
					await delimg.blur(20)
					await delimg.resize(320, 320)
					await delimg.HORIZONTAL_ALIGN_CENTER;
					//80 Sağa / //20 Yukarı
					// 15 sağa / // 80 yukarı
					await delimg.print(font, 80, 20, hour + ":" + minute, 80)
					await delimg.print(font, 15, 80, date + "/" + month + "/" + year, 40)
					await delimg.write(`./resimler/${minute}.png`);
                                        console.log(filePath);
					await inputElement.uploadFile(filePath);
					console.log("Tarih: " + date + "/" + month + "/" + year + " " + hour + ":" + minute);

				});
			});
		}, 60000);
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
