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
          "Apa yang menjadi inti dari perubahan nilai keluarga di era modern?",
        correct_answer: "Perubahan pola komunikasi dan peran dalam keluarga",
        incorrect_answer: [
          "Hilangnya semua nilai tradisional",
          "Meningkatnya penghormatan terhadap orang tua",
          "Keluarga sepenuhnya menolak modernisasi",
        ],
      },
      {
        question:
          "Berdasarkan bacaan, apa salah satu nilai dalam keluarga tradisional?",
        correct_answer: "Kebersamaan dan penghormatan terhadap orang tua",
        incorrect_answer: [
          "Individualisme dalam keluarga",
          "Komunikasi melalui media sosial",
          "Persaingan antaranggota keluarga",
        ],
      },
      {
        question:
          "Mengapa teknologi disebut sebagai salah satu faktor perubahan nilai keluarga?",
        correct_answer:
          "Karena teknologi mengurangi interaksi langsung antaranggota keluarga",
        incorrect_answer: [
          "Karena teknologi memperkuat tradisi",
          "Karena teknologi meningkatkan jumlah anak dalam keluarga",
          "Karena teknologi membantu mendekatkan seluruh anggota keluarga",
        ],
      },
      {
        question: "Apa dampak negatif utama dari keluarga modern?",
        correct_answer:
          "Meningkatnya individualisme dan berkurangnya kedekatan emosional",
        incorrect_answer: [
          "Meningkatnya kesetaraan gender",
          "Berkurangnya tuntutan ekonomi",
          "Peran ibu menjadi lebih kuat",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan fleksibilitas dalam keluarga modern?",
        correct_answer: "Peran anggota keluarga lebih dinamis dan tidak kaku",
        incorrect_answer: [
          "Peran ayah dan ibu tetap seperti keluarga tradisional",
          "Teknologi jarang digunakan dalam komunikasi keluarga",
          "Anak-anak lebih menghormati tradisi",
        ],
      },
      {
        question:
          "Berdasarkan bacaan, bagaimana modernisasi memengaruhi peran perempuan?",
        correct_answer: "Perempuan memiliki lebih banyak kesempatan berkarier",
        incorrect_answer: [
          "Perempuan semakin fokus pada rumah tangga",
          "Perempuan kehilangan peran penting di keluarga",
          "Perempuan lebih bergantung pada teknologi",
        ],
      },
      {
        question:
          "Apa kritik utama penulis terhadap modernisasi dalam keluarga?",
        correct_answer:
          "Modernisasi mengurangi kebersamaan dan kedekatan emosional",
        incorrect_answer: [
          "Modernisasi sepenuhnya menghapus nilai-nilai positif keluarga",
          "Modernisasi mendorong penghormatan pada tradisi",
          "Modernisasi membantu meningkatkan interaksi langsung",
        ],
      },
      {
        question:
          "Bagaimana solusi yang ditawarkan penulis untuk menyikapi perubahan nilai keluarga?",
        correct_answer:
          "Menemukan keseimbangan antara nilai tradisional dan modernisasi",
        incorrect_answer: [
          "Menghapus teknologi dalam keluarga",
          "Menolak semua bentuk modernisasi",
          "Membatasi kesetaraan peran antara ayah dan ibu",
        ],
      },
      {
        question:
          "Apa langkah pertama yang bisa dilakukan keluarga untuk menjaga nilai tradisional?",
        correct_answer:
          "Membatasi waktu menggunakan teknologi dan melakukan kegiatan bersama",
        incorrect_answer: [
          "Menghindari modernisasi sepenuhnya",
          "Memperbanyak aktivitas individu",
          "Mengurangi komunikasi antar anggota keluarga",
        ],
      },
      {
        question:
          "Jika nilai tradisional terus ditinggalkan, apa risiko yang dihadapi keluarga?",
        correct_answer: "Nilai moral dan identitas budaya akan tergerus",
        incorrect_answer: [
          "Keluarga menjadi lebih harmonis",
          "Keluarga semakin kuat dan kompak",
          "Anggota keluarga akan lebih menghargai waktu bersama",
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
