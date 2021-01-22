const puppeteer = require('puppeteer');
const fs = require('fs');
var Jimp = require('jimp');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36';
(async() => {


	const browser = await puppeteer.launch({
		headless: false,
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

	var photoNum = 1;

	var fotogradedi = 24;

	for (let tekrar = 0; tekrar < 999999999; tekrar++) {
		for (let index = 0; index < fotogradedi; index++) {
			blockingWait(5);
			inputElement.uploadFile('./resimler/' + photoNum + '.jpg');

			console.log("Şu numaralı bitmoji yüklenecektir -> " + photoNum);
			photoNum++;
			if (photoNum == fotogradedi) {
				console.log("Tekrarlanıyor");
				photoNum = 1;
			}
		}
	}
})();

function blockingWait(seconds) {
	var waitTill = new Date(new Date().getTime() + seconds * 1000);
	while (waitTill > new Date()) {}
}
