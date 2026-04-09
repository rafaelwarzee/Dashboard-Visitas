const axios = require('axios');

async function testDelete() {
    try {
        console.log('Testing DELETE with correct password...');
        const res = await axios.delete('http://localhost:3001/api/insights', {
            data: { password: '1234' }
        });
        console.log('Success:', res.data);
    } catch (e) {
        console.log('Error:', e.response ? e.response.status : e.message);
        if (e.response) console.log('Data:', e.response.data);
    }

    try {
        console.log('\nTesting DELETE with incorrect password...');
        const res = await axios.delete('http://localhost:3001/api/insights', {
            data: { password: 'wrong' }
        });
        console.log('Success (Wait, this should fail):', res.data);
    } catch (e) {
        console.log('Expected Error:', e.response ? e.response.status : e.message);
        if (e.response) console.log('Data:', e.response.data);
    }
}

testDelete();
