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
        question: "Apa peran utama agama dalam membentuk etika individu?",
        correct_answer: "Semua jawaban benar",
        incorrect_answer: [
          "Menyediakan pedoman spiritual",
          "mengatur kehidupan sehari-hari",
          "Membangun norma sosial",
        ],
      },
      {
        question:
          "Apa contoh nilai-nilai moral yang diajarkan oleh banyak agama?",
        correct_answer: "Kasih sayang",
        incorrect_answer: ["Kebohongan", "Ketidakadilan", "Egoisme"],
      },
      {
        question:
          "Apa kesimpulan mengenai pengaruh positif agama terhadap masyarakat?",
        correct_answer: "Agama memperkuat ikatan sosial",
        incorrect_answer: [
          "Agama selalu menyebabkan konflik",
          "Agama tidak memiliki pengaruh",
          "Agama hanya penting bagi individu",
        ],
      },
      {
        question:
          "Mengapa interpretasi ajaran agama perlu dilakukan dengan bijaksana?",
        correct_answer: "Agar tidak terjadi konflik",
        incorrect_answer: [
          "Untuk meningkatkan ketegangan antar kelompok",
          "Agar semua orang setuju",
          "Untuk mengabaikan nilai-nilai moral",
        ],
      },
      {
        question:
          "Bagaimana pendidikan agama dapat mempengaruhi moralitas individu?",
        correct_answer: "Mengajarkan tanggung jawab sosial",
        incorrect_answer: [
          "Mengabaikan nilai-nilai kemanusiaan",
          "Mendorong diskriminasi",
          "Menyebabkan kebingungan",
        ],
      },
      {
        question:
          "Apa dampak negatif dari interpretasi ekstrem terhadap ajaran agama?",
        correct_answer: "Menyebabkan diskriminasi atau konflik",
        incorrect_answer: [
          "Meningkatkan toleransi",
          "Memperkuat hubungan antar kelompok",
          "Mendorong dialog antaragama",
        ],
      },
      {
        question:
          "Seberapa besar pengaruh agama terhadap perilaku individu menurut bacaan ini?",
        correct_answer: "Sangat besar jika diterapkan dengan baik",
        incorrect_answer: [
          "Tidak ada pengaruh yang sama sekali",
          "Hanya berlaku untuk beberapa orang",
          "Efektif hanya dalam konteks tertentu",
        ],
      },
      {
        question:
          "Mengapa penting untuk menghargai ajaran agama sambil tetap terbuka terhadap dialog?",
        correct_answer: "Untuk menciptakan masyarakat yang harmonis",
        incorrect_answer: [
          "Agar tidak ada perbedaan pendapat",
          "Untuk menghindari konflik",
          "Semua jawaban benar",
        ],
      },
      {
        question:
          "Bagaimana Anda memandang peran Anda dalam menerapkan nilai-nilai moral di masyarakat?",
        correct_answer: "Sangat penting untuk memberikan contoh positif",
        incorrect_answer: [
          "Tidak ada peran yang sama sekali",
          "Hanya perlu mengikuti tren baru",
          "Hanya penting bagi pemimpin",
        ],
      },
      {
        question:
          "Apa langkah konkret yang bisa Anda ambil untuk mendukung nilai-nilai etika di lingkungan sekitar Anda?",
        correct_answer: "Mendorong diskusi terbuka tentang nilai-nilai moral",
        incorrect_answer: [
          "Mengatasi masalah sosial",
          "Menghindari topik tersebut sama sekali",
          "Menyebarkan rumor tentang orang lain",
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
      const paket = localStorage.getItem("paket") || "2"; // Default '1' jika null

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
