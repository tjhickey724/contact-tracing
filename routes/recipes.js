var express = require('express');
var router = express.Router();

router.get('/recipe',(req,res,next) => {res.render('recipe')})

router.post('/recipe',
  async (req,res,next) => {
    try{
      const {meal,ingredients} = req.body  // get meal and ingredients from form
      const url= `http://www.recipepuppy.com/api/?i=${ingredients}&q=steak&p=3`
      const result = await axios.get()
    } catch(error){next(error)}
})