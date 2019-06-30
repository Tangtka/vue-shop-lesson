const express = require('express');

const app = express();

const router = express.Router();

const goodsList = require('../mock/goods.json');

router.get('/goods',(req,res,next)=>{
    res.json(goodsList)
});

app.use(router);

app.listen(59898);
