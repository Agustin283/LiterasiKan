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
        question: "Apa julukan yang diberikan kepada Ki Hajar Dewantara?",
        correct_answer: "Guru Kebangsaan Indonesia",
        incorrect_answer: [
          "Bapak Pendidikan Indonesia",
          "Pahlawan Nasional",
          "Tokoh Kebudayaan",
        ],
      },
      {
        question: "Di mana Ki Hajar Dewantara lahir?",
        correct_answer: "Yogyakarta",
        incorrect_answer: ["Jakarta", "Surabaya", "Bandung"],
      },
      {
        question:
          "Apa yang menjadi fokus utama Ki Hajar Dewantara dalam pendidikan?",
        correct_answer:
          "Pendidikan yang inklusif dan dapat diakses oleh semua orang",
        incorrect_answer: [
          "Menciptakan sekolah-sekolah elit",
          "Mengajarkan pelajaran agama",
          "Mengembangkan teknologi pendidikan",
        ],
      },
      {
        question:
          "Dari informasi yang terdapat di teks, dapat disimpulkan bahwa Ki Hajar Dewantara sangat mementingkan:",
        correct_answer: "Kesadaran nasionalisme di kalangan siswa",
        incorrect_answer: [
          "Pendidikan untuk orang kaya",
          "Pendidikan di luar negeri",
          "Sistem pendidikan yang kuno",
        ],
      },
      {
        question:
          "Apa yang dilakukan Ki Hajar Dewantara untuk menyebarkan pendidikan di Indonesia?",
        correct_answer: "Mendirikan sekolah-sekolah dan yayasan pendidikan",
        incorrect_answer: [
          "Mendapatkan beasiswa ke luar negeri",
          "Hanya menjadi penulis",
          "Mengabaikan pendidikan di daerah terpencil",
        ],
      },
      {
        question:
          "Mengapa Ki Hajar Dewantara mendirikan Yayasan Pendidikan Indonesia?",
        correct_answer:
          "Untuk mencapai visi pendidikan yang inklusif dan dapat diakses oleh semua orang",
        incorrect_answer: [
          "Untuk membuat sekolah-sekolah mahal",
          "Untuk menyalurkan hobi menulis",
          "Untuk mengumpulkan uang",
        ],
      },
      {
        question:
          "Seberapa besar pengaruh Ki Hajar Dewantara terhadap pendidikan di Indonesia?",
        correct_answer:
          "Sangat besar, karena mendirikan berbagai sekolah dan yayasan serta mengabdi dalam pemerintahan",
        incorrect_answer: [
          "Sangat kecil, karena hanya mengajar di satu sekolah",
          "Sedang, karena mendirikan beberapa sekolah",
          "Tidak ada pengaruh sama sekali",
        ],
      },
      {
        question:
          "Apakah buku “Pendidikan Kebangsaan” masih relevan dengan pendidikan saat ini? Mengapa?",
        correct_answer:
          "Ya, karena menekankan pentingnya pendidikan untuk mencerdaskan kehidupan bangsa",
        incorrect_answer: [
          "Tidak, karena sudah ketinggalan zaman",
          "Ya, tetapi hanya untuk kalangan tertentu",
          "Tidak, karena lebih baik menggunakan teknologi",
        ],
      },
      {
        question:
          "Apa yang bisa Anda tiru dari semangat Ki Hajar Dewantara dalam pendidikan?",
        correct_answer: "Bekerja keras untuk mencapai tujuan pendidikan",
        incorrect_answer: [
          "Mengabaikan pendidikan",
          "Fokus pada keuntungan pribadi",
          "Menyebarkan kebencian antarsiswa",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat berkontribusi untuk dunia pendidikan mengikuti jejak Ki Hajar Dewantara?",
        correct_answer: "Dengan mendirikan sekolah dan berbagi ilmu",
        incorrect_answer: [
          "Dengan tidak peduli terhadap pendidikan orang lain",
          "Dengan hanya belajar untuk diri sendiri",
          "Dengan menolak pendidikan formal",
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
