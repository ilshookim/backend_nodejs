const express = require('express')
const ctrl = require('./users.ctrl')

const router = express.Router()

router.post('/', ctrl.creates)
router.get('/', ctrl.readsAll)
router.get('/:id', ctrl.reads)
router.put('/:id', ctrl.updates)
router.delete('/:id', ctrl.deletes)

module.exports = router
