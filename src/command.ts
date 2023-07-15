// this is the code that triggers the prefix using the Command Pallet
import * as $prefixes from "./static/prefixes.json" ;
import * as vscode from 'vscode';

const prefixes: Record<string, string> = $prefixes;

export function getSnippet(prefix: string) {
	const template = vscode.workspace.getConfiguration().get('conf.settingsEditor.prefixLookupMode') ?? 'prefix ex: <http://ex.com/>';
	return template === '@prefix ex: <http://ex.com/> .' ?
		`@prefix ${prefix}: <${prefixes[prefix]}> .\n` :
		`prefix ${prefix}: <${prefixes[prefix]}>\n` ;
}

type Item = {label: string, detail: string};

export const getItems = (): Item[] => {
  const items: Item[] = [];
  for (const [label, detail] of Object.entries(prefixes)) {
    items.push({ label, detail });
  }
  items.sort((itemA, itemB) => {
    if (itemA.label < itemB.label) {return -1;}
    if (itemA.label > itemB.label) {return 1;}
    return 0;
  });
  return items;
};

export default (items?: Item[]) => {
  if (!vscode.workspace) {return vscode.window.showErrorMessage('Please open a project folder first');}
  if (!vscode.window.activeTextEditor) {return;}

  const picker = vscode.window.createQuickPick();
  picker.matchOnDescription = true;
  picker.canSelectMany = vscode.workspace.getConfiguration().get('conf.settingsEditor.prefixLookupAllowMultiplePrefixes') ?? true;
  picker.onDidHide(() => picker.dispose());
  picker.onDidAccept(() => {
    picker.dispose();
    vscode.window.activeTextEditor!.edit(editBuilder => {
      editBuilder.replace(
        vscode.window.activeTextEditor!.selection, 
        picker.selectedItems.map(item => getSnippet(item.label)).join('')
      );
    });
  });

  picker.items = items ?? getItems();
  picker.show();
};
