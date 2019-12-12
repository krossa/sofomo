import { Component, Input } from '@angular/core';
import { AgeGroup } from '../age-group.model';

@Component({
  selector: 'app-age-group',
  templateUrl: './age-group.component.html',
  styleUrls: ['./age-group.component.css']
})
export class AgeGroupComponent {
  @Input() ageGroup: AgeGroup;
}
