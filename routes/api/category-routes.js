const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  const catData = await Category.findAll({include: [{ model: Product, as: 'products' }],}).catch((err) => {
    res.json(err);
  });

  const cats = catData.map((category) => category.get({ plain: true }));
  res.json(cats);
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{ 
    const catData = await Category.findByPk(req.params.id, {include: [{ model: Product, as: 'products' }],});
    if(!catData) {
        res.status(404).json({message: 'No category with this id!'});
        return;
    }
    const cat = catData.get({ plain: true });
    res.json(cat);
  } catch (err) {
      res.status(500).json(err);
  };  
});

router.post('/', (req, res) => {
  // create a new category
  console.log(req.body);
  if(!req.body.category_name){
    res.status(400).json({message: 'Could not create category.'});
    return;
  }
  // create a new tag
  Category.create(req.body)
  .then((category) => {
    return res.json(category);
  })
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
