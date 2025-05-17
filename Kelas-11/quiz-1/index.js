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
        question: "Apa yang dimaksud dengan perubahan iklim?",
        correct_answer:
          "Peningkatan suhu rata-rata bumi akibat peningkatan gas rumah kaca",
        incorrect_answer: [
          "Perbedaan suhu antara siang dan malam",
          "Perubahan cuaca yang terjadi secara tiba-tiba",
          "Penurunan suhu rata-rata bumi akibat penipisan lapisan ozon",
        ],
      },
      {
        question: "Apa saja sumber utama emisi gas rumah kaca?",
        correct_answer:
          "Pembakaran bahan bakar fosil, deforestasi, dan aktivitas industri",
        incorrect_answer: [
          "Pembakaran kayu dan deforestasi",
          "Aktivitas vulkanik dan letusan gunung berapi",
          "Peningkatan populasi manusia dan konsumsi energi",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari pernyataan "Perubahan iklim bukan hanya masalah lingkungan, namun juga berdampak pada aspek sosial dan ekonomi"?',
        correct_answer:
          "Dampak perubahan iklim bersifat kompleks dan luas, melampaui aspek lingkungan",
        incorrect_answer: [
          "Perubahan iklim hanya berdampak pada negara-negara berkembang",
          "Aspek sosial dan ekonomi tidak terkait dengan perubahan iklim.",
          "Negara-negara maju tidak terpengaruh oleh perubahan iklim.",
        ],
      },
      {
        question:
          "Berdasarkan teks, apa yang dapat disimpulkan sebagai solusi untuk mengatasi perubahan iklim?",
        correct_answer:
          "Mengurangi penggunaan energi dan mengandalkan energi terbarukan",
        incorrect_answer: [
          "Membangun bendungan untuk menahan air laut yang naik",
          "Memindahkan penduduk ke daerah yang lebih tinggi",
          "Mencari planet baru untuk ditinggali",
        ],
      },
      {
        question:
          "Bagaimana hubungan antara pemanasan global dan perubahan iklim?",
        correct_answer:
          "Pemanasan global adalah penyebab utama perubahan iklim",
        incorrect_answer: [
          "Perubahan iklim adalah penyebab utama pemanasan global",
          "Pemanasan global dan perubahan iklim adalah dua fenomena yang tidak berhubungan",
          "Pemanasan global dan perubahan iklim adalah dua istilah yang sama",
        ],
      },
      {
        question:
          "Mengapa negara-negara berkembang yang bergantung pada sektor pertanian menghadapi tantangan besar akibat perubahan iklim?",
        correct_answer:
          "Karena pola cuaca yang tidak stabil dapat mengganggu panen dan produktivitas",
        incorrect_answer: [
          "Karena mereka tidak memiliki teknologi pertanian yang canggih",
          "Karena mereka tidak memiliki akses ke sumber daya air yang cukup",
          "Karena perubahan iklim menyebabkan penurunan kualitas tanah",
        ],
      },
      {
        question:
          "Menurut Anda, seberapa efektifkah upaya global dalam mengatasi perubahan iklim?",
        correct_answer:
          "Cukup efektif, namun masih banyak tantangan yang harus diatasi",
        incorrect_answer: [
          "Sangat efektif, karena banyak negara telah berkomitmen untuk mengurangi emisi gas rumah kaca",
          "Tidak efektif, karena belum ada tindakan nyata yang dilakukan oleh negara-negara",
          "Tidak dapat dievaluasi karena masih terlalu dini",
        ],
      },
      {
        question:
          "Apa kelemahan dari solusi yang ditawarkan dalam teks untuk mengatasi perubahan iklim?",
        correct_answer:
          "Solusi tersebut tidak cukup untuk mengatasi perubahan iklim secara keseluruhan",
        incorrect_answer: [
          "Solusi tersebut terlalu mahal dan sulit diterapkan",
          "Solusi tersebut hanya berfokus pada aspek lingkungan, tidak pada aspek sosial dan ekonomi",
          "Solusi tersebut hanya dapat diterapkan di negara-negara maju",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk mengurangi dampak perubahan iklim?",
        correct_answer: "Semua jawaban benar",
        incorrect_answer: [
          "Mengurangi penggunaan plastik sekali pakai",
          "Menghemat energi dan memilih transportasi ramah lingkungan",
          "Menanam pohon dan mendukung program reboisasi",
        ],
      },
      {
        question:
          "Apa pesan penting yang ingin disampaikan oleh teks tentang perubahan iklim?",
        correct_answer: "Semua jawaban benar",
        incorrect_answer: [
          "Perubahan iklim adalah masalah yang kompleks dan membutuhkan solusi kolektif",
          "Setiap orang memiliki peran penting dalam mengatasi perubahan iklim",
          "Kita harus bertindak sekarang untuk melindungi planet ini bagi generasi mendatang",
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
