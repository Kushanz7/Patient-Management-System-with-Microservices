import { useState } from "react";
import { chargeAccount, payAccount } from "../../api/billing";
import "./BillingActions.css";

type Props = {
    accountId: string;
    onSuccess: () => void;
};

const BillingActions = ({ accountId, onSuccess }: Props) => {
    const [amount, setAmount] = useState(0);

    const handleCharge = async () => {
        await chargeAccount(accountId, amount);
        onSuccess();
    };

    const handlePay = async () => {
        await payAccount(accountId, amount);
        onSuccess();
    };

    return (
        <div className="billing-container">
            <div className="billing-card">
                <h2 className="billing-title">Account Balance Actions</h2>
                <div className="input-group">
                    <label htmlFor="amount">Amount</label>
                    <div className="amount-input-wrapper">
                        <span className="currency-symbol">$</span>
                        <input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            placeholder="Enter amount"
                            className="amount-input"
                        />
                    </div>
                </div>
                <div className="button-group">
                    <button 
                        className="button button-charge"
                        onClick={handleCharge}
                    >
                        <span className="button-icon">↑</span>
                        Charge
                    </button>
                    <button 
                        className="button button-pay"
                        onClick={handlePay}
                    >
                        <span className="button-icon">↓</span>
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillingActions;