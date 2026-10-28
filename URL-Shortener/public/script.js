
const form = document.getElementById("shortenForm");
const urlInput = document.getElementById("originalUrl");
const message = document.getElementById("message");
const result = document.getElementById("result");
const shortUrl = document.getElementById("shortUrl");
const copyButton = document.getElementById("copyButton");
const openLink = document.getElementById("openLink");
const shortenButton = document.getElementById("shortenButton");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalUrl = urlInput.value.trim();

    message.textContent = "";
    result.hidden = true;
    shortenButton.disabled = true;
    shortenButton.textContent = "Shortening...";

    try {
        const response = await fetch("/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ originalUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || "Could not shorten URL.");
        }

        shortUrl.textContent = data.shortUrl;
        shortUrl.href = data.shortUrl;
        openLink.href = data.shortUrl;

        result.hidden = false;
        message.textContent = "URL shortened successfully!";
    } catch (error) {
        message.textContent = error.message || "Something went wrong.";
        console.error("Shortening error:", error);
    } finally {
        shortenButton.disabled = false;
        shortenButton.textContent = "Shorten URL";
    }
});

copyButton.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(shortUrl.href);
        message.textContent = "Short URL copied!";
    } catch (error) {
        message.textContent = "Copy failed. Please copy the short URL manually.";
    }
});
