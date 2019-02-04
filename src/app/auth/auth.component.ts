import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular";

@Component({
    selector: 'ns-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css'],
    moduleId: module.id
})
export class AuthComponent {

    constructor(private router: RouterExtensions) {}

    onSignin() {
        this.router.navigate(['/today'], { clearHistory: true });
    }
}