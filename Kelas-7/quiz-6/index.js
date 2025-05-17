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
          'Apa yang diibaratkan sebagai "rumah kita" dalam teks tersebut?',
        correct_answer: "Planet Bumi.",
        incorrect_answer: [
          "Rumah tempat tinggal kita.",
          "Planet Mars.",
          "Suatu negara.",
        ],
      },
      {
        question:
          "Apa yang menyebabkan suhu Bumi terus meningkat menurut teks?",
        correct_answer: "Gas rumah kaca yang terperangkap di atmosfer.",
        incorrect_answer: [
          "Aktivitas gunung berapi.",
          "Perputaran Bumi yang melambat.",
          "Peningkatan jumlah penduduk dunia.",
        ],
      },
      {
        question:
          'Apa yang dapat disimpulkan dari kalimat "Bumi kita sekarang sedang mengalami perubahan iklim, seperti sedang demam tinggi"?',
        correct_answer: "Semua pernyataan di atas benar.",
        incorrect_answer: [
          "Bumi sedang sakit dan membutuhkan perawatan.",
          "Suhu Bumi meningkat secara signifikan.",
          "Perubahan iklim menyebabkan cuaca yang tidak menentu.",
        ],
      },
      {
        question:
          "Apa yang mungkin terjadi jika pencairan es di kutub terus berlanjut?",
        correct_answer:
          "Permukaan air laut akan naik dan mengancam daerah pantai.",
        incorrect_answer: [
          "Tidak akan ada dampak yang berarti.",
          "Suhu Bumi akan menurun.",
          "Hewan kutub akan lebih mudah berkembang biak.",
        ],
      },
      {
        question:
          "Bagaimana aktivitas manusia berkontribusi terhadap efek rumah kaca?",
        correct_answer:
          "Dengan menghasilkan gas-gas yang memerangkap panas di atmosfer.",
        incorrect_answer: [
          "Dengan menanam banyak pohon.",
          "Dengan mengurangi penggunaan kendaraan bermotor.",
          "Dengan mendaur ulang sampah.",
        ],
      },
      {
        question:
          "Mengapa menghemat energi dan air merupakan langkah penting dalam mengatasi perubahan iklim?",
        correct_answer:
          "Karena menghemat energi dan air dapat mengurangi emisi gas rumah kaca.",
        incorrect_answer: [
          "Karena energi dan air tidak penting.",
          "Karena menghemat energi dan air membuat kita lebih kaya.",
          "Karena menghemat energi dan air adalah tren terkini.",
        ],
      },
      {
        question:
          "Apakah upaya-upaya sederhana yang disebutkan dalam teks sudah cukup untuk mengatasi perubahan iklim secara menyeluruh?",
        correct_answer:
          "Tidak, diperlukan upaya yang lebih besar dan terintegrasi.",
        incorrect_answer: [
          "Ya, sudah cukup.",
          "Tidak perlu melakukan apa pun.",
          "Hanya efektif di negara maju.",
        ],
      },
      {
        question:
          "Seberapa efektifkah menanam pohon dalam mengurangi dampak perubahan iklim?",
        correct_answer:
          "Relatif efektif, tetapi membutuhkan waktu dan skala yang besar.",
        incorrect_answer: [
          "Tidak efektif sama sekali.",
          "Sangat efektif, karena pohon menyerap banyak karbon dioksida.",
          "Hanya efektif di daerah pedesaan.",
        ],
      },
      {
        question:
          "Apa yang dapat kamu lakukan di rumah untuk mengurangi emisi gas rumah kaca?",
        correct_answer: "Menghemat energi dan air, serta mendaur ulang sampah.",
        incorrect_answer: [
          "Menggunakan kendaraan pribadi setiap hari.",
          "Membuang sampah sembarangan.",
          "Menggunakan lampu sepanjang waktu.",
        ],
      },
      {
        question:
          "Apa komitmenmu setelah membaca teks ini untuk membantu mengatasi perubahan iklim?",
        correct_answer:
          "Akan berusaha menerapkan gaya hidup yang lebih ramah lingkungan.",
        incorrect_answer: [
          "Tidak akan melakukan apa pun.",
          "Akan terus melakukan aktivitas yang mencemari lingkungan.",
          "Akan menunggu pemerintah bertindak.",
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
