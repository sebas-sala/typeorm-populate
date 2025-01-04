import type { DataSource } from "typeorm";

import { Factory } from "../../src/factory";
import { User } from "../entities/user.entity";

export class UserFactory extends Factory<User> {
  constructor(dataSource: DataSource) {
    super(dataSource, User);

    this.beforeCreate(async (user) => {
      this.uppercaseNames(user);
    });
  }

  private uppercaseNames(user: Partial<User>) {
    user.firstName = user.firstName?.toUpperCase();
    user.lastName = user.lastName?.toUpperCase();
  }

  protected defaultData(): Partial<User> {
    return {
      firstName: "John",
      lastName: "Doe",
      email: "test@gmail.com",
    };
  }
}
