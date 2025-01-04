import type { DataSource, ObjectLiteral } from "typeorm";
import type { Factory } from "./factory";

export type Factories = Factory<any>[];

export interface Config {
  dataSource: DataSource;
  factories: Factories;
}

export class TypeormPopulate {
  private dataSource: DataSource;
  private factories: Factories;

  constructor(config: Config) {
    this.dataSource = config.dataSource;
    this.factories = config.factories;
  }

  async seed(
    factoryName: string,
    amount: number,
    options?: {
      relations?: boolean;
      relationsAmount?: number;
    }
  ): Promise<ObjectLiteral[]> {
    const factory = this.factories.find(
      (f) =>
        typeof f.repository.target === "function" &&
        f.repository.target.name === factoryName
    );

    if (!factory) {
      throw new Error(`Factory ${factoryName} not found`);
    }

    const factoryRelations = factory.relations;
    const list: ObjectLiteral[] = [];

    await this.dataSource.transaction(async (manager) => {
      const entities = await factory.createMany(amount);

      if (!options?.relations) {
        list.push(...entities);
        return list;
      }

      const relationAmount = options.relationsAmount || amount;

      for (const relation of factoryRelations) {
        if (typeof relation.target !== "function") continue;

        const relationFactory = this.factories.find(
          (f) => f.repository.target === relation.target
        );
        if (!relationFactory) continue;

        for (const entity of entities) {
          const relatedEntities = await relationFactory.createMany(
            relationAmount
          );

          (entity as Record<string, unknown>)[relation.propertyName] =
            relation.isOneToMany ? relatedEntities : relatedEntities[0];
        }
      }

      await manager.save(entities);
      list.push(...entities);
    });

    return list;
  }

  async seedMany(
    factoryData: { entity: string; amount: number }[]
  ): Promise<void> {
    for (const { entity, amount } of factoryData) {
      await this.seed(entity, amount);
    }
  }

  async seedAll(count: number): Promise<void> {
    const promises = this.factories.map((factory) => {
      const factoryTarget = factory.repository.target;
      if (typeof factoryTarget !== "function") return;

      return this.seed(factoryTarget.name, count);
    });

    await Promise.all(promises);
  }

  isInitialized(): boolean {
    return this.dataSource.isInitialized;
  }

  async initialize(): Promise<void> {
    await this.dataSource.initialize();

    for (const factory of Object.values(this.factories)) {
      await factory.initialize();
    }
  }

  async destroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}
