import { AuthGuard } from './services/auth.guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'ems',
    loadComponent: () =>
      import('./layout/layout.component').then((c) => c.LayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./dashboad/dashboad.component').then((c) => c.DashboadComponent),
      },
      {
        path: 'filelist/jsoneditor',
        loadComponent: () =>
          import('./json-editor/json-editor.component').then((c) => c.JsonEditorComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'filelist',
        loadComponent: () =>
          import('./file-list/file-list.component').then((c) => c.FileListComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'dashboad',
        loadComponent: () =>
          import('./dashboad/dashboad.component').then((c) => c.DashboadComponent),
      },
      {
        path: 'access_token_handler',
        loadComponent: () =>
          import('./access-token-handler/access-token-handler.component').then((c) => c.AccessTokenHandlerComponent),
      },
      {
        path: 'token_history',
        loadComponent: () =>
          import('./token-history/token-history.component').then((c) => c.TokenHistoryComponent),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./not-found/not-found.component').then((c) => c.NotFoundComponent),
      }
    ],
  }
];
