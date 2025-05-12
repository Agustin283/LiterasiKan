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
        question: "Apa yang dimaksud dengan kecerdasan buatan (AI)?",
        correct_answer: "Teknologi yang membantu menyelesaikan tugas rumit",
        incorrect_answer: [
          "Teknologi yang digunakan untuk menggantikan manusia",
          "Sistem yang mengatur keuangan pribadi",
          "Sistem yang hanya digunakan di bidang teknologi",
        ],
      },
      {
        question: "Di bidang apa saja kecerdasan buatan (AI) digunakan?",
        correct_answer: "Kesehatan, keuangan, dan asisten digital",
        incorrect_answer: [
          "Hanya di bidang keuangan",
          "Pendidikan dan teknologi informasi",
          "Hanya dalam bidang teknologi",
        ],
      },
      {
        question: "Bagaimana AI membantu dalam bidang kesehatan?",
        correct_answer: "Mendiagnosis penyakit",
        incorrect_answer: [
          "Menyusun laporan keuangan rumah sakit",
          "Mengatur jadwal dokter",
          "Membuat keputusan medis tanpa bantuan manusia",
        ],
      },
      {
        question: "Bagaimana AI membantu di bidang keuangan?",
        correct_answer: "Mempermudah memeriksa data pasar yang kompleks",
        incorrect_answer: [
          "Membuat keputusan investasi tanpa pertimbangan manusia",
          "Menyusun anggaran negara",
          "Mengatur transaksi secara otomatis",
        ],
      },
      {
        question:
          "Apa keuntungan utama dari penggunaan AI dalam kehidupan sehari-hari?",
        correct_answer: "Membantu mengatur jadwal lebih efisien dan tepat",
        incorrect_answer: [
          "Mengurangi kualitas hidup manusia",
          "Menggantikan pekerjaan manusia secara langsung",
          "Memperkenalkan tantangan baru dalam teknologi",
        ],
      },
      {
        question:
          "Apa dampak negatif yang ditimbulkan oleh kecerdasan buatan (AI)?",
        correct_answer: "Hilangnya pekerjaan akibat mesin",
        incorrect_answer: [
          "Meningkatkan biaya hidup",
          "Penggunaan energi yang lebih efisien",
          "Peningkatan jumlah pekerjaan manual",
        ],
      },
      {
        question: "Masalah lain yang ditimbulkan oleh AI adalah...?",
        correct_answer: "Salah penggunaan teknologi yang merugikan",
        incorrect_answer: [
          "Penurunan kualitas pekerjaan manusia",
          "Kurangnya akses terhadap teknologi",
          "Penurunan kualitas hidup secara umum",
        ],
      },
      {
        question: "Mengapa penting untuk mengelola perkembangan AI?",
        correct_answer:
          "Agar masyarakat dapat menggunakan teknologi dengan bijak",
        incorrect_answer: [
          "Agar teknologi berkembang tanpa hambatan",
          "Untuk memastikan bahwa AI tidak menggantikan manusia sepenuhnya",
          "Agar AI dapat digunakan untuk mengontrol kehidupan manusia",
        ],
      },
      {
        question:
          "Apa yang perlu dilakukan pemerintah terkait perkembangan AI?",
        correct_answer: "Membuat aturan yang jelas dan tegas",
        incorrect_answer: [
          "Mengizinkan penggunaan AI tanpa aturan",
          "Menghentikan pengembangan AI",
          "Menggunakan AI untuk meningkatkan kontrol sosial",
        ],
      },
      {
        question: "Apa yang perlu dipahami masyarakat dalam penggunaan AI?",
        correct_answer: "Cara menggunakan AI dengan baik dan benar",
        incorrect_answer: [
          "Cara menggunakan AI secara sembarangan",
          "Teknologi yang menggantikan pekerjaan manusia",
          "Bagaimana AI dapat digunakan untuk merugikan orang lain",
        ],
      },
      {
        question:
          "Mengapa kita perlu belajar keterampilan baru untuk masa depan?",
        correct_answer: "Agar tetap relevan dengan perkembangan teknologi",
        incorrect_answer: [
          "Agar bisa menggantikan AI dalam pekerjaan",
          "Untuk menanggulangi kehilangan pekerjaan akibat AI",
          "Agar tidak terpengaruh oleh kemajuan teknologi",
        ],
      },
      {
        question: "Bagaimana AI membantu mengatur jadwal lebih efisien?",
        correct_answer: "Dengan menggunakan algoritma untuk merencanakan waktu",
        incorrect_answer: [
          "Dengan menggantikan manusia dalam membuat keputusan",
          "Dengan memantau setiap aktivitas manusia secara langsung",
          "Dengan membuat keputusan untuk orang lain",
        ],
      },
      {
        question: "Apa tantangan utama dalam penggunaan AI?",
        correct_answer: "Penyalahgunaan teknologi yang merugikan",
        incorrect_answer: [
          "Pengembangan AI yang terlalu cepat",
          "Kesulitan dalam memahami cara kerja AI",
          "AI yang tidak dapat berfungsi dengan baik di berbagai bidang",
        ],
      },
      {
        question:
          "Apa yang seharusnya dilakukan masyarakat agar bisa memanfaatkan AI secara maksimal?",
        correct_answer: "Memahami cara menggunakan AI dengan benar",
        incorrect_answer: [
          "Menghindari penggunaan AI dalam kehidupan sehari-hari",
          "Menggunakan AI tanpa pemahaman yang cukup",
          "Menggunakan AI hanya dalam bidang bisnis",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan 'salah penggunaan teknologi' dalam konteks ini?",
        correct_answer: "Menggunakan teknologi tanpa pengetahuan yang tepat",
        incorrect_answer: [
          "Penggunaan teknologi secara berlebihan",
          "Menggunakan teknologi untuk tujuan positif",
          "Menghindari penggunaan teknologi sama sekali",
        ],
      },
      {
        question:
          "Apa yang perlu dilakukan agar dampak buruk AI dapat diminimalkan?",
        correct_answer: "Mengelola perkembangan AI secara bijak",
        incorrect_answer: [
          "Menghentikan pengembangan teknologi",
          "Memberikan kebebasan penuh kepada AI",
          "Menjauhkan AI dari kehidupan sehari-hari",
        ],
      },
      {
        question: "Apa yang bisa terjadi jika AI tidak dikelola dengan bijak?",
        correct_answer: "Kehilangan pekerjaan akan meningkat",
        incorrect_answer: [
          "Pengembangan AI akan terhambat",
          "Teknologi AI akan menggantikan semua pekerjaan manusia",
          "Penggunaan AI akan terbatas hanya di bidang tertentu",
        ],
      },
      {
        question:
          "Bagaimana teknologi AI dapat berkontribusi pada kehidupan sehari-hari?",
        correct_answer: "Dengan membantu mempermudah tugas sehari-hari",
        incorrect_answer: [
          "Dengan menggantikan semua pekerjaan manusia",
          "Dengan membuat keputusan untuk manusia",
          "Dengan membatasi kebebasan manusia",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan pemerintah dalam menghadapi perkembangan AI?",
        correct_answer:
          "Membuat aturan yang jelas dan tegas untuk mengatur penggunaan AI",
        incorrect_answer: [
          "Membiarkan pasar teknologi berkembang tanpa pengawasan",
          "Membuat aturan yang mendukung perkembangan tanpa batas",
          "Menghentikan seluruh penelitian terkait AI",
        ],
      },
      {
        question:
          "Apa yang menjadi kebutuhan mendasar dalam memanfaatkan AI secara efektif?",
        correct_answer: "Memahami cara penggunaan AI yang baik dan benar",
        incorrect_answer: [
          "Menghindari penggunaan AI dalam kehidupan sehari-hari",
          "Memanfaatkan AI untuk mengontrol pekerjaan manusia",
          "Meningkatkan ketergantungan pada teknologi AI",
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
