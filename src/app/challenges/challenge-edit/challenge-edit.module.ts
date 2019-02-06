import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SharedModule } from "~/app/shared/shared.module";
import { ChallengeEditComponent } from "./challenge-edit.component";

@NgModule({
  declarations: [ChallengeEditComponent],
  imports: [
    NativeScriptCommonModule,
    NativeScriptCommonModule,
    NativeScriptRouterModule.forChild([
      { path: "", component: ChallengeEditComponent }
    ]),
    SharedModule
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ChallengeEditModule {}
