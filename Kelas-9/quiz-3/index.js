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
        question:
          "Apa yang menjadi penyebab utama maraknya judi online saat ini?",
        correct_answer: "Kemajuan teknologi dan akses internet yang mudah",
        incorrect_answer: [
          "Kurangnya minat masyarakat terhadap permainan tradisional",
          "Penutupan tempat perjudian fisik",
          "Kebijakan pemerintah yang mendukung perjudian",
        ],
      },
      {
        question: "Apa jenis permainan yang termasuk dalam judi online?",
        correct_answer: "Taruhan olahraga, permainan kasino, dan poker",
        incorrect_answer: [
          "Hanya permainan kartu",
          "Permainan video game",
          "Permainan tradisional seperti catur",
        ],
      },
      {
        question:
          "Apa dampak negatif yang mungkin dialami oleh individu yang terjebak dalam judi online?",
        correct_answer: "Kehilangan uang dan waktu, serta risiko kecanduan",
        incorrect_answer: [
          "Meningkatnya keterampilan sosial",
          "Meningkatnya pengetahuan tentang teknologi",
          "Meningkatnya kesehatan mental",
        ],
      },
      {
        question:
          "Jika judi online terus berkembang, apa yang mungkin terjadi pada masyarakat?",
        correct_answer: "Munculnya lebih banyak masalah sosial dan ekonomi",
        incorrect_answer: [
          "Masyarakat akan lebih sejahtera",
          "Semua orang akan menjadi kaya",
          "Tidak ada perubahan signifikan",
        ],
      },
      {
        question:
          "Mengapa judi online sering kali melibatkan praktik penipuan?",
        correct_answer: "Karena kurangnya regulasi dan pengawasan",
        incorrect_answer: [
          "Karena semua situs judi online terpercaya",
          "Karena pemain tidak peduli dengan keamanan",
          "Karena semua orang tahu cara berjudi dengan aman",
        ],
      },
      {
        question:
          "Apa yang menjadi tantangan utama dalam mengatasi judi online?",
        correct_answer: "Kesadaran masyarakat tentang bahaya judi online",
        incorrect_answer: [
          "Meningkatnya jumlah pengguna internet",
          "Penutupan semua situs judi",
          "Meningkatnya jumlah tempat perjudian fisik",
        ],
      },
      {
        question:
          "Apa langkah yang dapat diambil untuk mengurangi dampak negatif judi online?",
        correct_answer:
          "Edukasi masyarakat tentang bahaya judi online dan penegakan hukum yang lebih ketat",
        incorrect_answer: [
          "Meningkatkan promosi situs judi",
          "Mengabaikan masalah ini",
          "Mendorong lebih banyak orang untuk berjudi",
        ],
      },
      {
        question:
          "Seberapa pentingnya peran pemerintah dalam mengatasi judi online?",
        correct_answer:
          "Sangat penting untuk melindungi masyarakat dari risiko perjudian",
        incorrect_answer: [
          "Tidak penting, karena masyarakat bisa mengurusnya sendiri",
          "Hanya penting untuk mengumpulkan pajak",
          "Penting untuk meningkatkan jumlah pengguna internet",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk menghindari pengaruh negatif judi online?",
        correct_answer:
          "Meningkatkan kesadaran diri dan berbagi informasi dengan teman-teman",
        incorrect_answer: [
          "Mengabaikan informasi tentang judi online",
          "Mencoba judi online untuk pengalaman",
          "Mengikuti semua tren yang ada di internet",
        ],
      },
      {
        question:
          "Mengapa penting untuk melibatkan masyarakat dalam diskusi tentang judi online?",
        correct_answer:
          "Untuk meningkatkan kesadaran dan menciptakan solusi bersama",
        incorrect_answer: [
          "Agar hanya pemerintah yang bertanggung jawab",
          "Agar masyarakat tidak mengganggu pengembangan teknologi",
          "Untuk meningkatkan jumlah pengguna judi online",
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
