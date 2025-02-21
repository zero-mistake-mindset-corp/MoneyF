interface MoneyAccount {
    id: string;
    name: string;
    balance: number;
  }
  function checkAuth() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = './index.html';
    }
  }
  async function fetchAccounts(): Promise<MoneyAccount[]> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = './index.html';
      return [];
    }
  
    try {
      const response = await fetch('http://localhost:8080/MoneyAccounts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка при получении аккаунтов: ${response.statusText}`);
      }
  
      const data = await response.json() as MoneyAccount[];
      return data;
    } catch (error: any) {
      console.error('Ошибка fetchAccounts:', error.message);
      return [];
    }
  }
  
  function renderAccounts(accounts: MoneyAccount[]) {
    const container = document.getElementById('accountsContainer');
    if (!container) return;
  
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
  
  async function initDashboard() {
    checkAuth();
    const accounts = await fetchAccounts();
    renderAccounts(accounts);
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    initDashboard();
  
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  });