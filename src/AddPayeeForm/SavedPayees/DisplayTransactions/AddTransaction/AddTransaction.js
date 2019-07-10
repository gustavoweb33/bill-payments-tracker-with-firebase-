//TODO: 1. add a warning message if inValidTransaction is false
import React, { Component } from 'react';
import style from './AddTransaction.module.css';
import * as firebase from 'firebase';

class AddTransaction extends Component {
    state = {
        referenceNumber: '',
        ammount: '',
        date: ''
    }

    duplicateReferenceNums = () => {
        const transaction = { ...this.state }
        const transactionHistory = this.props.transactionHistory;
        for ( let i = 0; i < transactionHistory.length; i++ ) {
            if ( transactionHistory[ i ].referenceNumber === transaction.referenceNumber ) {
                return false;
            }
        }
        return true;
    }

    transactionFormat = () => {
        const transaction = { ...this.state }
        const duplicatesRefNums = this.duplicateReferenceNums()
        if ( !duplicatesRefNums ) return false;

        //handle the ammount format
        transaction.ammount = Number( transaction.ammount ).toFixed( 2 );   //ammount is a string by default 
        transaction.ammount = Number( transaction.ammount );  //convert back to a number b/c toFixed returns a string
        transaction.referenceNumber = transaction.referenceNumber.toUpperCase();
        if ( typeof transaction.ammount !== 'number' || ( transaction.ammount / 1 ) !== transaction.ammount ) return false;


        //handle the date format
        let date = Date.parse( transaction.date ); //return the number of milliseconds of the date
        date = new Date( date + 86400000 );   //the returned millsecs are of by one day so we add one day worth of millisecs

        const mmddyyyy = `${ date.getMonth() + 1 }/${ date.getDate() }/${ date.getFullYear() }`
        transaction.date = mmddyyyy;

        return transaction;
    }

    handleChange = ( event ) => {
        this.setState( {
            [ event.target.name ]: event.target.value
        } );

    }

    handleSubmit = ( event ) => {
        event.preventDefault();
        const isValidTransaction = this.transactionFormat();

        if ( isValidTransaction ) {
            //push() -> add to the existing data. does not delete
            //get referEnce to payees/id/payments and push to it

            //EXAMPLE
            const payeeId = this.props.payeeId;
            const payment = {
                referenceNumber: this.state.referenceNumber,
                ammount: this.state.ammount,
                date: this.state.date
            }
            let refs = firebase.database().ref( 'payees/' + payeeId + '/payments' );
            refs.push( payment )
            this.setState( { referenceNumber: '', ammount: '', date: '' } )

        }
        else console.log( 'not a valid transaction' );


    }
    
    render() {
        return (
            <form onSubmit={ this.handleSubmit } className={ style.addTransactionForm }>
                <label className={ style.transactionLabel } htmlFor='refNum'> Reference Number: </label>
                <input
                    type='text' id='refNum' name='referenceNumber'
                    required minLength='5' maxLength='20' className={ style.transactionInput }
                    value={ this.state.referenceNumber } onChange={ this.handleChange } />
                {
                    this.duplicateReferenceNums() ? '' :
                        <p className={ style.duplicatesRefNums }> Reference number already exists </p>
                }

                <label className={ style.ammountTitle } htmlFor='tranAmmount'>  Ammount: </label>
                <input
                    type='text' id='tranAmmount' name='ammount'
                    required minLength='1' maxLength='10' className={ style.ammountInput }
                    value={ this.state.ammount } onChange={ this.handleChange } />

                <label className={ style.dateTitle } htmlFor='tranDate'> Date: </label>
                <input
                    type="date" id='tranDate' name='date'
                    required className={ style.dateInput }
                    value={ this.state.date } onChange={ this.handleChange } />

                <button className={ style.trasactionButton }>Save</button>
            </form>
        )
    }

}

export default AddTransaction; 