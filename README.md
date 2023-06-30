## 📙 `otona-no-kotobadzukai` project guide

### 🔥 Background
Project backend ของ `ตก(ต้นก้า)` กับ `กฟ(กังฟู)` เนื่องจากช่วงนี้เศรษฐกิจตกต่ำ แต่เกมที่เล่น กลับสนุกเกินมากจนเกินไป ทำให้ไม่สามารถหยุดยั้งการเติมเกิมได้
จนเกิดเป็นที่มาของ project ที่บันทึกรายรับ-รายจ่าย เพื่อจะประหยัดเงินแบบสุด ๆ เพราะไม่มีตังจะใช้กันแล้ว ส่วนที่มาของชื่อ project `otona-no-kotobadzukai`
ในภาษาญี่ปุ่นแปลว่า `คำพูดของผู้ใหญ่` ภาระที่ยิ่งใหญ่มาพร้อมกับเงินที่เหลือน้อยลง

### 📍 Dependencies
- ✅ node v.18.16.1
- ✅ npm v.9.5.1
- ✅ postgresql@11

### 📁 Setup project
- Install postgresql
```bash
    1: 📄 brew install postgresql@11
    2: 📄 echo 'export PATH="/usr/local/opt/postgresql@11/bin:$PATH"' >> ~/.bash_profile
        echo 'export PATH="/usr/local/opt/postgresql@11/bin:$PATH"' >> ~/.zshrc
    3: 📄 brew services start postgresql@11
    4: 📄 brew services list
```
- Make sure ว่า postgresql เปิดอยู่
- สร้าง User postgresql ผ่าน pgAdmin ด้วย `username:root` และ `passwaord:root`
- Install nvm
```bash
    1: 📄 curl -sL https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh -o install_nvm.sh
    2: 📄 bash install_nvm.sh
    3: 📄 export NVM_DIR="$HOME/.nvm"
           [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
           [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" 
```
- Restart terminal
```bash
    1: 📄 source ~/.bash_profile
    2: 📄 command -v nvm
```
- Install node
```bash
    1: 📄 nvm install v.18.16.1
    2: 📄 nvm alias default 18.16.2
    3: 📄 nvm use
```
- Check node version
```bash
    1: 📄 node -v # v.18.16.1
    2: 📄 npm -v  # v.9.5.1
```
- Clone repo นี้แล้ว cd มาที่ project
- Install node dependencies
```bash
    1: 📄 npm install
```
- Migrete database
```bash
    1: 📄 npm run migrete
```
- Run project
```bash
    1: 📄 npm run dev
```
- 💡 เข้าไปที่ http://localhost:4000/ จะเจอกับข้อความ `Hello world`