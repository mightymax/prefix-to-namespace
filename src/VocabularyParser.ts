import * as vscode from 'vscode';

export class VocabularyParser {
  prefixes: string[] = [];
  private completeItems: vscode.CompletionItem[] = [];

  constructor (prefixes: string[], source: any) {
    this.prefixes = prefixes ;
    this.completeItems = this.parseSource(source);
  }

  private parseSource(source: any): vscode.CompletionItem[]
  {
    const completeOptions = [];
    for (let i in source["@graph"]) {
      const id = source["@graph"][i]['@id'].toString();
      if (this.prefixes.filter(prefix => id.startsWith(`${prefix}:`)).length === 0 ) {
        continue;
      }

      let label = id;
      this.prefixes.forEach(prefix => label = id.replace(`${prefix}:`, ''));

      let item = new vscode.CompletionItem(label, vscode.CompletionItemKind.EnumMember);

      //look up comment:
      let comment = '';
      ['rdfs:comment', 'comment', 'skos:ScopeNote'].forEach(prop => {
        if (source["@graph"][i][prop]) {
          comment = source["@graph"][i][prop];
        }
      });
      if (comment) {
        if (typeof comment === 'string') {
          comment = comment.toString().replace(/<[^>]+>/g, '');
        } else if (comment['@value']) {
        comment = comment['@value'];
        }
        item.detail = comment;
      }
      item.insertText = label + " ";
      completeOptions.push(item);
    }
    return completeOptions;
  }

  getCompleteItems():  any {
    var self = this;
    return {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        if (self.prefixes.filter((prefix: string) => linePrefix.endsWith(`${prefix}:`)).length === 0) {
          return undefined;
        }
        return self.completeItems;
      }
    } ;
  }
}
