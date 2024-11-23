let startTime, endTime;
let stopwatchInterval;

function startReading() {
  startTime = new Date();
  document.querySelector('button[onclick="stopReading()"]').disabled = false;
  document.querySelector('button[onclick="startReading()"]').disabled = true;
  document.getElementById("stopwatch").innerText = "00:00:00.000";
  stopwatchInterval = setInterval(updateStopwatch, 10);
}

function stopReading() {
  endTime = new Date();
  clearInterval(stopwatchInterval);
  const readingTime = (endTime - startTime) / 1000; // convert to seconds
  const textLength = document
    .getElementById("text")
    .innerText.split(" ").length;
  const readingSpeed = Math.round((textLength / readingTime) * 120); // words per minute (WPM)
  let resultText = `(WPM) Kecepatan membaca Anda adalah ${readingSpeed} kata per menit.`;

  localStorage.setItem("readingSpeed", readingSpeed);

  if (readingSpeed < 200) {
    resultText +=
      " Kecepatan membaca Anda terlalu lambat. Semangat Dalam Membaca Yaa :) ";
  } else if (readingSpeed >= 200 && readingSpeed <= 250) {
    resultText += " Kecepatan Membaca Anda Ideal";
  } else if (readingSpeed > 250 && readingSpeed <= 300) {
    resultText += " Kecepatan Membaca Anda Cepat .";
  } else {
    resultText += " Kecepatan membaca Anda Cepat.";
  }

  document.getElementById("popup-result").innerText = resultText;
  openPopup();

  document.querySelector('button[onclick="stopReading()"]').disabled = true;
  document.querySelector('button[onclick="startReading()"]').disabled = false;
}

function openPopup() {
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

window.onclick = function (event) {
  const popup = document.getElementById("popup");
  if (event.target == popup) {
    popup.style.display = "none";
  }
};

function updateStopwatch() {
  const now = new Date();
  const elapsedTime = now - startTime; // in milliseconds
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const milliseconds = elapsedTime % 1000;
  document.getElementById("stopwatch").innerText = `${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}:${String(milliseconds).padStart(
    3,
    "0"
  )}`;
}
