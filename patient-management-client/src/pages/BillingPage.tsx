import { useEffect, useState } from "react";
import { getBalance, getTransactions } from "../api/billing";
import BillingActions from "../components/Billing/BillingActions";
import TransactionsList from "../components/Billing/TransactionsList";

const BillingPage = () => {
    const [accountId, setAccountId] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState([]);

    const loadData = async () => {
        if (!accountId) return;
        try {
            const [balRes, txRes] = await Promise.all([
                getBalance(accountId),
                getTransactions(accountId),
            ]);
            setBalance(balRes.data.balance);
            setTransactions(txRes.data);
        } catch (err) {
            alert("Error fetching billing info");
        }
    };

    useEffect(() => {
        if (accountId) loadData();
    }, [accountId]);

    return (
        <div>
            <input
                placeholder="Enter Billing Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
            />
            <button onClick={loadData}>Load Billing Info</button>

            {balance !== null && (
                <div>
                    <h2>Balance: ${balance}</h2>
                    <BillingActions accountId={accountId} onSuccess={loadData} />
                    <h3>Transactions</h3>
                    <TransactionsList transactions={transactions} />
                </div>
            )}
        </div>
    );
};

export default BillingPage;
