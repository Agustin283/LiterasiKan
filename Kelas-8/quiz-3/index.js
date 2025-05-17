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
        question: "Apa yang dimaksud dengan cyber bullying?",
        correct_answer:
          "Tindakan jahat yang dilakukan untuk menyakiti orang lain melalui internet",
        incorrect_answer: [
          "Tindakan kekerasan fisik di dunia nyata",
          "Pembullyan yang terjadi di sekolah",
          "Tindakan positif untuk mendukung teman secara online",
        ],
      },
      {
        question:
          "Apa bentuk-bentuk cyber bullying yang disebutkan dalam teks?",
        correct_answer:
          "Penyebaran fitnah, ejekan, hinaan, ancaman, dan pelecehan",
        incorrect_answer: [
          "Hanya berupa ejekan dan hinaan",
          "Diskusi sehat di media sosial",
          "Perdebatan yang membangun",
        ],
      },
      {
        question: "Mengapa cyber bullying dapat berdampak serius bagi korban?",
        correct_answer:
          "Karena dapat menyebabkan masalah kesehatan mental yang serius",
        incorrect_answer: [
          "Karena hanya terjadi di media sosial",
          "Karena tidak ada yang peduli terhadap korban",
          "Karena semua orang mengalami bullying",
        ],
      },
      {
        question:
          "Apa yang menjadi salah satu faktor penyebab terjadinya bullying menurut teks?",
        correct_answer:
          "Kurangnya pengawasan dari orang tua, guru, atau pengawas",
        incorrect_answer: [
          "Keberadaan media sosial",
          "Banyaknya aktivitas positif di internet",
          "Keterbukaan dalam berkomunikasi",
        ],
      },
      {
        question:
          "Bagaimana dampak cyber bullying terhadap kesehatan mental korban?",
        correct_answer: "Dapat menyebabkan kecemasan, stres, atau depresi",
        incorrect_answer: [
          "Meningkatkan rasa percaya diri",
          "Tidak memiliki dampak yang signifikan",
          "Mendorong korban untuk berperilaku lebih baik",
        ],
      },
      {
        question:
          "Apa yang dapat dilakukan oleh sekolah dan keluarga untuk mengatasi cyber bullying?",
        correct_answer:
          "Memberikan edukasi tentang bahaya cyber bullying dan dukungan kepada korban",
        incorrect_answer: [
          "Mengabaikan masalah tersebut",
          "Menghukum semua pelaku tanpa penilaian",
          "Mendorong anak-anak untuk tidak menggunakan internet sama sekali",
        ],
      },
      {
        question:
          "Seberapa pentingnya menciptakan lingkungan online yang aman dan nyaman?",
        correct_answer:
          "Sangat penting, karena dapat melindungi kesehatan mental semua orang",
        incorrect_answer: [
          "Tidak penting, karena semua orang sudah dewasa",
          "Penting, tetapi hanya bagi anak-anak",
          "Tidak ada pengaruhnya sama sekali",
        ],
      },
      {
        question:
          "Apa yang seharusnya dilakukan sebelum bertindak di dunia maya?",
        correct_answer:
          "Berpikir dulu sebelum bertindak atau melakukan sesuatu",
        incorrect_answer: [
          "Mengabaikan perasaan orang lain",
          "Melakukan apa pun yang diinginkan",
          "Hanya mengikuti tren yang ada",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat berkontribusi untuk menghentikan cyber bullying di lingkungan sekitar Anda?",
        correct_answer:
          "Dengan memberikan dukungan kepada korban dan melaporkan pelaku",
        incorrect_answer: [
          "Dengan menjadi penonton dan tidak campur tangan",
          "Dengan ikut mengejek korban",
          "Dengan tidak menggunakan media sosial",
        ],
      },
      {
        question:
          "Apa yang bisa Anda pelajari dari pengalaman orang lain yang menjadi korban cyber bullying?",
        correct_answer:
          "Pentingnya empati dan dukungan sosial dalam mengatasi masalah ini",
        incorrect_answer: [
          "Bahwa semua orang harus kuat dan tidak peduli",
          "Bahwa cyber bullying tidak serius",
          "Bahwa semua orang dapat mempermalukan orang lain",
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
