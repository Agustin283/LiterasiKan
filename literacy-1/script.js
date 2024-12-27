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
  // Cek apakah halaman sudah diakses sebelumnya dalam sesi ini
  if (sessionStorage.getItem("hasAccessedLiterasi1")) {
    // Jika sudah diakses, tampilkan pesan dan hentikan eksekusi
    document.body.innerHTML = `
      <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f8f9fa;
        font-family: Arial, sans-serif;
        color: #343a40;
        text-align: center;
      ">
        <h1>Halaman ini sudah diakses!</h1>
      </div>
    `;
    return; // Hentikan eksekusi lebih lanjut
  }

  // Jika belum diakses, tandai bahwa halaman telah diakses
  sessionStorage.setItem("hasAccessedLiterasi1", "true");

  // Lanjutkan ke konten halaman, seperti membuka form
  openForm();
};

document.addEventListener("DOMContentLoaded", () => {
  const popupForm = document.getElementById("popup-form");
  const userDataForm = document.getElementById("user-data-form");

  // Tampilkan popup jika data belum ada di local storage dan belum diakses dalam sesi ini
  if (!sessionStorage.getItem("hasAccessed")) {
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

      // Tandai bahwa halaman telah diakses dalam sesi ini
      sessionStorage.setItem("hasAccessed", "true");

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
  const readingTimeInMinutes = (endTime - startTime) / 60000; // convert to minutes
  const textLength = document
    .getElementById("text")
    .innerText.split(" ").length;
  const readingSpeed = Math.round(textLength / readingTimeInMinutes); // words per minute (WPM)

  let resultText = `Kecepatan membaca Anda adalah ${readingSpeed} kata per menit.`;

  localStorage.setItem("readingSpeed", readingSpeed);

  if (readingSpeed < 110) {
    resultText +=
      " Kecepatan membaca Anda tidak cukup baik. Tetap semangat dalam berlatih membaca! :)";
  } else if (readingSpeed >= 110 && readingSpeed < 199) {
    resultText +=
      " Kecepatan membaca Anda rata-rata. Pertahankan dan terus berlatih!";
  } else if (readingSpeed >= 200 && readingSpeed < 250) {
    resultText +=
      " Kecepatan membaca Anda cukup baik. Bagus, terus tingkatkan!";
  } else if (readingSpeed >= 250 && readingSpeed < 500) {
    resultText +=
      " Kecepatan membaca Anda sangat baik. Luar biasa, pertahankan!";
  } else {
    resultText += " Kecepatan membaca Anda sangat baik. Hebat sekali!";
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
