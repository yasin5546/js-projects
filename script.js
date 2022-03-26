'use strict';

// BANKIST APP inspired by Jonas Sir.....

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2022-03-20T23:36:17.929Z',
    '2022-03-25T10:51:36.790Z',
  ],
  locale: 'pt-PT',
  currency: 'EUR',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  locale: 'en-US',
  currency: 'USD',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  locale: 'en-CA',
  currency: 'CAD',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  locale: 'en-ZW',
  currency: 'USD',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//formatting currency
const formatCurrr = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//creating username

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(arr => arr.slice(0, 1))
      .join('');
  });
};

createUsernames(accounts);

const displayDatetime = function (date, locale) {
  const calcda = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daypassed = calcda(new Date(), date);

  if (daypassed === 0) return 'Today';
  if (daypassed === 1) return 'Yesterday';
  if (daypassed <= 7) return `${daypassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};

//creating movements of money
const movementsss = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const move = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  move.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date(acc.movementsDates[i]);
    const displayDate = displayDatetime(now, acc.locale);

    const formattedMov = formatCurrr(mov, acc.locale, acc.currency);
    const html = `
   <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
   </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// creating balances

const calcbalance = function (acc) {
  acc.balance = acc.movements.reduce(function (accum, mov) {
    return accum + mov;
  }, 0);
  const formattedbalance = formatCurrr(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedbalance}`;
};
//creating balance summury

const calcdisplaySummery = function (acc) {
  const deposit = acc.movements
    .filter(mov => mov > 0)
    .reduce(function (acc, mov) {
      return acc + mov;
    });
  const formattedDeposit = formatCurrr(deposit, acc.locale, acc.currency);
  labelSumIn.textContent = `${formattedDeposit}`;

  const withdrawal = acc.movements
    .filter(mov => mov < 0)
    .reduce(function (acc, mov) {
      return acc + mov;
    });
  const formattedwithdrawal = formatCurrr(
    Math.abs(withdrawal),
    acc.locale,
    acc.currency
  );
  labelSumOut.textContent = `${formattedwithdrawal}`;

  const interest = acc.movements
    .filter(ac => ac > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((accum, int) => accum + int, 0);
  const formattedinterest = formatCurrr(interest, acc.locale, acc.currency);
  labelSumInterest.textContent = `${formattedinterest}`;
};

//update ui

const updateUI = function (acc) {
  movementsss(acc);
  calcbalance(acc);
  calcdisplaySummery(acc);
};

const greetings = function () {
  const time = new Date().getHours();
  if (time <= 6) {
    return 'Good Night!';
  } else if (time <= 12) {
    return 'Good Morning!';
  } else if (time <= 18) {
    return 'Good Day!';
  } else if (time <= 24) {
    return 'Good Night!';
  }
};
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    //  stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    time--;
  };

  // Set time to 5 minutes
  let time = 300;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};
let currentAccount, timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  const welcomeMsg = `${greetings()} ${currentAccount.owner.split(' ')[0]}`;
  labelWelcome.textContent = welcomeMsg;

  if (currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    //clock
    const now = new Date();
    const options = {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const time = Intl.DateTimeFormat(currentAccount.locale, options).format(
      now
    );

    labelDate.textContent = time;

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAccount.username != currentAccount.username
  ) {
    receiverAccount.movements.push(+amount);
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    updateUI(currentAccount);
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// implementing loan function

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2000);
  }

  inputLoanAmount.value = '';
});

// deleting account

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(currentAccount, 1);
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

//implementing sort function..
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  movementsss(currentAccount.movements, !sorted);
  sorted = !sorted;
});
