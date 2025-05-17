document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const loader = document.getElementById("loader");
  const choices = document.querySelectorAll(".choices button");
  const scoreText = document.getElementById("scoreText");
  const timerText = document.getElementById("timerText"); // Tambahkan elemen untuk timer
  const questionCounterText = document.getElementById("questionCounterText"); // Tambahkan elemen untuk counter

  const CORRECT_BONUS = 5;
  const MAX_QUESTIONS = 20;

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
        question: "Perkembangan teknologi dan sains modern telah membawa…",
        correct_answer: "Perubahan luar biasa dalam kehidupan manusia.",
        incorrect_answer: [
          "Stagnasi dalam kehidupan manusia.",
          "Penurunan kualitas hidup.",
          "Ketidakpastian dalam komunikasi.",
        ],
      },
      {
        question:
          "Dalam konteks sains, pendekatan ilmiah yang sistematis dan metodologis digunakan untuk…",
        correct_answer: "Membuka tabir misteri alam semesta.",
        incorrect_answer: [
          "Menciptakan kesenjangan digital.",
          "Meningkatkan ketidakpastian.",
          "Mengabaikan penemuan baru.",
        ],
      },
      {
        question:
          "Salah satu contoh penerapan sains modern yang disebutkan adalah…",
        correct_answer: "Pengembangan vaksin untuk masalah kesehatan.",
        incorrect_answer: [
          "Pembuatan produk berbasis plastik.",
          "Penggunaan kertas dalam komunikasi.",
          "Peningkatan penggunaan bahan bakar fosil.",
        ],
      },
      {
        question:
          "Kecerdasan buatan (AI) dapat meniru kemampuan kognitif manusia, termasuk…",
        correct_answer: "Belajar dan membuat keputusan.",
        incorrect_answer: [
          "Berkomunikasi secara sosial.",
          "Menghancurkan data.",
          "Mengabaikan informasi.",
        ],
      },
      {
        question: "Penerapan AI di bidang kesehatan dapat…",
        correct_answer: "Meningkatkan efisiensi, akurasi, dan produktivitas.",
        incorrect_answer: [
          "Mengurangi efisiensi dan akurasi.",
          "Membatasi akses pasien.",
          "Menghentikan penelitian medis.",
        ],
      },
      {
        question:
          "Salah satu tantangan yang muncul akibat kemajuan teknologi adalah…",
        correct_answer: "Kesenjangan digital dan masalah etika.",
        incorrect_answer: [
          "Meningkatnya privasi.",
          "Penyebaran informasi yang akurat.",
          "Penurunan penggunaan teknologi.",
        ],
      },
      {
        question:
          "Pentingnya pengembangan teknologi secara bertanggung jawab mencakup…",
        correct_answer: "Memperhatikan dampak sosial dan lingkungan.",
        incorrect_answer: [
          "Mengabaikan nilai-nilai kemanusiaan.",
          "Menghentikan inovasi.",
          "Meningkatkan kesenjangan sosial.",
        ],
      },
      {
        question: "Sains dan teknologi modern memiliki potensi untuk…",
        correct_answer:
          "Memperbaiki kehidupan manusia dan mengatasi tantangan global.",
        incorrect_answer: [
          "Menciptakan tantangan baru tanpa solusi.",
          "Mengurangi kualitas hidup.",
          "Memperburuk masalah sosial.",
        ],
      },
      {
        question:
          "Apa yang perlu dipertimbangkan saat menggunakan teknologi dan sains modern?",
        correct_answer: "Dampaknya secara holistik untuk kebaikan bersama.",
        incorrect_answer: [
          "Dampak negatif yang tidak dapat diperhitungkan.",
          "Hanya fokus pada keuntungan individu.",
          "Mengabaikan etika dalam pengembangan.",
        ],
      },
      {
        question:
          "Melalui pemahaman yang mendalam tentang teknologi dan sains, kita dapat…",
        correct_answer: "Menggunakan potensi sains untuk kebaikan bersama.",
        incorrect_answer: [
          "Menciptakan masa depan yang lebih buruk.",
          "Menghindari semua teknologi baru.",
          "Menurunkan kualitas pendidikan.",
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
      const paket = localStorage.getItem("paket") || "6"; // Default '1' jika null

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
