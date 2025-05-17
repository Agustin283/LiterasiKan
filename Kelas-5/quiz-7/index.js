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
      [
        {
          question: "Siapakah RA Kartini?",
          correct_answer: "Pelopor emansipasi wanita di Indonesia",
          incorrect_answer: [
            "Pahlawan pendidikan untuk laki-laki",
            "Istri dari seorang bupati terkenal",
            "Tokoh revolusi kemerdekaan",
          ],
        },
        {
          question: "Mengapa Kartini harus berhenti sekolah di usia 12 tahun?",
          correct_answer: "Karena tradisi pingitan pada gadis bangsawan",
          incorrect_answer: [
            "Karena ia tidak suka belajar",
            "Karena sekolah Belanda ditutup",
            "Karena ia harus bekerja membantu keluarga",
          ],
        },
        {
          question:
            "Apa yang membuat Kartini memiliki wawasan tentang kesetaraan gender?",
          correct_answer:
            "Ia banyak membaca buku dan majalah berbahasa Belanda",
          incorrect_answer: [
            "Ia sering bertemu dengan tokoh revolusi",
            "Ia belajar di luar negeri",
            "Ia mendirikan banyak sekolah untuk laki-laki",
          ],
        },
        {
          question: "Apa judul buku yang berisi kumpulan surat-surat Kartini?",
          correct_answer: "Habis Gelap Terbitlah Terang",
          incorrect_answer: [
            "Perempuan dan Pendidikan",
            "Cahaya Kartini",
            "Perjuangan Perempuan Indonesia",
          ],
        },
        {
          question: "Apa harapan Kartini melalui sekolah yang ia dirikan?",
          correct_answer:
            "Agar perempuan Indonesia menjadi lebih mandiri dan terdidik",
          incorrect_answer: [
            "Agar perempuan Indonesia bisa bekerja di pemerintahan",
            "Agar perempuan Indonesia bisa membaca dan menulis",
            "Agar perempuan Indonesia bisa belajar agama",
          ],
        },
        {
          question:
            "Mengapa tanggal 21 April diperingati sebagai Hari Kartini?",
          correct_answer: "Karena hari itu adalah hari lahir Kartini",
          incorrect_answer: [
            "Karena hari itu adalah hari wafatnya Kartini",
            "Karena hari itu Kartini mendirikan sekolah",
            "Karena hari itu Kartini menulis surat pertamanya",
          ],
        },
        {
          question: "Apa yang dimaksud dengan “Habis Gelap Terbitlah Terang”?",
          correct_answer:
            "Perempuan harus keluar dari ketertinggalan menuju masa depan yang cerah",
          incorrect_answer: [
            "Perempuan harus menerima takdirnya",
            "Perempuan tidak perlu belajar",
            "Perempuan hanya boleh belajar di rumah",
          ],
        },
        {
          question:
            "Apa yang dilakukan Kartini untuk membantu perempuan Indonesia?",
          correct_answer: "Ia membuka sekolah untuk anak-anak perempuan",
          incorrect_answer: [
            "Ia menyusun undang-undang tentang pendidikan",
            "Ia menjadi guru di sekolah Belanda",
            "Ia memberikan ceramah kepada bangsawan",
          ],
        },
        {
          question: "Apa yang menjadi fokus perjuangan Kartini?",
          correct_answer: "Memberikan pendidikan untuk semua perempuan",
          incorrect_answer: [
            "Membantu laki-laki menjadi lebih terdidik",
            "Membuka usaha untuk membantu masyarakat",
            "Menentang tradisi pernikahan di usia muda",
          ],
        },
        {
          question: "Apa yang dapat kita teladani dari RA Kartini?",
          correct_answer:
            "Keberanian dan perjuangannya untuk pendidikan perempuan",
          incorrect_answer: [
            "Kebiasaannya membaca buku asing",
            "Cara hidupnya sebagai bangsawan",
            "Gaya penulisannya yang penuh kritik",
          ],
        },
      ],
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
