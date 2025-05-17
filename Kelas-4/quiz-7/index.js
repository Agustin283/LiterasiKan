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
      [
        {
          question: "Siapakah Raden Ajeng Kartini?",
          correct_answer:
            "Pahlawan nasional yang memperjuangkan hak perempuan.",
          incorrect_answer: [
            "Seorang penulis terkenal.",
            "Seorang raja di Jawa Tengah.",
            "Seorang guru di sekolah.",
          ],
        },
        {
          question: "Apa yang menjadi fokus utama perjuangan Kartini?",
          correct_answer: "Memperjuangkan hak-hak perempuan.",
          incorrect_answer: [
            "Memperjuangkan hak-hak laki-laki.",
            "Mendirikan sekolah untuk anak laki-laki.",
            "Menulis novel terkenal.",
          ],
        },
        {
          question:
            "Apa yang dapat disimpulkan tentang pandangan Kartini terhadap pendidikan perempuan?",
          correct_answer:
            "Kartini percaya bahwa perempuan berhak mendapatkan pendidikan yang sama dengan laki-laki.",
          incorrect_answer: [
            "Kartini tidak peduli dengan pendidikan perempuan.",
            "Kartini ingin perempuan hanya belajar di rumah.",
            "Kartini tidak percaya perempuan perlu Pendidikan.",
          ],
        },
        {
          question: "Mengapa surat-surat Kartini menjadi penting?",
          correct_answer:
            "Karena surat-suratnya mengandung pemikiran tentang pendidikan dan hak perempuan.",
          incorrect_answer: [
            "Karena surat-suratnya hanya ditujukan kepada teman-temannya.",
            "Karena surat-suratnya tidak pernah dibaca oleh orang lain.",
            "Karena surat-suratnya hanya berisi cerita-cerita biasa.",
          ],
        },
        {
          question:
            "Apa dampak dari perjuangan Kartini terhadap perempuan Indonesia?",
          correct_answer:
            "Perempuan Indonesia mendapatkan pendidikan dan kesempatan yang lebih baik.",
          incorrect_answer: [
            "Perempuan Indonesia tidak mendapatkan pendidikan.",
            "Perempuan Indonesia tidak berusaha untuk belajar.",
            "Perjuangan Kartini tidak berpengaruh sama sekali.",
          ],
        },
        {
          question: "Bagaimana cara Kartini menyebarluaskan pemikirannya?",
          correct_answer:
            "Dengan menulis surat kepada teman-temannya di Belanda.",
          incorrect_answer: [
            "Dengan berbicara di depan umum.",
            "Dengan mengajar di sekolah.",
            "Dengan membuat film.",
          ],
        },
        {
          question:
            "Apakah Anda setuju dengan perjuangan Kartini untuk hak-hak perempuan? Mengapa?",
          correct_answer:
            "Setuju, karena perempuan juga berhak mendapatkan pendidikan dan kesempatan.",
          incorrect_answer: [
            "Tidak setuju, karena perempuan sudah cukup berpendidikan.",
            "Setuju, tetapi hanya untuk perempuan dari kalangan bangsawan.",
            "Tidak setuju, karena pendidikan bukanlah hal yang penting.",
          ],
        },
        {
          question:
            "Apa yang harus kita lakukan untuk meneruskan perjuangan Kartini?",
          correct_answer:
            "Memperjuangkan hak-hak perempuan dan memberikan pendidikan yang layak.",
          incorrect_answer: [
            "Mengabaikan pendidikan perempuan.",
            "Hanya fokus pada pendidikan laki-laki.",
            "Tidak melakukan apa-apa.",
          ],
        },
        {
          question:
            "Apa yang Anda pelajari dari perjuangan Raden Ajeng Kartini?",
          correct_answer: "Perempuan harus terus berjuang untuk hak-haknya.",
          incorrect_answer: [
            "Pendidikan tidak penting bagi perempuan.",
            "Hanya laki-laki yang perlu pendidikan.",
            "Perjuangan tidak ada gunanya.",
          ],
        },
        {
          question: "Bagaimana cara Anda menghormati jasa-jasa Kartini?",
          correct_answer:
            "Belajar dan memperjuangkan kesetaraan hak untuk semua.",
          incorrect_answer: [
            "Mengabaikan perjuangan perempuan.",
            "Tidak melakukan apapun.",
            "Menganggap bahwa semua orang sudah setara.",
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
