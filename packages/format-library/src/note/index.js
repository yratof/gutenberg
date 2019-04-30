/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, Fragment } from '@wordpress/element';
import { removeFormat } from '@wordpress/rich-text';
import { RichTextToolbarButton } from '@wordpress/block-editor';

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
	edit: class NoteEdit extends Component {
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
			const { value, onChange } = this.props;

			onChange( removeFormat( value, name ) );
		}

		render() {
			const { isActive, activeAttributes, isObjectActive, activeObjectAttributes, value, onChange } = this.props;

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
						isObjectActive={ isObjectActive }
						activeObjectAttributes={ activeObjectAttributes }
						value={ value }
						onChange={ onChange }
					/>
				</Fragment>
			);
		}
	},
};
