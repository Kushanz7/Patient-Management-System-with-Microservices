import axios from 'axios';

export const chargeAccount = (accountId: string, amount: number) => {
    return axios.post(`http://localhost:4004/api/billing/accounts/${accountId}/charge`, { amount });
};

export const payAccount = (accountId: string, amount: number) => {
    return axios.post(`http://localhost:4004/api/billing/accounts/${accountId}/pay`, { amount });
};

export const getTransactions = (accountId: string) => {
    return axios.get(`http://localhost:4004/api/billing/accounts/${accountId}/transactions`);
};

export const getBalance = (accountId: string) => {
    return axios.get(`http://localhost:4004/api/billing/accounts/${accountId}/balance`);
};
