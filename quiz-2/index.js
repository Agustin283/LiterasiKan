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
        question: "Apa yang dimaksud dengan kecerdasan buatan (AI)?",
        correct_answer: "Teknologi yang meniru kecerdasan manusia",
        incorrect_answer: [
          "Mesin yang menggantikan manusia dalam pekerjaan fisik",
          "Teknologi yang hanya digunakan di bidang kesehatan",
          "Perangkat keras yang digunakan untuk komunikasi",
        ],
      },
      {
        question: "Contoh penerapan AI yang paling umum adalah?",
        correct_answer: "Asisten virtual",
        incorrect_answer: [
          "Komputer gaming",
          "Mesin cuci otomatis",
          "Kamera CCTV",
        ],
      },
      {
        question: "Dalam bidang apa AI digunakan untuk mendiagnosis penyakit?",
        correct_answer: "Kesehatan",
        incorrect_answer: ["Keuangan", "Pendidikan", "Manufaktur"],
      },
      {
        question:
          "Apa salah satu tantangan yang dihadapi dalam pengembangan AI?",
        correct_answer: "Kekhawatiran akan hilangnya lapangan pekerjaan",
        incorrect_answer: [
          "Kesulitan memproduksi perangkat keras",
          "Tidak ada yang mau menggunakan AI",
          "AI tidak mampu mempelajari data",
        ],
      },
      {
        question: "AI digunakan dalam industri manufaktur untuk apa?",
        correct_answer: "Meningkatkan efisiensi produksi",
        incorrect_answer: [
          "Memproduksi listrik",
          "Mengatur jadwal karyawan",
          "Mengurangi biaya transportasi",
        ],
      },
      {
        question: "Mengapa AI dianggap meniru kecerdasan manusia?",
        correct_answer:
          "Karena mampu menyelesaikan tugas kompleks dengan algoritma",
        incorrect_answer: [
          "Karena dapat melakukan semua tugas manusia",
          "Karena membutuhkan tenaga manusia untuk bekerja",
          "Karena tidak bisa digunakan tanpa jaringan internet",
        ],
      },
      {
        question: "Bagaimana AI membantu di bidang keuangan?",
        correct_answer: "Dengan menganalisis data pasar",
        incorrect_answer: [
          "Dengan menggantikan peran bankir",
          "Dengan mengatur pembayaran otomatis",
          "Dengan meminimalkan risiko teknologi",
        ],
      },
      {
        question: "Apa yang menjadi kekhawatiran etika penggunaan AI?",
        correct_answer: "Kemungkinan AI digunakan untuk tujuan jahat",
        incorrect_answer: [
          "Keterbatasan AI dalam memahami perintah",
          "Tingginya biaya pengembangan AI",
          "Tidak adanya regulasi penggunaan AI",
        ],
      },
      {
        question:
          "Mengapa asisten virtual dianggap sebagai contoh umum penerapan AI?",
        correct_answer:
          "Karena mampu memahami perintah suara dan melakukan tugas tertentu",
        incorrect_answer: [
          "Karena digunakan oleh sebagian besar orang",
          "Karena mudah dipahami oleh masyarakat umum",
          "Karena lebih murah dibandingkan teknologi lain",
        ],
      },
      {
        question: "Apa tujuan utama penggunaan AI di berbagai bidang?",
        correct_answer:
          "Meningkatkan efisiensi dan akurasi dalam menyelesaikan tugas",
        incorrect_answer: [
          "Menggantikan seluruh peran manusia",
          "Mengurangi ketergantungan pada teknologi",
          "Menghindari tantangan etika dalam teknologi",
        ],
      },
      {
        question:
          "Jika Anda seorang dokter, bagaimana AI dapat membantu pekerjaan Anda?",
        correct_answer: "Dengan mendiagnosis penyakit berdasarkan data pasien",
        incorrect_answer: [
          "Dengan menggantikan peran Anda sepenuhnya",
          "Dengan mengatur jadwal janji temu pasien",
          "Dengan mengobati pasien secara langsung",
        ],
      },
      {
        question: "Bagaimana AI dapat diterapkan di bidang pendidikan?",
        correct_answer: "Dengan menyediakan platform pembelajaran adaptif",
        incorrect_answer: [
          "Dengan menggantikan peran guru di sekolah",
          "Dengan membuat buku teks elektronik",
          "Dengan membangun gedung sekolah baru",
        ],
      },
      {
        question:
          "Sebagai seorang analis keuangan, bagaimana Anda memanfaatkan AI?",
        correct_answer:
          "Dengan menggunakan AI untuk menganalisis pola data pasar",
        incorrect_answer: [
          "Dengan meminta AI membuat laporan keuangan otomatis",
          "Dengan melatih AI untuk menjadi pengganti pekerjaan Anda",
          "Dengan menggunakan AI hanya untuk prediksi saham",
        ],
      },
      {
        question: "Bagaimana seorang teknisi manufaktur dapat menggunakan AI?",
        correct_answer: "Dengan memprogram robot untuk efisiensi produksi",
        incorrect_answer: [
          "Dengan melibatkan AI dalam pelatihan karyawan",
          "Dengan mengurangi pengawasan terhadap mesin",
          "Dengan menghentikan penggunaan teknologi manual",
        ],
      },
      {
        question:
          "Jika Anda seorang pengembang AI, apa yang harus Anda lakukan untuk mengurangi tantangan etika?",
        correct_answer: "Menjaga transparansi dalam penggunaan AI",
        incorrect_answer: [
          "Mengembangkan AI tanpa batasan",
          "Menghindari pengawasan regulasi",
          "Membatasi aplikasi AI hanya untuk bidang hiburan",
        ],
      },
      {
        question:
          "Mengapa ada kekhawatiran akan hilangnya pekerjaan akibat AI?",
        correct_answer:
          "Karena AI dapat melakukan beberapa tugas lebih efisien daripada manusia",
        incorrect_answer: [
          "Karena AI tidak membutuhkan operator manusia",
          "Karena AI menggantikan semua jenis pekerjaan",
          "Karena AI hanya digunakan di sektor teknologi tinggi",
        ],
      },
      {
        question:
          "Apa hubungan antara AI dan efisiensi produksi dalam manufaktur?",
        correct_answer:
          "AI meminimalkan kesalahan manusia dan meningkatkan produktivitas",
        incorrect_answer: [
          "AI membantu mengurangi jumlah produk yang dihasilkan",
          "AI membuat produksi lebih lambat tetapi lebih presisi",
          "AI hanya digunakan untuk pengemasan produk",
        ],
      },
      {
        question:
          "Bagaimana tantangan etika dapat memengaruhi perkembangan AI?",
        correct_answer: "Dengan menghambat adopsi AI dalam berbagai bidang",
        incorrect_answer: [
          "Dengan mempercepat implementasi AI untuk mengurangi pekerjaan manusia",
          "Dengan mengurangi biaya pengembangan AI",
          "Dengan membatasi penggunaan AI pada sektor tertentu",
        ],
      },
      {
        question:
          "Apa peran AI dalam menjaga keamanan data di bidang keuangan?",
        correct_answer: "Menganalisis pola data untuk mendeteksi ancaman",
        incorrect_answer: [
          "Menghilangkan risiko peretasan secara menyeluruh",
          "Menghapus data yang tidak relevan secara otomatis",
          "Mengurangi pengawasan manusia terhadap data penting",
        ],
      },
      {
        question:
          "Jika Anda diberi tugas merancang AI untuk pendidikan, langkah apa yang Anda prioritaskan?",
        correct_answer:
          "Mengembangkan AI yang menyediakan pembelajaran adaptif dan interaktif",
        incorrect_answer: [
          "Membuat AI yang menggantikan guru di semua jenjang pendidikan",
          "Merancang AI yang hanya digunakan oleh siswa dengan keunggulan akademik",
          "Mengurangi interaksi manusia dalam proses pendidikan",
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
      const wpm = localStorage.getItem("readingSpeed") || 150;
      const finalScore = parseInt((wpm * score) / 100);
      Swal.fire({
        title: "Hasil KEM",
        html: `<div style="text-align: justify; justify-content: center; max-width: fit-content; margin-left: auto; margin-right: auto;">Kecepatan Membaca &nbsp;: <b>${wpm} WPM</b> <br>Skor Quiz   &nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;: <b>${score}%</b> <br>Hasil Akhir &nbsp;&nbsp;&ensp;&emsp;&emsp;&emsp;&emsp;: <b>${finalScore}</b></div>`,
        icon: "success",
      }).finally(() => {
        localStorage.removeItem("readingSpeed");
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
