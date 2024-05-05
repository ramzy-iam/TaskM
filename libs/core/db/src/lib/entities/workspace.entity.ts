import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base.entity";

@Entity()
export class Workspace extends BaseEntity {
  @Column()
  name: string;
}
