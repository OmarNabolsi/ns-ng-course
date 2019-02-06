import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { ChallengeTabsComponent } from "./challenge-tabs/challenge-tabs.component";
import { TodayComponent } from "./today/today.component";
import { CurrentChallengeComponent } from "./current-challenge/current-challenge.component";
import { Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "tabs",
    component: ChallengeTabsComponent,
    children: [
      { path: "today", component: TodayComponent, outlet: "today" },
      {
        path: "current-challenge",
        component: CurrentChallengeComponent,
        outlet: "currentChallenge"
      }
    ]
  },
  {
    path: ":mode",
    loadChildren:
      "~/app/challenges/challenge-edit/challenge-edit.module#ChallengeEditModule"
  },
  { path: "", redirectTo: "/challenges/tabs", pathMatch: "full" }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class ChallengesRoutingModule {}
