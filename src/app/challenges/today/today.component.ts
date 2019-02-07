import { Component, ModuleWithComponentFactories } from "@angular/core";

@Component({
    selector: 'ns-today',
    templateUrl: './today.component.html',
    styleUrls: ['./today.component.scss'],
    moduleId: module.id
})
export class TodayComponent {

    onActionSelected(action: 'complete' | 'fail' | 'cancel') {
        console.log(action);
    }
}