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
        question: "Apa manfaat utama dari olahraga menurut teks?",
        correct_answer:
          "Untuk menjaga kesehatan fisik dan mental serta meningkatkan fokus saat belajar.",
        incorrect_answer: [
          "Hanya untuk bersenang-senang.",
          "Untuk bersosialisasi dengan teman.",
          "Untuk menghindari kebosanan.",
        ],
      },
      {
        question: "Apa yang dapat dilakukan di rumah sebagai bentuk olahraga?",
        correct_answer: "Senam sederhana, lompat tali, atau berputar-putar.",
        incorrect_answer: [
          "Menonton televisi.",
          "Tidur siang.",
          "Bermain video game.",
        ],
      },
      {
        question:
          "Dari teks, apa yang dapat disimpulkan tentang pentingnya berolahraga secara teratur?",
        correct_answer:
          "Olahraga teratur sangat penting untuk menjaga kesehatan tubuh dan pikiran.",
        incorrect_answer: [
          "Hanya orang dewasa yang perlu berolahraga.",
          "Olahraga tidak diperlukan jika kita sudah sehat.",
          "Olahraga hanya penting saat kita merasa stres.",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan mengenai dampak olahraga terhadap hubungan keluarga?",
        correct_answer:
          "Olahraga bersama keluarga dapat mempererat hubungan dan menciptakan momen menyenangkan.",
        incorrect_answer: [
          "Olahraga tidak berpengaruh pada hubungan keluarga.",
          "Hanya olahraga individu yang penting.",
          "Olahraga membuat kita lebih jauh dari keluarga.",
        ],
      },
      {
        question:
          "Mengapa penting untuk memilih olahraga yang sesuai dengan kemampuan kita?",
        correct_answer:
          "Agar tidak merasa lelah dan tetap bisa menikmati olahraga.",
        incorrect_answer: [
          "Agar bisa bersaing dengan orang lain.",
          "Agar terlihat lebih keren di depan teman.",
          "Agar bisa mendapatkan penghargaan.",
        ],
      },
      {
        question:
          "Apa yang menjadi penghalang bagi seseorang untuk berolahraga menurut teks?",
        correct_answer: "Kebosanan dan kurangnya minat.",
        incorrect_answer: [
          "Keterbatasan waktu.",
          "Tidak ada teman untuk berolahraga.",
          "Semua jawaban benar.",
        ],
      },
      {
        question:
          "Apakah Anda setuju bahwa olahraga dapat membantu mengurangi stres? Mengapa?",
        correct_answer:
          "Setuju, karena olahraga dapat melepaskan endorfin yang membuat kita merasa lebih baik.",
        incorrect_answer: [
          "Tidak setuju, karena olahraga membuat kita lelah.",
          "Setuju, tetapi hanya untuk beberapa orang.",
          "Tidak setuju, karena tidak ada bukti ilmiah.",
        ],
      },
      {
        question:
          "Mana yang merupakan cara yang baik untuk menjaga motivasi dalam berolahraga?",
        correct_answer:
          "Mengajak teman atau keluarga untuk berolahraga bersama.",
        incorrect_answer: [
          "Berolahraga sendirian setiap saat.",
          "Mengabaikan waktu berolahraga.",
          "Hanya berolahraga saat ada acara.",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca teks tentang manfaat olahraga?",
        correct_answer:
          "Mencoba berolahraga secara teratur dan mengajak teman.",
        incorrect_answer: [
          "Tidak melakukan apa-apa.",
          "Menghabiskan waktu di depan televisi.",
          "Menunggu orang lain mengajak berolahraga.",
        ],
      },
      {
        question:
          "Apa pesan moral yang dapat diambil dari teks ini mengenai olahraga?",
        correct_answer:
          "Olahraga penting untuk kesehatan tubuh dan mental, serta membawa kebahagiaan.",
        incorrect_answer: [
          "Olahraga hanya untuk orang yang ingin menang.",
          "Olahraga tidak penting jika kita sudah sehat.",
          "Hanya olahraga tim yang bermanfaat.",
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
      const paket = localStorage.getItem("paket") || "5"; // Default '1' jika null

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
