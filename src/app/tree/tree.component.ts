import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { TreeNode, TreeService } from './tree.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent  {
  pid: number = 0;
  _nodes: TreeNode[];
  constructor (private treeService: TreeService) {}
  @Input() set parentId(value: number) {
    this.pid = value;
    this._nodes = this.treeService.processNodes(this._nodes, this.pid);
  }
  
  @Input() set nodes(value: TreeNode[]) {
    this._nodes = [];
    this._nodes = this.treeService.processNodes(value, this.pid);
  }
  @Output() valueChange = new EventEmitter<TreeNode>();

  public onFolderButtonClick(folder) {
    folder['expand'] = !folder['expand'];
  }

  public trackNode(index, folder) {
    return folder.repositoryDetailId;
  }

  viewFile(node: TreeNode) {
    this.valueChange.emit(node);
  }
}
