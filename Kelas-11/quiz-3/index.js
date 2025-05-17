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
          "Manakah dari berikut yang TIDAK disebutkan sebagai contoh dampak kemajuan teknologi dalam teks?",
        correct_answer: "Perkembangan industri manufaktur",
        incorrect_answer: [
          "Peningkatan efisiensi dalam pekerjaan",
          "Kemudahan berkomunikasi dengan orang di seluruh dunia",
          "Peluang baru di bidang pendidikan, bisnis, dan hiburan",
        ],
      },
      {
        question:
          'Apa yang dimaksud dengan "memetakan genom manusia" dalam teks?',
        correct_answer: "Mengidentifikasi semua gen dalam tubuh manusia",
        incorrect_answer: [
          "Mengembangkan teknologi untuk mengkloning manusia",
          "Menciptakan obat baru untuk penyakit genetik",
          "Memprediksi masa depan manusia berdasarkan genetika",
        ],
      },
      {
        question:
          "Berdasarkan teks, apa yang dapat disimpulkan tentang peran sains modern dalam kemajuan teknologi?",
        correct_answer:
          "Sains modern berperan penting dalam mendorong kemajuan teknologi",
        incorrect_answer: [
          "Sains modern merupakan penghambat utama perkembangan teknologi",
          "Sains modern tidak memiliki peran penting dalam kemajuan teknologi",
          "Sains modern hanya berperan dalam bidang medis dan energi",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari pernyataan "penggunaan perangkat elektronik yang berlebihan dapat mengganggu keseimbangan antara dunia maya dan dunia nyata"?',
        correct_answer:
          "Penggunaan teknologi harus seimbang dengan aktivitas di dunia nyata",
        incorrect_answer: [
          "Teknologi memiliki dampak negatif yang lebih besar daripada positif",
          "Teknologi harus dihindari untuk menjaga keseimbangan hidup",
          "Generasi muda lebih rentan terhadap dampak negatif teknologi",
        ],
      },
      {
        question:
          "Bagaimana teks menganalisis dampak positif dan negatif dari kemajuan teknologi?",
        correct_answer:
          "Teks secara seimbang membahas dampak positif dan negatif teknologi",
        incorrect_answer: [
          "Teks hanya fokus pada dampak positif teknologi, mengabaikan sisi negatifnya",
          "Teks hanya fokus pada dampak negatif teknologi, mengabaikan sisi positifnya",
          "Teks tidak memberikan analisis yang jelas tentang dampak positif dan negatif teknologi",
        ],
      },
      {
        question:
          "Apa yang menjadi fokus utama dari paragraf ketiga dalam teks?",
        correct_answer: "Dampak negatif kecanduan teknologi",
        incorrect_answer: [
          "Peran teknologi dalam bidang energi",
          "Pentingnya menggunakan teknologi dengan bijak",
          "Tantangan yang dihadapi dalam memanfaatkan teknologi",
        ],
      },
      {
        question:
          "Apakah teks memberikan solusi yang memadai untuk mengatasi dampak negatif dari kecanduan teknologi?",
        correct_answer: "Ya, teks memberikan solusi yang cukup memadai",
        incorrect_answer: [
          "Ya, teks memberikan solusi yang lengkap dan praktis",
          "Tidak, teks hanya menyebutkan masalah tanpa solusi",
          "Tidak, teks hanya memberikan solusi yang umum dan tidak spesifik",
        ],
      },
      {
        question:
          "Bagaimana teks menilai pentingnya etika dalam penggunaan teknologi?",
        correct_answer:
          "Teks menganggap etika sangat penting untuk memaksimalkan manfaat teknologi",
        incorrect_answer: [
          "Teks menganggap etika tidak terlalu penting dalam penggunaan teknologi",
          "Teks tidak membahas pentingnya etika dalam penggunaan teknologi",
          "Teks hanya membahas etika secara umum tanpa memberikan contoh spesifik",
        ],
      },
      {
        question:
          "Apa yang dapat Anda refleksikan dari teks tentang peran teknologi dalam kehidupan manusia?",
        correct_answer:
          "Teknologi memiliki potensi besar untuk memperbaiki kehidupan manusia, tetapi juga memiliki risiko",
        incorrect_answer: [
          "Teknologi selalu membawa dampak positif bagi kehidupan manusia",
          "Teknologi hanya bermanfaat bagi orang-orang tertentu, bukan untuk semua orang",
          "Teknologi akan menggantikan peran manusia di masa depan",
        ],
      },
      {
        question:
          "Apa yang dapat Anda simpulkan dari teks tentang pentingnya kesadaran dalam memanfaatkan kemajuan teknologi?",
        correct_answer:
          "Kesadaran sangat penting untuk memaksimalkan manfaat dan meminimalkan dampak negatif teknologi",
        incorrect_answer: [
          "Kesadaran tidak terlalu penting dalam memanfaatkan kemajuan teknologi",
          "Kesadaran hanya dibutuhkan oleh orang-orang tertentu, bukan untuk semua orang",
          "Kesadaran tidak dapat mengubah dampak negatif dari teknologi",
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
