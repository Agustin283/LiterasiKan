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
          "Manakah yang BUKAN termasuk dalam contoh pengaruh globalisasi terhadap budaya?",
        correct_answer: "Meningkatnya kesadaran akan kesetaraan gender",
        incorrect_answer: [
          "Masuknya budaya Korea (Hallyu) ke Indonesia",
          "Penggunaan media sosial untuk berbagi informasi",
          "Meningkatnya konsumsi makanan asing",
        ],
      },
      {
        question:
          'Apa yang dimaksud dengan "budaya digital" dalam konteks teks?',
        correct_answer: "Budaya yang hanya berkembang di dunia maya",
        incorrect_answer: [
          "Budaya yang memanfaatkan teknologi digital untuk komunikasi dan interaksi",
          "Budaya yang berfokus pada pengembangan teknologi digital",
          "Budaya yang tercipta akibat penggunaan internet",
        ],
      },
      {
        question:
          "Berdasarkan teks, apa yang dapat disimpulkan sebagai salah satu dampak positif dari media sosial?",
        correct_answer:
          "Memudahkan penyebaran informasi dan memperluas jejaring",
        incorrect_answer: [
          "Meningkatkan rasa toleransi dan saling menghormati",
          "Meningkatkan kesadaran akan pentingnya kesetaraan",
          "Mendorong masyarakat untuk berpartisipasi dalam gerakan sosial",
        ],
      },
      {
        question: "Apa yang menjadi pesan utama dari teks tersebut?",
        correct_answer:
          "Penting untuk menjaga keseimbangan antara kemajuan dan pelestarian nilai-nilai budaya",
        incorrect_answer: [
          "Masyarakat harus beradaptasi dengan perubahan sosial budaya di era modern",
          "Media sosial memiliki dampak positif dan negatif bagi masyarakat",
          "Globalisasi telah membawa banyak perubahan dalam kehidupan manusia",
        ],
      },
      {
        question:
          "Bagaimana peran platform digital dalam mendorong gerakan sosial seperti kampanye untuk hak-hak perempuan dan kesadaran lingkungan?",
        correct_answer:
          "Platform digital mempermudah akses informasi dan komunikasi, sehingga memperkuat gerakan sosial",
        incorrect_answer: [
          "Platform digital hanya berfungsi sebagai media penyebarluasan informasi",
          "Platform digital mendorong masyarakat untuk lebih kritis dan aktif dalam berpendapat",
          "Platform digital menciptakan ruang bagi masyarakat untuk saling bertukar pikiran dan ide",
        ],
      },
      {
        question:
          "Apa yang menjadi penyebab munculnya polarisasi sosial di tengah masyarakat?",
        correct_answer:
          "Perbedaan pandangan dan sudut pandang dalam isu-isu politik, agama,dan budaya",
        incorrect_answer: [
          "Kurangnya akses informasi dan pendidikan di tengah masyarakat",
          "Pengaruh media sosial yang cenderung menyebarkan informasi yang tidak akurat",
          "Kurangnya toleransi dan rasa saling menghormati antar kelompok masyarakat",
        ],
      },
      {
        question:
          "Menurut Anda, apakah penggunaan media sosial dapat menjadi solusi untuk mengatasi polarisasi sosial? Jelaskan alasan Anda.",
        correct_answer:
          "Tidak, karena media sosial justru dapat memperkuat polarisasi akibat penyebaran informasi yang tidak akurat",
        incorrect_answer: [
          "Ya, karena media sosial dapat menjadi wadah untuk berdiskusi dan saling memahami antarkelompok masyarakat",
          "Ya, karena media sosial dapat membantu menyebarkan pesan-pesan toleransi dan saling menghormati",
          "Tidak, karena media sosial tidak memiliki pengaruh signifikan terhadap pola pikir masyarakat",
        ],
      },
      {
        question:
          "Bagaimana cara yang efektif untuk menumbuhkan sikap toleran dan menghormati perbedaan di tengah masyarakat?",
        correct_answer:
          "Meningkatkan kesadaran masyarakat akan pentingnya toleransi dan saling menghormati melalui pendidikan",
        incorrect_answer: [
          "Melarang penyebaran informasi yang bersifat provokatif dan memecah belah",
          "Membatasi akses terhadap media sosial yang dianggap dapat memicu polarisasi",
          "Mengadakan kampanye dan kegiatan sosial yang mempromosikan toleransi dan persatuan",
        ],
      },
      {
        question:
          "Bagaimana Anda memandang peran teknologi dalam membentuk budaya dan perilaku masyarakat di era modern?",
        correct_answer:
          "Teknologi merupakan alat yang dpat digunakan untuk kbaikan maupun keburukan",
        incorrect_answer: [
          "Teknologi memiliki dampak negatif yang lebih besar dibandingkan dampak positifnya",
          "Teknologi merupakan faktor utama yang mendorong perubahan sosial budaya",
          "Teknologi hanya berperan sebagai media penyebarluasan informasi",
        ],
      },
      {
        question:
          "Apa yang dapat Anda lakukan untuk menjaga keseimbangan antara kemajuan dan pelestarian nilai-nilai budaya di tengah perubahan sosial budaya yang terjadi?",
        correct_answer:
          "Berusaha memahami dan menerima perubahan, namun tetap memegang teguh nilai-nilai luhur budaya",
        incorrect_answer: [
          "Menolak segala bentuk perubahan dan mempertahankan nilai-nilai tradisional",
          "Menyerap budaya asing tanpa filter dan meniru gaya hidup modern",
          "Mengabaikan perubahan sosial budaya dan fokus pada pengembangan teknologi",
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
      const paket = localStorage.getItem("paket") || "4"; // Default '1' jika null

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
