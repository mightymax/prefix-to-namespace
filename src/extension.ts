import * as vscode from 'vscode';

import {prefixes} from './prefixes';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "ttl-prefix-generator" is now active!');

	let prefixGetter = vscode.commands.registerCommand('prefix.fetch', () => {
		if (!vscode.workspace) {
			return vscode.window.showErrorMessage('Please open a project folder first');
		}
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		if (editor.selection) {
			return makenamespace(editor.document.getText(editor.selection));
		}

		vscode.window.showInputBox({
			value: 'rdf',
			placeHolder: `For example: rdf`,

		}).then(prefix => prefix ? makenamespace(prefix) : null);
	});

	let autoComplete = vscode.languages.registerCompletionItemProvider(
		['turtle', 'trig'],
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const completeOptions = [];
				for (let prefix in prefixes) {
					const ns = prefixes[<keyof typeof prefixes>prefix];
					const item = new vscode.CompletionItem(prefix, vscode.CompletionItemKind.Method);
					item.detail = ns ;
					item.insertText = getPrefixDecleration(prefix, '') + "\n";
					completeOptions.push(item);
				}
				return completeOptions;
			}
		}, 
		'@');
		
	context.subscriptions.push(prefixGetter, autoComplete);
	
}

function getPrefixDecleration(prefix: string, prepend: string = '@'): string | undefined
{
	if (prefix in prefixes) {
		return `${prepend}prefix ${prefix}: <${prefixes[<keyof typeof prefixes>prefix]}> .`;
	}
}

function makenamespace(prefix: string) {
	const editor = vscode.window.activeTextEditor;

	if (prefix in prefixes) {
		const selection = editor!.selection;
		editor!.edit(editBuilder => {
			editBuilder.replace(selection, getPrefixDecleration(prefix)!);
		});
	} else {
		vscode.window.showErrorMessage(`No namespace for prefix '${prefix}' was found.`);
	}
}

export function deactivate() {}
