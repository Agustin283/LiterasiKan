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
        question: "Apa yang dimaksud dengan pergaulan bebas menurut teks?",
        correct_answer: "Perilaku buruk yang tidak sesuai norma",
        incorrect_answer: [
          "Perilaku sesuai norma",
          "Perilaku baik yang diterima masyarakat",
          "Perilaku yang bebas tanpa batas",
        ],
      },
      {
        question:
          "Apa saja penyebab remaja terjerumus ke dalam pergaulan bebas?",
        correct_answer: "Gengsi, rasa penasaran, dan pengaruh teknologi",
        incorrect_answer: [
          "Pendidikan yang tinggi",
          "Tidak suka bergaul",
          "Kurangnya hiburan",
        ],
      },
      {
        question:
          "Siapa yang diharapkan berperan dalam mengawasi anak agar tidak terjerumus ke pergaulan bebas?",
        correct_answer: "Orang tua",
        incorrect_answer: ["Guru", "Tetangga", "Teman sebaya"],
      },
      {
        question:
          "Teknologi yang makin maju dapat memiliki pengaruh terhadap...",
        correct_answer: "Pergaulan bebas",
        incorrect_answer: [
          "Pendidikan yang baik",
          "Karakter bangsa",
          "Kebiasaan hidup sehat",
        ],
      },
      {
        question: "Apa pesan utama dari teks yang dibahas?",
        correct_answer:
          "Pergaulan bebas memiliki dampak buruk yang harus dihindari.",
        incorrect_answer: [
          "Remaja perlu menjaga hubungan baik dengan teman.",
          "Teknologi modern mempermudah kehidupan manusia.",
          "Orang tua tidak perlu khawatir terhadap perkembangan anak.",
        ],
      },
      {
        question:
          "Mengapa orang tua perlu mengajarkan penggunaan internet yang bijak kepada anak?",
        correct_answer: "Agar anak tidak masuk ke dalam hal buruk",
        incorrect_answer: [
          "Agar anak tidak ketinggalan zaman",
          "Agar anak memahami teknologi baru",
          "Agar anak memiliki banyak teman",
        ],
      },
      {
        question: 'Apa yang dimaksud dengan "salah bergaul" dalam teks?',
        correct_answer: "Terpengaruh oleh teman yang tidak baik",
        incorrect_answer: [
          "Tidak memiliki teman yang banyak",
          "Memilih-milih teman dalam bergaul",
          "Tidak mengikuti tren yang ada",
        ],
      },
      {
        question:
          "Apa tujuan remaja yang terjerumus dalam pergaulan bebas ingin dipuji?",
        correct_answer: "Agar terlihat keren dan gaul",
        incorrect_answer: [
          "Agar merasa lebih dewasa",
          "Agar mendapat banyak teman",
          "Agar lebih dihormati oleh guru",
        ],
      },
      {
        question: "Bagaimana seorang remaja dapat menghindari pergaulan bebas?",
        correct_answer: "Dengan tetap mematuhi norma-norma agama dan hukum",
        incorrect_answer: [
          "Dengan menjauhi semua teman",
          "Dengan mengikuti semua tren terbaru",
          "Dengan menghindari penggunaan teknologi",
        ],
      },
      {
        question:
          "Apa tindakan pertama yang dapat dilakukan orang tua untuk mencegah anak masuk dalam pergaulan bebas?",
        correct_answer: "Mengawasi dan mendidik anak dengan tegas",
        incorrect_answer: [
          "Membelikan gadget terbaru",
          "Memarahi anak setiap hari",
          "Membatasi pergaulan anak sepenuhnya",
        ],
      },
      {
        question:
          "Seorang teman mengajak kamu melakukan hal yang tidak sesuai norma. Apa langkah terbaik yang bisa kamu ambil?",
        correct_answer: "Menolak dengan sopan dan memberi alasan",
        incorrect_answer: [
          "Mengikuti agar tidak dianggap ketinggalan zaman",
          "Melaporkan kepada guru atau orang tua",
          "Membalas dengan melakukan hal yang sama",
        ],
      },
      {
        question:
          "Jika kamu melihat teman terjerumus dalam pergaulan bebas, apa yang sebaiknya kamu lakukan?",
        correct_answer: "Mengajak dia untuk berbicara dan memberi saran",
        incorrect_answer: [
          "Membiarkan karena itu bukan urusanmu",
          "Melaporkan dia ke pihak berwajib",
          "Menyindir dia di media sosial",
        ],
      },
      {
        question:
          "Apa hubungan antara kemajuan teknologi dan pergaulan bebas dalam teks?",
        correct_answer:
          "Kemajuan teknologi mempermudah akses terhadap hal buruk.",
        incorrect_answer: [
          "Kemajuan teknologi selalu membawa dampak positif.",
          "Teknologi membuat remaja lebih religius.",
          "Teknologi tidak terkait dengan pergaulan bebas.",
        ],
      },
      {
        question:
          "Mengapa norma agama dan hukum dianggap penting dalam mencegah pergaulan bebas?",
        correct_answer:
          "Karena norma tersebut menjadi panduan hidup yang benar.",
        incorrect_answer: [
          "Karena norma tersebut memberikan sanksi berat.",
          "Karena norma tersebut tidak bisa dilanggar.",
          "Karena norma tersebut membatasi kreativitas remaja.",
        ],
      },
      {
        question:
          "Apa perbedaan antara penggunaan internet secara bijak dan tidak bijak dalam kaitannya dengan pergaulan bebas?",
        correct_answer:
          "Penggunaan bijak memperkuat karakter positif, sedangkan tidak bijak membuka peluang masuk ke pergaulan bebas.",
        incorrect_answer: [
          "Penggunaan bijak membuat remaja menjadi terkenal, sedangkan tidak bijak membuat remaja lebih kreatif.",
          "Penggunaan bijak menghindarkan remaja dari pekerjaan, sedangkan tidak bijak meningkatkan prestasi.",
          "Penggunaan bijak selalu buruk, sedangkan tidak bijak selalu baik.",
        ],
      },
      {
        question:
          "Bagaimana norma timur memengaruhi sikap masyarakat terhadap pergaulan bebas?",
        correct_answer:
          "Norma timur menolak perilaku yang melanggar nilai moral.",
        incorrect_answer: [
          "Norma timur mendorong kebebasan tanpa batas.",
          "Norma timur tidak relevan dengan kondisi saat ini.",
          "Norma timur hanya diterapkan oleh kalangan tertentu.",
        ],
      },
      {
        question:
          "Setujukah kamu bahwa salah satu penyebab pergaulan bebas adalah rasa gengsi? Berikan alasan singkat.",
        correct_answer:
          "Setuju, karena gengsi membuat remaja ingin diterima kelompoknya.",
        incorrect_answer: [
          "Tidak setuju, karena gengsi tidak memengaruhi pergaulan bebas.",
          "Setuju, karena gengsi membuat remaja fokus pada pendidikan.",
          "Tidak setuju, karena gengsi adalah sifat positif.",
        ],
      },
      {
        question:
          "Apakah tindakan tegas orang tua selalu efektif dalam mencegah pergaulan bebas?",
        correct_answer:
          "Tidak selalu efektif, tergantung cara orang tua mendidik.",
        incorrect_answer: [
          "Selalu efektif, karena anak akan takut melanggar aturan.",
          "Tidak efektif, karena anak akan semakin memberontak.",
          "Sangat efektif, karena anak selalu mengikuti orang tua.",
        ],
      },
      {
        question:
          "Bagaimana pendapatmu tentang teknologi sebagai salah satu faktor penyebab pergaulan bebas?",
        correct_answer:
          "Teknologi netral, pengaruhnya tergantung pada pengguna.",
        incorrect_answer: [
          "Teknologi adalah faktor utama dari pergaulan bebas.",
          "Teknologi tidak relevan dengan pergaulan bebas.",
          "Teknologi selalu memberikan dampak buruk.",
        ],
      },
      {
        question:
          "Apa evaluasi yang bisa diberikan kepada teks terkait upaya menghindari pergaulan bebas?",
        correct_answer: "Teks memberikan solusi konkret yang dapat diterapkan.",
        incorrect_answer: [
          "Teks hanya membahas penyebab tanpa memberikan solusi.",
          "Teks terlalu menekankan pada teknologi sebagai masalah utama.",
          "Teks tidak relevan untuk remaja masa kini.",
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
