import * as vscode from 'vscode';
import * as prefixes from "./static/prefixes.json" ;

export class Prefix 
{
  private completeItems: vscode.CompletionItem[] = [];

  constructor() 
  {
    for (let prefix in prefixes) {
      const ns = prefixes[<keyof typeof prefixes>prefix];
      const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Method);
      item.detail = ns ;
      item.insertText = this.getDeclaration(prefix, '', '\n');
      this.completeItems.push(item);
    }
  }

  hasPrefix(prefix: string): boolean {
    return prefix in prefixes;
  }

  getDeclaration(prefix: string, prepend: string = '', append = ''): string 
  {
    return this.hasPrefix(prefix) ? 
      `${prepend}prefix ${prefix}: <${prefixes[<keyof typeof prefixes>prefix]}> .${append}`
      : '' ;
  }

  getCompleteItems():  any {
    var self = this;
    return {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        if (document.lineAt(position).text !== '@' && document.lineAt(position).text !== 'prefix' ) {
					return undefined;
				}
        return self.completeItems;
      }
    } ;
  }
}