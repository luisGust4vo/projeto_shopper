import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nome: string;

  @Column()
  description: string;

  @Column()
  car: string;

  @Column("float")
  rating: number;

  @Column()
  minDistance: number;

  @Column("float")
  pricePerKm: number;

  constructor(
    nome: string,
    description: string,
    car: string,
    rating: number,
    minDistance: number,
    pricePerKm: number
  ) {
    this.nome = nome;
    this.description = description;
    this.car = car;
    this.rating = rating;
    this.minDistance = minDistance;
    this.pricePerKm = pricePerKm;
  }
}
