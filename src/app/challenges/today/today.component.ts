import { Component, OnInit, OnDestroy } from "@angular/core";
import { ChallengeService } from "../challenge.service";
import { Day, DayStatus } from "../day.model";
import { Subscription } from "rxjs";

@Component({
  selector: "ns-today",
  templateUrl: "./today.component.html",
  styleUrls: ["./today.component.scss"],
  moduleId: module.id
})
export class TodayComponent implements OnInit, OnDestroy {
  currentDay: Day;
  private curChallengeSub: Subscription;

  constructor(private challengeService: ChallengeService) {}

  ngOnInit() {
    this.curChallengeSub = this.challengeService.currentChallenge.subscribe(
      challenge => {
        if (challenge) {
          this.currentDay = challenge.currentDay;
        }
      }
    );
  }

  onActionSelected(action: DayStatus) {
    this.challengeService.updateDayStatus(this.currentDay.dayInMonth, action);
  }

  getActionName() {
    if (this.currentDay.status === DayStatus.Completed) {
      return 'complete';
    }
    if (this.currentDay.status === DayStatus.Failed) {
      return 'fail';
    } else {
      return null;
    }
  }

  ngOnDestroy() {
    if (this.curChallengeSub) {
      this.curChallengeSub.unsubscribe();
    }
  }
}
