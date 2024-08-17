// script.js
document.getElementById('card-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Danh sách tất cả các lá bài
    const suits = ['H', 'S', 'D', 'C']; // Hearts, Spades, Diamonds, Clubs  : cơ, bích, rô, chuồn
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    // Tạo bộ bài đầy đủ
    const allCards = [];
    for (const suit of suits) {
        for (const rank of ranks) {
            allCards.push(rank + suit);
        }
    }
    
    // Lấy dữ liệu từ form
    const cardsInput = document.getElementById('cards').value;
    const enteredCards = cardsInput.split(',').map(card => card.trim());
    
    // Tạo bộ bài còn lại sau khi loại bỏ các lá đã xuất hiện
    const remainingCards = allCards.filter(card => !enteredCards.includes(card));
    
    // Đảm bảo có ít nhất 6 lá bài còn lại để dự đoán
    if (remainingCards.length < 6) {
        document.getElementById('result').textContent = 'Không đủ lá bài còn lại để dự đoán.';
        return;
    }
    
    // Chọn ngẫu nhiên 6 lá bài tiếp theo từ bộ bài còn lại
    function getRandomCards(cards, num) {
        const shuffled = cards.slice().sort(() => 0.5 - Math.random());
        return shuffled.slice(0, num);
    }
    
    const predictedCards = getRandomCards(remainingCards, 6);
    
    // Hiển thị kết quả
    document.getElementById('result').textContent = `Dự đoán 6 lá bài tiếp theo: ${predictedCards.join(', ')}`;
});
