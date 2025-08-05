// BillingPage.tsx
import { useState } from "react";
import { Layout, Card, Input, Button, Typography, Space, message, Statistic } from 'antd';
import { SearchOutlined, DollarOutlined } from '@ant-design/icons';
import { getBalance, getTransactions } from "../api/billing";
import BillingActions from "../components/Billing/BillingActions";
import TransactionsList from "../components/Billing/TransactionsList";

const { Content } = Layout;
const { Title, Text } = Typography;

const BillingPage = () => {
    const [accountId, setAccountId] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        if (!accountId.trim()) {
            message.warning("Please enter a valid Account ID");
            return;
        }

        setLoading(true);
        try {
            const [balRes, txRes] = await Promise.all([
                getBalance(accountId),
                getTransactions(accountId),
            ]);
            setBalance(balRes.data.balance);
            setTransactions(txRes.data);
            message.success('Billing information loaded successfully');
        } catch (err) {
            message.error('Error fetching billing information');
            console.error("Billing data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Card>
                        <Title level={2}>Billing Dashboard</Title>
                        <Text type="secondary">View your account balance and transaction history</Text>
                        
                        <Space.Compact style={{ width: '100%', marginTop: 24 }}>
                            <Input
                                placeholder="Enter your billing account ID"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                onPressEnter={loadData}
                                prefix={<SearchOutlined />}
                            />
                            <Button 
                                type="primary"
                                onClick={loadData}
                                loading={loading}
                            >
                                Load Billing Info
                            </Button>
                        </Space.Compact>
                    </Card>

                    {balance !== null && (
                        <>
                            <Card>
                                <Statistic
                                    title="Current Balance"
                                    value={balance}
                                    precision={2}
                                    prefix={<DollarOutlined />}
                                />
                            </Card>

                            <BillingActions
                                accountId={accountId}
                                onSuccess={loadData}
                            />

                            <Card title="Recent Transactions">
                                <TransactionsList
                                    transactions={transactions}
                                    loading={loading}
                                />
                            </Card>
                        </>
                    )}
                </Space>
            </Content>
        </Layout>
    );
};

export default BillingPage;