import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ErrorToast, FireBrowser, HideModal, ShowModal, Toast } from '../services/common.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDropdownModule, NgbProgressbarConfig, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { BreadcrumsComponent } from '../breadcrums/breadcrums.component';
import { TreeComponent } from '../tree/tree.component';
import { TreeNode, TreeService } from '../tree/tree.service';
import { RepositoryDetail } from '../json-editor/json-editor.component';
import { RecordNotFoundComponent } from '../record-not-found/record-not-found.component';
import { Pdf, Docx, Doc, Txt, JImage, PImage, AImage, WebP, GIF, Ppt, Pptx, Excelx, Excel, XML, SQL, JSONFile, SVG, DIR } from '../services/constant';
import { environment } from 'src/environments/environment';
import { retry } from 'rxjs';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [FormsModule, NgbTooltipModule, CommonModule, BreadcrumsComponent, TreeComponent, NgbDropdownModule, NgbProgressbarModule,
            RecordNotFoundComponent
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  providers: [NgbProgressbarConfig],
})
export class FileListComponent implements OnInit {
  private baseUrl: string = "";
  fileDetails: Array<RepositoryDetail> = [];
  isPageReady: boolean = false;
  selectDeleteFile: RepositoryDetail = null;
  isLoading: boolean = false;
  rootPath: any = {"Name": "root", "Id": 0};
  routePath: Array<any> = [];
  tokenFileDetail: TokenFileDetail = {Key: null, code: null, ExpiryTimeInSeconds: null, Issuer: null, ParentId: 0, RepositoryId: 0};
  submitted: boolean = false;
  parentId: number = 0;
  folderDetail: RepositoryDetail = {Content: null, Extension: 'dir', RepositoryDetailId: 0, FileName: null, OldFileName: null, ParentId: 0};
  private repoId: number = 0;
  public nodes: any;
  fileSize: string;
  fileName: string;
  isFileReady: boolean = false;
  isDisable: boolean = true;
  file: File;
  viewer: any = null;
  imagePreviewUrl: string = "";
  fileContent: string;
  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private treeService: TreeService,
              config: NgbProgressbarConfig
  ) {
    // customize default values of progress bars used by this component tree
		config.max = 100;
		config.striped = true;
		config.animated = true;
		config.type = 'primary';
		config.height = '4px';
    this.repoId = Number(this.route.snapshot.queryParams['repoId']);
    this.parentId = Number(this.route.snapshot.queryParams['pId']);
  }
  ngOnInit(): void {
    // this.nodes = this.treeService.fetchNodes();
    this.baseUrl = environment.baseURL;
    this.load_files_dirs(this.parentId);
  }

  private GetImageBasePath() {
    return environment.resourcesBaseUrl + 'bts/resources/';
  }

  load_files_dirs(parentId: number) {
    this.parentId = 0;
    this.parentId = parentId;
    this.http.get(this.baseUrl + `repositoryDetail/getFilesDirs/${parentId}/${this.repoId}`).subscribe({
      next: (res: any) => {
        // this.location.go(`filelist/${parentId}`)
        Toast("Data loaded successfully");
        this.bindData(res);
        this.isPageReady = true;
        this.router.navigate([], {
          queryParams: { repoId: this.repoId, pId: parentId, folder: this.routePath.map(x => x.Name).join("/") },
          queryParamsHandling: 'merge', // or 'preserve'
        });
      },
      error: error => {
        ErrorToast(error.error.ResponseBody);
        this.isPageReady = true;
      }
    })
  }

  private bindData(res: any) {
    this.fileDetails = []
    this.fileDetails = res.responseBody.RepositoryDetail;
    this.routePath = [this.rootPath];
    if(res.responseBody.RepositoryPath.RepositoryPath != null) {
      let paths: Array<any> = JSON.parse(res.responseBody.RepositoryPath.RepositoryPath);
      this.routePath.push(...paths.reverse());
    }
    this.nodes = this.treeService.buildTree(res.responseBody.NodeDetail);
  }

  loadNext(item: RepositoryDetail) {
    if (item.Extension == 'dir') {
      this.load_files_dirs(item.RepositoryDetailId);
    } else if(item.BaseFolder == null) {
      this.viewFile(item);    
    } else {
      this.viewSystemFile(item);
    }
  }

  loadRoute(id: number) {
    this.load_files_dirs(id);
  }

  viewFile(item: RepositoryDetail) {
    if (item) {
      this.router.navigate(["/ems/filelist/jsoneditor"], {queryParams: {
        id: item.RepositoryDetailId, 
        pId: item.ParentId, 
        repoId: this.repoId, 
        fileContentId: item.FileContentId
      }});
    }
  }

  addNewFile() {
    this.router.navigate(["/ems/filelist/jsoneditor"], {queryParams: {id: 0, pId: this.parentId, repoId: this.repoId, fileContentId: 0}});
  }

  deleteFilePopup(item: RepositoryDetail) {
    this.selectDeleteFile= null;
    this.selectDeleteFile = item;
    ShowModal("deleteFileModal");
  }

  deleteFile() {
    if (this.selectDeleteFile) {
      this.isLoading = true;
      this.http.post(this.baseUrl + "repositoryDetail/deleteFile", this.selectDeleteFile).subscribe({
        next: (res: any) => {
          this.fileDetails = res.responseBody;
          Toast("File deleted successfully");
          HideModal("deleteFileModal");
          this.isLoading = false;
        },
        error: error => {
          ErrorToast(error.error.ResponseBody);
          this.isLoading = false;
        }
      })
    }
  }

  addTokenFilePoppup() {
    this.submitted = false;
    const d = new Date();
    this.tokenFileDetail = {Key: null, code: null, ExpiryTimeInSeconds: null, Issuer: null, ParentId: 0, RepositoryId: 0};
    this.tokenFileDetail.FileName = `token_${d.getTime()}`;
    ShowModal("manageTokenFileModal");
  }

  saveTokenDetail() {
    this.submitted = true;
    if (!this.tokenFileDetail.Key) {
      ErrorToast("Please add secret key");
      return;
    }

    if (!this.tokenFileDetail.Issuer) {
      ErrorToast("Please add issuer");
      return;
    }

    if (!this.tokenFileDetail.code) {
      ErrorToast("Please add company code");
      return;
    }

    if (this.tokenFileDetail.ExpiryTimeInSeconds == null || this.tokenFileDetail.ExpiryTimeInSeconds < 6000) {
      ErrorToast("Please specify an expiry time greater than 6000.");
      return;
    }
    this.saveContent();
  }

  generateSecretKey() {
    const length = 32;
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array)
    this.tokenFileDetail.Key = Array.from(array, b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('').substring(0, length);
  }

  private saveContent() {
    this.isLoading = true;
    this.tokenFileDetail.ParentId = this.parentId;
    this.tokenFileDetail.RepositoryId = this.repoId;

    this.http.post(this.baseUrl + "repositoryDetail/saveTokenFile", this.tokenFileDetail).subscribe({
      next: (res: any) => {
        this.bindData(res);
        Toast("Token detail inert/updated successfully");
        HideModal("manageTokenFileModal");
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  addFolderPopup() {
    this.submitted = false;
    this.folderDetail = {Content: null, Extension: 'dir', RepositoryDetailId: 0, FileName: null, OldFileName: null, ParentId: 0};
    ShowModal("manageFolderModal");
  }

  editFolderPopup(item: RepositoryDetail) {
    this.submitted = false;
    this.folderDetail = item;
    ShowModal("manageFolderModal");
  }

  manageFolderDetail() {
    this.submitted = true;

    if (!this.folderDetail.FileName) {
      ErrorToast('Please add folder name');
      return;
    }

    this.isLoading = true;
    this.folderDetail.ParentId = this.parentId;
    this.folderDetail.RepositoryId = this.repoId;
    
    this.http.post(this.baseUrl + "repositoryDetail/manageFolderDetail", this.folderDetail).subscribe({
      next: (res: any) => {
        this.bindData(res);
        Toast("Token detail inert/updated successfully");
        HideModal("manageFolderModal");
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        ErrorToast(error.error.ResponseBody);
      }
    })
  }

  handleValueChange(item: TreeNode) {
    if (item.extension == 'dir') {
      this.load_files_dirs(item.repositoryDetailId);
    } else if (item.BaseFolder == null) {
       this.router.navigate(["/ems/filelist/jsoneditor"], {queryParams: {
        id: item.repositoryDetailId, 
        pId: item.parentId, 
        repoId: item.repositoryId, 
        fileContentId: item.fileContentId
      }});   
    } else {
      let repoDetail: RepositoryDetail = {
        FileName: item.name,
        Extension: item.extension,
        Content: '',
        OldFileName: '',
        ParentId: 0,
        RepositoryDetailId: 0,
        BaseFolder: item.BaseFolder
      }
      this.viewSystemFile(repoDetail);
    }
  }

  cleanFileHandler() {
    const uploadExcelElement = document.getElementById('uploadexcelreader') as HTMLInputElement;
    if (uploadExcelElement) {
      uploadExcelElement.value = '';
    }
    this.fileSize = "";
    this.fileName = "";
    this.isFileReady = false;
    event.stopPropagation();
    event.preventDefault();
    this.isDisable = true;
  }

  tokenFilePopup() {
    this.cleanFileHandler();
    ShowModal("uploadCustomFileModal");
  }

  excelfireBrowserFile() {
    FireBrowser("uploadexcelreader");
  }

  readExcelData(e: any) {
    this.file = e.target.files[0];
    if (this.file !== undefined && this.file !== null) {
      this.fileSize = (this.file.size / 1024).toFixed(2);
      this.fileName = this.file.name;
      this.isFileReady = true;
      this.isDisable = false;
    }
  }

  uploadExcel() {
    this.isLoading = true;
    if (this.file) {
      let fileDetail = {
        ParentId: this.parentId,
        RepositoryId: this.repoId
      }
      let formData = new FormData();
      formData.append("file", this.file);
      formData.append("fileDetail", JSON.stringify(fileDetail));
      this.http.post(this.baseUrl + "repositoryDetail/uploadCustomFile", formData).subscribe({
        next: (res: any) => {
          this.bindData(res);
          Toast("File uploaded successfully");
          HideModal("uploadCustomFileModal");
          this.isLoading = false;
        },
        error: error => {
        this.isLoading = false;
        ErrorToast(error.error.ResponseBody);
      }
      })
    }
  }

  viewSystemFile(file: RepositoryDetail) {
    url = `${file.BaseFolder}\\${file.FileName}.${file.Extension}`;
    switch(file.Extension) {
      case Pdf:
        this.viewer = document.getElementById("file-container");
        this.viewer.classList.remove('d-none');
        this.viewer.querySelector('iframe').classList.remove('bg-white');
        this.viewer.querySelector('iframe').setAttribute('src',
          `${this.GetImageBasePath()}${encodeURI(url)}`);
          break;
      case Txt:
      case JSONFile:
        this.viewFile(file);
      case SQL:
      case XML:
        var url = `${this.GetImageBasePath()}${encodeURI(url)}`;
        this.readFileContent(url);
        break;
      case JImage:
      case PImage:
      case AImage:
      case WebP:
      case GIF:
      case SVG:
        this.imagePreviewUrl = `${this.GetImageBasePath()}${encodeURI(url)}`;
        ShowModal("imageViewerModal");
        break;
      case Ppt:
      case Pptx:
      case Excelx:
      case Excel:
      case Docx:
      case Doc:
        let sampleFilePath = `${this.GetImageBasePath()}${encodeURI(url)}`;
        const a = document.createElement('a');
        a.href = sampleFilePath;
        a.download = `${file.FileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(sampleFilePath);
        break;
    }
  }

  closePdfViewer() {
    event.stopPropagation();
    this.viewer.classList.add('d-none');
    this.viewer.querySelector('iframe').setAttribute('src', '');
  }

  readFileContent(url: string) {
    const safeUrl = encodeURI(url);
    this.http.get(safeUrl, { responseType: 'text' }).pipe(retry(3)).subscribe({
      next: (data: any) => {
        this.fileContent = data
        ShowModal("xmlViewModal");
      },
      error: (err) => this.fileContent = 'Failed to load file: ' + err.message
    });
  }

  getFileIcon(extension: string): string {
    let icon = "";
    switch (extension) {
      case Pdf:
        icon = "bi bi-file-pdf"
        break;
      case Txt:
        icon = "bi bi-filetype-txt"
        break;
      case JSONFile:
        icon = "bi bi-filetype-json"
        break;
      case XML:
        icon = "bi bi-filetype-xml"
        break;
      case SQL:
        icon = "bi bi-filetype-sql"
        break;
      case JImage:
      case PImage:
      case AImage:
      case WebP:
      case GIF:
      case SVG:
        icon = "bi bi-image"
        break;
      case Ppt:
      case Pptx:
        icon = "bi bi-file-earmark-ppt"
        break;
      case Excelx:
      case Excel:
        icon = "bi bi-file-earmark-excel"
        break;
      case Docx:
      case Doc:
        icon = "bi bi-file-earmark-word"
        break;
      case DIR:
        icon = "bi bi-folder-fill folder-color"
        break;
      default:
        icon = "bi bi-file-earmark"
    }

    return icon;
  }
}

export interface TokenFileDetail {
  Key: string;
  Issuer: string;
  code: string;
  ExpiryTimeInSeconds: number;
  ParentId: number;
  RepositoryId: number;
  FileName?: string;
}