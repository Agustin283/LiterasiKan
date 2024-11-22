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
        question: "Apa yang dimaksud dengan pergaulan bebas menurut teks?",
        correct_answer: "Perilaku salah dan buruk",
        incorrect_answer: [
          "Perilaku yang mematuhi norma hukum dan agama",
          "Perilaku yang menghormati adat dan budaya",
          "Perilaku yang kreatif dan inovatif",
        ],
      },
      {
        question: "Apa penyebab utama remaja terjerumus dalam pergaulan bebas?",
        correct_answer: "Nafsu, rasa gengsi, dan penasaran",
        incorrect_answer: [
          "Ketidakmampuan memahami pelajaran",
          "Kebiasaan membaca buku",
          "Ketidakmampuan menggunakan teknologi",
        ],
      },
      {
        question: "Apa peran teknologi dalam pergaulan bebas??",
        correct_answer: "Memiliki pengaruh terhadap perilaku negatif",
        incorrect_answer: [
          "Tidak berpengaruh sama sekali",
          "Mendorong perilaku disiplin",
          "Meningkatkan nilai sosial",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan orang tua untuk mencegah pergaulan bebas?",
        correct_answer: "Mengawasi dan mendidik anak dengan tegas",
        incorrect_answer: [
          "Memberikan kebebasan penuh kepada anak",
          "Melarang anak menggunakan internet",
          "Mengabaikan perilaku anak",
        ],
      },
      {
        question: "Apa yang dimaksud dengan salah bergaul dalam teks?",
        correct_answer: "Mudah terpengaruh oleh teman yang tidak benar",
        incorrect_answer: [
          "Memilih teman yang memiliki banyak kelebihan",
          "Menghindari pergaulan dengan orang lain",
          "Tidak berinteraksi dengan teman-teman",
        ],
      },
      {
        question: "Mengapa norma timur tidak sesuai dengan pergaulan bebas?",
        correct_answer:
          "Karena norma timur menjunjung tinggi kesopanan dan moral",
        incorrect_answer: [
          "Karena norma timur terlalu ketat",
          "Karena norma timur mengajarkan nilai-nilai yang bertentangan",
          "Karena norma timur tidak diterima oleh semua orang",
        ],
      },
      {
        question: "Bagaimana rasa gengsi dapat memengaruhi perilaku remaja?",
        correct_answer:
          "Mendorong remaja mencari pengakuan tanpa memikirkan akibatnya",
        incorrect_answer: [
          "Membuat remaja lebih percaya diri",
          "Mengajarkan remaja bertanggung jawab atas perbuatannya",
          "Membantu remaja mematuhi norma hukum",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan berpegang teguh pada norma agama dan hukum?",
        correct_answer: "Mengikuti aturan yang berlaku tanpa pengecualian",
        incorrect_answer: [
          "Melakukan kegiatan sesuai keinginan pribadi",
          "Memilih aturan yang mudah diikuti",
          "Tidak terpengaruh oleh teman-teman",
        ],
      },
      {
        question:
          "Mengapa berpikir panjang sebelum bertindak penting bagi remaja?",
        correct_answer: "Untuk memahami dampak baik dan buruk suatu tindakan",
        incorrect_answer: [
          "Agar terlihat lebih pintar dari teman-teman",
          "Untuk memudahkan menyelesaikan tugas sekolah",
          "Agar tidak melibatkan orang tua dalam masalah",
        ],
      },
      {
        question:
          "Bagaimana penggunaan internet yang bijak dapat mencegah pergaulan bebas?",
        correct_answer: "Dengan membatasi informasi yang berbahaya",
        incorrect_answer: [
          "Dengan mengajarkan cara berbelanja online",
          "Dengan melarang penggunaan internet di rumah",
          "Dengan meningkatkan waktu bermain",
        ],
      },
      {
        question:
          "Jika Anda seorang guru, bagaimana Anda dapat membantu mencegah pergaulan bebas di kalangan siswa?",
        correct_answer:
          "Mengajarkan pentingnya norma dan dampaknya dalam kehidupan",
        incorrect_answer: [
          "Memberikan hukuman berat kepada siswa yang salah",
          "Membatasi siswa berinteraksi dengan teman-teman",
          "Menyediakan waktu tambahan untuk bermain",
        ],
      },
      {
        question:
          "Sebagai orang tua, bagaimana Anda dapat memastikan anak-anak tidak terpengaruh pergaulan bebas?",
        correct_answer: "Mengawasi aktivitas mereka secara bijaksana",
        incorrect_answer: [
          "Melarang mereka bergaul dengan siapa pun",
          "Memberikan kebebasan tanpa batas",
          "Mengabaikan masalah mereka",
        ],
      },
      {
        question:
          "Bagaimana Anda dapat membantu seorang teman yang hampir terjerumus dalam pergaulan bebas?",
        correct_answer: "Menasehati mereka tentang dampak buruknya",
        incorrect_answer: [
          "Memberikan dukungan untuk apa pun yang mereka pilih",
          "Menghindari mereka agar tidak ikut terpengaruh",
          "Melaporkannya langsung kepada pihak berwenang",
        ],
      },
      {
        question:
          "Jika Anda seorang pengguna internet, bagaimana Anda bisa menggunakan teknologi dengan bijak?",
        correct_answer: "Mengakses situs yang bermanfaat dan sesuai norma",
        incorrect_answer: [
          "Menghabiskan waktu sebanyak mungkin di media sosial",
          "Menggunakan internet hanya untuk bermain game",
          "Membatasi penggunaannya untuk hiburan",
        ],
      },
      {
        question:
          "Apa yang dapat dilakukan remaja untuk menjaga pergaulannya tetap sehat?",
        correct_answer:
          "Memilih teman yang sejalan dengan norma hukum dan agama",
        incorrect_answer: [
          "Mengikuti setiap tren yang populer",
          "Menghindari seluruh pergaulan sosial",
          "Menggunakan internet tanpa batasan",
        ],
      },
      {
        question:
          "Apa hubungan antara norma timur dan pengaruh pergaulan bebas?",
        correct_answer:
          "Norma timur memperkuat nilai-nilai moral yang mencegah pergaulan bebas",
        incorrect_answer: [
          "Norma timur menyebabkan pergaulan bebas semakin meningkat",
          "Norma timur tidak berpengaruh terhadap pergaulan bebas",
          "Norma timur mendukung kebebasan berekspresi tanpa batas",
        ],
      },
      {
        question:
          "Mengapa teknologi dapat menjadi faktor penyebab pergaulan bebas?",
        correct_answer:
          "Karena teknologi memudahkan akses pada konten yang tidak sesuai",
        incorrect_answer: [
          "Karena teknologi membantu remaja memahami norma agama",
          "Karena teknologi selalu memberikan dampak positif",
          "Karena teknologi hanya digunakan untuk tujuan edukasi",
        ],
      },
      {
        question:
          "Bagaimana kombinasi rasa gengsi dan teknologi dapat memperburuk pergaulan bebas?",
        correct_answer:
          "Dengan memotivasi remaja untuk mencari pujian di media sosial",
        incorrect_answer: [
          "Dengan mengurangi rasa percaya diri remaja",
          "Dengan meningkatkan kontrol orang tua terhadap anak",
          "Dengan meminimalkan dampak negatif pergaulan bebas",
        ],
      },
      {
        question:
          "Mengapa mudah terpengaruh teman dapat menyebabkan pergaulan bebas?",
        correct_answer:
          "Karena remaja cenderung ingin diterima dalam lingkungannya",
        incorrect_answer: [
          "Karena tidak memiliki kepercayaan diri yang cukup",
          "Karena teman selalu memberikan pengaruh positif",
          "Karena teman selalu menasihati untuk bertindak sesuai norma",
        ],
      },
      {
        question:
          "Jika Anda merancang program pencegahan pergaulan bebas, apa yang menjadi fokus utama?",
        correct_answer:
          "Mengedukasi orang tua dan remaja tentang norma, teknologi, dan dampak pergaulan bebas",
        incorrect_answer: [
          "Membatasi seluruh interaksi sosial remaja",
          "Membatasi penggunaan internet secara penuh",
          "Mengurangi waktu belajar di sekolah",
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
