import { Component, Input } from '@angular/core';

import { Person } from '../person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  @Input() person: Person;

  getBackgroundColor() {
    if (Number.isNaN(this.person.bmi)) { return 'gray'; }
    if (this.person.bmi < 16) { return 'black'; }
    if (this.person.bmi < 25) { return 'green'; }
    if (this.person.bmi < 40) { return 'orange'; }
    return 'red';
  }

  getColor() {
    if (this.person.bmi < 16) { return 'white'; }
    return 'black';
  }
}
