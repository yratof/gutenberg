/**
 * External dependencies
 */
import uuid from 'uuid/v4';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component, useMemo } from '@wordpress/element';
import { Popover } from '@wordpress/components';
import { LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } from '@wordpress/keycodes';
import { getRectangleFromRange } from '@wordpress/dom';
import {
	isCollapsed,
	applyFormat,
	removeFormat,
	insertObject,
} from '@wordpress/rich-text';

const stopPropagation = ( event ) => event.stopPropagation();

const PopoverAtLink = ( { isActive, isOpen, value, ...props } ) => {
	const anchorRect = useMemo( () => {
		const range = window.getSelection().getRangeAt( 0 );
		if ( ! range ) {
			return;
		}

		if ( isOpen ) {
			return getRectangleFromRange( range );
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while ( element.nodeType !== window.Node.ELEMENT_NODE ) {
			element = element.parentNode;
		}

		const closest = element.closest( 'a' );
		if ( closest ) {
			return closest.getBoundingClientRect();
		}
	}, [ isActive, isOpen, value.start, value.end ] );

	if ( ! anchorRect ) {
		return null;
	}

	return <Popover anchorRect={ anchorRect } { ...props } />;
};

export default class InlineUI extends Component {
	constructor() {
		super( ...arguments );

		this.onKeyDown = this.onKeyDown.bind( this );
		this.onChangeInputValue = this.onChangeInputValue.bind( this );
		this.onSubmit = this.onSubmit.bind( this );

		this.state = {};
	}

	onKeyDown( event ) {
		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to ObserveTyping.startTypingInTextField.
			stopPropagation( event );
		}
	}

	onChangeInputValue( event ) {
		this.setState( { inputValue: event.target.value } );
	}

	onSubmit() {
		const { isActive, value, onChange } = this.props;
		const { inputValue } = this.state;
		const type = 'core/note';
		const id = uuid();
		const format = {
			type,
			attributes: {
				note: inputValue.trim().replace( /\n/g, '<br>' ),
				// It does not matter what this is, as long as it is unique per
				// page.
				href: `#${ id }`,
				id: `${ id }-anchor`,
			},
		};

		let newValue;

		// To do: handle object.
		if ( ! inputValue ) {
			newValue = removeFormat( value, type );
		} else if ( isCollapsed( value ) && ! isActive ) {
			newValue = insertObject( value, format );
		} else {
			newValue = applyFormat( value, format );
		}

		delete newValue.start;
		delete newValue.end;

		onChange( newValue );

		this.setState( { inputValue: undefined } );
		this.props.onClose();
	}

	render() {
		const { isActive, activeAttributes, isObjectActive, activeObjectAttributes, isOpen, value } = this.props;

		if ( ! isActive && ! isObjectActive && ! isOpen ) {
			return null;
		}

		const note = activeAttributes.note || activeObjectAttributes.note || '';
		const { inputValue } = this.state;
		const val = inputValue === undefined ? note : inputValue;

		// Disable reason: KeyPress must be suppressed so the block doesn't hide the toolbar
		/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
		return (
			<PopoverAtLink
				value={ value }
				isActive={ isActive || isObjectActive }
				isOpen={ true }
				focusOnMount={ isOpen ? 'firstElement' : false }
				className="note-popover"
				position="bottom"
			>
				<form
					onKeyPress={ stopPropagation }
					onKeyDown={ this.onKeyDown }
				>
					<textarea
						aria-label={ __( 'Note' ) }
						required
						value={ val.replace( /<br ?\/?>/g, '\n' ) }
						onChange={ this.onChangeInputValue }
						onInput={ stopPropagation }
						placeholder={ __( 'Note' ) }
						onFocus={ this.onFocus }
						onBlur={ this.onSubmit }
					/>
				</form>
			</PopoverAtLink>
		);
		/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
	}
}
