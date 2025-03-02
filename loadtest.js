const axios = require('axios');
const port = process.env.PORT || 3000;
const userId = 1; // The user ID we're working with
const requestCount = 10000;
async function sendRequests() {
    let successCount = 0;
    let failureCount = 0;
    const promises = [];
    for (let i = 0; i < requestCount; i++) {
        promises.push(
            axios.post(`http://localhost:${port}/update-balance`, { userId, amount: -2 })
                .then(response => {
                    console.log('Success:', response.data);
                    successCount++;
                })
                .catch(error => {
                    if (error.response) {
                        console.log('Error:', error.response.data);
                    } else {
                        console.log('Error:', error.message);
                    }
                    failureCount++;
                })
        );
    }

    await Promise.all(promises);

    console.log(`Total Success: ${successCount}`);
    console.log(`Total Failure: ${failureCount}`);
}

// Run the performance test
sendRequests();
