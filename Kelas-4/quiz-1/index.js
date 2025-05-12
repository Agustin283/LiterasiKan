document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const loader = document.getElementById("loader");
  const choices = document.querySelectorAll(".choices button");
  const scoreText = document.getElementById("scoreText");
  const timerText = document.getElementById("timerText"); // Tambahkan elemen untuk timer
  const questionCounterText = document.getElementById("questionCounterText"); // Tambahkan elemen untuk counter

  const CORRECT_BONUS = 10;
  const MAX_QUESTIONS = 10;

  let questions = [];
  let questionCounter = 0;
  let score = 0;
  let currentQuestion = {};
  let acceptingAnswers = false;
  let availableQuestions = [];
  let timer; // Timer ID
  let countdown = 20; // Waktu awal untuk setiap soal

  const quizData = {
    result: [
      {
        question: "Mengapa sampah disebut sebagai musuh lingkungan yang jahat?",
        correct_answer:
          "Karena sampah dapat membuat lingkungan kotor, tidak sehat, dan berbahaya.",
        incorrect_answer: [
          "Karena sampah memiliki bau yang tidak sedap.",
          "Karena sampah dapat menarik perhatian hewan liar.",
          "Karena sampah dapat menyebabkan kemacetan lalu lintas.",
        ],
      },
      {
        question: "Apa yang terjadi jika sampah plastik dibuang ke sungai?",
        correct_answer:
          "Sampah plastik akan mencemari air dan membahayakan ikan.",
        incorrect_answer: [
          "Sampah plastik akan langsung hancur.",
          "Sampah plastik akan menguap.",
          "Sampah plastik akan terurai dengan cepat.",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan dari kalimat 'Plastik itu sulit sekali hancur, lho!'?",
        correct_answer:
          "Plastik merupakan masalah lingkungan yang serius karena membutuhkan waktu yang sangat lama untuk terurai.",
        incorrect_answer: [
          "Plastik mudah terurai di alam.",
          "Plastik aman bagi lingkungan.",
          "Plastik dapat digunakan berulang kali tanpa masalah.",
        ],
      },
      {
        question:
          "Apa kesimpulan yang dapat diambil dari bahaya sampah organik yang membusuk?",
        correct_answer:
          "Sampah organik yang membusuk dapat menimbulkan bau tidak sedap dan menjadi sarang penyakit.",
        incorrect_answer: [
          "Sampah organik tidak berbahaya bagi lingkungan.",
          "Sampah organik dapat digunakan sebagai pupuk.",
          "Sampah organik mudah terurai sehingga tidak berbahaya.",
        ],
      },
      {
        question:
          "Mengapa sampah dapat menjadi tempat berkembang biak nyamuk, lalat, dan tikus?",
        correct_answer:
          "Karena sampah menyediakan tempat berlindung dan sumber makanan bagi hewan-hewan tersebut.",
        incorrect_answer: [
          "Karena sampah memiliki aroma yang disukai hewan-hewan tersebut.",
          "Karena sampah menghasilkan panas yang menarik hewan-hewan tersebut.",
          "Karena sampah menghasilkan cahaya yang menarik hewan-hewan tersebut.",
        ],
      },
      {
        question:
          "Jelaskan mengapa penting untuk membuang sampah sesuai jenisnya?",
        correct_answer:
          "Agar memudahkan proses daur ulang dan pengolahan sampah.",
        incorrect_answer: [
          "Agar terlihat lebih rapi.",
          "Agar mudah diangkut petugas kebersihan.",
          "Agar sampah tidak menimbulkan bau.",
        ],
      },
      {
        question:
          "Apakah Anda setuju dengan pernyataan bahwa menjaga kebersihan lingkungan adalah tanggung jawab bersama? Jelaskan alasan Anda!",
        correct_answer:
          "Setuju, karena kebersihan lingkungan berpengaruh pada kesehatan dan kesejahteraan kita bersama.",
        incorrect_answer: [
          "Tidak setuju, karena itu tugas pemerintah.",
          "Setuju, tetapi hanya jika ada imbalan.",
          "Tidak setuju, karena terlalu merepotkan.",
        ],
      },
      {
        question:
          "Manakah tindakan yang paling efektif untuk mengurangi sampah plastik?",
        correct_answer:
          "Menggunakan tas belanja kain dan mengurangi penggunaan plastik sekali pakai.",
        incorrect_answer: [
          "Membeli produk yang dikemas dengan plastik.",
          "Membuang sampah plastik ke sungai.",
          "Membiarkan sampah plastik berserakan.",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca teks tentang bahaya sampah?",
        correct_answer:
          "Menerapkan kebiasaan membuang sampah pada tempatnya dan mengurangi penggunaan plastik.",
        incorrect_answer: [
          "Mengabaikannya.",
          "Menunggu pemerintah bertindak.",
          "Mencari informasi lebih lanjut tentang sampah di internet.",
        ],
      },
      {
        question:
          "Apa pesan penting yang ingin disampaikan penulis dalam teks ini?",
        correct_answer: "Sampah adalah masalah yang harus ditangani bersama.",
        incorrect_answer: [
          "Sampah tidak berbahaya.",
          "Sampah hanya masalah pemerintah.",
          "Sampah hanya masalah orang dewasa.",
        ],
      },
    ],
  };

  const loadedQuestions = quizData.result;

  questions = loadedQuestions.map((loadedQuestion) => {
    const formattedQuestion = {
      question: loadedQuestion.question,
    };

    const answerChoices = [...loadedQuestion.incorrect_answer];
    formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;

    answerChoices.splice(
      formattedQuestion.answer - 1,
      0,
      loadedQuestion.correct_answer
    );

    answerChoices.forEach((choice, index) => {
      formattedQuestion["choice" + (index + 1)] = choice;
    });

    return formattedQuestion;
  });

  const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestions();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
  };

  const getNewQuestions = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyGuzWzrcZeA557yR480r_zSBpcMT5s2WV-B6erpN7Fo147CcylYAKEuQ21Z-VSkviB/exec";

      // Ambil data dari localStorage
      const wpm = localStorage.getItem("readingSpeed");
      const nama = localStorage.getItem("nama") || "12"; // Default '12' jika null
      const absen = localStorage.getItem("absen") || "12"; // Default '12' jika null
      const paket = localStorage.getItem("paket") || "1"; // Default '1' jika null

      if (!wpm) {
        console.error(
          "Kecepatan Membaca atau Skor Quiz tidak ditemukan di LocalStorage."
        );
        return; // Hentikan jika data tidak valid
      }

      const finalScore = parseInt((wpm * score) / 100);

      // Data yang akan dikirim ke spreadsheet
      const formData = {
        nama: nama,
        absen: absen,
        hasil: finalScore,
        paket: paket,
      };

      // Kirim data ke Google Apps Script
      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Menonaktifkan CORS
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Response gagal: " + response.statusText);
          }
          return response.json();
        })
        .then((result) => {
          console.log("Response dari server:", result);
          if (result.success) {
            console.log("Data berhasil dikirim ke spreadsheet.");
          } else {
            console.error("Gagal mengirim data:", result.message);
          }
        })
        .catch((error) => {
          console.error("Terjadi kesalahan saat mengirim data:", error);
        })
        .finally(() => {
          // Bersihkan localStorage dan kembali ke halaman utama
          localStorage.removeItem("readingSpeed");
          localStorage.removeItem("nama");
          localStorage.removeItem("absen");
        });

      // Setelah menghitung finalScore dan sebelum menampilkan SweetAlert
      let kpmMessage = ""; // Variabel untuk menyimpan pesan KPM

      if (finalScore >= 175) {
        kpmMessage =
          "Sesuai dengan Kriteria Ketuntasan Minimal (KKM) untuk siswa SMP, mencakup kecepatan dan pemahaman yang baik.";
      } else if (finalScore >= 105 && finalScore < 175) {
        kpmMessage =
          "Memerlukan latihan intensif dan pengayaan kosakata untuk meningkatkan pemahaman serta KEM.";
      } else {
        kpmMessage =
          "Membutuhkan dukungan berupa metode pengajaran inovatif dan motivasi tambahan.";
      }

      // Tampilkan popup SweetAlert setelah pengiriman data
      Swal.fire({
        title: "Hasil KEM",
        html: `
          <div style="text-align: justify; justify-content: center; max-width: fit-content; margin-left: auto; margin-right: auto;">
            <span style="display: inline-block; width: 200px;">Nama</span>: <b>${nama}</b> <br>
            <span style="display: inline-block; width: 200px;">Absen</span>: <b>${absen}</b> <br>
            <span style="display: inline-block; width: 200px;">Kecepatan Membaca</span>: <b>${wpm} WPM</b> <br>
            <span style="display: inline-block; width: 200px;">Skor Quiz</span>: <b>${score}%</b> <br>
            <span style="display: inline-block; width: 200px;">Jumlah Soal Benar</span>: <b>${
              score / CORRECT_BONUS
            }</b> <br>
            <span style="display: inline-block; width: 200px;">Hasil Akhir</span>: <b>${finalScore}</b> <br>
            <br>
            ${kpmMessage} <!-- Menambahkan pesan KPM -->
          </div>`,
        icon: "success",
      }).finally(() => {
        window.location.href = "../index.html";
      });
    }

    questionCounter++;
    updateCounter(); // Update nomor soal

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    availableQuestions.splice(questionIndex, 1);

    const questionElement = document.getElementById("question");
    questionElement.innerText = currentQuestion.question;

    choices.forEach((choice, index) => {
      const choiceText = currentQuestion["choice" + (index + 1)];
      choice.innerText = choiceText;
      choice.dataset["number"] = index + 1;
    });

    acceptingAnswers = true;

    resetTimer(); // Reset timer untuk soal baru
  };

  const incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
  };

  const resetTimer = () => {
    clearInterval(timer); // Hentikan timer sebelumnya jika ada
    countdown = 20; // Reset waktu
    timerText.innerText = countdown; // Tampilkan waktu awal

    timer = setInterval(() => {
      countdown--;
      timerText.innerText = countdown;

      if (countdown <= 0) {
        clearInterval(timer);
        acceptingAnswers = false;
        getNewQuestions(); // Pindah ke soal berikutnya jika waktu habis
      }
    }, 1000);
  };

  const updateCounter = () => {
    questionCounterText.innerText = `Soal ${questionCounter} dari ${MAX_QUESTIONS}`;
  };

  choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      if (!acceptingAnswers) return;

      acceptingAnswers = false;
      const selectedChoice = e.target;
      const selectedAnswer = selectedChoice.dataset["number"];

      const classToApply =
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

      if (classToApply === "correct") {
        incrementScore(CORRECT_BONUS);
      }

      selectedChoice.parentElement.classList.add(classToApply);

      setTimeout(() => {
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestions();
      }, 1000);
    });
  });

  startGame();
});
