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
        question: "Apa profesi ayah Raeni?",
        correct_answer: "Tukang becak",
        incorrect_answer: ["Petani", "Nelayan", "Guru"],
      },
      {
        question: "Di mana Raeni melanjutkan pendidikan S2?",
        correct_answer: "Birmingham, Inggris",
        incorrect_answer: [
          "Universitas Negeri Semarang",
          "Jakarta",
          "Amerika Serikat",
        ],
      },
      {
        question:
          "Apa yang menjadi motivasi utama Raeni untuk meraih pendidikan tinggi?",
        correct_answer: "Ingin mengubah nasib keluarganya",
        incorrect_answer: [
          "Ingin menjadi terkenal",
          "Ingin mendapatkan banyak uang",
          "Ingin menjadi guru",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan dari foto Raeni diwisuda yang diantar ayahnya dengan becak?",
        correct_answer:
          "Foto tersebut menggambarkan perjuangan dan pengorbanan keluarga",
        incorrect_answer: [
          "Raeni tidak mampu membeli mobil",
          "Raeni tidak menghargai ayahnya",
          "Raeni adalah anak yang manja",
        ],
      },
      {
        question:
          "Bagaimana peran beasiswa Bidikmisi dalam perjalanan pendidikan Raeni?",
        correct_answer: "Membantu Raeni membayar biaya kuliah",
        incorrect_answer: [
          "Membantu Raeni membeli rumah",
          "Membantu Raeni mendapatkan pekerjaan",
          "Membantu Raeni menjadi terkenal",
        ],
      },
      {
        question:
          "Apa yang menjadi bukti dedikasi Raeni setelah menyelesaikan pendidikan masternya?",
        correct_answer: "Ia menjadi dosen di almamaternya",
        incorrect_answer: [
          "Ia membuka bisnis sendiri",
          "Ia bekerja di perusahaan asing",
          "Ia menjadi politikus",
        ],
      },
      {
        question:
          "Seberapa pentingkah peran keluarga dalam mendukung pencapaian seseorang?",
        correct_answer:
          "Penting, karena keluarga dapat memberikan motivasi dan dukungan",
        incorrect_answer: [
          "Tidak penting, karena seseorang harus mandiri",
          "Penting, tetapi hanya bagi orang kaya",
          "Tidak ada pengaruhnya sama sekali",
        ],
      },
      {
        question:
          "Apakah kisah Raeni dapat menginspirasi generasi muda? Mengapa?",
        correct_answer:
          "Ya, karena kisah Raeni menunjukkan bahwa mimpi dapat terwujud dengan usaha",
        incorrect_answer: [
          "Tidak, karena Raeni hanya orang yang beruntung",
          "Ya, tetapi hanya bagi anak-anak tukang becak",
          "Tidak, karena kisah Raeni tidak relevan dengan zaman sekarang",
        ],
      },
      {
        question: "Apa yang dapat Anda pelajari dari kisah Raeni?",
        correct_answer:
          "Bahwa kerja keras dan tekad dapat membawa seseorang meraih kesuksesan",
        incorrect_answer: [
          "Bahwa pendidikan tidak penting",
          "Bahwa kesuksesan hanya untuk orang kaya",
          "Bahwa semua orang harus menjadi tukang becak",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat menerapkan semangat Raeni dalam kehidupan Anda?",
        correct_answer:
          "Dengan berusaha keras dan pantang menyerah untuk meraih mimpi",
        incorrect_answer: [
          "Dengan menyerah pada mimpi",
          "Dengan tidak berusaha keras",
          "Dengan tidak menghargai keluarga",
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
