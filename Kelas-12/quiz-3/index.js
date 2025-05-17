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
        question: "Pernyataan utama paragraf tersebut adalah…",
        correct_answer:
          "Globalisasi memiliki dampak positif dan negatif terhadap lingkungan.",
        incorrect_answer: [
          "Globalisasi sepenuhnya merusak lingkungan.",
          "Globalisasi tidak berpengaruh pada lingkungan.",
          "Globalisasi hanya menawarkan solusi terhadap masalah lingkungan.",
        ],
      },
      {
        question:
          "Bukti utama peningkatan kesadaran global terhadap isu lingkungan adalah…",
        correct_answer: "Penyebaran informasi melalui media dan internet.",
        incorrect_answer: [
          "Berkurangnya polusi di dunia.",
          "Peningkatan penggunaan energi terbarukan.",
          "Berkurangnya deforestasi di dunia.",
        ],
      },
      {
        question:
          "Salah satu dampak negatif globalisasi terhadap lingkungan adalah…",
        correct_answer: "Eksploitasi sumber daya alam yang berlebihan.",
        incorrect_answer: [
          "Pengembangan energi terbarukan.",
          "Peningkatan kolaborasi internasional.",
          "Peningkatan kesadaran lingkungan.",
        ],
      },
      {
        question: "Homogenisasi budaya yang disebabkan globalisasi mengancam…",
        correct_answer: "Keanekaragaman hayati.",
        incorrect_answer: [
          "Pertumbuhan ekonomi global.",
          "Kolaborasi internasional.",
          "Pengembangan teknologi ramah lingkungan.",
        ],
      },
      {
        question: "Protokol Kyoto dan Perjanjian Paris bertujuan untuk…",
        correct_answer: "Mengurangi emisi gas rumah kaca.",
        incorrect_answer: [
          "Meningkatkan konsumsi energi.",
          "Mencemari udara, air, dan tanah.",
          "Meningkatkan produksi barang konsumsi.",
        ],
      },
      {
        question:
          "Contoh teknologi ramah lingkungan yang disebutkan dalam paragraf adalah…",
        correct_answer: "Energi terbarukan seperti tenaga surya dan angin.",
        incorrect_answer: [
          "Transportasi udara yang masif.",
          "Penggunaan plastik sekali pakai.",
          "Eksploitasi sumber daya alam secara berlebihan.",
        ],
      },
      {
        question:
          "Penulis menyimpulkan bahwa globalisasi dan lingkungan adalah…",
        correct_answer: "Dua sisi mata uang yang saling berkaitan erat.",
        incorrect_answer: [
          "Dua hal yang sama sekali tidak berhubungan.",
          "Dua hal yang saling bertentangan secara absolut.",
          "Dua hal yang saling menguntungkan.",
        ],
      },
      {
        question: "Untuk mencapai keseimbangan yang berkelanjutan, diperlukan…",
        correct_answer: "Upaya kolektif dari seluruh pemangku kepentingan.",
        incorrect_answer: [
          "Penggunaan plastik sekali pakai yang masif.",
          "Eksploitasi sumber daya alam secara berlebihan.",
          "Meningkatnya transportasi global.",
        ],
      },
      {
        question:
          "Ancaman terhadap keanekaragaman hayati yang dibahas dalam paragraf disebabkan oleh…",
        correct_answer: "Penggunaan produk-produk global yang seragam.",
        incorrect_answer: [
          "Pengembangan energi terbarukan.",
          "Kolaborasi antar negara.",
          "Pengurangan emisi gas rumah kaca.",
        ],
      },
      {
        question:
          "Menurut paragraf tersebut, apa yang sangat penting untuk membentuk generasi yang bertanggung jawab terhadap lingkungan?",
        correct_answer: "Pendidikan dan kesadaran lingkungan sejak dini.",
        incorrect_answer: [
          "Peningkatan konsumsi energi.",
          "Eksploitasi sumber daya alam.",
          "Peningkatan transportasi global.",
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
      const paket = localStorage.getItem("paket") || "3"; // Default '1' jika null

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
