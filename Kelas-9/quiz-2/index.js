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
          "Apa yang menjadi fokus utama dari teks tentang teknologi dan inovasi?",
        correct_answer:
          "Perkembangan teknologi dan inovasi dalam masyarakat modern",
        incorrect_answer: [
          "Dampak negatif dari teknologi",
          "Sejarah teknologi dari masa lalu",
          "Hanya tentang kecerdasan buatan",
        ],
      },
      {
        question:
          "Sektor mana yang disebutkan dalam teks sebagai salah satu yang terpengaruh oleh inovasi teknologi?",
        correct_answer: "Kesehatan",
        incorrect_answer: ["Pertanian", "Transportasi", "Hanya pendidikan"],
      },
      {
        question:
          "Apa kesimpulan yang dapat diambil mengenai dampak kecerdasan buatan (AI) dalam dunia kerja?",
        correct_answer:
          "AI meningkatkan efisiensi dan produktivitas di perusahaan",
        incorrect_answer: [
          "AI tidak berpengaruh pada produktivitas",
          "AI hanya digunakan dalam sektor kesehatan",
          "AI menggantikan semua pekerjaan manusia",
        ],
      },
      {
        question:
          "Jika teknologi telemedicine terus berkembang, apa yang mungkin terjadi pada akses layanan kesehatan?",
        correct_answer:
          "Akses layanan kesehatan akan menjadi lebih mudah dan cepat",
        incorrect_answer: [
          "Akses layanan kesehatan akan semakin sulit",
          "Layanan kesehatan akan menjadi lebih mahal",
          "Tidak ada perubahan dalam akses layanan kesehatan",
        ],
      },
      {
        question:
          "Mengapa penting untuk mempertimbangkan etika dalam pengembangan teknologi?",
        correct_answer:
          "Untuk memastikan bahwa teknologi tidak merugikan masyarakat",
        incorrect_answer: [
          "Agar teknologi dapat digunakan tanpa batas",
          "Agar semua orang dapat menggunakan teknologi secara gratis",
          "Untuk meningkatkan keuntungan perusahaan",
        ],
      },
      {
        question:
          "Apa yang menjadi tantangan utama yang dihadapi masyarakat terkait dengan kemajuan teknologi?",
        correct_answer: "Isu privasi data dan keamanan siber",
        incorrect_answer: [
          "Meningkatnya jumlah pengguna teknologi",
          "Penurunan kualitas produk teknologi",
          "Meningkatnya jumlah tenaga kerja",
        ],
      },
      {
        question:
          "Dari berbagai inovasi yang disebutkan dalam teks, mana yang paling berpotensi untuk mengatasi masalah perubahan iklim?",
        correct_answer:
          "Energi terbarukan seperti panel surya dan turbin angin",
        incorrect_answer: [
          "Kecerdasan buatan",
          "Telemedicine",
          "Otomatisasi industri",
        ],
      },
      {
        question:
          "Seberapa pentingnya pendidikan tentang teknologi bagi masyarakat?",
        correct_answer:
          "Sangat penting untuk meningkatkan kesadaran dan pemanfaatan teknologi yang bijak",
        incorrect_answer: [
          "Tidak penting, karena semua orang sudah tahu cara menggunakan teknologi",
          "Hanya penting bagi pelajar dan mahasiswa",
          "Penting untuk meningkatkan penjualan produk teknologi",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan secara pribadi untuk memanfaatkan teknologi dengan bijak?",
        correct_answer:
          "Menggunakan teknologi untuk belajar dan berbagi informasi positif",
        incorrect_answer: [
          "Mengabaikan isu privasi dan keamanan",
          "Menggunakan teknologi hanya untuk hiburan",
          "Membuang sampah elektronik sembarangan",
        ],
      },
      {
        question:
          "Mengapa penting untuk melibatkan masyarakat dalam diskusi tentang teknologi dan inovasi?",
        correct_answer:
          "Untuk memastikan semua orang merasa memiliki tanggung jawab dan dapat berkontribusi",
        incorrect_answer: [
          "Agar hanya pemerintah yang bertanggung jawab",
          "Agar masyarakat tidak mengganggu pengembangan teknologi",
          "Untuk meningkatkan jumlah pengguna teknologi",
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
