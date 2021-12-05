const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const tagData = await Tag.findAll({include: [{ model: Product, through: ProductTag, as: 'products' }],}).catch((err) => {
    res.json(err);
  });

  const tags = tagData.map((tag) => tag.get({ plain: true }));
  res.json(tags);
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{ 
    const tagData = await Tag.findByPk(req.params.id, {include: [{ model: Product, through: ProductTag, as: 'products' }],});
    if(!tagData) {
        res.status(404).json({message: 'No tag with this id!'});
        return;
    }
    const tag = tagData.get({ plain: true });
    res.json(tag);
  } catch (err) {
      res.status(500).json(err);
  };     
});

router.post('/', (req, res) => {
  if(!req.body.tag_name){
    res.status(400).json({message: 'Could not create tag.'});
    return;
  }
  // create a new tag
  Tag.create(req.body)
  .then((tag) => {
    return res.json(tag);
  })
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try{
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    const tag = tagData.get({ plain: true });
    res.json("Updated " + tag.tag_name);
  } catch (err) {
      res.status(500).json(err);
  }; 
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try{ 
    const tagData = await Tag.findByPk(req.params.id);
    if(!tagData) {
        res.status(404).json({message: 'No tag with this id!'});
        return;
    }
    const tag = tagData.get({ plain: true });
    Tag.destroy({where: { id: req.params.id}});
    res.json("Deleted " + tag.tag_name);
  } catch (err) {
      res.status(500).json(err);
  };     
});

module.exports = router;