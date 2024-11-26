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
        question: "Apa arti dari kesehatan mental menurut teks?",
        correct_answer:
          "Kemampuan menghadapi tantangan hidup dan membangun hubungan sehat",
        incorrect_answer: [
          "Hidup tanpa penyakit fisik",
          "Tidak memiliki tekanan pekerjaan",
          "Menjaga gaya hidup tidak sehat",
        ],
      },
      {
        question:
          "Sebutkan salah satu aktivitas yang disebutkan dalam teks untuk meningkatkan kesehatan mental!",
        correct_answer: "Meditasi",
        incorrect_answer: [
          "Belanja",
          "Makan berlebihan",
          "Bermain game sepanjang hari",
        ],
      },
      {
        question:
          "Apa yang disebutkan sebagai faktor yang memengaruhi kesehatan mental?",
        correct_answer: "Tekanan pekerjaan",
        incorrect_answer: [
          "Tidur cukup setiap hari",
          "Makanan sehat",
          "Olahraga teratur",
        ],
      },
      {
        question:
          "Menurut teks, siapa yang bisa memberikan dukungan kesehatan mental?",
        correct_answer: "Teman atau profesional kesehatan mental",
        incorrect_answer: ["Rekan kerja", "Media sosial", "Tetangga sekitar"],
      },
      {
        question: "Apa manfaat menjaga kesehatan mental menurut teks?",
        correct_answer: "Hidup bahagia dan produktif",
        incorrect_answer: [
          "Memiliki lebih banyak waktu luang",
          "Menghilangkan semua masalah",
          "Menjadi lebih populer",
        ],
      },
      {
        question:
          "Mengapa tekanan pekerjaan bisa memengaruhi kesehatan mental?",
        correct_answer: "Karena dapat menyebabkan stres",
        incorrect_answer: [
          "Karena membuat seseorang lebih kaya",
          "Karena mendukung hubungan sosial",
          "Karena memberikan banyak istirahat",
        ],
      },
      {
        question:
          "Jelaskan bagaimana olahraga dapat membantu kesehatan mental!",
        correct_answer: "Dengan mengurangi stres dan memperbaiki suasana hati",
        incorrect_answer: [
          "Dengan meningkatkan tekanan darah",
          "Dengan menambah pekerjaan tambahan",
          "Dengan memakan banyak waktu",
        ],
      },
      {
        question:
          "Apa hubungan antara keseimbangan bekerja dan beristirahat dengan kesehatan mental?",
        correct_answer: "Membantu mengelola stres dengan baik",
        incorrect_answer: [
          "Tidak ada hubungan sama sekali",
          "Membuat seseorang sibuk sepanjang hari",
          "Memastikan kesuksesan karier",
        ],
      },
      {
        question:
          "Mengapa membangun hubungan sosial yang positif penting untuk kesehatan mental?",
        correct_answer: "Agar memiliki dukungan emosional",
        incorrect_answer: [
          "Agar terlihat populer",
          "Agar mendapatkan keuntungan finansial",
          "Agar terlihat sibuk",
        ],
      },
      {
        question: "Bagaimana meditasi membantu meningkatkan kesehatan mental?",
        correct_answer: "Dengan memberikan ketenangan dan fokus",
        incorrect_answer: [
          "Dengan membuat kita lebih sibuk",
          "Dengan meningkatkan tekanan pekerjaan",
          "Dengan mengurangi waktu bersama keluarga",
        ],
      },
      {
        question:
          "Jika seseorang merasa stres, apa langkah pertama yang bisa dia lakukan sesuai teks?",
        correct_answer: "Mengelola stres dengan baik",
        incorrect_answer: [
          "Meningkatkan beban kerja",
          "Mengabaikan masalah",
          "Tidur sepanjang hari",
        ],
      },
      {
        question:
          "Seorang siswa SMP sering merasa cemas menjelang ujian. Apa yang bisa dia lakukan berdasarkan teks?",
        correct_answer: "Berolahraga atau meditasi",
        incorrect_answer: [
          "Menunda belajar hingga menit terakhir",
          "Menghindari teman-teman sekelas",
          "Menghabiskan waktu bermain game",
        ],
      },
      {
        question:
          "Jika seseorang mengalami trauma masa lalu, siapa yang sebaiknya dia hubungi?",
        correct_answer: "Profesional kesehatan mental",
        incorrect_answer: ["Media sosial", "Rekan kerja", "Tetangga sekitar"],
      },
      {
        question:
          "Seorang teman Anda kesulitan menjaga keseimbangan hidup. Apa saran yang tepat untuknya berdasarkan teks?",
        correct_answer:
          "Mencoba menyeimbangkan antara bekerja dan beristirahat",
        incorrect_answer: [
          "Fokus hanya pada pekerjaan",
          "Menghindari semua aktivitas sosial",
          "Tidur sepanjang waktu",
        ],
      },
      {
        question:
          "Bagaimana cara seorang siswa membangun hubungan sosial yang positif sesuai teks?",
        correct_answer: "Dengan membicarakan masalah kepada teman",
        incorrect_answer: [
          "Dengan sering berdebat",
          "Dengan menghindari teman yang baik",
          "Dengan mengabaikan teman-temannya",
        ],
      },
      {
        question:
          "Apa yang menjadi perbedaan utama antara kesehatan mental dan kesehatan fisik berdasarkan teks?",
        correct_answer:
          "Kesehatan mental berkaitan dengan emosional, sedangkan kesehatan fisik berkaitan dengan tubuh",
        incorrect_answer: [
          "Kesehatan mental tidak bisa dirawat",
          "Kesehatan fisik lebih penting daripada kesehatan mental",
          "Kesehatan mental hanya untuk orang dewasa",
        ],
      },
      {
        question: "Mengapa depresi semakin umum terjadi di masyarakat modern?",
        correct_answer: "Karena tekanan pekerjaan dan trauma masa lalu",
        incorrect_answer: [
          "Karena gaya hidup sehat menjadi populer",
          "Karena akses ke profesional kesehatan mental semakin mudah",
          "Karena orang lebih bahagia",
        ],
      },
      {
        question:
          "Apa hubungan antara gaya hidup tidak sehat dengan masalah kesehatan mental?",
        correct_answer:
          "Gaya hidup tidak sehat dapat meningkatkan risiko stres dan depresi",
        incorrect_answer: [
          "Gaya hidup tidak sehat mendukung kesehatan mental",
          "Gaya hidup tidak sehat menghilangkan masalah",
          "Gaya hidup tidak sehat tidak berpengaruh apa-apa",
        ],
      },
      {
        question:
          "Jika seseorang tidak mengelola stres dengan baik, apa yang kemungkinan akan terjadi?",
        correct_answer: "Dia dapat mengalami gangguan kesehatan mental",
        incorrect_answer: [
          "Kesehatan mentalnya akan membaik",
          "Dia akan lebih produktif",
          "Tidak ada perubahan sama sekali",
        ],
      },
      {
        question:
          "Apakah mencari dukungan dari profesional kesehatan mental selalu diperlukan? Jelaskan!",
        correct_answer:
          "Ya, karena mereka memiliki keahlian yang diperlukan untuk membantu",
        incorrect_answer: [
          "Tidak, karena kesehatan mental bisa diselesaikan sendiri",
          "Tidak, karena masalah mental tidak serius",
          "Ya, karena semua orang membutuhkan terapi",
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
