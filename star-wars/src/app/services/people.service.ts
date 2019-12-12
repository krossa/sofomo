import { Injectable } from '@angular/core';
import { map, tap, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

import { AgeGroup } from '../age-group.model';
import { DataStorageService } from './data-storage.service';
import { Person } from '../person.model';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  ageGroupsChanged = new Subject<AgeGroup[]>();
  loadingFinished = new Subject();
  ageGroups: AgeGroup[] = [];

  constructor(private dataStorageService: DataStorageService) {
    this.ageGroups.push({ name: '0 - 20BBY', minAge: 0, maxAge: 20, people: [] });
    this.ageGroups.push({ name: '20 - 40BBY', minAge: 20, maxAge: 40, people: [] });
    this.ageGroups.push({ name: '40 - 60BBY', minAge: 40, maxAge: 60, people: [] });
    this.ageGroups.push({ name: '60 - 80BBY', minAge: 60, maxAge: 80, people: [] });
    this.ageGroups.push({ name: '80 - 100BBY', minAge: 80, maxAge: 100, people: [] });
    this.ageGroups.push({ name: '100BBY++', minAge: 100, maxAge: null, people: [] });
    this.ageGroups.push({ name: 'unknown', minAge: null, maxAge: null, people: [] });
  }

  getPeople(url = 'https://swapi.co/api/people/') {
    this.dataStorageService.getPeople(url)
      .pipe(
        tap(data => {
          if (data.next) {
            this.getPeople(data.next);
          } else {
            this.loadingFinished.next();
          }
        }),
        map(data => {
          return data.results.map(p => {
            return {
              name: p.name,
              birth_year: p.birth_year,
              birth_year_value: this.getBirthYearValue(p.birth_year),
              bmi: this.getBmi(p.height, p.mass),
              height: p.height,
              mass: p.mass
            } as Person;
          });
        }),
        catchError(error => {
          console.log('Cought ERROR');
          console.log(error);
          this.loadingFinished.next();
          return throwError(error);
        })
      )
      .subscribe(persons => {
        persons.forEach(p => this.assingPersonToGroup(p));
        this.ageGroups.forEach(ag => ag.people.sort(this.comparePeople));
        this.ageGroupsChanged.next(this.ageGroups);
      });
  }

  clearPeople() {
    this.ageGroups.forEach(ag => ag.people = []);
    this.ageGroupsChanged.next(this.ageGroups);
  }

  // ------------------------------------- PRIVATE -------------------------------------

  private assingPersonToGroup(person: Person) {
    if (Number.isNaN(person.birth_year_value) || Number.isNaN(person.bmi)) {
      this.ageGroups.find(ag => ag.minAge === null && ag.maxAge === null)
        .people.push(person);
      return;
    }
    for (const ag of this.ageGroups) {
      if (ag.minAge < person.birth_year_value &&
        (ag.maxAge > person.birth_year_value || ag.maxAge === null)) {
        ag.people.push(person);
        break;
      }
    }
  }

  private comparePeople(a: Person, b: Person) {
    return a.birth_year_value - b.birth_year_value;
  }

  private getBmi(height: number, mass: number) {
    return mass / Math.pow(height / 100, 2);
  }

  private getBirthYearValue(birthYear: string): number {
    return Number(birthYear.replace(/BBY/g, ''));
  }
}
