
const newQuoteButton = document.querySelector(".btn-new-quote");
const copyButton = document.querySelector(".btn-copy");
const twitterButton = document.querySelector(".btn-twitter");
const exportButton = document.querySelector(".btn-export");
const quoteText = document.querySelector(".quote-text");
const authorText = document.querySelector(".author");
const quoteContainer = document.querySelector(".quote-container");
const screenshotBorder = document.querySelector(".quote-content");

// Loading state management
function setLoadingState(isLoading) {
    const buttons = document.querySelectorAll('.btn');
    if (isLoading) {
        newQuoteButton.querySelector('i').classList.add('fa-spin');
        buttons.forEach(btn => btn.disabled = true);
    } else {
        newQuoteButton.querySelector('i').classList.remove('fa-spin');
        buttons.forEach(btn => btn.disabled = false);
    }
}
// random bgg genratorrr
function generateRandomColor(){
    const r = Math.floor(Math.random() * 128);  
    const g = Math.floor(Math.random() * 128); 
    const b = Math.floor(Math.random() * 128); 
    return `rgb(${r}, ${g}, ${b})`;
}

// Fetch random quote
async function randomQuotesGenerator() {
    try {
        const response = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random");
        if (!response.ok) {
            throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        if (!data.success || !data.data) {
            throw new Error('Invalid quote data received');
        }
        return data;
    } catch (error) {
        console.error('Error fetching quote:', error);
        throw error;
    }
}

// Update quote content
function updateQuoteContent(content, author) {
    quoteText.textContent = content || "Failed to load quote";
    authorText.textContent = author ? `- ${author}` : "- Unknown";
}

// Show notification
function showNotification(message, duration = 2000) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// Event Listeners
newQuoteButton.addEventListener("click", async () => {
    setLoadingState(true);
    try {
        const quote = await randomQuotesGenerator();
        updateQuoteContent(quote.data.content, quote.data.author);
    } catch (error) {
        updateQuoteContent("Failed to load quote. Please try again.", "Error");
        showNotification("Failed to load quote. Please try again.");
    } finally {
        setLoadingState(false);
    }
});

copyButton.addEventListener("click", async () => {
    const textToCopy = `${quoteText.textContent}\n${authorText.textContent}`;

    try {
        await navigator.clipboard.writeText(textToCopy);
        quoteText.style.backgroundColor="rgba(255,255,255,0.1)";
        showNotification("Quote copied to clipboard!");
    } catch (error) {
        showNotification("Failed to copy quote. Please try again.");
    }
});

twitterButton.addEventListener("click", () => {
    const tweetText = encodeURIComponent(`${quoteText.textContent}\n${authorText.textContent}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
});

exportButton.addEventListener("click", () => {


    html2canvas(screenshotBorder, {
        backgroundColor: "#2d2d2d",
        color: "#fff",
        scale: 2,
    }).then((canvas) => {
        const base64image = canvas.toDataURL("image/png");
        window.location.href = base64image;
        const link = document.createElement("a");
        link.href = base64image;
        link.download = "styled_screenshot.png";
        link.click();
    }).catch(err => console.log(err)
    );
});



document.addEventListener("DOMContentLoaded", () => {
    newQuoteButton.click();
});

setInterval(()=>{

    document.body.style.backgroundColor=generateRandomColor();
},3000)





