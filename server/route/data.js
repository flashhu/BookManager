const express = require('express');
const router = express.Router();

const db = require('../module/db');

router.get('/admin', (req, res)=>{
    db.selectAll('manager', (err, r) => {
        res.json(r);
    })
})

router.get('/reader', (req, res) => {
    db.selectAll('reader', (err, r) => {
        res.json(r);
    })
})

router.get('/book', (req, res) => {
    db.selectAll('book', (err, r) => {
        res.json(r);
    })
})

module.exports = router;