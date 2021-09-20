const app = require('express')();
const http = require('http').Server(app);
const port = '8000';
const express = require('express');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));

var crypto = require("crypto");
var algorithm = "aes-192-cbc"; //algorithm to use
var password = "Hello darkness";
const key = crypto.scryptSync(password, 'salt', 24); //create key



function encrypt(e){
var iv = crypto.randomBytes(16); // generate different ciphertext everytime
//console.log(iv);
var cipher = crypto.createCipheriv(algorithm, key, iv);
var text=e;
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text

return (encrypted+':'+(iv).toString('hex'));
}

function decrypt(e){
	var data = e.split(':');
	var text=data[0];
	var pwd = Buffer.from(data[1], 'hex');
		if(!pwd){
			console.log('invalid data!')
		}else{
	var cipher = crypto.createCipheriv(algorithm, key, pwd);
	const decipher = crypto.createDecipheriv(algorithm, key, pwd);
	var decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
	return decrypted;
}}

app.get('/', (req, res) => {                                                                               res.sendFile(__dirname + '/index.html');
})

app.post('/encrypt', (req, res) => {

        var data = req.body.a;
	console.log(data);
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
                result:encrypt(data)
        
}))})

app.post('/decrypt', (req, res) => {

        var data = req.body.a;
        res.status(200);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
                result:decrypt(data)
        }));

});


http.listen(process.env.PORT || port, () => {
        console.log(`listening on http://localhost:${port}/`);
});
