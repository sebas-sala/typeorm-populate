import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Post {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	title!: string;

	@Column()
	content!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	// @ManyToOne(
	// 	() => User,
	// 	(user) => user.posts,
	// )
	// user!: User;
}
