import { Component } from "@angular/core";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html",
})
export class AppComponent {
    activeChallenge: string = '';

    onChallengeInput(challengeDescription: string) {
        this.activeChallenge = challengeDescription;
        console.log(challengeDescription);
    }
 }
