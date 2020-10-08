const express = require('express');
const router = express.Router();
const {
    createHall,
    getHalls,
    getHall,
    updateHall,
    deleteHall
} = require('../controllers/halls');
const validateRequestBody = require('../middlewares/validateRequestBody');
const {
    Hall,
    validateOnCreateHall,
    validateOnUpdateHall
} = require('../models/Hall');
const listJsonResponse = require('../middlewares/listJsonResponse');

router
    .route('/')
    .get(listJsonResponse(Hall), getHalls)
    .post(validateRequestBody(validateOnCreateHall), createHall);

router
    .route('/:id')
    .delete(deleteHall)
    .get(getHall)
    .put(validateRequestBody(validateOnUpdateHall), updateHall);

module.exports = router;
