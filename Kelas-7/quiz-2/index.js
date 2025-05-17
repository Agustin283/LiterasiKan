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
          'Apa yang diibaratkan sebagai "sungai yang mengalir" dalam teks tersebut?',
        correct_answer: "Teknologi",
        incorrect_answer: ["Inovasi", "Solusi", "Masalah"],
      },
      {
        question:
          "Apa contoh inovasi yang disebutkan dalam teks yang telah menyelamatkan banyak nyawa?",
        correct_answer: "Vaksin dan obat-obatan",
        incorrect_answer: [
          "Penemuan roda",
          "Penemuan komputer",
          "Platform digital",
        ],
      },
      {
        question:
          "Mengapa teks menyebutkan bahwa hidup tanpa smartphone akan menyulitkan?",
        correct_answer:
          "Karena smartphone memudahkan akses informasi dan komunikasi.",
        incorrect_answer: [
          "Karena smartphone adalah barang mewah.",
          "Karena smartphone adalah satu-satunya alat komunikasi.",
          "Karena smartphone membuat orang malas bekerja.",
        ],
      },
      {
        question:
          "Apa yang mungkin terjadi jika inovasi teknologi tidak terkendali?",
        correct_answer: "Lingkungan bisa rusak dan menimbulkan masalah baru.",
        incorrect_answer: [
          "Kualitas hidup manusia akan meningkat drastis.",
          "Dunia akan menjadi lebih maju.",
          "Tidak akan ada dampak negatif.",
        ],
      },
      {
        question: "Apa hubungan antara teknologi, inovasi, dan solusi masalah?",
        correct_answer:
          "Inovasi menghasilkan teknologi baru yang memecahkan masalah.",
        incorrect_answer: [
          "Tidak ada hubungan.",
          "Teknologi selalu menghasilkan inovasi yang menyelesaikan masalah.",
          "Inovasi dan teknologi tidak berhubungan dengan solusi masalah.",
        ],
      },
      {
        question:
          "Mengapa penting untuk menggunakan teknologi dan inovasi secara bijak?",
        correct_answer:
          "Agar bermanfaat bagi semua orang dan menjaga lingkungan.",
        incorrect_answer: [
          "Agar terlihat modern.",
          "Agar tidak ketinggalan zaman.",
          "Agar kita menjadi lebih kaya.",
        ],
      },
      {
        question: "Apakah ketergantungan pada gadget selalu berdampak negatif?",
        correct_answer: "Tidak, tergantung bagaimana kita menggunakannya.",
        incorrect_answer: [
          "Ya, selalu negatif.",
          "Hanya negatif bagi anak-anak.",
          "Tidak ada dampak negatif sama sekali.",
        ],
      },
      {
        question:
          "Apakah semua inovasi teknologi selalu membawa dampak positif?",
        correct_answer: "Tidak, beberapa inovasi bisa berdampak negatif.",
        incorrect_answer: [
          "Ya, semua inovasi selalu positif.",
          "Tidak ada inovasi yang berdampak negatif.",
          "Hanya inovasi di bidang kesehatan yang positif.",
        ],
      },
      {
        question:
          "Apa yang dapat kamu lakukan untuk menghindari ketergantungan pada gadget?",
        correct_answer:
          "Membatasi penggunaan gadget dan mencari kegiatan lain yang bermanfaat.",
        incorrect_answer: [
          "Meningkatkan waktu penggunaan gadget.",
          "Menggunakan gadget sepanjang waktu.",
          "Tidak pernah menggunakan gadget.",
        ],
      },
      {
        question:
          "Bagaimana kamu akan menggunakan teknologi untuk menciptakan masa depan yang lebih baik?",
        correct_answer:
          "Dengan bijak dan bertanggung jawab, untuk membantu orang lain dan memecahkan masalah.",
        incorrect_answer: [
          "Hanya untuk bermain game.",
          "Hanya untuk menonton video.",
          "Tidak akan menggunakan teknologi.",
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
