const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCard: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
}

const pathImages = "./src/assets/icons/"
const pathAudio = "./src/assets/audios/"

const playerSides = {
    player: "player-cards",
    computer: "computer-cards"
}

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        Path: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        Path: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissor",
        Path: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1]
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id
}

async function createCardImage(randomIdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "180px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", randomIdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player) {
        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data-id"));
        })

        cardImage.addEventListener("mouseover", () => {
        drawnSelectCard(randomIdCard);
        })
    }

    return cardImage;

}

async function setCardField(cardId) {
    await removeAllCardImages();

    let computerCardId = await getRandomCardId()

    state.fieldCard.player.style.display = "block"
    state.fieldCard.computer.style.display = "block"

    await hiddenCardDetails

    state.fieldCard.player.src = cardData[cardId].Path;
    state.fieldCard.computer.src = cardData[computerCardId].Path;

    let duelResults = await checkDuelResults(cardId, computerCardId)

    await updateScore()
    await drawnButton(duelResults)
}


async function hiddenCardDetails() {
    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
}

async function removeAllCardImages(){
    let cards = document.querySelector("#computer-cards")
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    cards = document.querySelector("#player-cards")
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults =  "Drawn"
    let playerCard = cardData[playerCardId]


    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++
    }
    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "lose"
        state.score.computerScore++
    }

    await playAudio(duelResults)
    return duelResults
}

async function drawnButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} / Lose: ${state.score.computerScore} `
    
}

async function resetDuel(){
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none"

    state.fieldCard.player.style.display = "none"
    state.fieldCard.computer.style.display = "none"

    init()
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
}

async function drawnSelectCard(id) {
    state.cardSprites.avatar.src = cardData[id].Path;    
    state.cardSprites.name.innerText = cardData[id].name;
    state.cardSprites.type.innerText = `Atributte: ${cardData[id].type}`;
}

async function dranwCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide)

        document.getElementById(fieldSide).appendChild(cardImage)
        
    }
}

function init(){
    dranwCards(5, playerSides.player)
    dranwCards(5, playerSides.computer)

    const bgm = document.getElementById("bgm")
    bgm.play()
    bgm.volume = 0.05
}  


init()