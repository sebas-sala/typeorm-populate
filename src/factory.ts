import type { DataSource, ObjectLiteral, Repository } from "typeorm";

export abstract class Factory<Entity extends ObjectLiteral> {
	protected repository: Repository<Entity>;

	constructor(dataSource: DataSource, entity: new () => Entity) {
		this.repository = dataSource.getRepository(entity);
	}

	protected defaultData(): Partial<Entity> {
		return {};
	}

	async createOne(data?: Partial<Entity>): Promise<Entity> {
		const entityData = {
			...this.defaultData(),
			...data,
		} as Entity;

		const entity = this.repository.create(entityData);
		return this.repository.save(entity);
	}

	async createMany(
		count: number,
		dataArray?: Partial<Entity>[],
	): Promise<Entity[]> {
		const entities = [] as Entity[];
		for (let i = 0; i < count; i++) {
			const data = dataArray?.[i];
			const entity = await this.createOne(data);
			entities.push(entity);
		}
		return entities;
	}
}
