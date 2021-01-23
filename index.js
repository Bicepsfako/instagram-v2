const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');
var moment = require('moment');
let trLocale = require('moment/locale/tr');
moment.locale('tr',trLocale)

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
		blockingWait(4);
		await page.goto('https://www.instagram.com/accounts/edit/');
		const title = await page.title();
                console.log("Instagram Giriş: " + title ? "Edit • Instagram" : "Login • Instagram");
		var inputElement = await page.$('#react-root > section > main > div > article > div > div.LqNQc > div > div > form > input[type="file"]');
		setInterval(function () {

                        let now = moment().locale('tr');;

			let year = now.get('year');

			let month = now.get('month');

			let date = now.get('date');

			let hour = now.get('hour');

			let minute = now.get('minute');

			let second = now.get('second');

			let milli = now.get('millisecond');

                        var filePath = './resimler/'+minute+'.jpg';
                        
			Jimp.read("https://images.wallpapersden.com/image/download/forest-minimal_amxraG2UmZqaraWkpJRoZ2WtaGdl.jpg").then(function (delimg) {
				Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(async function (font) {
					await delimg.blur(20)
					await delimg.resize(320, 320)
					await delimg.HORIZONTAL_ALIGN_CENTER;
					//80 Sağa / //20 Yukarı
					// 15 sağa / // 80 yukarı
					await delimg.print(font, 80, 20, hour + ":" + minute, 80)
					await delimg.print(font, 15, 80, date + "/" + month + "/" + year, 40)
					await delimg.write(`./resimler/${minute}.jpg`);
					await inputElement.uploadFile(filePath);
                                        if (fs.existsSync(filePath)) {
                                        fs.unlinkSync(filePath);
                                        }
					console.log("Tarih: " + date + "/" + month + "/" + year + " " + hour + ":" + minute);

				});
			});
		}, 60000);
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
