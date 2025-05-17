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
        question: "Siapa tokoh utama dalam cerita tentang kancil?",
        correct_answer: "Kancil",
        incorrect_answer: ["Buaya", "Raja hutan", "Ikan"],
      },
      {
        question:
          "Apa yang ingin dilakukan Kancil ketika ia bertemu dengan Buaya?",
        correct_answer: "Minum air dari sungai",
        incorrect_answer: [
          "Menjadi teman Buaya",
          "Menghitung jumlah hewan",
          "Menghindari Buaya",
        ],
      },
      {
        question:
          "Apa yang bisa kita simpulkan tentang kecerdikan Kancil dalam cerita ini?",
        correct_answer:
          "Kancil berhasil menyelamatkan dirinya dari Buaya dengan akalnya",
        incorrect_answer: [
          "Kancil tidak pintar",
          "Kancil tidak peduli pada bahaya",
          "Kancil takut pada semua hewan",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan mengenai hubungan antara kebersihan lingkungan dan kesehatan?",
        correct_answer:
          "Lingkungan yang bersih dapat mengurangi risiko terkena penyakit",
        incorrect_answer: [
          "Kebersihan lingkungan tidak berpengaruh pada kesehatan",
          "Kebersihan lingkungan hanya berpengaruh pada kenyamanan",
          "Hanya orang dewasa yang bertanggung jawab atas kebersihan lingkungan",
        ],
      },
      {
        question: "Mengapa Kancil memilih untuk menghitung di punggung Buaya?",
        correct_answer:
          "Karena Kancil ingin menipu Buaya agar bisa melarikan diri",
        incorrect_answer: [
          "Karena Kancil ingin bermain",
          "Karena Kancil ingin menunjukkan betapa kuatnya ia",
          "Karena Kancil ingin berteman dengan Buaya",
        ],
      },
      {
        question:
          "Apa penyebab utama banjir di Indonesia yang disebutkan dalam teks?",
        correct_answer: "Tumpukan sampah yang menyumbat saluran air",
        incorrect_answer: [
          "Banyaknya hujan",
          "Pembukaan lahan",
          "Perubahan iklim",
        ],
      },
      {
        question:
          "Apakah Anda setuju dengan tindakan Kancil yang menggunakan kecerdikannya untuk melarikan diri dari Buaya? Mengapa?",
        correct_answer:
          "Setuju, karena kecerdikan Kancil membantu menyelamatkan dirinya",
        incorrect_answer: [
          "Tidak setuju, karena Kancil harus menghadapi Buaya",
          "Setuju, tetapi Kancil seharusnya tidak berbohong",
          "Tidak setuju, karena Kancil seharusnya mencari bantuan",
        ],
      },
      {
        question:
          "Apa tindakan yang paling tepat untuk menjaga kebersihan lingkungan?",
        correct_answer:
          "Menanam lebih banyak pohon dan tidak membuang sampah sembarangan",
        incorrect_answer: [
          "Membuang sampah sembarangan",
          "Mengabaikan kebersihan lingkungan",
          "Mengandalkan pemerintah untuk mengatasi masalah sampah",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca cerita tentang Kancil dan Buaya?",
        correct_answer:
          "Belajar dari kecerdikan Kancil untuk menghadapi masalah",
        incorrect_answer: [
          "Tidak melakukan apa-apa",
          "Mengabaikan masalah lingkungan",
          "Mencari tahu lebih banyak tentang hewan lain",
        ],
      },
      {
        question:
          "Apa pesan moral yang dapat diambil dari cerita Kancil dan Buaya?",
        correct_answer:
          "Kecerdikan dapat membantu kita keluar dari situasi sulit",
        incorrect_answer: [
          "Selalu percaya pada orang lain",
          "Tidak ada yang perlu ditakuti",
          "Semua hewan berbahaya",
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
      const paket = localStorage.getItem("paket") || "3"; // Default '1' jika null

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
