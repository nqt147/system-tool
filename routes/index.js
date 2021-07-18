const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const https = require('https');
const http = require('http');
const request = require('request');
let data = '';
//login page
router.get('/', (req, res) => {
    res.render('login');
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('home', {
        user: req.user
    });
})

router.get('/mysql', (req, res) => {
    http.get('http://localhost:2105/get_info_db/util', (resp) => {
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            data = JSON.parse(data)
            console.log(data);
            res.render('mysqlpage/mysqlHome', { user: req.user, infodb: data });
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.render('mysqlpage/mysqlHome', { user: req.user });
    });
    console.log(data);
})

router.post('/mysql', (req, res) => {
    const { clustername, dbname, tablename, exequery } = req.body;
    let errors = [];
    console.log(' clustername ' + clustername + ' dbname ' + dbname + ' tablename :' + tablename + ' exequery :' + exequery);

    let dataReq = new TextEncoder().encode(
        JSON.stringify({
            clustername: clustername,
            dbname: dbname,
            tablename: tablename,
            exequery: exequery
        })
    )

    let options = {
        host: 'localhost',
        port: 2105,
        path: '/mysql/update',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': dataReq.length
        }
    }

    let reqq = http.request(options, function (ress) {
        ress.setEncoding('utf8');
        ress.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            data = JSON.parse(chunk)
            res.render('mysqlpage/mysqlHome', { user: req.user, infodb: data });
        });
    });

    reqq.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        res.render('mysqlpage/mysqlHome', { user: req.user });
    });
    reqq.write(dataReq);
    reqq.end();
})


module.exports = router;