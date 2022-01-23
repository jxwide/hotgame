const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000
const urlencodedParser = express.urlencoded({extended: false});

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    password: "", 
    database: "hotgame"
});

app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    const query = "SELECT * FROM `games`";
    pool.query(query, (err, result) => {
        if(err) return console.log(err);
        console.log(result);

        res.render('index.hbs', {
            gg: result
        });
    });
})

app.get('/news/:id', (req, res) => {
    let iid = req.params.id;
    pool.query("SELECT * FROM `news` WHERE `id` = ?", [iid], (err, result) => {
        res.render('newsid.hbs', {
            title: result[0]['title'],
            tags: result[0]['tags'],
            comments: result[0]['comments'],
            contentt: result[0]['contentt']
        });
    });
})

app.get('/news', (req, res) => {
    const query = "SELECT * FROM `news`";
    pool.query(query, (err, result) => {
        if(err) return console.log(err); 
        console.log(result); 

        res.render('news.hbs', {
            nn: result
        });
    });
    //res.render('news.hbs')
})

app.get('/createnews', (req, res) => {
    res.render('createnews.hbs')
})

app.post("/createnews", urlencodedParser, function (req, res) {
    if(!req.body) return response.sendStatus(400);
    console.log(req.body); // req.body.userName
    
    let cn_title = req.body.cn_title;
    let cn_tags = req.body.cn_tags;
    let cn_content = req.body.cn_content;
    
    if (cn_title.length > 111) return res.send('title must be < 111 symbols');
    if (cn_tags.length > 60) return res.send('title must be < 60 symbols');
    if (cn_content.length > 500) return res.send('title must be < 500 symbols');
    if (cn_title.length == 0) return res.redirect('/createnews');
    if (cn_tags.length == 0) return res.redirect('/createnews');
    if (cn_content.length == 0) return res.redirect('/createnews');

    let sql = "INSERT INTO `news` (`title`, `tags`, `contentt`) VALUES (?, ?, ?)";
    pool.query(sql, [cn_title, cn_tags, cn_content], (err, result) => {
        if (err) return console.log(err);
        res.redirect('/news')
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))