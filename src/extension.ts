/* eslint-disable curly */
import * as vscode from 'vscode';

import * as RDF from "./static/22-rdf-syntax-ns.json";
import * as RDFS from "./static/rdf-schema.json";
import * as OWL from "./static/owl.json";
import * as DCTERMS from "./static/dublin_core_terms.json";
import * as DC from "./static/dublin_core_elements.json";
import * as SDO from "./static/schemaorg-current-https.json";
import * as RICO from "./static/RiC-O_v0-2.json";
import * as SHACL from "./static/shacl.json";
import { VocabularyParser } from './VocabularyParser';
import { Prefix } from './Prefix';

const prefix_cc = new Prefix();

const documentSelectors =  ['turtle', 'trig'];

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "ttl-prefix-generator" is now active!');

	context.subscriptions.push(
		getPrefixDeclarationCommand(),
		vscode.languages.registerCompletionItemProvider(documentSelectors, prefix_cc.getCompleteItems(), '@'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['sdo', 'schema'], SDO)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['rico'], RICO)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['rdf'], RDF)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['rdfs'], RDFS)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['shacl'], SHACL)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['owl'], OWL)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['dc'], DC)).getCompleteItems(), ':'),
		vscode.languages.registerCompletionItemProvider(documentSelectors, (new VocabularyParser(['dcterms'], DCTERMS)).getCompleteItems(), ':')
	);
}

function getPrefixDeclarationCommand()
{
	return vscode.commands.registerCommand('prefix.fetch', () => {
		if (!vscode.workspace) return vscode.window.showErrorMessage('Please open a project folder first');
		if (!vscode.window.activeTextEditor) return;

		vscode.window.showInputBox({
			value: 'rdf',
			placeHolder: `For example: rdf`,

		}).then(prefix => prefix ? writePrefixDeclaration(prefix) : null);
	});
}

function writePrefixDeclaration(prefix: string) {
	const editor = vscode.window.activeTextEditor;
	if (prefix_cc.hasPrefix(prefix)) {
		const selection = editor!.selection;
		editor!.edit(editBuilder => {
			editBuilder.replace(selection, prefix_cc.getDeclaration(prefix, '@', '\n'));
		});
	} else {
		vscode.window.showErrorMessage(`No namespace for prefix '${prefix}' was found.`);
	}
}

export function deactivate() {}
