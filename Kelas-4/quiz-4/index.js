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
        question: "Apa yang dimaksud dengan komputer dalam teks ini?",
        correct_answer:
          "Benda kotak besar dengan layar yang menyala dan membantu berbagai aktivitas.",
        incorrect_answer: [
          "Alat untuk menulis surat.",
          "Alat untuk menggambar manual.",
          "Televisi yang menampilkan film.",
        ],
      },
      {
        question: "Apa fungsi utama dari layar komputer?",
        correct_answer: "Menampilkan informasi yang diperlukan pengguna.",
        incorrect_answer: [
          "Menyimpan data.",
          "Menghasilkan suara.",
          "Menghubungkan dengan internet.",
        ],
      },
      {
        question: "Dari teks, apa yang dapat disimpulkan tentang CPU?",
        correct_answer:
          "CPU adalah bagian yang mengolah informasi dan menjalankan program di komputer.",
        incorrect_answer: [
          "CPU tidak penting untuk komputer.",
          "CPU hanya digunakan untuk bermain game.",
          "CPU adalah alat untuk menggambar.",
        ],
      },
      {
        question:
          "Apa kesimpulan yang dapat diambil mengenai penggunaan software di komputer?",
        correct_answer:
          "Software membantu komputer menjalankan tugas tertentu dengan instruksi yang diberikan.",
        incorrect_answer: [
          "Software hanya digunakan untuk bermain game.",
          "Software tidak berpengaruh pada kemampuan komputer.",
          "Software hanya tersedia untuk komputer terbaru.",
        ],
      },
      {
        question: "Mengapa penting untuk menggunakan komputer dengan bijak?",
        correct_answer:
          "Karena penggunaan yang berlebihan bisa membuat mata lelah dan badan kurang sehat.",
        incorrect_answer: [
          "Agar komputer tidak cepat rusak.",
          "Agar kita bisa melakukan lebih banyak aktivitas.",
          "Karena komputer tidak bisa membantu belajar.",
        ],
      },
      {
        question: "Apa yang dimaksud dengan internet dalam konteks teks ini?",
        correct_answer:
          "Jaringan yang menghubungkan komputer di seluruh dunia dan memungkinkan kita mencari informasi.",
        incorrect_answer: [
          "Sebuah permainan yang bisa dimainkan di komputer.",
          "Sebuah jenis perangkat keras komputer.",
          "Sebuah aplikasi untuk menggambar.",
        ],
      },
      {
        question:
          "Apakah Anda setuju bahwa komputer sangat bermanfaat bagi kehidupan kita? Mengapa?",
        correct_answer:
          "Setuju, karena komputer membantu kita belajar, bekerja, dan bermain.",
        incorrect_answer: [
          "Tidak setuju, karena komputer bisa membuat kita malas.",
          "Setuju, tetapi hanya untuk bermain game.",
          "Tidak setuju, karena komputer tidak berguna.",
        ],
      },
      {
        question:
          "Mana yang merupakan cara yang baik untuk menggunakan komputer?",
        correct_answer:
          "Menggunakan komputer untuk belajar dan berkomunikasi dengan teman.",
        incorrect_answer: [
          "Menghabiskan waktu berjam-jam hanya untuk bermain.",
          "Menggunakan komputer untuk mengabaikan aktivitas fisik.",
          "Menggunakan komputer tanpa batasan waktu.",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca teks tentang komputer?",
        correct_answer:
          "Mempelajari lebih lanjut tentang cara menggunakan komputer dengan bijak.",
        incorrect_answer: [
          "Mengabaikan informasi tentang komputer.",
          "Menghabiskan waktu lebih banyak di depan komputer.",
          "Tidak melakukan apa-apa.",
        ],
      },
      {
        question:
          "Apa pesan moral yang dapat diambil dari teks ini mengenai penggunaan komputer?",
        correct_answer:
          "Kita harus menggunakan komputer dengan bijak dan tidak mengabaikan kehidupan nyata.",
        incorrect_answer: [
          "Komputer adalah satu-satunya alat yang penting.",
          "Komputer tidak berguna tanpa internet.",
          "Semua aktivitas harus dilakukan di depan komputer.",
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
      const paket = localStorage.getItem("paket") || "4"; // Default '1' jika null

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
