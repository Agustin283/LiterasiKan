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
        question: "Mengapa kebersihan lingkungan sangat penting bagi manusia?",
        correct_answer:
          "Karena lingkungan yang bersih dapat mencegah berbagai penyakit dan menciptakan kenyamanan.",
        incorrect_answer: [
          "Karena lingkungan yang bersih membuat kita lebih kaya.",
          "Karena lingkungan yang bersih selalu terlihat lebih indah.",
          "Karena lingkungan yang bersih menarik perhatian orang-orang.",
        ],
      },
      {
        question:
          "Apa yang bisa terjadi jika kita tinggal di lingkungan yang kumuh dan dipenuhi sampah?",
        correct_answer: "Kita akan lebih rentan terhadap penyakit.",
        incorrect_answer: [
          "Kita akan merasa lebih bahagia.",
          "Kita akan lebih mudah bergaul dengan orang lain.",
          "Kita akan menjadi lebih produktif.",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan mengenai dampak kebersihan lingkungan terhadap kesehatan?",
        correct_answer:
          "Lingkungan yang bersih dapat mengurangi risiko terkena penyakit.",
        incorrect_answer: [
          "Kebersihan lingkungan tidak berpengaruh pada kesehatan.",
          "Lingkungan bersih hanya baik untuk kesehatan fisik.",
          "Kebersihan lingkungan hanya berpengaruh pada kenyamanan.",
        ],
      },
      {
        question:
          "Dari teks, apa yang dapat disimpulkan tentang hubungan antara kebersihan lingkungan dan kenyamanan?",
        correct_answer:
          "Kebersihan lingkungan sangat berpengaruh terhadap kenyamanan dan keindahan.",
        incorrect_answer: [
          "Lingkungan yang bersih tidak selalu nyaman.",
          "Kenyamanan tidak ada hubungannya dengan kebersihan.",
          "Lingkungan yang kotor bisa lebih nyaman daripada yang bersih.",
        ],
      },
      {
        question:
          "Mengapa tumpukan sampah dapat menyebabkan banjir di Indonesia?",
        correct_answer:
          "Karena sampah menyumbat saluran air, sehingga aliran air terhambat.",
        incorrect_answer: [
          "Karena sampah bisa menguap saat hujan.",
          "Karena sampah dapat menyerap air.",
          "Karena sampah akan dibawa pergi oleh angin.",
        ],
      },
      {
        question: "Apa fungsi tanaman yang disebutkan dalam teks?",
        correct_answer:
          "Sebagai penyaring debu, penyimpan air tanah, dan penyejuk.",
        incorrect_answer: [
          "Hanya sebagai hiasan.",
          "Hanya sebagai makanan hewan.",
          "Sebagai tempat tinggal serangga.",
        ],
      },
      {
        question:
          "Apakah Anda setuju bahwa menjaga kebersihan lingkungan adalah tanggung jawab setiap orang? Mengapa?",
        correct_answer:
          "Setuju, karena setiap orang memiliki peran dalam menciptakan lingkungan yang sehat dan nyaman.",
        incorrect_answer: [
          "Tidak setuju, karena itu tugas pemerintah saja.",
          "Setuju, tetapi hanya jika ada imbalan.",
          "Tidak setuju, karena terlalu merepotkan.",
        ],
      },
      {
        question:
          "Apa tindakan yang paling efektif untuk menjaga kebersihan lingkungan?",
        correct_answer:
          "Menggunakan tempat sampah dan tidak membuang sampah sembarangan.",
        incorrect_answer: [
          "Membuang sampah sembarangan.",
          "Mengabaikan kebersihan lingkungan.",
          "Membiarkan orang lain menjaga kebersihan.",
        ],
      },
      {
        question:
          "Apa yang akan Anda lakukan setelah membaca teks tentang kebersihan lingkungan?",
        correct_answer:
          "Menerapkan kebiasaan menjaga kebersihan dan tidak membuang sampah sembarangan.",
        incorrect_answer: [
          "Mengabaikan kebersihan lingkungan.",
          "Menunggu pemerintah untuk bertindak.",
          "Mengeluh tentang lingkungan yang kotor.",
        ],
      },
      {
        question:
          "Apa pesan moral yang bisa diambil dari teks ini tentang kebersihan lingkungan?",
        correct_answer:
          "Menjaga kebersihan lingkungan adalah tanggung jawab bersama untuk menciptakan kehidupan yang sehat dan nyaman.",
        incorrect_answer: [
          "Kebersihan lingkungan tidak penting.",
          "Kebersihan lingkungan hanya penting bagi pemerintah.",
          "Lingkungan yang kotor bisa tetap nyaman.",
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
