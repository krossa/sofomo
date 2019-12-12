import { Person } from './person.model';

export interface ResponseSW {
  next: string;
  results: Person[];
}
