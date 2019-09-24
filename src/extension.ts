import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.import_to_import()', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const start = editor.document.lineAt(selection.start).range.start;
			const end = editor.document.lineAt(selection.end).range.end;
			const newSelection = new vscode.Selection(start, end);
			const range = new vscode.Range(newSelection.start, newSelection.end);
			const text = editor.document.getText(range);
			const texts: string[] = text.split('\n');
			const newTexts = texts.map(text => {
				const matched = text.match(/import\s+(\w+)\s+from\s+(['"][\.@].*['"]);?/);
				if (matched) {
					const [_, name, path] = matched;
					const str = `const ${name} = () => import(${path})`;
					return str;
				} else {
					return text;
				}
			});

			editor.edit(builder => builder.replace(range, newTexts.join('\n')));
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
