const express = require('express');
const router = express.Router();
const axios = require('axios')

/*
  Here is an example of having your app get answers from an API
*/
router.get('/recipe',(req,res,next) => {res.render('recipe')})

router.post('/showrecipes',
  async (req,res,next) => {
    try{
      console.log("inside show recipes")
      console.log(JSON.stringify(req.body,null,4))
      const {meal,ingredients} = req.body  // get meal and ingredients from form
      const url= `http://www.recipepuppy.com/api/?i=${ingredients}&q=${meal}&p=1`
      const result = await axios.get(url)
      console.log(JSON.stringify(typeof(result),null,4))
      res.locals.recipes = result.data.results
      res.render('showrecipes')
    } catch(error){next(error)}
})

module.exports = router