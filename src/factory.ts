export abstract class Factory<Entity> {
	async createOne(data?: any): Promise<Entity> {
		throw new Error("Method not implemented.");
	}

	async createMany(count: number, data?: any): Promise<Entity[]> {
		const list = [] as Entity[];
		for (let i = 0; i < count; i++) {
			const entity = await this.createOne(data);
			list.push(entity);
		}
		return list;
	}
}
