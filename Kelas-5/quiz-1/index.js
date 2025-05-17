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
          question: "Mengapa hutan tropis disebut sebagai paru-paru dunia?",
          correct_answer:
            "Karena menghasilkan oksigen dan menyerap karbon dioksida",
          incorrect_answer: [
            "Karena luasnya setara dengan paru-paru manusia",
            "Karena merupakan tempat hidup berbagai binatang besar",
            "Karena selalu hijau sepanjang tahun",
          ],
        },
        {
          question: "Apa ancaman terbesar bagi hutan tropis saat ini?",
          correct_answer: "Deforestasi dan kebakaran hutan",
          incorrect_answer: [
            "Aktivitas gunung berapi",
            "Pencemaran udara",
            "Cuaca ekstrem",
          ],
        },
        {
          question:
            "Apa dampak utama dari kerusakan hutan tropis terhadap iklim global?",
          correct_answer: "Pemanasan global meningkat",
          incorrect_answer: [
            "Terjadinya hujan deras",
            "Bertambahnya lahan pertanian",
            "Berkurangnya spesies burung",
          ],
        },
        {
          question: "Apa yang dimaksud dengan reboisasi?",
          correct_answer: "Menanam kembali pohon di hutan yang rusak",
          incorrect_answer: [
            "Membuka lahan baru untuk pertanian",
            "Membakar hutan yang sudah tua",
            "Memindahkan pohon dari satu tempat ke tempat lain",
          ],
        },
        {
          question:
            "Bagaimana masyarakat dapat membantu melindungi hutan tropis?",
          correct_answer:
            "Mengurangi penggunaan produk berbasis minyak kelapa sawit tidak berkelanjutan",
          incorrect_answer: [
            "Membeli produk kayu ilegal",
            "Membuka lahan baru untuk pertanian",
            "Membiarkan hutan terbengkalai",
          ],
        },
        {
          question:
            "Apa yang terjadi pada spesies hewan jika hutan tropis rusak?",
          correct_answer: "Mereka kehilangan habitatnya dan terancam punah",
          incorrect_answer: [
            "Populasi mereka meningkat",
            "Mereka berpindah ke daerah perkotaan",
            "Mereka menjadi lebih ganas",
          ],
        },
        {
          question: "Mengapa pendidikan penting untuk melindungi hutan tropis?",
          correct_answer:
            "Untuk meningkatkan kesadaran akan pentingnya kelestarian hutan",
          incorrect_answer: [
            "Agar masyarakat mengetahui cara menebang hutan dengan benar",
            "Supaya anak-anak lebih sering bermain di hutan",
            "Agar perusahaan dapat lebih mudah mendapatkan izin menebang hutan",
          ],
        },
        {
          question:
            "Apa yang dimaksud dengan minyak kelapa sawit berkelanjutan?",
          correct_answer: "Minyak yang diproduksi tanpa merusak hutan",
          incorrect_answer: [
            "Minyak yang dihasilkan dari hutan yang dibuka secara masif",
            "Minyak yang digunakan untuk berbagai kebutuhan industri",
            "Minyak yang tidak digunakan masyarakat adat",
          ],
        },
        {
          question:
            "Apa yang dapat dilakukan untuk mengurangi emisi karbon dioksida akibat deforestasi?",
          correct_answer: "Menanam lebih banyak pohon",
          incorrect_answer: [
            "Mengganti hutan dengan lahan pertanian",
            "Membangun lebih banyak pabrik",
            "Membakar sisa hutan yang tidak terpakai",
          ],
        },
        {
          question:
            "Mengapa kelestarian hutan tropis penting bagi umat manusia?",
          correct_answer:
            "Karena menghasilkan oksigen dan menyerap karbon dioksida",
          incorrect_answer: [
            "Karena menjadi tempat rekreasi yang indah",
            "Karena menjadi sumber utama makanan",
            "Karena hanya berfungsi untuk hewan tertentu",
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
