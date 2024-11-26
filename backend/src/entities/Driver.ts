import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("drivers") // Nome da tabela no banco de dados
export class Driver {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string; // Altere de 'nome' para 'name'

  @Column()
  description: string;

  @Column()
  car: string;

  @Column("float")
  rating: number;

  @Column("float")
  minDistance: number;

  @Column("float")
  pricePerKm: number;

  constructor(
    name: string,
    description: string,
    car: string,
    rating: number,
    minDistance: number,
    pricePerKm: number
  ) {
    this.name = name; // Atualize o construtor
    this.description = description;
    this.car = car;
    this.rating = rating;
    this.minDistance = minDistance;
    this.pricePerKm = pricePerKm;
  }
}
