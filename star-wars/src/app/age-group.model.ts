import { Person } from './person.model';

export interface AgeGroup {
  name: string;
  maxAge: number;
  minAge: number;
  people: Person[];
}
