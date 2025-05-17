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
          "Apa yang menjadi fokus utama dalam proses pengembangan diri bagi remaja menurut teks?",
        correct_answer: "Meningkatkan keterampilan dan mengenali potensi",
        incorrect_answer: [
          "Menemukan teman baru",
          "Menghabiskan waktu di media sosial",
          "Mencari pekerjaan sambilan",
        ],
      },
      {
        question:
          "Mengapa penting untuk menetapkan tujuan dalam pengembangan diri?",
        correct_answer: "Untuk memberikan arah dan fokus dalam kehidupan",
        incorrect_answer: [
          "Agar terlihat lebih pintar di depan teman",
          "Supaya bisa menghindari tugas sekolah",
          "Agar bisa mendapatkan pujian dari orang tua",
        ],
      },
      {
        question:
          "Apa kesimpulan yang bisa diambil mengenai kelemahan pribadi menurut teks?",
        correct_answer:
          "Kelemahan merupakan tantangan yang bisa memotivasi untuk belajar",
        incorrect_answer: [
          "Kelemahan tidak perlu dihiraukan",
          "Kelemahan selalu menjadi penghalang kesuksesan",
          "Kelemahan dapat diabaikan jika kita memiliki banyak kelebihan",
        ],
      },
      {
        question:
          "Dari teks, apa yang bisa disimpulkan tentang pengalaman baru?",
        correct_answer:
          "Setiap pengalaman, baik atau buruk, adalah pelajaran berharga",
        incorrect_answer: [
          "Pengalaman baru tidak penting dalam pengembangan diri",
          "Hanya pengalaman positif yang berguna",
          "Pengalaman baru harus dihindari untuk menjaga kenyamanan",
        ],
      },
      {
        question:
          "Apa yang bisa diidentifikasi sebagai kunci untuk menjaga keseimbangan dalam pengembangan diri?",
        correct_answer: "Manajemen waktu yang baik",
        incorrect_answer: [
          "Mengabaikan hobi",
          "Menghabiskan waktu di sekolah saja",
          "Fokus hanya pada akademik",
        ],
      },
      {
        question:
          "Dalam konteks pengembangan diri, bagaimana interaksi sosial dapat berkontribusi?",
        correct_answer: "Memperluas wawasan dan memberikan dukungan emosional",
        incorrect_answer: [
          "Membuat siswa lebih tergantung pada orang lain",
          "Menghambat pengembangan keterampilan individu",
          "Hanya penting untuk bersenang-senang",
        ],
      },
      {
        question:
          "Bagaimana cara yang tepat untuk mengelola waktu menurut teks?",
        correct_answer: "Membuat jadwal harian dan memprioritaskan tugas",
        incorrect_answer: [
          "Mengabaikan semua tugas dan fokus pada hobi",
          "Menunggu hingga tugas mendekati deadline",
          "Menghabiskan waktu di media sosial",
        ],
      },
      {
        question:
          "Apa yang membuat pengembangan diri bukanlah proses yang instan?",
        correct_answer: "Memerlukan konsistensi dan ketekunan",
        incorrect_answer: [
          "Membutuhkan bantuan orang lain",
          "Selalu ada rintangan yang harus dihadapi",
          "Hanya bisa dilakukan di sekolah",
        ],
      },
      {
        question:
          "Mengapa penting bagi seseorang untuk mengenali kekuatan dan kelemahan diri?",
        correct_answer: "Untuk mencapai tujuan dan terus belajar",
        incorrect_answer: [
          "Agar bisa bersaing dengan orang lain",
          "Supaya bisa menghindari tantangan",
          "Hanya untuk mendapatkan pengakuan dari orang lain",
        ],
      },
      {
        question:
          "Apa yang bisa dilakukan siswa untuk menemukan potensi yang tersembunyi?",
        correct_answer: "Mencoba hal-hal baru dan berani menghadapi tantangan",
        incorrect_answer: [
          "Tetap berada dalam zona nyaman",
          "Menghindari kegagalan",
          "Mengandalkan orang lain",
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
