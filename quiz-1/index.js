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
          "Apa yang menjadi faktor utama yang memengaruhi pergaulan bebas pada remaja?",
        correct_answer: "Gengsi, rasa penasaran, dan pengaruh teknologi",
        incorrect_answer: [
          "Pendidikan yang tinggi",
          "Tidak suka bergaul",
          "Kurangnya hiburan",
        ],
      },
      {
        question:
          "Apa yang sering kali tidak dipikirkan oleh remaja dalam pergaulan bebas?",
        correct_answer: "Akibat buruknya",
        incorrect_answer: [
          "Dampak sosial",
          "Cara memilih teman",
          "Kebebasan pribadi",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan orang tua untuk menghindari pergaulan bebas pada remaja?",
        correct_answer: "Mengawasi anak dengan baik",
        incorrect_answer: [
          "Memberikan uang saku yang cukup",
          "Mengizinkan anak bergaul dengan siapa saja",
          "Membatasi penggunaan teknologi",
        ],
      },
      {
        question:
          "Apa yang perlu diajarkan orang tua kepada anak dalam penggunaan internet",
        correct_answer: "Menggunakan internet secara bijak",
        incorrect_answer: [
          "Memanfaatkan internet untuk bisnis",
          "Mengakses internet tanpa batasan",
          "Menghindari media sosial",
        ],
      },
      {
        question: "Mengapa memilih teman yang baik penting bagi remaja",
        correct_answer: "Agar tidak terjerumus dalam pergaulan bebas",
        incorrect_answer: [
          "Agar bisa mengikuti tren",
          "Untuk diterima dalam kelompok tertentu",
          "Agar bisa mendapatkan keuntungan sosial",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan remaja agar terhindar dari pergaulan bebas",
        correct_answer: "Memilih teman yang baik",
        incorrect_answer: [
          "Mengikuti arus teman",
          "Mengikuti segala aturan",
          "Tidak bergaul dengan teman seumuran",
        ],
      },
      {
        question:
          "Mengapa berpikir matang dan bertanggung jawab penting bagi remaja",
        correct_answer: "Agar terhindar dari pergaulan bebas",
        incorrect_answer: [
          "Agar bisa lebih populer",
          "Untuk memuaskan orang tua",
          "Agar dapat mengatur waktu lebih baik",
        ],
      },
      {
        question:
          "Siapa saja yang berperan dalam memberikan pendidikan yang baik kepada remaja",
        correct_answer: "Orang tua dan guru",
        incorrect_answer: [
          "Hanya orang tua",
          "Hanya guru",
          "Hanya teman sebaya",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan masyarakat untuk menciptakan masa depan yang lebih baik bagi remaja?",
        correct_answer: "Memberikan pendidikan yang baik",
        incorrect_answer: [
          "Memberikan kebebasan kepada remaja",
          "Menghindari interaksi dengan remaja",
          "Memisahkan remaja dari masalah sosial",
        ],
      },
      {
        question:
          "Mengapa remaja sering kali ingin diterima dalam kelompok sosial tertentu?",
        correct_answer: "Karena gengsi dan rasa ingin tahu",
        incorrect_answer: [
          "Untuk mendapatkan persetujuan orang tua",
          "Agar bisa mendapatkan keuntungan materi",
          "Untuk mencari pengaruh dalam masyarakat",
        ],
      },
      {
        question:
          "Apa yang dapat terjadi jika remaja tidak memikirkan akibat buruk pergaulan bebas?",
        correct_answer: "Mereka bisa mengalami kerugian sosial dan emosional",
        incorrect_answer: [
          "Mereka bisa menjadi lebih sukses",
          "Mereka akan dihormati oleh teman-teman",
          "Mereka akan lebih mandiri",
        ],
      },
      {
        question:
          "Apa peran orang tua dalam membimbing anak untuk menggunakan internet?",
        correct_answer: "Mengajarkan cara mencari informasi dengan benar",
        incorrect_answer: [
          "Membatasi akses internet sepenuhnya",
          "Mengawasi penggunaan internet sepanjang waktu",
          "Menyediakan perangkat teknologi canggih",
        ],
      },
      {
        question: "Bagaimana cara yang tepat bagi remaja untuk memilih teman?",
        correct_answer: "Berdasarkan karakter yang baik dan positif",
        incorrect_answer: [
          "Berdasarkan status sosial teman",
          "Berdasarkan kesenangan dan minat yang sama",
          "Berdasarkan pengaruh teman dalam kelompok",
        ],
      },
      {
        question: "Apa yang dimaksud dengan berpikir matang dalam konteks ini?",
        correct_answer: "Mempertimbangkan segala dampak sebelum bertindak",
        incorrect_answer: [
          "Menunda keputusan sampai semua pilihan diketahui",
          "Mengikuti keputusan teman-teman tanpa pertimbangan",
          "Memilih jalan yang paling cepat dan mudah",
        ],
      },
      {
        question: "Mengapa pergaulan bebas dapat berdampak buruk bagi remaja?",
        correct_answer: "Dapat memengaruhi perkembangan emosional dan sosial",
        incorrect_answer: [
          "Dapat memperburuk kesehatan fisik",
          "Dapat mengganggu prestasi akademik",
          "Dapat meningkatkan popularitas",
        ],
      },
      {
        question:
          "Apa yang dimaksud dengan 'memilih teman yang baik' dalam konteks teks ini?",
        correct_answer:
          "Memilih teman yang memiliki nilai-nilai positif dan mendukung kebaikan",
        incorrect_answer: [
          "Memilih teman yang bisa memberikan manfaat ekonomi",
          "Memilih teman yang dapat memengaruhi keputusan hidup",
          "Memilih teman yang paling populer",
        ],
      },
      {
        question:
          "Apa yang harus dilakukan orang tua, guru, dan masyarakat untuk mencegah pergaulan bebas pada remaja?",
        correct_answer: "Meningkatkan pengawasan terhadap aktivitas remaja",
        incorrect_answer: [
          "Memberikan kebebasan penuh kepada remaja",
          "Menghindari memberikan pendidikan yang ketat",
          "Menciptakan aturan yang lebih longgar",
        ],
      },
      {
        question:
          "Apa dampak dari tidak mengikuti aturan agama dan hukum dalam pergaulan bebas?",
        correct_answer: "Dapat menyebabkan kerugian sosial dan moral",
        incorrect_answer: [
          "Dapat menyebabkan rasa takut pada orang tua",
          "Dapat membuat remaja merasa lebih bebas",
          "Dapat meningkatkan kreativitas remaja",
        ],
      },
      {
        question: "Apa peran teknologi dalam pergaulan bebas remaja?",
        correct_answer: "Membuka akses ke dunia tanpa batas",
        incorrect_answer: [
          "Membantu remaja menemukan teman-teman baru",
          "Membuat remaja lebih bijak dalam memilih teman",
          "Mengurangi interaksi sosial di dunia nyata",
        ],
      },
      {
        question:
          "Mengapa semua pihak harus bekerja sama dalam menciptakan masa depan yang lebih baik untuk remaja?",
        correct_answer:
          "Agar remaja terhindar dari pergaulan bebas dan dampak negatifnya",
        incorrect_answer: [
          "Agar remaja dapat lebih bebas",
          "Agar remaja bisa memperoleh banyak pengalaman",
          "Agar remaja dapat mencapai tujuan pribadi mereka",
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

      // Setelah menghitung finalScore dan sebelum menampilkan SweetAlert
      let kpmMessage = ""; // Variabel untuk menyimpan pesan KPM

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
