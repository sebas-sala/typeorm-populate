import type { DataSource, ObjectLiteral } from "typeorm";
import type { Factory } from "./factory";

export type Factories<T extends Record<string, ObjectLiteral>> = {
  [K in keyof T]: Factory<T[K]>;
};

export interface Config<T extends Record<string, ObjectLiteral>> {
  dataSource: DataSource;
  factories: Factories<T>;
}

export class TypeormPopulate<T extends Record<string, ObjectLiteral>> {
  private dataSource: DataSource;
  private factories: Factories<T>;

  constructor(config: Config<T>) {
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
    const factory = this.factories[factoryName];

    if (!factory) {
      throw new Error(`Factory ${factoryName} not found`);
    }

    const factoryRelations = factory.relations;
    const list = [] as ObjectLiteral[];

    await this.dataSource.transaction(async (manager) => {
      const entities = await factory.createMany(amount);

      if (!options?.relations) {
        list.push(...entities);
        return list;
      }

      for (const relation of factoryRelations) {
        if (typeof relation.target !== "function") continue;

        const relationFactory = this.factories[relation.type as string];
        if (!relationFactory) continue;

        const relationAmount = options.relationsAmount || amount;

        for (let i = 0; i < amount; i++) {
          const entity = entities[i];

          const relatedEntities = await relationFactory.createMany(
            relationAmount
          );

          if (relation.isOneToMany) {
            (entity as Record<string, unknown>)[relation.propertyName] =
              relatedEntities;
          } else {
            (entity as Record<string, unknown>)[relation.propertyName] =
              relatedEntities[0];
          }
        }

        await manager.save(entities);
      }

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
    const promises = Object.keys(this.factories).map((name) =>
      this.seed(name, count)
    );

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
