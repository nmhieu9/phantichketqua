document.getElementById('data-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn chặn gửi biểu mẫu

    // Lấy giá trị từ biểu mẫu
    const valuesInput = document.getElementById('values').value;
    const values = valuesInput.split(/\s+/).map(Number).filter(v => !isNaN(v) && v >= 3 && v <= 18);

    if (values.length === 0) {
        alert("Vui lòng nhập ít nhất một giá trị hợp lệ.");
        return;
    }

    // Phân tích dữ liệu
    const result = analyzeAndPredict(values);

    // Cập nhật giao diện
    updateResults(result);
});

function classifyValue(value) {
    if (3 <= value && value <= 10) return 'trắng';
    if (11 <= value && value <= 18) return 'đen';
    return 'không xác định'; // Giá trị ngoài phạm vi
}

function analyzeAndPredict(values) {
    // Phân loại dữ liệu theo màu
    const data = values.map(classifyValue);

    // Đếm số lần xuất hiện của từng loại màu
    const counts = data.reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
    }, {});

    // Tính xác suất xuất hiện của mỗi loại màu
    const total = values.length;
    const probabilities = Object.keys(counts).reduce((acc, color) => {
        acc[color] = counts[color] / total;
        return acc;
    }, {});

    // Dự đoán kết quả tiếp theo dựa trên xác suất
    const colors = Object.keys(probabilities);
    const nextResult = colors[Math.floor(Math.random() * colors.length)];

    // Tạo đồ thị phân phối xác suất
    const chart = generateChart(probabilities);

    return { counts, probabilities, nextResult, chart };
}

function generateChart(probabilities) {
    // Tạo đồ thị phân phối xác suất bằng Canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const labels = Object.keys(probabilities);
    const data = Object.values(probabilities);

    canvas.width = 600;
    canvas.height = 400;

    // Vẽ đồ thị
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    const barWidth = canvas.width / labels.length;
    const maxHeight = canvas.height - 20;

    data.forEach((prob, index) => {
        const barHeight = prob * maxHeight;
        const x = index * barWidth;
        const y = canvas.height - barHeight;

        ctx.fillStyle = labels[index] === 'đen' ? '#000' : '#fff';
        ctx.fillRect(x, y, barWidth - 5, barHeight);
        ctx.strokeRect(x, y, barWidth - 5, barHeight);
    });

    // Trả về ảnh dưới dạng base64
    return canvas.toDataURL('image/png');
}

function updateResults({ counts, probabilities, nextResult, chart }) {
    // Hiển thị số lượng kết quả
    const countsList = document.getElementById('counts');
    countsList.innerHTML = '';
    for (const [color, count] of Object.entries(counts)) {
        countsList.innerHTML += `<li>${color}: ${count}</li>`;
    }

    // Hiển thị xác suất xuất hiện
    const probabilitiesList = document.getElementById('probabilities');
    probabilitiesList.innerHTML = '';
    for (const [color, prob] of Object.entries(probabilities)) {
        probabilitiesList.innerHTML += `<li>${color}: ${(prob * 100).toFixed(2)}%</li>`;
    }

    // Hiển thị kết quả dự đoán tiếp theo
    document.getElementById('next-result').textContent = nextResult;

    // Hiển thị đồ thị phân phối xác suất
    const chartImage = document.getElementById('chart');
    chartImage.src = chart;

    // Hiển thị phần kết quả
    document.getElementById('results').style.display = 'block';
}
