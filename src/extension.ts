/* eslint-disable curly */
import * as vscode from 'vscode';

import * as rdf from "./static/22-rdf-syntax-ns.json";
import * as rdfs from "./static/rdf-schema.json";
import * as owl from "./static/owl.json";
import * as dct from "./static/dublin_core_terms.json";
import * as cidoc from "./static/cidoc-crm.json";
import * as dc from "./static/dublin_core_elements.json";
import * as sdo from "./static/schemaorg-current-https.json";
import * as rico from "./static/RiC-O_v0-2.json";
import * as shacl from "./static/shacl.json";
import command, { getItems } from './command';

const parseSource = (source: any, prefix: string): vscode.CompletionItem[] => {
	const completeOptions: vscode.CompletionItem[] = [];
	for (let i in source["@graph"]) {
		const id = source["@graph"][i]['@id'].toString();
		if (!id.startsWith(`${prefix}:`)) {
			continue;
		};
		const label = id.replace(new RegExp(`${prefix}:?`), '');
		let item = new vscode.CompletionItem(label, vscode.CompletionItemKind.EnumMember);

		//look up comment:
		let comment = '';
		['rdfs:comment', 'comment', 'skos:ScopeNote'].forEach(prop => {
			if (source["@graph"][i][prop]) {
				comment = source["@graph"][i][prop];
			}
		});
		if (comment) {
			if (typeof comment !== 'string') {
				comment = comment['@value'];
			}
			item.documentation = new vscode.MarkdownString(comment.replace(/\\n/g, "\n\n").replace(/<[^>]+>/g, ''));
			// item.detail = 
		}
		item.insertText = label + " ";
		completeOptions.push(item);
	}
	return completeOptions;
};

const documentSelectors =  ['turtle', 'trig'];

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "prefix-to-namespace" is now active!');

	const prefixItems = getItems();

	const getVocabularyAutocompleteProvider = (vocab: any, prefix: string, alias?: string)  => {
		alias = alias ?? prefix;
		return vscode.languages.registerCompletionItemProvider(
			documentSelectors,
			{
				provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

					const linePrefix = document.lineAt(position).text.slice(0, position.character);
					if (!linePrefix.endsWith(`${alias}:`)) {
						return undefined;
					}
					return parseSource(vocab, prefix);
				}
			},
			':'
		);
	};

	// the autocompleter for prefix declerations:
	const prefixToNameSpaceProvider = vscode.languages.registerCompletionItemProvider(
		documentSelectors,
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.slice(0, position.character);
				if (!linePrefix.endsWith(`@`)) {
					return undefined;
				}
				return prefixItems.map(item => {
					const ci = new vscode.CompletionItem(item.label, vscode.CompletionItemKind.Method);
					ci.documentation = new vscode.MarkdownString(`[${item.detail}](${item.detail})`);
					ci.insertText = `prefix ${item.label}: <${item.detail}> .\n`;
					return ci;
				});
			}
		},
		'@'
	);
	context.subscriptions.push(
		// The command that is triggered using the Command Pallet:
		vscode.commands.registerCommand('prefix.fetch', () => command(prefixItems)),
		prefixToNameSpaceProvider,
		getVocabularyAutocompleteProvider(sdo, 'schema', 'sdo'),
		getVocabularyAutocompleteProvider(rico, 'rico'),
		getVocabularyAutocompleteProvider(rdf, 'rdf'),
		getVocabularyAutocompleteProvider(rdfs, 'rdfs'),
		getVocabularyAutocompleteProvider(shacl, 'sh'),
		getVocabularyAutocompleteProvider(owl, 'owl'),
		getVocabularyAutocompleteProvider(dc, 'dc'),
		getVocabularyAutocompleteProvider(dct, 'dcterms', 'dct'),
		getVocabularyAutocompleteProvider(cidoc, 'crm'),
	);
}
export function deactivate() {}
