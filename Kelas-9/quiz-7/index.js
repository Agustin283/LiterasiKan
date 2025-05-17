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
        question: 'Apa makna dari ungkapan "rajin pangkal pandai" dalam teks?',
        correct_answer: "Kerja keras adalah kunci untuk menjadi pintar",
        incorrect_answer: [
          "Hanya orang yang malas yang tidak pandai",
          "Belajar tidak penting jika memiliki bakat",
          "Kesuksesan datang tanpa usaha",
        ],
      },
      {
        question:
          'Apa yang menjadi fokus utama dalam teks "Rajin Pangkal Pandai"?',
        correct_answer: "Hubungan antara kerja keras dan kesuksesan",
        incorrect_answer: [
          "Pentingnya bermain dan bersenang-senang",
          "Cara menghindari belajar",
          "Pentingnya memiliki banyak teman",
        ],
      },
      {
        question:
          "Mengapa siswa yang rajin belajar lebih siap menghadapi ujian?",
        correct_answer: "Karena mereka telah mempersiapkan diri dengan baik",
        incorrect_answer: [
          "Karena mereka tidak perlu belajar sama sekali",
          "Karena mereka mengandalkan keberuntungan",
          "Karena mereka tidak peduli dengan hasilnya",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan tentang sikap siswa yang mengalami kesulitan dalam belajar?",
        correct_answer: "Mereka akan mencari solusi dan tetap berusaha",
        incorrect_answer: [
          "Mereka akan menyerah dan tidak berusaha",
          "Mereka tidak perlu belajar lebih banyak",
          "Mereka akan mengandalkan teman untuk membantu",
        ],
      },
      {
        question:
          "Apa yang menjadi dampak positif dari sikap rajin dalam belajar?",
        correct_answer: "Meningkatkan rasa tanggung jawab dan ketekunan",
        incorrect_answer: [
          "Mengurangi waktu bermain",
          "Menyebabkan stres dan tekanan",
          "Mengabaikan pelajaran lain",
        ],
      },
      {
        question:
          "Bagaimana penulis menggambarkan hubungan antara kerja keras dan potensi individu?",
        correct_answer: "Kerja keras dapat mengembangkan potensi yang ada",
        incorrect_answer: [
          "Potensi tidak ada hubungannya dengan kerja keras",
          "Hanya bakat yang menentukan kesuksesan",
          "Kerja keras hanya penting di sekolah",
        ],
      },
      {
        question:
          "Seberapa penting sikap rajin dalam mencapai kesuksesan menurut teks?",
        correct_answer:
          "Sangat penting, karena tanpa kerja keras, kesuksesan sulit dicapai",
        incorrect_answer: [
          "Tidak penting, karena kesuksesan bisa datang dengan sendirinya",
          "Hanya penting bagi siswa yang malas",
          "Penting hanya untuk pelajaran tertentu",
        ],
      },
      {
        question:
          'Apa yang dapat diambil sebagai pelajaran dari prinsip "rajin pangkal pandai"?',
        correct_answer:
          "Setiap usaha yang dilakukan dengan sungguh-sungguh akan membuahkan hasil",
        incorrect_answer: [
          "Kesuksesan hanya untuk orang-orang beruntung",
          "Belajar tidak perlu dilakukan setiap hari",
          "Hanya orang yang pandai yang perlu belajar",
        ],
      },
      {
        question:
          "Apa yang Anda rasakan tentang pentingnya kerja keras dalam mencapai impian?",
        correct_answer: "Sangat penting untuk meraih impian dan tujuan",
        incorrect_answer: [
          "Tidak penting sama sekali",
          "Hanya penting bagi orang dewasa",
          "Hanya penting dalam bidang akademis",
        ],
      },
      {
        question:
          'Bagaimana Anda dapat menerapkan prinsip "rajin pangkal pandai" dalam kehidupan sehari-hari?',
        correct_answer:
          "Dengan menetapkan tujuan dan bekerja keras untuk mencapainya",
        incorrect_answer: [
          "Dengan mengabaikan tanggung jawab",
          "Dengan hanya belajar saat ada ujian",
          "Dengan mengandalkan orang lain untuk sukses",
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
