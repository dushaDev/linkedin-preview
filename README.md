# LinkedInPreview | Post Formatter

**LinkedInPreview** is a sleek, browser-based tool designed to help professionals bypass LinkedIn’s text styling limitations. While the native LinkedIn editor doesn't support basic formatting, this tool uses specialized Unicode characters to allow for **bold**, *italics*, and other styles that remain visible when pasted into the actual platform.

## 🚀 Features

* **Rich Text Formatting**: Instantly apply bold, italic, underline, and strikethrough styles using Unicode symbols.
* **Live Mobile Preview**: View a pixel-perfect recreation of how your post appears on the LinkedIn mobile feed, including a "see more" truncation toggle.
* **Smart Lists & Emojis**: Toggle bullet points, numbered lists, and access an integrated emoji picker.
* **Profile Shuffling**: Test your post layout against different professional personas.
* **Character Counter**: Track your progress against LinkedIn’s 3,000-character limit with real-time warnings.
* **Auto-Save & Image Support**: Your content is saved locally in your browser, and you can upload a preview image to visualize the full post composition.

## 🛠️ Tech Stack

* **Framework**: Next.js (React)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Deployment**: Static Export for GitHub Pages

## 📦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/DushaDev/linkedin-preview.git](https://github.com/DushaDev/linkedin-preview.git)
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run the development server**:
    ```bash
    npm run dev
    ```
4.  **Build for Static Export**:
    ```bash
    npm run build
    ```

## 🌐 Deployment

This project is configured for **Static HTML Export**, making it compatible with GitHub Pages. Ensure your `next.config.mjs` has `output: 'export'` enabled before deploying.

---
Developed by [DushaDev](https://dushadev.github.io/).