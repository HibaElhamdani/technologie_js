const axios = require("axios");

// HP
let playerHP = 300;
let botHP = 300;

// récupérer Pokémon (nom ou aléatoire)
async function getPokemon(name = null) {
  let idOrName = name ? name : Math.floor(Math.random() * 151) + 1;

  let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${idOrName}`);

  return {
    name: res.data.name,
    moves: res.data.moves
  };
}

// récupérer détails d'une attaque
async function getMoveDetails(url) {
  let res = await axios.get(url);

  return {
    name: res.data.name,
    power: res.data.power || 40,
    accuracy: (res.data.accuracy || 100) / 100,
    pp: res.data.pp || 5
  };
}

// choisir 5 attaques
async function selectMoves(pokemon) {
  let selected = [];

  for (let i = 0; i < 5; i++) {
    let randomMove = pokemon.moves[Math.floor(Math.random() * pokemon.moves.length)];
    let move = await getMoveDetails(randomMove.move.url);
    selected.push(move);
  }

  return selected;
}

// fonction attaque
function attack(attacker, defenderHP, move) {

  if (move.pp <= 0) {
    console.log(attacker + " : " + move.name + " échoue (PP=0)");
    return defenderHP;
  }

  move.pp--;

  if (Math.random() > move.accuracy) {
    console.log(attacker + " : " + move.name + " raté !");
    return defenderHP;
  }

  console.log(attacker + " utilise " + move.name + " (-" + move.power + ")");
  return defenderHP - move.power;
}

// jeu principal
async function game() {

  try {
    // 🔥 récupérer le Pokémon depuis terminal
    let playerChoice = process.argv[2]; // argument

    console.log("Choix du joueur :", playerChoice || "aléatoire");

    let playerPokemon = await getPokemon(playerChoice);
    let botPokemon = await getPokemon();

    let playerMoves = await selectMoves(playerPokemon);
    let botMoves = await selectMoves(botPokemon);

    console.log("\nPlayer:", playerPokemon.name);
    console.log("Bot:", botPokemon.name);

    while (playerHP > 0 && botHP > 0) {

      let pMove = playerMoves[Math.floor(Math.random() * playerMoves.length)];
      let bMove = botMoves[Math.floor(Math.random() * botMoves.length)];

      console.log("\n--- TOUR ---");
      botHP = attack("Player", botHP, pMove);
      playerHP = attack("Bot", playerHP, bMove);

      console.log("Player HP:", playerHP);
      console.log("Bot HP:", botHP);
    }

    console.log(playerHP > 0 ? "Player wins 🎉" : "Bot wins 🤖");

  } catch (error) {
    console.log("Erreur : Pokémon invalide !");
  }
}

game();