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
          question:
            "Mengapa mencuci tangan dengan sabun lebih efektif daripada hanya menggunakan air?",
          correct_answer:
            "Karena sabun dapat memecah lapisan minyak tempat kuman menempel",
          incorrect_answer: [
            "Karena sabun memiliki aroma yang harum",
            "Karena air tidak bisa menghilangkan kotoran di tangan",
            "Karena sabun dapat mengurangi rasa lengket pada tangan",
          ],
        },
        {
          question: "Kapan waktu yang tepat untuk mencuci tangan?",
          correct_answer: "Setelah memegang hewan peliharaan",
          incorrect_answer: [
            "Sebelum tidur",
            "Setelah makan saja",
            "Sebelum dan sesudah mandi",
          ],
        },
        {
          question: "Apa manfaat utama mencuci tangan dengan sabun?",
          correct_answer: "Mencegah penyebaran penyakit",
          incorrect_answer: [
            "Membersihkan kotoran saja",
            "Membuat tangan lebih wangi",
            "Mengurangi kelembapan tangan",
          ],
        },
        {
          question:
            "Berapa lama waktu yang diperlukan untuk mencuci tangan dengan benar?",
          correct_answer: "20 detik",
          incorrect_answer: ["5 detik", "10 detik", "1 menit"],
        },
        {
          question: "Apa langkah pertama dalam mencuci tangan dengan benar?",
          correct_answer: "Membasahi tangan dengan air bersih",
          incorrect_answer: [
            "Menggosok kuku dengan sabun",
            "Mengeringkan tangan dengan tisu",
            "Menggosok telapak tangan",
          ],
        },
        {
          question:
            "Mengapa kuku dan ujung jari harus dibersihkan saat mencuci tangan?",
          correct_answer: "Karena kotoran sering menumpuk di bagian tersebut",
          incorrect_answer: [
            "Karena kuku mudah patah jika tidak dicuci",
            "Karena bagian itu sering terkena sabun",
            "Karena bagian itu jarang digunakan",
          ],
        },
        {
          question:
            "Penyakit apa yang dapat dicegah dengan mencuci tangan secara rutin?",
          correct_answer: "Infeksi saluran pernapasan dan diare",
          incorrect_answer: [
            "Sakit kepala",
            "Gangguan penglihatan",
            "Penyakit jantung",
          ],
        },
        {
          question:
            "Apa yang dianjurkan oleh Organisasi Kesehatan Dunia (WHO) terkait mencuci tangan?",
          correct_answer:
            "Membiasakan cuci tangan dengan sabun untuk mencegah penyakit menular",
          incorrect_answer: [
            "Mencuci tangan hanya setelah makan",
            "Mencuci tangan dengan air hangat setiap hari",
            "Menggunakan sabun tertentu untuk hasil terbaik",
          ],
        },
        {
          question: "Apa yang harus dilakukan setelah mencuci tangan?",
          correct_answer: "Mengeringkan tangan dengan handuk atau tisu bersih",
          incorrect_answer: [
            "Membiarkan tangan basah hingga kering sendiri",
            "Menggosok tangan dengan kain apapun yang tersedia",
            "Menggunakan pelembap untuk tangan",
          ],
        },
        {
          question:
            "Apa manfaat dari mencuci tangan secara rutin untuk orang-orang di sekitar kita?",
          correct_answer: "Melindungi mereka dari ancaman penyakit menular",
          incorrect_answer: [
            "Membuat lingkungan lebih bersih",
            "Mengurangi jumlah penggunaan sabun di rumah",
            "Membantu menjaga kebersihan tempat umum",
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
