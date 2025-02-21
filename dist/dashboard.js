"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = './index.html';
    }
}
function fetchAccounts() {
    return __awaiter(this, void 0, void 0, function* () {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            window.location.href = './index.html';
            return [];
        }
        try {
            const response = yield fetch('http://localhost:8080/MoneyAccounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error(`Ошибка при получении аккаунтов: ${response.statusText}`);
            }
            const data = yield response.json();
            return data;
        }
        catch (error) {
            console.error('Ошибка fetchAccounts:', error.message);
            return [];
        }
    });
}
function renderAccounts(accounts) {
    const container = document.getElementById('accountsContainer');
    if (!container)
        return;
    container.innerHTML = '';
    const addCard = document.createElement('div');
    addCard.classList.add('account-card', 'add-new');
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('account-icon');
    iconDiv.textContent = '+';
    addCard.appendChild(iconDiv);
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('account-name');
    nameDiv.textContent = 'Добавить аккаунт';
    addCard.appendChild(nameDiv);
    container.appendChild(addCard);
    accounts.forEach(account => {
        const card = document.createElement('div');
        card.classList.add('account-card');
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('account-icon');
        iconDiv.textContent = '💳';
        card.appendChild(iconDiv);
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('account-name');
        nameDiv.textContent = account.name;
        card.appendChild(nameDiv);
        const balanceDiv = document.createElement('div');
        balanceDiv.classList.add('account-balance');
        balanceDiv.textContent = account.balance.toString();
        card.appendChild(balanceDiv);
        card.addEventListener('click', () => {
            console.log(`Clicked on account ${account.id}`);
        });
        container.appendChild(card);
    });
}
function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessTokenExpiration');
    localStorage.removeItem('refreshTokenExpiration');
    window.location.href = './index.html';
}
function initDashboard() {
    return __awaiter(this, void 0, void 0, function* () {
        checkAuth();
        const accounts = yield fetchAccounts();
        renderAccounts(accounts);
    });
}
window.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});
