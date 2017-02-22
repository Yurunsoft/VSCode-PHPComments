'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    const commandRegistration = vscode.commands.registerCommand('extension.addPHPComments', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage(vscode.window.activeTextEditor.document.fileName);
        // vscode.window.activeTextEditor.edit(()=>{})
        vscode.window.activeTextEditor.edit((editBuilder: vscode.TextEditorEdit) => {
            var positionStart = new vscode.Position(vscode.window.activeTextEditor.selection.start.line,0);
            var positionEnd = new vscode.Position(vscode.window.activeTextEditor.selection.start.line+1,0);
            var content = vscode.window.activeTextEditor.document.getText(new vscode.Range(positionStart,positionEnd));
            var matches = content.match(/function ([^\s(]+)\(/);
            if(null === matches)
            {
                return;
            }
            var methodName = matches[1];
            matches = content.match(/\(([^)]*)\)/);
            if(null === matches || matches.length <= 1)
            {
                return;
            }
            var tabMatches = content.match(/^\s+/);
            var tab = '';
            if(null !== tabMatches)
            {
                tab = tabMatches[0];
            }
            var insertContent = tab + '/**\r\n';
            tab += ' ';
            insertContent += tab + '* '+methodName+'\r\n';
            matches = matches[1].match(/(\$[^\s,\)]+)/g);
            for(var i=0;i<matches.length;i++)
            {
                insertContent += tab + '* @param mixed ' + matches[i] + ' \r\n';
            }
            insertContent += tab + '* @return mixed \r\n';
            insertContent += tab + '*/';
            editBuilder.insert(positionStart,insertContent + '\r\n');
        }, {
            undoStopBefore: true,
            undoStopAfter: true
        });
    });


}

// this method is called when your extension is deactivated
export function deactivate() {
}