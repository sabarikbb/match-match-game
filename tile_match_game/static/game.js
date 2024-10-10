const gridContainer = document.getElementById('grid-container');
const startBtn = document.getElementById('start-btn');
const enlargeContainer = document.getElementById('match-enlarge-container');
const playAgainBtn = document.getElementById('restart-game-btn');
const startScreen = document.getElementById('start-screen');
const difficultySelection = document.getElementById('difficulty-selection');
const gameContainer = document.getElementById('game-container');
const endScreen = document.getElementById('end-screen');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const congratulationsScreen = document.getElementById('congratulations-screen');
const congratsGif = document.getElementById('congrats-gif');
const toggleRevealBtn = document.getElementById('toggle-reveal-btn');
const loadingScreen = document.getElementById('loading-screen');
const easyBtn = document.getElementById('easy-btn');
const mediumBtn = document.getElementById('medium-btn');
const hardBtn = document.getElementById('hard-btn');
const clickHereBtn = document.getElementById('click-here-btn');

let score = 0;
let firstTile = null;
let secondTile = null;
let lockBoard = false;
let tilesRevealed = false; // Track whether tiles are currently revealed

// Maximum number of reveal/unreveal attempts
const maxRevealAttempts = 10;
let remainingRevealAttempts = maxRevealAttempts; // Track remaining reveal attempts

// Sound Effects
const clickSound = new Audio(`static/sound/click.mp3`);
const matchSound = new Audio(`static/sound/match.mp3`);
const wrongSound = new Audio(`static/sound/wrong.mp3`);
const titleSound = new Audio(`static/sound/title-sound.mp3`);
const winSound = new Audio(`static/sound/congrats2.mp3`);
winSound.loop = true;
const warningSound = new Audio(`static/sound/warning.mp3`); // Sound for clicking revealed tiles
const startBtnSound = new Audio(`static/sound/startbtn-sound.mp3`); // Sound for start and restart game buttons

window.onload = function () {
    loadingScreen.classList.add('hidden');
};

// Show the "Click here" button after loading
window.onload = function () {
    loadingScreen.classList.add('hidden');
    clickHereBtn.classList.remove('hidden'); // Show the button
};

// Function to show title sound and game logic banner
function showTitleAndBanner() {
    const gameLogicBanner = document.getElementById('game-logic-banner');

    titleSound.muted = true; // Mute the sound initially

    // Play the title sound
    titleSound.play().then(() => {
        titleSound.muted = false; // Unmute after starting
        gameLogicBanner.classList.remove('hidden');
        showDifficultyButtons();
        // Hide the game logic banner after 10 seconds
        setTimeout(() => {
            gameLogicBanner.classList.add('hidden');
        }, 10000); // 10 seconds
    }).catch(error => {
        console.log("Autoplay blocked, waiting for user interaction.");
    });

    // Remove the click event listener after first click
    document.removeEventListener('click', showTitleAndBanner);
}

// Function to show difficulty selection buttons
function showDifficultyButtons() {
    difficultySelection.classList.remove('hidden');
}

// Event listener for "Click here" button
clickHereBtn.addEventListener('click', () => {
    clickHereBtn.classList.add('hidden'); // Hide the button when clicked
    showTitleAndBanner(); // Call to show the title and banner
});

// List of available images
let tileImages = [
    'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg',
    'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg', 'img11.jpg', 'img12.jpg',
    'img13.jpg', 'img14.jpg', 'img15.jpg', 'img16.jpg', 'img17.jpg', 'img18.jpg',
    'img19.jpg', 'img20.jpg', 'img21.jpg', 'img22.jpg', 'img23.jpg', 'img24.jpg',
    'img25.jpg', 'img26.jpg', 'img27.jpg', 'img28.jpg', 'img29.jpg', 'img30.jpg',
    'img31.jpg', 'img32.jpg', 'img33.jpg', 'img34.jpg', 'img35.jpg', 'img36.jpg',
    'img37.jpg', 'img38.jpg', 'img39.jpg', 'img40.jpg', 'img41.jpg', 'img42.jpg',
    'img43.jpg', 'img44.jpg', 'img45.jpg', 'img46.jpg', 'img47.jpg', 'img48.jpg',
    'img49.jpg', 'img50.jpg'
];

