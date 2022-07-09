const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./databases/database');
const session = require('express-session');

const categories_controller = require('./categories/Categories_controller');
const article_controller = require('./articles/article_controller');
const Users_controller = require('./Users/users.controller');

const Article = require('./articles/Article');
const Category = require('./categories/Category');


// View engine (ejs, html/css)
app.set('view engine','ejs');
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//session 
app.use(session({
    secret: 'hardpassword', cookie:{maxage: 300000000}
}))

//conexão with databases
connection
    .authenticate()
    .then(() => {
        console.log("a conexão com o banco de dados foi um sucesso!");
    })
    .catch((erro) => {
        console.log(erro);
    });
    
//routes

app.use('/',categories_controller);
app.use('/',article_controller);
app.use('/',Users_controller);


app.get('/',(req,res) => {
    Article.findAll({
        order:[['id','DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', {articles:articles, categories: categories });
        })
       
    })
    
});

app.get('/:slug',(req,res) => {
    let slug = req.params.slug;
    Article.findOne({
        where: {slug: slug }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article:article, categories: categories });
            })
        }
        else{
            res.redirect('/');
        }
    }).catch(erro => {
        res.redirect()
    })
})

app.get('/category/:slug',(req,res) => {
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug:slug  
        },
        include: [{model:Article}]
    }).then( category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index',{articles: category.articles, categories:categories})
            });
        }else{
            res.redirect('/')       
        }
    }).catch(erro => {
        res.redirect('/');       
    })
});

app.listen(8080,() => {
    console.log("o servidor está rodando");
})
