const express = require('express');
const router = express.Router();
const Category = require('../categories/Category')
//const article = require('./Article');
const slugify = require('slugify');
const Article = require('./Article');
const admin_auth = require('../middlewares/admin_auth');

router.get('/admin/articles',admin_auth,(req,res) => {
    
    Article.findAll({
        include: [{model: Category}]
    }).then((articles) => {
        res.render("admin/articles/index", {articles : articles})
    })
    
});

router.get('/admin/articles/new',admin_auth,(req,res) => {
    
    Category.findAll().then(categories => {
        res.render('admin/articles/new',{categories: categories});
    })
   
});

router.post('/articles/save',admin_auth,(req,res) => {
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.select_category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect('/admin/articles');
    });
});

router.post('/articles/delete',admin_auth,(req,res) => {
    let id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            Article.destroy({
                where: {id:id}
            }).then(() => {
                res.redirect('/admin/articles'); 
            });
        }
        else{ // not a number
            res.redirect('/admin/articles');
        }
    }
    else { // null 
        res.redirect('/admin/articles');
    }
   
});

router.get('/admin/articles/edit/:id',admin_auth,(req,res) => {

    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/articles')

    }

    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('admin/articles/edit',{article:article, categories: categories});
            })
        }
        else {
            res.redirect('/admin/articles')
            console.log('erro aqui1')
        }
    }).catch(erro => {
        res.redirect('/admin/articles')

    });
});

router.post('/articles/update',admin_auth,(req,res) => {
    
    let id = req.body.id;
    let title = req.body.title;
    let categoryId = req.body.categoryId;
    let body = req.body.body;

    Article.update({title: title, slug: slugify(title), categoryId: categoryId, body:body}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    })

})

router.get('/articles/page/:num',admin_auth, (req,res) => {
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
        console.log('entro')
    }
    else {
        offset = parseInt(page-1) * 4;
        console.log('entro1 '+ offset)
    }

    Article.findAndCountAll({ 
        order:[['id','DESC']],
        limit: 4,
        offset: offset
    }).then(articles => {
    
        let next;
    
        if(offset + 4 >= articles.count){
            next = false;
        }
        else{
            next = true;
          
        }
    
        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }
    
        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result: result, categories:categories})
        })
    })
})



module.exports = router;