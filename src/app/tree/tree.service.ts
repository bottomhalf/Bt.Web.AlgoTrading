import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreeService {
  public fetchNodes(): any {
    return [
      {
        "name": "Crop commodities",
        "children": [
          {
            "name": "BT",
            "children": []
          },
          {
            "name": "NT",
            "children": [
              {
                "name": "Vegetbles",
                "children": [
                  {
                    "name": "BT",
                    "children": []
                  },
                  {
                    "name": "NT",
                    "children": [
                      {
                        "name": "Seeweed",
                        "children": []
                      },
                      {
                        "name": "Lettuce and sprouts",
                        "children": []
                      },
                      {
                        "name": "Vegetable juice and drink",
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "RT",
                    "children": []
                  },
                  {
                    "name": "UF",
                    "children": []
                  }
                ]
              },
              {
                "name": "Herbs and spices",
                "children": []
              },
              {
                "name": "Nuts and seeds",
                "children": []
              },
              {
                "name": "Fruit",
                "children": []
              },
              {
                "name": "Processing crop",
                "children": []
              },
              {
                "name": "Food crop",
                "children": []
              },
              {
                "name": "Stalk and stem crop",
                "children": []
              }
            ]
          },
          {
            "name": "UF",
            "children": []
          },
          {
            "name": "USE",
            "children": []
          }
        ]
      },
      {
        "name": "A file"
      }
    ];
  }

  buildTree(data: Array<any>): Array<TreeNode> {
    const map = new Map<number, TreeNode>();
    const roots: TreeNode[] = [];

    for (const item of data) {
      const node: TreeNode = {
        repositoryDetailId: item.RepositoryDetailId,
        name: item.FileName,
        parentId: item.ParentId,
        repositoryId: item.RepositoryId,
        extension: item.Extension,
        fileContentId: item.FileContentId,
        BaseFolder: item.BaseFolder,
        children: [],
        expand: false // initially false
      };
      map.set(node.repositoryDetailId, node);
    }

    for (const item of data) {
      const node = map.get(item.RepositoryDetailId)!;
      if (item.ParentId === 0) {
        roots.push(node);
      } else {
        const parent = map.get(item.ParentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    }

    return roots;
  }
  public processNodes(nodes: Array<any>, parentId: number): Array<any> {
    // nodes.map(node => {
    //   if (node.parentId != parentId) {
    //     node['expand'] = true;
    //   }
    // });
    // return nodes;
    return markExpandToRootAndReturn(nodes, parentId);
  }
}
  function markExpandToRootAndReturn(roots: TreeNode[], parentId: number): TreeNode[] {
    function mark(nodes: TreeNode[], targetId: number): boolean {
      for (const node of nodes) {
        // Match found
        if (node.repositoryDetailId === targetId) {
          node.expand = true;
          return true;
        }

        // Search in children
        const found = mark(node.children, targetId);
        if (found) {
          node.expand = true;
          return true;
        }
      }
      return false;
    }

    mark(roots, parentId); // Trigger expansion marking
    return roots;          // Return updated tree
  }

export interface TreeNode {
  repositoryDetailId: number;
  repositoryId: number;
  parentId: number;
  fileContentId: number;
  name: string;
  extension: string;
  expand?: boolean;
  BaseFolder?: string;
  children?: TreeNode[];
}
