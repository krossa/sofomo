import { Component, OnInit, OnDestroy } from '@angular/core';

import { PeopleService } from './services/people.service';
import { Subscription } from 'rxjs';
import { AgeGroup } from './age-group.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoading = false;
  ageGroups: AgeGroup[];
  ageGroupsSub: Subscription;
  loadingFinishedSub: Subscription;

  constructor(private peopleService: PeopleService) { }

  ngOnInit() {
    this.ageGroupsSub = this.peopleService.ageGroupsChanged
    .subscribe(ags => {
      this.ageGroups = ags;
    });

    this.loadingFinishedSub = this.peopleService.loadingFinished
    .subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.ageGroupsSub.unsubscribe();
    this.loadingFinishedSub.unsubscribe();
  }

  getData() {
    this.peopleService.clearPeople();
    this.isLoading = true;
    this.peopleService.getPeople();
  }
}
