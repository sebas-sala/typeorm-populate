import { faker } from "@faker-js/faker";
import type { DataSource } from "typeorm";

import { Factory } from "@/src/factory";
import { Post } from "../entities/post.entity";

export class PostFactory extends Factory<Post> {
	constructor(dataSource: DataSource) {
		super(dataSource, Post);
	}

	protected defaultData(): Partial<Post> {
		return {
			title: faker.lorem.words(3),
			content: faker.lorem.paragraph(),
		};
	}
}
