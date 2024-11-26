let startTime, endTime;
let stopwatchInterval;

// Function to show the form
function openForm() {
  document.querySelector(".popup-form").classList.add("show");
  document.body.classList.add("popup-active");
}

// Function to close the form
function closeForm() {
  document.querySelector(".popup-form").classList.remove("show");
  document.body.classList.remove("popup-active");
}

// Function to save data to localStorage
function submitForm() {
  const name = document.getElementById("name").value;
  const absen = document.getElementById("absen").value;

  if (name && absen) {
    localStorage.setItem("nama", name);
    localStorage.setItem("absen", absen);

    // Close the form after saving
    closeForm();
  } else {
    alert("Harap isi semua data!");
  }
}

// Show the form when the page loads
window.onload = function () {
  openForm();
};

document.addEventListener("DOMContentLoaded", () => {
  const popupForm = document.getElementById("popup-form");
  const userDataForm = document.getElementById("user-data-form");

  // Tampilkan popup jika data belum ada di local storage
  if (!localStorage.getItem("nama") || !localStorage.getItem("absen")) {
    popupForm.classList.add("show");
  }

  // Simpan data ke local storage ketika form disubmit
  userDataForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nama = document.getElementById("nama").value.trim();
    const absen = document.getElementById("absen").value.trim();

    if (nama && absen) {
      localStorage.setItem("nama", nama);
      localStorage.setItem("absen", absen);

      // Sembunyikan popup
      popupForm.classList.remove("show");
    }
  });
});

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

  if (readingSpeed < 175) {
    resultText +=
      " Kecepatan membaca Anda terlalu lambat. Semangat Dalam Membaca Yaa :) ";
  } else if (readingSpeed >= 175 && readingSpeed <= 250) {
    resultText += " Kecepatan Membaca Anda Ideal";
  } else if (readingSpeed > 250 && readingSpeed <= 400) {
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
