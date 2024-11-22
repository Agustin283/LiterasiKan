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
          "Kondisi kesejahteraan yang memungkinkan seseorang menghadapi tantangan hidup",
        incorrect_answer: [
          "Kemampuan fisik untuk berolahraga secara rutin",
          "Penyakit yang berkaitan dengan pikiran manusia",
          "Aktivitas untuk menjaga kebugaran fisik",
        ],
      },
      {
        question: "Sebutkan contoh masalah kesehatan mental yang umum terjadi!",
        correct_answer: "Depresi, kecemasan, dan stres",
        incorrect_answer: [
          "Cedera olahraga dan flu",
          "Penyakit jantung dan diabetes",
          "Gangguan makan dan obesitas",
        ],
      },
      {
        question: "Apa faktor yang dapat memengaruhi kesehatan mental?",
        correct_answer:
          "Gaya hidup tidak sehat, trauma masa lalu, dan tekanan pekerjaan",
        incorrect_answer: [
          "Pola makan sehat dan olahraga teratur",
          "Kebiasaan tidur yang cukup",
          "Hubungan sosial yang positif",
        ],
      },
      {
        question: "Apa tujuan menjaga kesehatan mental?",
        correct_answer: "Hidup lebih bahagia dan produktif",
        incorrect_answer: [
          "Menjadi lebih kompetitif dalam pekerjaan",
          "Memiliki hubungan sosial yang luas",
          "Menghindari tantangan hidup sepenuhnya",
        ],
      },
      {
        question: "Aktivitas apa yang dapat meningkatkan kesehatan mental?",
        correct_answer: "Berolahraga, meditasi, dan menghabiskan waktu di alam",
        incorrect_answer: [
          "Menonton televisi dan bekerja sepanjang waktu",
          "Makan makanan cepat saji secara rutin",
          "Menghabiskan waktu sendirian terus-menerus",
        ],
      },
      {
        question:
          "Mengapa kesehatan mental sama pentingnya dengan kesehatan fisik?",
        correct_answer:
          "Karena keduanya berperan dalam keseimbangan hidup seseorang",
        incorrect_answer: [
          "Karena pikiran manusia tidak memengaruhi kesehatan fisik",
          "Karena kesehatan mental lebih mudah dijaga daripada kesehatan fisik",
          "Karena kesehatan fisik bergantung sepenuhnya pada kesehatan mental",
        ],
      },
      {
        question:
          "Bagaimana gaya hidup tidak sehat dapat memengaruhi kesehatan mental?",
        correct_answer: "Dengan mengurangi kemampuan untuk mengelola stres",
        incorrect_answer: [
          "Dengan meningkatkan produktivitas",
          "Dengan memperkuat hubungan sosial",
          "Dengan mempercepat pemulihan mental",
        ],
      },
      {
        question:
          "Mengapa mencari dukungan profesional penting bagi kesehatan mental?",
        correct_answer:
          "Karena masalah kesehatan mental sering kali membutuhkan bantuan ahli",
        incorrect_answer: [
          "Karena profesional selalu memahami masalah pribadi seseorang",
          "Karena dukungan dari teman tidak relevan",
          "Karena hanya profesional yang mampu memotivasi orang lain",
        ],
      },
      {
        question: "Apa hubungan antara meditasi dan kesehatan mental?",
        correct_answer:
          "Meditasi membantu mengelola stres dan menenangkan pikiran",
        incorrect_answer: [
          "Meditasi dapat mengganggu pola tidur",
          "Meditasi tidak memiliki efek pada kesehatan mental",
          "Meditasi hanya bermanfaat untuk kesehatan fisik",
        ],
      },
      {
        question:
          "Bagaimana tekanan pekerjaan dapat memengaruhi kesehatan mental?",
        correct_answer: "Dengan memperburuk tingkat stres dan kecemasan",
        incorrect_answer: [
          "Dengan menambah kemampuan mengatasi stres",
          "Dengan meningkatkan hubungan sosial di tempat kerja",
          "Dengan memberikan waktu lebih untuk istirahat",
        ],
      },
      {
        question:
          "Jika Anda merasa stres di tempat kerja, langkah apa yang dapat Anda ambil untuk menjaga kesehatan mental?",
        correct_answer:
          "Berbicara dengan rekan kerja atau mencari dukungan profesional",
        incorrect_answer: [
          "Menambah jam kerja untuk menyelesaikan semua tugas",
          "Menghindari istirahat dan tetap fokus pada pekerjaan",
          "Mengabaikan tekanan tersebut tanpa mencari solusi",
        ],
      },
      {
        question:
          "Anda melihat teman mengalami kecemasan. Apa yang sebaiknya Anda lakukan?",
        correct_answer:
          "Mendorong dia untuk berbicara dengan profesional kesehatan mental",
        incorrect_answer: [
          "Mengabaikannya karena itu masalah pribadinya",
          "Meminta dia bekerja lebih keras untuk mengalihkan perhatian",
          "Membiarkannya menyendiri tanpa campur tangan",
        ],
      },
      {
        question:
          "Bagaimana cara membangun hubungan sosial yang positif untuk kesehatan mental?",
        correct_answer:
          "Dengan menghabiskan waktu dengan orang-orang yang mendukung secara emosional",
        incorrect_answer: [
          "Dengan menghindari semua jenis hubungan untuk menghindari konflik",
          "Dengan menjalin hubungan tanpa mempertimbangkan nilai kepercayaan",
          "Dengan hanya berhubungan secara online",
        ],
      },
      {
        question:
          "Apa yang sebaiknya dilakukan ketika menghadapi tekanan hidup yang berat?",
        correct_answer: "Mencari dukungan dari orang terdekat atau profesional",
        incorrect_answer: [
          "Mengabaikan tekanan tersebut hingga hilang sendiri",
          "Meningkatkan aktivitas fisik tanpa peduli emosional",
          "Menghindari komunikasi dengan orang lain",
        ],
      },
      {
        question:
          "Jika Anda memiliki kebiasaan bekerja tanpa istirahat, apa dampaknya pada kesehatan mental Anda?",
        correct_answer: "Memperburuk keseimbangan kerja dan kehidupan",
        incorrect_answer: [
          "Menurunkan stres",
          "Membantu mencapai potensi maksimal",
          "Meningkatkan kemampuan sosial",
        ],
      },
      {
        question:
          "Mengapa tekanan pekerjaan sering kali menjadi salah satu penyebab masalah kesehatan mental?",
        correct_answer:
          "Karena tekanan pekerjaan dapat memperburuk stres yang berlebihan",
        incorrect_answer: [
          "Karena tekanan pekerjaan mendorong inovasi",
          "Karena tekanan pekerjaan menciptakan rasa puas",
          "Karena tekanan pekerjaan tidak pernah memengaruhi pikiran",
        ],
      },
      {
        question:
          "Apa dampak dari mengabaikan keseimbangan antara bekerja dan beristirahat?",
        correct_answer: "Menurunkan kesehatan fisik dan mental",
        incorrect_answer: [
          "Meningkatkan produktivitas",
          "Meningkatkan kualitas hubungan sosial",
          "Memperbaiki kemampuan mengelola waktu",
        ],
      },
      {
        question:
          "Bagaimana aktivitas di alam dapat meningkatkan kesehatan mental?",
        correct_answer:
          "Dengan menurunkan kadar stres dan meningkatkan ketenangan",
        incorrect_answer: [
          "Dengan memberikan kesempatan untuk menyendiri",
          "Dengan mengurangi interaksi dengan orang lain",
          "Dengan memaksa seseorang berolahraga keras",
        ],
      },
      {
        question: "Mengapa gaya hidup sehat penting untuk kesehatan mental?",
        correct_answer: "Karena membantu menjaga keseimbangan emosional",
        incorrect_answer: [
          "Karena meningkatkan tingkat stres dan tekanan",
          "Karena membuat seseorang lebih sibuk",
          "Karena mengurangi waktu tidur yang berlebihan",
        ],
      },
      {
        question:
          "Jika Anda diminta untuk merancang program kampanye kesehatan mental, apa yang akan menjadi prioritas utama?",
        correct_answer:
          "Mengajarkan manajemen stres dan pentingnya dukungan sosial",
        incorrect_answer: [
          "Mengabaikan masalah yang tidak terlihat fisik",
          "Meningkatkan tekanan dalam lingkungan kerja",
          "Mendorong penggunaan obat tanpa konsultasi dokter",
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
