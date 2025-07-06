type Transaction = {
    id: number;
    type: string;
    amount: number;
};

type Props = {
    transactions: Transaction[];
};

const TransactionsList = ({ transactions }: Props) => (
    <ul>
        {transactions.map((tx) => (
            <li key={tx.id}>
                {tx.type}: ${tx.amount}
            </li>
        ))}
    </ul>
);

export default TransactionsList;
