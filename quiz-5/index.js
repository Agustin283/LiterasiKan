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
        question: "Apa yang dimaksud dengan pendidikan karakter dalam teks?",
        correct_answer:
          "Pendidikan yang menanamkan nilai moral dan sikap positif",
        incorrect_answer: [
          "Pendidikan yang mengutamakan kecerdasan",
          "Pendidikan yang hanya mengajarkan keterampilan praktis",
          "Pendidikan yang fokus pada pengajaran akademik",
        ],
      },
      {
        question: "Mengapa pendidikan karakter penting bagi pribadi seseorang?",
        correct_answer:
          "Untuk membantu dalam adaptasi, hubungan sehat, dan kesuksesan",
        incorrect_answer: [
          "Agar menjadi pintar",
          "Untuk mempelajari hal-hal baru",
          "Agar dapat mengikuti tren masa kini",
        ],
      },
      {
        question: "Di mana pendidikan karakter wajib diajarkan?",
        correct_answer: "Di keluarga dan masyarakat luas",
        incorrect_answer: [
          "Hanya di sekolah",
          "Hanya di masyarakat",
          "Di tempat kerja",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan nilai-nilai seperti jujur, tanggung jawab, dan gotong royong dalam pendidikan karakter?",
        correct_answer:
          "Nilai-nilai moral yang perlu diterapkan dalam kehidupan sehari-hari",
        incorrect_answer: [
          "Nilai-nilai untuk mencapai kesuksesan",
          "Nilai-nilai untuk meningkatkan kecerdasan",
          "Nilai-nilai untuk menghadapi ujian di sekolah",
        ],
      },
      {
        question:
          "Apa tantangan yang dihadapi dalam pendidikan karakter bagi remaja?",
        correct_answer:
          "Pengaruh buruk dari pergaulan remaja dan teman-temannya",
        incorrect_answer: [
          "Persaingan akademik",
          "Kurangnya fasilitas pendidikan",
          "Keterbatasan waktu untuk belajar",
        ],
      },
      {
        question:
          "Bagaimana cara remaja bijak dalam memilih teman menurut teks?",
        correct_answer: "Dengan mempertimbangkan norma agama dan hukum",
        incorrect_answer: [
          "Dengan mengikuti tren teman-temannya",
          "Dengan selalu menyenangkan hati teman",
          "Dengan menilai teman berdasarkan popularitasnya",
        ],
      },
      {
        question: "Apa manfaat pendidikan karakter bagi remaja?",
        correct_answer:
          "Membantu remaja berpikir panjang dan matang serta memahami dampak tindakan",
        incorrect_answer: [
          "Membantu remaja mencapai tujuan akademik",
          "Membantu remaja lebih populer di kalangan teman",
          "Membantu remaja meniru tindakan orang dewasa",
        ],
      },
      {
        question:
          "Apa yang dapat dilakukan pendidikan karakter untuk mencegah masalah sosial?",
        correct_answer:
          "Mencegah remaja dari tindakan yang merugikan diri dan orang lain",
        incorrect_answer: [
          "Membantu remaja menghindari ujian",
          "Membantu remaja menghindari pergaulan sosial",
          "Mengurangi beban pekerjaan di sekolah",
        ],
      },
      {
        question:
          "Apa tujuan utama dari menerapkan pendidikan karakter di semua aspek kehidupan?",
        correct_answer:
          "Untuk menciptakan individu yang bijak dan bertanggung jawab",
        incorrect_answer: [
          "Agar remaja bisa lebih pintar",
          "Agar remaja bisa bekerja lebih keras",
          "Agar remaja bisa menjadi lebih populer",
        ],
      },
      {
        question:
          "Bagaimana pendidikan karakter mempengaruhi kesuksesan seseorang?",
        correct_answer:
          "Membantu individu memiliki sikap positif yang mendukung kesuksesan",
        incorrect_answer: [
          "Membantu meningkatkan nilai akademik",
          "Membantu meningkatkan kemampuan berolahraga",
          "Membantu individu meniru orang sukses",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan untuk mengatasi pengaruh buruk teman dalam pergaulan remaja?",
        correct_answer:
          "Menaati norma agama dan hukum serta memilih teman yang baik",
        incorrect_answer: [
          "Menghindari pertemanan sama sekali",
          "Selalu mengikuti pendapat teman",
          "Mengabaikan norma dan berfokus pada kebebasan",
        ],
      },
      {
        question: "Mengapa pendidikan karakter harus diterapkan sejak dini?",
        correct_answer:
          "Untuk membentuk individu yang berpikir matang dan bertanggung jawab",
        incorrect_answer: [
          "Agar remaja bisa mendapat pekerjaan lebih cepat",
          "Agar remaja bisa mengikuti semua kegiatan sosial",
          "Untuk mengurangi stres remaja",
        ],
      },
      {
        question:
          "Apa yang dapat dilakukan oleh keluarga dalam mendukung pendidikan karakter?",
        correct_answer: "Mengajarkan nilai moral dan sikap positif kepada anak",
        incorrect_answer: [
          "Mengajarkan nilai-nilai akademik",
          "Menyediakan fasilitas belajar yang lengkap",
          "Mengajarkan keterampilan teknis",
        ],
      },
      {
        question:
          "Bagaimana pendidikan karakter dapat berkontribusi pada masyarakat?",
        correct_answer:
          "Membantu menciptakan masyarakat yang lebih bertanggung jawab dan beretika",
        incorrect_answer: [
          "Membantu menciptakan individu yang sukses secara finansial",
          "Membantu menciptakan masyarakat yang lebih kaya",
          "Membantu menciptakan masyarakat yang lebih cepat beradaptasi dengan teknologi",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan 'berpikir panjang dan matang' dalam konteks pendidikan karakter?",
        correct_answer:
          "Mempertimbangkan segala dampak dari tindakan sebelum mengambil keputusan",
        incorrect_answer: [
          "Berpikir hanya untuk kepentingan pribadi",
          "Berpikir cepat tanpa pertimbangan",
          "Berpikir hanya berdasarkan pendapat teman",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan oleh semua pihak untuk mendukung pendidikan karakter?",
        correct_answer:
          "Menerapkan pendidikan karakter di semua aspek kehidupan",
        incorrect_answer: [
          "Hanya mendukung melalui pendidikan formal",
          "Mengandalkan sekolah sebagai satu-satunya tempat pendidikan karakter",
          "Mengabaikan nilai moral dalam pendidikan",
        ],
      },
      {
        question:
          "Apa yang dapat membantu remaja menghindari pengaruh buruk dalam pergaulan?",
        correct_answer: "Memilih teman yang memiliki karakter baik dan positif",
        incorrect_answer: [
          "Mengikuti semua tren yang ada",
          "Menghindari interaksi sosial sama sekali",
          "Fokus hanya pada kesenangan pribadi",
        ],
      },
      {
        question: "Apa peran keluarga dalam pendidikan karakter?",
        correct_answer: "Mengajarkan nilai-nilai moral dan norma-norma sosial",
        incorrect_answer: [
          "Menyediakan pendidikan formal",
          "Memberikan banyak uang kepada anak",
          "Menyediakan waktu luang sebanyak mungkin",
        ],
      },
      {
        question:
          "Bagaimana pendidikan karakter dapat membantu remaja dalam hidup mereka?",
        correct_answer:
          "Membantu remaja menjadi lebih bijak dalam membuat keputusan dan berperilaku",
        incorrect_answer: [
          "Membantu remaja menjadi populer di kalangan teman-temannya",
          "Membantu remaja menghindari pendidikan formal",
          "Membantu remaja mencapai kesuksesan akademik secara instan",
        ],
      },
      {
        question:
          "Mengapa penting untuk menciptakan individu dengan karakter yang baik?",
        correct_answer:
          "Agar mereka bisa berkontribusi positif bagi masyarakat dan negara",
        incorrect_answer: [
          "Agar mereka dapat beradaptasi dengan mudah dalam dunia digital",
          "Agar mereka dapat bekerja keras tanpa mengenal lelah",
          "Agar mereka bisa lebih kaya secara finansial",
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

      if (wpm >= 175) {
        kpmMessage =
          "Sesuai dengan Kriteria Ketuntasan Minimal (KKM) untuk siswa SMP, mencakup kecepatan dan pemahaman yang baik.";
      } else if (wpm >= 105 && wpm < 175) {
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
