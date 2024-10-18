import { faker } from "@faker-js/faker";
import type { DataSource } from "typeorm";

import { Factory } from "../../src/factory";
import { Post } from "../entities/post.entity";

export class PostFactory extends Factory<Post> {
	constructor(dataSource: DataSource) {
		super(dataSource, Post);

		this.afterCreate(async (post) => {
			this.logPost(post);
		});
	}

	private logPost(post: Post) {
		console.log(`Post created ${post.id}`);
	}

	protected defaultData(): Partial<Post> {
		return {
			title: faker.lorem.words(3),
			content: faker.lorem.paragraph(),
		};
	}
}
