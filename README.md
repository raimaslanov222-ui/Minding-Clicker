<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Minding Clicker Ultimate</title>
    
    <style>
        /* ВСТАВЛЯЕМ СТИЛИ ПРЯМО СЮДА */
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        
        body {
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            background-color: #0f0f1a;
            color: white;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        .red-hill {
            height: 40vh;
            background: linear-gradient(180deg, #ff3333 0%, #800000 100%);
            border-bottom-left-radius: 50% 20%;
            border-bottom-right-radius: 50% 20%;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 5px 30px rgba(255, 0, 0, 0.5);
            z-index: 1;
        }

        #money { font-size: 4.5rem; margin: 0; font-weight: 900; text-shadow: 2px 4px 10px rgba(0,0,0,0.4); }
        .record-box { background: rgba(0,0,0,0.3); padding: 5px 20px; border-radius: 50px; margin-top: 10px; font-weight: bold; }

        .game-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 2;
            margin-top: -40px;
        }

        #main-button {
            width: 280px;
            height: 280px;
            border-radius: 50%;
            background-color: #ff4d4d;
            border: 10px solid #ffffff;
            /* Картинка подгрузится, если файл рядом */
            background-image: url('button.png');
            background-size: cover;
            background-position: center;
            box-shadow: 0 0 50px rgba(255, 77, 77, 0.7);
            cursor: pointer;
            transition: transform 0.05s ease;
        }

        #main-button:active { transform: scale(0.9); }

        .shop-panel {
            width: 95%;
            max-width: 400px;
            background: #1a1a2e;
            padding: 15px;
            border-radius: 25px;
            border: 2px solid #333;
            margin-bottom: 20px;
        }

        .mini-info { display: flex; justify-content: space-around; margin-bottom: 15px; color: #4ecca3; font-weight: bold; }
        .shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }

        .upgrade-item {
            background: #252545;
            border: 1px solid #ff3333;
            color: white;
            padding: 12px 2px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
        }
        .upgrade-item:active { background: #ff3333; }
    </style>
</head>
<body>

    <div class="red-hill">
        <div class="stats-container">
            <h1 id="money">0</h1>
            <p>МОНЕТЫ</p>
            <div class="record-box">🏆 Рекорд: <span id="highscore">0</span></div>
        </div>
    </div>

    <div class="game-content">
        <div class="click-area">
            <div id="main-button"></div>
        </div>

        <div class="shop-panel">
            <div class="mini-info">
                <span>Клик: +<b id="click-power">1</b></span>
                <span>Авто: +<b id="cps">0</b>/с</span>
            </div>
            <div class="shop-grid">
                <button class="upgrade-item" id="buy-click">💪 Сила<br><span id="click-price">10</span></button>
                <button class="upgrade-item" id="buy-auto">🤖 Авто<br><span id="auto-price">50</span></button>
                <button class="upgrade-item" id="buy-boost">🚀 Буст<br><span id="boost-price">500</span></button>
            </div>
        </div>
    </div>

    <script>
        /* ВСТАВЛЯЕМ ЛОГИКУ ПРЯМО СЮДА */
        let money = parseFloat(localStorage.getItem('money')) || 0;
        let clickPower = parseInt(localStorage.getItem('clickPower')) || 1;
        let autoIncome = parseInt(localStorage.getItem('autoIncome')) || 0;
        let highscore = parseFloat(localStorage.getItem('highscore')) || 0;

        let prices = {
            click: parseInt(localStorage.getItem('p_click')) || 10,
            auto: parseInt(localStorage.getItem('p_auto')) || 50,
            boost: parseInt(localStorage.getItem('p_boost')) || 500
        };

        const moneyEl = document.getElementById('money');
        const highscoreEl = document.getElementById('highscore');
        const mainBtn = document.getElementById('main-button');

        function updateUI() {
            moneyEl.innerText = Math.floor(money);
            highscoreEl.innerText = Math.floor(highscore);
            document.getElementById('click-power').innerText = clickPower;
            document.getElementById('cps').innerText = autoIncome;
            document.getElementById('click-price').innerText = prices.click;
            document.getElementById('auto-price').innerText = prices.auto;
            document.getElementById('boost-price').innerText = prices.boost;

            if (money > highscore) {
                highscore = money;
                localStorage.setItem('highscore', highscore);
            }

            localStorage.setItem('money', money);
            localStorage.setItem('clickPower', clickPower);
            localStorage.setItem('autoIncome', autoIncome);
            localStorage.setItem('p_click', prices.click);
            localStorage.setItem('p_auto', prices.auto);
            localStorage.setItem('p_boost', prices.boost);
        }

        // Поддержка клика для всех устройств
        const handleInteraction = (e) => {
            if (e.type === 'touchstart') e.preventDefault();
            money += clickPower;
            updateUI();
        };

        mainBtn.addEventListener('touchstart', handleInteraction);
        mainBtn.addEventListener('mousedown', handleInteraction);

        // Магазин
        document.getElementById('buy-click').onclick = () => {
            if (money >= prices.click) {
                money -= prices.click;
                clickPower += 1;
                prices.click = Math.round(prices.click * 1.5);
                updateUI();
            }
        };

        document.getElementById('buy-auto').onclick = () => {
            if (money >= prices.auto) {
                money -= prices.auto;
                autoIncome += 1;
                prices.auto = Math.round(prices.auto * 1.6);
                updateUI();
            }
        };

        document.getElementById('buy-boost').onclick = () => {
            if (money >= prices.boost) {
                money -= prices.boost;
                clickPower *= 2;
                prices.boost = Math.round(prices.boost * 4);
                updateUI();
            }
        };

        setInterval(() => {
            money += autoIncome;
            updateUI();
        }, 1000);

        updateUI();
    </script>
</body>
</html>
