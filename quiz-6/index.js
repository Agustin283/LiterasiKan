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
        question: "Apa yang dimaksud dengan makanan sehat?",
        correct_answer: "Makanan yang memberikan nutrisi untuk tubuh",
        incorrect_answer: [
          "Makanan yang mengandung gula tinggi",
          "Makanan yang cepat disajikan",
          "Makanan yang enak dan mahal",
        ],
      },
      {
        question: "Contoh makanan sehat yang disebutkan dalam teks adalah…",
        correct_answer: "Sayur, buah, dan biji-bijian",
        incorrect_answer: [
          "Sayur, buah, dan minuman bersoda",
          "Biji-bijian, buah, dan makanan cepat saji",
          "Buah, makanan manis, dan makanan cepat saji",
        ],
      },
      {
        question: "Apa manfaat makanan sehat bagi tubuh?",
        correct_answer: "Membantu meningkatkan daya tahan tubuh",
        incorrect_answer: [
          "Membuat tubuh cepat lelah",
          "Menyebabkan obesitas",
          "Menghambat pertumbuhan tubuh",
        ],
      },
      {
        question: "Kandungan yang terdapat pada jeruk adalah…",
        correct_answer: "Vitamin C",
        incorrect_answer: ["Vitamin A", "Vitamin B", "Vitamin D"],
      },
      {
        question: "Apa risiko jika sering mengonsumsi makanan tidak sehat?",
        correct_answer: "Tubuh mudah sakit dan lelah",
        incorrect_answer: [
          "Tubuh lebih kuat",
          "Daya tahan tubuh meningkat",
          "Sistem kekebalan tubuh membaik",
        ],
      },
      {
        question:
          "Mengapa makanan sehat disebut investasi untuk hidup yang lebih baik?",
        correct_answer:
          "Karena makanan sehat membantu tubuh tetap sehat untuk jangka panjang",
        incorrect_answer: [
          "Karena makanan sehat mahal harganya",
          "Karena makanan sehat mudah didapatkan",
          "Karena makanan sehat membuat tubuh lelah",
        ],
      },
      {
        question: "Mengapa sayuran hijau seperti bayam penting bagi tubuh?",
        correct_answer:
          "Karena bayam mengandung zat besi yang membantu menjaga stamina",
        incorrect_answer: [
          "Karena bayam mengandung gula yang membuat tubuh berenergi",
          "Karena bayam membantu tubuh menjadi lebih gemuk",
          "Karena bayam dapat menggantikan makanan utama",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan memperhatikan pola makan dalam teks?",
        correct_answer: "Memilih makanan yang sehat dan bergizi",
        incorrect_answer: [
          "Membeli makanan yang mahal",
          "Mengurangi konsumsi makanan sehat",
          "Hanya mengonsumsi makanan cepat saji",
        ],
      },
      {
        question: "Bagaimana hubungan antara makanan cepat saji dan obesitas?",
        correct_answer:
          "Konsumsi makanan cepat saji meningkatkan risiko obesitas",
        incorrect_answer: [
          "Makanan cepat saji tidak memengaruhi berat badan",
          "Makanan cepat saji membantu menurunkan berat badan",
          "Makanan cepat saji tidak memengaruhi kesehatan",
        ],
      },
      {
        question: "Mengapa tubuh membutuhkan protein?",
        correct_answer: "Untuk memberikan energi dan mendukung pertumbuhan",
        incorrect_answer: [
          "Untuk meningkatkan rasa lapar",
          "Untuk menambah rasa manis pada makanan",
          "Untuk menurunkan kekebalan tubuh",
        ],
      },
      {
        question:
          "Jika teman Anda lebih suka makanan cepat saji, apa saran terbaik yang dapat Anda berikan?",
        correct_answer:
          "Mengajaknya untuk mencoba makanan sehat seperti buah dan sayur",
        incorrect_answer: [
          "Memberinya makanan cepat saji yang lebih mahal",
          "Membiarkannya terus makan makanan cepat saji",
          "Melarangnya makan makanan cepat saji tanpa memberikan alasan",
        ],
      },
      {
        question:
          "Apa yang sebaiknya dilakukan untuk meningkatkan daya tahan tubuh?",
        correct_answer: "Mengonsumsi makanan sehat seperti buah dan sayuran",
        incorrect_answer: [
          "Hanya meminum minuman bersoda setiap hari",
          "Menghindari makan dengan alasan diet",
          "Hanya fokus pada makanan berlemak tinggi",
        ],
      },
      {
        question:
          "Jika Anda merasa mudah lelah, apa langkah pertama yang sebaiknya diambil?",
        correct_answer: "Memperbanyak konsumsi makanan sehat dan bergizi",
        incorrect_answer: [
          "Menambah asupan makanan tidak sehat",
          "Mengurangi makan sepenuhnya",
          "Mengganti makanan sehat dengan makanan cepat saji",
        ],
      },
      {
        question: "Bagaimana cara sederhana mengurangi risiko diabetes?",
        correct_answer: "Menghindari minuman bersoda dan makanan tidak sehat",
        incorrect_answer: [
          "Mengonsumsi makanan yang mengandung gula tinggi",
          "Memilih makanan cepat saji yang lebih mahal",
          "Mengurangi konsumsi buah-buahan",
        ],
      },
      {
        question: "Apa yang bisa dilakukan untuk menjaga pola makan sehat?",
        correct_answer: "Mengatur jadwal makan dan memilih makanan bergizi",
        incorrect_answer: [
          "Membeli makanan cepat saji setiap hari",
          "Hanya makan saat lapar tanpa memerhatikan gizi",
          "Mengonsumsi makanan berlemak tinggi",
        ],
      },
      {
        question: "Mengapa makanan cepat saji sering dianggap tidak sehat?",
        correct_answer: "Karena mengandung banyak lemak, garam, dan gula",
        incorrect_answer: [
          "Karena memiliki rasa yang tidak enak",
          "Karena sulit ditemukan di pasaran",
          "Karena tidak populer di masyarakat",
        ],
      },
      {
        question:
          "Apa yang menyebabkan makanan sehat membantu menjaga daya tahan tubuh?",
        correct_answer:
          "Kandungan nutrisinya mendukung fungsi tubuh secara optimal",
        incorrect_answer: [
          "Karena makanan sehat selalu mahal",
          "Karena makanan sehat hanya dikonsumsi sesekali",
          "Karena makanan sehat tidak mengandung vitamin",
        ],
      },
      {
        question:
          "Apa dampak negatif dari konsumsi minuman bersoda secara berlebihan?",
        correct_answer: "Meningkatkan risiko obesitas dan diabetes",
        incorrect_answer: [
          "Meningkatkan daya tahan tubuh",
          "Membantu proses pertumbuhan tubuh",
          "Mengurangi rasa lelah",
        ],
      },
      {
        question:
          "Jika Anda ingin membuat kampanye tentang makanan sehat, apa yang harus menjadi fokus utama?",
        correct_answer:
          "Memberikan informasi tentang manfaat makanan sehat dan bahayanya makanan tidak sehat",
        incorrect_answer: [
          "Mempromosikan makanan cepat saji kepada masyarakat",
          "Menghindari diskusi tentang gizi dan pola makan",
          "Menjual minuman bersoda untuk menarik perhatian",
        ],
      },
      {
        question:
          "Bagaimana cara Anda mempromosikan gaya hidup sehat di lingkungan sekolah?",
        correct_answer:
          "Mengadakan program makan sehat dan memberikan edukasi tentang gizi",
        incorrect_answer: [
          "Membiarkan siswa memilih makanan apa pun tanpa arahan",
          "Menyediakan makanan cepat saji di kantin sekolah",
          "Tidak memberikan informasi tentang makanan sehat",
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
