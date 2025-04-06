let web3;
let userAddress = null;
let checkInContract;
let tokenContract;
let accounts = [];

const connectWalletBtn = document.getElementById('connectWallet');
const walletAddressEl = document.getElementById('walletAddress');
const tokensEarnedEl = document.getElementById('tokensEarned');
const currentStreakEl = document.getElementById('currentStreak');
const lastCheckInTimeEl = document.getElementById('lastCheckInTime');
const checkinBtn = document.getElementById('checkinBtn');
const nextCheckInAvailableEl = document.getElementById('nextCheckInAvailable');
const successMessageEl = document.getElementById('successMessage');
const errorMessageEl = document.getElementById('errorMessage');

const contractConfig = {
    checkInContractAddress: "0x9B9802aA6733A6c0C73D648C04309bB75545DB20", // Alamat kontrak DailyCheckIn
    tokenContractAddress: "0xba23a41D666B472964FE9B34D570bE4d7b50DA73",  // Points 
    checkInABI: [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenAddress",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "rewardAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "currentStreak",
                    "type": "uint256"
                }
            ],
            "name": "CheckedIn",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "checkIn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "fundContract",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_tokenAddress",
                    "type": "address"
                }
            ],
            "name": "setTokenAddress",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "newTokenAddress",
                    "type": "address"
                }
            ],
            "name": "TokenAddressUpdated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "TokensWithdrawn",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawTokens",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "canCheckIn",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "CHECK_IN_INTERVAL",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getUserCheckInCount",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getUserStats",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "currentStreak",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "longestStreak",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalCheckInsForUser",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastCheckInTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalTokensEarned",
                    "type": "uint256"
                },
                {
                    "internalType": "bool",
                    "name": "canUserCheckIn",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "rewardToken",
            "outputs": [
                {
                    "internalType": "contract IERC20",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "timeUntilNextCheckIn",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "TOKEN_REWARD",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalCheckIns",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalUsers",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "userStats",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "currentStreak",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "longestStreak",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalCheckIns",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "lastCheckInTime",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "totalTokensEarned",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ],
    tokenABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Burn",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "mint",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "success",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

const TEA_SEPOLIA_CHAIN_ID = '0x27ea';

async function init() {
    if (typeof window.ethereum === 'undefined') {
        showError('Please install MetaMask to use this application!');
        return;
    }

    try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        await checkAndSwitchNetwork();

        await initializeWeb3();
        await initContracts();

        await updateAllData();

        setupEventListeners();

    } catch (error) {
        console.error('Initialization failed:', error);
        showError(error.message || 'Failed to initialize application');
    }
}

async function checkAndSwitchNetwork() {
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });

        if (chainId !== TEA_SEPOLIA_CHAIN_ID) {
            await switchOrAddChain();
        }
    } catch (error) {
        console.error('Network switch failed:', error);
        throw error;
    }
}

async function switchOrAddChain() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: TEA_SEPOLIA_CHAIN_ID }],
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: TEA_SEPOLIA_CHAIN_ID,
                        chainName: 'TEA-Sepolia',
                        nativeCurrency: {
                            name: 'TEA',
                            symbol: 'TEA',
                            decimals: 18
                        },
                        rpcUrls: ['https://tea-sepolia.g.alchemy.com/public'],
                        blockExplorerUrls: []
                    }],
                });
            } catch (addError) {
                console.error('Failed to add TEA-Sepolia network:', addError);
                throw new Error('Failed to add TEA-Sepolia network');
            }
        } else {
            console.error('Failed to switch to TEA-Sepolia network:', switchError);
            throw new Error('Failed to switch to TEA-Sepolia network');
        }
    }
}

async function initializeWeb3() {
    web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
        userAddress = accounts[0];
        updateWalletUI();
    }
}

function initContracts() {
    checkInContract = new web3.eth.Contract(
        contractConfig.checkInABI,
        contractConfig.checkInContractAddress
    );

    tokenContract = new web3.eth.Contract(
        contractConfig.tokenABI,
        contractConfig.tokenContractAddress
    );
}

