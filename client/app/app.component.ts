import { Component } from '@angular/core';
import { Vote, Option } from './model';

@Component({
  selector: 'my-app',
  template: `
    <h2>{{vote.title}}</h2>
    <div>
      <div *ngFor="let option of vote.options">
        <span class="">{{option.name}}</span>
        <!--<input type="radio" [(ngModel)]="option.selected">-->
        <input type="radio" [(ngModel)]="vote.selected" value="{{option.name}}">
      </div>
    </div>
    <div>
      <button (click)="onVote(vote.selected)" class="btn btn-primary">Rösta</button>
    </div>
  `
})

export class AppComponent {
  vote: Vote = {
    title: 'Överphös',
    options: ['Adhara', 'Bracco'].map((name) => new Option(name)),
    selected: null
  };

  onVote(selected: string): void {
    console.log(selected);
  }
}
