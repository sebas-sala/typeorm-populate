import type { DataSource, ObjectLiteral, Repository } from "typeorm";
import type { RelationMetadata } from "typeorm/metadata/RelationMetadata";

export abstract class Factory<Entity extends ObjectLiteral> {
  public repository: Repository<Entity>;
  public relations: RelationMetadata[] = [];

  private afterCreateHooks: Array<(entity: Entity) => Promise<void> | void> =
    [];
  private beforeCreateHooks: Array<
    (entity: Partial<Entity>) => Promise<void> | void
  > = [];

  constructor(dataSource: DataSource, entity: new () => Entity) {
    this.repository = dataSource.getRepository(entity);
  }

  protected abstract defaultData(): Partial<Entity>;

  protected afterCreate(hook: (entity: Entity) => Promise<void>) {
    this.afterCreateHooks.push(hook);
  }

  protected beforeCreate(hook: (entity: Partial<Entity>) => Promise<void>) {
    this.beforeCreateHooks.push(hook);
  }

  async initialize() {
    if (!this.relations || !this.relations.length) {
      this.relations = this.repository.metadata.relations;
    }
  }

  async createOne({
    data,
  }: {
    data?: Partial<Entity>;
  } = {}): Promise<Entity> {
    this.initialize();

    const entityData = {
      ...this.defaultData(),
      ...data,
    } as Entity;

    for (const hook of this.beforeCreateHooks) {
      await hook(entityData);
    }

    const entity = this.repository.create(entityData);
    const savedEntity = await this.repository.save(entity);

    for (const hook of this.afterCreateHooks) {
      await hook(savedEntity);
    }

    return savedEntity;
  }

  async createMany(
    count: number,
    {
      data,
    }: {
      data?: Partial<Entity>[];
    } = {}
  ): Promise<Entity[]> {
    const entities = [] as Entity[];
    for (let i = 0; i < count; i++) {
      const itemData = data?.[i];
      const entity = await this.createOne({ data: itemData });
      entities.push(entity);
    }
    return entities;
  }
}
