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
        question: "Apa yang dimaksud dengan kecerdasan buatan (AI)?",
        correct_answer: "Teknologi yang meniru kecerdasan manusia",
        incorrect_answer: [
          "Teknologi yang menggantikan manusia sepenuhnya",
          "Teknologi yang hanya digunakan untuk bermain game",
          "Teknologi yang tidak membutuhkan program",
        ],
      },
      {
        question: "Contoh penerapan AI yang paling umum adalah...",
        correct_answer: "Asisten virtual seperti Siri dan Alexa",
        incorrect_answer: [
          "Pembuatan alat transportasi tradisional",
          "Penggunaan papan tulis elektronik",
          "Teknologi sederhana dalam rumah tangga",
        ],
      },
      {
        question: "Dalam bidang apa saja AI digunakan, menurut teks?",
        correct_answer: "Kesehatan, keuangan, dan manufaktur",
        incorrect_answer: [
          "Pendidikan, hiburan, dan budaya",
          "Pariwisata, seni, dan sosial",
          "Pertanian, seni, dan olahraga",
        ],
      },
      {
        question: "Apa tugas yang dapat dilakukan oleh asisten virtual?",
        correct_answer: "Mengatur alarm atau memutar musik",
        incorrect_answer: [
          "Mengemudi kendaraan",
          "Mengelola keuangan perusahaan besar",
          "Membuat keputusan hukum",
        ],
      },
      {
        question:
          "Salah satu tantangan AI yang disebutkan dalam teks adalah...",
        correct_answer: "Kekhawatiran akan hilangnya lapangan pekerjaan",
        incorrect_answer: [
          "Meningkatnya harga barang elektronik",
          "Penurunan jumlah pengguna internet",
          "Perkembangan teknologi yang terlalu lambat",
        ],
      },
      {
        question: "Mengapa AI disebut meniru kecerdasan manusia?",
        correct_answer:
          "Karena AI mampu menyelesaikan tugas kompleks yang biasanya dilakukan manusia",
        incorrect_answer: [
          "Karena AI dapat bekerja seperti manusia dalam segala hal",
          "Karena AI menggantikan sepenuhnya peran manusia",
          "Karena AI bekerja lebih lambat dibanding manusia",
        ],
      },
      {
        question: "Apa hubungan antara AI dan bidang manufaktur?",
        correct_answer: "AI digunakan untuk meningkatkan efisiensi produksi",
        incorrect_answer: [
          "AI menggantikan pekerja manusia dalam setiap lini produksi",
          "AI hanya digunakan untuk mengawasi pekerja",
          "AI tidak digunakan dalam manufaktur",
        ],
      },
      {
        question:
          "Mengapa asisten virtual seperti Siri dan Alexa dianggap contoh penerapan AI?",
        correct_answer:
          "Karena mereka mampu memahami dan menjawab perintah suara",
        incorrect_answer: [
          "Karena mereka menggunakan suara manusia untuk berbicara",
          "Karena mereka bisa menggantikan semua pekerjaan manusia",
          "Karena mereka menggunakan energi listrik",
        ],
      },
      {
        question: "Apa manfaat AI dalam bidang kesehatan menurut teks?",
        correct_answer: "Mendiagnosis penyakit dengan lebih akurat",
        incorrect_answer: [
          "Meningkatkan jumlah pasien di rumah sakit",
          "Membuat obat-obatan baru tanpa riset",
          "Menurunkan biaya perawatan",
        ],
      },
      {
        question: "Mengapa perkembangan AI menimbulkan kekhawatiran?",
        correct_answer: "Karena AI dapat disalahgunakan untuk tujuan jahat",
        incorrect_answer: [
          "Karena AI tidak memiliki manfaat bagi manusia",
          "Karena AI membuat pekerjaan lebih sulit",
          "Karena AI tidak mendukung perkembangan teknologi lain",
        ],
      },
      {
        question:
          "Jika kamu ingin AI membantu pekerjaan rumah tangga, teknologi apa yang bisa digunakan?",
        correct_answer: "Asisten virtual seperti Alexa",
        incorrect_answer: [
          "Sistem AI berbasis virtual reality",
          "Diagnostik AI dalam kesehatan",
          "Analisis data keuangan",
        ],
      },
      {
        question: "Dalam situasi apa AI dapat membantu di bidang keuangan?",
        correct_answer:
          "Saat menganalisis data pasar untuk pengambilan keputusan",
        incorrect_answer: [
          "Saat mengemudikan kendaraan pribadi",
          "Saat memutar musik di acara kantor",
          "Saat memberikan layanan kesehatan kepada pasien",
        ],
      },
      {
        question:
          "Bagaimana AI dapat diterapkan untuk mengurangi kesalahan manusia?",
        correct_answer:
          "Dengan menggunakan algoritma untuk tugas-tugas tertentu",
        incorrect_answer: [
          "Dengan mengambil alih semua tugas manusia",
          "Dengan menghapus pekerjaan manual sepenuhnya",
          "Dengan meningkatkan kompleksitas teknologi",
        ],
      },
      {
        question:
          "Jika ingin menggunakan AI untuk membantu belajar, teknologi apa yang cocok?",
        correct_answer:
          "AI berbasis pendidikan seperti aplikasi belajar otomatis",
        incorrect_answer: [
          "AI dalam pengenalan wajah",
          "AI untuk menganalisis keuangan",
          "AI dalam kendaraan tanpa pengemudi",
        ],
      },
      {
        question:
          "Bagaimana teknologi AI dapat membantu efisiensi produksi di pabrik?",
        correct_answer: "Dengan mengotomatisasi proses produksi yang rumit",
        incorrect_answer: [
          "Dengan menggantikan semua manajer",
          "Dengan mengatur jadwal shift pekerja",
          "Dengan meningkatkan biaya produksi",
        ],
      },
      {
        question: "Apa yang menjadi kesamaan antara tantangan dan manfaat AI?",
        correct_answer:
          "Keduanya melibatkan perubahan besar pada pola kerja manusia",
        incorrect_answer: [
          "Keduanya berkaitan dengan pengurangan biaya",
          "Keduanya berdampak langsung pada kesejahteraan manusia",
          "Keduanya selalu memberikan dampak positif",
        ],
      },
      {
        question:
          "Apa perbedaan mendasar antara manfaat AI di bidang kesehatan dan bidang keuangan?",
        correct_answer:
          "Di bidang kesehatan untuk diagnosa, di keuangan untuk analisis data",
        incorrect_answer: [
          "Di bidang kesehatan untuk hiburan, di keuangan untuk produksi",
          "Di bidang kesehatan untuk produksi, di keuangan untuk diagnostik",
          "Di bidang kesehatan dan keuangan tidak ada perbedaan manfaat",
        ],
      },
      {
        question:
          "Mengapa kekhawatiran tentang otomatisasi pekerjaan bisa menjadi tantangan bagi AI?",
        correct_answer:
          "Karena AI dapat menghilangkan banyak pekerjaan manusia",
        incorrect_answer: [
          "Karena AI meningkatkan ketergantungan manusia pada teknologi",
          "Karena AI memperlambat proses produksi",
          "Karena AI tidak memberikan dampak di bidang teknologi",
        ],
      },
      {
        question:
          "Apa kaitan antara etika penggunaan AI dan potensi penyalahgunaan?",
        correct_answer:
          "Etika mengatur bagaimana AI digunakan dengan bertanggung jawab",
        incorrect_answer: [
          "Etika membatasi manfaat AI sepenuhnya",
          "Penyalahgunaan AI terjadi hanya di negara berkembang",
          "Penyalahgunaan AI tidak terkait dengan etika",
        ],
      },
      {
        question:
          "Bagaimana AI dapat berpotensi digunakan untuk tujuan yang jahat?",
        correct_answer:
          "Dengan digunakan dalam kejahatan siber atau manipulasi data",
        incorrect_answer: [
          "Dengan membuat algoritma untuk meningkatkan kreativitas",
          "Dengan menolak untuk mengikuti perintah pengguna",
          "Dengan tidak menghasilkan data yang diinginkan",
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
