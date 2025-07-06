import './TransactionsList.css';

type Transaction = {
    id: number;
    type: string;
    amount: number;
};

type Props = {
    transactions: Transaction[];
};

const TransactionsList = ({ transactions }: Props) => {
    const getTransactionIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'deposit':
                return '↓';
            case 'withdrawal':
                return '↑';
            case 'payment':
                return '→';
            default:
                return '•';
        }
    };

    return (
        <div className="transactions-container">
            <h2 className="transactions-title">Transaction History</h2>
            {transactions.length === 0 ? (
                <div className="no-transactions">
                    No transactions to display
                </div>
            ) : (
                <div className="transactions-list">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="transaction-item">
                            <div className="transaction-icon">
                                {getTransactionIcon(tx.type)}
                            </div>
                            <div className="transaction-details">
                                <span className="transaction-type">
                                    {tx.type}
                                </span>
                            </div>
                            <div className={`transaction-amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                                ${Math.abs(tx.amount).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionsList;