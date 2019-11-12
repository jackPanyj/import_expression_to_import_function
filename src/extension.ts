import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.import_to_import()', () => {
		const config = vscode.workspace.getConfiguration('import_to_import()');
		const showWebpackChunkName = config.get('showWebpackChunkName');
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			// 获取选中区域的开始行
			const start = editor.document.lineAt(selection.start).range.start;
			// 获取选中区域的结束后
			const end = editor.document.lineAt(selection.end).range.end;
			// 重新定义选中区域
			const newSelection = new vscode.Selection(start, end);
			// 得到选区的 range
			const range = new vscode.Range(newSelection.start, newSelection.end);
			// 获取选区的文本
			const text = editor.document.getText(range);
			// 文本处理
			const texts: string[] = text.split('\n');
			const newTexts = texts.map(text => {
				const matched = text.match(/import\s+(\w+)\s+from\s+(['"][\.@].*['"]);?/);
				if (matched) {
					const [_, name, path] = matched;
					let str: string;
					if (showWebpackChunkName) {
						str = `const ${name} = () => import(/* webpackChunkName: "${name.toLowerCase()}" */${path});`;
					} else {
						str = `const ${name} = () => import(${path});`;
					}
					return str;
				} else {
					return text;
				}
			});
			// 文本替换
			editor.edit(builder => builder.replace(range, newTexts.join('\n')));
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
