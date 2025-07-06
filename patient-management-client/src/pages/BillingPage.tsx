import { useEffect, useState, type SetStateAction} from "react";
import {getBalance, getTransactions} from "../api/billing";
import BillingActions from "../components/Billing/BillingActions";
import TransactionsList from "../components/Billing/TransactionsList";
import "./BillingPage.css";

const BillingPage = () => {
    const [accountId, setAccountId] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadData = async () => {
        if (!accountId.trim()) {
            setError("Please enter a valid Account ID");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const [balRes, txRes] = await Promise.all([
                getBalance(accountId),
                getTransactions(accountId),
            ]);
            setBalance(balRes.data.balance);
            setTransactions(txRes.data);
        } catch (err) {
            setError("Error fetching billing information. Please check your Account ID and try again.");
            console.error("Billing data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setAccountId(e.target.value);
        if (error) setError(""); // Clear error when user starts typing
    };

    const handleKeyPress = (e: { key: string; }) => {
        if (e.key === 'Enter') {
            loadData();
        }
    };

    useEffect(() => {
        if (accountId) loadData();
    }, []);

    return (
        <div className="billing-page">
            <div className="billing-container">
                <header className="billing-header">
                    <h1>Billing Dashboard</h1>
                    <p>View your account balance and transaction history</p>
                </header>

                <div className="account-input-section">
                    <div className="input-group">
                        <label htmlFor="accountId" className="input-label">
                            Billing Account ID
                        </label>
                        <div className="input-container">
                            <input
                                id="accountId"
                                type="text"
                                className={`account-input ${error ? 'error' : ''}`}
                                placeholder="Enter your billing account ID"
                                value={accountId}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <button
                                className={`load-button ${loading ? 'loading' : ''}`}
                                onClick={loadData}
                                disabled={loading || !accountId.trim()}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Loading...
                                    </>
                                ) : (
                                    'Load Billing Info'
                                )}
                            </button>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                    </div>
                </div>

                {balance !== null && (
                    <div className="billing-content">
                        <div className="balance-card">
                            <div className="balance-header">
                                <h2>Current Balance</h2>
                            </div>
                            <div className="balance-amount">
                                ${balance?.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }) ?? '0.00'}
                            </div>
                        </div>

                        <div className="actions-section">
                            <BillingActions accountId={accountId} onSuccess={loadData} />
                        </div>

                        <div className="transactions-section">
                            <div className="section-header">
                                <h3>Recent Transactions</h3>
                                <span className="transaction-count">
                                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <TransactionsList transactions={transactions} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingPage;