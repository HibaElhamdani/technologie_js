const axios = require("axios");

// HP des joueurs
let playerHP = 300;
let botHP = 300;

// récupérer un pokemon aléatoire
async function getPokemon() {
  let id = Math.floor(Math.random() * 151) + 1;
  let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
  return res.data.name;
}

// 5 attaques simples
let moves = [
  { name: "Move1", power: 50, accuracy: 0.8, pp: 3 },
  { name: "Move2", power: 40, accuracy: 0.9, pp: 5 },
  { name: "Move3", power: 60, accuracy: 0.7, pp: 4 },
  { name: "Move4", power: 70, accuracy: 0.6, pp: 2 },
  { name: "Move5", power: 90, accuracy: 0.5, pp: 1 },
];

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

  let playerPokemon = await getPokemon();
  let botPokemon = await getPokemon();

  console.log("Player:", playerPokemon);
  console.log("Bot:", botPokemon);

  while (playerHP > 0 && botHP > 0) {

    let pMove = moves[Math.floor(Math.random() * moves.length)];
    let bMove = moves[Math.floor(Math.random() * moves.length)];

    console.log("\n--- TOUR ---");

    botHP = attack("Player", botHP, pMove);
    playerHP = attack("Bot", playerHP, bMove);

    console.log("Player HP:", playerHP);
    console.log("Bot HP:", botHP);
  }

  console.log(playerHP > 0 ? "Player wins 🎉" : "Bot wins 🤖");
}

game();