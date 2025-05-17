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
        question: "Apa yang dimaksud dengan kejujuran dalam teks ini?",
        correct_answer: "Bersikap jujur terhadap diri sendiri dan orang lain",
        incorrect_answer: [
          "Hanya mengatakan kebenaran",
          "Tidak pernah melakukan kesalahan",
          "Menutupi kekurangan",
        ],
      },
      {
        question: "Apa manfaat utama kejujuran dalam hubungan interpersonal?",
        correct_answer: "Membangun kepercayaan dan hubungan yang kuat",
        incorrect_answer: [
          "Menciptakan persaingan yang sehat",
          "Mempermudah manipulasi",
          "Meningkatkan kekayaan",
        ],
      },
      {
        question: "Apa yang terjadi ketika kita jujur terhadap diri sendiri?",
        correct_answer:
          "Kita dapat menerima kekurangan dan kelebihan dengan lapang dada",
        incorrect_answer: [
          "Kita menjadi sombong",
          "Kita tidak dapat menerima kekurangan",
          "Kita menjadi pesimis",
        ],
      },
      {
        question:
          "Mengapa kejujuran menjadi kunci bagi terwujudnya keadilan dan transparansi dalam konteks sosial?",
        correct_answer:
          "Karena kejujuran membuat sistem dan proses berjalan dengan baik",
        incorrect_answer: [
          "Karena kejujuran membuat semua orang takut",
          "Karena kejujuran membuat semua orang kaya",
          "Karena kejujuran membuat semua orang bahagia",
        ],
      },
      {
        question:
          "Bagaimana kejujuran dapat membebaskan kita dari beban kebohongan dan rasa bersalah?",
        correct_answer: "Dengan membuat kita lebih tenang dan damai",
        incorrect_answer: [
          "Dengan membuat kita lupa akan kesalahan",
          "Dengan membuat kita merasa lebih superior",
          "Dengan membuat kita tidak peduli dengan orang lain",
        ],
      },
      {
        question: "Mengapa kejujuran semakin penting di era digital?",
        correct_answer: "Karena informasi mudah diakses dan disebarluaskan",
        incorrect_answer: [
          "Karena teknologi membuat orang lebih jujur",
          "Karena internet hanya berisi informasi yang benar",
          "Karena teknologi membuat orang lebih mudah berbohong",
        ],
      },
      {
        question:
          "Seberapa pentingkah kejujuran dalam membangun karakter seseorang?",
        correct_answer:
          "Penting, karena kejujuran mencerminkan integritas dan kepercayaan diri",
        incorrect_answer: [
          "Tidak penting, karena tidak semua orang jujur",
          "Penting, tetapi hanya untuk orang tertentu",
          "Tidak ada pengaruhnya sama sekali",
        ],
      },
      {
        question:
          "Apakah kejujuran selalu mudah diterapkan dalam kehidupan sehari-hari? Mengapa?",
        correct_answer:
          "Tidak, karena terkadang ada tekanan dan godaan untuk berbohong",
        incorrect_answer: [
          "Ya, karena semua orang jujur",
          "Tidak, karena kejujuran hanya untuk orang kaya",
          "Ya, karena kejujuran selalu menguntungkan",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk membangun karakter yang jujur?",
        correct_answer:
          "Berani mengakui kesalahan dan bertanggung jawab atas tindakan",
        incorrect_answer: [
          "Berbohong untuk mendapatkan keuntungan",
          "Menutupi kesalahan",
          "Tidak peduli dengan kebenaran",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat berkontribusi dalam menciptakan lingkungan yang penuh rasa saling percaya?",
        correct_answer:
          "Dengan bersikap jujur dan membangun hubungan yang sehat",
        incorrect_answer: [
          "Dengan menyebarkan berita bohong",
          "Dengan hanya memikirkan diri sendiri",
          "Dengan tidak peduli dengan orang lain",
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
