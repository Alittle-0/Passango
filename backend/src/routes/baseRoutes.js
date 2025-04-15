const express = require('express');
const router = express.Router();

module.exports = (controller) => {
    // Create a new item
    router.post('/', controller.create.bind(controller));
    
    // Get all items
    router.get('/', controller.getAll.bind(controller));
    
    // Get a single item by id
    router.get('/:id', controller.getById.bind(controller));
    
    // Update an item
    router.put('/:id', controller.update.bind(controller));
    
    // Delete an item
    router.delete('/:id', controller.delete.bind(controller));
    
    return router;
}; 