/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { withSpokenMessages } from '@wordpress/components';
import {
	getTextContent,
	applyFormat,
	removeFormat,
	slice,
} from '@wordpress/rich-text';
import { isURL, isEmail } from '@wordpress/url';
import { RichTextToolbarButton, RichTextShortcut } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import InlineUI from './inline';

const name = 'core/note';
const title = __( 'Note' );

export const note = {
	name,
	title,
	tagName: 'a',
	className: 'note-anchor',
	attributes: {
		note: 'data-note',
		href: 'href',
		id: 'id',
	},
	edit: withSpokenMessages( class NoteEdit extends Component {
		constructor() {
			super( ...arguments );

			this.open = this.open.bind( this );
			this.close = this.close.bind( this );
			this.remove = this.remove.bind( this );

			this.state = {
				isOpen: false,
			};
		}

		open() {
			this.setState( { isOpen: true } );
		}

		close() {
			this.setState( { isOpen: false } );
		}

		remove() {
			const { value, onChange, speak } = this.props;

			onChange( removeFormat( value, name ) );
		}

		render() {
			const { isActive, activeAttributes, value, onChange } = this.props;

			return (
				<Fragment>
					<RichTextToolbarButton
						icon="editor-ol"
						title={ title }
						onClick={ isActive ? this.remove : this.open }
						isActive={ isActive }
					/>
					<InlineUI
						isOpen={ this.state.isOpen }
						onClose={ this.close }
						isActive={ isActive }
						activeAttributes={ activeAttributes }
						value={ value }
						onChange={ onChange }
					/>
				</Fragment>
			);
		}
	} ),
};
