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
        question:
          "Apa yang dimaksud dengan makanan sehat menurut teks di atas?",
        correct_answer:
          "Makanan yang mengandung vitamin dan protein yang cukup",
        incorrect_answer: [
          "Makanan yang mengandung banyak gula",
          "Makanan yang enak dan mengenyangkan",
          "Makanan yang berasal dari restoran cepat saji",
        ],
      },
      {
        question: "Menurut teks, apa yang terkandung dalam buah jeruk?",
        correct_answer: "Vitamin C",
        incorrect_answer: ["Zat besi", "Vitamin A", "Karbohidrat"],
      },
      {
        question:
          "Sayuran apa yang disebutkan dalam teks yang kaya akan zat besi?",
        correct_answer: "Bayam",
        incorrect_answer: ["Wortel", "Kol", "Brokoli"],
      },
      {
        question:
          "Apa risiko yang dapat terjadi jika kita sering mengonsumsi makanan tidak sehat seperti makanan cepat saji?",
        correct_answer: "Terkena obesitas dan diabetes",
        incorrect_answer: [
          "Menjadi lebih pintar",
          "Menjadi lebih bugar",
          "Tubuh menjadi lebih sehat",
        ],
      },
      {
        question: "Mengapa penting untuk memilih makanan sehat setiap hari?",
        correct_answer: "Agar tubuh tetap bugar dan sehat",
        incorrect_answer: [
          "Agar tubuh lebih gemuk",
          "Agar tubuh lebih tinggi",
          "Agar tubuh lebih kuat dalam berolahraga",
        ],
      },
      {
        question:
          "Apa manfaat utama dari mengonsumsi makanan sehat seperti yang dijelaskan dalam teks?",
        correct_answer: "Meningkatkan daya tahan tubuh",
        incorrect_answer: [
          "Membuat tubuh lebih tinggi",
          "Membuat tubuh lebih kurus",
          "Membuat tubuh lebih berat",
        ],
      },
      {
        question: "Apa yang dimaksud dengan 'nutrisi' dalam konteks teks ini?",
        correct_answer:
          "Zat-zat yang dibutuhkan tubuh untuk tumbuh dan berkembang",
        incorrect_answer: [
          "Proses pencernaan makanan",
          "Jenis makanan yang enak",
          "Makanan yang mengandung kalori tinggi",
        ],
      },
      {
        question:
          "Bagaimana cara makanan sehat membantu meningkatkan daya tahan tubuh?",
        correct_answer:
          "Dengan menyediakan protein dan vitamin yang dibutuhkan",
        incorrect_answer: [
          "Dengan menyediakan kalori yang banyak",
          "Dengan mengurangi berat badan",
          "Dengan meningkatkan kecepatan tubuh bergerak",
        ],
      },
      {
        question:
          "Apa akibat dari mengonsumsi makanan cepat saji secara berlebihan?",
        correct_answer: "Lebih mudah terserang penyakit",
        incorrect_answer: [
          "Tubuh lebih berenergi",
          "Tubuh lebih kuat",
          "Berat badan lebih ideal",
        ],
      },
      {
        question: "Mengapa penting untuk merawat tubuh dengan makanan sehat?",
        correct_answer: "Agar tubuh tetap sehat dan bugar",
        incorrect_answer: [
          "Agar tubuh terlihat lebih muda",
          "Agar tubuh lebih tinggi",
          "Agar tubuh lebih berat",
        ],
      },
      {
        question:
          "Jika kamu ingin meningkatkan daya tahan tubuh, makanan apa yang harus dikonsumsi?",
        correct_answer: "Buah jeruk dan sayuran hijau",
        incorrect_answer: [
          "Makanan cepat saji dan minuman bersoda",
          "Makanan tinggi lemak",
          "Makanan manis dan tinggi gula",
        ],
      },
      {
        question:
          "Jika kamu merasa lelah dan mudah sakit, makanan apa yang perlu kamu konsumsi untuk membantu tubuh kembali bugar?",
        correct_answer: "Sayuran hijau dan buah yang kaya vitamin",
        incorrect_answer: [
          "Makanan cepat saji",
          "Makanan olahan dan camilan manis",
          "Minuman bersoda",
        ],
      },
      {
        question:
          "Dalam situasi kamu harus memilih makanan sehat, makanan mana yang lebih baik untuk kesehatan?",
        correct_answer: "Sayur sop dan buah potong",
        incorrect_answer: [
          "Sate ayam dan nasi goreng",
          "Pizza dan soda",
          "Donat dan es krim",
        ],
      },
      {
        question:
          "Jika seseorang ingin menjaga stamina tubuhnya, makanan apa yang bisa membantu?",
        correct_answer: "Sayuran yang mengandung zat besi",
        incorrect_answer: [
          "Makanan dengan banyak gula",
          "Makanan dengan banyak garam",
          "Makanan instan",
        ],
      },
      {
        question:
          "Kamu ingin menjaga tubuh tetap sehat, makanan apa yang lebih baik dipilih?",
        correct_answer: "Sayuran hijau, buah, dan biji-bijian",
        incorrect_answer: [
          "Makanan cepat saji dan camilan manis",
          "Minuman bersoda dan makanan olahan",
          "Daging olahan dan makanan berlemak tinggi",
        ],
      },
      {
        question:
          "Apa yang bisa terjadi jika seseorang tidak menjaga pola makan dan sering makan makanan yang tidak sehat?",
        correct_answer:
          "Tubuh menjadi lebih mudah lelah dan berisiko terkena penyakit",
        incorrect_answer: [
          "Tubuh tetap bugar dan sehat",
          "Tubuh menjadi lebih tahan terhadap penyakit",
          "Tubuh menjadi lebih kuat dan tahan banting",
        ],
      },
      {
        question:
          "Bagaimana makanan sehat berkontribusi terhadap masa depan tubuh kita?",
        correct_answer:
          "Dengan membuat tubuh lebih kuat dan sehat untuk jangka panjang",
        incorrect_answer: [
          "Dengan mengurangi berat badan secara cepat",
          "Dengan memberikan banyak kalori",
          "Dengan membuat tubuh lebih tinggi",
        ],
      },
      {
        question:
          "Jika seseorang mengonsumsi makanan yang tidak sehat secara terus-menerus, apa yang mungkin terjadi pada tubuhnya dalam jangka panjang?",
        correct_answer:
          "Mengalami masalah kesehatan seperti obesitas dan diabetes",
        incorrect_answer: [
          "Menjadi lebih sehat",
          "Menjadi lebih bugar",
          "Menjadi lebih kuat",
        ],
      },
      {
        question:
          "Apa hubungan antara mengonsumsi makanan sehat dan sistem kekebalan tubuh?",
        correct_answer:
          "Makanan sehat meningkatkan daya tahan tubuh, membuat kita lebih tahan terhadap penyakit",
        incorrect_answer: [
          "Makanan sehat membuat kita lebih gemuk",
          "Makanan sehat membuat tubuh lebih ringan",
          "Makanan sehat mengurangi rasa lapar",
        ],
      },
      {
        question:
          "Mengapa memilih makanan sehat disebut sebagai investasi terbaik untuk tubuh?",
        correct_answer:
          "Karena makanan sehat dapat membantu tubuh tetap sehat dan bugar untuk jangka panjang",
        incorrect_answer: [
          "Karena makanan sehat membuat tubuh lebih besar",
          "Karena makanan sehat lebih murah",
          "Karena makanan sehat membuat tubuh lebih tinggi",
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
