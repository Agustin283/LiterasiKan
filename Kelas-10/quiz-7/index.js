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
        question: "Apa itu Internet of Things (IoT)?",
        correct_answer:
          "Jaringan perangkat fisik yang terhubung melalui internet",
        incorrect_answer: [
          "Sistem komputer yang tidak terhubung",
          "Hanya perangkat komunikasi",
          "Teknologi lama yang sudah tidak digunakan",
        ],
      },
      {
        question: "Apa manfaat utama dari rumah pintar yang menggunakan IoT?",
        correct_answer: "Memberikan kenyamanan dan efisiensi energi",
        incorrect_answer: [
          "Meningkatkan konsumsi energi",
          "Mengurangi penggunaan internet",
          "Menghilangkan kebutuhan akan listrik",
        ],
      },
      {
        question:
          "Apa kesimpulan tentang dampak perangkat wearable terhadap kesehatan?",
        correct_answer:
          "Mereka membantu menyatukan kesehatan secara real-time.",
        incorrect_answer: [
          "Mereka tidak memberikan manfaat nyata.",
          "Mereka hanya digunakan oleh atlet.",
          "Harganya mahal dan tidak terjangkau.",
        ],
      },
      {
        question:
          "Mengapa penting untuk melindungi data pribadi dalam konteks IoT?",
        correct_answer: "Untuk mencegah pencurian identitas dan enkripsi data.",
        incorrect_answer: [
          "Karena semua orang sudah aman.",
          "Karena data tidak penting.",
          "Agar bisa berbagi lebih banyak informasi.",
        ],
      },
      {
        question: "Apa dampak negatif dari ketergantungan pada teknologi IoT?",
        correct_answer: "Keterampilan dasar menjadi kurang diperhatikan.",
        incorrect_answer: [
          "Meningkatnya efisiensi kerja.",
          "Meningkatnya kreativitas.",
          "Tidak ada dampak negatif sama sekali.",
        ],
      },
      {
        question: "Bagaimana IoT membantu sektor pertanian?",
        correct_answer:
          "Dengan memantau kondisi tanah dan cuaca secara real-time.",
        incorrect_answer: [
          "Dengan meningkatkan penggunaan spesifik.",
          "Dengan mengurangi hasil panen.",
          "Dengan mengganti mesin dengan mesin sepenuhnya.",
        ],
      },
      {
        question:
          "Seberapa besar pengaruh positif IoT terhadap kualitas hidup manusia?",
        correct_answer: "Sangat besar; memberikan kenyamanan dan efisiensi.",
        incorrect_answer: [
          "Tidak signifikan; hanya digunakan oleh sedikit orang.",
          "Hanya penting dalam bidang industri.",
          "Hanya berpengaruh pada generasi tua saja.",
        ],
      },
      {
        question:
          "Apa tantangan utama yang dihadapi oleh pengguna perangkat IoT?",
        correct_answer: "Risiko pencurian data dan serangan siber.",
        incorrect_answer: [
          "Meningkatnya privasi individu.",
          "Tidak ada tantangan yang sama sekali.",
          "Meningkatnya keterampilan manual pengguna.",
        ],
      },
      {
        question:
          "Mengapa penting bagi masyarakat untuk memahami cara menggunakan teknologi IoT dengan bijaksana?",
        correct_answer:
          "Untuk memanfaatkan potensi penuh dari inovasi ini tanpa risiko.",
        incorrect_answer: [
          "Agar bisa menghindari penggunaan teknologi sama sekali.",
          "Karena semua orang harus belajar hal yang sama.",
          "Agar tidak perlu bekerja di masa depan.",
        ],
      },
      {
        question:
          "Apa langkah selanjutnya setelah memahami dampak positif dan negatif dari IoT?",
        correct_answer:
          "Menerapkan pengetahuan tersebut untuk penggunaan yang bijak.",
        incorrect_answer: [
          "Mengabaikan semua perkembangan teknologi.",
          "Hanya fokus pada dampak negatifnya saja.",
          "Berhenti menggunakan teknologi sama sekali.",
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
