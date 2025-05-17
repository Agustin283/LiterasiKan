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
          "Apa langkah pertama yang harus dilakukan seseorang untuk memulai pengembangan diri?",
        correct_answer: "Menetapkan tujuan pribadi dan profesional.",
        incorrect_answer: [
          "Menunggu kesempatan datang sendiri.",
          "Mengabaikan semua pelatihan yang ada.",
          "Fokus pada pekerjaan saat ini tanpa perubahan.",
        ],
      },
      {
        question:
          "Mengapa penting bagi individu untuk terus belajar sepanjang hidup mereka?",
        correct_answer: "Untuk tetap relevan dan beradaptasi dengan perubahan.",
        incorrect_answer: [
          "Agar bisa mendapatkan pekerjaan dengan gaji tinggi.",
          "Agar tidak kehilangan pekerjaan saat ini.",
          "Karena semua orang melakukannya.",
        ],
      },
      {
        question:
          "Apa langkah pertama yang harus dilakukan seseorang untuk memulai pengembangan diri?",
        correct_answer: "Menetapkan tujuan pribadi dan profesional.",
        incorrect_answer: [
          "Menunggu kesempatan datang sendiri.",
          "Mengabaikan semua pelatihan yang ada.",
          "Fokus pada pekerjaan saat ini tanpa perubahan.",
        ],
      },
      {
        question: "Apa arti dari pengembangan diri dalam konteks karir?",
        correct_answer: "Upaya untuk meningkatkan keterampilan dan pengetahuan",
        incorrect_answer: [
          "Proses belajar tanpa tujuan",
          "Menghindari pelatihan",
          "Fokus pada pekerjaan saat ini",
        ],
      },
      {
        question: "Mengapa menetapkan tujuan penting dalam pengembangan diri?",
        correct_answer: "Agar lebih fokus dalam mencapai apa yang diinginkan",
        incorrect_answer: [
          "Agar bisa bersaing dengan orang lain",
          "Untuk mendapatkan pekerjaan dengan gaji tinggi",
          "Untuk menghindari pekerjaan berat",
        ],
      },
      {
        question:
          "Apa kesimpulan tentang pentingnya membangun jaringan profesional?",
        correct_answer: "Jaringan membantu mendapatkan informasi dan peluang.",
        incorrect_answer: [
          "Jaringan tidak berpengaruh pada karir.",
          "Hanya orang-orang tertentu yang perlu membangun jaringan.",
          "Jaringan hanya penting bagi pemimpin perusahaan.",
        ],
      },
      {
        question:
          "Mengapa pendidikan formal dianggap penting meskipun ada kursus online?",
        correct_answer: "Pendidikan formal memberikan gelar akademis.",
        incorrect_answer: [
          "Karena pendidikan formal lebih mahal.",
          "Pendidikan formal tidak relevan lagi.",
          "Pendidikan formal hanya untuk siswa muda.",
        ],
      },
      {
        question:
          "Apa dampak mengikuti kursus tambahan terhadap karir seseorang?",
        correct_answer: "Meningkatkan kompetensi dan keterampilan.",
        incorrect_answer: [
          "Tidak ada dampak yang signifikan.",
          "Mengurangi waktu untuk bekerja.",
          "Membuat seseorang merasa lebih stres.",
        ],
      },
      {
        question:
          "Bagaimana cara individu memulai kemajuan mereka dalam pengembangan diri?",
        correct_answer:
          "Dengan menetapkan tujuan dan menilai pencapaian secara berkala.",
        incorrect_answer: [
          "Dengan meminta pendapat orang lain tanpa refleksi pribadi.",
          "Dengan mengabaikan hasil kerja mereka.",
          "Dengan membandingkan diri dengan teman-teman saja.",
        ],
      },
      {
        question:
          "Seberapa efektifkah strategi menetapkan tujuan SMART dalam pengembangan diri?",
        correct_answer: "Sangat efektif jika diterapkan dengan benar.",
        incorrect_answer: [
          "Tidak efektif sama sekali.",
          "Hanya efektif untuk beberapa orang.",
          "Efektif hanya dalam konteks pendidikan formal.",
        ],
      },
      {
        question: "Apa tantangan utama dalam membangun jaringan profesional?",
        correct_answer: "Rasa canggung saat berinteraksi dengan orang lain.",
        incorrect_answer: [
          "Kurangnya kesempatan untuk bertemu orang baru.",
          "Tidak ada manfaat dari jaringan tersebut.",
          "Semua orang sudah memiliki jaringan besar.",
        ],
      },
      {
        question:
          "Mengapa penting bagi individu untuk terus belajar sepanjang hidup mereka?",
        correct_answer: "Agar bisa mendapatkan pekerjaan dengan gaji tinggi.",
        incorrect_answer: ["", "", ""],
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
      const paket = localStorage.getItem("paket") || "6"; // Default '1' jika null

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
