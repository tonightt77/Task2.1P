require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');


const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

app.get('/', (request, response)=>{
    response.sendFile(__dirname + "/index.html")
});

app.post('/', (request, response)=>{
    const email = request.body.email;

    mg.messages.create('sandbox5a8030a5a8b4433ba5f769c3ea2c706e.mailgun.org', {
		from: "Mailgun Sandbox <postmaster@sandbox5a8030a5a8b4433ba5f769c3ea2c706e.mailgun.org>",
		to: [email],
		subject: "Subscription Successful",
		text: "You have successfully subscribed!",
	})
	.then(msg => {
		console.log(msg); // logs response data
        response.write("<h1>You have successfully subscribed!</h1>");
        response.end();
	})
	.catch(err => {
		console.log(err); // logs any error
		response.status(500).send('Error sending email.');
	});
});

app.listen(8080, function(request, response){
    console.log("server is running")
});