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
        question: "Profesi apa yang dijalani ayah B.J. Habibie?",
        correct_answer: "Ahli Pertanian",
        incorrect_answer: ["Insinyur", "Dokter", "Pilot"],
      },
      {
        question: "Di universitas mana B.J. Habibie meraih gelar doktornya?",
        correct_answer:
          "Technische Hochschule Die Facultaet de Fuer Maschinenwesen Aachen",
        incorrect_answer: [
          "Universitas Indonesia",
          "ITB",
          "Rhein Westfalen Aachen Technische Hochschule",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari kalimat "Apakah cukup kecerdasan untuk meraih sukses? Ternyata tidak."?',
        correct_answer:
          "Kecerdasan saja tidak cukup, dibutuhkan juga usaha dan tekad yang kuat.",
        incorrect_answer: [
          "Kecerdasan tidak penting untuk meraih sukses.",
          "Hanya orang yang bodoh yang tidak sukses.",
          "Sukses hanya ditentukan oleh keberuntungan.",
        ],
      },
      {
        question: "Mengapa Habibie harus bekerja sambil kuliah di Jerman?",
        correct_answer: "Untuk membiayai kuliah dan kebutuhan hidupnya.",
        incorrect_answer: [
          "Karena ia malas belajar.",
          "Karena ia ingin cepat lulus.",
          "Karena ia ingin menambah pengalaman.",
        ],
      },
      {
        question: "Bagaimana peran keluarga dalam kesuksesan B.J. Habibie?",
        correct_answer: "Keluarga memberikan dukungan moral dan finansial.",
        incorrect_answer: [
          "Keluarga hanya menjadi beban.",
          "Keluarga tidak berperan penting.",
          "Keluarga selalu menghalangi cita-citanya.",
        ],
      },
      {
        question:
          "Apa yang dapat dipelajari dari perjuangan Habibie selama kuliah di Jerman?",
        correct_answer:
          "Usaha dan kerja keras yang gigih akan membuahkan hasil.",
        incorrect_answer: [
          "Tidak perlu bekerja keras untuk sukses.",
          "Menikah akan menghambat pencapaian prestasi.",
          "Sukses hanya bisa diraih dengan kecerdasan.",
        ],
      },
      {
        question:
          "Apakah nilai akademis yang tinggi menjamin kesuksesan seseorang?",
        correct_answer:
          "Tidak, nilai tinggi hanya salah satu faktor pendukung kesuksesan.",
        incorrect_answer: [
          "Ya, nilai tinggi selalu menjamin kesuksesan.",
          "Nilai tinggi tidak penting sama sekali.",
          "Hanya orang dengan nilai rendah yang sukses.",
        ],
      },
      {
        question:
          "Seberapa pentingkah peran tekad dan keuletan dalam mencapai kesuksesan, berdasarkan kisah B.J. Habibie?",
        correct_answer: "Sangat penting, terbukti dari perjuangan Habibie.",
        incorrect_answer: [
          "Tidak penting, hanya kecerdasan yang menentukan.",
          "Kurang penting, karena keberuntungan lebih berperan.",
          "Tekad dan keuletan tidak berpengaruh pada kesuksesan.",
        ],
      },
      {
        question:
          "Apa yang dapat kamu pelajari dari kisah hidup B.J. Habibie yang dapat diterapkan dalam kehidupanmu?",
        correct_answer:
          "Mengembangkan tekad dan keuletan dalam mencapai tujuan.",
        incorrect_answer: [
          "Tidak perlu belajar keras.",
          "Menyerah ketika menghadapi kesulitan.",
          "Mengabaikan keluarga demi mengejar cita-cita.",
        ],
      },
      {
        question:
          "Bagaimana kamu akan menerapkan nilai-nilai yang dipelajari dari kisah B.J. Habibie dalam mengejar cita-citamu?",
        correct_answer:
          "Dengan tekun belajar, berusaha keras, dan pantang menyerah.",
        incorrect_answer: [
          "Dengan selalu bergantung pada orang lain.",
          "Dengan malas-malasan.",
          "Dengan cara yang instan dan mudah.",
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
