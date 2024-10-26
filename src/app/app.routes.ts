import { Routes } from '@angular/router';
import { AccomodationComponent } from './accomodation/accomodation.component';
import { HomeComponent } from './home/home.component';
import { GalleryComponent } from './gallery/gallery.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AgentRegComponent } from './agent-reg/agent-reg.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path:'home',component:HomeComponent},
    {path:'accomodation',component:AccomodationComponent},
    {path:'gallery',component:GalleryComponent},
    {path:'feedback',component:FeedbackComponent},
    {path:'agent-reg',component:AgentRegComponent},
    {path:'admin',component:AdminComponent},
    {path:'login',component:LoginComponent},
    {path:'admin',component:AdminComponent},
    {path:'reg',component:RegComponent}
];
