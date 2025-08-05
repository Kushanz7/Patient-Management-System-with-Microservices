// TransactionsList.tsx
import { List, Card, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SwapOutlined } from '@ant-design/icons';

const { Text } = Typography;

type Transaction = {
    id: number;
    type: string;
    amount: number;
};

type Props = {
    transactions: Transaction[];
    loading?: boolean;
};

const TransactionsList = ({ transactions, loading }: Props) => {
    const getTransactionIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'deposit':
                return <ArrowDownOutlined style={{ color: '#52c41a' }} />;
            case 'withdrawal':
                return <ArrowUpOutlined style={{ color: '#ff4d4f' }} />;
            case 'payment':
                return <SwapOutlined style={{ color: '#1890ff' }} />;
            default:
                return null;
        }
    };

    return (
        <List
            loading={loading}
            dataSource={transactions}
            locale={{ emptyText: 'No transactions to display' }}
            renderItem={(tx) => (
                <List.Item>
                    <Card style={{ width: '100%' }}>
                        <List.Item.Meta
                            avatar={getTransactionIcon(tx.type)}
                            title={tx.type}
                            description={
                                <Text type={tx.amount < 0 ? 'danger' : 'success'}>
                                    ${Math.abs(tx.amount).toFixed(2)}
                                </Text>
                            }
                        />
                    </Card>
                </List.Item>
            )}
        />
    );
};

export default TransactionsList;