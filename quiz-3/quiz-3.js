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

  // Data quiz dimasukkan langsung ke dalam variabel
  // Data JSON langsung dalam variabel quizData
  const quizData = {
    result: [
      {
        question: "Apa fungsi utama hutan yang disebut dalam teks?",
        correct_answer: "Penyerap karbon dioksida dan pelepas oksigen",
        incorrect_answer: [
          "Tempat rekreasi manusia",
          "Sumber bahan baku industri",
          "Penambah pendapatan negara",
        ],
      },
      {
        question: "Apa yang dimaksud dengan deforestasi?",
        correct_answer: "Pembukaan lahan untuk pertanian atau pembangunan",
        incorrect_answer: [
          "Penanaman pohon di lahan terbuka",
          "Perlindungan hutan dari kerusakan",
          "Pengelolaan hutan secara berkelanjutan",
        ],
      },
      {
        question: "Apa salah satu akibat dari deforestasi?",
        correct_answer: "Penurunan kadar oksigen di udara",
        incorrect_answer: [
          "Bertambahnya keanekaragaman hayati",
          "Berkurangnya pemanasan global",
          "Pengurangan aktivitas pertanian",
        ],
      },
      {
        question: "Apa saja penyebab utama deforestasi menurut teks?",
        correct_answer: "Pembukaan lahan, pertambangan, dan pembangunan",
        incorrect_answer: [
          "Aktivitas reboisasi dan penghijauan",
          "Penebangan pohon untuk penelitian ilmiah",
          "Kebijakan konservasi lingkungan",
        ],
      },
      {
        question: "Apa itu reboisasi?",
        correct_answer: "Penanaman kembali pohon di lahan gundul",
        incorrect_answer: [
          "Pembukaan hutan untuk pertanian",
          "Penebangan pohon secara terencana",
          "Pengelolaan hutan untuk wisata",
        ],
      },
      {
        question: "Mengapa hutan disebut paru-paru dunia?",
        correct_answer:
          "Karena menghasilkan oksigen dan menyerap karbon dioksida",
        incorrect_answer: [
          "Karena ukurannya yang luas di seluruh dunia",
          "Karena menjadi habitat utama flora",
          "Karena menyediakan tempat tinggal bagi manusia",
        ],
      },
      {
        question: "Bagaimana deforestasi dapat menyebabkan erosi tanah?",
        correct_answer: "Dengan mengurangi pohon yang menahan lapisan tanah",
        incorrect_answer: [
          "Dengan meningkatkan kelembapan di tanah",
          "Dengan mempercepat pertumbuhan akar tanaman",
          "Dengan mencegah limpasan air",
        ],
      },
      {
        question: "Apa manfaat penerapan kebijakan pelestarian hutan?",
        correct_answer:
          "Menjaga keseimbangan ekosistem dan mencegah kerusakan lingkungan",
        incorrect_answer: [
          "Menambah lahan untuk kegiatan ekonomi",
          "Meningkatkan pembangunan infrastruktur",
          "Meningkatkan produksi hasil hutan",
        ],
      },
      {
        question: "Mengapa hutan penting bagi keanekaragaman hayati?",
        correct_answer:
          "Karena hutan menjadi habitat alami bagi flora dan fauna",
        incorrect_answer: [
          "Karena hutan menciptakan ekosistem buatan yang terkontrol",
          "Karena hutan menyediakan lahan untuk penelitian ilmiah",
          "Karena hutan mengurangi dampak polusi",
        ],
      },
      {
        question:
          "Bagaimana individu dapat berkontribusi dalam pelestarian hutan?",
        correct_answer: "Mengurangi penggunaan produk dari hutan",
        incorrect_answer: [
          "Meningkatkan konsumsi kayu dan kertas",
          "Membuka lahan baru untuk pertanian",
          "Mengabaikan kebijakan lingkungan",
        ],
      },
      {
        question:
          "Jika Anda seorang petani, bagaimana Anda dapat mendukung pelestarian hutan?",
        correct_answer: "Menggunakan teknik pertanian berkelanjutan",
        incorrect_answer: [
          "Membuka lahan baru dengan cara menebang hutan",
          "Menanam pohon hanya di musim kemarau",
          "Membakar hutan untuk mengurangi biaya",
        ],
      },
      {
        question:
          "Sebagai konsumen, apa langkah sederhana yang bisa Anda lakukan untuk menjaga kelestarian hutan?",
        correct_answer: "Menggunakan produk ramah lingkungan",
        incorrect_answer: [
          "Membeli kayu ilegal dengan harga murah",
          "Mengurangi konsumsi buah-buahan",
          "Memakai kertas sebanyak mungkin",
        ],
      },
      {
        question:
          "Bagaimana reboisasi dapat membantu mengatasi dampak deforestasi?",
        correct_answer: "Dengan mengganti pohon yang telah ditebang",
        incorrect_answer: [
          "Dengan menambah lahan untuk pemukiman",
          "Dengan mengurangi keanekaragaman hayati",
          "Dengan mempercepat erosi tanah",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan oleh pemerintah untuk mengurangi deforestasi?",
        correct_answer: "Memberikan sanksi kepada penebang liar",
        incorrect_answer: [
          "Membuka lebih banyak tambang di hutan",
          "Menghapus peraturan tentang pelestarian lingkungan",
          "Meningkatkan produksi bahan baku dari hutan",
        ],
      },
      {
        question: "Bagaimana Anda dapat mendukung organisasi lingkungan?",
        correct_answer: "Dengan menyumbang dana atau menjadi relawan",
        incorrect_answer: [
          "Dengan mengkritik tindakan konservasi mereka",
          "Dengan menebang pohon secara selektif",
          "Dengan menghindari kerja sama dengan mereka",
        ],
      },
      {
        question: "Mengapa deforestasi dapat memperburuk perubahan iklim?",
        correct_answer:
          "Karena hutan menyerap gas rumah kaca seperti karbon dioksida",
        incorrect_answer: [
          "Karena hutan tidak mempengaruhi suhu Bumi",
          "Karena deforestasi mempercepat pertumbuhan tanaman",
          "Karena hutan hanya berfungsi sebagai habitat fauna",
        ],
      },
      {
        question: "Apa hubungan antara hutan dan sumber air bersih?",
        correct_answer: "Hutan membantu menjaga keseimbangan siklus air",
        incorrect_answer: [
          "Hutan mempercepat penguapan air tanah",
          "Hutan tidak berpengaruh terhadap kualitas air",
          "Hutan meningkatkan polusi air",
        ],
      },
      {
        question:
          "Mengapa erosi tanah lebih sering terjadi di daerah yang mengalami deforestasi?",
        correct_answer:
          "Karena pohon yang seharusnya menahan tanah telah hilang",
        incorrect_answer: [
          "Karena akar pohon menjadi lebih kuat",
          "Karena hutan tidak mampu menahan hujan",
          "Karena tanah menjadi lebih subur tanpa hutan",
        ],
      },
      {
        question:
          "Apa dampak utama hilangnya keanekaragaman hayati akibat deforestasi?",
        correct_answer:
          "Penurunan populasi spesies yang penting bagi ekosistem",
        incorrect_answer: [
          "Meningkatnya efisiensi produksi hutan",
          "Berkurangnya akses manusia ke hutan",
          "Peningkatan pemanasan global secara langsung",
        ],
      },
      {
        question:
          "Jika Anda diminta untuk merancang program nasional pelestarian hutan, langkah apa yang menjadi prioritas?",
        correct_answer: "Menggalakkan reboisasi dan pengelolaan hutan lestari",
        incorrect_answer: [
          "Membuka lebih banyak lahan untuk industri",
          "Mengurangi regulasi lingkungan untuk mendukung ekonomi",
          "Menghapus sanksi bagi pelanggaran lingkungan",
        ],
      },
    ],
  };

  // Anda dapat memproses `quizData` seperti yang sudah dibahas sebelumnya.

  // Proses data langsung dari quizData
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
