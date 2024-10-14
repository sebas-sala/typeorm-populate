import type { DataSource, ObjectLiteral } from "typeorm";
import type { Factory } from "./factory";

export interface SeedConfig {
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

	constructor(config: SeedConfig) {
		this.dataSource = config.dataSource;
		this.factories = {};

		for (const [key, Factory] of Object.entries(config.factories)) {
			this.factories[key] = new Factory(this.dataSource);
		}
	}

	async initialize() {
		await this.dataSource.initialize();
	}

	async destroy() {
		await this.dataSource.destroy();
	}
}
