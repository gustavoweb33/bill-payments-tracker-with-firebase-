import React, { useState } from 'react';
import AddTransaction from './AddTransaction/AddTransaction';
import style from './DisplayTransactions.module.css'
import { FaTrash } from "react-icons/fa";



const DisplayPayments = ( { transactionHistory, payeeId, deleteTransaction } ) => {
    const [ displayForm, setDisplay ] = useState( false );

    let history = transactionHistory.length === 0
        ? <h3>No Transaction History</h3>
        : <h3>Transaction History</h3>

    return (

        <div className={ style.payeesAndTransactions }>

            <div>
                <div className={ style.topContainer }>

                    { history }

                    <button className={ style.addTransaction }
                        onClick={ () => { setDisplay( !displayForm ) } }>
                        Add Transaction
                    </button>

                </div>

                {
                    displayForm ?
                        <AddTransaction
                            payeeId={ payeeId }
                            transactionHistory={ transactionHistory }
                        />
                        : null
                }
            </div>

            <div className={ style.transactionHistoryContainer }>
                {
                    transactionHistory.map( payment => {
                        //because Firebase doesn't save any 0 or null values
                        //the .00 cents are added to ammounts that have empty cents
                        let paymentAmount = payment.ammount.toString( 10 )
                        if ( !paymentAmount.includes( '.' ) ) {
                            paymentAmount = `${ paymentAmount }.00`
                        }

                        return (
                            <div key={ payment.referenceNumber } className={ style.transactionBorder } >
                                <ul>
                                    <li>
                                        <span style={ { fontWeight: 'bold' } }>Reference Number:</span>
                                        { payment.referenceNumber }

                                        <button
                                            className={ style.deleteTransaction }
                                            onClick={ () => deleteTransaction( payeeId, payment.id ) }>
                                            <FaTrash className={ style.trashIcon } />
                                        </button>

                                        <hr />
                                    </li>

                                    <li>
                                        <span style={ { fontWeight: 'bold' } }> Ammount:</span> { paymentAmount }
                                    </li>

                                    <li>
                                        <span style={ { fontWeight: 'bold' } }>Date:</span> { payment.date }
                                    </li>
                                </ul>
                            </div>

                        );
                    } )
                }
            </div>
        </div>
    );
}

export default DisplayPayments;