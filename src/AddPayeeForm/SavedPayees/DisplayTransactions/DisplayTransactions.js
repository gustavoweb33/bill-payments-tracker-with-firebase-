import React, { useState } from 'react';
import AddTransaction from './AddTransaction/AddTransaction';
import style from './DisplayTransactions.module.css'
import { FaTrash } from "react-icons/fa";

const transactionHistoryLimit = ( history, more ) => {
    const newHistory = [];
    for ( let i = 0; i < more; i++ ) {
        newHistory.push( history[ i ] );
    }
    return newHistory;
}



const DisplayPayments = ( { transactionHistory, payeeId, deleteTransaction } ) => {
    const limit = transactionHistoryLimit( transactionHistory, 3 )
    const [ displayForm, setDisplay ] = useState( false );
    // const [ newLimit, setLimit ] = useState( [] );
    // if ( limit.length !== 3 ) {
    //     setLimit( limit );
    // }
    // console.log( newLimit )

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
                    limit.map( payment => {
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
            <button onClick={ () => transactionHistoryLimit( transactionHistory, 5 ) }>load mass</button>
        </div>
    );
}

export default DisplayPayments;