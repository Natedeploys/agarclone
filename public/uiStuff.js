let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {}; // This is all things player
let orbs = [];
let players = [];
let alive = true;

let canvas = document.querySelector("#the-canvas");
let context = canvas.getContext("2d");
canvas.width = wWidth;
canvas.height = wHeight;

$(window).load(() => {
  $("#loginModal").modal("show");
});

$(".name-form").submit(event => {
  event.preventDefault();
  player.name = document.querySelector("#name-input").value;
  $("#loginModal").modal("hide");
  $("#spawnModal").modal("show");
  document.querySelector(".player-name").innerHTML = player.name;
});

$(".start-game").click(() => {
  $(".modal").modal("hide");
  $(".hiddenOnStart").removeAttr("hidden");
  init();
});
