class BaseController {
    constructor(service) {
        this.service = service;
    }

    async create(req, res) {
        try {
            const data = await this.service.create(req.body);
            res.status(201).json({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const data = await this.service.getAll(req.query);
            res.json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const data = await this.service.getById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }
            res.json({
                success: true,
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const data = await this.service.update(req.params.id, req.body);
            if (!data) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }
            res.json({
                success: true,
                data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const success = await this.service.delete(req.params.id);
            if (!success) {
                return res.status(404).json({
                    success: false,
                    error: 'Resource not found'
                });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = BaseController; 