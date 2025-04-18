class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const processedData = await this.beforeCreate(data);
        const newItem = await this.model.create(processedData);
        return await this.afterCreate(newItem);
    }

    async getAll(query = {}) {
        const { page = 1, limit = 10, ...filters } = query;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.model.find(filters)
                .sort({ createdAt: -1 })
                .limit(parseInt(limit))
                .skip(skip),
            this.model.countDocuments(filters)
        ]);

        return {
            data: items,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getById(id) {
        return await this.model.findById(id);
    }

    async update(id, data) {
        const updated = await this.model.findByIdAndUpdate(
            id, 
            data, 
            { new: true, runValidators: true }
        );
        return updated;
    }

    async delete(id) {
        const deleted = await this.model.findByIdAndDelete(id);
        return !!deleted;
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

export default BaseService;