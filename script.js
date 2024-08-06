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

const EVENTS_DELAY = 20000;

document.getElementById('startBtn').addEventListener('click', async () => {
    const gameChoice = parseInt(document.getElementById('game').value);
    const keyCount = parseInt(document.getElementById('keyCountSelect').value);
    const { appToken, promoId } = games[gameChoice];

    const startBtn = document.getElementById('startBtn');
    const keyCountLabel = document.getElementById('keyCountLabel');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const keyContainer = document.getElementById('keyContainer');
    const keysList = document.getElementById('keysList');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const generatedKeysTitle = document.getElementById('generatedKeysTitle');

    keyCountLabel.innerText = `Number of keys: ${keyCount}`;

    progressBar.style.width = '0%';
    progressText.innerText = '0%';
    progressContainer.classList.remove('hidden');
    keyContainer.classList.add('hidden');
    generatedKeysTitle.classList.add('hidden');
    keysList.innerHTML = '';
    copyAllBtn.classList.add('hidden');
    startBtn.disabled = true;

    let progress = 0;
    const updateProgress = (increment) => {
        progress += increment;
        progressBar.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;
    };

    const generateKeyProcess = async () => {
        const clientId = generateClientId();
        let clientToken;
        try {
            clientToken = await login(clientId, appToken);
        } catch (error) {
            console.error(`Failed to login: ${error.message}`);
            alert(`Failed to login: ${error.message}`);
            startBtn.disabled = false;
            return null;
        }

        for (let i = 0; i < 7; i++) {
            await sleep(EVENTS_DELAY * delayRandom());
            try {
                const hasCode = await emulateProgress(clientToken, promoId);
                updateProgress(10 / keyCount);
                if (hasCode) {
                    break;
                }
            } catch (error) {
                console.error(`Failed to emulate progress: ${error.message}`);
                alert(`Failed to emulate progress: ${error.message}`);
                startBtn.disabled = false;
                return null;
            }
        }

        try {
            const key = await generateKey(clientToken, promoId);
            updateProgress(30 / keyCount);
            return key;
        } catch (error) {
            console.error(`Failed to generate key: ${error.message}`);
            alert(`Failed to generate key: ${error.message}`);
            return null;
        }
    };

    const keys = await Promise.all(Array.from({ length: keyCount }, generateKeyProcess));

    if (keys.length > 1) {
        keysList.innerHTML = keys.filter(key => key).map(key => `
            <div class="key-item">
                <input type="text" value="${key}" readonly>
                <button class="copyKeyBtn" data-key="${key}">Copy key</button>
            </div>
        `).join('');
        copyAllBtn.classList.remove('hidden');
    } else if (keys.length === 1) {
        keysList.innerHTML = `
            <div class="key-item">
                <input type="text" value="${keys[0]}" readonly>
                <button class="copyKeyBtn" data-key="${keys[0]}">Copy key</button>
            </div>
        `;
    }

    keyContainer.classList.remove('hidden');
    generatedKeysTitle.classList.remove('hidden');
    document.querySelectorAll('.copyKeyBtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const key = event.target.getAttribute('data-key');
            navigator.clipboard.writeText(key).then(() => {
                const copyStatus = document.getElementById('copyStatus');
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            });
        });
    });
    copyAllBtn.addEventListener('click', () => {
        const keysText = keys.filter(key => key).join('\n');
        navigator.clipboard.writeText(keysText).then(() => {
            const copyStatus = document.getElementById('copyStatus');
            copyStatus.classList.remove('hidden');
            setTimeout(() => copyStatus.classList.add('hidden'), 2000);
        });
    });

    progressBar.style.width = '100%';
    progressText.innerText = '100%';

    startBtn.classList.remove('hidden');
    startBtn.disabled = false;
});

document.getElementById('generateMoreBtn').addEventListener('click', () => {
    document.getElementById('progressContainer').classList.add('hidden');
    document.getElementById('keyContainer').classList.add('hidden');
    document.getElementById('startBtn').classList.remove('hidden');
    document.getElementById('keyCountSelect').classList.remove('hidden');
    document.getElementById('generatedKeysTitle').classList.add('hidden');
    document.getElementById('copyAllBtn').classList.add('hidden');
    document.getElementById('keysList').innerHTML = '';
    document.getElementById('keyCountLabel').innerText = 'Number of keys:';
});

document.getElementById('creatorChannelBtn').addEventListener('click', () => {
    window.location.href = 'https://t.me/iAlexMG';
});

function generateClientId() {
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
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
    }
    return data.clientToken;
}

async function emulateProgress(clientToken, promoId) {
    const response = await fetch('https://api.gamepromo.io/promo/register-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken}`
        },
        body: JSON.stringify({
            promoId,
            eventId: crypto.randomUUID(),
            eventOrigin: 'undefined'
        })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to register event');
    }
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
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to generate key');
    }
    return data.promoCode;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function delayRandom() {
    return Math.random() / 3 + 1;
}