// Variables to store the number of unique images for each difficulty level
let uniqueImages = [];
let numUniqueImages = 10; // Default to 10 for easy level

// Function to shuffle and duplicate images based on the chosen level
function setTileImages() {
    uniqueImages = tileImages.slice(0, numUniqueImages);
    tileArray = [...uniqueImages, ...uniqueImages]; // Duplicate images

    // If we need to fill more than the number of unique images allows, keep duplicating
    while (tileArray.length < 100) {
        tileArray = [...tileArray, ...uniqueImages];
    }

    tileArray = tileArray.slice(0, 100); // Ensure the grid is exactly 100 tiles
    tileArray = tileArray.sort(() => Math.random() - 0.5); // Shuffle tiles randomly

    // Hide Level Selection after selecting the level
    difficultySelection.classList.add('hidden');
}

function startGame() {
    score = 0;
    remainingRevealAttempts = maxRevealAttempts; // Reset reveal attempts
    tilesRevealed = false; // Ensure tiles start unrevealed
    toggleRevealBtn.disabled = false; // Re-enable the reveal button
    toggleRevealBtn.innerText = `Reveal Tiles (${remainingRevealAttempts} Attempts Left)`; // Reset button text
    scoreElement.innerText = score;
    startScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');
    endScreen.classList.add('hidden');
    congratulationsScreen.classList.add('hidden');
    loadTiles(); // Load a new shuffled grid based on the selected difficulty level
}

function loadTiles() {
    gridContainer.innerHTML = ''; // Clear the grid
    tileArray.forEach((imageSrc, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.image = imageSrc;

        tile.addEventListener('click', () => {
            if (lockBoard || tile === firstTile || tile.classList.contains('matched')) return;

            if (tilesRevealed && tile.classList.contains('revealed')) {
                // Check if the tile was revealed by the reveal/unreveal button
                warningSound.play();  // Play the warning sound
                console.log('Warning: You clicked a revealed tile!'); // Debugging: Ensure this line is executed
                return; // Prevent selecting revealed tiles
            }
            
            // Rest of your tile click handling code
            tile.classList.add('revealed');
            tile.style.backgroundImage = `url(static/img/${imageSrc})`;
            clickSound.play();

            if (!firstTile) {
                firstTile = tile;
            } else {
                secondTile = tile;
                checkForMatch();
            }
        });

        gridContainer.appendChild(tile);
    });
}

function checkForMatch() {
    if (firstTile.dataset.image === secondTile.dataset.image) {
        matchSound.play();
        firstTile.classList.add('matched');
        secondTile.classList.add('matched');
        score += 10; // Add 10 points for a match
        scoreElement.innerText = score;

        // Display enlarged image and confetti
        displayEnlargedMatch(firstTile.dataset.image);

        setTimeout(() => {
            // Show confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
           
            // Set tiles to vanish after showing enlarged image    
            firstTile.style.opacity = '0';
            secondTile.style.opacity = '0';
            resetBoard();
            checkForWin();
        }, 300); // Delay to allow the match sound to play and image display
    } else {
        wrongSound.play();
        score -= 2; // Deduct 2 points for a mismatch
        scoreElement.innerText = score;

        lockBoard = true;
        setTimeout(() => {
            firstTile.classList.remove('revealed');
            secondTile.classList.remove('revealed');
            firstTile.style.backgroundImage = '';
            secondTile.style.backgroundImage = '';
            resetBoard();
        }, 1000);
    }
}

function displayEnlargedMatch(imageSrc) {
    const enlargeContainer = document.getElementById('match-enlarge-container');
    const enlargedImage = document.getElementById('match-enlarged-image');
    
    // Set the image source
    enlargedImage.src = `static/img/${imageSrc}`;

    // Show the container
    enlargeContainer.classList.remove('hidden');

    // Confetti effect
    launchConfetti(); // Trigger confetti when the tiles match

    // Hide after 1 second
    setTimeout(() => {
        enlargeContainer.classList.add('hidden');
    }, 1000);
}

function launchConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#bb0000', '#ffffff'], // You can customize colors here
    });
}

