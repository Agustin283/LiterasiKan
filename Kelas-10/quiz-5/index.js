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
        question: "Apa penyebab utama bunuh diri menurut data WHO?",
        correct_answer: "Masalah kesehatan mental",
        incorrect_answer: [
          "Penyakit fisik",
          "Ketidakpuasan pekerjaan",
          "Masalah keuangan",
        ],
      },
      {
        question: "Mengapa deteksi dini masalah kesehatan mental penting?",
        correct_answer: "Untuk mengurangi risiko bunuh diri",
        incorrect_answer: [
          "Agar orang tidak merasa cemas",
          "Untuk mencegah perkembangan penyakit fisik",
          "Agar masyarakat lebih bahagia",
        ],
      },
      {
        question:
          "Apa kesimpulan tentang peran psikolog dalam pencegahan bunuh diri?",
        correct_answer: "Mereka membantu individu mengatasi masalah emosional",
        incorrect_answer: [
          "Mereka hanya memberikan obat-obatan",
          "Mereka tidak memiliki peran penting",
          "Mereka hanya fokus pada anak-anak",
        ],
      },
      {
        question:
          "Mengapa dukungan sosial dianggap penting dalam pencegahan bunuh diri?",
        correct_answer: "Karena memberikan rasa aman dan dukungan",
        incorrect_answer: [
          "Karena membuat orang merasa lebih baik",
          "Karena mendorong perilaku negatif",
          "Karena meningkatkan kesetaraan",
        ],
      },
      {
        question: "Bagaimana terapi kognitif perilaku (CBT) membantu individu?",
        correct_answer: "Dengan mengubah pola pikir negatif",
        incorrect_answer: [
          "Dengan memberikan obat-obatan",
          "Dengan meningkatkan isolasi sosial",
          "Dengan mengabaikan masalah",
        ],
      },
      {
        question:
          "Apa dampak stigma terhadap pencarian bantuan untuk masalah kesehatan mental?",
        correct_answer: "Mengurangi kemungkinan seseorang mencari bantuan",
        incorrect_answer: [
          "Meningkatkan keinginan untuk mencari bantuan",
          "Tidak ada dampak yang sama sekali",
          "Mendorong orang untuk berbicara lebih terbuka",
        ],
      },
      {
        question:
          "Seberapa efektifkah pendekatan psikologi dalam pencegahan bunuh diri?",
        correct_answer: "Sangat efektif jika diterapkan dengan benar",
        incorrect_answer: [
          "Tidak efektif sama sekali",
          "Hanya efektif dalam konteks tertentu",
          "Efektif hanya untuk anak-anak",
        ],
      },
      {
        question:
          "Mengapa pendidikan tentang kesehatan mental penting bagi masyarakat?",
        correct_answer: "Untuk meningkatkan kesadaran dan mengurangi stigma",
        incorrect_answer: [
          "Agar orang tidak perlu mencari bantuan",
          "Agar semua orang merasa bahagia",
          "Untuk mendorong perilaku negatif",
        ],
      },
      {
        question:
          "Bagaimana Anda melihat peran Anda dalam mendukung kesehatan mental di komunitas Anda?",
        correct_answer:
          "Sangat penting untuk memberikan dukungan kepada orang lain",
        incorrect_answer: [
          "Tidak ada peran yang sama sekali",
          "Hanya perlu mengikuti tren baru",
          "Hanya penting bagi profesional kesehatan",
        ],
      },
      {
        question:
          "Apa langkah konkret yang bisa Anda ambil untuk mendukung individu yang berisiko melakukan bunuh diri?",
        correct_answer:
          "Memberikan dukungan emosional dan mendorong pencarian bantuan profesional",
        incorrect_answer: [
          "Memperbaiki masalah mereka",
          "Menghindari topik tersebut sama sekali",
          "Menyebarkan rumor tentang mereka",
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
