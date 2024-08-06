<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Key Generator Hamster Kombat</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="language-selector">
        <select id="languageSelect">
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="ru">Русский</option>
        </select>
        
    </div>
    <div class="main-container">
        <div class="container">
            <h1>Key Generator Hamster Kombat</h1>
            <label for="gameSelect" id="gameSelectLabel">Select a game to generate a key:</label>
            <select id="gameSelect">
                <option value="MyCloneArmy">My Clone Army</option>
                <option value="ChainCube2048">Chain Cube 2048</option>
                <option value="TrainMiner">Train Miner</option>
                <option value="BikeRide3D">Bike Ride 3D</option>
            </select>
            <label for="keyCountSelect" id="keyCountLabel">Select the number of keys to generate:</label>
            <select id="keyCountSelect">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
            </select>
            <button id="startBtn" class="button">Generate keys</button>
            <div id="progressContainer" class="progress-container hidden">
                <div id="progressBar" class="progress-bar"></div>
                <span id="progressText" class="progress-text">0%</span>
            </div>
            <div id="keyContainer" class="key-container hidden">
                <h2 id="generatedKeysTitle">Generated keys:</h2>
                <button id="copyAllBtn" class="button hidden">Copy all keys</button>
                <div id="keysList" class="keys-list"></div>
            </div>
        </div>
        <button id="creatorChannelBtn" class="button footer-button">Powered By || AC : @xDevAlex || CH : @iAlexMG || Click Here To Follow us</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
