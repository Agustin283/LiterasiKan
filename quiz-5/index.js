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
        question: "Apa tujuan utama dari pendidikan karakter?",
        correct_answer: "Membentuk pribadi yang berakhlak mulia",
        incorrect_answer: [
          "Meningkatkan kecerdasan intelektual",
          "Menambah pengetahuan umum",
          "Melatih keterampilan akademik",
        ],
      },
      {
        question:
          "Siapa saja yang berperan dalam pendidikan karakter menurut teks?",
        correct_answer: "Sekolah, keluarga, dan masyarakat",
        incorrect_answer: [
          "Guru di sekolah saja",
          "Orang tua saja",
          "Pemerintah pusat",
        ],
      },
      {
        question:
          "Nilai-nilai karakter apa yang disebutkan perlu ditanamkan sejak dini?",
        correct_answer:
          "Kejujuran, tanggung jawab, hormat, peduli, dan gotong royong",
        incorrect_answer: [
          "Ambisi, persaingan, dan ego",
          "Keberanian, kesombongan, dan kemandirian",
          "Kekuasaan, kecerdasan, dan keberuntungan",
        ],
      },
      {
        question: "Apa dampak memiliki karakter yang baik bagi seseorang?",
        correct_answer: "Lebih mudah beradaptasi dengan lingkungan sosial",
        incorrect_answer: [
          "Lebih mudah mendapatkan pekerjaan",
          "Mendapatkan banyak pujian",
          "Meningkatkan status sosial",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan 'memberikan contoh yang baik' dalam pendidikan karakter?",
        correct_answer:
          "Menunjukkan perilaku positif dalam kehidupan sehari-hari",
        incorrect_answer: [
          "Memberikan hadiah kepada siswa yang rajin",
          "Membuat peraturan ketat di sekolah",
          "Menghindari diskusi tentang moralitas",
        ],
      },
      {
        question: "Mengapa remaja mudah terjerumus ke dalam pergaulan bebas?",
        correct_answer: "Karena ingin dianggap gaul oleh teman-temannya",
        incorrect_answer: [
          "Karena kurang perhatian dari keluarga",
          "Karena tuntutan lingkungan sosial",
          "Karena aturan yang terlalu ketat",
        ],
      },
      {
        question: "Apa arti 'salah bergaul' menurut teks?",
        correct_answer: "Mudah terpengaruh oleh teman yang tidak benar",
        incorrect_answer: [
          "Memilih teman berdasarkan status sosial",
          "Berteman dengan orang yang tidak seiman",
          "Menghindari semua bentuk pergaulan",
        ],
      },
      {
        question:
          "Bagaimana pendidikan karakter dilakukan secara efektif menurut teks?",
        correct_answer:
          "Dengan memberikan contoh, pengajaran langsung, dan kegiatan positif",
        incorrect_answer: [
          "Dengan memberikan hukuman keras",
          "Dengan fokus pada nilai akademik saja",
          "Dengan membatasi interaksi siswa dengan masyarakat",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan remaja sebelum melakukan suatu tindakan?",
        correct_answer: "Berpikir panjang tentang dampaknya",
        incorrect_answer: [
          "Bertanya pada teman",
          "Mencari popularitas",
          "Mengikuti tren terkini",
        ],
      },
      {
        question: "Mengapa norma agama dan hukum penting dalam pergaulan?",
        correct_answer:
          "Untuk menjaga perilaku agar tetap sesuai dengan nilai moral",
        incorrect_answer: [
          "Untuk mencegah remaja menjadi terlalu mandiri",
          "Agar remaja dihormati oleh teman-temannya",
          "Untuk menghindari aturan yang terlalu bebas",
        ],
      },
      {
        question:
          "Apa kaitan antara pendidikan karakter dan keberhasilan hidup seseorang?",
        correct_answer:
          "Pendidikan karakter membantu seseorang membangun koneksi sosial yang sehat",
        incorrect_answer: [
          "Pendidikan karakter hanya berfokus pada nilai moral tanpa efek nyata pada kehidupan",
          "Pendidikan karakter menjamin kesuksesan finansial",
          "Pendidikan karakter mengajarkan bagaimana memenangkan persaingan",
        ],
      },
      {
        question:
          "Jika seorang siswa mengalami kesulitan bersikap jujur, apa langkah terbaik yang dapat dilakukan oleh gurunya?",
        correct_answer: "Memberikan nasihat dan contoh sikap jujur",
        incorrect_answer: [
          "Memberikan hukuman fisik",
          "Mengabaikan masalah tersebut",
          "Meminta siswa tersebut menulis esai tentang kejujuran",
        ],
      },
      {
        question: "Apa dampak negatif dari pergaulan bebas bagi remaja?",
        correct_answer: "Kehilangan kendali atas nilai moralnya",
        incorrect_answer: [
          "Mendapatkan banyak pengalaman sosial",
          "Menjadi lebih terkenal di kalangan teman-temannya",
          "Memiliki lebih banyak waktu luang",
        ],
      },
      {
        question:
          "Mengapa berpikir panjang sebelum bertindak sangat penting bagi remaja?",
        correct_answer:
          "Untuk mempertimbangkan dampak baik dan buruk bagi dirinya, keluarga, dan orang lain",
        incorrect_answer: [
          "Untuk memastikan tindakan tersebut sesuai tren",
          "Agar tidak dimarahi oleh orang tua",
          "Agar lebih cepat mengambil keputusan",
        ],
      },
      {
        question:
          "Bagaimana cara orang tua dapat mendukung pendidikan karakter anak?",
        correct_answer:
          "Dengan menunjukkan sikap yang mencerminkan nilai-nilai moral",
        incorrect_answer: [
          "Dengan memberikan kebebasan tanpa batas",
          "Dengan memarahi anak jika berbuat salah",
          "Dengan menyerahkan seluruh pendidikan pada sekolah",
        ],
      },
      {
        question:
          "Apa hubungan antara pendidikan karakter dan penghindaran pergaulan bebas?",
        correct_answer:
          "Pendidikan karakter memberikan pemahaman moral agar siswa tidak mudah terpengaruh",
        incorrect_answer: [
          "Pendidikan karakter mengajarkan siswa cara memilih teman yang populer",
          "Pendidikan karakter membuat siswa takut bersosialisasi",
          "Pendidikan karakter tidak memiliki hubungan dengan pergaulan",
        ],
      },
      {
        question:
          "Apa yang terjadi jika remaja tidak memiliki pendidikan karakter yang baik?",
        correct_answer:
          "Mereka dapat terjerumus dalam tindakan yang tidak bermoral",
        incorrect_answer: [
          "Mereka akan lebih berani menghadapi dunia",
          "Mereka akan menjadi lebih mandiri",
          "Mereka lebih mudah sukses di kehidupan sosial",
        ],
      },
      {
        question:
          "Bagaimana seseorang bisa memberikan contoh baik dalam lingkungan masyarakat?",
        correct_answer:
          "Dengan bersikap jujur dan peduli terhadap orang sekitar",
        incorrect_answer: [
          "Dengan mengikuti semua keinginan orang lain",
          "Dengan tidak terlibat dalam aktivitas sosial",
          "Dengan menunjukkan kekuasaan yang dimiliki",
        ],
      },
      {
        question:
          "Apa yang membuat generasi muda menjadi generasi berkualitas dan berintegritas?",
        correct_answer: "Pendidikan karakter yang efektif",
        incorrect_answer: [
          "Fokus pada nilai akademik",
          "Keberhasilan finansial sejak dini",
          "Memiliki hubungan sosial yang luas",
        ],
      },
      {
        question:
          "Jika Anda adalah seorang guru, bagaimana cara melibatkan siswa dalam kegiatan yang menumbuhkan karakter positif?",
        correct_answer:
          "Mengadakan kegiatan gotong royong di lingkungan sekolah",
        incorrect_answer: [
          "Memberikan tugas rumah yang banyak",
          "Memberikan ceramah moral setiap hari",
          "Membatasi interaksi siswa di luar kelas",
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
