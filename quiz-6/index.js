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
        question: "Apa yang dimaksud dengan makanan sehat menurut teks?",
        correct_answer:
          "Makanan yang mengandung nutrisi yang dibutuhkan tubuh seperti sayur, buah, biji-bijian, dan protein",
        incorrect_answer: [
          "Makanan yang mengandung banyak kalori",
          "Makanan yang hanya mengandung buah",
          "Makanan yang tidak mengandung gula",
        ],
      },
      {
        question: "Apa manfaat utama dari mengonsumsi makanan sehat?",
        correct_answer: "Menjaga tubuh tetap bugar dan berenergi",
        incorrect_answer: [
          "Mengurangi rasa lapar",
          "Meningkatkan berat badan",
          "Meningkatkan konsumsi kalori",
        ],
      },
      {
        question:
          "Apa yang terkandung dalam buah jeruk yang bermanfaat bagi tubuh?",
        correct_answer: "Vitamin C",
        incorrect_answer: ["Zat besi", "Karbohidrat", "Protein"],
      },
      {
        question: "Sayuran bayam kaya akan...",
        correct_answer: "Zat besi",
        incorrect_answer: ["Vitamin A", "Protein", "Serat"],
      },
      {
        question:
          "Apa yang terjadi jika mengonsumsi makanan tidak sehat seperti fast food?",
        correct_answer: "Menurunkan daya tahan tubuh dan menyebabkan penyakit",
        incorrect_answer: [
          "Meningkatkan energi tubuh",
          "Menjaga kesehatan tubuh",
          "Menambah massa otot",
        ],
      },
      {
        question: "Pola makan sehat dapat membantu tubuh...",
        correct_answer: "Beraktivitas dengan lebih baik",
        incorrect_answer: [
          "Menghasilkan lebih banyak energi",
          "Menghasilkan lebih banyak lemak",
          "Menghindari rasa lapar",
        ],
      },
      {
        question: "Selain makanan sehat, apa yang juga penting untuk tubuh?",
        correct_answer: "Camilan sehat dan air putih",
        incorrect_answer: [
          "Makanan berat",
          "Makanan cepat saji",
          "Minuman manis",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan dari teks mengenai makanan sehat?",
        correct_answer: "Makanan sehat membantu menjaga tubuh kuat dan sehat",
        incorrect_answer: [
          "Makanan sehat hanya penting untuk diet",
          "Makanan sehat tidak memiliki manfaat jangka panjang",
          "Makanan sehat hanya dibutuhkan oleh orang dewasa",
        ],
      },
      {
        question:
          "Mengapa konsumsi makanan sehat disebut sebagai investasi terbaik?",
        correct_answer:
          "Karena dapat meningkatkan kualitas hidup dan panjang umur",
        incorrect_answer: [
          "Karena dapat meningkatkan daya tahan tubuh secara instan",
          "Karena tidak memerlukan biaya banyak",
          "Karena hanya membutuhkan waktu singkat untuk terlihat hasilnya",
        ],
      },
      {
        question:
          "Apa yang dapat menyebabkan penurunan daya tahan tubuh menurut teks?",
        correct_answer: "Konsumsi makanan tidak sehat seperti fast food",
        incorrect_answer: [
          "Konsumsi sayur dan buah",
          "Konsumsi makanan sehat",
          "Konsumsi air putih yang cukup",
        ],
      },
      {
        question: "Bagaimana cara menjaga tubuh tetap kuat menurut teks?",
        correct_answer: "Dengan memilih makanan sehat",
        incorrect_answer: [
          "Dengan makan makanan cepat saji",
          "Dengan hanya mengonsumsi camilan",
          "Dengan minum banyak kopi",
        ],
      },
      {
        question: "Apa yang dimaksud dengan camilan sehat dalam teks?",
        correct_answer: "Makanan ringan yang memberi manfaat bagi tubuh",
        incorrect_answer: [
          "Makanan ringan yang tinggi kalori",
          "Makanan ringan yang rendah nutrisi",
          "Makanan ringan yang hanya mengandung karbohidrat",
        ],
      },
      {
        question:
          "Apa yang disarankan untuk menjaga tubuh tetap bugar dan berenergi?",
        correct_answer:
          "Makan makanan yang mengandung nutrisi penting seperti sayur, buah, dan biji-bijian",
        incorrect_answer: [
          "Mengonsumsi makanan cepat saji",
          "Menghindari makan sama sekali",
          "Mengonsumsi banyak gula",
        ],
      },
      {
        question: "Apa yang harus dihindari agar daya tahan tubuh tetap baik?",
        correct_answer: "Mengonsumsi makanan tidak sehat seperti fast food",
        incorrect_answer: [
          "Makan buah dan sayur",
          "Mengonsumsi air putih",
          "Menghindari olahraga",
        ],
      },
      {
        question:
          "Apa hubungan antara makanan sehat dan penyakit menurut teks?",
        correct_answer: "Makanan sehat dapat mencegah penyakit",
        incorrect_answer: [
          "Makanan sehat dapat menyebabkan penyakit",
          "Makanan sehat tidak ada hubungannya dengan penyakit",
          "Makanan sehat hanya untuk menjaga berat badan",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan nutrisi dalam konteks makanan sehat?",
        correct_answer: "Zat yang dibutuhkan tubuh untuk berfungsi dengan baik",
        incorrect_answer: [
          "Gizi yang tidak penting bagi tubuh",
          "Hanya protein yang dibutuhkan tubuh",
          "Hanya kalori yang diperlukan oleh tubuh",
        ],
      },
      {
        question: "Mengapa air putih penting untuk tubuh?",
        correct_answer: "Membantu menjaga tubuh tetap terhidrasi",
        incorrect_answer: [
          "Membantu meningkatkan rasa lapar",
          "Menambah rasa kenyang",
          "Mengganti makanan",
        ],
      },
      {
        question: "Apa yang dapat meningkatkan daya tahan tubuh menurut teks?",
        correct_answer:
          "Mengonsumsi makanan sehat yang mengandung vitamin dan zat besi",
        incorrect_answer: [
          "Mengonsumsi makanan cepat saji",
          "Menghindari semua jenis makanan",
          "Mengurangi konsumsi air putih",
        ],
      },
      {
        question:
          "Apa yang bisa menjadi akibat dari pola makan yang tidak sehat?",
        correct_answer:
          "Daya tahan tubuh menurun dan risiko penyakit meningkat",
        incorrect_answer: [
          "Tubuh menjadi lebih kuat",
          "Tubuh tetap bugar dan berenergi",
          "Tidak ada dampak apapun",
        ],
      },
      {
        question:
          "Apa yang disarankan untuk hidup sehat dan panjang umur menurut teks?",
        correct_answer: "Memilih makanan sehat sebagai bagian dari pola makan",
        incorrect_answer: [
          "Makan makanan cepat saji setiap hari",
          "Menghindari makan malam",
          "Tidak mengonsumsi buah dan sayur",
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

      if (wpm >= 175) {
        kpmMessage =
          "Sesuai dengan Kriteria Ketuntasan Minimal (KKM) untuk siswa SMP, mencakup kecepatan dan pemahaman yang baik.";
      } else if (wpm >= 105 && wpm < 175) {
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
