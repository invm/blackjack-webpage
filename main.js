const play = document.querySelector("#play");
const game = document.querySelector(".game");

var cash = 10000;
//------------------------------------------------------------------------------------
// SLIDER
const slides = document.querySelectorAll(".slide");
let auto = true;
const intervalTime = 4000;
let slideInterval;
const nextSlide = () => {
  const current = document.querySelector(".current");
  //Get current class and remove it
  //Check for next slide
  if (current.nextElementSibling) {
    //Add current to nexr sibling
    current.nextElementSibling.classList.add("current");
  } else {
    //Add current to start
    slides[0].classList.add("current");
  }
  setTimeout(() => current.classList.remove("current"));
};

//STOPS SLIDER AND STARTS GAME
const playNow = () => {
  const current = document.querySelector(".current");
  removeElement("playbutton");
  current.classList.remove("current");
  auto = false;
  clearInterval(slideInterval);
  slides[2].classList.add("current");
  game.classList.add("current");
  setInterval(game.setAttribute("style", "opacity :1;"), 10000);
  populateGame();
};

if (auto) {
  slideInterval = setInterval(nextSlide, intervalTime);
}

//------------------------------------------------------------------------------------

//Game Classes

class Card {
  constructor(rank, suit) {
    this.img = new Image();
    this.rank = rank;
    this.suit = suit;
    if (rank >= 2 && rank <= 10) {
      this.src = `./WEBP/${rank}${suit[0]}.webp`;
    } else {
      this.src = `./WEBP/${rank[0]}${suit[0]}.webp`;
    }
    this.img.src = this.src;
    this.img.classList.add("card");
    this.img.id = "card";
  }
}

class Deck {
  constructor() {
    this.deck = [];
    this.reset();
    this.shuffle();
  }

  reset() {
    this.deck = [];

    const suits = ["Hearts", "Clubs", "Diamonds", "Spades"];
    const ranks = ["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"];

    for (let suit in suits) {
      for (let rank in ranks) {
        let card = new Card(
          ranks[rank],
          suits[suit],
          `./WEBP/${ranks[rank][0]}${suits[suit][0]}.webp`
        );
        this.deck.push(card);
      }
    }
  }

  shuffle() {
    const { deck } = this;
    let j = deck.length,
      i;

    while (j) {
      i = Math.floor(Math.random() * j--);

      [deck[j], deck[i]] = [deck[i], deck[j]];
    }
    return this;
  }

  deal() {
    return this.deck.pop();
  }
}

class Hand {
  constructor(source) {
    this.source = source;
    this.cards = [];
    this.aces = 0;
    this.value = 0;
    this.addCard();
    if (this.source == dealerCards) {
      this.addBackSideCard();
    }
  }

  addCard() {
    if (this.value < 22) {
      let card = deck1.deal();
      this.cards.push(card);
      this.source.appendChild(card.img);
      if (card.rank >= 2 && card.rank <= 10) {
        this.value += card.rank;
      } else if (card.rank == "Ace") {
        this.value += 11;
        this.aces += 1;
      } else {
        this.value += 10;
      }
      this.adjustForAces();
    }
    if (this.source == playerCards && this.value >= 21) {
      dealerPlays();
    }
  }
  adjustForAces() {
    if (this.value > 21 && this.aces > 0) {
      this.aces -= 1;
      this.value -= 10;
    }
  }

  addBackSideCard() {
    let backSide = new Image();
    backSide.src = "./WEBP/Gray_back.webp";
    backSide.classList.add("card");
    backSide.id = "back-side-card";
    this.source.appendChild(backSide);
  }

  removeBackSideCard() {
    removeElement("back-side-card");
    this.addCard();
  }
}

//------------------------------------------------------------------------------------
//Functions

//Remove element function
const removeElement = elementId => {
  let element = document.getElementById(elementId);
  element.parentNode.removeChild(element);
};

//Add element function
const addElementFunc = (parentId, elementTag, elementId) => {
  let p = document.querySelector(parentId);
  let newElement = document.createElement(elementTag);
  newElement.setAttribute("id", elementId);
  p.appendChild(newElement);
};

//Deal button function
const dealFunction = () => {
  const playerCards = document.querySelector("#playerCards");
  const dealerCards = document.querySelector("#dealerCards");
  deck1 = new Deck();
  player = new Hand(playerCards);
  dealer = new Hand(dealerCards);
  removeElement("deal");
  addElementFunc(".buttons1", "button", "hit");
  const hit = document.querySelector("#hit");
  hit.textContent = "Hit Me";
  hit.setAttribute("onclick", "player.addCard()");
  addElementFunc(".buttons1", "button", "stand");
  const stand = document.querySelector("#stand");
  stand.textContent = "Stand";
  stand.addEventListener("click", dealerPlays);
  player.addCard();
};

// Winner announcement function
const winAnn = () => {
  removeElement("hit");
  removeElement("stand");
  addElementFunc(".buttons1", "div", "win");
  let winner;
  if (
    (player.value > 21 && dealer.value < 22) ||
    (player.value < dealer.value && dealer.value < 22 && player.value < 22)
  ) {
    cash -= 1000;
    winner = "You Lost! " + `Total Value : ${player.value} Cash:${cash}`;
  } else if (
    (player.value < 22 && dealer.value > 21) ||
    (player.value > dealer.value && dealer.value < 22 && player.value < 22)
  ) {
    cash += 1000;
    winner = "You Won! " + `Total Value : ${player.value} Cash:${cash}`;
  } else {
    winner = "It's a Draw! " + `Total Value : ${player.value}`;
  }

  document.querySelector("#win").textContent = winner;
  document.querySelector("#win").style.color = "black";

  addElementFunc(".buttons1", "button", "deal");
  document.querySelector("#deal").addEventListener("click", populateGame);
  document.querySelector("#deal").textContent = "Clear Table";
};

const populateGame = () => {
  let game = document.getElementById("game");
  game.innerHTML =
    '<div class="player cards" id="playerCards"> <h1>Player</h1> </div> <div class="buttons1"> <button id="deal" onclick="dealFunction()">Deal</button> </div> <div class="dealer cards" id="dealerCards"> <h1>Dealer</h1> </div>';
};

const dealerPlays = () => {
  dealer.removeBackSideCard();
  if (dealer.value === 21) {
    winAnn();
  } else {
    while (
      player.value < 22 &&
      dealer.value < 17 &&
      player.value >= dealer.value
    ) {
      dealer.addCard();
    }
    winAnn();
  }
};
//------------------------------------------------------------------------------------
