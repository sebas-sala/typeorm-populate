import type { DataSource } from "typeorm";

import { Factory } from "@/src/factory";
import { User } from "@/test/entities/user.entity";

export class UserFactory extends Factory<User> {
	constructor(dataSource: DataSource) {
		super(dataSource, User);
	}

	protected defaultData(): Partial<User> {
		return {
			firstName: "John",
			lastName: "Doe",
			email: "test@gmail.com",
		};
	}
}
