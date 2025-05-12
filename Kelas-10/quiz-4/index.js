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
        question: "Apa yang dimaksud dengan kesehatan mental?",
        correct_answer:
          "Kesehatan jiwa yang memungkinkan seseorang untuk menghadapi tantangan hidup",
        incorrect_answer: [
          "Kesehatan tubuh yang baik",
          "Kesehatan yang bebas dari penyakit",
          "Kesehatan yang diukur dengan pemeriksaan medis",
        ],
      },
      {
        question: "Mengapa kesehatan mental penting?",
        correct_answer:
          "Karena mempengaruhi hubungan dan kemampuan mencapai tujuan hidup",
        incorrect_answer: [
          "Karena mempengaruhi penampilan fisik",
          "Karena bisa disembuhkan dengan obat-obatan",
          "Karena bisa meningkatkan kemampuan intelektual",
        ],
      },
      {
        question:
          "Apa yang sering dialami oleh banyak orang terkait dengan kesehatan mental?",
        correct_answer: "Stres, depresi, dan kecemasan",
        incorrect_answer: [
          "Kelelahan fisik dan nyeri tubuh",
          "Penurunan nafsu makan",
          "Ketegangan otot",
        ],
      },
      {
        question:
          "Faktor apa yang sering menyebabkan masalah kesehatan mental pada remaja?",
        correct_answer: "Pola hidup tidak sehat",
        incorrect_answer: [
          "Makanan yang tidak bergizi",
          "Waktu tidur yang cukup",
          "Kegiatan sosial yang banyak",
        ],
      },
      {
        question: "Apa yang dapat memperburuk kesehatan mental seseorang?",
        correct_answer: "Trauma masa lalu dan masalah hubungan",
        incorrect_answer: [
          "Olahraga yang rutin",
          "Tidur yang cukup",
          "Melakukan meditasi secara teratur",
        ],
      },
      {
        question:
          "Bagaimana stres, depresi, dan kecemasan mempengaruhi kehidupan seseorang?",
        correct_answer: "Mengganggu kemampuan untuk menghadapi tantangan hidup",
        incorrect_answer: [
          "Meningkatkan produktivitas",
          "Meningkatkan hubungan sosial",
          "Menurunkan kebutuhan tidur",
        ],
      },
      {
        question:
          "Apa saja yang dapat membantu dalam menjaga kesehatan mental?",
        correct_answer: "Olahraga, meditasi, dan waktu di alam",
        incorrect_answer: [
          "Menonton TV sepanjang hari",
          "Makan makanan tinggi gula",
          "Menghindari pertemuan dengan orang lain",
        ],
      },
      {
        question:
          "Apa yang sebaiknya dilakukan jika masalah mental mengganggu?",
        correct_answer: "Mencari dukungan dari ahli psikologi",
        incorrect_answer: [
          "Menghindari stres dengan tidur lebih banyak",
          "Mengabaikan masalah tersebut",
          "Menjalani pola hidup tidak sehat",
        ],
      },
      {
        question: "Apa dampak dari menjaga kesehatan mental?",
        correct_answer: "Hidup yang lebih bahagia dan produktif",
        incorrect_answer: [
          "Mengurangi kemampuan untuk berinteraksi sosial",
          "Meningkatkan kecemasan",
          "Menurunkan kemampuan fisik",
        ],
      },
      {
        question: "Mengapa penting untuk memperhatikan kesehatan mental?",
        correct_answer: "Agar bisa lebih produktif dan bahagia dalam hidup",
        incorrect_answer: [
          "Agar lebih mudah mencapai tujuan fisik",
          "Agar bisa bekerja lebih lama tanpa istirahat",
          "Agar tidak terlalu bergantung pada obat-obatan",
        ],
      },
      {
        question:
          "Apa hubungan antara kesehatan mental yang baik dan hubungan sosial?",
        correct_answer:
          "Kesehatan mental yang buruk dapat memperburuk hubungan sosial",
        incorrect_answer: [
          "Kesehatan mental tidak ada kaitannya dengan hubungan sosial",
          "Kesehatan mental yang baik hanya berpengaruh pada pekerjaan",
          "Kesehatan mental yang baik memperburuk hubungan dengan orang lain",
        ],
      },
      {
        question:
          "Apa yang bisa menjadi penyebab kesehatan mental terganggu selain pola hidup tidak sehat?",
        correct_answer: "Tekanan pekerjaan",
        incorrect_answer: [
          "Olahraga yang berlebihan",
          "Waktu tidur yang cukup",
          "Menghabiskan waktu dengan keluarga",
        ],
      },
      {
        question:
          "Apa yang sebaiknya dilakukan untuk menghindari masalah kesehatan mental?",
        correct_answer:
          "Menjaga pola hidup sehat, termasuk olahraga dan meditasi",
        incorrect_answer: [
          "Fokus pada pekerjaan tanpa istirahat",
          "Mengabaikan masalah yang ada",
          "Menghindari berinteraksi dengan orang lain",
        ],
      },
      {
        question: "Bagaimana olahraga dapat membantu menjaga kesehatan mental?",
        correct_answer:
          "Membantu melepaskan stres dan meningkatkan suasana hati",
        incorrect_answer: [
          "Meningkatkan kecemasan dan stres",
          "Meningkatkan rasa cemas",
          "Menyebabkan kelelahan mental",
        ],
      },
      {
        question: 'Apa yang dimaksud dengan "dukungan dari ahli psikologi"?',
        correct_answer:
          "Mencari bantuan dari profesional untuk menangani masalah mental",
        incorrect_answer: [
          "Membaca buku psikologi",
          "Berbicara dengan teman tentang masalah mental",
          "Mengikuti kursus psikologi",
        ],
      },
      {
        question:
          "Apa yang dapat memperburuk masalah kesehatan mental pada seseorang?",
        correct_answer: "Tekanan pekerjaan dan masalah hubungan",
        incorrect_answer: [
          "Menghindari pekerjaan",
          "Tidur yang cukup",
          "Melakukan aktivitas di alam",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan meditasi dalam konteks kesehatan mental?",
        correct_answer:
          "Proses merenung dan menenangkan pikiran untuk mengurangi stres",
        incorrect_answer: [
          "Tidur siang yang panjang",
          "Berolahraga secara intens",
          "Menghindari interaksi sosial",
        ],
      },
      {
        question:
          "Mengapa remaja lebih rentan terhadap masalah kesehatan mental?",
        correct_answer:
          "Karena mereka sering terpapar media sosial dan tekanan teman sebaya",
        incorrect_answer: [
          "Karena mereka lebih banyak berolahraga",
          "Karena mereka lebih banyak tidur",
          "Karena mereka tidak memiliki masalah mental",
        ],
      },
      {
        question:
          "Apa yang dapat membantu seseorang yang sedang mengalami kecemasan?",
        correct_answer:
          "Mencari dukungan dari ahli psikologi dan melakukan meditasi",
        incorrect_answer: [
          "Menghindari semua interaksi sosial",
          "Menghabiskan waktu sendirian tanpa aktivitas",
          "Mengabaikan perasaan kecemasan tersebut",
        ],
      },
      {
        question:
          "Bagaimana menjaga kesehatan mental dapat mempengaruhi produktivitas?",
        correct_answer:
          "Dengan menjaga kesehatan mental, seseorang bisa lebih fokus dan produktif",
        incorrect_answer: [
          "Dengan mengabaikan perasaan dan fokus pada pekerjaan",
          "Dengan menambah jam kerja",
          "Dengan beristirahat sepanjang hari",
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
