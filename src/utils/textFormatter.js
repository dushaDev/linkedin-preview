const BOLD_MAP = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲', '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

const ITALIC_MAP = {
  'A': '𝘈', 'B': '𝘉', 'C': '𝘊', 'D': '𝘋', 'E': '𝘌', 'F': '𝘍', 'G': '𝘎', 'H': '𝘏', 'I': '𝘐', 'J': '𝘑', 'K': '𝘒', 'L': '𝘓', 'M': '𝘔', 'N': '𝘕', 'O': '𝘖', 'P': '𝘗', 'Q': '𝘘', 'R': '𝘙', 'S': '𝘚', 'T': '𝘛', 'U': '𝘜', 'V': '𝘝', 'W': '𝘞', 'X': '𝘟', 'Y': '𝘠', 'Z': '𝘡',
  'a': '𝘢', 'b': '𝘣', 'c': '𝘤', 'd': '𝘥', 'e': '𝘦', 'f': '𝘧', 'g': '𝘨', 'h': '𝘩', 'i': '𝘪', 'j': '𝘫', 'k': '𝘬', 'l': '𝘭', 'm': '𝘮', 'n': '𝘯', 'o': '𝘰', 'p': '𝘱', 'q': '𝘲', 'r': '𝘳', 's': '𝘴', 't': '𝘵', 'u': '𝘶', 'v': '𝘷', 'w': '𝘸', 'x': '𝘹', 'y': '𝘺', 'z': '𝘇',
  '0': '0', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
};

const NUMBER_MAP = {
  '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣', '0': '0️⃣'
};

export const applyFormat = (text, format) => {
  if (!text) return text;
  
  let mapToUse;
  if (format === 'bold') mapToUse = BOLD_MAP;
  else if (format === 'italic') mapToUse = ITALIC_MAP;
  
  if (mapToUse) {
    return text.split('').map(char => mapToUse[char] || char).join('');
  }

  if (format === 'strikethrough') {
    // Unicode Combining Long Stroke Overlay
    return text.split('').map(char => char + '\u0336').join('');
  }

  if (format === 'underline') {
    // Unicode Combining Low Line
    return text.split('').map(char => char + '\u0332').join('');
  }

  return text;
};

export const toggleBullet = (text) => {
  const lines = text.split('\n');
  const hasBullets = lines.every(line => line.trim().startsWith('•') || line.trim() === '');
  
  if (hasBullets) {
    return lines.map(line => line.trim().startsWith('• ') ? line.replace('• ', '') : line.replace('•', '')).join('\n');
  } else {
    return lines.map(line => line.trim() ? `• ${line}` : line).join('\n');
  }
};

export const toggleNumbering = (text) => {
  const lines = text.split('\n');
  const hasNumbering = lines.every((line, i) => {
    const trimmed = line.trim();
    return trimmed === '' || /^\d+\./.test(trimmed) || /^[1-9]️⃣/.test(trimmed);
  });
  
  if (hasNumbering) {
    // Basic regex to remove leading numbers/emojis
    return lines.map(line => line.replace(/^(\d+\.|[1-9]️⃣)\s*/, '')).join('\n');
  } else {
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return line;
      // We'll use actual numbers for numbering, or the user can choose emojis.
      // Emojis are cooler for "stylish" posts.
      const num = (i + 1).toString();
      return `${num}. ${trimmed}`;
    }).join('\n');
  }
};
