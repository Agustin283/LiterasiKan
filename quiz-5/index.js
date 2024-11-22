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
        question: "Apa tujuan dari pendidikan karakter?",
        correct_answer: "Membentuk pribadi yang berakhlak mulia",
        incorrect_answer: [
          "Meningkatkan kecerdasan intelektual saja",
          "Mengajarkan keterampilan teknis",
          "Meningkatkan popularitas seseorang",
        ],
      },
      {
        question:
          "Nilai-nilai karakter yang perlu ditanamkan sejak dini adalah…",
        correct_answer:
          "Kejujuran, tanggung jawab, hormat, peduli, dan gotong royong",
        incorrect_answer: [
          "Egoisme, kompetisi, keberanian, dan ambisi",
          "Kemandirian, kreativitas, inovasi, dan keberuntungan",
          "Ketegasan, keberanian, kesuksesan, dan kecepatan",
        ],
      },
      {
        question: "Di mana pendidikan karakter diajarkan?",
        correct_answer: "Di sekolah, keluarga, dan masyarakat",
        incorrect_answer: [
          "Hanya di sekolah",
          "Di lingkungan keluarga dan masyarakat saja",
          "Hanya di kegiatan ekstrakurikuler",
        ],
      },
      {
        question: "Apa manfaat dari memiliki karakter yang baik?",
        correct_answer:
          "Lebih mudah beradaptasi, membangun relasi sehat, dan berkontribusi positif",
        incorrect_answer: [
          "Meningkatkan kemampuan akademik secara langsung",
          "Mempermudah mendapatkan pekerjaan bergengsi",
          "Mengurangi tanggung jawab di masyarakat",
        ],
      },
      {
        question: "Pendidikan karakter dapat dilakukan melalui…",
        correct_answer:
          "Memberikan contoh yang baik dan melibatkan siswa dalam kegiatan positif",
        incorrect_answer: [
          "Pemberian tugas akademik yang banyak",
          "Pengajaran berbasis kompetisi individu",
          "Menuntut hasil akademik yang sempurna",
        ],
      },
      {
        question:
          "Mengapa pendidikan karakter penting selain kecerdasan intelektual?",
        correct_answer: "Karakter baik mendukung keberhasilan dalam hidup",
        incorrect_answer: [
          "Karena kecerdasan intelektual tidak menentukan keberhasilan",
          "Karena pendidikan karakter lebih mudah diajarkan",
          "Karena kecerdasan intelektual tidak diajarkan di sekolah",
        ],
      },
      {
        question: "Mengapa nilai kejujuran penting dalam pendidikan karakter?",
        correct_answer:
          "Karena kejujuran membangun kepercayaan dalam hubungan sosial",
        incorrect_answer: [
          "Untuk meningkatkan keterampilan sosial",
          "Karena kejujuran tidak memengaruhi karakter seseorang",
          "Untuk mengurangi tanggung jawab pribadi",
        ],
      },
      {
        question: "Bagaimana keluarga berperan dalam pendidikan karakter?",
        correct_answer:
          "Dengan memberikan teladan dan mengajarkan nilai moral sejak dini",
        incorrect_answer: [
          "Dengan membiarkan anak belajar sendiri",
          "Dengan mengandalkan pendidikan di sekolah sepenuhnya",
          "Dengan fokus pada pendidikan akademik saja",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan “salah bergaul” dalam konteks pendidikan karakter?",
        correct_answer: "Tidak mematuhi norma agama dan hukum saat bergaul",
        incorrect_answer: [
          "Memilih teman yang tidak cerdas",
          "Memiliki terlalu banyak teman dari latar belakang yang berbeda",
          "Menghindari hubungan sosial dengan orang lain",
        ],
      },
      {
        question: "Apa manfaat dari berpikir panjang sebelum bertindak?",
        correct_answer:
          "Mengurangi risiko tindakan yang merugikan diri dan orang lain",
        incorrect_answer: [
          "Mempermudah hubungan sosial",
          "Meningkatkan pengakuan dari orang lain",
          "Meningkatkan keberanian dalam mengambil keputusan",
        ],
      },
      {
        question:
          "Jika seorang siswa sering berbohong, apa langkah pendidikan karakter yang dapat diambil?",
        correct_answer: "Memberikan contoh tentang pentingnya kejujuran",
        incorrect_answer: [
          "Memberi hukuman fisik agar dia takut",
          "Membiarkannya belajar dari kesalahan sendiri",
          "Memberikan tugas tambahan sebagai hukuman",
        ],
      },
      {
        question:
          "Bagaimana cara mencegah seorang remaja dari pengaruh pergaulan bebas?",
        correct_answer: "Dengan membekali nilai-nilai agama dan norma hukum",
        incorrect_answer: [
          "Dengan memberikan sanksi sosial keras",
          "Dengan membatasi akses kepada teman-teman",
          "Dengan melarang mereka bersosialisasi",
        ],
      },
      {
        question:
          "Apa yang bisa dilakukan guru untuk menanamkan nilai tanggung jawab pada siswa?",
        correct_answer: "Memberikan tugas kelompok yang membutuhkan kerja sama",
        incorrect_answer: [
          "Memberikan hukuman jika mereka tidak bertanggung jawab",
          "Membiarkan mereka bertanggung jawab tanpa arahan",
          "Menghindari diskusi tentang tanggung jawab di kelas",
        ],
      },
      {
        question:
          "Jika Anda melihat seorang teman tidak menghormati guru, apa yang harus dilakukan?",
        correct_answer: "Mengingatkan teman tersebut dengan cara yang baik",
        incorrect_answer: [
          "Membiarkannya karena itu bukan tanggung jawab Anda",
          "Melaporkannya kepada pihak sekolah tanpa bicara langsung",
          "Menghindarinya tanpa memberikan penjelasan",
        ],
      },
      {
        question:
          "Bagaimana cara seseorang melibatkan siswa dalam kegiatan yang menumbuhkan gotong royong?",
        correct_answer:
          "Dengan memberikan proyek kelompok yang mengharuskan kerja sama",
        incorrect_answer: [
          "Dengan memberikan tugas individual yang banyak",
          "Dengan fokus pada nilai akademik siswa secara individu",
          "Dengan menghindari kegiatan berbasis kelompok",
        ],
      },
      {
        question:
          "Mengapa remaja yang tidak berkarakter rentan terhadap pengaruh buruk?",
        correct_answer:
          "Karena mereka cenderung mengikuti arus tanpa berpikir kritis",
        incorrect_answer: [
          "Karena mereka memiliki rasa percaya diri yang tinggi",
          "Karena mereka memahami pentingnya nilai moral",
          "Karena mereka lebih mandiri dalam membuat keputusan",
        ],
      },
      {
        question:
          "Bagaimana norma agama membantu mencegah seseorang terjerumus ke pergaulan bebas?",
        correct_answer: "Dengan memberikan panduan etika dalam berperilaku",
        incorrect_answer: [
          "Dengan melarang seseorang bersosialisasi",
          "Dengan fokus hanya pada kehidupan spiritual",
          "Dengan mengabaikan nilai-nilai tradisional",
        ],
      },
      {
        question:
          "Apa hubungan antara pendidikan karakter dan keberhasilan hidup?",
        correct_answer:
          "Karakter baik membantu membangun relasi sosial dan kesuksesan",
        incorrect_answer: [
          "Pendidikan karakter hanya relevan di dunia akademik",
          "Pendidikan karakter menggantikan kecerdasan intelektual",
          "Keberhasilan hidup hanya ditentukan oleh keterampilan teknis",
        ],
      },
      {
        question:
          "Jika Anda diminta merancang program pendidikan karakter untuk siswa, apa yang akan menjadi fokus utama?",
        correct_answer:
          "Mengajarkan nilai-nilai moral dan melibatkan siswa dalam kegiatan berbasis karakter",
        incorrect_answer: [
          "Memberikan lebih banyak tugas akademik agar siswa lebih sibuk",
          "Menghindari diskusi tentang nilai moral di kelas",
          "Mengurangi interaksi sosial siswa",
        ],
      },
      {
        question:
          "Bagaimana Anda sebagai pemimpin komunitas dapat mempromosikan pendidikan karakter di masyarakat?",
        correct_answer:
          "Dengan memberikan contoh perilaku positif dan mengadakan pelatihan nilai moral",
        incorrect_answer: [
          "Dengan mengandalkan pendidikan karakter di sekolah",
          "Dengan fokus pada pembangunan infrastruktur",
          "Dengan membatasi interaksi masyarakat",
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