async function updateAllData() {
    try {
        if (!userAddress) return;

        const [stats, tokensEarned, canCheckIn] = await Promise.all([
            checkInContract.methods.getUserStats(userAddress).call(),
            tokenContract.methods.balanceOf(userAddress).call(),
            checkInContract.methods.canCheckIn(userAddress).call()
        ]);

        updateUI(stats, tokensEarned, canCheckIn);

    } catch (error) {
        console.error("Error loading contract data:", error);
        showError('Error loading data: ' + (error.message || error));
    }
}

function updateUI(stats, tokensEarned, canCheckIn) {
    tokensEarnedEl.textContent = web3.utils.fromWei(tokensEarned, 'ether');

    currentStreakEl.textContent = `${stats.currentStreak} days${stats.currentStreak != 1 ? 's' : ''}`;

    if (stats.lastCheckInTime > 0) {
        const lastCheckInDate = new Date(stats.lastCheckInTime * 1000);
        lastCheckInTimeEl.textContent = lastCheckInDate.toLocaleString();
    } else {
        lastCheckInTimeEl.textContent = 'Never';
    }

    checkinBtn.disabled = !canCheckIn;

    if (!canCheckIn && stats.lastCheckInTime > 0) {
        updateCountdown(stats.lastCheckInTime);
    }

    hideError();
}

function updateWalletUI() {
    if (userAddress) {
        walletAddressEl.textContent = `Connected: ${userAddress.substring(0, 6)}...${userAddress.substring(38)}`;
        connectWalletBtn.textContent = 'Connected';
        connectWalletBtn.disabled = true;
        checkinBtn.disabled = false;
    } else {
        resetUI();
    }
}

function updateCountdown(lastCheckInTime) {
    const lastCheckIn = new Date(lastCheckInTime * 1000);
    const nextCheckIn = lastCheckIn.getTime() + 24 * 60 * 60 * 1000;

    function update() {
        const now = new Date();
        const diff = nextCheckIn - now;

        if (diff <= 0) {
            checkinBtn.disabled = false;
            nextCheckInAvailableEl.textContent = '';
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        nextCheckInAvailableEl.textContent = `Next check-in: ${hours}h ${minutes}m ${seconds}s`;

        setTimeout(update, 1000);
    }

    update();
}

async function handleCheckIn() {
    if (!userAddress) return;

    try {
        checkinBtn.disabled = true;
        showSuccess('Processing transaction...');

        const tx = await checkInContract.methods.checkIn().send({ from: userAddress });

        showSuccess('Check-in successful!');
        await updateAllData();

        setTimeout(hideSuccess, 5000);

    } catch (error) {
        console.error("Error during check-in:", error);
        showError('Error: ' + (error.message || error));
        checkinBtn.disabled = false;
    }
}

function resetUI() {
    tokensEarnedEl.textContent = '0';
    currentStreakEl.textContent = '0 days';
    lastCheckInTimeEl.textContent = 'Never';
    checkinBtn.disabled = true;
    nextCheckInAvailableEl.textContent = '';
    walletAddressEl.textContent = '';
    connectWalletBtn.textContent = 'Connect Wallet';
    connectWalletBtn.disabled = false;
}

function showSuccess(message) {
    successMessageEl.textContent = message;
    successMessageEl.classList.remove('hidden');
    successMessageEl.classList.add('block');
}

function hideSuccess() {
    successMessageEl.classList.remove('block');
    successMessageEl.classList.add('hidden');
}

function showError(message) {
    errorMessageEl.textContent = message;
    errorMessageEl.classList.remove('hidden');
    errorMessageEl.classList.add('block');
}

function hideError() {
    errorMessageEl.classList.remove('block');
    errorMessageEl.classList.add('hidden');
}

function setupEventListeners() {
    connectWalletBtn.addEventListener('click', init);

    checkinBtn.addEventListener('click', handleCheckIn);

    window.ethereum.on('accountsChanged', (newAccounts) => {
        if (newAccounts.length > 0) {
            userAddress = newAccounts[0];
            updateWalletUI();
            updateAllData();
        } else {
            userAddress = null;
            resetUI();
        }
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });
}

window.addEventListener('load', () => {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_accounts' })
            .then(accounts => {
                if (accounts.length > 0) {
                    init();
                }
            })
            .catch(console.error);
    }

    connectWalletBtn.addEventListener('click', init);
});