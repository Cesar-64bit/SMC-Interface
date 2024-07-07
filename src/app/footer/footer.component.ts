import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    public autor: any = { institucion: 'Universida Politécnica de Sinaloa', carrera: 'Ingenieria Biomédica' };
}
