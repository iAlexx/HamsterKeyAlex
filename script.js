// Function to handle the key generation process
async function generateKeys() {
    const gameChoice = parseInt(document.getElementById('game').value);
    const keyCount = parseInt(document.getElementById('keyCount').value);
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Generating keys...';

    try {
        const keys = await main(gameChoice, keyCount);
        if (keys.length > 0) {
            resultsDiv.innerHTML = 'Generated Keys:<br>' + keys.join('<br>');
        } else {
            resultsDiv.innerHTML = 'No keys were generated.';
        }
    } catch (error) {
        resultsDiv.innerHTML = `Error: ${error.message}`;
    }
}

// Code converted from Python to JavaScript
const games = {
    1: {
        name: 'Riding Extreme 3D',
        appToken: 'd28721be-fd2d-4b45-869e-9f253b554e50',
        promoId: '43e35910-c168-4634-ad4f-52fd764a843f',
    },
    2: {
        name: 'Chain Cube 2048',
        appToken: 'd1690a07-3780-4068-810f-9b5bbf2931b2',
        promoId: 'b4170868-cef0-424f-8eb9-be0622e8e8e3',
    },
    3: {
        name: 'My Clone Army',
        appToken: '74ee0b5b-775e-4bee-974f-63e7f4d5bacb',
        promoId: 'fe693b26-b342-4159-8808-15e3ff7f8767',
    },
    4: {
        name: 'Train Miner',
        appToken: '82647f43-3f87-402d-88dd-09a90025313f',
        promoId: 'c4480ac7-e178-4973-8061-9ed5b2e17954',
    }
};

const EVENTS_DELAY = 20000 / 1000; // converting milliseconds to seconds

async function generateClientId() {
    const timestamp = Date.now();
    const randomNumbers = Array.from({ length: 19 }, () => Math.floor(Math.random() * 10)).join('');
    return `${timestamp}-${randomNumbers}`;
}

async function login(clientId, appToken) {
    const response = await fetch('https://api.gamepromo.io/promo/login-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appToken, clientId, clientOrigin: 'deviceid' })
    });
    if (!response.ok) {
        throw new Error(`Failed to login: ${response.statusText}`);
    }
    const data = await response.json();
    return data.clientToken;
}

async function emulateProgress(clientToken, promoId) {
    const response = await fetch('https://api.gamepromo.io/promo/register-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({ promoId, eventId: uuidv4(), eventOrigin: 'undefined' })
    });
    if (!response.ok) {
        throw new Error(`Failed to register event: ${response.statusText}`);
    }
    const data = await response.json();
    return data.hasCode;
}

async function generateKey(clientToken, promoId) {
    const response = await fetch('https://api.gamepromo.io/promo/create-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({ promoId })
    });
    if (!response.ok) {
        throw new Error(`Failed to generate key: ${response.statusText}`);
    }
    const data = await response.json();
    return data.promoCode;
}

async function generateKeyProcess(appToken, promoId) {
    const clientId = await generateClientId();
    let clientToken;
    try {
        clientToken = await login(clientId, appToken);
    } catch (error) {
        console.error(error.message);
        return null;
    }

    for (let i = 0; i < 11; i++) {
        await new Promise(resolve => setTimeout(resolve, EVENTS_DELAY * (Math.random() / 3 + 1)));
        try {
            const hasCode = await emulateProgress(clientToken, promoId);
            if (hasCode) {
                break;
            }
        } catch (error) {
            continue;
        }
    }

    try {
        const key = await generateKey(clientToken, promoId);
        return key;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

async function main(gameChoice, keyCount) {
    const game = games[gameChoice];
    const tasks = Array.from({ length: keyCount }, () => generateKeyProcess(game.appToken, game.promoId));
    const keys = await Promise.all(tasks);
    return keys.filter(key => key);
}

// Utility function to generate UUID v4
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
