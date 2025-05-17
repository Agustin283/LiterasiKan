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
        question: "Apa perbedaan utama antara etika dan moralitas?",
        correct_answer:
          "Etika adalah aturan sosial, moralitas adalah nilai-nilai pribadi",
        incorrect_answer: [
          "Etika adalah nilai-nilai pribadi, moralitas adalah aturan sosial",
          "Etika dan moralitas sama, tidak ada perbedaan",
          "Etika berkaitan dengan hukum, moralitas berkaitan dengan agama",
        ],
      },
      {
        question:
          "Contoh penerapan etika dalam interaksi sehari-hari di sekolah adalah",
        correct_answer: "Menghormati guru dan teman",
        incorrect_answer: [
          "Menyontek saat ujian",
          "Mengganggu teman sekelas",
          "Membolos sekolah",
        ],
      },
      {
        question:
          "Apa yang dapat disimpulkan tentang pentingnya etika dan moralitas bagi remaja?",
        correct_answer:
          "Sangat penting, karena dapat membantu remaja mengambil keputusan bijak dan bertanggung jawab",
        incorrect_answer: [
          "Tidak terlalu penting, karena remaja masih dalam tahap pencarian jati diri",
          "Hanya penting bagi remaja yang bermasalah",
          "Hanya penting bagi remaja yang beragama",
        ],
      },
      {
        question:
          "Berdasarkan teks, apa konsekuensi dari kurangnya pemahaman etika digital pada remaja?",
        correct_answer:
          "Dapat merugikan orang lain dan merusak reputasi diri sendiri",
        incorrect_answer: [
          "Tidak ada konsekuensi",
          "Dapat meningkatkan popularitas di media sosial",
          "Dapat membuat remaja lebih percaya diri",
        ],
      },
      {
        question:
          "Bagaimana hubungan antara kejujuran dan rasa percaya dalam sebuah komunitas?",
        correct_answer: "Kejujuran menciptakan rasa percaya",
        incorrect_answer: [
          "Tidak ada hubungan",
          "Kejujuran merusak rasa percaya",
          "Kejujuran hanya penting dalam keluarga",
        ],
      },
      {
        question:
          "Bagaimana cara terbaik untuk menanamkan pemahaman etika dan moralitas pada remaja?",
        correct_answer:
          "Melalui pendidikan formal di sekolah dan pengalaman sehari-hari",
        incorrect_answer: [
          "Melalui hukuman yang keras",
          "Melalui ceramah agama saja",
          "Dengan membiarkan remaja menemukan sendiri nilai-nilai tersebut",
        ],
      },
      {
        question:
          "Apa kelemahan utama dalam penggunaan media sosial oleh remaja terkait etika dan moralitas?",
        correct_answer:
          "Kurangnya kesadaran akan konsekuensi tindakan di dunia maya",
        incorrect_answer: [
          "Kurangnya pengawasan orang tua",
          "Terlalu banyak waktu luang",
          "Penggunaan media sosial yang berlebihan",
        ],
      },
      {
        question:
          "Bagaimana peran keluarga dalam membentuk etika dan moralitas remaja?",
        correct_answer:
          "Keluarga memberikan contoh dan pendidikan nilai-nilai moral",
        incorrect_answer: [
          "Keluarga tidak memiliki peran",
          "Keluarga hanya memberikan hukuman",
          "Keluarga hanya memberikan materi",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat menerapkan nilai-nilai etika dan moralitas dalam kehidupan sehari-hari?",
        correct_answer:
          "Dengan selalu jujur, menghormati orang lain, dan bertanggung jawab atas tindakan",
        incorrect_answer: [
          "Dengan selalu mengikuti keinginan sendiri",
          "Dengan tidak peduli pada orang lain",
          "Dengan selalu mengikuti tren",
        ],
      },
      {
        question:
          "Apa pentingnya menjadi generasi penerus yang bermartabat berdasarkan nilai-nilai etika dan moralitas?",
        correct_answer:
          "Penting untuk menciptakan masyarakat yang lebih baik dan adil",
        incorrect_answer: [
          "Tidak penting, yang penting sukses secara materi",
          "Penting untuk mendapatkan pekerjaan yang bergengsi",
          "Penting untuk mendapatkan pujian dari orang lain",
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
