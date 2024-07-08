import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
//import { DirectivaComponent } from './directiva/directiva.component';
import { PacientesComponent } from './pacientes/paciente.component';
import { PacienteService } from './pacientes/paciente.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormComponent } from './pacientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component'
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeES from '@Angular/common/locales/es-MX';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { HeartRateChartComponent } from './heart-rate-chart/heart-rate-chart.component';

registerLocaleData(localeES, 'es');

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'info', component: HomeComponent },
  { path: 'info/:id', component: HomeComponent },
  //{ path: 'directivas', component: DirectivaComponent },
  { path: 'pacientes', component: PacientesComponent },
  { path: 'pacientes/page/:page', component: PacientesComponent },
  { path: 'pacientes/form', component: FormComponent },
  { path: 'pacientes/form/:id', component: FormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PacientesComponent,
    FormComponent,
    PaginatorComponent,
    HomeComponent,
    LoginComponent,
    HeartRateChartComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [PacienteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
