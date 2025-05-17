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
      [
        {
          question: "Apa fungsi utama kompas magnetik?",
          correct_answer: "Menentukan arah",
          incorrect_answer: [
            "Mengukur kecepatan angin",
            "Mencari sumber air",
            "Mengukur waktu perjalanan",
          ],
        },
        {
          question:
            "Apa yang menyebabkan jarum kompas selalu menunjuk ke utara dan selatan?",
          correct_answer: "Medan magnet bumi",
          incorrect_answer: [
            "Gravitasi bumi",
            "Gerakan angin",
            "Cahaya matahari",
          ],
        },
        {
          question: "Apa bahan utama yang digunakan pada jarum kompas?",
          correct_answer: "Magnet",
          incorrect_answer: ["Kayu", "Plastik", "Aluminium"],
        },
        {
          question:
            "Apa yang dimaksud dengan deklinasi dalam penggunaan kompas?",
          correct_answer:
            "Sudut antara arah utara geografis dan utara magnetik",
          incorrect_answer: [
            "Posisi kompas saat diletakkan di tanah",
            "Perbedaan antara utara dan selatan",
            "Sudut yang ditunjukkan oleh jarum kompas ke timur",
          ],
        },
        {
          question: "Mengapa kompas masih berguna meskipun sudah ada GPS?",
          correct_answer: "Karena tidak memerlukan daya listrik dan sinyal",
          incorrect_answer: [
            "Karena lebih modern daripada GPS",
            "Karena lebih akurat dibandingkan GPS",
            "Karena dapat digunakan untuk mengukur waktu",
          ],
        },
        {
          question: "Apa yang harus dilakukan sebelum menggunakan kompas?",
          correct_answer: "Menunggu jarumnya berhenti bergerak",
          incorrect_answer: [
            "Memiringkan kompas ke arah selatan",
            "Mengocok kompas agar jarumnya bergerak cepat",
            "Memastikan kompas terkena sinar matahari",
          ],
        },
        {
          question: "Apa perbedaan antara utara geografis dan utara magnetik?",
          correct_answer:
            "Utara geografis adalah titik pertemuan semua garis bujur, sedangkan utara magnetik adalah lokasi medan magnet paling kuat di utara",
          incorrect_answer: [
            "Utara geografis berada di pusat bumi, sedangkan utara magnetik di luar bumi",
            "Utara geografis adalah lokasi medan magnet bumi, sedangkan utara magnetik adalah kutub geografis bumi",
            "Utara geografis adalah tempat semua kompas menunjuk, sedangkan utara magnetik tidak",
          ],
        },
        {
          question: "Apa prinsip dasar yang membuat kompas bekerja?",
          correct_answer: "Prinsip medan magnet bumi",
          incorrect_answer: [
            "Prinsip gravitasi bumi",
            "Prinsip tekanan udara",
            "Prinsip gerak rotasi bumi",
          ],
        },
        {
          question: "Mengapa bagian jarum kompas biasanya berwarna merah?",
          correct_answer: "Untuk menandakan arah utara",
          incorrect_answer: [
            "Untuk menunjuk arah timur",
            "Untuk mempercepat gerakan jarum",
            "Untuk memperindah tampilan kompas",
          ],
        },
        {
          question: "Dalam situasi apa kompas lebih berguna dibandingkan GPS?",
          correct_answer:
            "Saat berada di tempat tanpa sinyal atau daya listrik",
          incorrect_answer: [
            "Saat berada di perkotaan",
            "Saat digunakan untuk perjalanan singkat",
            "Saat ingin mengetahui waktu",
          ],
        },
      ],
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
      const paket = localStorage.getItem("paket") || "4"; // Default '1' jika null

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
