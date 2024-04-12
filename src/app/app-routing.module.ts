import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { EmptComponentsComponent } from './empt-components/empt-components.component';
import { HomeComponent } from './home/home.component';
import { AuthenService } from './services/authen.service';
import { RegisterComponent } from './register/register.component';
import { PostContributedArticleComponent } from './post-contributed-article/post-contributed-article.component';
import { BaseChartDirective } from 'ng2-charts'
import { DetailPostComponent } from './detail-post/detail-post.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthenService], },
  { path: 'login', component: LoginComponentComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contribution', component: PostContributedArticleComponent, canActivate: [AuthenService]  },
  { path: 'detailContribution/:id', component: DetailPostComponent , canActivate: [AuthenService]  },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthenService]  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes),BaseChartDirective],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponentComponent, EmptComponentsComponent, HomeComponent]
