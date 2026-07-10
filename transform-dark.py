import os
import re

color_map = {
    r'bg-white': 'dark:bg-[#22201F]',
    r'bg-\[\#F6F2EA\]': 'dark:bg-[#1A1817]',
    r'bg-\[\#F5F5F7\]': 'dark:bg-[#151413]',
    r'bg-\[\#F7F3EC\]': 'dark:bg-[#1A1817]',
    r'bg-\[\#FBF7F0\]': 'dark:bg-[#2A2725]',
    r'bg-\[\#EAE1D2\]': 'dark:bg-[#383330]',
    r'bg-\[\#E3D8C5\]': 'dark:bg-[#4A433E]',
    r'bg-\[\#F4E7E5\]': 'dark:bg-[#380A14]',
    r'bg-\[\#F7EFD9\]': 'dark:bg-[#362A0D]',
    r'text-\[\#22201F\]': 'dark:text-[#F6F2EA]',
    r'text-\[\#4A443E\]': 'dark:text-[#C7BCAD]',
    r'text-\[\#5A534B\]': 'dark:text-[#A89F91]',
    r'text-\[\#8A7E6F\]': 'dark:text-[#A89F91]',
    r'text-\[\#B3A996\]': 'dark:text-[#7A6F62]',
    r'text-\[\#4A0E1B\]': 'dark:text-[#F4E7E5]',
    r'text-\[\#8A6A16\]': 'dark:text-[#E8CD82]',
    r'text-\[\#C0A98B\]': 'dark:text-[#A89F91]',
    r'border-\[\#EAE1D2\]': 'dark:border-[#383330]',
    r'border-\[\#F2ECDF\]': 'dark:border-[#2A2725]',
    r'border-\[\#EFE7D8\]': 'dark:border-[#332E2C]',
    r'border-\[\#E3D8C5\]': 'dark:border-[#4A433E]',
    r'hover:bg-\[\#FBF7F0\]': 'dark:hover:bg-[#2A2725]',
    r'hover:bg-\[\#F6F2EA\]': 'dark:hover:bg-[#1A1817]',
    r'hover:bg-\[\#F7EFD9\]': 'dark:hover:bg-[#362A0D]',
    r'hover:bg-\[\#F4E7E5\]': 'dark:hover:bg-[#380A14]',
    r'group-hover:bg-\[\#F7EFD9\]': 'dark:group-hover:bg-[#362A0D]',
    r'group-hover:bg-\[\#4A0E1B\]': 'dark:group-hover:bg-[#5C1122]',
    r'hover:text-\[\#4A0E1B\]': 'dark:hover:text-[#F4E7E5]',
    r'group-hover:text-\[\#4A0E1B\]': 'dark:group-hover:text-[#F4E7E5]',
    r'group-hover:text-\[\#8A6A16\]': 'dark:group-hover:text-[#E8CD82]',
}

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    for pattern, replacement in color_map.items():
        # Match the pattern, ensuring it's not already followed by the replacement
        # We use a negative lookahead to prevent duplicate insertions
        # The replacement string might have brackets, so we escape it for the lookahead
        escaped_replacement = re.escape(replacement)
        regex = re.compile(f"{pattern}(?!\\s+{escaped_replacement})")
        
        # Replace matches with "match_string replacement_string"
        # We need to use a function to preserve the exact matched string (e.g. bg-white)
        content = regex.sub(lambda m: f"{m.group(0)} {replacement}", content)

    if original != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, dirs, files in os.walk('./src'):
    for file in files:
        if file.endswith('.tsx') and 'original' not in root and 'AppOriginal' not in file:
            process_file(os.path.join(root, file))
