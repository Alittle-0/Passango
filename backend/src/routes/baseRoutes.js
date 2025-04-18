import express from 'express';

// Router factory function that creates standard CRUD routes for any controller
export default (controller) => {
    const router = express.Router();
    
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

/*
This file is a router factory that creates standardized CRUD routes for any controller that follows a common interface pattern. It's a useful utility that:

Reduces code duplication across route files
Standardizes API endpoints for all resources
Implements the DRY principle (Don't Repeat Yourself)

It creates these standard routes:
POST / - Create a new resource
GET / - Get all resources (with pagination/filtering)
GET /:id - Get a specific resource by ID
PUT /:id - Update a resource
DELETE /:id - Delete a resource
*/