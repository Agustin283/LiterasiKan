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
        question: "Apa peran utama hutan dalam kehidupan di bumi?",
        correct_answer: "Menyerap karbon dioksida dan melepaskan oksigen",
        incorrect_answer: [
          "Menyerap oksigen",
          "Menghasilkan makanan untuk manusia",
          "Menjaga keberagaman spesies manusia",
        ],
      },
      {
        question: "Mengapa hutan penting untuk kelangsungan hidup manusia?",
        correct_answer:
          "Karena hutan menyerap karbon dioksida dan melepaskan oksigen",
        incorrect_answer: [
          "Karena hutan memberikan tempat tinggal bagi manusia",
          "Karena hutan menyediakan produk komersial",
          "Karena hutan mencegah banjir",
        ],
      },
      {
        question: "Hutan menyediakan tempat tinggal bagi...?",
        correct_answer: "Spesies flora dan fauna di alam",
        incorrect_answer: [
          "Hanya spesies manusia",
          "Hanya spesies hewan",
          "Spesies tumbuhan di bumi",
        ],
      },
      {
        question: "Apa yang bergantung pada hutan untuk bertahan hidup?",
        correct_answer: "Flora dan fauna",
        incorrect_answer: ["Hanya manusia", "Hanya flora", "Hanya fauna"],
      },
      {
        question: "Bagaimana hutan membantu menjaga ketersediaan air bersih?",
        correct_answer:
          "Dengan menyerap air hujan dan mengalirkannya ke sungai",
        incorrect_answer: [
          "Dengan menyaring air hujan",
          "Dengan menjaga kelestarian tanah",
          "Dengan mengatur aliran sungai",
        ],
      },
      {
        question: "Hutan dapat mencegah...?",
        correct_answer: "Erosi tanah",
        incorrect_answer: [
          "Banjir",
          "Penggundulan hutan",
          "Penurunan kualitas udara",
        ],
      },
      {
        question:
          "Apa yang dapat merusak lingkungan terkait dengan erosi tanah?",
        correct_answer: "Penggundulan hutan",
        incorrect_answer: [
          "Reboisasi",
          "Pengelolaan hutan yang berkelanjutan",
          "Pengurangan penggunaan produk hutan",
        ],
      },
      {
        question: "Untuk menjaga kelestarian hutan, apa yang perlu dilakukan?",
        correct_answer: "Reboisasi secara rutin",
        incorrect_answer: [
          "Pengelolaan hutan yang tidak teratur",
          "Mengurangi jumlah tanaman di hutan",
          "Meningkatkan penebangan pohon",
        ],
      },
      {
        question: "Apa yang sangat penting dalam pengelolaan hutan?",
        correct_answer: "Pengelolaan yang berkelanjutan",
        incorrect_answer: [
          "Menanam pohon secara sembarangan",
          "Menurunkan kualitas udara",
          "Menebang pohon lebih cepat",
        ],
      },
      {
        question: "Apa yang dapat membantu menjaga kelestarian hutan?",
        correct_answer:
          "Mengurangi penggunaan produk hutan yang tidak ramah lingkungan",
        incorrect_answer: [
          "Menebang pohon lebih sering",
          "Menggunakan produk hutan tanpa batas",
          "Mengurangi jumlah tanaman hutan",
        ],
      },
      {
        question: "Apa dampak negatif dari penggundulan hutan?",
        correct_answer: "Mengurangi habitat untuk flora dan fauna",
        incorrect_answer: [
          "Menurunnya kualitas udara",
          "Meningkatnya ketersediaan air bersih",
          "Mengurangi kualitas tanah",
        ],
      },
      {
        question:
          "Apa yang bisa terjadi jika hutan dikelola secara tidak berkelanjutan?",
        correct_answer: "Kerusakan lingkungan akan semakin parah",
        incorrect_answer: [
          "Hutan akan tumbuh subur",
          "Kualitas udara akan meningkat",
          "Ketersediaan air bersih akan terjamin",
        ],
      },
      {
        question: "Apa yang dimaksud dengan reboisasi?",
        correct_answer:
          "Penanaman pohon kembali untuk menggantikan yang hilang",
        incorrect_answer: [
          "Menanam pohon secara serampangan",
          "Penebangan pohon secara berkelanjutan",
          "Penghentian penanaman pohon sama sekali",
        ],
      },
      {
        question: "Apa manfaat utama dari reboisasi?",
        correct_answer: "Semua jawaban benar",
        incorrect_answer: [
          "Menjaga kelestarian hutan",
          "Meningkatkan kualitas udara",
          "Mengurangi erosi tanah",
        ],
      },
      {
        question: "Mengapa pengelolaan hutan yang berkelanjutan penting?",
        correct_answer: "Agar hutan tetap ada untuk generasi berikutnya",
        incorrect_answer: [
          "Agar pohon dapat ditebang dengan bebas",
          "Agar hutan bisa dimanfaatkan secara maksimal",
          "Agar dapat mengurangi lahan pertanian",
        ],
      },
      {
        question:
          "Apa dampak buruk dari penggunaan produk hutan yang tidak ramah lingkungan?",
        correct_answer: "Mengancam kelestarian hutan dan lingkungan",
        incorrect_answer: [
          "Membantu melestarikan hutan",
          "Meningkatkan kesejahteraan masyarakat",
          "Meningkatkan keberagaman flora dan fauna",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan untuk menjaga kelestarian hutan bagi kehidupan manusia dan hewan?",
        correct_answer: "Melakukan reboisasi dan pengelolaan berkelanjutan",
        incorrect_answer: [
          "Menghentikan penanaman pohon",
          "Menambah jumlah penebangan pohon",
          "Meningkatkan penggunaan produk hutan",
        ],
      },
      {
        question:
          "Bagaimana hutan menjaga ketersediaan air bersih bagi manusia?",
        correct_answer: "Dengan menjaga kualitas tanah dan air",
        incorrect_answer: [
          "Dengan mengurangi penyerapan air tanah",
          "Dengan mengalirkan air hujan ke laut",
          "Dengan menyediakan sumber air baru setiap hari",
        ],
      },
      {
        question: "Apa yang dapat membantu mengurangi penggundulan hutan?",
        correct_answer: "Pengelolaan hutan yang bijaksana",
        incorrect_answer: [
          "Peningkatan penebangan pohon",
          "Meningkatkan produksi kayu",
          "Mengurangi penggunaan produk hutan",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan oleh setiap individu untuk membantu kelestarian hutan?",
        correct_answer:
          "Mengurangi penggunaan produk hutan yang tidak ramah lingkungan",
        incorrect_answer: [
          "Menghindari produk hutan",
          "Menanam pohon di daerah yang tidak memiliki hutan",
          "Tidak terlibat dalam reboisasi",
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
      const paket = localStorage.getItem("paket") || "3"; // Default '1' jika null

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

      if (finalScore >= 175) {
        kpmMessage =
          "Sesuai dengan Kriteria Ketuntasan Minimal (KKM) untuk siswa SMP, mencakup kecepatan dan pemahaman yang baik.";
      } else if (finalScore >= 105 && finalScore < 175) {
        kpmMessage =
          "Memerlukan latihan intensif dan pengayaan kosakata untuk meningkatkan pemahaman serta KEM.";
      } else {
        kpmMessage =
          "Membutuhkan dukungan berupa metode pengajaran inovatif dan motivasi tambahan.";
      }

      // Tampilkan popup SweetAlert setelah pengiriman data
      Swal.fire({
        title: "Hasil KEM",
        html: `
            <div style="text-align: justify; justify-content: center; max-width: fit-content; margin-left: auto; margin-right: auto;">
              <span style="display: inline-block; width: 200px;">Nama</span>: <b>${nama}</b> <br>
              <span style="display: inline-block; width: 200px;">Absen</span>: <b>${absen}</b> <br>
              <span style="display: inline-block; width: 200px;">Kecepatan Membaca</span>: <b>${wpm} WPM</b> <br>
              <span style="display: inline-block; width: 200px;">Skor Quiz</span>: <b>${score}%</b> <br>
              <span style="display: inline-block; width: 200px;">Jumlah Soal Benar</span>: <b>${
                score / CORRECT_BONUS
              }</b> <br>
              <span style="display: inline-block; width: 200px;">Hasil Akhir</span>: <b>${finalScore}</b> <br>
              <br>
              ${kpmMessage} <!-- Menambahkan pesan KPM -->
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
