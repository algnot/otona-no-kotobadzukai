## 📙 `otona-no-kotobadzukai` project guide

### 🔥 Background
Project backend ของ `ตก(ต้นก้า)` กับ `กฟ(กังฟู)` เนื่องจากช่วงนี้เศรษฐกิจตกต่ำ แต่เกมที่เล่นกลับสนุกมาก ทำให้ไม่สามารถหยุดยั้งการเติมเกิมได้
จนเกิดเป็นที่มาของ project ที่บันทึกรายรับ-รายจ่าย เพื่อจะประหยัดเงินกันแบบสุด ๆ เพราะไม่มีตังจะใช้กันแล้ว ส่วนที่มาของชื่อ project `otona-no-kotobadzukai` ในภาษาญี่ปุ่นแปลว่า `คำพูดของผู้ใหญ่` ภาระที่ยิ่งใหญ่มาพร้อมกับเงินที่เหลือน้อยลง

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
    1: 📄 brew install nvm
    2: 📄 export NVM_DIR="$HOME/.nvm"
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  
```
- Install node
```bash
    1: 📄 nvm install v18.16.1
    2: 📄 nvm alias default 18.16.1
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
