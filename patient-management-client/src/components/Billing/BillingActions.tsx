import { useState } from "react";
import { chargeAccount, payAccount } from "../../api/billing";

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
        <div>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                placeholder="Amount"
            />
            <button onClick={handleCharge}>Charge</button>
            <button onClick={handlePay}>Pay</button>
        </div>
    );
};

export default BillingActions;
