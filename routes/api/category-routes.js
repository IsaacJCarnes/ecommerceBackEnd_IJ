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

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const catData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const cat = catData.get({ plain: true });
    res.json("Updated " + cat.category_name);
  } catch (err) {
      res.status(500).json(err);
  }; 
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{ 
    const catData = await Category.findByPk(req.params.id);
    if(!catData) {
        res.status(404).json({message: 'No category with this id!'});
        return;
    }
    const cat = catData.get({ plain: true });
    Category.destroy({where: { id: req.params.id}});
    res.json("Deleted " + cat.category_name);
  } catch (err) {
      res.status(500).json(err);
  };   
});

module.exports = router;
