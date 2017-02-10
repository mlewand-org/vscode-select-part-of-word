const common = require( './common' ),
	CHAR_TYPE = common.CHAR_TYPE,
	STRATEGIES = {
		CAMEL_CASE: 1,
		SAME_CASE: 2
	},
	regExpMapping = common.regExpMapping,
	// RegExp to match anything BUT the type referenced by a key.
	regExpExcludeMapping = common.regExpExcludeMapping;

const vscode = require( 'vscode' );

module.exports = {
	moveRight( textEditor ) {
		let newSel = this._moveSelectionRight( textEditor.document, textEditor.selections[ 0 ] );

		if ( newSel ) {
			// Update the selection.
			textEditor.selection = newSel;
		}
	},


	/**
	 * Expands (or shrinks depending where range's active position is) the selection to the right side of text.
	 *
	 * @param {TextEditor} textEditor
	 */
	selectRight( textEditor ) {
		let sel = textEditor.selections[ 0 ],
			newPos = this._movePositionRight( textEditor.document, sel.active ),
			newSel = new vscode.Selection( sel.anchor, newPos );

		if ( newSel ) {
			// Update the selection.
			textEditor.selection = newSel;
		}
	},

	moveLeft( textEditor ) {},

	_moveSelectionRight( doc, sel ) {
		let end = !sel.isReversed ? sel.end : sel.start,
			anchor = !sel.isReversed ? sel.start : sel.end,
			lineText = doc.lineAt( end ).text,
			// The text after the selection.
			textAhead = lineText.substr( end.character ),
			lastChar = end.character > 0 ? lineText.substr( end.character - 1, 1 ) : ' ';

		return new vscode.Selection( anchor, end.with( end.line, end.character + 1 ) );
	},

	_movePositionRight( doc, position ) {
		let lineText = doc.lineAt( position ).text,
			// The text after the selection.
			textAhead = lineText.substr( position.character ),
			lastChar = position.character > 0 ? lineText.substr( position.character - 1, 1 ) : ' ',
			endLine = position.line,
			curCharacterType = this._getCharType( textAhead[ 0 ] )
			endPos = position.character + textAhead.search( regExpExcludeMapping[ curCharacterType ] ) + 1;

		if ( endPos === -1 ) {
			return position;
		} else {
			// return position.with( position.line, endPos + 1 );
			return new vscode.Position( position.line, endPos );
		}
	},

	/**
	 * Tells the character type based on `char`.
	 *
	 * @param {String} char A character to be tested.
	 * @returns {Number} A value based on `CHAR_TYPE` members.
	 */
	_getCharType( char ) {
		char = String( char )[ 0 ] || '';

		for ( let typeValue in regExpMapping ) {
			if ( char.match( regExpMapping[ typeValue ] ) ) {
				return Number( typeValue );
			}
		}

		return CHAR_TYPE.OTHER;
	}
};