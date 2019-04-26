/**
 * WordPress dependencies
 */

import { __, _x } from '@wordpress/i18n';
import { Toolbar } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */

import { RichTextShortcut } from './shortcut';
import { indentListItems } from '../indent-list-items';
import { outdentListItems } from '../outdent-list-items';
import { changeListType } from '../change-list-type';
import { isListRootSelected } from '../is-list-root-selected';
import { isActiveListType } from '../is-active-list-type';

export const ListEdit = ( {
	onTagNameChange,
	tagName,
	value,
	onChange,
	BlockFormatControls,
} ) => (
	<Fragment>
		<RichTextShortcut
			type="primary"
			character="["
			onUse={ () => {
				onChange( outdentListItems( value ) );
			} }
		/>
		<RichTextShortcut
			type="primary"
			character="]"
			onUse={ () => {
				onChange( indentListItems( value, { type: tagName } ) );
			} }
		/>
		<RichTextShortcut
			type="primary"
			character="m"
			onUse={ () => {
				onChange( indentListItems( value, { type: tagName } ) );
			} }
		/>
		<RichTextShortcut
			type="primaryShift"
			character="m"
			onUse={ () => {
				onChange( outdentListItems( value ) );
			} }
		/>
		<BlockFormatControls>
			<Toolbar
				controls={ [
					onTagNameChange && {
						icon: 'editor-ul',
						title: __( 'Convert to unordered list' ),
						isActive: isActiveListType( value, 'ul', tagName ),
						onClick() {
							onChange( changeListType( value, { type: 'ul' } ) );

							if ( isListRootSelected( value ) ) {
								onTagNameChange( 'ul' );
							}
						},
					},
					onTagNameChange && {
						icon: 'editor-ol',
						title: __( 'Convert to ordered list' ),
						isActive: isActiveListType( value, 'ol', tagName ),
						onClick() {
							onChange( changeListType( value, { type: 'ol' } ) );

							if ( isListRootSelected( value ) ) {
								onTagNameChange( 'ol' );
							}
						},
					},
					{
						icon: 'editor-outdent',
						title: __( 'Outdent list item' ),
						shortcut: _x( 'Backspace', 'keyboard key' ),
						onClick: () => {
							onChange( outdentListItems( value ) );
						},
					},
					{
						icon: 'editor-indent',
						title: __( 'Indent list item' ),
						shortcut: _x( 'Space', 'keyboard key' ),
						onClick: () => {
							onChange( indentListItems( value, { type: tagName } ) );
						},
					},
				].filter( Boolean ) }
			/>
		</BlockFormatControls>
	</Fragment>
);
