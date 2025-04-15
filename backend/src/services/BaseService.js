class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async getAll(query = {}) {
        const { page = 1, limit = 10, ...filters } = query;
        const offset = (page - 1) * limit;

        const { count, rows } = await this.model.findAndCountAll({
            where: filters,
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        return {
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit)
            }
        };
    }

    async getById(id) {
        return await this.model.findByPk(id);
    }

    async update(id, data) {
        const [updated] = await this.model.update(data, {
            where: { id },
            returning: true
        });

        if (updated) {
            return await this.getById(id);
        }
        return null;
    }

    async delete(id) {
        const deleted = await this.model.destroy({
            where: { id }
        });
        return deleted > 0;
    }

    async validate(data) {
        // Override this method in child services to add validation logic
        return true;
    }

    async beforeCreate(data) {
        // Override this method in child services to add pre-processing logic
        return data;
    }

    async afterCreate(data) {
        // Override this method in child services to add post-processing logic
        return data;
    }
}

module.exports = BaseService; 