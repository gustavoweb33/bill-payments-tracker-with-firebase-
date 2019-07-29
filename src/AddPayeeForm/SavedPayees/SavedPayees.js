import React, { Component } from 'react';
import AddPayeeForm from '../AddPayeeForm';
import DisplayTransactions from './DisplayTransactions/DisplayTransactions';
// import Modal from '../Modal/Modal';
import style from './SavedPayees.module.css'
import * as firebase from 'firebase';
import { FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";


class AddPayee extends Component {
    state = {
        payees: [],
        numberOfPayees: 5
    }
    async componentDidMount() {
        this.renderPayees(this.state.numberOfPayees);

    }

    renderPayees = (numberOfPayees) => {
        const ref = firebase.database().ref( 'payees' ).limitToFirst( numberOfPayees );

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
                //adding new property to each payee so they are hidden until the user clicks the show button
                fetchedPayees[ i ].showTransactions = false;
                fetchedPayees[ i ].accountNumber = fetchedPayees[ i ].accountNumber.toUpperCase()
                fetchedPayees[ i ].name = fetchedPayees[ i ].name.toUpperCase()
            }
            this.setState( { payees: fetchedPayees } );
        } );


    }

    //test method
    update = () => {
        let ref = firebase.database().ref( 'payees' );
        const child = ref.child( '000000000013' );
        child.update( { accountNumber: 949493030030 } );
    }

    deletePayee = ( payeeId ) => {
        const deletePayee = window.confirm( 'Delete selected payee?' );
        if ( deletePayee ) {
            const ref = firebase.database().ref( 'payees/' + payeeId );
            ref.remove();
        }
        else return false;
    }

    deleteTransaction = ( payeeId, paymentId ) => {
        const ref = firebase.database().ref( 'payees/' + payeeId + '/payments/' + paymentId );
        ref.remove()
            .then( function () {
                console.log( "Remove succeeded." )
            } )
            .catch( function ( error ) {
                console.log( "Remove failed: " + error.message )
            } );
    }

    showTransactions = ( payeeId, index, boolean ) => {
        const payees = [ ...this.state.payees ]
        if ( payees[ index ].id === payeeId ) {
            payees[ index ].showTransactions = boolean;
        }
        this.setState( { payees: payees } )
    }

    loadMorePayees = ( num ) => {
        this.setState( ( prevState ) => {
            return { numberOfPayees: prevState.numberOfPayees + num }
        } )
        this.renderPayees(this.state.numberOfPayees)
        
    }
 
    render() {
      
        return (
            <div>
                <AddPayeeForm addItem={ this.addItem } payees={ this.state.payees } />
                {
                    this.state.payees.length === 0 ? <h2>...Loading</h2> :
                        this.state.payees.map( ( payee, index ) => {

                            return (
                                <div key={ payee.id } className={ style.payeesAndTransactions }>
                                    <div className={ style.savedPayessContainer }>
                                        <h4 className={ style.containerTitle }>{ payee.name }</h4>
                                        <p className={ style.containerParaOne }>{ payee.accountNumber }</p>
                                        <p className={ style.containerParaTwo }>{ payee.zipCode }</p>


                                        <div className={ style.icons }>
                                            <button onClick={ () => this.showTransactions( payee.id, index, true ) } className={ style.tooltip }>
                                                <span className={ style.tooltiptext }>View Transaction</span><FaEye className={ style.icon } />
                                            </button>

                                            <button onClick={ () => this.showTransactions( payee.id, index, false ) } className={ style.tooltip }>
                                                <span className={ style.tooltiptext }>Hide Transaction</span><FaEyeSlash className={ style.icon } />
                                            </button>

                                            <button onClick={ () => this.deletePayee( payee.id ) }><FaTrash className={ style.icon } />
                                            </button>
                                        </div>
                                    </div>


                                    <div >
                                        {
                                            this.state.payees[ index ].showTransactions ?
                                                <DisplayTransactions
                                                    payeeId={ this.state.payees[ index ].id }
                                                    transactionHistory={ this.state.payees[ index ].payments }
                                                    deleteTransaction={ this.deleteTransaction }
                                                />
                                                : null
                                        }
                                    </div>
                                </div>
                            )
                        } )
                }
                <button onClick={ () => { this.loadMorePayees( 3 ) } }>Load more</button>
            </div>
        )
    }
}

export default AddPayee;