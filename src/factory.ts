import type { DataSource, ObjectLiteral, Repository } from "typeorm";

export abstract class Factory<Entity extends ObjectLiteral> {
	protected repository: Repository<Entity>;

	constructor(dataSource: DataSource, entity: new () => Entity) {
		this.repository = dataSource.getRepository(entity);
	}

	async createOne(data?: unknown): Promise<Entity> {
		const entity = this.repository.create(data as Entity);
		return this.repository.save(entity);
	}

	async createMany(count: number): Promise<Entity[]> {
		const entities = [] as Entity[];
		for (let i = 0; i < count; i++) {
			const entity = await this.createOne();
			entities.push(entity);
		}
		return entities;
	}
}
