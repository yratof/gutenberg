/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { Button, withSpokenMessages } from '@wordpress/components';
import { compose, withInstanceId } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import BaseOption from './base';

export class EnableCustomFieldsOption extends Component {
	constructor( { isChecked } ) {
		super( ...arguments );

		this.toggleCustomFields = this.toggleCustomFields.bind( this );
		this.confirmCustomFields = this.confirmCustomFields.bind( this );

		this.state = { isChecked, isLoading: false };
	}

	toggleCustomFields() {
		const newValue = ! this.state.isChecked;
		this.setState( { isChecked: newValue } );
		// announce the need to reload the editor when the new value differs from the original one
		if ( newValue !== this.props.isChecked ) {
			this.props.speak( 'Editor reload is required to change custom fields option. Please confirm by a following button', 'assertive' );
		}
	}

	confirmCustomFields() {
		// Submit a hidden form which triggers the toggle_custom_fields admin action.
		// This action will toggle the setting and reload the editor with the meta box
		// assets included on the page.
		this.setState( { isLoading: true } );
		this.props.speak( 'Reloading the editor.', 'assertive' );
		document.getElementById( 'toggle-custom-fields-form' ).submit();
	}

	render() {
		const { label, instanceId } = this.props;
		const { isChecked, isLoading } = this.state;
		const confirmControlId = 'toggle-custom-fields-confirm-' + instanceId;

		return (
			<>
				<BaseOption
					label={ label }
					isChecked={ isChecked }
					onChange={ this.toggleCustomFields }
				/>
				{ this.props.isChecked !== isChecked ?
					<div>
						<p>Editor reload is required to change custom fields option.</p>
						<Button
							id={ confirmControlId }
							isDefault
							isBusy={ isLoading }
							onClick={ ! isLoading && this.confirmCustomFields }>
								Save & Reload
						</Button>
					</div> :
					null
				}
			</>
		);
	}
}

export default compose(
	withSelect( ( select ) => ( {
		isChecked: !! select( 'core/editor' ).getEditorSettings().enableCustomFields,
	} ) ),
	withInstanceId,
	withSpokenMessages
)( EnableCustomFieldsOption );
