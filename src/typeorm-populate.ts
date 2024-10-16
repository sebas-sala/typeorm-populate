import type { DataSource, ObjectLiteral } from "typeorm";
import type { Factory } from "./factory";

export interface Config {
	dataSource: DataSource;
	factories: {
		[key: string]: new (dataSource: DataSource) => Factory<ObjectLiteral>;
	};
}

export class TypeormPopulate {
	private dataSource: DataSource;
	private factories: {
		[key: string]: Factory<ObjectLiteral>;
	};

	constructor(config: Config) {
		this.dataSource = config.dataSource;
		this.factories = {};

		for (const [key, Factory] of Object.entries(config.factories)) {
			this.factories[key] = new Factory(this.dataSource);
		}
	}

	async seed(factoryName: string, amount: number): Promise<ObjectLiteral[]> {
		const factory = this.factories[factoryName];

		if (!factory) {
			throw new Error(`Factory ${factoryName} not found`);
		}

		const list = [] as ObjectLiteral[];

		await this.dataSource.transaction(async (manager) => {
			const entities = await factory.createMany(amount);
			list.push(...entities);
		});

		return list;
	}

	async seedMany(
		factoryData: { entity: string; amount: number }[],
	): Promise<void> {
		for (const { entity, amount } of factoryData) {
			await this.seed(entity, amount);
		}
	}

	async seedAll(count: number): Promise<void> {
		const promises = Object.keys(this.factories).map((name) =>
			this.seed(name, count),
		);

		await Promise.all(promises);
	}

	isInitialized(): boolean {
		return this.dataSource.isInitialized;
	}

	async initialize(): Promise<void> {
		await this.dataSource.initialize();
	}

	async destroy(): Promise<void> {
		await this.dataSource.destroy();
	}
}
