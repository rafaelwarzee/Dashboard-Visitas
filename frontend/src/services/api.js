import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export const fetchSource1 = async () => {
    const res = await api.get('/data/source1');
    return res.data;
};

export const fetchSource2 = async () => {
    const res = await api.get('/data/source2');
    return res.data;
};

export const fetchInsights = async () => {
    const res = await api.get('/insights');
    return res.data;
};

export const saveInsights = async (payload) => {
    const res = await api.post('/insights', payload);
    return res.data;
};

export const deleteInsights = async (password, pageKey) => {
    // Using query params for DELETE compatibility
    const res = await api.delete('/insights', { params: { password, pageKey } });
    return res.data;
};
