import { Component, OnInit } from "@angular/core";
import { PageRoute, RouterExtensions } from "nativescript-angular";
import { ChallengeService } from "../challenge.service";
import { take } from "rxjs/operators";

@Component({
  selector: "ns-challenge-edit",
  templateUrl: "./challenge-edit.component.html",
  styleUrls: ["./challenge-edit.component.scss"],
  moduleId: module.id
})
export class ChallengeEditComponent implements OnInit {
  isCreating = true;
  title = "";
  description = "";

  constructor(
    private pageRoute: PageRoute,
    private router: RouterExtensions,
    private challengeService: ChallengeService
  ) {}

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(paramMap => {
    //     console.log(paramMap.get('mode'));
    // });
    this.pageRoute.activatedRoute.subscribe(activatedRoute => {
      activatedRoute.paramMap.subscribe(paramMap => {
        if (!paramMap.get("mode")) {
          this.isCreating = true;
        } else {
          this.isCreating = paramMap.get("mode") !== "edit";
        }

        if (!this.isCreating) {
          this.challengeService.currentChallenge
            .pipe(take(1))
            .subscribe(challenge => {
              this.title = challenge.title;
              this.description = challenge.description;
            });
        }
      });
    });
  }

  onSubmit(title: string, description: string) {
    if (this.isCreating) {
      this.challengeService.createNewChallenge(title, description);
    } else {
      this.challengeService.updateChallenge(title, description);
    }
    this.router.backToPreviousPage();
  }
}
