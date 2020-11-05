const express = require('express');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const url = 'http://3.21.241.102/check';
const curl = require("curl");
const jsdom = require("jsdom");


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

var totalDevice = 0;
var listIp = [];
var devIp = [];

var Ips = ["18.191.202.64",
    "52.15.96.134",
    "18.224.34.172",
    "18.221.206.53",
    "18.191.180.253",
    "3.17.161.93",
    "3.135.238.6",
    "18.220.131.72",
    "18.191.12.228",
    "18.221.22.97",
    "3.16.160.159",
    "18.222.5.222"
];

function start() {
    var loopCount = 1;
    for (let val of Ips) {
        curl.get("http://" + val + "/check", null, (err, resp, body) => {

            if (resp.statusCode == 200) {
                parseData(body, val, (loopCount == Ips.length));

                loopCount++;

            } else {
                //some error handling
                console.log("error while fetching url");
            }

        });

    }

    return [listIp, devIp, totalDevice];
}

function parseData(html, val, printVal) {

    const { JSDOM } = jsdom;

    const dom = new JSDOM(html);

    const $ = (require('jquery'))(dom.window);

    var list = $('h1');

    totalDevice += parseInt(list[4].innerHTML.replace('Total Connected MAC :', ''));

    devIp.push(parseInt(list[4].innerHTML.replace('Total Connected MAC :', '')));
    listIp.push(val);

    if (printVal) {
        console.log(totalDevice);
    }
    return true;
}

app.use((req, res, next) => {
    var result = start();
    if (result[0] != null) {
        // console.log("listIP:", result[0], " total-device:", result[1]);
        res.status(404).render('show', { listIp: result[0], deviceIp: result[1], totalDevice: result[2] });
        listIp = [];
        totalDevice = 0;
    }

})

app.listen(3000);