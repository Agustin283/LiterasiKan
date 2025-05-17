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
        question: "Apa yang dimaksud dengan ekosistem dalam teks tersebut?",
        correct_answer:
          "Sistem kompleks makhluk hidup dan lingkungan tak hidup yang berinteraksi.",
        incorrect_answer: [
          "Semua makhluk hidup di bumi.",
          "Hanya lingkungan hidup yang ada di sekitar kita.",
          "Sistem yang hanya melibatkan makhluk hidup.",
        ],
      },
      {
        question:
          "Aktivitas manusia mana yang TIDAK disebutkan dalam teks sebagai penyebab kerusakan ekosistem?",
        correct_answer: "Penggunaan pupuk organik",
        incorrect_answer: [
          "Penebangan hutan",
          "Pembuangan sampah sembarangan",
          "Polusi udara",
        ],
      },
      {
        question:
          "Mengapa teks menyebut keseimbangan ekosistem sebagai sesuatu yang rapuh?",
        correct_answer:
          "Karena ekosistem mudah rusak akibat aktivitas manusia.",
        incorrect_answer: [
          "Karena ekosistem mudah berubah karena cuaca.",
          "Karena ekosistem selalu dalam keadaan tidak stabil.",
          "Karena ekosistem hanya terdiri dari sedikit spesies.",
        ],
      },
      {
        question:
          "Apa yang mungkin terjadi jika populasi hewan di hutan berkurang drastis?",
        correct_answer: "Ekosistem hutan akan terganggu.",
        incorrect_answer: [
          "Tidak akan terjadi apa-apa.",
          "Ekosistem hutan akan tetap seimbang.",
          "Populasi tumbuhan akan meningkat pesat.",
        ],
      },
      {
        question:
          "Peran apa yang dimainkan oleh tumbuhan dalam menjaga keseimbangan ekosistem?",
        correct_answer:
          "Menghasilkan oksigen, menyerap karbon dioksida, dan menahan tanah.",
        incorrect_answer: [
          "Hanya menghasilkan oksigen.",
          "Hanya menyerap karbon dioksida.",
          "Tidak berperan penting dalam keseimbangan ekosistem.",
        ],
      },
      {
        question: "Bagaimana polusi udara dapat memengaruhi kesehatan manusia?",
        correct_answer:
          "Dapat menyebabkan penyakit pernapasan dan masalah kesehatan lainnya.",
        incorrect_answer: [
          "Tidak berpengaruh pada kesehatan manusia.",
          "Meningkatkan kesehatan pernapasan.",
          "Hanya memengaruhi tumbuhan dan hewan.",
        ],
      },
      {
        question:
          "Apakah upaya membuang sampah pada tempatnya sudah cukup untuk menjaga kelestarian lingkungan?",
        correct_answer: "Tidak, diperlukan upaya lain yang lebih menyeluruh.",
        incorrect_answer: [
          "Ya, itu sudah cukup.",
          "Hanya efektif di kota-kota besar.",
          "Tidak efektif sama sekali.",
        ],
      },
      {
        question:
          "Seberapa pentingkah peran individu dalam menjaga kelestarian lingkungan?",
        correct_answer:
          "Sangat penting, karena setiap individu dapat berkontribusi.",
        incorrect_answer: [
          "Tidak penting, hanya pemerintah yang bertanggung jawab.",
          "Tidak terlalu penting, karena dampaknya kecil.",
          "Penting, tetapi hanya untuk orang dewasa.",
        ],
      },
      {
        question:
          "Apa yang dapat kamu lakukan untuk mengurangi polusi udara di sekitarmu?",
        correct_answer: "Menggunakan transportasi umum atau bersepeda.",
        incorrect_answer: [
          "Membakar sampah setiap hari.",
          "Menggunakan kendaraan bermotor sesering mungkin.",
          "Tidak melakukan apa pun.",
        ],
      },
      {
        question:
          "Setelah membaca teks ini, apa yang akan kamu lakukan untuk berkontribusi pada pelestarian lingkungan?",
        correct_answer:
          "Akan mulai menerapkan kebiasaan hidup yang lebih ramah lingkungan.",
        incorrect_answer: [
          "Tidak akan melakukan apa pun.",
          "Akan terus membuang sampah sembarangan.",
          "Akan menunggu pemerintah bertindak.",
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
