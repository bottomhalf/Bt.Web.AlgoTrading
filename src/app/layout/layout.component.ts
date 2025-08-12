import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarConfig, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../services/loader.service';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';
import { ErrorToast, HideModal, ShowModal, Toast } from '../services/common.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbProgressbarModule, NgbTooltipModule, FormsModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
    providers: [NgbProgressbarConfig], 
})
export class LayoutComponent implements OnInit {
  isScrolled = false;
  mainNavItem: Array<MainNavItem> = [{
    id: 1,
    icon: 'bi bi-code',
    name: 'Root',
    link: '/ems/filelist'
  }, {
    id: 2,
    icon: 'fa-regular fa-circle-dot',
    name: 'Issues',
    link: '/ems/issues'
  }, {
    id: 3,
    icon: 'fa-solid fa-code-pull-request',
    name: 'Pull requests',
    link: '/ems/pullrequest'
  }, {
    id: 4,
    icon: 'fa-solid fa-key',
    name: 'Token',
    link: '/ems/token_history'
  }, {
    id: 5,
    icon: 'bi bi-kanban',
    name: 'Projects',
    link: '/ems/project'
  }, {
    id: 6,
    icon: 'bi bi-shield-lock',
    name: 'Security',
    link: '/ems/security'
  }, {
    id: 7,
    icon: 'fa-solid fa-chart-line',
    name: 'Insights',
    link: '/ems/insight'
  }, {
    id: 8,
    icon: 'fa-solid fa-gear',
    name: 'Settings',
    link: '/ems/setting'
  }];;
  activeTab: number = 1;
  isDahsboard: boolean = false;
  currentRepoName: string = "";
  newRepoName: string = "";
  submitted: boolean = false;
  isLoading: boolean = false;
  private baseUrl: string = "";
  constructor(private auth: AuthService,
              private config: NgbProgressbarConfig,
              public loaderService: LoaderService,
              private router: Router,
              private http: HttpClient
  ){
    config.max = 100;
		config.striped = true;
		config.animated = true;
		config.type = 'primary';
		config.height = '4px';
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10; // adjust the value as needed
  }
  ngOnInit(): void {
    this.baseUrl = environment.baseURL;
    this.activatedTab(this.router.url);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe(() => {
      this.activatedTab(this.router.url);
    });
  }

  logout() {
    this.auth.logout();
  }

  navigatePage(item: MainNavItem) {
    this.activeTab = item.id;
    if (this.activeTab == 1) {
      let repoId = this.auth.getRepoId();
      this.router.navigate(["/ems/filelist"], {queryParams: {repoId: repoId, pId: 0}});
    } else {
      this.router.navigateByUrl(item.link);
    }
  }

  private activatedTab(currentUrl: string) {
    let navItem = this.mainNavItem.find(x => x.link == currentUrl);
    if (navItem) {
      this.activeTab = navItem.id;
    } else if (currentUrl.includes('filelist')) {
      this.activeTab = 1;
    }

    if (currentUrl.includes('repository')) {
      this.isDahsboard = true;
    } else {
      this.isDahsboard = false;
      this.currentRepoName = this.auth.getRepoName();
    }
  }

  editRepoNamePopup() {
    this.submitted= false;
    this.newRepoName = this.currentRepoName;
    ShowModal("manageRepositoryModal");
  }

  editRepoName() {
    this.submitted = true;
    if (this.newRepoName != null && this.newRepoName != "") {
      this.isLoading = true;
      this.http.get(this.baseUrl + `repository/reNameRepository/${this.auth.getRepoId()}/${this.newRepoName}`).subscribe({
        next:(res: any) => {
          this.currentRepoName = this.newRepoName;
          this.auth.setRepoName(this.newRepoName);
          Toast("Repository reanemed successfully");
          this.isLoading = false;
          HideModal("manageRepositoryModal")
        },
        error: error => {
          this.isLoading = false;
          ErrorToast(error.error.ResponseBody);
        }
      })
    }
  }
}

interface MainNavItem {
  id: number;
  name: string;
  link?: string;
  icon: string;
}