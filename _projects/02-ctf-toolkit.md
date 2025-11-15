---
layout: project
title: CTF Toolkit
description: A comprehensive collection of tools and scripts for Capture The Flag competitions, including cryptography solvers, steganography tools, and exploitation utilities.
technologies:
  - Python
  - Bash
  - Go
  - Docker
icon: toolbox
github_url: https://github.com/your-username/ctf-toolkit
demo_url:
---

## Overview

CTF Toolkit is a curated collection of tools, scripts, and utilities designed to streamline participation in Capture The Flag competitions. It includes automated solvers, exploit templates, and helpers for common CTF challenges.

## Features

### Cryptography Tools
- **Classical Ciphers**: Caesar, Vigenère, Substitution cipher solvers
- **Modern Crypto**: RSA attacks (small e, Wiener's attack, etc.)
- **Hash Cracking**: Rainbow tables, dictionary attacks
- **Encoding Utilities**: Base64, ROT13, Hex, Binary converters

### Binary Exploitation
- **Buffer Overflow Templates**: Pre-built exploit skeletons
- **ROP Chain Generators**: Automated ROP gadget finding
- **Shellcode Library**: Common shellcode payloads
- **Format String Exploits**: Automated exploitation tools

### Web Exploitation
- **SQL Injection**: Automated SQLi detection and exploitation
- **XSS Payloads**: Collection of XSS bypass techniques
- **SSRF Tools**: Server-side request forgery utilities
- **Directory Bruteforcing**: Custom wordlists and tools

### Steganography
- **Image Analysis**: LSB extraction, metadata analysis
- **Audio Steganography**: Spectral analysis, hidden data detection
- **File Carving**: Extract hidden files from images

### Forensics
- **Memory Analysis**: Volatility automation scripts
- **Network Forensics**: PCAP analysis and packet extraction
- **Disk Forensics**: File recovery and analysis tools

## Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/ctf-toolkit
cd ctf-toolkit

# Docker setup (recommended)
docker build -t ctf-toolkit .
docker run -it -v $(pwd):/workspace ctf-toolkit

# Or install locally
./install.sh
```

## Usage Examples

### Crypto Challenge
```python
from ctf_toolkit.crypto import VigenereCipher

cipher = VigenereCipher()
plaintext = cipher.break_cipher(ciphertext)
print(f"Flag: {plaintext}")
```

### Binary Exploitation
```python
from ctf_toolkit.pwn import BufferOverflow

exploit = BufferOverflow(
    target='vulnerable_binary',
    offset=64,
    return_address=0xdeadbeef
)
exploit.generate()
```

### Web Challenge
```bash
# SQL injection automation
./tools/web/sqli_scanner.py -u "http://target.com/vuln.php?id=1"

# XSS payload testing
./tools/web/xss_tester.py -u "http://target.com/search" -p query
```

## Tools Included

### Scripts (50+)
- `crypto/rsa_attack.py` - Various RSA attack implementations
- `web/jwt_cracker.py` - JWT token manipulation and cracking
- `forensics/pcap_analyzer.py` - Automated PCAP analysis
- `pwn/rop_builder.py` - ROP chain construction
- `stego/lsb_extract.py` - LSB steganography extraction

### Wordlists
- Common passwords
- Directory/file names
- Usernames
- CTF-specific wordlists

### Cheat Sheets
- Linux privilege escalation
- Windows privilege escalation
- Web exploitation techniques
- Binary exploitation methods

## Competition Success

This toolkit has been used successfully in:
- 50+ CTF competitions
- Top 10 finishes in major CTFs
- Multiple first-blood captures

## Docker Environment

The Docker container includes:
- Python 3.11 with all dependencies
- GDB with pwndbg
- Radare2 and Ghidra
- Burp Suite Community Edition
- Volatility Framework
- All toolkit scripts and utilities

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add your tool/script with documentation
4. Submit a pull request

## Resources

- [CTF Time](https://ctftime.org/)
- [PicoCTF](https://picoctf.org/)
- [Hack The Box](https://hackthebox.eu/)

## License

MIT License - Free for educational and competition use
