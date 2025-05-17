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
        question: "Apa yang dimaksud dengan kesehatan mental menurut teks?",
        correct_answer: "Kemampuan mengelola stres dan bekerja produktif",
        incorrect_answer: [
          "Kondisi fisik yang sehat",
          "Aktivitas sosial yang aktif",
          "Kesehatan jasmani yang baik",
        ],
      },
      {
        question: "Mengapa kesehatan mental penting bagi remaja?",
        correct_answer: "Karena mereka mengalami berbagai perubahan",
        incorrect_answer: [
          "Karena tidak ada tekanan dari lingkungan",
          "Untuk menghindari gangguan fisik",
          "Agar bisa mendapatkan nilai tinggi di sekolah",
        ],
      },
      {
        question:
          "Apa yang dapat terjadi jika stres tidak dikelola dengan baik pada remaja?",
        correct_answer: "Mereka akan mengalami gangguan mental yang serius",
        incorrect_answer: [
          "Mereka akan lebih produktif",
          "Mereka akan lebih bahagia",
          "Mereka akan memiliki lebih banyak teman",
        ],
      },
      {
        question:
          "Apa simpulan yang dapat diambil mengenai aktivitas fisik dan kesehatan mental?",
        correct_answer:
          "Aktivitas fisik dapat membantu mengurangi stres dan kecemasan",
        incorrect_answer: [
          "Aktivitas fisik tidak berpengaruh pada kesehatan mental",
          "Hanya orang dewasa yang membutuhkan aktivitas fisik",
          "Remaja tidak perlu berolahraga",
        ],
      },
      {
        question:
          "Dari langkah-langkah menjaga kesehatan mental, mana yang paling berkaitan dengan pengelolaan emosi?",
        correct_answer: "Berbagi perasaan dengan orang terpercaya",
        incorrect_answer: [
          "Tidur yang cukup",
          "Mengonsumsi makanan bergizi",
          "Rutin berolah raga",
        ],
      },
      {
        question:
          "Mengapa penting bagi remaja untuk mengenali tanda-tanda awal gangguan mental?",
        correct_answer: "Supaya dapat mengelola stres sebelum menjadi serius",
        incorrect_answer: [
          "Agar bisa menghindari teman yang buruk",
          "Untuk menghindari interaksi sosial",
          "Agar dapat lebih fokus belajar",
        ],
      },
      {
        question:
          "Menurut teks, tindakan apa yang seharusnya diambil jika seseorang mengalami gangguan mental yang serius?",
        correct_answer: "Konsultasi dengan profesional",
        incorrect_answer: [
          "Berbicara dengan teman",
          "Mengabaikannya",
          "Menghabiskan waktu sendirian",
        ],
      },
      {
        question:
          "Apakah pola hidup sehat berkontribusi terhadap kesehatan mental?",
        correct_answer: "Ya, karena dapat membantu mengurangi gejala stres",
        incorrect_answer: [
          "Tidak, karena hanya penting untuk kesehatan fisik",
          "Hanya penting untuk menjaga berat badan",
          "Tidak ada hubungannya sama sekali",
        ],
      },
      {
        question: "Bagaimana cara Anda menjaga kesehatan mental Anda sendiri?",
        correct_answer: "Dengan terlibat dalam kegiatan positif",
        incorrect_answer: [
          "Dengan tidak peduli pada emosi",
          "Dengan menyendiri dan menghindari interaksi",
          "Dengan mengabaikan pola hidup sehat",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk meningkatkan kesadaran tentang pentingnya kesehatan mental di sekitar Anda?",
        correct_answer:
          "Membangun diskusi tentang kesehatan mental dengan teman dan keluarga",
        incorrect_answer: [
          "Menjaga informasi tersebut untuk diri sendiri",
          "Mengabaikan isu kesehatan mental",
          "Hanya berbicara kepada orang yang sudah tahu tentang kesehatan mental",
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
      const paket = localStorage.getItem("paket") || "5"; // Default '1' jika null

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
