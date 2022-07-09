const express = require('express');
const router = express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const admin_auth = require('../middlewares/admin_auth');

router.get('/admin/categories/new',admin_auth,(req,res) => {
    res.render("admin/categories/new");
});

router.post('/categories/save', admin_auth,(req,res) => {
    let title = req.body.title;
    if (title != undefined && title != ""){
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    }else {
        res.render("admin/categories/new");
    }
})

router.get('/admin/categories',admin_auth,(req,res) => {
    
    Category.findAll().then(categories =>{
        res.render("admin/categories/index", {categories: categories}); 
    });
});

router.post('/categories/delete', admin_auth,(req,res) => {
    let id = req.body.id;
    
    if(id != undefined){
        if(!isNaN(id)){
            Category.destroy({
                where: {id:id}
            }).then(() => {
                res.redirect('/admin/categories'); 
            });
        }
        else{ // not a number
            res.redirect('/admin/categories');
        }
    }
    else { // null 
        res.redirect('/admin/categories');
    }
   
});

router.get('/admin/categories/edit/:id',admin_auth,(req,res) => {

    let id = req.params.id;

    if(isNaN(id)){
        res.redirect('/admin/categories')

    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render('admin/categories/edit', {category:category})
        }
        else {
            res.redirect('/admin/categories')
            console.log('erro aqui1')
        }
    }).catch(erro => {
        res.redirect('/admin/categories')

    });
});

router.post('/categories/update',admin_auth,(req,res) => {
    
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title: title, slug: slugify(title)}, {
        where: {
            id:id
        }
    }).then(() => {
        res.redirect('/admin/categories')
    })

})




module.exports = router;