document.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game");
  const loader = document.getElementById("loader");
  const choices = document.querySelectorAll(".choices button");
  const scoreText = document.getElementById("scoreText");

  const CORRECT_BONUS = 5;
  const MAX_QUESTIONS = 20;

  let questions = [];
  let questionCounter = 0;
  let score = 0;
  let currentQuestion = {};
  let acceptingAnswes = false;
  let availableQuestions = [];

  const quizData = {
    result: [
      {
        question: "Apa yang dimaksud dengan deforestasi?",
        correct_answer: "Penggundulan hutan",
        incorrect_answer: [
          "Penanaman pohon di hutan",
          "Peningkatan luas hutan",
          "Pengelolaan hutan yang berkelanjutan",
        ],
      },
      {
        question: "Apa gas yang diserap oleh pohon-pohon di hutan?",
        correct_answer: "Karbon dioksida",
        incorrect_answer: ["Oksigen", "Nitrogen", "Hidrogen"],
      },
      {
        question: "Salah satu dampak dari deforestasi adalah...",
        correct_answer: "Erosi tanah",
        incorrect_answer: [
          "Peningkatan keanekaragaman hayati",
          "Meningkatnya populasi hewan",
          "Bertambahnya sumber air bersih",
        ],
      },
      {
        question: "Apa nama lain dari penanaman kembali hutan yang gundul?",
        correct_answer: "Reboisasi",
        incorrect_answer: ["Irigasi", "Deforestasi", "Urbanisasi"],
      },
      {
        question: "Hutan sering disebut sebagai paru-paru dunia karena...",
        correct_answer: "Menyerap karbon dioksida dan melepaskan oksigen",
        incorrect_answer: [
          "Menyerap oksigen dan melepaskan karbon dioksida",
          "Menyediakan makanan untuk manusia",
          "Menyimpan cadangan air tanah",
        ],
      },
      {
        question: "Mengapa hutan disebut membantu mengurangi pemanasan global?",
        correct_answer: "Karena menyerap karbon dioksida dari atmosfer",
        incorrect_answer: [
          "Karena menyediakan air bersih",
          "Karena meningkatkan keanekaragaman hayati",
          "Karena mencegah erosi tanah",
        ],
      },
      {
        question: "Mengapa deforestasi menjadi ancaman bagi kelestarian hutan?",
        correct_answer: "Karena menyebabkan hilangnya habitat flora dan fauna",
        incorrect_answer: [
          "Karena meningkatkan populasi manusia",
          "Karena memperbaiki sistem ekosistem",
          "Karena mengurangi hasil tambang",
        ],
      },
      {
        question: "Apa yang dapat dilakukan individu untuk melestarikan hutan?",
        correct_answer: "Mengurangi penggunaan produk dari hutan",
        incorrect_answer: [
          "Membuka lahan baru untuk pertanian",
          "Membiarkan hutan terbengkalai",
          "Menebang pohon untuk keperluan pribadi",
        ],
      },
      {
        question: "Apa kaitan antara hutan dan keanekaragaman hayati?",
        correct_answer: "Hutan menyediakan habitat bagi flora dan fauna",
        incorrect_answer: [
          "Hutan menciptakan spesies baru",
          "Hutan hanya memengaruhi tumbuhan, bukan hewan",
          "Keanekaragaman hayati tidak bergantung pada hutan",
        ],
      },
      {
        question: "Mengapa pengelolaan hutan lestari penting?",
        correct_answer: "Untuk menjaga keberlanjutan sumber daya alam",
        incorrect_answer: [
          "Untuk meningkatkan keuntungan ekonomi",
          "Untuk menggantikan hutan dengan bangunan",
          "Untuk mencegah banjir tanpa penanaman pohon",
        ],
      },
      {
        question:
          "Jika terjadi banjir akibat deforestasi di suatu daerah, apa langkah awal yang dapat dilakukan?",
        correct_answer: "Melakukan reboisasi di area yang terkena dampak",
        incorrect_answer: [
          "Menebang pohon-pohon yang tersisa",
          "Mengalirkan air banjir ke sungai besar",
          "Membangun lebih banyak jalan di daerah tersebut",
        ],
      },
      {
        question:
          "Apa yang dapat dilakukan oleh organisasi untuk mendukung pelestarian hutan?",
        correct_answer: "Membuat kebijakan tentang pengelolaan hutan",
        incorrect_answer: [
          "Membuka lahan hutan untuk pertanian",
          "Mengurangi jumlah flora dan fauna di hutan",
          "Membatasi reboisasi hanya di daerah perkotaan",
        ],
      },
      {
        question:
          "Seorang siswa ingin berkontribusi melestarikan hutan. Apa yang dapat dilakukan?",
        correct_answer: "Mengurangi penggunaan kertas berlebih",
        incorrect_answer: [
          "Membakar hutan untuk lahan pertanian",
          "Menanam pohon di dalam ruangan",
          "Menebang pohon yang tua",
        ],
      },
      {
        question:
          "Bagaimana cara efektif mencegah hilangnya keanekaragaman hayati di hutan?",
        correct_answer:
          "Menjaga hutan dari kegiatan yang merusak seperti pembukaan lahan",
        incorrect_answer: [
          "Melarang semua orang memasuki hutan",
          "Menanam satu jenis pohon di seluruh hutan",
          "Mengalihkan fungsi hutan menjadi lahan pertanian",
        ],
      },
      {
        question:
          "Jika sebuah perusahaan ingin membuka lahan, bagaimana mereka dapat melakukannya tanpa merusak hutan?",
        correct_answer: "Dengan menerapkan prinsip pengelolaan hutan lestari",
        incorrect_answer: [
          "Dengan menebang seluruh pohon",
          "Dengan membangun jalan di tengah hutan",
          "Dengan membuang limbah ke dalam hutan",
        ],
      },
      {
        question:
          "Apa yang terjadi jika deforestasi terus berlanjut tanpa pengawasan?",
        correct_answer: "Perubahan iklim akan semakin parah",
        incorrect_answer: [
          "Keanekaragaman hayati meningkat",
          "Produksi oksigen meningkat",
          "Populasi hewan hutan bertambah",
        ],
      },
      {
        question:
          "Mengapa penting mengurangi produk-produk yang berasal dari hutan?",
        correct_answer: "Untuk mengurangi eksploitasi hutan secara berlebihan",
        incorrect_answer: [
          "Untuk meningkatkan biaya produksi",
          "Untuk menghindari perubahan iklim",
          "Untuk meningkatkan jumlah limbah",
        ],
      },
      {
        question:
          "Bagaimana reboisasi dapat membantu mengatasi dampak deforestasi?",
        correct_answer: "Dengan mengganti habitat yang hilang",
        incorrect_answer: [
          "Dengan meningkatkan produksi karbon dioksida",
          "Dengan mengurangi populasi hewan",
          "Dengan mempercepat penggundulan hutan",
        ],
      },
      {
        question: "Apakah langkah paling efektif untuk mengatasi deforestasi?",
        correct_answer:
          "Melakukan reboisasi dan menerapkan kebijakan pengelolaan hutan",
        incorrect_answer: [
          "Menebang pohon tua di seluruh hutan",
          "Membuka lahan baru untuk pertanian secara besar-besaran",
          "Mengurangi penghijauan di sekitar hutan",
        ],
      },
      {
        question:
          "Bagaimana individu dapat berkontribusi secara maksimal terhadap pelestarian hutan?",
        correct_answer:
          "Dengan mendukung organisasi pelestari lingkungan dan mengurangi konsumsi produk hutan",
        incorrect_answer: [
          "Dengan menggunakan produk berbasis kayu sebanyak mungkin",
          "Dengan membuka lahan pertanian di sekitar hutan",
          "Dengan menebang pohon untuk keperluan pribadi",
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

    // Sisipkan jawaban benar ke posisi acak
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

  startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; // Salin semua pertanyaan ke availableQuestions

    getNewQuestions();

    // Hilangkan loader dan tampilkan game
    game.classList.remove("hidden");
    loader.classList.add("hidden");
  };

  getNewQuestions = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      // Redirect ke halaman akhir atau tampilkan hasil akhir
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
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    availableQuestions.splice(questionIndex, 1);

    // Tampilkan pertanyaan
    const questionElement = document.getElementById("question");
    questionElement.innerText = currentQuestion.question;

    // Tampilkan pilihan jawaban
    choices.forEach((choice, index) => {
      const choiceText = currentQuestion["choice" + (index + 1)];
      choice.innerText = choiceText;
      choice.dataset["number"] = index + 1;
    });

    acceptingAnswes = true;
  };

  choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      if (!acceptingAnswes) return;

      acceptingAnswes = false;
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

  incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
  };

  // Langsung mulai permainan saat halaman dimuat
  startGame();
});
