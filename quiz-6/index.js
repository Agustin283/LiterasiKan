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
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbyGuzWzrcZeA557yR480r_zSBpcMT5s2WV-B6erpN7Fo147CcylYAKEuQ21Z-VSkviB/exec";

      // Ambil data dari localStorage
      const wpm = localStorage.getItem("readingSpeed");
      const nama = localStorage.getItem("nama") || "12"; // Default '12' jika null
      const absen = localStorage.getItem("absen") || "12"; // Default '12' jika null
      const paket = localStorage.getItem("paket") || "1"; // Default '1' jika null

      if (!wpm) {
        console.error(
          "Kecepatan Membaca atau Skor Quiz tidak ditemukan di LocalStorage."
        );
        return; // Hentikan jika data tidak valid
      }

      const finalScore = parseInt((wpm * score) / 100);

      // Data yang akan dikirim ke spreadsheet
      const formData = {
        nama: nama,
        absen: absen,
        hasil: finalScore,
        paket: paket,
      };

      // Kirim data ke Google Apps Script
      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Menonaktifkan CORS
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Response gagal: " + response.statusText);
          }
          return response.json();
        })
        .then((result) => {
          console.log("Response dari server:", result);
          if (result.success) {
            console.log("Data berhasil dikirim ke spreadsheet.");
          } else {
            console.error("Gagal mengirim data:", result.message);
          }
        })
        .catch((error) => {
          console.error("Terjadi kesalahan saat mengirim data:", error);
        })
        .finally(() => {
          // Bersihkan localStorage dan kembali ke halaman utama
          localStorage.removeItem("readingSpeed");
          localStorage.removeItem("nama");
          localStorage.removeItem("absen");
        });

      // Tampilkan popup SweetAlert setelah pengiriman data
      Swal.fire({
        title: "Hasil KEM",
        html: `<div style="text-align: justify; justify-content: center; max-width: fit-content; margin-left: auto; margin-right: auto;">
        Kecepatan Membaca &nbsp;: <b>${wpm} WPM</b> <br>
        Skor Quiz   &nbsp;&emsp;&emsp;&emsp;&emsp;&emsp;: <b>${score}%</b> <br>
        Hasil Akhir &nbsp;&nbsp;&ensp;&emsp;&emsp;&emsp;&emsp;: <b>${finalScore}</b>
      </div>`,
        icon: "success",
      }).finally(() => {
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
