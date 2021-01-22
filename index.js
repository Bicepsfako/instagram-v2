const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');
const dayjs = require('dayjs');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
(async() => {


		const browser = await puppeteer.launch({
			headless: false,
                        { args: ['--no-sandbox'] },
			defaultViewport: {
				width: 1024,
				height: 768,

			},
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

			console.log(now.toObject());

			let year = now.year();

			let month = now.month();

			let date = now.date();

			let hour = now.hour();

			let minute = now.minute();

			let second = now.second();

			let milli = now.millisecond(); console.log(`Millisecond: ${milli}`);

			Jimp.read("https://wallpaperaccess.com/full/4080004.jpg").then(function (delimg) {
				Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(function (font) {
					delimg.blur(20)
					delimg.resize(320, 320)
					delimg.HORIZONTAL_ALIGN_CENTER;
					//80 Sağa / //20 Yukarı
					// 15 sağa / // 80 yukarı
					delimg.print(font, 80, 20, hour + ":" + minute, 80)
					delimg.print(font, 15, 80, date + "/" + month + "/" + year, 40)
					delimg.write(`./resimler/${minute}.png`);

					inputElement.uploadFile('./resimler/' + minute + '.png').then(() => fs.unlinkSync(`./resimler/${minute}.png`));
					console.log("Tarih: " + date + "/" + month + "/" + year + " " + hour + ":" + minute);

				});
			});
		}, 60000);
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
