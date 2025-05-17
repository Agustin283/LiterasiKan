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
          "Apa yang menjadi faktor utama dalam keberhasilan wirausaha di era globalisasi?",
        correct_answer: "Kemampuan beradaptasi dengan zaman",
        incorrect_answer: [
          "Kemampuan melihat peluang dan mengambil risiko",
          "Kemampuan menciptakan inovasi",
          "Kemampuan mengelola sumber daya",
        ],
      },
      {
        question:
          "Bagaimana peran UKM dalam perekonomian, khususnya di negara berkembang?",
        correct_answer: "Menyediakan barang dan jasa dengan harga terjangkau",
        incorrect_answer: [
          "Menciptakan lapangan kerja baru",
          "Meningkatkan efisiensi produksi",
          "Memperkuat daya saing ekonomi nasional",
        ],
      },
      {
        question:
          "Berdasarkan teks, apa yang dapat disimpulkan tentang dampak kewirausahaan terhadap perekonomian?",
        correct_answer:
          "Kewirausahaan memiliki dampak positif yang signifikan pada perekonomian secara keseluruhan",
        incorrect_answer: [
          "Kewirausahaan hanya berdampak positif pada sektor informal",
          "Kewirausahaan hanya berdampak positif pada sektor formal",
          "Kewirausahaan tidak memiliki dampak yang signifikan pada perekonomian",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari pernyataan "Pendidikan kewirausahaan di tingkat SMA menjadi langkah strategis dalam membangun jiwa wirausaha sejak dini"?',
        correct_answer:
          "Pendidikan kewirausahaan dapat membantu membentuk pola pikir positif dalam menghadapi tantangan ekonomi",
        incorrect_answer: [
          "Pendidikan kewirausahaan hanya penting bagi pelajar SMA.",
          "Pendidikan kewirausahaan tidak penting bagi pelajar SMA",
          "Pendidikan kewirausahaan hanya fokus pada keterampilan praktis",
        ],
      },
      {
        question:
          "Bagaimana hubungan antara inovasi dan pertumbuhan ekonomi dalam konteks kewirausahaan?",
        correct_answer:
          "Inovasi dapat meningkatkan produktivitas dan efisiensi, yang pada akhirnya memperkuat daya saing ekonomi nasional",
        incorrect_answer: [
          "Inovasi tidak memiliki hubungan dengan pertumbuhan ekonomi",
          "Inovasi hanya berdampak pada sektor formal",
          "Inovasi hanya berdampak pada sektor informal",
        ],
      },
      {
        question:
          "Jelaskan bagaimana pendidikan kewirausahaan dapat membentuk pola pikir positif dalam menghadapi tantangan ekonomi di masa depan?",
        correct_answer:
          "Pendidikan kewirausahaan mengajarkan siswa untuk berpikir kritis, kreatif, dan solutif",
        incorrect_answer: [
          "Pendidikan kewirausahaan hanya mengajarkan siswa tentang manajemen keuangan",
          "Pendidikan kewirausahaan hanya mengajarkan siswa tentang pemasaran",
          "Pendidikan kewirausahaan tidak memiliki pengaruh pada pola pikir siswa",
        ],
      },
      {
        question: "Apa saja tantangan yang dihadapi oleh kewirausahaan?",
        correct_answer:
          "Keterbatasan modal, akses pasar, dan regulasi yang kompleks",
        incorrect_answer: [
          "Kurangnya minat masyarakat terhadap wirausaha",
          "Kurangnya dukungan dari pemerintah",
          "Kurangnya tenaga kerja terampil",
        ],
      },
      {
        question:
          "Bagaimana peran pemerintah dalam menciptakan ekosistem kewirausahaan yang kondusif?",
        correct_answer:
          "Memberikan program pendanaan, pelatihan, dan kebijakan probisnis",
        incorrect_answer: [
          "Memberikan sanksi kepada wirausahawan yang gagal",
          "Mengatur harga produk yang dijual oleh wirausahawan",
          "Membatasi jumlah wirausahawan baru",
        ],
      },
      {
        question:
          "Bagaimana menurut Anda pentingnya peran generasi muda dalam membangun perekonomian yang berkelanjutan?",
        correct_answer:
          "Generasi muda dapat menjadi motor penggerak ekonomi melalui inovasi dan semangat berwirausaha",
        incorrect_answer: [
          "Generasi muda tidak memiliki peran dalam pembangunan ekonomi",
          "Generasi muda hanya dapat menjadi konsumen",
          "Generasi muda hanya dapat bekerja di sektor formal",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk mendukung pertumbuhan kewirausahaan di Indonesia?",
        correct_answer: "Semua jawaban benar",
        incorrect_answer: [
          "Mencari pekerjaan di perusahaan besar",
          "Menjalankan bisnis sendiri",
          "Membeli produk dari wirausahawan lokal",
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
