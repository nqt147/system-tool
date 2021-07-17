const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const https = require('https');
const http = require('http');
const request = require('request');

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

router.get('/mysql', ensureAuthenticated, (req, res) => {
    let links = [
        { href: 'http://recruit.framgia.vn/', text: 'sn_operation_tool' },
        { href: 'https://www.facebook.com/FramgiaVietnam/', text: 'sn_reconciliation' },
        { href: 'https://viblo.asia/', text: 'Viblo by Framgia' },
        { href: '/', text: 'Text Link 1' },
        { href: '/', text: 'Text Link 2' },
        { href: '/', text: 'Text Link 3' },
        { href: '/', text: 'sn_operation_tool' },
    ];

    let options = {
        hostname: 'http://localhost:2105',
        port: 80,
        path: '/get_info_db/util',
        method: 'GET'
    }

    http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          console.log('BODY: ' + chunk);
        });
      }).end();

    res.render('mysqlpage/mysqlHome', { links: links, user: req.user });
})

module.exports = router;