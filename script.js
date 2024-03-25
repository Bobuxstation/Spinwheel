import { Wheel } from 'https://cdn.jsdelivr.net/npm/spin-wheel@4.2.0/dist/spin-wheel-esm.js';
import * as easing from "./easing.js";

//template and spawn spinwheel
var props = {
  itemBackgroundColors: ['#f44336', '#ff5722', '#ff9800', '#ffc107', '#ffeb3b', '#cddc39', '#8bc34a', '#4caf50', '#009688', '#00bcd4', '#03a9f4', '#2196f3', '#3f51b5', '#673ab7', '#9c27b0', '#e91e63'],
  overlayImage: 'spinwheelimage.svg',
  radius: 1,
  itemLabelFont: 'Rubik',
  itemLabelRadius: 0.92,
  itemLabelRadiusMax: 0.37,
  itemLabelRotation: 0,
  itemLabelColors: ['#000'],
  itemLabelBaselineOffset: -0.06,
  lineWidth: 0,
  borderWidth: 0,
  isInteractive: true,
  items: []
}

const container = document.querySelector('#spinWheelContainer');
const wheel = new Wheel(container, props);

//generate random names for template
let newTextAreaString = ``
for (let i = 0; i < 16; i++) {
  let name = faker.name.firstName();
  let newLine = ``
  if (i != 15) newLine = "\n";

  newTextAreaString = newTextAreaString + name + newLine;
  document.getElementById('names').value = newTextAreaString;

  if (i == 15) refreshSpinWheel();
}

//Random picker and spin function
function generateRandom(maxLimit = 100) {
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
      wheel.spinToItem(real_chosen_one, 1000, true, 2, 1, easingmode)
      setTimeout(function () { realSpin(real_chosen_one) }, 1500)
    } else {
      realSpin(chosen_one)
    }
  }, 5000)
}

function realSpin(val) {
  document.getElementById('chosenOneDialog').style.display = 'flex'
  document.getElementById('chosenName').innerText = props.items[val].label;
  startConfetti();

  props.items.splice(val, 1);
  let newTextAreaString = ``

  props.items.forEach(function (items, i) {
    let newLine = ``
    if (i != props.items.length - 1) newLine = "\n";

    newTextAreaString = newTextAreaString + items.label + newLine;
    document.getElementById('names').value = newTextAreaString;

    wheel.init({ ...props, rotation: wheel.rotation });
  })
}

//Event listeners and add items to spinwheel based on textarea
document.querySelector('.bigSpinButton').addEventListener('click', spinRandomly)
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
document.getElementById('exportbtn').addEventListener('click', function () { saveList(document.getElementById('names').value) })

//shuffle list
document.getElementById('shufflebtn').addEventListener('click', function () {
  let value = document.getElementById('names').value;
  let lines = value.split("\n");
  let shuffle = lines.sort(() => Math.random() - 0.5);

  let blankString = ``
  document.getElementById('names').value = ``

  shuffle.forEach(function (items, i) {
    if (items == '') return;

    let newLine = ``
    if (i != props.items.length - 1) newLine = "\n";

    blankString = blankString + items + newLine;
    document.getElementById('names').value = blankString;

    wheel.init({ ...props, rotation: wheel.rotation });
    refreshSpinWheel()
  })
})

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