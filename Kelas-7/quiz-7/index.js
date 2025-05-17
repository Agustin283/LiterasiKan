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
        question: "Apa yang dimaksud dengan disiplin menurut teks tersebut?",
        correct_answer:
          "Kemampuan untuk mengatur diri sendiri, menaati aturan, dan konsisten.",
        incorrect_answer: [
          "Kemampuan untuk selalu mengikuti perintah orang lain.",
          "Kemampuan untuk menghindari tanggung jawab.",
          "Kemampuan untuk selalu mendapatkan nilai bagus.",
        ],
      },
      {
        question: "Menurut teks, kapan sikap disiplin sebaiknya ditanamkan?",
        correct_answer: "Sejak dini.",
        incorrect_answer: [
          "Saat sudah dewasa.",
          "Saat sudah sukses.",
          "Saat menghadapi masalah.",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari kalimat "Disiplin bukanlah sebuah beban, melainkan sebuah alat untuk mencapai tujuan kita"?',
        correct_answer: "Disiplin itu mudah dilakukan.",
        incorrect_answer: [
          "Disiplin membantu kita mencapai tujuan.",
          "Disiplin itu tidak penting.",
          "Disiplin hanya untuk orang tertentu.",
        ],
      },
      {
        question:
          "Apa yang mungkin terjadi jika seseorang tidak memiliki rencana dan jadwal yang terstruktur?",
        correct_answer:
          "Ia akan sulit fokus dan konsisten dalam mencapai tujuan.",
        incorrect_answer: [
          "Ia akan lebih mudah sukses.",
          "Ia akan lebih mudah mencapai tujuan.",
          "Tidak akan ada dampak negatif.",
        ],
      },
      {
        question:
          "Bagaimana peran lingkungan sekitar dalam menumbuhkan sikap disiplin?",
        correct_answer: "Lingkungan memberikan dukungan dan motivasi.",
        incorrect_answer: [
          "Lingkungan tidak berpengaruh.",
          "Lingkungan hanya memberikan tekanan.",
          "Lingkungan selalu menghambat.",
        ],
      },
      {
        question:
          "Mengapa penting untuk memberikan penghargaan kepada diri sendiri setelah berhasil menjalankan disiplin?",
        correct_answer: "Untuk meningkatkan motivasi dan konsistensi.",
        incorrect_answer: [
          "Agar terlihat hebat di mata orang lain.",
          "Agar tidak merasa lelah.",
          "Agar selalu merasa puas diri.",
        ],
      },
      {
        question:
          "Apakah cukup hanya memahami pentingnya disiplin untuk menjadi orang yang disiplin?",
        correct_answer:
          "Tidak, dibutuhkan juga usaha dan komitmen untuk menjalankannya.",
        incorrect_answer: [
          "Ya, cukup hanya dengan memahami.",
          "Hanya perlu bagi orang tertentu.",
          "Tidak perlu memahami pentingnya disiplin.",
        ],
      },
      {
        question:
          "Seberapa penting konsistensi dalam menumbuhkan sikap disiplin?",
        correct_answer:
          "Sangat penting, karena konsistensi adalah kunci keberhasilan.",
        incorrect_answer: [
          "Tidak penting, cukup sekali-sekali saja.",
          "Hanya penting untuk hal-hal besar.",
          "Konsistensi tidak berpengaruh.",
        ],
      },
      {
        question:
          "Apa yang akan kamu lakukan untuk meningkatkan kedisiplinanmu dalam belajar?",
        correct_answer:
          "Akan membuat jadwal belajar yang terstruktur dan konsisten menjalankannya.",
        incorrect_answer: [
          "Tidak akan melakukan apa pun.",
          "Akan meminta orang lain untuk selalu mengingatkan.",
          "Akan selalu menunda pekerjaan.",
        ],
      },
      {
        question:
          "Bagaimana kamu akan menerapkan nilai disiplin dalam kehidupan sehari-harimu?",
        correct_answer:
          "Dengan mengatur waktu dan kegiatan secara terencana dan konsisten.",
        incorrect_answer: [
          "Dengan selalu mengikuti keinginan sesaat.",
          "Dengan selalu menunda pekerjaan.",
          "Dengan tidak peduli terhadap aturan.",
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
