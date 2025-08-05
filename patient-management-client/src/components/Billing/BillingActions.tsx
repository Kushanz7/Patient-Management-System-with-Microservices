import { Card, InputNumber, Button, Space, message } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { chargeAccount, payAccount } from '../../api/billing';

type Props = {
    accountId: string;
    onSuccess: () => void;
};

const BillingActions = ({ accountId, onSuccess }: Props) => {
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAction = async (action: 'charge' | 'pay') => {
        if (!amount) {
            message.warning('Please enter an amount');
            return;
        }

        setLoading(true);
        try {
            if (action === 'charge') {
                await chargeAccount(accountId, amount);
            } else {
                await payAccount(accountId, amount);
            }
            message.success(`Successfully ${action}d the account`);
            setAmount(null);
            onSuccess();
        } catch (error) {
            message.error(`Failed to ${action} the account`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Account Balance Actions">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <InputNumber
                    prefix="$"
                    style={{ width: '100%' }}
                    value={amount}
                    onChange={(value) => setAmount(value)}
                    placeholder="Enter amount"
                    min={0}
                    precision={2}
                />
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Button
                        type="primary"
                        danger
                        icon={<ArrowUpOutlined />}
                        onClick={() => handleAction('charge')}
                        loading={loading}
                        block
                    >
                        Charge
                    </Button>
                    <Button
                        type="primary"
                        icon={<ArrowDownOutlined />}
                        onClick={() => handleAction('pay')}
                        loading={loading}
                        block
                    >
                        Pay
                    </Button>
                </Space>
            </Space>
        </Card>
    );
};

export default BillingActions;