function checkForWin() {
    const matchedTiles = document.querySelectorAll('.tile.matched');
    if (matchedTiles.length === tileArray.length) {
        showCongratulations();
    }
}

function resetBoard() {
    [firstTile, secondTile] = [null, null];
    lockBoard = false;
}

function showCongratulations() {
    winSound.play().catch(error => {
        console.log("Unable to play sound. User interaction might be needed.");
    });

    gameContainer.classList.add('hidden');
    endScreen.classList.add('hidden');
    congratulationsScreen.classList.remove('hidden');
    document.getElementById('congrats-final-score').innerText = score;
}

// Function to toggle reveal and unreveal
function toggleRevealTiles() {
    const revealSound = new Audio(`static/sound/reveal-unreveal.mp3`); // Add your sound file
    revealSound.play();

    const allTiles = document.querySelectorAll('.tile');

    if (tilesRevealed) {
        // Unreveal tiles
        allTiles.forEach(tile => {
            if (!tile.classList.contains('matched')) {
                tile.classList.remove('revealed'); // Remove the 'revealed' class
                tile.style.backgroundImage = ''; // Clear the background image
            }
        });
    } else {
        // Reveal tiles
        if (remainingRevealAttempts <= 0) {
            return; // Do nothing if no attempts left
        }

        allTiles.forEach(tile => {
            if (!tile.classList.contains('matched')) {
                tile.classList.add('revealed'); // Add the 'revealed' class
                tile.style.backgroundImage = `url(static/img/${tile.dataset.image})`; // Use 'url()' function
            }
        });

        // Decrease the remaining attempts only on reveal
        remainingRevealAttempts--;

        // Update the button text with the remaining attempts
        toggleRevealBtn.innerText = `Unreveal Tiles (${remainingRevealAttempts} Attempts Left)`;
        

    // If no reveal attempts are left, disable the button
        if (remainingRevealAttempts === 0) {
            toggleRevealBtn.innerText = 'No Reveal Attempts Left';
        }
    }

    tilesRevealed = !tilesRevealed; // Toggle the reveal state
        
    if (!tilesRevealed && remainingRevealAttempts > 0) {
        // Change button text back to "Reveal" when tiles are unrevealed
        toggleRevealBtn.innerText = `Reveal Tiles (${remainingRevealAttempts} Attempts Left)`;
    }
}

// Add event listener for the toggle button
toggleRevealBtn.addEventListener('click', toggleRevealTiles);

// Add click sound for the "Restart Game" button
playAgainBtn.addEventListener('click', () => {
    startBtnSound.play(); // Play startBtnSound
    startGame();
});

// Event listeners for difficulty selection
easyBtn.addEventListener('click', () => {
    selectedLevel = 'easy'; // Set selected level to easy
    numUniqueImages = 10; // Set to 10 unique images for the easy level
    setTileImages();
    startGame();
    startBtnSound.play(); //Play startBtnSound
    titleSound.pause(); // Pause the title sound when game starts
    titleSound.currentTime = 0; // Reset to start in case you want to replay it later
    // Hide the enlarged match container when the game starts
    enlargeContainer.classList.add('hidden');
});

mediumBtn.addEventListener('click', () => {
    selectedLevel = 'medium'; // Set selected level to medium
    numUniqueImages = 25; // Set to 25 unique images for the medium level
    setTileImages();
    startGame();
    startBtnSound.play(); //Play startBtnSound
    titleSound.pause(); // Pause the title sound when game starts
    titleSound.currentTime = 0; // Reset to start in case you want to replay it later
    // Hide the enlarged match container when the game starts
    enlargeContainer.classList.add('hidden');
});

hardBtn.addEventListener('click', () => {
    selectedLevel = 'hard'; // Set selected level to hard
    numUniqueImages = 50; // Set to 50 unique images for the difficult level
    setTileImages();
    startGame();
    startBtnSound.play(); //Play startBtnSound
    titleSound.pause(); // Pause the title sound when game starts
    titleSound.currentTime = 0; // Reset to start in case you want to replay it later
    // Hide the enlarged match container when the game starts
    enlargeContainer.classList.add('hidden');
});