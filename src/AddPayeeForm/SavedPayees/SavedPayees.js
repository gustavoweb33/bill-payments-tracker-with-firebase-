import React, { Component } from 'react';
import AddPayeeForm from '../AddPayeeForm';
import DisplayTransactions from './DisplayTransactions/DisplayTransactions';
// import Modal from '../Modal/Modal';
import style from './SavedPayees.module.css'
import * as firebase from 'firebase';


class AddPayee extends Component {
    state = {
        payees: []
    }
    async componentDidMount() {
        const ref = firebase.database().ref( 'payees' );

        ref.on( 'value', ( snapshot ) => {
            const state = snapshot.val();
            const fetchedPayees = [];
            const payments = [];

            //converts fetched firebase object into an array
            for ( let key in state ) {
                fetchedPayees.push( { ...state[ key ], id: key } );
            }

            //turns payments objects into an array so they can be looped over
            for ( let key in fetchedPayees ) {
                payments.push( { ...fetchedPayees[ key ].payments } )
            }

            //place the payments array back into the corresponding fetchPayees array.

            //this works but uses nested loops. refactor
            for ( let i = 0; i < fetchedPayees.length; i++ ) {
                fetchedPayees[ i ].payments = [];
                for ( let key in payments[ i ] ) {
                    fetchedPayees[ i ].payments.push( { ...payments[ i ][ key ], id: key } )
                }
            }
            this.setState( { payees: fetchedPayees } );

        } );


    }

    update = () => {
        let ref = firebase.database().ref( 'payees' );
        const child = ref.child( '000000000013' );
        child.update( { accountNumber: 949493030030 } );
    }

    // addTransaction = ( transaction, payeeId, index ) => {
    //     const payees = [ ...this.state.payees ]; //copy of the state
    //     let payeeIndex = payees[ index ];    //the state index from the copy to add new transactions

    //     payeeIndex.payments.push( transaction );
    //     payees[ index ] = payeeIndex;

    //     this.setState( { payees: payees } );
    // }

    deletePayee = ( payeeId ) => {
        const deletePayee = window.confirm( 'Delete selected payee?' );
        if ( deletePayee ) {
            const ref = firebase.database().ref( 'payees/' + payeeId );
            ref.remove();
        }
        else return false;
    }

    deleteTransaction = ( payeeId, paymentId ) => {
        console.log( payeeId, paymentId )
        const ref = firebase.database().ref( 'payees/' + payeeId + '/payments/' + paymentId );
        ref.remove()
            .then( function () {
                console.log( "Remove succeeded." )
            } )
            .catch( function ( error ) {
                console.log( "Remove failed: " + error.message )
            } );
    }

    render() {
        return (
            <div>
                <AddPayeeForm addItem={ this.addItem } payees={ this.state.payees } />
                { this.state.payees.length === 0 ? <h2>...Loading</h2> :
                    this.state.payees.map( ( payee, index ) => {
                        return (
                            <div key={ payee.id } className={ style.payeesAndTransactions }>
                                <div className={ style.savedPayessContainer }>
                                    <h4>{ payee.name }</h4>
                                    <p>{ payee.accountNumber }</p>
                                    <p>{ payee.zipCode }</p>
                                    <button onClick={ () => this.deletePayee( payee.id ) }>Delete</button>
                                </div>
                                {
                                    this.state.payees[ index ].length === 0
                                        ? null
                                        : <DisplayTransactions
                                            payeeId={ this.state.payees[ index ].id }
                                            transactionHistory={ this.state.payees[ index ].payments }
                                            deleteTransaction={ this.deleteTransaction }
                                        />
                                }
                            </div>
                        )
                    } )


                }
            </div>


        )
    }

}

export default AddPayee;