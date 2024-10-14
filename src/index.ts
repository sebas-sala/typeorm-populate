import type { DataSource } from "typeorm";

export interface FactoryInterface<T> {
	createOne: (data?: any) => Promise<T>;
	createMany: (count: number, data?: any) => Promise<T[]>;
}

export interface SeedConfig {
	dataSource: DataSource;
}

export class TypeormPopulate {
	private dataSource: DataSource;

	constructor(config: SeedConfig) {
		this.dataSource = config.dataSource;
	}

	async initialize() {
		this.dataSource.initialize();
	}

	async destroy() {
		this.dataSource.destroy();
	}

	createFactory<T>(
		factory: new (dataSource: DataSource) => FactoryInterface<T>,
	): FactoryInterface<T> {
		return new factory(this.dataSource);
	}
}
