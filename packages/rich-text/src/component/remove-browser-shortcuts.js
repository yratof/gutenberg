/**
 * External dependencies
 */
import { fromPairs } from 'lodash';

/**
 * WordPress dependencies
 */
import { rawShortcut } from '@wordpress/keycodes';

/**
 * Set of keyboard shortcuts handled internally by RichText.
 *
 * @type {Array}
 */
const HANDLED_SHORTCUTS = [
	rawShortcut.primary( 'z' ),
	rawShortcut.primaryShift( 'z' ),
	rawShortcut.primary( 'y' ),
];

const shortcuts = fromPairs( HANDLED_SHORTCUTS.map( ( shortcut ) => {
	return [ shortcut, ( event ) => event.preventDefault() ];
} ) );

/**
 * Component which registered keyboard event handlers to prevent default
 * behaviors for key combinations otherwise handled internally by RichText.
 *
 * @return {WPElement} WordPress element.
 */
export const RemoveBrowserShortcuts = ( { KeyboardShortcuts } ) => (
	<KeyboardShortcuts
		bindGlobal
		shortcuts={ shortcuts }
	/>
);
