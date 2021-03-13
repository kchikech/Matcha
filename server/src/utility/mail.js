const nodemailer = require('nodemailer')
const conf = require('../config/smtp')
const ejs = require('ejs')
const { readFile } = require('fs')
const { resolve, dirname } = require('path')
const { promisify } = require('util')
const readFileAsync = promisify(readFile)
const { google } = require("googleapis")
const oauth2Client = new google.auth.OAuth2(
	'784133489779-1j47dr41lp46mt67qc0n5pse8gakr5an.apps.googleusercontent.com',
	'NauIJwmREBYk01uMAjlXuEec',
	'https://developers.google.com/oauthplayground'
)
oauth2Client.setCredentials({ refresh_token: '1//04t2XkCLXrfHkCgYIARAAGAQSNwF-L9Irrbs93m6j15q9jIXubVJi45GS17tVwSVNYDGUldGgJSJWoqEs9U9-Ax1Nk6jiK_Alvew' })
const accessToken = '1//04OQ-pDrCYNm3CgYIARAAGAQSNwF-L9Irh4vpnUbf7XUpNmYzxc2jNt8g40De84VdWadYL9cjq1npBspdHabYjcCJH7K4iathE6E'
// 784133489779-1j47dr41lp46mt67qc0n5pse8gakr5an.apps.googleusercontent.com
// NauIJwmREBYk01uMAjlXuEec
const sendMail = async (to, key, type) => {
	try {
		const path = resolve(dirname(__dirname), 'views', 'mail.ejs')
		const raw = await readFileAsync(path, 'utf8')
		const data = {
			title: type == 'verify' ? 'Verify email' : 'Recover password',
			body: `Please click the button to ${type == 'verify' ? 'verify your email' : 'recover your password'}`,
			action: type == 'verify' ? 'Verify' : 'Recover',
			url: `${process.env.API_URL}api/users/${type}/${key}`
		}
		const html = ejs.render(raw, data)
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				type: 'OAuth2',
				user: process.env.MAIL_USER,
				clientId: '784133489779-1j47dr41lp46mt67qc0n5pse8gakr5an.apps.googleusercontent.com',
				clientSecret: 'NauIJwmREBYk01uMAjlXuEec',
				refreshToken: '1//04OQ-pDrCYNm3CgYIARAAGAQSNwF-L9Irh4vpnUbf7XUpNmYzxc2jNt8g40De84VdWadYL9cjq1npBspdHabYjcCJH7K4iathE6E',
				accessToken: accessToken
			}
		})
		await transporter.sendMail({
			from: 'Matcha team',
			subject: data.title,
			html,
			to
		})
	} catch (err) {
		console.log('Got error here -->', err)
	}
}

module.exports = { sendMail }