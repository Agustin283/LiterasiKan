document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const loader = document.getElementById("loader");
  const choices = document.querySelectorAll(".choices button");
  const scoreText = document.getElementById("scoreText");
  const timerText = document.getElementById("timerText"); // Tambahkan elemen untuk timer
  const questionCounterText = document.getElementById("questionCounterText"); // Tambahkan elemen untuk counter

  const CORRECT_BONUS = 10;
  const MAX_QUESTIONS = 10;

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
        question: "Apa yang dimaksud dengan longsor dalam teks?",
        correct_answer:
          "Pergerakan tanah, batu, dan material lainnya turun dari tempat yang tinggi.",
        incorrect_answer: [
          "Pergerakan udara yang cepat.",
          "Hujan lebat yang terus-menerus.",
          "Proses penanaman pohon di tanah.",
        ],
      },
      {
        question: "Di mana longsor biasanya terjadi?",
        correct_answer: "Di daerah pegunungan atau perbukitan.",
        incorrect_answer: [
          "Di dataran rendah.",
          "Di pantai.",
          "Di tengah kota.",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan tentang faktor penyebab longsor berdasarkan teks?",
        correct_answer:
          "Longsor dapat disebabkan oleh beberapa faktor termasuk hujan, penggunaan lahan yang tidak tepat, dan gempa bumi.",
        incorrect_answer: [
          "Longsor hanya disebabkan oleh hujan.",
          "Longsor tidak dipengaruhi oleh tindakan manusia.",
          "Longsor hanya terjadi di daerah pegunungan.",
        ],
      },
      {
        question:
          "Apa kesimpulan yang dapat diambil tentang tindakan pencegahan longsor?",
        correct_answer:
          "Kerja sama antara masyarakat, pemerintah, dan swasta sangat penting untuk mengurangi risiko longsor.",
        incorrect_answer: [
          "Tindakan pencegahan tidak diperlukan.",
          "Hanya pemerintah yang bertanggung jawab atas pencegahan longsor.",
          "Menanam pohon tidak ada hubungannya dengan pencegahan longsor.",
        ],
      },
      {
        question:
          "Mengapa sistem peringatan dini penting dalam pencegahan longsor?",
        correct_answer:
          "Untuk membantu masyarakat mengetahui kapan harus mengungsi dan menyelamatkan nyawa.",
        incorrect_answer: [
          "Untuk mengingatkan orang tentang cuaca.",
          "Untuk memperbaiki jalan yang rusak.",
          "Untuk meningkatkan jumlah pohon di daerah tersebut.",
        ],
      },
      {
        question: "Apa akibat dari longsor yang disebutkan dalam teks?",
        correct_answer:
          "Kerusakan bangunan, jalan, dan lahan pertanian, serta akses transportasi terputus.",
        incorrect_answer: [
          "Meningkatnya populasi hewan.",
          "Penurunan tingkat kebisingan.",
          "Peningkatan kualitas udara.",
        ],
      },
      {
        question:
          "Apakah Anda setuju bahwa masyarakat harus peduli terhadap lingkungan untuk mencegah longsor? Mengapa?",
        correct_answer:
          "Setuju, karena menjaga lingkungan dengan menanam pohon dapat mengurangi risiko longsor.",
        incorrect_answer: [
          "Tidak setuju, karena longsor tidak dapat dicegah.",
          "Setuju, tetapi hanya jika ada bencana lain yang terjadi.",
          "Tidak setuju, karena hanya pemerintah yang bertanggung jawab.",
        ],
      },
      {
        question:
          "Mana yang merupakan langkah pencegahan yang tepat untuk menghindari longsor?",
        correct_answer:
          "Menghindari penebangan pohon secara liar dan melakukan reboisasi.",
        incorrect_answer: [
          "Mengabaikan kondisi cuaca.",
          "Membangun di daerah rawan longsor.",
          "Menunggu hingga terjadi longsor baru mengambil tindakan.",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca teks tentang longsor?",
        correct_answer:
          "Mempelajari lebih lanjut tentang pencegahan longsor dan menjaga lingkungan.",
        incorrect_answer: [
          "Mengabaikan informasi dan tidak melakukan apa-apa.",
          "Menganggap longsor tidak berbahaya.",
          "Tidak peduli dengan lingkungan.",
        ],
      },
      {
        question:
          "Apa pesan moral yang dapat diambil dari teks ini mengenai longsor?",
        correct_answer:
          "Kita harus selalu waspada dan menjaga lingkungan untuk mencegah bencana longsor.",
        incorrect_answer: [
          "Longsor adalah hal yang wajar dan tidak perlu dipikirkan.",
          "Hanya pemerintah yang bertanggung jawab atas bencana alam.",
          "Longsor tidak mempengaruhi kehidupan kita.",
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
