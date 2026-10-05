/* =========================================================
   GRAND LINE MATRIX CALCULATOR
   VERSI TATA LETAK BARU
   - Determinan
   - Transpose
   - Invers
   - Gauss-Jordan
   - Langkah pengerjaan rapi
   ========================================================= */

const EPS = 1e-10;


/* =========================================================
   MENU
========================================================= */

function bukaKalkulator() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("calculator").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function kembaliHome() {
    document.getElementById("calculator").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   FORMAT ANGKA
========================================================= */

function fmt(n) {
    if (Math.abs(n) < EPS) {
        return "0";
    }

    if (Math.abs(n - Math.round(n)) < EPS) {
        return String(Math.round(n));
    }

    return Number(n.toFixed(6)).toString();
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   MEMBUAT MATRIKS INPUT
========================================================= */

function buatMatriks() {

    const ukuran = parseInt(
        document.getElementById("ukuran").value
    );

    const container = document.getElementById("inputMatriks");
    const menu = document.getElementById("menuOperasi");
    const hasil = document.getElementById("hasil");

    hasil.innerHTML = "";

    let html = `
        <div class="matrix-input-card">

            <div class="matrix-input-title">
                ⚓ Masukkan Elemen Matriks
            </div>

            <div class="matrix-input-subtitle">
                Matriks ${ukuran} × ${ukuran}
            </div>

            <div class="matrix-input-wrapper">
                <div class="matrix-bracket">
    `;

    for (let i = 0; i < ukuran; i++) {

        html += `<div class="matrix-input-row">`;

        for (let j = 0; j < ukuran; j++) {

            html += `
                <input
                    type="number"
                    step="any"
                    class="matrix-input"
                    id="m_${i}_${j}"
                    value="0"
                >
            `;
        }

        html += `</div>`;
    }

    html += `
                </div>
            </div>

            <button
                class="matrix-confirm-button"
                onclick="simpanMatriks()"
            >
                ✓ Gunakan Matriks
            </button>

        </div>
    `;

    container.innerHTML = html;

    menu.classList.add("hidden");

    setTimeout(() => {
        container.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);
}


/* =========================================================
   AKTIFKAN MENU OPERASI
========================================================= */

function simpanMatriks() {

    const A = ambilMatriks();

    if (!A) {
        return;
    }

    const menu = document.getElementById("menuOperasi");

    menu.classList.remove("hidden");

    document.getElementById("hasil").innerHTML = `
        <div class="ready-message">
            ✓ Matriks berhasil disimpan.<br>
            Silakan pilih operasi yang ingin dihitung.
        </div>
    `;

    setTimeout(() => {
        menu.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }, 100);
}


/* =========================================================
   AMBIL MATRIKS
========================================================= */

function ambilMatriks() {

    const ukuranElement = document.getElementById("ukuran");

    if (!ukuranElement) {
        return null;
    }

    const n = parseInt(ukuranElement.value);

    const A = [];

    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {

            const input = document.getElementById(`m_${i}_${j}`);

            if (!input) {
                alert("Matriks belum dibuat.");
                return null;
            }

            const value = parseFloat(input.value);

            if (!Number.isFinite(value)) {
                alert(
                    `Nilai pada baris ${i + 1}, kolom ${j + 1} belum valid.`
                );

                input.focus();
                return null;
            }

            row.push(value);
        }

        A.push(row);
    }

    return A;
}


/* =========================================================
   RENDER MATRIKS
========================================================= */

function matrixHTML(A, augmented = false) {

    let html = `
        <div class="beautiful-matrix">
            <div class="matrix-left-bracket">
                <table>
    `;

    for (let i = 0; i < A.length; i++) {

        html += `<tr>`;

        for (let j = 0; j < A[i].length; j++) {

            const divider =
                augmented && j === A[i].length / 2
                    ? " matrix-divider"
                    : "";

            html += `
                <td class="${divider}">
                    ${fmt(A[i][j])}
                </td>
            `;
        }

        html += `</tr>`;
    }

    html += `
                </table>
            </div>
        </div>
    `;

    return html;
}


/* =========================================================
   HASIL UTAMA
========================================================= */

function tampilkanHasil(html) {

    const hasil = document.getElementById("hasil");

    hasil.innerHTML = `
        <div class="new-result-card">
            ${html}
        </div>
    `;

    setTimeout(() => {
        hasil.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}


/* =========================================================
   BAGIAN / SECTION
========================================================= */

function section(title, content) {

    return `
        <div class="work-section">

            <div class="work-section-title">
                ${title}
            </div>

            <div class="work-section-content">
                ${content}
            </div>

        </div>
    `;
}


/* =========================================================
   DETERMINAN
========================================================= */

function determinan() {

    const A = ambilMatriks();

    if (!A) return;

    const n = A.length;

    let det;
    let isi = "";

    isi += `
        <div class="result-main-title">
            ⚓ Hasil Determinan
        </div>

        <div class="result-answer">
            det(A) = <strong>${fmt(determinantValue(A))}</strong>
        </div>
    `;


    /* ================= MATRIKS AWAL ================= */

    isi += section(
        "📚 Langkah 1 — Tulis Matriks Awal",
        `
            <p class="explanation">
                Matriks yang digunakan adalah:
            </p>

            ${matrixHTML(A)}
        `
    );


    /* ================= 2 x 2 ================= */

    if (n === 2) {

        const a = A[0][0];
        const b = A[0][1];
        const c = A[1][0];
        const d = A[1][1];

        det = (a * d) - (b * c);

        isi += section(
            "📐 Langkah 2 — Gunakan Rumus Determinan",
            `
                <div class="formula-box">
                    det(A) = (a × d) − (b × c)
                </div>
            `
        );


        isi += section(
            "🔢 Langkah 3 — Masukkan Nilai",
            `
                <div class="calculation-box">
                    det(A) = (${fmt(a)} × ${fmt(d)})
                    − (${fmt(b)} × ${fmt(c)})
                </div>
            `
        );


        isi += section(
            "🧮 Langkah 4 — Hitung",
            `
                <div class="calculation-box">
                    det(A) = ${fmt(a * d)}
                    − ${fmt(b * c)}
                    <br><br>
                    det(A) = ${fmt(det)}
                </div>
            `
        );

    }


    /* ================= 3 x 3 ================= */

    else if (n === 3) {

        const a = A[0][0];
        const b = A[0][1];
        const c = A[0][2];

        const d = A[1][0];
        const e = A[1][1];
        const f = A[1][2];

        const g = A[2][0];
        const h = A[2][1];
        const i = A[2][2];

        const bagian1 = a * (e * i - f * h);
        const bagian2 = b * (d * i - f * g);
        const bagian3 = c * (d * h - e * g);

        det = bagian1 - bagian2 + bagian3;


        isi += section(
            "📐 Langkah 2 — Gunakan Rumus Determinan",
            `
                <div class="formula-box">
                    det(A) =
                    a(ei − fh) − b(di − fg) + c(dh − eg)
                </div>
            `
        );


        isi += section(
            "🔢 Langkah 3 — Masukkan Nilai",
            `
                <div class="calculation-box">
                    det(A) =
                    ${fmt(a)}(${fmt(e)}×${fmt(i)}
                    − ${fmt(f)}×${fmt(h)})
                    <br>
                    − ${fmt(b)}(${fmt(d)}×${fmt(i)}
                    − ${fmt(f)}×${fmt(g)})
                    <br>
                    + ${fmt(c)}(${fmt(d)}×${fmt(h)}
                    − ${fmt(e)}×${fmt(g)})
                </div>
            `
        );


        isi += section(
            "🧮 Langkah 4 — Hitung",
            `
                <div class="calculation-box">
                    ${fmt(a)}(${fmt(e*i)} − ${fmt(f*h)})
                    − ${fmt(b)}(${fmt(d*i)} − ${fmt(f*g)})
                    + ${fmt(c)}(${fmt(d*h)} − ${fmt(e*g)})
                    <br><br>

                    = ${fmt(bagian1)}
                    − ${fmt(bagian2)}
                    + ${fmt(bagian3)}

                    <br><br>

                    <strong>
                        det(A) = ${fmt(det)}
                    </strong>
                </div>
            `
        );
    }


    /* ================= JAWABAN ================= */

    isi += `
        <div class="final-answer-box">

            <div class="final-answer-title">
                ✅ Jawaban Akhir
            </div>

            <div class="final-answer-value">
                det(A) = ${fmt(det)}
            </div>

            <p>
                Jadi, nilai determinan matriks A adalah
                <strong>${fmt(det)}</strong>.
            </p>

        </div>
    `;

    tampilkanHasil(isi);
}


/* =========================================================
   TRANSPOSE
========================================================= */

function transpose() {

    const A = ambilMatriks();

    if (!A) return;

    const n = A.length;

    const T = [];

    for (let i = 0; i < n; i++) {

        T[i] = [];

        for (let j = 0; j < n; j++) {
            T[i][j] = A[j][i];
        }
    }


    let isi = `
        <div class="result-main-title">
            ⚓ Hasil Transpose
        </div>

        <div class="result-answer">
            Matriks A<sup>T</sup>
        </div>
    `;


    isi += section(
        "📚 Langkah 1 — Tulis Matriks Awal",
        `
            ${matrixHTML(A)}

            <p class="explanation">
                Transpose dilakukan dengan menukar posisi
                baris menjadi kolom.
            </p>
        `
    );


    let mapping = "";

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            mapping += `
                a<sup>T</sup><sub>${i + 1}${j + 1}</sub>
                =
                a<sub>${j + 1}${i + 1}</sub>
                =
                ${fmt(T[i][j])}
                <br>
            `;
        }
    }


    isi += section(
        "🔄 Langkah 2 — Tukar Baris Menjadi Kolom",
        `
            <div class="mapping-box">
                ${mapping}
            </div>
        `
    );


    isi += section(
        "📋 Langkah 3 — Susun Matriks Transpose",
        `
            ${matrixHTML(T)}
        `
    );


    isi += `
        <div class="final-answer-box">

            <div class="final-answer-title">
                ✅ Jawaban Akhir
            </div>

            ${matrixHTML(T)}

            <p>
                Matriks transpose diperoleh dengan
                menukar baris menjadi kolom.
            </p>

        </div>
    `;

    tampilkanHasil(isi);
}


/* =========================================================
   INVERS
========================================================= */

function invers() {

    const A = ambilMatriks();

    if (!A) return;

    const det = determinantValue(A);


    let isi = `
        <div class="result-main-title">
            ⚓ Hasil Invers
        </div>
    `;


    if (Math.abs(det) < EPS) {

        isi += `
            <div class="error-box">
                ❌ Matriks tidak mempunyai invers.
                <br><br>
                Karena:
                <strong>det(A) = 0</strong>
            </div>
        `;

        tampilkanHasil(isi);
        return;
    }


    isi += section(
        "📚 Langkah 1 — Hitung Determinan",
        `
            <div class="calculation-box">
                det(A) = ${fmt(det)}
            </div>

            <p class="explanation">
                Karena det(A) ≠ 0, maka matriks A
                mempunyai invers.
            </p>
        `
    );


    const n = A.length;

    const augmented = [];

    for (let i = 0; i < n; i++) {

        const row = [];

        for (let j = 0; j < n; j++) {
            row.push(A[i][j]);
        }

        for (let j = 0; j < n; j++) {
            row.push(i === j ? 1 : 0);
        }

        augmented.push(row);
    }


    isi += section(
        "📋 Langkah 2 — Bentuk Matriks Augmented [A | I]",
        `
            <p class="explanation">
                Gabungkan matriks A dengan matriks identitas I.
            </p>

            ${matrixHTML(augmented, true)}
        `
    );


    const hasilJordan = gaussJordanCore(augmented);


    hasilJordan.steps.forEach((step, index) => {

        isi += section(
            `🧮 Langkah ${index + 3} — ${escapeHTML(step.operation)}`,
            `
                ${matrixHTML(step.matrix, true)}
            `
        );
    });


    const inverse = [];

    for (let i = 0; i < n; i++) {

        inverse[i] = [];

        for (let j = 0; j < n; j++) {
            inverse[i][j] = hasilJordan.matrix[i][j + n];
        }
    }


    isi += `
        <div class="final-answer-box">

            <div class="final-answer-title">
                ✅ Jawaban Akhir — A<sup>−1</sup>
            </div>

            ${matrixHTML(inverse)}

            <p>
                Jadi, matriks invers A adalah matriks
                di sebelah kanan setelah proses Gauss-Jordan selesai.
            </p>

        </div>
    `;

    tampilkanHasil(isi);
}


/* =========================================================
   GAUSS-JORDAN
========================================================= */

function gaussJordan() {

    const A = ambilMatriks();

    if (!A) return;


    let isi = `
        <div class="result-main-title">
            ⚓ Hasil Gauss-Jordan
        </div>

        <div class="result-answer">
            Bentuk Eselon Baris Tereduksi
            (RREF)
        </div>
    `;


    isi += section(
        "📚 Langkah 1 — Tulis Matriks Awal",
        `
            <p class="explanation">
                Tujuan metode Gauss-Jordan adalah
                mengubah matriks menjadi
                <strong>Reduced Row Echelon Form (RREF)</strong>.
            </p>

            ${matrixHTML(A)}
        `
    );


    const hasilJordan = gaussJordanCore(A);


    hasilJordan.steps.forEach((step, index) => {

        isi += section(
            `🧮 Langkah ${index + 2} — ${escapeHTML(step.operation)}`,
            `
                ${matrixHTML(step.matrix)}
            `
        );
    });


    isi += `
        <div class="final-answer-box">

            <div class="final-answer-title">
                ✅ Hasil RREF
            </div>

            ${matrixHTML(hasilJordan.matrix)}

            <div class="rank-result">
                Rank(A) = <strong>${hasilJordan.rank}</strong>
            </div>

        </div>
    `;


    tampilkanHasil(isi);
}


/* =========================================================
   GAUSS-JORDAN CORE
========================================================= */

function gaussJordanCore(input) {

    const M = input.map(row => row.slice());

    const rows = M.length;
    const cols = M[0].length;

    const steps = [];

    let pivotRow = 0;
    let rank = 0;


    for (let col = 0; col < cols && pivotRow < rows; col++) {

        let bestRow = pivotRow;

        for (let r = pivotRow + 1; r < rows; r++) {

            if (
                Math.abs(M[r][col]) >
                Math.abs(M[bestRow][col])
            ) {
                bestRow = r;
            }
        }


        if (Math.abs(M[bestRow][col]) < EPS) {
            continue;
        }


        /* ================= SWAP ================= */

        if (bestRow !== pivotRow) {

            const temp = M[pivotRow];

            M[pivotRow] = M[bestRow];
            M[bestRow] = temp;

            cleanMatrix(M);

            steps.push({
                operation:
                    `Tukar baris R${pivotRow + 1} ↔ R${bestRow + 1}`,
                matrix: cloneMatrix(M)
            });
        }


        /* ================= NORMALISASI ================= */

        const pivot = M[pivotRow][col];

        if (Math.abs(pivot - 1) > EPS) {

            for (let j = 0; j < cols; j++) {
                M[pivotRow][j] /= pivot;
            }

            cleanMatrix(M);

            steps.push({
                operation:
                    `Normalisasi: R${pivotRow + 1} → R${pivotRow + 1} ÷ ${fmt(pivot)}`,
                matrix: cloneMatrix(M)
            });
        }


        /* ================= ELIMINASI ================= */

        for (let r = 0; r < rows; r++) {

            if (r === pivotRow) {
                continue;
            }

            const factor = M[r][col];

            if (Math.abs(factor) < EPS) {
                continue;
            }


            for (let j = 0; j < cols; j++) {

                M[r][j] -=
                    factor * M[pivotRow][j];
            }


            cleanMatrix(M);


            let operation;

            if (factor >= 0) {

                operation =
                    `Eliminasi: R${r + 1} → R${r + 1} − ${fmt(factor)}R${pivotRow + 1}`;

            } else {

                operation =
                    `Eliminasi: R${r + 1} → R${r + 1} + ${fmt(Math.abs(factor))}R${pivotRow + 1}`;
            }


            steps.push({
                operation,
                matrix: cloneMatrix(M)
            });
        }


        pivotRow++;
        rank++;
    }


    cleanMatrix(M);


    return {
        matrix: M,
        steps: steps,
        rank: rank
    };
}


/* =========================================================
   DETERMINAN
========================================================= */

function determinantValue(A) {

    const n = A.length;


    if (n === 1) {
        return A[0][0];
    }


    if (n === 2) {

        return (
            A[0][0] * A[1][1]
            -
            A[0][1] * A[1][0]
        );
    }


     if (n === 3) {

        return (
            A[0][0] *
            (
                A[1][1] * A[2][2]
                -
                A[1][2] * A[2][1]
            )
            -
            A[0][1] *
            (
                A[1][0] * A[2][2]
                -
                A[1][2] * A[2][0]
            )
            +
            A[0][2] *
            (
                A[1][0] * A[2][1]
                -
                A[1][1] * A[2][0]
            )
        );
    }


    return determinantRecursive(A);
}


/* =========================================================
   DETERMINAN REKURSIF
========================================================= */

function determinantRecursive(A) {

    const n = A.length;

    if (n === 1) {
        return A[0][0];
    }

    if (n === 2) {
        return (
            A[0][0] * A[1][1]
            -
            A[0][1] * A[1][0]
        );
    }

    let det = 0;

    for (let col = 0; col < n; col++) {

        const minor = [];

        for (let i = 1; i < n; i++) {

            const row = [];

            for (let j = 0; j < n; j++) {

                if (j !== col) {
                    row.push(A[i][j]);
                }
            }

            minor.push(row);
        }


        const sign =
            col % 2 === 0
                ? 1
                : -1;

        det +=
            sign *
            A[0][col] *
            determinantRecursive(minor);
    }

    return det;
}


/* =========================================================
   UTILITAS
========================================================= */

function cloneMatrix(A) {
    return A.map(row => row.slice());
}


function cleanMatrix(A) {

    for (let i = 0; i < A.length; i++) {

        for (let j = 0; j < A[i].length; j++) {

            if (Math.abs(A[i][j]) < EPS) {
                A[i][j] = 0;
            }
        }
    }
}