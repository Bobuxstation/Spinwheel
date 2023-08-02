import {Wheel} from 'https://cdn.jsdelivr.net/npm/spin-wheel@4.2.0/dist/spin-wheel-esm.js';
import * as easing from "../easing.js";

//template and spawn spinwheel
var props = {
  itemBackgroundColors: ['#fbf8c4', '#e4f1aa', '#c0d26e', '#ff7d7d'],
  overlayImage: 'spinwheelimage.svg',
  radius: 1,
  itemLabelFont: 'Rubik',
  isInteractive: false,
  items: []
}

const container = document.querySelector('#spinWheelContainer');
const wheel = new Wheel(container, props);

//generate random names for template
let newTextAreaString = ``
for (let i = 0; i < 10; i++) {
  let name = faker.name.firstName();

  newTextAreaString = newTextAreaString + name + "\n";
  document.getElementById('names').value = newTextAreaString;

  if (i == 9) refreshSpinWheel();
}

//Random picker and spin function
function generateRandom(maxLimit = 100){
  let rand = Math.random() * maxLimit;
  rand = Math.floor(rand);

  return rand;
}

function spinRandomly() {
  let chosen_one = generateRandom(props.items.length)
  let real_chosen_one = generateRandom(props.items.length)

  const duration = 4000;
  const easingmode = easing.cubicOut;
  wheel.spinToItem(chosen_one, duration, true, 2, 1, easingmode)
  
  setTimeout(function () {
    if (Math.random() > 0.5) {
      wheel.spinToItem(real_chosen_one, 1000, true, 2, 1, easing.bounceOut)
      setTimeout(function(){realSpin(real_chosen_one)}, 1500)
    } else {
      realSpin(chosen_one)
    }
  }, 4000)
}

function realSpin(val) {
    document.getElementById('chosenOneDialog').style.display = 'flex'
    document.getElementById('chosenName').innerText = props.items[val].label;
    startConfetti();

    props.items.splice(val, 1);
    let newTextAreaString = ``

    props.items.forEach(function (items) {
      newTextAreaString = newTextAreaString + items.label + "\n";
      document.getElementById('names').value = newTextAreaString;

      wheel.init({...props,rotation: wheel.rotation});
    })
}

//Event listeners and add items to spinwheel based on textarea
document.querySelector('.bigSpinButton').addEventListener('click', spinRandomly)
document.getElementById('spinBtn').addEventListener('click', spinRandomly)
document.getElementById('names').addEventListener('input', refreshSpinWheel)
function refreshSpinWheel() {
  let value = document.getElementById('names').value;
  let lines = value.split("\n");

  props.items = []

  lines.forEach(function (value, i) {
    if (value.length == 0) return;

    let item = {
      label: value
    }

    props.items.push(item);

    wheel.init({
      ...props,
      rotation: wheel.rotation
    })
  })
}

//Import and export list
document.getElementById('file-input').addEventListener('change', importList)
document.getElementById('exportbtn').addEventListener('click', function() {saveList(document.getElementById('names').value)})

function importList() {
  var input = document.getElementById("file-input");
  const file = input.files[0];

  const reader = new FileReader();
  reader.onload = function (event) {
    const contents = event.target.result;
    document.getElementById("names").value = "";
    document.getElementById("names").value = contents;

    refreshSpinWheel()
  };

  reader.readAsText(file);
}

function saveList(list) {
  const blob = new Blob([list], { type: "application/json" });
  const fileName = "list.txt";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
}

window.easing = easing