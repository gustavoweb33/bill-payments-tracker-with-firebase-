import React, { Component } from 'react';
import style from './AddPayeeForm.module.css';
import * as firebase from 'firebase';
import { firebaseConfig } from '../firebase';
firebase.initializeApp( firebaseConfig );

class PayeeForm extends Component {
	state = {
		payees: {
			name: '',
			accountNumber: '',
			zipCode: '',
			payments: []
		},
	}

	isValidAccountNum = () => {
		for ( let i = 0; i < this.props.payees.length; i++ ) {
			if ( this.props.payees[ i ].accountNumber === this.state.payees.accountNumber ) {
				return false;
			}
		}
		return true;
	}

	isValidZip = () => {
		const state = { ...this.state.payees };
		const zipCodeRegex = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		const isValidZip = zipCodeRegex.test( state.zipCode );
		return isValidZip;
	}

	handleSubmit = ( event ) => {
		event.preventDefault();
		if ( this.isValidZip() && this.isValidAccountNum() ) {
			//set() -> replace current data with the new one. deletes the old data in the process except 
			// when using push and set. It will add to the tree and not delete anything
			//use set to create new payee
			var newPostKey = firebase.database().ref().child( 'payees' ).push().key;

			firebase.database().ref( 'payees/' + newPostKey ).set( {
				name: this.state.payees.name,
				accountNumber: this.state.payees.accountNumber,
				zipCode: this.state.payees.zipCode
			} );

			//clears the input
			this.setState( {
				payees: {
					name: '',
					accountNumber: '',
					zipCode: '',
					payments: []
				}
			} )
		}

		else console.log( 'invalid input field' );

	}

	handleChange = ( event ) => {
		const name = event.target.name;
		const payees = { ...this.state.payees }
		payees[ name ] = event.target.value;

		this.setState( { payees: payees } );

	}


	render() {
		const payeeName = 'Max of 30 characters allowed';
		const payeeAccount = 'Max of 16 characters allowed';

		return (
			<div>
				<h2 style={ { textAlign: 'center' } }>Bill Payments Tracker</h2>
				<div className={style.mainContainer}>
					<form onSubmit={ this.handleSubmit } className={ style.addPayeeForm }>
						<label htmlFor='name' className={ style.addPayeeLabel }>Payee</label>
						<input className={`${style.mainInput} ${style.payeeInput}`}
							type='text' id='name' name='name'
							minLength='5' maxLength='30' required
							size='30' value={ this.state.payees.name } onChange={ this.handleChange }
						/>
						<p className={ style.payeeWarning }>
							{ this.state.payees.name.length >= 30 ? payeeName : null }
						</p>


						<label htmlFor='accountNumber' className={ `${ style.addPayeeLabel }  ${ style.accountNumber }` }>Account Number</label>
						<input className={`${style.mainInput} ${style.accountNumberInput}` }
							type='text' id='accountNumber' name='accountNumber'
							minLength='8' maxLength='16' required
							value={ this.state.payees.accountNumber } onChange={ this.handleChange }
						/>
						<p className={ style.accountNumWarning }>
							{ this.state.payees.accountNumber.length >= 16 ? payeeAccount : null }
						</p>
						<p className={ style.duplicateAccountWarning }>
							{ this.isValidAccountNum() ? null : 'This account number already exists' }
						</p>


						<label htmlFor='zipCode' className={ ` ${ style.addPayeeLabel } ${ style.zipCode } ` } >Zip Code</label>
						<input className={`${style.mainInput} ${style.zipCodeInput}`}
							type='text' id='zipCode' name='zipCode'
							minLength='5' maxLength='10' required
							value={ this.state.payees.zipCode } onChange={ this.handleChange }
						/>

						<p className={ style.validZipCode }> Example: 12345 or 12345-0000</p>

						<button className={ style.payeeButton }>ADD</button>
					</form>
				</div>
			</div>

		)
	}
}

export default PayeeForm;